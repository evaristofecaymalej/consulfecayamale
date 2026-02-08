
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import DocumentStatusBadge from '../components/DocumentStatusBadge';
import { DocumentType } from '../types';

const formatCurrency = (amount: number) => new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(amount);

const Documents: React.FC = () => {
  const { documents } = useAppContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const documentTypes = [
    { type: DocumentType.Fatura, label: 'Fatura' },
    { type: DocumentType.FaturaRecibo, label: 'Fatura-Recibo' },
    { type: DocumentType.Recibo, label: 'Recibo Simples' },
    { type: DocumentType.Proforma, label: 'Proforma' },
    { type: DocumentType.NotaCredito, label: 'Nota de Crédito' },
    { type: DocumentType.NotaDebito, label: 'Nota de Débito' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-secondary">Documentos</h2>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-center bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors shadow-sm"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Novo Documento
            <ChevronDownIcon className={`w-5 h-5 ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-neutral-medium">
              <div className="py-1">
                {documentTypes.map(doc => (
                  <Link
                    key={doc.type}
                    to={`/documents/new/${doc.type}`}
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-secondary hover:bg-neutral-light"
                  >
                    {doc.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-neutral-dark">
          <thead className="text-xs text-neutral-dark uppercase bg-neutral-light">
            <tr>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Número</th>
              <th scope="col" className="px-6 py-3">Tipo</th>
              <th scope="col" className="px-6 py-3">Cliente</th>
              <th scope="col" className="px-6 py-3">Data Emissão</th>
              <th scope="col" className="px-6 py-3">Valor</th>
              <th scope="col" className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {documents.map(doc => (
              <tr key={doc.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4"><DocumentStatusBadge status={doc.status} /></td>
                <td className="px-6 py-4 font-medium text-secondary whitespace-nowrap">{doc.id}</td>
                <td className="px-6 py-4 text-xs">{doc.documentType}</td>
                <td className="px-6 py-4">{doc.client.name}</td>
                <td className="px-6 py-4">{new Date(doc.issueDate).toLocaleDateString('pt-PT')}</td>
                <td className="px-6 py-4 font-medium">{formatCurrency(doc.total)}</td>
                <td className="px-6 py-4 text-right">
                  <Link to={`/documents/${encodeURIComponent(doc.id)}`} className="font-medium text-primary hover:underline">
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

const ChevronDownIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

export default Documents;
