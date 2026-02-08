
import React, { createContext, useContext, useState } from 'react';
import { Client, FinancialDocument, DocumentStatus, User, Company, Product, CashFlowEntry, CashFlowType, DocumentType } from '../types';
import { MOCK_CLIENTS, MOCK_DOCUMENTS, MOCK_USERS, MOCK_COMPANY, MOCK_PRODUCTS, MOCK_EXPENSES } from '../data/mockData';
import useLocalStorage from '../hooks/useLocalStorage';

const DOC_PREFIX_MAP: { [key in DocumentType]: string } = {
  [DocumentType.Fatura]: 'FT',
  [DocumentType.FaturaRecibo]: 'FR',
  [DocumentType.Recibo]: 'RC',
  [DocumentType.Proforma]: 'PF',
  [DocumentType.NotaCredito]: 'NC',
  [DocumentType.NotaDebito]: 'ND',
};

interface AppContextType {
  company: Company;
  currentUser: User | null;
  users: User[];
  clients: Client[];
  documents: FinancialDocument[];
  products: Product[];
  cashFlowEntries: CashFlowEntry[];
  isCalculatorOpen: boolean;
  openCalculator: () => void;
  closeCalculator: () => void;
  login: (email: string) => boolean;
  logout: () => void;
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (client: Client) => void;
  getClientById: (clientId: string) => Client | undefined;
  addDocument: (doc: Omit<FinancialDocument, 'id' | 'qrCodeValue' | 'operatorId' | 'operatorName'>) => FinancialDocument;
  updateDocumentStatus: (docId: string, status: DocumentStatus, paymentDetails?: FinancialDocument['paymentDetails']) => void;
  getDocumentById: (docId: string) => FinancialDocument | undefined;
  getNextDocumentId: (docType: DocumentType) => string;
  addProduct: (product: Omit<Product, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useLocalStorage<Client[]>('faturfeca_clients', MOCK_CLIENTS);
  const [documents, setDocuments] = useLocalStorage<FinancialDocument[]>('faturfeca_documents', MOCK_DOCUMENTS);
  const [products, setProducts] = useLocalStorage<Product[]>('faturfeca_products', MOCK_PRODUCTS);
  const [users, setUsers] = useLocalStorage<User[]>('faturfeca_users', MOCK_USERS);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('faturfeca_user', null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const company = MOCK_COMPANY;

  const openCalculator = () => setIsCalculatorOpen(true);
  const closeCalculator = () => setIsCalculatorOpen(false);

  const login = (email: string): boolean => {
    const user = MOCK_USERS.find(u => u.email === email);
    if(user) {
        setCurrentUser(user);
        return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    // Also remove the auth flag to ensure routes are protected
    localStorage.removeItem('faturfeca_auth'); 
  };

  const getNextDocumentNumber = () => {
    if (documents.length === 0) {
        return 1;
    }
    const lastDocId = documents.reduce((maxId, doc) => {
        // Robust parsing of document number
        const numPart = doc.id.split('/')[1];
        if (numPart) {
            const currentId = parseInt(numPart, 10);
            if (!isNaN(currentId) && currentId > maxId) {
                return currentId;
            }
        }
        return maxId;
    }, 0);
    return lastDocId + 1;
  };

  const getNextDocumentId = (docType: DocumentType) => {
    const nextNumber = getNextDocumentNumber();
    const prefix = DOC_PREFIX_MAP[docType] || 'DOC';
    const year = new Date().getFullYear();
    return `${prefix} ${year}/${nextNumber.toString().padStart(4, '0')}`;
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

  const addDocument = (docData: Omit<FinancialDocument, 'id'|'qrCodeValue' | 'operatorId' | 'operatorName'>) => {
    const newDocId = getNextDocumentId(docData.documentType);
    const newDoc: FinancialDocument = {
      ...docData,
      id: newDocId,
      operatorId: currentUser?.id,
      operatorName: currentUser?.name,
      qrCodeValue: `${window.location.origin}${window.location.pathname}#/verify/${encodeURIComponent(newDocId)}`
    };
    setDocuments(prev => [newDoc, ...prev]);
    return newDoc;
  };

  const updateDocumentStatus = (docId: string, status: DocumentStatus, paymentDetails?: FinancialDocument['paymentDetails']) => {
    setDocuments(prev => prev.map(doc => 
        doc.id === docId 
        ? { ...doc, status, paymentDetails: paymentDetails || doc.paymentDetails } 
        : doc
    ));
  };
  
  const getDocumentById = (docId: string) => {
    return documents.find(doc => doc.id === docId);
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      ...productData,
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const cashFlowEntries: CashFlowEntry[] = [
    ...documents
        .filter(doc => doc.status === DocumentStatus.Paga)
        .map(doc => ({
            id: `in-${doc.id}`,
            date: doc.paymentDetails?.confirmationDate || doc.issueDate,
            description: `Recebimento ${doc.documentType} #${doc.id} (${doc.client.name})`,
            type: CashFlowType.Entrada,
            amount: doc.total,
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
    users,
    clients,
    documents,
    products,
    cashFlowEntries,
    isCalculatorOpen,
    openCalculator,
    closeCalculator,
    login,
    logout,
    addClient,
    updateClient,
    getClientById,
    addDocument,
    updateDocumentStatus,
    getDocumentById,
    getNextDocumentId,
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
