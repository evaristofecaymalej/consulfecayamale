
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import InvoiceStatusBadge from '../components/InvoiceStatusBadge';

const formatCurrency = (amount: number) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(amount);

const Invoices: React.FC = () => {
  const { invoices } = useAppContext();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-secondary">Faturas</h2>
        <Link
          to="/invoices/new"
          className="flex items-center justify-center bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors shadow-sm"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Criar Fatura
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-neutral-dark">
          <thead className="text-xs text-neutral-dark uppercase bg-neutral-light">
            <tr>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Fatura #</th>
              <th scope="col" className="px-6 py-3">Cliente</th>
              <th scope="col" className="px-6 py-3">Data Emissão</th>
              <th scope="col" className="px-6 py-3">Data Vencimento</th>
              <th scope="col" className="px-6 py-3">Valor</th>
              <th scope="col" className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <tr key={invoice.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4"><InvoiceStatusBadge status={invoice.status} /></td>
                <td className="px-6 py-4 font-medium text-secondary whitespace-nowrap">{invoice.id}</td>
                <td className="px-6 py-4">{invoice.client.name}</td>
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
      </div>
    </div>
  );
};

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

export default Invoices;
