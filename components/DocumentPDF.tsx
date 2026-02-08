
import React from 'react';
import QRCode from 'react-qr-code';
import { FinancialDocument } from '../types';
import { useAppContext } from '../context/AppContext';
import FaturfecaLogo from './FaturfecaLogo';

interface DocumentPDFProps {
    document: FinancialDocument;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(amount);

const DocumentPDF: React.FC<DocumentPDFProps> = ({ document }) => {
    const { company } = useAppContext();

    return (
        <div className="bg-white text-sm">
            <div className="p-8">
                {/* Header */}
                <div className="bg-secondary text-white p-8 -mx-8 -mt-8 rounded-t-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <FaturfecaLogo textColor="text-white" />
                            <div className="mt-4 text-xs text-neutral-light">
                                <p className="font-bold text-base text-white">{company.name}</p>
                                <p>{company.address}</p>
                                <p>NIF: {company.nif}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h1 className="text-4xl font-bold uppercase tracking-wider">{document.documentType}</h1>
                            <p className="text-lg mt-1">#{document.id}</p>
                        </div>
                    </div>
                </div>

                {/* Bill To / Dates */}
                <section className="grid grid-cols-3 gap-8 mt-10">
                    <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b pb-2 mb-2">Para</h3>
                        <div className="text-gray-800">
                            <p className="font-bold">{document.client.name}</p>
                            <p>{document.client.address}</p>
                            <p>NIF: {document.client.nif}</p>
                            <p>{document.client.email}</p>
                        </div>
                    </div>
                    <div>
                        {/* Empty column for spacing */}
                    </div>
                    <div className="text-right">
                         <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b pb-2 mb-2">Detalhes</h3>
                         <div className="mb-2">
                            <p className="font-semibold text-gray-500">Data de Emissão:</p>
                            <p className="text-gray-800">{new Date(document.issueDate + 'T00:00:00Z').toLocaleDateString('pt-PT')}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-500">Data de Vencimento:</p>
                            <p className="text-gray-800">{new Date(document.dueDate + 'T00:00:00Z').toLocaleDateString('pt-PT')}</p>
                        </div>
                    </div>
                </section>

                {/* Items Table */}
                <section className="mt-10">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-secondary text-white uppercase text-xs">
                                <th className="p-3 font-semibold tracking-wider">Descrição</th>
                                <th className="p-3 font-semibold tracking-wider text-center w-24">Qtd.</th>
                                <th className="p-3 font-semibold tracking-wider text-right w-32">Preço Unit.</th>
                                <th className="p-3 font-semibold tracking-wider text-right w-32">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {document.items.map(item => (
                                <tr key={item.id} className="border-b border-gray-100 even:bg-neutral-light">
                                    <td className="p-3">{item.description}</td>
                                    <td className="p-3 text-center">{item.quantity}</td>
                                    <td className="p-3 text-right">{formatCurrency(item.price)}</td>
                                    <td className="p-3 text-right font-medium text-secondary">{formatCurrency(item.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {/* Totals & Footer */}
                <section className="flex justify-between items-end mt-10">
                    <div className="text-xs text-gray-500">
                        <div className="mb-4">
                            <QRCode value={document.qrCodeValue} size={80} />
                        </div>
                        <p>Documento processado por computador</p>
                        <p>Faturfeca - Software de Faturação Certificado</p>
                    </div>
                    <div className="w-full max-w-xs text-sm">
                        <div className="bg-neutral-light p-4 rounded-lg">
                            <div className="flex justify-between py-1 text-neutral-dark">
                                <span>Subtotal:</span>
                                <span>{formatCurrency(document.subtotal)}</span>
                            </div>
                            <div className="flex justify-between py-1 text-neutral-dark">
                                <span>IVA (14%):</span>
                                <span>{formatCurrency(document.vat)}</span>
                            </div>
                            <div className="flex justify-between py-2 mt-2 border-t-2 border-primary-200 text-secondary">
                                <span className="font-bold text-lg">Total:</span>
                                <span className="font-bold text-lg">{formatCurrency(document.total)}</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
             <footer className="bg-secondary h-2 rounded-b-lg"></footer>
        </div>
    );
};

export default DocumentPDF;
