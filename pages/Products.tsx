
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Product } from '../types';

const formatCurrency = (amount: number) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(amount);

const Products: React.FC = () => {
    const { products, addProduct } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({ name: '', description: '', sellingPrice: 0, purchasePrice: 0 });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({ ...prev, [name]: name === 'sellingPrice' || name === 'purchasePrice' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newProduct.name && newProduct.sellingPrice >= 0) {
            addProduct(newProduct);
            setIsModalOpen(false);
            setNewProduct({ name: '', description: '', sellingPrice: 0, purchasePrice: 0 });
        }
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-secondary">Produtos e Serviços</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors shadow-sm"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Novo Produto/Serviço
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-neutral-dark">
                        <thead className="text-xs text-neutral-dark uppercase bg-neutral-light">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nome</th>
                                <th scope="col" className="px-6 py-3">Descrição</th>
                                <th scope="col" className="px-6 py-3">Preço de Aquisição</th>
                                <th scope="col" className="px-6 py-3">Preço de Venda</th>
                                <th scope="col" className="px-6 py-3">Lucro</th>
                                <th scope="col" className="px-6 py-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => {
                                const profit = product.purchasePrice !== undefined ? product.sellingPrice - product.purchasePrice : null;
                                return (
                                <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-secondary">{product.name}</td>
                                    <td className="px-6 py-4">{product.description}</td>
                                    <td className="px-6 py-4">{product.purchasePrice !== undefined ? formatCurrency(product.purchasePrice) : 'N/D'}</td>
                                    <td className="px-6 py-4 font-medium">{formatCurrency(product.sellingPrice)}</td>
                                    <td className={`px-6 py-4 font-medium ${profit === null || profit < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {profit !== null ? formatCurrency(profit) : 'N/D'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="font-medium text-primary hover:underline">Editar</button>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                        <h3 className="text-lg font-bold text-secondary mb-4">Adicionar Novo Produto/Serviço</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nome</label>
                                <input type="text" name="name" value={newProduct.name} onChange={handleInputChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                                <textarea name="description" value={newProduct.description} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Preço de Aquisição (AOA)</label>
                                    <input type="number" name="purchasePrice" value={newProduct.purchasePrice || ''} onChange={handleInputChange} min="0" step="0.01" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Preço de Venda (AOA)</label>
                                    <input type="number" name="sellingPrice" value={newProduct.sellingPrice} onChange={handleInputChange} required min="0" step="0.01" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cancelar</button>
                                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-700">Adicionar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

export default Products;
