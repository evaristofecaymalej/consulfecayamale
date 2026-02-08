
import React from 'react';
import QRCode from 'react-qr-code';
// Fix: Replaced deprecated Invoice type with FinancialDocument.
import { FinancialDocument } from '../types';
import { useAppContext } from '../context/AppContext';
import FaturfecaLogo from './FaturfecaLogo';

interface InvoicePDFProps {
    invoice: FinancialDocument;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(amount);

const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice }) => {
    const { company } = useAppContext();

    return (
        <div className="p-8 bg-white text-gray-900 font-sans text-sm">
            <header className="flex justify-between items-start pb-6 border-b-2 border-gray-200">
                <div className="w-1/2">
                    <FaturfecaLogo />
                    <div className="mt-4 text-gray-600">
                        <p className="font-bold text-base text-gray-800">{company.name}</p>
                        <p>{company.address}</p>
                        <p>NIF: {company.nif}</p>
                        {company.email && <p>Email: {company.email}</p>}
                        {company.contact && <p>Contacto: {company.contact}</p>}
                    </div>
                </div>
                <div className="text-right">
                    <h1 className="text-4xl font-bold text-gray-800">FATURA</h1>
                    <p className="text-gray-600 mt-2">#{invoice.id}</p>
                </div>
            </header>

            <section className="flex justify-between mt-8">
                <div>
                    <h2 className="font-semibold text-gray-500 uppercase tracking-wide">Faturado para</h2>
                    <div className="mt-2 text-gray-800">
                        <p className="font-bold">{invoice.client.name}</p>
                        <p>{invoice.client.address}</p>
                        <p>NIF: {invoice.client.nif}</p>
                        <p>{invoice.client.email}</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="mb-4">
                        <p className="font-semibold text-gray-500">Data de Emissão:</p>
                        <p className="text-gray-800">{new Date(invoice.issueDate).toLocaleDateString('pt-PT')}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-500">Data de Vencimento:</p>
                        <p className="text-gray-800">{new Date(invoice.dueDate).toLocaleDateString('pt-PT')}</p>
                    </div>
                </div>
            </section>

            <section className="mt-10">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
                            <th className="p-3 font-semibold">Descrição</th>
                            <th className="p-3 font-semibold text-center w-24">Qtd.</th>
                            <th className="p-3 font-semibold text-right w-32">Preço Unit.</th>
                            <th className="p-3 font-semibold text-right w-32">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map(item => (
                            <tr key={item.id} className="border-b border-gray-100">
                                <td className="p-3">{item.description}</td>
                                <td className="p-3 text-center">{item.quantity}</td>
                                <td className="p-3 text-right">{formatCurrency(item.price)}</td>
                                <td className="p-3 text-right font-medium">{formatCurrency(item.total)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section className="flex justify-between items-start mt-8">
                <div className="text-gray-600">
                    <h3 className="font-semibold">Notas</h3>
                    <p>Obrigado pela sua preferência.</p>
                </div>
                <div className="w-1/3">
                    <div className="flex justify-between py-2">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium text-gray-800">{formatCurrency(invoice.subtotal)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-gray-600">IVA (14%):</span>
                        <span className="font-medium text-gray-800">{formatCurrency(invoice.vat)}</span>
                    </div>
                    <div className="flex justify-between py-2 mt-2 border-t-2 border-gray-200">
                        <span className="font-bold text-lg text-gray-800">Total:</span>
                        <span className="font-bold text-lg text-gray-800">{formatCurrency(invoice.total)}</span>
                    </div>
                </div>
            </section>
            
            <footer className="mt-12 pt-8 border-t-2 border-gray-200 flex justify-between items-center">
                <div className="text-xs text-gray-500">
                    <p>Fatura processada por computador</p>
                    <p>Faturfeca - Software de Faturação Certificado</p>
                </div>
                <div>
                   <QRCode value={invoice.qrCodeValue} size={80} />
                </div>
            </footer>
        </div>
    );
};

export default InvoicePDF;
