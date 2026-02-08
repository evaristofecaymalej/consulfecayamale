
export enum DocumentType {
  Fatura = 'Fatura',
  FaturaRecibo = 'Fatura-Recibo',
  Recibo = 'Recibo Simples',
  Proforma = 'Proforma',
  NotaCredito = 'Nota de Crédito',
  NotaDebito = 'Nota de Débito',
}

export enum DocumentStatus {
  Pendente = 'Pendente',
  Paga = 'Paga',
  Anulada = 'Anulada',
}

export enum UserRole {
  Administrador = 'Administrador',
  Contabilista = 'Contabilista',
  Operador = 'Operador',
}

export interface DocumentItem {
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

export interface FinancialDocument {
  id: string; // Will be a unique, sequential number like "FT 2024/0001"
  documentType: DocumentType;
  client: Client;
  issueDate: string;
  dueDate: string;
  items: DocumentItem[];
  subtotal: number;
  vat: number; // IVA
  total: number;
  status: DocumentStatus;
  qrCodeValue: string;
  operatorId?: string;
  operatorName?: string;
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
  role: UserRole;
}

export interface Company {
  name: string;
  nif: string;
  address: string;
  logoUrl?: string;
  email?: string;
  contact?: string;
  iban?: string;
  taxRegime?: string;
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