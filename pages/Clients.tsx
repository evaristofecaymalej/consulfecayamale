
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Client, UserRole } from '../types';

const Clients: React.FC = () => {
    const { clients, addClient, currentUser } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newClient, setNewClient] = useState<Omit<Client, 'id'>>({ name: '', email: '', nif: '', address: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewClient(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newClient.name && newClient.nif) {
            addClient(newClient);
            setIsModalOpen(false);
            setNewClient({ name: '', email: '', nif: '', address: '' });
        }
    };

    const canEdit = currentUser?.role === UserRole.Administrador || currentUser?.role === UserRole.Operador;

    return (
        <>
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-secondary">Clientes</h2>
                    {canEdit && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center justify-center bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors shadow-sm"
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Novo Cliente
                        </button>
                    )}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-neutral-dark">
                        <thead className="text-xs text-neutral-dark uppercase bg-neutral-light">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nome</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">NIF</th>
                                <th scope="col" className="px-6 py-3">Endereço</th>
                                {canEdit && <th scope="col" className="px-6 py-3 text-right">Ações</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map(client => (
                                <tr key={client.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-secondary">
                                        <Link to={`/clients/${client.id}`} className="hover:underline">
                                            {client.name}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">{client.email}</td>
                                    <td className="px-6 py-4">{client.nif}</td>
                                    <td className="px-6 py-4">{client.address}</td>
                                    {canEdit && (
                                        <td className="px-6 py-4 text-right">
                                            <button className="font-medium text-primary hover:underline">Editar</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                        <h3 className="text-lg font-bold text-secondary mb-4">Adicionar Novo Cliente</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nome Completo / Empresa</label>
                                <input type="text" name="name" value={newClient.name} onChange={handleInputChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" name="email" value={newClient.email} onChange={handleInputChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">NIF (Número de Identificação Fiscal)</label>
                                <input type="text" name="nif" value={newClient.nif} onChange={handleInputChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Endereço</label>
                                <input type="text" name="address" value={newClient.address} onChange={handleInputChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cancelar</button>
                                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-700">Adicionar Cliente</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

export default Clients;
