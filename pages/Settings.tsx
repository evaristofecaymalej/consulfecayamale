
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { UserRole, DocumentStatus } from '../types';
import FaturfecaLogo from '../components/FaturfecaLogo';

const formatCurrency = (amount: number) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(amount);

const SettingsCard: React.FC<{ title: string; children: React.ReactNode; buttonLabel: string; }> = ({ title, children, buttonLabel }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between h-full">
        <div>
            <h3 className="text-lg font-semibold text-secondary">{title}</h3>
            <div className="mt-2 text-sm text-neutral-dark">
                {children}
            </div>
        </div>
        <div className="mt-6">
            <button className="w-full text-sm font-medium text-primary border border-primary rounded-lg py-2 hover:bg-primary-50 transition-colors">
                {buttonLabel}
            </button>
        </div>
    </div>
);


const Settings: React.FC = () => {
    const { company, users, documents } = useAppContext();

    const operatorsWithStats = users
        .filter(user => user.role === UserRole.Operador || user.role === UserRole.Administrador)
        .map(operator => {
            const operatorDocs = documents.filter(doc => doc.operatorId === operator.id);
            const paidDocs = operatorDocs.filter(doc => doc.status === DocumentStatus.Paga);
            const pendingDocs = operatorDocs.filter(doc => doc.status === DocumentStatus.Pendente);

            const totalVendas = paidDocs.reduce((sum, doc) => sum + doc.total, 0);
            const totalPendente = pendingDocs.reduce((sum, doc) => sum + doc.total, 0);

            return {
                id: operator.id,
                name: operator.name,
                role: operator.role,
                docsCount: operatorDocs.length,
                totalVendas,
                totalPendente,
            };
        })
        .sort((a, b) => b.totalVendas - a.totalVendas);

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-secondary">Configurações</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex justify-between items-center border-b pb-3 mb-4">
                            <h3 className="text-lg font-semibold text-secondary">Dados da Empresa</h3>
                            <button className="flex items-center gap-2 text-sm font-medium bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-600 transition-colors shadow-sm">
                                <PencilIcon className="w-4 h-4" />
                                Editar Dados
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-500">Logotipo</label>
                                <div className="mt-1 flex items-center gap-4 p-3 bg-neutral-light rounded-lg">
                                    <FaturfecaLogo />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Nome da Empresa</label>
                                <p className="mt-1 text-sm text-gray-800 font-semibold">{company.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">NIF</label>
                                <p className="mt-1 text-sm text-gray-800 font-semibold">{company.nif}</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-500">Endereço</label>
                                <p className="mt-1 text-sm text-gray-800 font-semibold">{company.address}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Dados Bancários (IBAN)</label>
                                <p className="mt-1 text-sm text-gray-800 font-semibold">{company.iban}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Regime Fiscal</label>
                                <p className="mt-1 text-sm text-gray-800 font-semibold">{company.taxRegime}</p>
                            </div>
                        </div>
                    </div>
                    
                     <div className="bg-white rounded-xl shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-secondary border-b pb-3 mb-4">Vendas por Operador</h3>
                         <p className="text-sm text-neutral-dark mb-4">
                            Análise do desempenho de vendas para cada operador de caixa e administrador que emite documentos.
                         </p>
                         <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-neutral-dark">
                                <thead className="text-xs text-neutral-dark uppercase bg-neutral-light">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Operador</th>
                                        <th scope="col" className="px-6 py-3">Cargo</th>
                                        <th scope="col" className="px-6 py-3 text-center">Documentos Criados</th>
                                        <th scope="col" className="px-6 py-3 text-right">Total Vendido (Pago)</th>
                                        <th scope="col" className="px-6 py-3 text-right">Valor Pendente</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {operatorsWithStats.map(stat => (
                                        <tr key={stat.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-secondary">{stat.name}</td>
                                            <td className="px-6 py-4">{stat.role}</td>
                                            <td className="px-6 py-4 text-center">{stat.docsCount}</td>
                                            <td className="px-6 py-4 text-right font-semibold text-green-600">{formatCurrency(stat.totalVendas)}</td>
                                            <td className="px-6 py-4 text-right font-medium text-yellow-600">{formatCurrency(stat.totalPendente)}</td>
                                        </tr>
                                    ))}
                                     {operatorsWithStats.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center py-4 text-neutral-dark">Nenhum dado de operador para exibir.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-8">
                    <SettingsCard title="Gestão de Moedas" buttonLabel="Gerir Moedas">
                        <p>Moeda principal: <span className="font-semibold text-secondary">Euro (€)</span></p>
                    </SettingsCard>
                    <SettingsCard title="Unidades de Medida" buttonLabel="Gerir Unidades">
                        <p>Unidades definidas: <span className="font-semibold text-secondary">Unidade, Hora, Mês, Kg...</span></p>
                    </SettingsCard>
                     <SettingsCard title="Categorias de Produtos" buttonLabel="Gerir Categorias">
                        <p>Organize os seus produtos e serviços em categorias para melhor análise.</p>
                    </SettingsCard>
                     <SettingsCard title="Tabela de Preços" buttonLabel="Gerir Preços">
                        <p>Crie diferentes tabelas de preços para clientes ou épocas específicas.</p>
                    </SettingsCard>
                </div>
            </div>
        </div>
    );
};

const PencilIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

export default Settings;
