
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import InvoiceStatusBadge from '../components/InvoiceStatusBadge';

const formatCurrency = (amount: number) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(amount);

const ClientDetail: React.FC = () => {
    const { clientId } = useParams<{ clientId: string }>();
    const { getClientById, invoices } = useAppContext();
    const navigate = useNavigate();

    if (!clientId) {
        return <p>ID do cliente não encontrado.</p>;
    }

    const client = getClientById(clientId);
    const clientInvoices = invoices.filter(inv => inv.client.id === clientId);

    if (!client) {
        return <p>Cliente não encontrado.</p>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-secondary">{client.name}</h2>
                <button
                    onClick={() => navigate('/clients')}
                    className="bg-neutral-medium text-secondary px-4 py-2 rounded-lg font-medium hover:bg-neutral-dark hover:text-white transition-colors"
                >
                    Voltar para Clientes
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-secondary border-b pb-3 mb-4">Informações do Cliente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="font-medium text-gray-500">Email</p>
                        <p className="text-gray-800">{client.email}</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-500">NIF</p>
                        <p className="text-gray-800">{client.nif}</p>
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <p className="font-medium text-gray-500">Endereço</p>
                        <p className="text-gray-800">{client.address}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-secondary mb-4">Histórico de Faturas</h3>
                <div className="overflow-x-auto">
                    {clientInvoices.length > 0 ? (
                        <table className="w-full text-sm text-left text-neutral-dark">
                            <thead className="text-xs text-neutral-dark uppercase bg-neutral-light">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Fatura #</th>
                                    <th scope="col" className="px-6 py-3">Data Emissão</th>
                                    <th scope="col" className="px-6 py-3">Data Vencimento</th>
                                    <th scope="col" className="px-6 py-3">Valor</th>
                                    <th scope="col" className="px-6 py-3 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientInvoices.map(invoice => (
                                    <tr key={invoice.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4"><InvoiceStatusBadge status={invoice.status} /></td>
                                        <td className="px-6 py-4 font-medium text-secondary whitespace-nowrap">{invoice.id}</td>
                                        <td className="px-6 py-4">{new Date(invoice.issueDate).toLocaleDateString('pt-PT')}</td>
                                        <td className="px-6 py-4">{new Date(invoice.dueDate).toLocaleDateString('pt-PT')}</td>
                                        <td className="px-6 py-4 font-medium">{formatCurrency(invoice.total)}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Link to={`/invoices/${encodeURIComponent(invoice.id)}`} className="font-medium text-primary hover:underline">
                                                Ver Detalhes
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-neutral-dark text-center py-4">Nenhuma fatura encontrada para este cliente.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientDetail;
