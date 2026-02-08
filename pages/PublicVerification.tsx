
import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { DocumentStatus } from '../types';
import FaturfecaLogo from '../components/FaturfecaLogo';

const PublicVerification: React.FC = () => {
    const { documentId } = useParams<{ documentId: string }>();
    const { getDocumentById } = useAppContext();
    
    if (!documentId) {
        return <VerificationWrapper>ID do documento inválido.</VerificationWrapper>;
    }
    
    const doc = getDocumentById(decodeURIComponent(documentId));

    if (!doc) {
        return <VerificationWrapper><ErrorState /></VerificationWrapper>;
    }

    return (
        <VerificationWrapper>
            {doc.status === DocumentStatus.Paga ? <SuccessState doc={doc} /> : <PendingState doc={doc} />}
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

const SuccessState: React.FC<{doc: any}> = ({ doc }) => (
    <>
        <div className="mx-auto bg-green-100 rounded-full h-16 w-16 flex items-center justify-center">
            <CheckIcon className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-secondary">Documento Autêntico e Pago</h2>
        <p className="mt-2 text-neutral-dark">O documento <span className="font-semibold text-secondary">{doc.id}</span> ({doc.documentType}) emitido para <span className="font-semibold text-secondary">{doc.client.name}</span> foi validado e encontra-se pago.</p>
        <div className="mt-6 text-left bg-green-50 p-4 rounded-lg border border-green-200">
             <p><span className="font-semibold">Valor:</span> {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(doc.total)}</p>
            <p><span className="font-semibold">Data de Emissão:</span> {new Date(doc.issueDate).toLocaleDateString('pt-PT')}</p>
        </div>
    </>
);

const PendingState: React.FC<{doc: any}> = ({ doc }) => (
    <>
        <div className="mx-auto bg-yellow-100 rounded-full h-16 w-16 flex items-center justify-center">
            <ClockIcon className="h-8 w-8 text-yellow-600" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-secondary">Documento Autêntico - Pendente</h2>
        <p className="mt-2 text-neutral-dark">O documento <span className="font-semibold text-secondary">{doc.id}</span> ({doc.documentType}) emitido para <span className="font-semibold text-secondary">{doc.client.name}</span> é autêntico, mas aguarda regularização.</p>
        <div className="mt-6 text-left bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p><span className="font-semibold">Valor:</span> {new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(doc.total)}</p>
            <p><span className="font-semibold">Data de Vencimento:</span> {new Date(doc.dueDate).toLocaleDateString('pt-PT')}</p>
        </div>
    </>
);

const ErrorState: React.FC = () => (
    <>
        <div className="mx-auto bg-red-100 rounded-full h-16 w-16 flex items-center justify-center">
            <XIcon className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-secondary">Documento Inválido</h2>
        <p className="mt-2 text-neutral-dark">Não foi possível encontrar um documento correspondente a este código. Por favor, verifique o QR Code e tente novamente.</p>
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
