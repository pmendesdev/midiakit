import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ShieldCheck,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Database,
  Key,
  LogOut,
  RefreshCw,
  Image as ImageIcon,
  Briefcase,
  Sliders,
  Building2,
  UploadCloud,
  FileText,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Partnership, CompanyLogo } from '../types';
import {
  createPartnership,
  deletePartnership,
  getStoredSupabaseConfig,
  saveStoredSupabaseConfig,
  syncLocalToSupabase,
} from '../lib/supabaseClient';
import { useTheme } from '../context/ThemeContext';
import { useAvatar } from '../context/AvatarContext';
import { useBrandGallery } from '../context/BrandGalleryContext';
import { useProfile } from '../context/ProfileContext';
import { AvatarUploadModal } from './AvatarUploadModal';
import { AddCompanyLogoModal } from './AddCompanyLogoModal';
import { ProfileTextEditor } from './ProfileTextEditor';
import { ChangePasswordModal } from './ChangePasswordModal';

interface AdminDashboardProps {
  partnerships: Partnership[];
  onPartnershipsChange: () => void;
  onBackToPublic: () => void;
  isRemote: boolean;
  remoteError?: string | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  partnerships,
  onPartnershipsChange,
  onBackToPublic,
  isRemote,
  remoteError,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { avatarUrl } = useAvatar();
  const { companies, deleteCompany } = useBrandGallery();
  const { setAuthSession, isAuthorized, verifyPassword } = useProfile();

  // Navigation tab state: 'texts' (requested by user), 'partnerships', 'brands'
  const [adminTab, setAdminTab] = useState<'texts' | 'partnerships' | 'brands'>('texts');

