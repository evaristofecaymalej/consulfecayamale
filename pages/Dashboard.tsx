
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { DocumentStatus, UserRole } from '../types';
import DocumentStatusBadge from '../components/DocumentStatusBadge';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(amount);
}

const Dashboard: React.FC = () => {
    const { documents, products, currentUser, openCalculator } = useAppContext();

    const totalFaturado = documents
        .filter(doc => doc.status === DocumentStatus.Paga)
        .reduce((sum, doc) => sum + doc.total, 0);

    const pendente = documents
        .filter(doc => doc.status === DocumentStatus.Pendente)
        .reduce((sum, doc) => sum + doc.total, 0);
    
    const recentDocuments = documents.slice(0, 5);
    
    const totalProfit = documents
        .filter(doc => doc.status === DocumentStatus.Paga)
        .flatMap(doc => doc.items)
        .reduce((sum, item) => {
            const product = products.find(p => p.description === item.description);
            if (product && product.purchasePrice) {
                const profitPerItem = item.price - product.purchasePrice;
                return sum + (profitPerItem * item.quantity);
            }
            return sum;
        }, 0);

    const canViewProfit = currentUser?.role === UserRole.Administrador || currentUser?.role === UserRole.Contabilista;

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <DashboardCard title="Total Recebido" value={formatCurrency(totalFaturado)} icon={CashIcon} color="green" />
                <DashboardCard title="Pendente de Recebimento" value={formatCurrency(pendente)} icon={ClockIcon} color="yellow" />
                {canViewProfit && <DashboardCard title="Lucro Total Estimado" value={formatCurrency(totalProfit)} icon={TrendingUpIcon} color="purple" />}
                <DashboardCard title="Documentos Pagos" value={documents.filter(i => i.status === DocumentStatus.Paga).length.toString()} icon={CheckCircleIcon} color="blue" />
                <DashboardCard title="Documentos Pendentes" value={documents.filter(i => i.status === DocumentStatus.Pendente).length.toString()} icon={ExclamationCircleIcon} color="red" />
                <ActionCard 
                    title="Calculadora" 
                    description="Acesso rápido para cálculos"
                    icon={CalculatorIcon} 
                    onClick={openCalculator} 
                />
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-secondary">Documentos Recentes</h2>
                    <Link to="/documents" className="text-sm font-medium text-primary hover:underline">Ver todos</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-neutral-dark">
                        <thead className="text-xs text-neutral-dark uppercase bg-neutral-light">
                            <tr>
                                <th scope="col" className="px-6 py-3">Documento #</th>
                                <th scope="col" className="px-6 py-3">Cliente</th>
                                <th scope="col" className="px-6 py-3">Data Emissão</th>
                                <th scope="col" className="px-6 py-3">Valor</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentDocuments.map(doc => (
                                <tr key={doc.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-secondary whitespace-nowrap">{doc.id}</td>
                                    <td className="px-6 py-4">{doc.client.name}</td>
                                    <td className="px-6 py-4">{new Date(doc.issueDate).toLocaleDateString('pt-PT')}</td>
                                    <td className="px-6 py-4 font-medium">{formatCurrency(doc.total)}</td>
                                    <td className="px-6 py-4"><DocumentStatusBadge status={doc.status} /></td>
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
    color: 'green' | 'yellow' | 'blue' | 'red' | 'purple';
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon: Icon, color }) => {
    const colorClasses = {
        green: 'bg-green-100 text-green-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        blue: 'bg-blue-100 text-blue-600',
        red: 'bg-red-100 text-red-600',
        purple: 'bg-purple-100 text-purple-600',
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

interface ActionCardProps {
    title: string;
    description: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    onClick: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, description, icon: Icon, onClick }) => {
    return (
        <button 
            onClick={onClick}
            className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between transition-transform transform hover:-translate-y-1 text-left w-full border-2 border-transparent hover:border-primary"
        >
            <div>
                <p className="text-base font-bold text-secondary">{title}</p>
                 <p className="text-xs text-neutral-dark">{description}</p>
            </div>
            <div className="p-3 rounded-full bg-neutral-light text-secondary">
                <Icon className="w-6 h-6"/>
            </div>
        </button>
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
const TrendingUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
);
const CalculatorIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
);

export default Dashboard;
