
import React from 'react';
import { Company, FinancialDocument, DocumentStatus, Product, Client, CashFlowEntry, CashFlowType } from '../types';
import FaturfecaLogo from './FaturfecaLogo';

interface TopProduct {
    description: string;
    quantity: number;
    total: number;
}
interface GeneralReportPDFProps {
    company: Company;
    documents: FinancialDocument[];
    clients: Client[];
    products: Product[];
    cashFlowEntries: CashFlowEntry[];
    topProducts: TopProduct[];
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(amount);

const GeneralReportPDF: React.FC<GeneralReportPDFProps> = ({ company, documents, cashFlowEntries, products, topProducts }) => {
    
    const paidInvoices = documents.filter(inv => inv.status === DocumentStatus.Paga);
    const pendingInvoices = documents.filter(inv => inv.status === DocumentStatus.Pendente);

    const totalFaturado = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalPendente = pendingInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalDespesas = cashFlowEntries
        .filter(e => e.type === CashFlowType.Saida)
        .reduce((sum, e) => sum + e.amount, 0);
    const saldo = totalFaturado - totalDespesas;

    const salesByClient = paidInvoices.reduce((acc, inv) => {
        if (!acc[inv.client.name]) {
            acc[inv.client.name] = 0;
        }
        acc[inv.client.name] += inv.total;
        return acc;
    }, {} as { [key: string]: number });

    // The salesByProduct calculation has been moved to the Reports page to avoid duplication
    // We now receive topProducts as a prop.

    return (
        <div className="p-8 bg-white text-gray-900 font-sans text-sm">
            <header className="flex justify-between items-start pb-6 border-b-2 border-gray-200">
                <div className="w-2/3">
                    <FaturfecaLogo />
                    <div className="mt-4 text-gray-600 text-xs">
                        <p className="font-bold text-sm text-gray-800">{company.name}</p>
                        <p>{company.address}</p>
                        <p>NIF: {company.nif}</p>
                    </div>
                </div>
                <div className="text-right">
                    <h1 className="text-2xl font-bold text-gray-800">Relatório Geral</h1>
                    <p className="text-gray-600 mt-2 text-xs">Gerado em: {new Date().toLocaleDateString('pt-PT')}</p>
                </div>
            </header>

            <section className="mt-8">
                <h2 className="text-lg font-bold text-secondary mb-4">Resumo Financeiro</h2>
                <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-600">Total Faturado (Pago)</p>
                        <p className="font-bold text-lg text-green-600">{formatCurrency(totalFaturado)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-600">Total Pendente</p>
                        <p className="font-bold text-lg text-yellow-600">{formatCurrency(totalPendente)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-600">Total de Despesas</p>
                        <p className="font-bold text-lg text-red-600">{formatCurrency(totalDespesas)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-600">Saldo (Receitas - Despesas)</p>
                        <p className={`font-bold text-lg ${saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{formatCurrency(saldo)}</p>
                    </div>
                </div>
            </section>
            
            <section className="mt-10 break-inside-avoid">
                <h2 className="text-lg font-bold text-secondary mb-4">Vendas por Cliente</h2>
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase">
                            <th className="p-2 font-semibold">Cliente</th>
                            <th className="p-2 font-semibold text-right">Valor Total (Pago)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(salesByClient).sort(([, a], [, b]) => (b as number) - (a as number)).map(([name, total]) => (
                            <tr key={name} className="border-b border-gray-100">
                                <td className="p-2">{name}</td>
                                <td className="p-2 text-right font-medium">{formatCurrency(total as number)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section className="mt-10 break-inside-avoid">
                <h2 className="text-lg font-bold text-secondary mb-4">Top 5 Produtos/Serviços Mais Vendidos</h2>
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase">
                            <th className="p-2 font-semibold">Descrição</th>
                            <th className="p-2 font-semibold text-center">Qtd. Vendida</th>
                            <th className="p-2 font-semibold text-right">Valor Total</th>
                        </tr>
                    </thead>
                    <tbody>
                         {topProducts.map(product => (
                            <tr key={product.description} className="border-b border-gray-100">
                                <td className="p-2">{product.description}</td>
                                <td className="p-2 text-center">{product.quantity}</td>
                                <td className="p-2 text-right font-medium">{formatCurrency(product.total)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section className="mt-10 break-inside-avoid">
                <h2 className="text-lg font-bold text-secondary mb-4">Faturas Pendentes</h2>
                 {pendingInvoices.length > 0 ? (
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 uppercase">
                                <th className="p-2 font-semibold">Fatura #</th>
                                <th className="p-2 font-semibold">Cliente</th>
                                <th className="p-2 font-semibold">Data Vencimento</th>
                                <th className="p-2 font-semibold text-right">Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingInvoices.map(inv => (
                                <tr key={inv.id} className="border-b border-gray-100">
                                    <td className="p-2 font-medium">{inv.id}</td>
                                    <td className="p-2">{inv.client.name}</td>
                                    <td className="p-2">{new Date(inv.dueDate).toLocaleDateString('pt-PT')}</td>
                                    <td className="p-2 text-right font-medium">{formatCurrency(inv.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 ) : (
                    <p className="text-gray-600 text-xs">Não há faturas pendentes de pagamento.</p>
                 )}
            </section>

            <footer className="mt-12 pt-8 border-t-2 border-gray-200">
                <p className="text-xs text-center text-gray-500">Relatório gerado pelo Faturfeca</p>
            </footer>
        </div>
    );
};

export default GeneralReportPDF;
