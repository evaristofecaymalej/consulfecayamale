
import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { DocumentStatus, DocumentType, UserRole } from '../types';
import DocumentStatusBadge from '../components/DocumentStatusBadge';
import DocumentPDF from '../components/DocumentPDF';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const DocumentDetail: React.FC = () => {
    const { documentId } = useParams<{ documentId: string }>();
    const { getDocumentById, updateDocumentStatus, currentUser } = useAppContext();
    const navigate = useNavigate();
    const pdfRef = useRef<HTMLDivElement>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditingPayment, setIsEditingPayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('Transferência Bancária');
    const [confirmationDate, setConfirmationDate] = useState(new Date().toISOString().split('T')[0]);
    const [paymentNotes, setPaymentNotes] = useState('');

    if (!documentId) {
        return <p>ID do documento não encontrado.</p>;
    }

    const doc = getDocumentById(decodeURIComponent(documentId));
    
    if (!doc) {
        return <p>Documento não encontrado.</p>;
    }
    
    const handleOpenPaymentModal = () => {
        setIsEditingPayment(false);
        setPaymentMethod('Transferência Bancária');
        setConfirmationDate(new Date().toISOString().split('T')[0]);
        setPaymentNotes('');
        setIsModalOpen(true);
    };
    
    const handleOpenEditPaymentModal = () => {
        if (doc?.paymentDetails) {
            setIsEditingPayment(true);
            setPaymentMethod(doc.paymentDetails.method);
            setConfirmationDate(doc.paymentDetails.confirmationDate);
            setPaymentNotes(doc.paymentDetails.notes || '');
            setIsModalOpen(true);
        }
    };
    
    const handleSavePayment = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentUser?.role === UserRole.Administrador && doc) {
            updateDocumentStatus(doc.id, DocumentStatus.Paga, {
                method: paymentMethod,
                confirmationDate: confirmationDate,
                notes: paymentNotes,
            });
        }
        setIsModalOpen(false);
        setIsEditingPayment(false);
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
                pdf.save(`${doc.documentType}-${doc.id.replace('/', '_')}.pdf`);
            });
        }
    };

    const handlePrint = () => {
        const input = pdfRef.current;
        if (input) {
            html2canvas(input, { scale: 2 }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.output('dataurlnewwindow');
            });
        }
    };
    
    const canBeMarkedAsPaid = doc.documentType === DocumentType.Fatura || doc.documentType === DocumentType.Proforma;

    return (
        <>
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-secondary">{doc.documentType} {doc.id}</h2>
                        <div className="mt-2">
                            <DocumentStatusBadge status={doc.status} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        {doc.status === DocumentStatus.Pendente && currentUser?.role === UserRole.Administrador && canBeMarkedAsPaid && (
                            <button onClick={handleOpenPaymentModal} className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2">
                                Marcar como Paga
                            </button>
                        )}
                        <button onClick={handlePrint} className="bg-white text-primary border border-primary px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors flex items-center gap-2">
                            <PrintIcon className="w-5 h-5"/>
                            Imprimir
                        </button>
                        <button onClick={handleDownloadPdf} className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center gap-2">
                            <DownloadIcon className="w-5 h-5"/>
                            Download PDF
                        </button>
                        <button onClick={() => navigate('/documents')} className="bg-neutral-medium text-secondary px-4 py-2 rounded-lg font-medium hover:bg-neutral-dark hover:text-white transition-colors">
                            Voltar
                        </button>
                    </div>
                </div>

                {doc.status === DocumentStatus.Paga && doc.paymentDetails && (
                    <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                                <CheckCircleIcon className="w-6 h-6"/>
                                Detalhes do Pagamento
                            </h3>
                            {currentUser?.role === UserRole.Administrador && (
                                <button onClick={handleOpenEditPaymentModal} className="text-xs font-medium text-primary hover:underline">Editar</button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <p className="font-medium text-gray-500">Método de Pagamento</p>
                                <p className="text-gray-800 font-semibold">{doc.paymentDetails.method}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-500">Data de Confirmação</p>
                                <p className="text-gray-800 font-semibold">{new Date(doc.paymentDetails.confirmationDate + 'T00:00:00').toLocaleDateString('pt-PT')}</p>
                            </div>
                            {doc.paymentDetails.notes && (
                                <div className="md:col-span-3">
                                    <p className="font-medium text-gray-500">Notas/Referência</p>
                                    <p className="text-gray-800 font-semibold whitespace-pre-wrap">{doc.paymentDetails.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div ref={pdfRef}>
                  <DocumentPDF document={doc} />
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                        <h3 className="text-lg font-bold text-secondary mb-4">{isEditingPayment ? 'Editar Detalhes do Pagamento' : 'Confirmar Pagamento'}</h3>
                        <form onSubmit={handleSavePayment} className="space-y-4">
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
                                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">{isEditingPayment ? 'Guardar Alterações' : 'Confirmar Pagamento'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const PrintIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm7-8V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
);

const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
);


export default DocumentDetail;
