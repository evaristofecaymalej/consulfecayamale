
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Header: React.FC = () => {
  const { currentUser } = useAppContext();
  return (
    <header className="h-20 bg-white border-b border-neutral-medium flex items-center justify-between px-6">
      <div>
        <h1 className="text-xl font-bold text-secondary">Olá, {currentUser.name.split(' ')[0]}</h1>
        <p className="text-sm text-neutral-dark">Bem-vindo(a) de volta!</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon className="w-5 h-5 text-neutral-dark" />
          </span>
          <input
            type="text"
            placeholder="Procurar fatura..."
            className="w-full pl-10 pr-4 py-2 border border-neutral-medium rounded-lg bg-neutral-light focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
        <Link
          to="/invoices/new"
          className="flex items-center justify-center bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors shadow-sm"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Nova Fatura
        </Link>
      </div>
    </header>
  );
};

// SVG Icon Components
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

export default Header;
