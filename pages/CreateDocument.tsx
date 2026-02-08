
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { DocumentItem, DocumentStatus, DocumentType } from '../types';

const formatCurrency = (amount: number) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(amount);

const docTypeToLabel = (docType: string) => docType.replace(/([A-Z])/g, ' $1').trim();

const CreateDocument: React.FC = () => {
    const { docType } = useParams<{ docType: string }>();
    const navigate = useNavigate();

    // Ensure docType is a valid DocumentType enum key
    const currentDocType = Object.values(DocumentType).find(v => v === docType) || DocumentType.Fatura;

    const { clients, products, addDocument, getNextDocumentId } = useAppContext();
    

    const [clientId, setClientId] = useState<string>(clients[0]?.id || '');
    const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        return date.toISOString().split('T')[0];
    });
    const [items, setItems] = useState<Partial<DocumentItem>[]>([{ description: '', quantity: 1, price: 0 }]);
    
    const handleItemChange = (index: number, field: keyof Omit<DocumentItem, 'id'|'total'>, value: string | number) => {
        const newItems = [...items];
        const item = { ...newItems[index] };
        (item as any)[field] = value;
        newItems[index] = item;
        setItems(newItems);
    };
    
    const handleProductSelect = (index: number, productId: string) => {
        const newItems = [...items];
        const product = products.find(p => p.id === productId);
        if(product) {
            newItems[index] = { ...newItems[index], description: product.description, price: product.sellingPrice, quantity: newItems[index].quantity || 1 };
        } else {
             newItems[index] = { ...newItems[index], description: '', price: 0, };
        }
        setItems(newItems);
    }

    const addItem = () => setItems([...items, { description: '', quantity: 1, price: 0 }]);
    const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
    
    const calculateTotals = () => {
        const subtotal = items.reduce((sum, item) => sum + (item.quantity || 0) * (item.price || 0), 0);
        const vat = subtotal * 0.14;
        const total = subtotal + vat;
        return { subtotal, vat, total };
    };
    
    const { subtotal, vat, total } = calculateTotals();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const client = clients.find(c => c.id === clientId);
        if (!client) {
            alert("Por favor, selecione um cliente.");
            return;
        }

        const finalItems = items.map((item, index) => ({
            id: `item-${Date.now()}-${index}`,
            description: item.description || '',
            quantity: Number(item.quantity) || 0,
            price: Number(item.price) || 0,
            total: (Number(item.quantity) || 0) * (Number(item.price) || 0),
        })).filter(item => item.description && item.quantity > 0 && item.price >= 0);
        
        if (finalItems.length === 0) {
            alert("Adicione pelo menos um item válido.");
            return;
        }
        
        const isPaidOnCreation = [DocumentType.FaturaRecibo, DocumentType.Recibo].includes(currentDocType);

        const newDocumentData = {
            documentType: currentDocType,
            client,
            issueDate,
            dueDate,
            items: finalItems,
            subtotal,
            vat,
            total,
            status: isPaidOnCreation ? DocumentStatus.Paga : DocumentStatus.Pendente,
            paymentDetails: isPaidOnCreation ? { method: 'N/A', confirmationDate: issueDate } : undefined
        };
        
        const newDocument = addDocument(newDocumentData);
        navigate(`/documents/${encodeURIComponent(newDocument.id)}`);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-8">
            <h2 className="text-2xl font-bold text-secondary">Novo(a) {currentDocType} ({getNextDocumentId(currentDocType)})</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Cliente</label>
                    <select value={clientId} onChange={e => setClientId(e.target.value)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                        <option value="">Selecione um cliente</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Data de Emissão</label>
                    <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Data de Vencimento</label>
                    <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-medium text-secondary">Itens do Documento</h3>
                <div className="mt-4 space-y-4">
                    {items.map((item, index) => {
                        const lineTotal = (item.quantity || 0) * (item.price || 0);
                        return (
                            <div key={index} className="bg-neutral-light p-4 rounded-lg">
                                <div className="grid grid-cols-12 gap-x-4 gap-y-2 items-start">
                                    <div className="col-span-12 md:col-span-11">
                                         <label className="block text-xs font-medium text-gray-600 mb-1">Produto / Serviço (Opcional)</label>
                                         <select onChange={(e) => handleProductSelect(index, e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm sm:text-sm">
                                            <option value="">-- Item Personalizado --</option>
                                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-span-12 md:col-span-1 flex items-end justify-end h-full">
                                         <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 p-2 mt-5">
                                            <TrashIcon className="w-5 h-5"/>
                                        </button>
                                    </div>
                                    <div className="col-span-12">
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Descrição</label>
                                        <textarea rows={2} placeholder="Descrição detalhada do produto ou serviço" value={item.description || ''} onChange={e => handleItemChange(index, 'description', e.target.value)} required className="w-full border-gray-300 rounded-md shadow-sm sm:text-sm" />
                                    </div>
                                    <div className="col-span-4 md:col-span-3">
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Quantidade</label>
                                        <input type="number" placeholder="Qtd." value={item.quantity || ''} min="1" onChange={e => handleItemChange(index, 'quantity', parseFloat(e.target.value))} required className="w-full border-gray-300 rounded-md shadow-sm sm:text-sm" />
                                    </div>
                                    <div className="col-span-8 md:col-span-4">
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Preço Unitário (AOA)</label>
                                        <input type="number" placeholder="Preço" value={item.price || ''} min="0" step="0.01" onChange={e => handleItemChange(index, 'price', parseFloat(e.target.value))} required className="w-full border-gray-300 rounded-md shadow-sm sm:text-sm" />
                                    </div>
                                    <div className="col-span-12 md:col-span-5">
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Total do Item</label>
                                        <div className="mt-1 p-2 bg-gray-200 rounded-md text-sm text-right text-gray-800 font-medium">
                                            {formatCurrency(lineTotal)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <button type="button" onClick={addItem} className="mt-4 text-sm font-medium text-primary hover:text-primary-700 flex items-center">
                    <PlusCircleIcon className="w-5 h-5 mr-1"/> Adicionar Item
                </button>
            </div>
            
            <div className="flex justify-end">
                <div className="w-full max-w-sm space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600">Subtotal:</span> <span className="font-medium">{formatCurrency(subtotal)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600">IVA (14%):</span> <span className="font-medium">{formatCurrency(vat)}</span></div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2"><span className="text-secondary">Total:</span> <span>{formatCurrency(total)}</span></div>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <button type="button" onClick={() => navigate('/documents')} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-700">Emitir Documento</button>
            </div>
        </form>
    );
};

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);
const PlusCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

export default CreateDocument;
