
import React, { useMemo, useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../context/AppContext';
import { DocumentStatus } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import GeneralReportPDF from '../components/GeneralReportPDF';
import TaxReportPDF from '../components/TaxReportPDF';

const formatCurrency = (amount: number) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(amount);

const formatCurrencyForChart = (value: number) => new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    notation: 'compact',
    compactDisplay: 'short'
}).format(value);

// Helper function to get the start of the week
const getWeekStartDate = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}

const Reports: React.FC = () => {
    const { documents, clients, products, company, cashFlowEntries } = useAppContext();
    const reportRef = useRef<HTMLDivElement>(null);
    const taxReportRef = useRef<HTMLDivElement>(null);
    const [chartView, setChartView] = useState<'monthly' | 'weekly'>('monthly');

    const handleGenerateReport = () => {
        const input = reportRef.current;
        if (input) {
            const a4Width = 210;
            const a4Height = 297; 

            html2canvas(input, { scale: 2, windowWidth: input.scrollWidth, windowHeight: input.scrollHeight }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                
                let position = 0;
                const canvasHeight = canvas.height;
                const pdfWidth = a4Width;
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                let heightLeft = pdfHeight;
                
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                heightLeft -= a4Height;

                while (heightLeft > 0) {
                    position -= a4Height;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                    heightLeft -= a4Height;
                }

                const dateStr = new Date().toISOString().split('T')[0];
                pdf.save(`Relatorio_Geral_Faturfeca_${dateStr}.pdf`);
            });
        }
    };

    const salesData = useMemo(() => {
        const monthlySales: { [key: string]: number } = {};
        const weeklySales: { [key: string]: number } = {};
        
        const topProducts: { [key: string]: { description: string, quantity: number, total: number } } = {};

        documents
            .filter(doc => doc.status === DocumentStatus.Paga)
            .forEach(doc => {
                const issueDate = new Date(doc.issueDate + 'T00:00:00');
                
                // Monthly aggregation
                const month = issueDate.toLocaleString('default', { month: 'short', year: 'numeric' });
                if (!monthlySales[month]) monthlySales[month] = 0;
                monthlySales[month] += doc.total;
                
                // Weekly aggregation
                const weekStart = getWeekStartDate(issueDate);
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);
                const weekLabel = `${weekStart.toLocaleDateString('pt-PT', {day:'2-digit', month:'2-digit'})} - ${weekEnd.toLocaleDateString('pt-PT', {day:'2-digit', month:'2-digit'})}`;
                if (!weeklySales[weekLabel]) weeklySales[weekLabel] = 0;
                weeklySales[weekLabel] += doc.total;

                // Top products aggregation
                doc.items.forEach(item => {
                    if(!topProducts[item.description]) {
                        topProducts[item.description] = { description: item.description, quantity: 0, total: 0 };
                    }
                    topProducts[item.description].quantity += item.quantity;
                    topProducts[item.description].total += item.total;
                });
            });
        
        const sortedMonthly = Object.keys(monthlySales).sort((a, b) => new Date(`01 ${a}`).getTime() - new Date(`01 ${b}`).getTime())
            .map(month => ({ name: month, Vendas: monthlySales[month] }));

        const sortedWeekly = Object.keys(weeklySales).sort((a, b) => {
            const dateA = new Date(a.split(' - ')[0].split('/').reverse().join('-'));
            const dateB = new Date(b.split(' - ')[0].split('/').reverse().join('-'));
            return dateA.getTime() - dateB.getTime();
        }).map(week => ({ name: week, Vendas: weeklySales[week] }));
        
        const sortedTopProducts = Object.values(topProducts)
            .sort((a,b) => b.quantity - a.quantity)
            .slice(0, 5);

        return { monthly: sortedMonthly, weekly: sortedWeekly, topProducts: sortedTopProducts };

    }, [documents]);

    const taxReportData = useMemo(() => {
        const paidDocs = documents.filter(doc => doc.status === DocumentStatus.Paga);
        
        const totalBilled = paidDocs.reduce((sum, doc) => sum + doc.total, 0);
        const taxOnBilled = totalBilled * 0.01;
    
        const monthlyDataMap: { [key: string]: { sales: number; cost: number; } } = {};
    
        paidDocs.forEach(doc => {
            const paymentDate = new Date(doc.paymentDetails?.confirmationDate + 'T00:00:00Z' || doc.issueDate + 'T00:00:00Z');
            const monthKey = `${paymentDate.getUTCFullYear()}-${String(paymentDate.getUTCMonth()).padStart(2, '0')}`; // YYYY-MM (0-indexed month)
            
            if (!monthlyDataMap[monthKey]) {
                monthlyDataMap[monthKey] = { sales: 0, cost: 0 };
            }
    
            monthlyDataMap[monthKey].sales += doc.subtotal;
    
            const docCost = doc.items.reduce((sum, item) => {
                const product = products.find(p => p.description === item.description);
                if (product && product.purchasePrice) {
                    return sum + (product.purchasePrice * item.quantity);
                }
                return sum;
            }, 0);
            monthlyDataMap[monthKey].cost += docCost;
        });
    
        const sortedMonthKeys = Object.keys(monthlyDataMap).sort();
    
        const monthlyData = sortedMonthKeys.map(key => {
            const { sales, cost } = monthlyDataMap[key];
            const profit = sales - cost;
            const tax = profit > 0 ? profit * 0.065 : 0;
            const [year, monthIndex] = key.split('-');
            const monthDate = new Date(parseInt(year), parseInt(monthIndex), 1);
            const monthName = monthDate.toLocaleString('pt-PT', { month: 'long', year: 'numeric' });
    
            return { 
                month: monthName.charAt(0).toUpperCase() + monthName.slice(1), 
                sales, 
                cost, 
                profit, 
                tax 
            };
        });
        
        const totalProfit = monthlyData.reduce((sum, m) => sum + m.profit, 0);
        const taxOnProfit = monthlyData.reduce((sum, m) => sum + m.tax, 0);
    
        return {
            periodYear: new Date().getFullYear(),
            totalBilled,
            taxOnBilled,
            totalProfit,
            taxOnProfit,
            monthlyData,
        };
    }, [documents, products]);
    
    const handleGenerateTaxReport = () => {
        const input = taxReportRef.current;
        if (input) {
            html2canvas(input, { scale: 2 }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                const dateStr = new Date().toISOString().split('T')[0];
                pdf.save(`Relatorio_Fiscal_AGT_${dateStr}.pdf`);
            });
        }
    };

    const chartData = chartView === 'monthly' ? salesData.monthly : salesData.weekly;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-secondary">Relatórios</h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleGenerateReport}
                        className="flex items-center justify-center bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors shadow-sm"
                    >
                        <DownloadIcon className="w-5 h-5 mr-2" />
                        Gerar Relatório Geral (PDF)
                    </button>
                    <button
                        onClick={handleGenerateTaxReport}
                        className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm"
                    >
                        <DocumentReportIcon className="w-5 h-5 mr-2" />
                        Gerar Relatório Fiscal (AGT)
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg text-secondary">Ganhos (Documentos Pagos)</h3>
                        <div className="flex items-center gap-1 bg-neutral-light p-1 rounded-lg">
                            <button onClick={() => setChartView('monthly')} className={`px-3 py-1 text-sm font-medium rounded-md ${chartView === 'monthly' ? 'bg-white shadow' : 'text-neutral-dark'}`}>Mensal</button>
                            <button onClick={() => setChartView('weekly')} className={`px-3 py-1 text-sm font-medium rounded-md ${chartView === 'weekly' ? 'bg-white shadow' : 'text-neutral-dark'}`}>Semanal</button>
                        </div>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tickFormatter={formatCurrencyForChart} tick={{ fontSize: 12 }} />
                                <Tooltip
                                    formatter={(value: number) => formatCurrency(value)}
                                    cursor={{fill: 'rgba(0, 82, 204, 0.1)'}}
                                />
                                <Bar dataKey="Vendas" fill="#0052cc" barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                 <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="font-semibold text-lg text-secondary mb-4">Produtos Mais Vendidos</h3>
                    <div className="space-y-4">
                        {salesData.topProducts.map((product, index) => (
                            <div key={index} className="flex justify-between items-center">
                                <div className="truncate pr-4">
                                    <p className="font-medium text-secondary text-sm truncate">{product.description}</p>
                                    <p className="text-xs text-neutral-dark">{product.quantity} unidades vendidas</p>
                                </div>
                                <div className="text-sm font-semibold text-primary text-right whitespace-nowrap">
                                    {formatCurrency(product.total)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div style={{ position: 'absolute', left: '-9999px', width: '794px' }}>
                 <div ref={reportRef}>
                    <GeneralReportPDF
                        company={company}
                        documents={documents}
                        clients={clients}
                        products={products}
                        cashFlowEntries={cashFlowEntries}
                        topProducts={salesData.topProducts}
                    />
                </div>
                <div ref={taxReportRef}>
                    <TaxReportPDF {...taxReportData} company={company} />
                </div>
            </div>
        </div>
    );
};

const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const DocumentReportIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

export default Reports;
