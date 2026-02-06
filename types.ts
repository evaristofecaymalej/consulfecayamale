
export enum InvoiceStatus {
  Pendente = 'Pendente',
  Paga = 'Paga',
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  nif: string; // Número de Identificação Fiscal
  address: string;
}

export interface Invoice {
  id: string; // Will be a unique, sequential number like "FT 2024/0001"
  client: Client;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  vat: number; // IVA
  total: number;
  status: InvoiceStatus;
  qrCodeValue: string;
  paymentDetails?: {
    method: string;
    confirmationDate: string;
    notes?: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Administrador' | 'Operador';
}

export interface Company {
  name: string;
  nif: string;
  address: string;
  logoUrl?: string;
  email?: string;
  contact?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  sellingPrice: number;
  purchasePrice?: number;
}

export enum CashFlowType {
  Entrada = 'Entrada',
  Saida = 'Saída',
}

export interface CashFlowEntry {
  id: string;
  date: string;
  description: string;
  type: CashFlowType;
  amount: number;
}
