import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  Syringe,
  TrendingDown,
  Droplets,
  HeartPulse,
  Sparkles,
  FileSpreadsheet,
} from 'lucide-react';
import { UserProfile } from '../types';

interface AuthScreenProps {
  onLoginSuccess: (user: Partial<UserProfile>) => void;
  defaultEmail?: string;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  defaultEmail = 'fsbar79@gmail.com',
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState('segredo123');
  const [name, setName] = useState('Fernanda Barreto');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor informe seu e-mail e senha.');
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
    <div className="min-h-screen bg-gradient-to-b from-[#082B55] via-[#0b386e] to-[#082B55] flex flex-col justify-between p-4 sm:p-6 text-white selection:bg-[#00C9D7]/20 selection:text-[#082B55]">
      {/* Decorative Glow Elements */}
      <div className="fixed top-12 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#00C9D7]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-10 right-4 w-60 h-60 bg-[#35D68A]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header / Branding */}
      <div className="w-full max-w-sm mx-auto pt-6 sm:pt-8 text-center relative z-10">
        <div className="inline-block relative">
          <img
            src="/assets/aistudio/image_00222cc8.png"
            alt="GLP360 Logo"
            className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-3xl shadow-2xl ring-2 ring-white/20 object-cover transform hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#00C9D7] text-[#082B55] shadow-md">
            Saúde & IA
          </span>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-white mt-4">
          GLP360
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xs mx-auto leading-relaxed">
          Monitor de Injeções, Saúde & Nutrição IA para Pacientes em Terapia GLP-1
        </p>
      </div>

      {/* Login & Password Form Container */}
      <div className="w-full max-w-sm mx-auto my-6 bg-white text-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/20 relative z-10 backdrop-blur-xl">
        {/* Toggle between Entrar and Cadastrar */}
        <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              !isRegister
                ? 'bg-[#082B55] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
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
                ? 'bg-[#082B55] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Criar Conta
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
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
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00C9D7]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              E-MAIL DE ACESSO
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00C9D7]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-600">
                SENHA
              </label>
              {!isRegister && (
                <span className="text-[10px] text-slate-400">segredo123</span>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00C9D7]"
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
            <p className="text-xs text-rose-500 font-semibold">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-[#082B55] hover:bg-[#082B55]/90 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-[#082B55]/25 transition-all active:scale-[0.98] mt-1"
          >
            {isRegister ? 'Cadastrar e Iniciar' : 'Entrar no GLP360'}
          </button>
        </form>

        {/* Demo Fast Access */}
        <div className="mt-4 pt-4 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-3 bg-[#00C9D7]/15 hover:bg-[#00C9D7]/25 text-[#082B55] rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <ShieldCheck className="w-4 h-4 text-[#00C9D7]" />
            Entrar como Paciente Demo (Acesso Rápido)
          </button>
          <p className="text-[10px] text-slate-400 mt-2">
            Carrega instantaneamente dados clínicos e histórico demonstrativo.
          </p>
        </div>
      </div>

      {/* Feature Highlights Footer Bar */}
      <div className="w-full max-w-sm mx-auto pb-4 relative z-10">
        <div className="grid grid-cols-3 gap-2 text-center text-slate-300 text-[10px]">
          <div className="p-2 bg-white/5 rounded-xl border border-white/10">
            <Syringe className="w-3.5 h-3.5 text-[#00C9D7] mx-auto mb-1" />
            <span>Doses & Sítios</span>
          </div>
          <div className="p-2 bg-white/5 rounded-xl border border-white/10">
            <TrendingDown className="w-3.5 h-3.5 text-[#35D68A] mx-auto mb-1" />
            <span>Gráficos de Linha</span>
          </div>
          <div className="p-2 bg-white/5 rounded-xl border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-[#00C9D7] mx-auto mb-1" />
            <span>Nutrição com IA</span>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 text-center mt-3 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3 text-[#35D68A]" />
          Privacidade e sigilo de dados em conformidade médica
        </p>
      </div>
    </div>
  );
};
