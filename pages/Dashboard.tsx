
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Invoice, InvoiceStatus } from '../types';
import InvoiceStatusBadge from '../components/InvoiceStatusBadge';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(amount);
}

const Dashboard: React.FC = () => {
    const { invoices } = useAppContext();

    const totalFaturado = invoices
        .filter(inv => inv.status === InvoiceStatus.Paga)
        .reduce((sum, inv) => sum + inv.total, 0);

    const pendente = invoices
        .filter(inv => inv.status === InvoiceStatus.Pendente)
        .reduce((sum, inv) => sum + inv.total, 0);
    
    const recentInvoices = invoices.slice(0, 5);

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <DashboardCard title="Total Faturado" value={formatCurrency(totalFaturado)} icon={CashIcon} color="green" />
                <DashboardCard title="Pendente de Recebimento" value={formatCurrency(pendente)} icon={ClockIcon} color="yellow" />
                <DashboardCard title="Faturas Pagas" value={invoices.filter(i => i.status === InvoiceStatus.Paga).length.toString()} icon={CheckCircleIcon} color="blue" />
                <DashboardCard title="Faturas Pendentes" value={invoices.filter(i => i.status === InvoiceStatus.Pendente).length.toString()} icon={ExclamationCircleIcon} color="red" />
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-secondary">Faturas Recentes</h2>
                    <Link to="/invoices" className="text-sm font-medium text-primary hover:underline">Ver todas</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-neutral-dark">
                        <thead className="text-xs text-neutral-dark uppercase bg-neutral-light">
                            <tr>
                                <th scope="col" className="px-6 py-3">Fatura #</th>
                                <th scope="col" className="px-6 py-3">Cliente</th>
                                <th scope="col" className="px-6 py-3">Data Emissão</th>
                                <th scope="col" className="px-6 py-3">Valor</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentInvoices.map(invoice => (
                                <tr key={invoice.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-secondary whitespace-nowrap">{invoice.id}</td>
                                    <td className="px-6 py-4">{invoice.client.name}</td>
                                    <td className="px-6 py-4">{new Date(invoice.issueDate).toLocaleDateString('pt-PT')}</td>
                                    <td className="px-6 py-4 font-medium">{formatCurrency(invoice.total)}</td>
                                    <td className="px-6 py-4"><InvoiceStatusBadge status={invoice.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

interface DashboardCardProps {
    title: string;
    value: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    color: 'green' | 'yellow' | 'blue' | 'red';
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon: Icon, color }) => {
    const colorClasses = {
        green: 'bg-green-100 text-green-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        blue: 'bg-blue-100 text-blue-600',
        red: 'bg-red-100 text-red-600',
    };
    return (
        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between transition-transform transform hover:-translate-y-1">
            <div>
                <p className="text-sm text-neutral-dark font-medium">{title}</p>
                <p className="text-2xl font-bold text-secondary">{value}</p>
            </div>
            <div className={`p-3 rounded-full ${colorClasses[color]}`}>
                <Icon className="w-6 h-6"/>
            </div>
        </div>
    );
}

// Icons
const CashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
);
const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const ExclamationCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

export default Dashboard;
