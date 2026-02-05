
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { InvoiceStatus } from '../types';
import FaturfecaLogo from '../components/FaturfecaLogo';

const PublicVerification: React.FC = () => {
    const { invoiceId } = useParams<{ invoiceId: string }>();
    const { getInvoiceById } = useAppContext();
    
    if (!invoiceId) {
        return <VerificationWrapper>ID da fatura inválido.</VerificationWrapper>;
    }
    
    const invoice = getInvoiceById(decodeURIComponent(invoiceId));

    if (!invoice) {
        return <VerificationWrapper><ErrorState /></VerificationWrapper>;
    }

    return (
        <VerificationWrapper>
            {invoice.status === InvoiceStatus.Paga ? <SuccessState invoice={invoice} /> : <PendingState invoice={invoice} />}
        </VerificationWrapper>
    );
};

const VerificationWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="min-h-screen bg-neutral-light flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg text-center">
            <FaturfecaLogo className="justify-center mb-8" />
            <div className="bg-white rounded-xl shadow-lg p-8">
                {children}
            </div>
            <p className="text-xs text-neutral-dark mt-4">Faturfeca - Sistema de Faturação Eletrónica para Angola.</p>
        </div>
    </div>
);

const SuccessState: React.FC<{invoice: any}> = ({ invoice }) => (
    <>
        <div className="mx-auto bg-green-100 rounded-full h-16 w-16 flex items-center justify-center">
            <CheckIcon className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-secondary">Fatura Autêntica e Paga</h2>
        <p className="mt-2 text-neutral-dark">A fatura <span className="font-semibold text-secondary">{invoice.id}</span> emitida para <span className="font-semibold text-secondary">{invoice.client.name}</span> foi validada com sucesso e encontra-se paga.</p>
        <div className="mt-6 text-left bg-green-50 p-4 rounded-lg border border-green-200">
             <p><span className="font-semibold">Valor:</span> {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(invoice.total)}</p>
            <p><span className="font-semibold">Data de Emissão:</span> {new Date(invoice.issueDate).toLocaleDateString('pt-PT')}</p>
        </div>
    </>
);

const PendingState: React.FC<{invoice: any}> = ({ invoice }) => (
    <>
        <div className="mx-auto bg-yellow-100 rounded-full h-16 w-16 flex items-center justify-center">
            <ClockIcon className="h-8 w-8 text-yellow-600" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-secondary">Fatura Autêntica - Pagamento Pendente</h2>
        <p className="mt-2 text-neutral-dark">A fatura <span className="font-semibold text-secondary">{invoice.id}</span> emitida para <span className="font-semibold text-secondary">{invoice.client.name}</span> é autêntica, mas aguarda confirmação de pagamento.</p>
        <div className="mt-6 text-left bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p><span className="font-semibold">Valor:</span> {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(invoice.total)}</p>
            <p><span className="font-semibold">Data de Vencimento:</span> {new Date(invoice.dueDate).toLocaleDateString('pt-PT')}</p>
        </div>
    </>
);

const ErrorState: React.FC = () => (
    <>
        <div className="mx-auto bg-red-100 rounded-full h-16 w-16 flex items-center justify-center">
            <XIcon className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-secondary">Fatura Inválida</h2>
        <p className="mt-2 text-neutral-dark">Não foi possível encontrar uma fatura correspondente a este código. Por favor, verifique o QR Code e tente novamente.</p>
    </>
);


const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
);
const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);


export default PublicVerification;
