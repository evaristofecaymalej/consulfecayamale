
import { Client, FinancialDocument, DocumentStatus, User, Company, DocumentItem, Product, CashFlowEntry, CashFlowType, DocumentType, UserRole } from '../types';

export const MOCK_COMPANY: Company = {
  name: "Gonfeca serviços",
  nif: "005720089HA042",
  address: "Huíla Lubango, Bairro Comercial",
  logoUrl: "/faturfeca-logo.svg",
  email: "gonfecaserviços7@gmail.com",
  contact: "921179574",
  iban: "0040 1373 0134 1016.7 BAI",
  taxRegime: "Regime Simplificado de IVA",
};

export const MOCK_USERS: User[] = [
  { id: 'user-1', name: 'Admin User', email: 'admin@faturfeca.com', role: UserRole.Administrador },
  { id: 'user-2', name: 'Contabilista User', email: 'contabilista@faturfeca.com', role: UserRole.Contabilista },
  { id: 'user-3', name: 'Operador User', email: 'operador@faturfeca.com', role: UserRole.Operador },
];

export const MOCK_CLIENTS: Client[] = [
  { id: 'client-1', name: 'AngoTech', email: 'geral@angotech.ao', nif: '5417000111', address: 'Av. 4 de Fevereiro, Luanda' },
  { id: 'client-2', name: 'Conecta Angola', email: 'compras@conecta.co.ao', nif: '5417000222', address: 'Talatona, Luanda' },
  { id: 'client-3', name: 'Global Services', email: 'financeiro@globalserv.com', nif: '5417000333', address: 'Viana, Luanda' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'prod-1', name: 'Consultoria TI - Hora', description: 'Serviço de consultoria técnica em TI (1 hora)', sellingPrice: 25000, purchasePrice: 15000 },
  { id: 'prod-2', name: 'Desenvolvimento Web - Pacote Básico', description: 'Criação de website institucional básico', sellingPrice: 350000, purchasePrice: 200000 },
  { id: 'prod-3', name: 'Manutenção de Servidor - Mensal', description: 'Contrato de manutenção mensal de servidor', sellingPrice: 80000, purchasePrice: 40000 },
  { id: 'prod-4', name: 'Licença de Software X - Anual', description: 'Licença de utilização anual do Software X', sellingPrice: 150000, purchasePrice: 100000 },
];

// Mock expenses for cash flow demonstration
export const MOCK_EXPENSES: Omit<CashFlowEntry, 'id' | 'type'>[] = [
    { date: '2024-07-05', description: 'Pagamento de Salários', amount: 500000 },
    { date: '2024-07-10', description: 'Aluguel do Escritório', amount: 150000 },
    { date: '2024-06-20', description: 'Compra de Material de Escritório', amount: 35000 },
    { date: '2024-06-05', description: 'Pagamento de Salários', amount: 500000 },
    { date: '2024-05-10', description: 'Conta de Energia e Internet', amount: 45000 },
];


const generateItems = (count: number): {items: DocumentItem[], subtotal: number} => {
    const items: DocumentItem[] = [];
    let subtotal = 0;
    for(let i=1; i<=count; i++) {
        const price = Math.floor(Math.random() * 20000) + 5000;
        const quantity = Math.floor(Math.random() * 5) + 1;
        const total = price * quantity;
        items.push({
            id: `item-${Date.now()}-${i}`,
            description: `Serviço de Consultoria #${i}`,
            quantity,
            price,
            total,
        });
        subtotal += total;
    }
    return {items, subtotal};
};

const createDocument = (id: number, client: Client, issueDate: Date, status: DocumentStatus): FinancialDocument => {
    const { items, subtotal } = generateItems(Math.floor(Math.random() * 4) + 1);
    const vat = subtotal * 0.14;
    const total = subtotal + vat;
    const documentId = `FT 2024/${id.toString().padStart(4, '0')}`;
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + 30);

    const operatorUser = MOCK_USERS.find(u => u.role === UserRole.Operador)!;
    const adminUser = MOCK_USERS.find(u => u.role === UserRole.Administrador)!;
    const creator = id % 3 === 0 ? adminUser : operatorUser;

    return {
        id: documentId,
        documentType: DocumentType.Fatura,
        client,
        issueDate: issueDate.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        items,
        subtotal,
        vat,
        total,
        status,
        operatorId: creator.id,
        operatorName: creator.name,
        qrCodeValue: `${window.location.origin}${window.location.pathname}#/verify/${encodeURIComponent(documentId)}`
    };
};

export const MOCK_DOCUMENTS: FinancialDocument[] = [
    createDocument(1, MOCK_CLIENTS[0], new Date(2024, 6, 15), DocumentStatus.Paga),
    createDocument(2, MOCK_CLIENTS[1], new Date(2024, 6, 20), DocumentStatus.Pendente),
    createDocument(3, MOCK_CLIENTS[2], new Date(2024, 5, 28), DocumentStatus.Paga),
    createDocument(4, MOCK_CLIENTS[0], new Date(2024, 5, 10), DocumentStatus.Paga),
    createDocument(5, MOCK_CLIENTS[1], new Date(2024, 4, 30), DocumentStatus.Paga),
    createDocument(6, MOCK_CLIENTS[2], new Date(2024, 6, 25), DocumentStatus.Pendente),
];