  // Authentication session state (only authorized users inside Admin can edit)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return isAuthorized || localStorage.getItem('jessica_rosa_admin_logged') === 'true';
  });
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Form states
  const [brandName, setBrandName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [campaignDescription, setCampaignDescription] = useState('');
  const [link, setLink] = useState('');
  const [category, setCategory] = useState('Maternidade & Família');
  const [isLogoDragging, setIsLogoDragging] = useState(false);
  const [isLogoProcessing, setIsLogoProcessing] = useState(false);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Selecione um arquivo de imagem válido (PNG, JPG, SVG, WebP).', 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('O arquivo deve ter no máximo 10MB.', 'error');
      return;
    }

    setIsLogoProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as string;
      if (!data) {
        setIsLogoProcessing(false);
        showToast('Erro ao ler a imagem.', 'error');
        return;
      }

      // Optimize image via canvas
      const img = new Image();
      img.onload = () => {
        const maxDim = 600;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const isPng = file.type === 'image/png';
          const optimized = canvas.toDataURL(isPng ? 'image/png' : 'image/jpeg', 0.9);
          setLogoUrl(optimized);
        } else {
          setLogoUrl(data);
        }
        setIsLogoProcessing(false);
        showToast('Logo carregada com sucesso!');
      };
      img.onerror = () => {
        setLogoUrl(data);
        setIsLogoProcessing(false);
      };
      img.src = data;
    };
    reader.readAsDataURL(file);
  };

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<CompanyLogo | null>(null);

  // Credentials config
  const initialConfig = getStoredSupabaseConfig();
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(initialConfig?.url || '');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(initialConfig?.anonKey || '');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPassword) {
      setAuthError('Por favor, digite sua senha de acesso.');
      return;
    }
    if (verifyPassword(loginPassword)) {
      setAuthSession(true);
      setIsAuthenticated(true);
      setAuthError(null);
      setLoginPassword('');
      showToast('Sessão administrativa iniciada com sucesso! Acesso liberado ao painel.');
    } else {
      setAuthError('Senha incorreta. Verifique e tente novamente.');
    }
  };

  const handleLogout = () => {
    setAuthSession(false);
    setIsAuthenticated(false);
    showToast('Você saiu do painel. A edição de textos foi bloqueada.');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim() || !logoUrl.trim() || !campaignDescription.trim()) {
      showToast('Preencha os campos obrigatórios: Nome da Marca, Upload da Logo e Descrição.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createPartnership({
        brand_name: brandName.trim(),
        logo_url: logoUrl.trim(),
        campaign_description: campaignDescription.trim(),
        link: link.trim() || 'https://instagram.com/eujessicarosaa',
        category,
      });

      if (result.error) {
        showToast(`Erro ao salvar: ${result.error}`, 'error');
      } else {
        showToast(
          result.isRemote
            ? 'Parceria inserida com sucesso no banco Supabase!'
            : 'Parceria cadastrada com sucesso!'
        );
        // Reset form
        setBrandName('');
        setLogoUrl('');
        setCampaignDescription('');
        setLink('');
        onPartnershipsChange();
      }
    } catch (err: any) {
      showToast(`Falha na inserção: ${err?.message || 'Erro inesperado'}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Deseja realmente remover a parceria com "${name}"?`)) return;

    setDeletingId(id);
    try {
      const result = await deletePartnership(id);
      if (result.success) {
        showToast(`Parceria "${name}" removida.`);
        onPartnershipsChange();
      } else {
        showToast(`Falha ao remover: ${result.error}`, 'error');
      }
    } catch (err: any) {
      showToast(`Erro: ${err?.message}`, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSyncBulkToSupabase = async () => {
    setIsSubmitting(true);
    try {
      const res = await syncLocalToSupabase();
      if (res.success) {
        showToast(`Sucesso! ${res.count} parceria(s) sincronizada(s) no Supabase com sucesso.`);
        onPartnershipsChange();
      } else {
        showToast(`Falha ao sincronizar com Supabase: ${res.error}`, 'error');
      }
    } catch (err: any) {
      showToast(`Erro: ${err?.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (supabaseUrlInput.trim() && supabaseKeyInput.trim()) {
      saveStoredSupabaseConfig({
        url: supabaseUrlInput.trim(),
        anonKey: supabaseKeyInput.trim(),
      });
      showToast('Credenciais do Supabase salvas. O cliente tentará sincronização em nuvem.');
      setShowConfigModal(false);
      onPartnershipsChange();
    } else {
      saveStoredSupabaseConfig(null);
      showToast('Configurações removidas. Operando no modo local com persistência.');
      setShowConfigModal(false);
      onPartnershipsChange();
    }
  };

  const applyPreset = (preset: { brand: string; logo: string; desc: string; link: string; cat: string }) => {
    setBrandName(preset.brand);
    setLogoUrl(preset.logo);
    setCampaignDescription(preset.desc);
    setLink(preset.link);
    setCategory(preset.cat);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`w-full max-w-md rounded-3xl border p-7 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6 ${
            isDark ? 'border-neutral-800 bg-neutral-900/90' : 'border-neutral-200 bg-white/95'
          }`}
        >
          <div className="text-center space-y-2">
            <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto shadow-sm ${
              isDark ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-rose-50 border-rose-200 text-rose-600'
            }`}>
              <Lock className="w-7 h-7" />
            </div>
            <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              Área Restrita
            </h2>
            <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Digite sua senha para desbloquear a edição de textos, biografia e gerenciamento de parcerias
            </p>
          </div>

          <div className={`p-3 rounded-2xl border text-xs leading-relaxed ${
            isDark
              ? 'bg-neutral-950/60 border-neutral-800 text-neutral-300'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            🔒 <strong>Acesso Protegido por Senha:</strong> Insira a senha cadastrada para autenticar. Você poderá redefini-la a qualquer momento dentro do painel.
          </div>

          {authError && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Senha de Acesso
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  autoFocus
                  placeholder="Digite sua senha de acesso"
                  className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm focus:outline-none focus:border-rose-500 transition-colors ${
                    isDark
                      ? 'bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-600'
                      : 'bg-slate-50 border-slate-200 text-neutral-900 placeholder:text-slate-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title={showLoginPassword ? 'Ocultar senha' : 'Exibir senha'}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-lg shadow-rose-950/30 hover:shadow-rose-900/40 cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Entrar no Painel</span>
            </button>
          </form>

          <div className={`pt-3 border-t text-center flex items-center justify-center text-xs ${
            isDark ? 'border-neutral-800 text-neutral-400' : 'border-neutral-200 text-neutral-600'
          }`}>
            <button
              onClick={onBackToPublic}
              className="hover:underline flex items-center gap-1.5 cursor-pointer text-slate-500 hover:text-rose-500 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao Mídia Kit Público</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl border text-xs font-medium shadow-2xl flex items-center gap-2 ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/40 text-rose-200'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{toast.message}</span>
        </motion.div>
      )}

      {/* Admin Header Navigation */}
      <div className={`flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border backdrop-blur-xl transition-colors ${
        isDark ? 'border-neutral-800 bg-neutral-900/70' : 'border-neutral-200 bg-white/90 shadow-sm'
      }`}>
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToPublic}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isDark
                ? 'text-neutral-400 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 border-neutral-700/60'
                : 'text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 border-neutral-200'
            }`}
            title="Voltar para a página pública"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Gestão de Parcerias
              </h1>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  isRemote
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                }`}
              >
                {isRemote ? '● Supabase Conectado' : '○ Armazenamento Local / Demo'}
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Cadastre marcas, altere campanhas e atualize a vitrine do Mídia Kit
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Edit Texts Button */}
          <button
            onClick={() => setAdminTab('texts')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              adminTab === 'texts'
                ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                : isDark
                ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200'
            }`}
            title="Mudar textos e biografia no painel"
          >
            <FileText className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Mudar Textos</span>
          </button>

          {/* Quick Profile Photo Button */}
          <button
            onClick={() => setShowAvatarModal(true)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              isDark
                ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200'
            }`}
            title="Alterar foto de perfil oficial da Jessica Rosa"
          >
            <img
              src={avatarUrl}
              alt="Foto de Perfil"
              referrerPolicy="no-referrer"
              className="w-4 h-4 rounded-full object-cover grayscale ring-1 ring-rose-500/40"
            />
            <span className="hidden sm:inline">Foto Perfil</span>
          </button>

          {/* Quick Add Brand Logo Button */}
          <button
            onClick={() => {
              setEditingBrand(null);
              setShowBrandModal(true);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              isDark
                ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200'
            }`}
            title="Adicionar ou gerenciar logos de empresas que ela já trabalhou"
          >
            <Building2 className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">+ Logo Empresa</span>
          </button>

          {/* Redefinir Senha Button */}
          <button
            onClick={() => setShowPasswordModal(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isDark
                ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200'
            }`}
            title="Redefinir a senha de acesso ao painel"
          >
            <Key className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Redefinir Senha</span>
          </button>

          <button
            onClick={() => setShowConfigModal(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
              isDark
                ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200'
            }`}
            title="Configurar credenciais do Supabase"
          >
            <Database className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden sm:inline">Supabase Config</span>
          </button>
          <button
            onClick={handleLogout}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isDark
                ? 'text-neutral-400 hover:text-rose-400 bg-neutral-800 hover:bg-neutral-700 border-neutral-700'
                : 'text-neutral-600 hover:text-rose-600 bg-neutral-100 hover:bg-neutral-200 border-neutral-200'
            }`}
            title="Sair do painel administrativo"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Supabase Connection Status & Diagnostic Banner */}
      {isRemote ? (
        <div
          className={`p-3.5 sm:p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
            isDark ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200' : 'border-emerald-300 bg-emerald-50 text-emerald-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <p className="font-bold text-emerald-500">Supabase Conectado e Ativo</p>
              <p className="mt-0.5 opacity-90">
                Seus dados estão sendo lidos e salvos diretamente no banco PostgreSQL em nuvem.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSyncBulkToSupabase}
            disabled={isSubmitting}
            className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer transition-colors disabled:opacity-50"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Sincronizar Dados Locais para Supabase</span>
          </button>
        </div>
      ) : (
        <div
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
            isDark ? 'border-amber-500/30 bg-amber-500/10 text-amber-200' : 'border-amber-300 bg-amber-50 text-amber-900'
          }`}
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-500">Supabase não conectado (Modo Local Ativo)</p>
              <p className="mt-0.5 opacity-90">
                {remoteError ||
                  'As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não foram detectadas na Vercel.'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowConfigModal(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold cursor-pointer transition-colors"
            >
              Configurar Credenciais Supabase
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs Bar */}
      <div className={`p-1.5 rounded-2xl border flex flex-wrap items-center justify-between gap-2 backdrop-blur-xl ${
        isDark ? 'border-neutral-800 bg-neutral-900/60' : 'border-neutral-200 bg-white/90 shadow-xs'
      }`}>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            id="tab-admin-texts"
            type="button"
            onClick={() => setAdminTab('texts')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'texts'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-950/20'
                : isDark
                ? 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Mudar Textos & Perfil</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              adminTab === 'texts' ? 'bg-white/20 text-white' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
            }`}>
              Bio & Tags
            </span>
          </button>

          <button
            id="tab-admin-partnerships"
            type="button"
            onClick={() => setAdminTab('partnerships')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'partnerships'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-950/20'
                : isDark
                ? 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Parcerias & Campanhas ({partnerships.length})</span>
          </button>

          <button
            id="tab-admin-brands"
            type="button"
            onClick={() => setAdminTab('brands')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'brands'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-950/20'
                : isDark
                ? 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Logos de Empresas ({companies.length})</span>
          </button>
        </div>

        <div className="text-[11px] text-neutral-400 px-2 hidden lg:block">
          Modo Administrador • Alterações salvas instantaneamente
        </div>
      </div>

      {/* Tab 1: Profile Text Editor */}
      {adminTab === 'texts' && (
        <ProfileTextEditor />
      )}

      {/* Tab 2: Partnerships Management */}
      {adminTab === 'partnerships' && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column (Client Component) */}
        <div className="lg:col-span-5 space-y-4">
          <div className={`rounded-2xl border p-6 backdrop-blur-xl space-y-5 transition-colors ${
            isDark ? 'border-neutral-800 bg-neutral-900/60' : 'border-neutral-200 bg-white/80 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl ${
                  isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600'
                }`}>
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  Nova Parceria
                </h3>
              </div>
              <span className={`text-[11px] font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Insert DB
              </span>
            </div>

            {/* Quick Test Presets */}
            <div className="space-y-1.5">
              <span className={`text-[11px] font-medium ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Preencher rápido (exemplo):
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    applyPreset({
                      brand: 'Johnson & Johnson Bebê',
                      logo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=400&auto=format&fit=crop',
                      desc: 'Campanha de banho e sono tranquilo com Lucca, demonstrando eficácia da loção anti-irritação.',
                      link: 'https://instagram.com/eujessicarosaa',
                      cat: 'Maternidade & Cuidados',
                    })
                  }
                  className={`px-2 py-0.5 rounded-lg text-[10px] border cursor-pointer ${
                    isDark
                      ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-neutral-700'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-200'
                  }`}
                >
                  + Johnson's
                </button>
                <button
                  type="button"
                  onClick={() =>
                    applyPreset({
                      brand: 'C&A Mães',
                      logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=400&auto=format&fit=crop',
                      desc: 'Provador de roupas mãe e filho para o Dia das Crianças com foco em conforto e estilo.',
                      link: 'https://instagram.com/eujessicarosaa',
                      cat: 'Moda & Família',
                    })
                  }
                  className={`px-2 py-0.5 rounded-lg text-[10px] border cursor-pointer ${
                    isDark
                      ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-neutral-700'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-200'
                  }`}
                >
                  + C&A
                </button>
              </div>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              {/* Brand Name */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  Nome da Marca <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Ex: Natura, Pampers, Riachuelo..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-rose-500 transition-colors ${
                    isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                  }`}
                />
              </div>

              {/* Logo Upload (Sem Link) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`text-xs font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    Logo da Marca (Upload de Arquivo) <span className="text-rose-500">*</span>
                  </label>
                  {logoUrl && (
                    <button
                      type="button"
                      onClick={() => setLogoUrl('')}
                      className="text-[11px] text-rose-500 hover:text-rose-600 hover:underline cursor-pointer"
                    >
                      Remover imagem
                    </button>
                  )}
                </div>

                <div
                  id="admin-partnership-logo-dropzone"
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsLogoDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      handleLogoFileUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsLogoDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsLogoDragging(false);
                  }}
                  onClick={() => logoFileInputRef.current?.click()}
                  className={`relative rounded-2xl border-2 border-dashed p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                    isLogoDragging
                      ? 'border-rose-500 bg-rose-500/10'
                      : isDark
                      ? 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700 hover:bg-neutral-900/60'
                      : 'border-neutral-300 bg-neutral-50 hover:border-neutral-400 hover:bg-neutral-100/80'
                  }`}
                >
                  <input
                    ref={logoFileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp, image/svg+xml"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleLogoFileUpload(e.target.files[0]);
                      }
                    }}
                  />

                  {logoUrl ? (
                    <div className="flex items-center gap-3 w-full p-1">
                      <div className={`w-14 h-14 rounded-xl p-1.5 border flex items-center justify-center overflow-hidden shrink-0 ${
                        isDark ? 'bg-neutral-900 border-neutral-700' : 'bg-white border-neutral-200 shadow-xs'
                      }`}>
                        <img
                          src={logoUrl}
                          alt="Preview logo"
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <p className={`text-xs font-semibold truncate ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>
                          Logo carregada com sucesso
                        </p>
                        <p className="text-[11px] text-rose-500 underline">
                          Clique ou arraste para substituir
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={`p-2.5 rounded-xl ${isDark ? 'bg-neutral-800 text-rose-400' : 'bg-rose-50 text-rose-600'}`}>
                        <UploadCloud className="w-5 h-5 animate-pulse" />
                      </div>
                      <p className={`text-xs font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                        Arraste o arquivo do logo ou <span className="text-rose-500 font-semibold underline">clique para enviar</span>
                      </p>
                      <span className={`text-[10px] ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                        PNG com fundo transparente, JPG, SVG ou WebP (máx. 10MB)
                      </span>
                    </>
                  )}

                  {isLogoProcessing && (
                    <div className="absolute inset-0 rounded-2xl bg-black/60 backdrop-blur-xs flex items-center justify-center">
                      <span className="text-xs font-semibold text-white animate-pulse">
                        Processando imagem...
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  Categoria / Nicho
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-rose-500 transition-colors ${
                    isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                  }`}
                >
                  <option value="Maternidade & Família">Maternidade & Família</option>
                  <option value="Autocuidado & Beleza">Autocuidado & Beleza</option>
                  <option value="Moda & Lifestyle">Moda & Lifestyle</option>
                  <option value="Alimentação & Saúde">Alimentação & Saúde</option>
                  <option value="Casa & Decoração">Casa & Decoração</option>
                  <option value="Infantil & Brinquedos">Infantil & Brinquedos</option>
                </select>
              </div>

              {/* Campaign Description */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  Descrição da Campanha <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={campaignDescription}
                  onChange={(e) => setCampaignDescription(e.target.value)}
                  placeholder="Ex: Ação de Dia das Mães com Stories sequenciais, unboxing de produtos e cupom..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-rose-500 transition-colors resize-none ${
                    isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                  }`}
                />
              </div>

              {/* Campaign Link */}
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  Link da Campanha / Postagem
                </label>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://instagram.com/p/exemplo..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-rose-500 transition-colors ${
                    isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                  }`}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Cadastrando no banco...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Parceria ao Mídia Kit</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* List Column (Tabela com opção de exclusão) */}
        <div className="lg:col-span-7 space-y-4">
          <div className={`rounded-2xl border p-6 backdrop-blur-xl space-y-4 transition-colors ${
            isDark ? 'border-neutral-800 bg-neutral-900/60' : 'border-neutral-200 bg-white/80 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  Parcerias Cadastradas
                </h3>
                <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Gerenciamento em tempo real sincronizado com a tabela `partnerships`
                </p>
              </div>
              <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
                isDark ? 'bg-neutral-800 text-neutral-200' : 'bg-neutral-100 text-neutral-800'
              }`}>
                {partnerships.length} registros
              </span>
            </div>

            {/* Table */}
            {partnerships.length === 0 ? (
              <div className="py-12 text-center rounded-xl border border-dashed border-neutral-700/60 p-6">
                <Briefcase className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  Nenhuma parceria cadastrada no momento.
                </p>
                <p className={`text-[11px] mt-1 ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  Use o formulário ao lado para inserir o primeiro registro.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className={`w-full text-left text-xs ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  <thead className={`font-mono text-[10px] uppercase border-b ${
                    isDark ? 'bg-neutral-950/80 text-neutral-400 border-neutral-800' : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                  }`}>
                    <tr>
                      <th className="px-3 py-2.5 rounded-l-lg">Marca</th>
                      <th className="px-3 py-2.5">Descrição</th>
                      <th className="px-3 py-2.5">Data</th>
                      <th className="px-3 py-2.5 text-right rounded-r-lg">Ação</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-neutral-800/60' : 'divide-neutral-200/80'}`}>
                    {partnerships.map((partner) => (
                      <tr key={partner.id} className={`transition-colors ${
                        isDark ? 'hover:bg-neutral-800/40' : 'hover:bg-neutral-50'
                      }`}>
                        {/* Brand info */}
                        <td className={`px-3 py-3 font-medium flex items-center gap-2.5 ${
                          isDark ? 'text-white' : 'text-neutral-900'
                        }`}>
                          <div className={`w-8 h-8 rounded-lg border p-1 flex items-center justify-center shrink-0 ${
                            isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-neutral-200'
                          }`}>
                            <img
                              src={partner.logo_url}
                              alt={partner.brand_name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <div className="font-bold">{partner.brand_name}</div>
                            {partner.link && (
                              <a
                                href={partner.link}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-rose-500 hover:underline flex items-center gap-0.5"
                              >
                                Link <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        </td>

                        {/* Description */}
                        <td className={`px-3 py-3 max-w-xs ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
                          <p className="line-clamp-2 leading-relaxed">
                            {partner.campaign_description}
                          </p>
                        </td>

                        {/* Date */}
                        <td className={`px-3 py-3 font-mono whitespace-nowrap text-[11px] ${
                          isDark ? 'text-neutral-400' : 'text-neutral-500'
                        }`}>
                          {new Date(partner.created_at).toLocaleDateString('pt-BR')}
                        </td>

                        {/* Delete action */}
                        <td className="px-3 py-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleDelete(partner.id, partner.brand_name)}
                            disabled={deletingId === partner.id}
                            className={`p-1.5 rounded-lg border border-transparent transition-all disabled:opacity-50 cursor-pointer ${
                              isDark
                                ? 'text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20'
                                : 'text-neutral-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200'
                            }`}
                            title="Excluir parceria"
                          >
                            {deletingId === partner.id ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* Brand Logos Management Panel */}
      {adminTab === 'brands' && (
      <div
        className={`rounded-2xl md:rounded-3xl border p-5 sm:p-6 transition-colors space-y-4 ${
          isDark ? 'border-neutral-800 bg-neutral-900/60' : 'border-neutral-200 bg-white shadow-xs'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl ${
                isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600'
              }`}
            >
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  Mural de Empresas & Logos ({companies.length} marcas)
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  Galeria do Mídia Kit
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Empresas parceiras que já trabalharam com Jessica Rosa exibidas na galeria e no carrossel
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setEditingBrand(null);
              setShowBrandModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-all cursor-pointer shadow-sm shadow-rose-950/30"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Nova Logo</span>
          </button>
        </div>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
          {companies.map((comp) => (
            <div
              key={comp.id}
              className={`group relative rounded-2xl border p-3 flex flex-col items-center justify-between text-center transition-all ${
                isDark
                  ? 'border-neutral-800 bg-neutral-950/80 hover:border-neutral-700'
                  : 'border-neutral-200 bg-neutral-50/80 hover:border-neutral-300'
              }`}
            >
              <div className="w-14 h-14 rounded-xl p-2 flex items-center justify-center overflow-hidden mb-2 bg-white/5 border border-neutral-800/20">
                <img
                  src={comp.logoUrl}
                  alt={comp.name}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="w-full">
                <span className={`text-xs font-bold line-clamp-1 block ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>
                  {comp.name}
                </span>
                <span className={`text-[10px] line-clamp-1 block ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  {comp.category}
                </span>
              </div>

              {/* Quick action buttons */}
              <div className="flex items-center gap-1 mt-2.5 pt-2 border-t w-full justify-center border-neutral-800/40">
                <button
                  onClick={() => {
                    setEditingBrand(comp);
                    setShowBrandModal(true);
                  }}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-medium cursor-pointer ${
                    isDark ? 'hover:bg-neutral-800 text-neutral-300' : 'hover:bg-neutral-200 text-neutral-600'
                  }`}
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Remover "${comp.name}" da galeria de marcas?`)) {
                      deleteCompany(comp.id);
                      showToast(`Empresa "${comp.name}" removida da galeria.`);
                    }
                  }}
                  className="text-[10px] px-2 py-0.5 rounded-md font-medium text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Supabase Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4 ${
              isDark ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-rose-500" />
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  Configurar Supabase Cloud
                </h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className={`text-xs ${isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                ✕
              </button>
            </div>

            <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-300' : 'text-neutral-600'}`}>
              Insira a URL e a Chave Pública Anon do seu projeto Supabase para sincronizar diretamente com o banco PostgreSQL. Se deixar em branco, o sistema utilizará o banco simulado com persistência local.
            </p>

            <form onSubmit={handleSaveCredentials} className="space-y-3">
              <div>
                <label className={`block text-[11px] font-mono mb-1 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  SUPABASE_PROJECT_URL
                </label>
                <input
                  type="text"
                  value={supabaseUrlInput}
                  onChange={(e) => setSupabaseUrlInput(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-mono focus:outline-none focus:border-rose-500 ${
                    isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-[11px] font-mono mb-1 ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  SUPABASE_ANON_KEY
                </label>
                <input
                  type="password"
                  value={supabaseKeyInput}
                  onChange={(e) => setSupabaseKeyInput(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className={`w-full px-3 py-2 rounded-xl border text-xs font-mono focus:outline-none focus:border-rose-500 ${
                    isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                  }`}
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className={`px-3 py-1.5 rounded-xl text-xs ${
                    isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
                >
                  Salvar Credenciais
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Avatar Upload Modal accessible in Admin */}
      <AvatarUploadModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
      />

      {/* Add / Edit Company Logo Modal */}
      <AddCompanyLogoModal
        isOpen={showBrandModal}
        onClose={() => {
          setShowBrandModal(false);
          setEditingBrand(null);
        }}
        editingCompany={editingBrand}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={(msg) => showToast(msg, 'success')}
      />
    </div>
  );
};

