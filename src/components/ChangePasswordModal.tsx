import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key, Lock, Eye, EyeOff, Check, AlertCircle, RefreshCw, X, ShieldCheck } from 'lucide-react';
import { useProfile, DEFAULT_ADMIN_PASSWORD } from '../context/ProfileContext';
import { useTheme } from '../context/ThemeContext';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { updatePassword, resetPasswordToDefault } = useProfile();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isResettingDefault, setIsResettingDefault] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentPassword) {
      setError('Por favor, informe a senha atual.');
      return;
    }

    if (!newPassword || newPassword.trim().length < 4) {
      setError('A nova senha deve ter no mínimo 4 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('A confirmação da senha não coincide com a nova senha digitada.');
      return;
    }

    const res = updatePassword(currentPassword, newPassword);
    if (!res.success) {
      setError(res.message);
      return;
    }

    // Success
    onSuccess('Senha alterada com sucesso! Utilize sua nova senha nos próximos acessos.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  const handleResetDefault = () => {
    resetPasswordToDefault();
    onSuccess(`Senha redefinida para a padrão (${DEFAULT_ADMIN_PASSWORD}) com sucesso!`);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsResettingDefault(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className={`relative w-full max-w-md rounded-3xl border p-6 sm:p-7 shadow-2xl transition-colors ${
            isDark
              ? 'bg-neutral-900 border-neutral-800 text-white'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-5 right-5 p-1.5 rounded-xl border transition-colors cursor-pointer ${
              isDark
                ? 'border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-800'
                : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                isDark
                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  : 'bg-rose-50 border-rose-100 text-rose-600'
              }`}
            >
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Redefinir Senha</h2>
              <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                Altere a senha de acesso à Área Restrita do Mídia Kit
              </p>
            </div>
          </div>

          {/* Alert / Current Default Notice */}
          <div
            className={`p-3 rounded-2xl border text-xs mb-4 flex items-start gap-2.5 ${
              isDark
                ? 'bg-neutral-950/60 border-neutral-800 text-neutral-300'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block">Segurança do Painel</span>
              <span className="text-[11px] leading-relaxed block">
                A senha padrão inicial é <code className="font-mono text-rose-500 font-bold px-1 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">JessicaCretinaS2</code>. Você pode alterá-la para qualquer senha que preferir.
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                Senha Atual
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Digite a senha atual (padrão: JessicaCretinaS2)"
                  className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:border-rose-500 transition-colors ${
                    isDark
                      ? 'bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-600'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer`}
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Digite a nova senha desejada"
                  className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:border-rose-500 transition-colors ${
                    isDark
                      ? 'bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-600'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer`}
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  className={`w-full pl-3.5 pr-10 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:border-rose-500 transition-colors ${
                    isDark
                      ? 'bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-600'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer`}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsResettingDefault(!isResettingDefault)}
                className="text-[11px] text-slate-400 hover:text-rose-500 transition-colors cursor-pointer underline underline-offset-2"
              >
                Restaurar padrão
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                    isDark
                      ? 'border-neutral-700 hover:bg-neutral-800 text-neutral-300'
                      : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md shadow-rose-950/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Salvar Nova Senha</span>
                </button>
              </div>
            </div>

            {isResettingDefault && (
              <div
                className={`p-3 rounded-xl border text-xs space-y-2 mt-2 ${
                  isDark
                    ? 'bg-rose-950/30 border-rose-900/50 text-rose-300'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                <p className="font-semibold text-[11px]">
                  Deseja realmente redefinir a senha para o valor padrão inicial <code className="font-mono font-bold">JessicaCretinaS2</code>?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetDefault}
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer"
                  >
                    Confirmar Restauração
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsResettingDefault(false)}
                    className="px-3 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
