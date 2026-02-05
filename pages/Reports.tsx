
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../context/AppContext';
import { Invoice, InvoiceStatus } from '../types';

const formatCurrencyForChart = (value: number) => new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    notation: 'compact',
    compactDisplay: 'short'
}).format(value);


const Reports: React.FC = () => {
    const { invoices } = useAppContext();

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
            <h2 className="text-2xl font-bold text-secondary mb-6">Relatórios de Vendas</h2>
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
            {/* Other charts for daily/annual reports could be added here */}
        </div>
    );
};

export default Reports;
