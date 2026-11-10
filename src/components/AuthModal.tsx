import React, { useState } from 'react';
import { Lock, Mail, User, Eye, EyeOff, ShieldCheck, Activity } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onLoginSuccess: (user: Partial<UserProfile>) => void;
  defaultEmail?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onLoginSuccess,
  defaultEmail = 'fsbar79@gmail.com',
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState('segredo123');
  const [name, setName] = useState('Fernanda Barreto');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor preencha e-mail e senha.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve conter no mínimo 6 caracteres.');
      return;
    }
    setError('');
    onLoginSuccess({
      email,
      name: isRegister ? name : (name || email.split('@')[0]),
      isAuthenticated: true,
    });
  };

  const handleDemoLogin = () => {
    setEmail('fsbar79@gmail.com');
    setName('Fernanda Barreto');
    onLoginSuccess({
      email: 'fsbar79@gmail.com',
      name: 'Fernanda Barreto',
      isAuthenticated: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#082B55]/70 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
        {/* Brand Header */}
        <div className="bg-[#082B55] p-6 text-center text-white relative">
          <img
            src="/assets/aistudio/image_00222cc8.png"
            alt="GLP360 Logo"
            className="w-16 h-16 mx-auto mb-3 rounded-2xl shadow-lg ring-1 ring-white/20 object-cover"
          />
          <h2 className="text-xl font-extrabold tracking-tight">GLP360</h2>
          <p className="text-xs text-slate-300 mt-1">
            Monitor de Injeções, Saúde & Nutrição IA
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                !isRegister
                  ? 'bg-white text-[#082B55] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                isRegister
                  ? 'bg-white text-[#082B55] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Criar Conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isRegister && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  SEU NOME COMPLETO
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Fernanda Barreto"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#00C9D7]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                E-MAIL DO PACIENTE
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#00C9D7]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                SENHA DE ACESSO
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#00C9D7]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-rose-500 font-medium">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#082B55] hover:bg-[#082B55]/90 text-white rounded-xl text-xs font-bold shadow-md shadow-[#082B55]/20 transition-all active:scale-[0.98]"
            >
              {isRegister ? 'Criar Minha Conta Segura' : 'Entrar no Aplicativo'}
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 px-3 bg-[#00C9D7]/10 hover:bg-[#00C9D7]/20 text-[#082B55] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#00C9D7]" />
              Entrar como Paciente Demo (Acesso Rápido)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
