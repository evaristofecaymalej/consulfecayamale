
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../context/AppContext';
import { CashFlowType } from '../types';

const formatCurrency = (amount: number) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(amount);
const formatCurrencyForChart = (value: number) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', notation: 'compact', compactDisplay: 'short' }).format(value);

const CashFlow: React.FC = () => {
    const { cashFlowEntries } = useAppContext();

    const { totalIncome, totalExpenses, balance } = useMemo(() => {
        const totalIncome = cashFlowEntries
            .filter(e => e.type === CashFlowType.Entrada)
            .reduce((sum, e) => sum + e.amount, 0);
        const totalExpenses = cashFlowEntries
            .filter(e => e.type === CashFlowType.Saida)
            .reduce((sum, e) => sum + e.amount, 0);
        return { totalIncome, totalExpenses, balance: totalIncome - totalExpenses };
    }, [cashFlowEntries]);

    const monthlyChartData = useMemo(() => {
        const dataByMonth: { [key: string]: { Entradas: number; Saídas: number } } = {};
        cashFlowEntries.forEach(entry => {
            const month = new Date(entry.date).toLocaleString('default', { month: 'short', year: 'numeric' });
            if (!dataByMonth[month]) {
                dataByMonth[month] = { Entradas: 0, Saídas: 0 };
            }
            if (entry.type === CashFlowType.Entrada) {
                dataByMonth[month].Entradas += entry.amount;
            } else {
                dataByMonth[month].Saídas += entry.amount;
            }
        });
        
        const sortedMonths = Object.keys(dataByMonth).sort((a, b) => {
            const dateA = new Date(`01 ${a}`);
            const dateB = new Date(`01 ${b}`);
            return dateA.getTime() - dateB.getTime();
        });

        return sortedMonths.map(month => ({
            name: month,
            ...dataByMonth[month]
        }));

    }, [cashFlowEntries]);

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-secondary">Fluxo de Caixa</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DashboardCard title="Total de Entradas" value={formatCurrency(totalIncome)} color="green" />
                <DashboardCard title="Total de Saídas" value={formatCurrency(totalExpenses)} color="red" />
                <DashboardCard title="Saldo Atual" value={formatCurrency(balance)} color="blue" />
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 h-96">
                <h3 className="font-semibold text-lg text-secondary mb-4">Entradas vs. Saídas Mensais</h3>
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={monthlyChartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={formatCurrencyForChart} tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} cursor={{fill: 'rgba(0, 82, 204, 0.1)'}}/>
                        <Legend />
                        <Bar dataKey="Entradas" fill="#22c55e" barSize={20} />
                        <Bar dataKey="Saídas" fill="#ef4444" barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-lg text-secondary mb-4">Últimas Transações</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-neutral-dark">
                        <thead className="text-xs text-neutral-dark uppercase bg-neutral-light">
                            <tr>
                                <th scope="col" className="px-6 py-3">Data</th>
                                <th scope="col" className="px-6 py-3">Descrição</th>
                                <th scope="col" className="px-6 py-3">Tipo</th>
                                <th scope="col" className="px-6 py-3 text-right">Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cashFlowEntries.slice(0, 10).map(entry => (
                                <tr key={entry.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(entry.date).toLocaleDateString('pt-PT')}</td>
                                    <td className="px-6 py-4">{entry.description}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            entry.type === CashFlowType.Entrada ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>{entry.type}</span>
                                    </td>
                                    <td className={`px-6 py-4 text-right font-medium whitespace-nowrap ${
                                        entry.type === CashFlowType.Entrada ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {entry.type === CashFlowType.Saida && '- '}{formatCurrency(entry.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const DashboardCard: React.FC<{ title: string, value: string, color: 'green' | 'red' | 'blue' }> = ({ title, value, color }) => {
    const colorClasses = {
        green: 'text-green-600',
        red: 'text-red-600',
        blue: 'text-blue-600',
    };
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 transition-transform transform hover:-translate-y-1">
            <p className="text-sm text-neutral-dark font-medium">{title}</p>
            <p className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</p>
        </div>
    );
};

export default CashFlow;
