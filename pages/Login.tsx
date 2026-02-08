
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FaturfecaLogo from '../components/FaturfecaLogo';
import { useAppContext } from '../context/AppContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [email, setEmail] = useState('admin@faturfeca.com');
  const [password, setPassword] = useState('password'); // Password is mock
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email);
    if (success) {
      // In a real app, this flag would be set by the auth context
      localStorage.setItem('faturfeca_auth', 'true');
      navigate('/dashboard');
    } else {
      setError('Email não encontrado. Use um dos emails de exemplo.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-light flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-8">
        <div className="text-center">
            <FaturfecaLogo className="justify-center" />
            <p className="mt-2 text-sm text-neutral-dark">
                Bem-vindo ao sistema de faturação para Angola.
            </p>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-secondary">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-neutral-medium rounded-md shadow-sm placeholder-neutral-dark focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="admin@faturfeca.com"
            />
          </div>
          <div>
            <label htmlFor="password"className="text-sm font-medium text-secondary">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-neutral-medium rounded-md shadow-sm placeholder-neutral-dark focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="password"
            />
          </div>
          
          <div className="text-xs p-3 bg-neutral-light rounded-md text-neutral-dark">
            <h4 className="font-bold mb-1">Utilizadores de Exemplo (password: "password")</h4>
            <p><strong>Admin:</strong> admin@faturfeca.com</p>
            <p><strong>Contabilista:</strong> contabilista@faturfeca.com</p>
            <p><strong>Operador:</strong> operador@faturfeca.com</p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
