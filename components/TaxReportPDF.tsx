
import React from 'react';
import { Company } from '../types';
import FaturfecaLogo from './FaturfecaLogo';

// Data types for the props
interface MonthlyTaxData {
    month: string;
    sales: number;
    cost: number;
    profit: number;
    tax: number;
}

interface TaxReportPDFProps {
    company: Company;
    periodYear: number;
    totalBilled: number;
    taxOnBilled: number; // 1%
    totalProfit: number;
    taxOnProfit: number; // 6.5%
    monthlyData: MonthlyTaxData[];
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(amount);

const TaxReportPDF: React.FC<TaxReportPDFProps> = ({ company, periodYear, totalBilled, taxOnBilled, totalProfit, taxOnProfit, monthlyData }) => {
    
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
                    <h1 className="text-2xl font-bold text-gray-800">Relatório Fiscal AGT</h1>
                    <p className="text-gray-600 mt-1 text-base">Período: {periodYear}</p>
                    <p className="text-gray-600 mt-2 text-xs">Gerado em: {new Date().toLocaleDateString('pt-PT')}</p>
                </div>
            </header>

            <section className="mt-8">
                <h2 className="text-lg font-bold text-secondary mb-4">1. Apuramento do Imposto de Selo (Regime Simplificado)</h2>
                 <p className="text-xs text-gray-600 mb-3">Cálculo referente à obrigação de liquidação de 1% sobre o valor dos recibos emitidos, conforme o Regime Simplificado de IVA.</p>
                <table className="w-full text-left text-xs border">
                    <tbody>
                        <tr className="border-b">
                            <td className="p-2 bg-gray-50 font-medium">Total Recebido (Base de Cálculo)</td>
                            <td className="p-2 text-right font-semibold">{formatCurrency(totalBilled)}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-2 bg-gray-50 font-medium">Taxa Aplicável</td>
                            <td className="p-2 text-right font-semibold">1%</td>
                        </tr>
                        <tr className="bg-blue-50">
                            <td className="p-2 font-bold text-secondary">Total de Imposto de Selo a Pagar</td>
                            <td className="p-2 text-right font-bold text-lg text-secondary">{formatCurrency(taxOnBilled)}</td>
                        </tr>
                    </tbody>
                </table>
            </section>
            
            <section className="mt-10 break-inside-avoid">
                <h2 className="text-lg font-bold text-secondary mb-4">2. Apuramento do Imposto Industrial (6.5% sobre Lucro)</h2>
                <p className="text-xs text-gray-600 mb-3">Cálculo do Imposto Industrial sobre o lucro tributável apurado, com detalhe mensal.</p>
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase">
                            <th className="p-2 font-semibold">Mês</th>
                            <th className="p-2 font-semibold text-right">Vendas (s/ IVA)</th>
                            <th className="p-2 font-semibold text-right">Custos</th>
                            <th className="p-2 font-semibold text-right">Lucro</th>
                            <th className="p-2 font-semibold text-right">Imposto (6.5%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {monthlyData.map(row => (
                             <tr key={row.month} className="border-b border-gray-100">
                                <td className="p-2 font-medium">{row.month}</td>
                                <td className="p-2 text-right">{formatCurrency(row.sales)}</td>
                                <td className="p-2 text-right text-red-600">({formatCurrency(row.cost)})</td>
                                <td className="p-2 text-right font-semibold">{formatCurrency(row.profit)}</td>
                                <td className="p-2 text-right font-medium text-secondary">{formatCurrency(row.tax)}</td>
                            </tr>
                        ))}
                        <tr className="bg-gray-100 font-bold">
                            <td className="p-2">Total Anual</td>
                            <td className="p-2 text-right">{formatCurrency(monthlyData.reduce((s, r) => s + r.sales, 0))}</td>
                             <td className="p-2 text-right text-red-600">({formatCurrency(monthlyData.reduce((s, r) => s + r.cost, 0))})</td>
                            <td className="p-2 text-right">{formatCurrency(totalProfit)}</td>
                            <td className="p-2 text-right text-secondary">{formatCurrency(taxOnProfit)}</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section className="mt-10 break-inside-avoid">
                <h2 className="text-lg font-bold text-secondary mb-4">3. Resumo de Impostos a Pagar</h2>
                <table className="w-full text-left text-xs border">
                     <tbody>
                        <tr className="border-b">
                            <td className="p-2 bg-gray-50 font-medium">Total Imposto de Selo (1%)</td>
                            <td className="p-2 text-right font-semibold">{formatCurrency(taxOnBilled)}</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-2 bg-gray-50 font-medium">Total Imposto Industrial (6.5%)</td>
                            <td className="p-2 text-right font-semibold">{formatCurrency(taxOnProfit)}</td>
                        </tr>
                        <tr className="bg-blue-50">
                            <td className="p-2 font-bold text-secondary text-base">Total Geral de Impostos a Pagar</td>
                            <td className="p-2 text-right font-bold text-lg text-secondary">{formatCurrency(taxOnBilled + taxOnProfit)}</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <footer className="mt-20 pt-8 flex justify-center text-center">
                <div>
                     <p className="text-xs text-gray-600 mb-8">Declaro que as informações constantes neste documento são verdadeiras e completas.</p>
                    <div className="w-64 h-px bg-gray-400 mx-auto"></div>
                    <p className="text-xs text-gray-800 mt-2">(Assinatura e Carimbo do Responsável)</p>
                    <p className="text-xs text-gray-600 mt-1">{company.name}</p>
                </div>
            </footer>
        </div>
    );
};

export default TaxReportPDF;
