
import React from 'react';
import { useAppContext } from '../context/AppContext';

const Settings: React.FC = () => {
    const { company } = useAppContext();

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-secondary">Configurações</h2>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-secondary border-b pb-3 mb-4">Dados da Empresa</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-600">Nome da Empresa</label>
                        <input type="text" value={company.name} readOnly className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm sm:text-sm" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-600">NIF</label>
                        <input type="text" value={company.nif} readOnly className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm sm:text-sm" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-600">Endereço</label>
                        <input type="text" value={company.address} readOnly className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm sm:text-sm" />
                    </div>
                    {company.email && (
                        <div>
                            <label className="text-sm font-medium text-gray-600">Email</label>
                            <input type="text" value={company.email} readOnly className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm sm:text-sm" />
                        </div>
                    )}
                    {company.contact && (
                        <div>
                            <label className="text-sm font-medium text-gray-600">Contacto</label>
                            <input type="text" value={company.contact} readOnly className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm sm:text-sm" />
                        </div>
                    )}
                </div>
            </div>
            
             <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-secondary border-b pb-3 mb-4">Gestão de Utilizadores</h3>
                 <p className="text-sm text-gray-600">
                    Funcionalidade de gestão de utilizadores (administrador, operador), logs de ações e permissões seria implementada aqui, conectada a um backend seguro.
                 </p>
            </div>
            
             <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-secondary border-b pb-3 mb-4">Backups e Segurança</h3>
                 <p className="text-sm text-gray-600">
                    Configurações para backups automáticos e outras medidas de segurança seriam geridas nesta secção.
                 </p>
            </div>
        </div>
    );
};

export default Settings;
