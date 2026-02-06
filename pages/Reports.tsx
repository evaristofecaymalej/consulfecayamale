
import React, { useMemo, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../context/AppContext';
import { InvoiceStatus } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import GeneralReportPDF from '../components/GeneralReportPDF';

const formatCurrencyForChart = (value: number) => new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    notation: 'compact',
    compactDisplay: 'short'
}).format(value);


const Reports: React.FC = () => {
    const { invoices, clients, products, company, cashFlowEntries } = useAppContext();
    const reportRef = useRef<HTMLDivElement>(null);

    const handleGenerateReport = () => {
        const input = reportRef.current;
        if (input) {
            const a4Width = 210;
            const a4Height = 297; 

            html2canvas(input, { scale: 2, windowWidth: input.scrollWidth, windowHeight: input.scrollHeight }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                
                const canvasWidth = canvas.width;
                const canvasHeight = canvas.height;
                
                const ratio = canvasWidth / canvasHeight;
                const pdfWidth = a4Width;
                let pdfHeight = pdfWidth / ratio;

                if (pdfHeight > a4Height) {
                    pdfHeight = a4Height;
                }

                let position = 0;
                let heightLeft = canvasHeight * a4Width / canvasWidth;
                
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, heightLeft);
                heightLeft -= a4Height;

                while (heightLeft > 0) {
                    position -= a4Height;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, canvasHeight * a4Width / canvasWidth);
                    heightLeft -= a4Height;
                }

                const dateStr = new Date().toISOString().split('T')[0];
                pdf.save(`Relatorio_Geral_Faturfeca_${dateStr}.pdf`);
            });
        }
    };

    const monthlySalesData = useMemo(() => {
        const salesByMonth: { [key: string]: number } = {};
        
        invoices
            .filter(inv => inv.status === InvoiceStatus.Paga)
            .forEach(inv => {
                const month = new Date(inv.issueDate).toLocaleString('default', { month: 'short', year: 'numeric' });
                if (!salesByMonth[month]) {
                    salesByMonth[month] = 0;
                }
                salesByMonth[month] += inv.total;
            });
        
        const sortedMonths = Object.keys(salesByMonth).sort((a, b) => {
            const dateA = new Date(`01 ${a}`);
            const dateB = new Date(`01 ${b}`);
            return dateA.getTime() - dateB.getTime();
        });

        return sortedMonths.map(month => ({
            name: month,
            Vendas: salesByMonth[month]
        }));

    }, [invoices]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-secondary">Relatórios de Vendas</h2>
                <button
                    onClick={handleGenerateReport}
                    className="flex items-center justify-center bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors shadow-sm"
                >
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    Gerar Relatório Geral (PDF)
                </button>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 h-96">
                <h3 className="font-semibold text-lg text-secondary mb-4">Vendas Mensais (Pagas)</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={monthlySalesData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={formatCurrencyForChart} tick={{ fontSize: 12 }} />
                        <Tooltip
                            formatter={(value: number) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value)}
                            cursor={{fill: 'rgba(0, 82, 204, 0.1)'}}
                        />
                        <Legend />
                        <Bar dataKey="Vendas" fill="#0052cc" barSize={30} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
            <div style={{ position: 'absolute', left: '-9999px', width: '794px' }}>
                 <div ref={reportRef}>
                    <GeneralReportPDF
                        company={company}
                        invoices={invoices}
                        clients={clients}
                        products={products}
                        cashFlowEntries={cashFlowEntries}
                    />
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

export default Reports;
