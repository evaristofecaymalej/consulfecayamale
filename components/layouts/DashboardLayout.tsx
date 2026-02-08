
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Header from '../Header';
import { useAppContext } from '../../context/AppContext';
import Calculator from '../Calculator';

const DashboardLayout: React.FC = () => {
  const { isCalculatorOpen, closeCalculator } = useAppContext();

  return (
    <div className="flex h-screen bg-neutral-light font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main
          className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-light"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M0 10h20M10 0v20' stroke='%23dfe1e6' stroke-width='0.5'/%3E%3C/svg%3E")`,
          }}
        >
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>

      {isCalculatorOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-4 w-full max-w-xs relative">
            <button
              onClick={closeCalculator}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              aria-label="Fechar Calculadora"
            >
              <XIcon className="w-6 h-6" />
            </button>
            <Calculator />
          </div>
        </div>
      )}
    </div>
  );
};

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
);


export default DashboardLayout;
