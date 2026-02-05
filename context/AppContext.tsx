
import React, { createContext, useContext, useState } from 'react';
import { Client, Invoice, InvoiceStatus, User, Company, Product, CashFlowEntry, CashFlowType } from '../types';
import { MOCK_CLIENTS, MOCK_INVOICES, MOCK_USERS, MOCK_COMPANY, MOCK_PRODUCTS, MOCK_EXPENSES } from '../data/mockData';
import useLocalStorage from '../hooks/useLocalStorage';

interface AppContextType {
  company: Company;
  currentUser: User;
  clients: Client[];
  invoices: Invoice[];
  products: Product[];
  cashFlowEntries: CashFlowEntry[];
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (client: Client) => void;
  getClientById: (clientId: string) => Client | undefined;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'qrCodeValue'>) => Invoice;
  updateInvoiceStatus: (invoiceId: string, status: InvoiceStatus, paymentDetails?: Invoice['paymentDetails']) => void;
  getInvoiceById: (invoiceId: string) => Invoice | undefined;
  getNextInvoiceId: () => string;
  addProduct: (product: Omit<Product, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useLocalStorage<Client[]>('faturfeca_clients', MOCK_CLIENTS);
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>('faturfeca_invoices', MOCK_INVOICES);
  const [products, setProducts] = useLocalStorage<Product[]>('faturfeca_products', MOCK_PRODUCTS);
  const [currentUser] = useState<User>(MOCK_USERS[0]); // Mock logged in user as Admin
  const company = MOCK_COMPANY;

  const getNextInvoiceNumber = () => {
    if (invoices.length === 0) {
        return 1;
    }
    const lastInvoiceId = invoices.reduce((maxId, inv) => {
        const currentId = parseInt(inv.id.split('/')[1], 10);
        return currentId > maxId ? currentId : maxId;
    }, 0);
    return lastInvoiceId + 1;
  };

  const getNextInvoiceId = () => {
    const nextNumber = getNextInvoiceNumber();
    return `FT 2024/${nextNumber.toString().padStart(4, '0')}`;
  };

  const addClient = (clientData: Omit<Client, 'id'>) => {
    const newClient: Client = {
      id: `client-${Date.now()}`,
      ...clientData,
    };
    setClients(prev => [...prev, newClient]);
  };

  const updateClient = (updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  };
  
  const getClientById = (clientId: string) => {
    return clients.find(c => c.id === clientId);
  };

  const addInvoice = (invoiceData: Omit<Invoice, 'id'|'qrCodeValue'>) => {
    const newInvoiceId = getNextInvoiceId();
    const newInvoice: Invoice = {
      ...invoiceData,
      id: newInvoiceId,
      qrCodeValue: `${window.location.origin}${window.location.pathname}#/verify/${encodeURIComponent(newInvoiceId)}`
    };
    setInvoices(prev => [newInvoice, ...prev]);
    return newInvoice;
  };

  const updateInvoiceStatus = (invoiceId: string, status: InvoiceStatus, paymentDetails?: Invoice['paymentDetails']) => {
    setInvoices(prev => prev.map(inv => 
        inv.id === invoiceId 
        ? { ...inv, status, paymentDetails: paymentDetails || inv.paymentDetails } 
        : inv
    ));
  };
  
  const getInvoiceById = (invoiceId: string) => {
    return invoices.find(inv => inv.id === invoiceId);
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      ...productData,
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const cashFlowEntries: CashFlowEntry[] = [
    ...invoices
        .filter(inv => inv.status === InvoiceStatus.Paga)
        .map(inv => ({
            id: `in-${inv.id}`,
            date: inv.paymentDetails?.confirmationDate || inv.issueDate,
            description: `Recebimento Fatura #${inv.id} (${inv.client.name})`,
            type: CashFlowType.Entrada,
            amount: inv.total,
        })),
    ...MOCK_EXPENSES.map((exp, index) => ({
        ...exp,
        id: `out-${index}`,
        type: CashFlowType.Saida,
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const value: AppContextType = {
    company,
    currentUser,
    clients,
    invoices,
    products,
    cashFlowEntries,
    addClient,
    updateClient,
    getClientById,
    addInvoice,
    updateInvoiceStatus,
    getInvoiceById,
    getNextInvoiceId,
    addProduct,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
