
import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { InvoiceStatus } from '../types';
import InvoiceStatusBadge from '../components/InvoiceStatusBadge';
import InvoicePDF from '../components/InvoicePDF';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const InvoiceDetail: React.FC = () => {
    const { invoiceId } = useParams<{ invoiceId: string }>();
    const { getInvoiceById, updateInvoiceStatus, currentUser } = useAppContext();
    const navigate = useNavigate();
    const pdfRef = useRef<HTMLDivElement>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('Transferência Bancária');
    const [confirmationDate, setConfirmationDate] = useState(new Date().toISOString().split('T')[0]);
    const [paymentNotes, setPaymentNotes] = useState('');

    if (!invoiceId) {
        return <p>ID da fatura não encontrado.</p>;
    }

    const invoice = getInvoiceById(decodeURIComponent(invoiceId));
    
    if (!invoice) {
        return <p>Fatura não encontrada.</p>;
    }
    
    const handleOpenPaymentModal = () => {
        setIsModalOpen(true);
    };
    
    const handleConfirmPayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentUser.role === 'Administrador' && invoice) {
            updateInvoiceStatus(invoice.id, InvoiceStatus.Paga, {
                method: paymentMethod,
                confirmationDate: confirmationDate,
                notes: paymentNotes,
            });
        }
        setIsModalOpen(false);
        setPaymentMethod('Transferência Bancária');
        setConfirmationDate(new Date().toISOString().split('T')[0]);
        setPaymentNotes('');
    };


    const handleDownloadPdf = () => {
        const input = pdfRef.current;
        if (input) {
            html2canvas(input, { scale: 2 }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`Fatura-${invoice.id.replace('/', '_')}.pdf`);
            });
        }
    };
    
    return (
        <>
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-secondary">Fatura {invoice.id}</h2>
                        <div className="mt-2">
                            <InvoiceStatusBadge status={invoice.status} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        {invoice.status === InvoiceStatus.Pendente && currentUser.role === 'Administrador' && (
                            <button onClick={handleOpenPaymentModal} className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2">
                                Marcar como Paga
                            </button>
                        )}
                        <button onClick={handleDownloadPdf} className="bg-white text-primary border border-primary px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors flex items-center gap-2">
                            <RefreshIcon className="w-5 h-5"/>
                            Reemitir PDF
                        </button>
                        <button onClick={handleDownloadPdf} className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center gap-2">
                            <DownloadIcon className="w-5 h-5"/>
                            Download PDF
                        </button>
                        <button onClick={() => navigate('/invoices')} className="bg-neutral-medium text-secondary px-4 py-2 rounded-lg font-medium hover:bg-neutral-dark hover:text-white transition-colors">
                            Voltar
                        </button>
                    </div>
                </div>

                {invoice.status === InvoiceStatus.Paga && invoice.paymentDetails && (
                    <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center gap-2">
                            <CheckCircleIcon className="w-6 h-6"/>
                            Detalhes do Pagamento
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <p className="font-medium text-gray-500">Método de Pagamento</p>
                                <p className="text-gray-800 font-semibold">{invoice.paymentDetails.method}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-500">Data de Confirmação</p>
                                <p className="text-gray-800 font-semibold">{new Date(invoice.paymentDetails.confirmationDate + 'T00:00:00').toLocaleDateString('pt-PT')}</p>
                            </div>
                            {invoice.paymentDetails.notes && (
                                <div className="md:col-span-3">
                                    <p className="font-medium text-gray-500">Notas/Referência</p>
                                    <p className="text-gray-800 font-semibold whitespace-pre-wrap">{invoice.paymentDetails.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div ref={pdfRef}>
                  <InvoicePDF invoice={invoice} />
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                        <h3 className="text-lg font-bold text-secondary mb-4">Confirmar Pagamento</h3>
                        <form onSubmit={handleConfirmPayment} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Método de Pagamento</label>
                                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm">
                                    <option>Transferência Bancária</option>
                                    <option>Multicaixa</option>
                                    <option>Depósito</option>
                                    <option>Numerário</option>
                                    <option>Outro</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Data de Confirmação</p>
                                <input type="date" value={confirmationDate} onChange={(e) => setConfirmationDate(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Notas / Referência (Opcional)</label>
                                <textarea value={paymentNotes} onChange={(e) => setPaymentNotes(e.target.value)} rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cancelar</button>
                                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">Confirmar Pagamento</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

const RefreshIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M5.5 9.5A8.001 8.001 0 0119.34 14.5M20 20v-5h-5m-1-5.5A8.001 8.001 0 004.66 9.5" />
    </svg>
);

const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
);


export default InvoiceDetail;
