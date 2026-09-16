import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UploadCloud,
  X,
  Building2,
  Tag,
  FileText,
  Calendar,
  Globe,
  Check,
  AlertCircle,
  Layers,
} from 'lucide-react';
import { useBrandGallery } from '../context/BrandGalleryContext';
import { useTheme } from '../context/ThemeContext';
import { COMPANY_CATEGORIES } from '../data/companyLogosData';
import { CompanyLogo } from '../types';

interface AddCompanyLogoModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingCompany?: CompanyLogo | null;
}

export const AddCompanyLogoModal: React.FC<AddCompanyLogoModalProps> = ({
  isOpen,
  onClose,
  editingCompany,
}) => {
  const { addCompany, updateCompany, processLogoFile } = useBrandGallery();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [name, setName] = useState(editingCompany?.name || '');
  const [logoUrl, setLogoUrl] = useState(editingCompany?.logoUrl || '');
  const [category, setCategory] = useState(editingCompany?.category || 'Maternidade & Bebê');
  const [campaignDescription, setCampaignDescription] = useState(
    editingCompany?.campaignDescription || ''
  );
  const [deliverables, setDeliverables] = useState(editingCompany?.deliverables || '');
  const [year, setYear] = useState(editingCompany?.year || '2025 - 2026');
  const [website, setWebsite] = useState(editingCompany?.website || '');

  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if editingCompany changes
  React.useEffect(() => {
    if (editingCompany) {
      setName(editingCompany.name);
      setLogoUrl(editingCompany.logoUrl);
      setCategory(editingCompany.category);
      setCampaignDescription(editingCompany.campaignDescription || '');
      setDeliverables(editingCompany.deliverables || '');
      setYear(editingCompany.year || '2025 - 2026');
      setWebsite(editingCompany.website || '');
    } else {
      setName('');
      setLogoUrl('');
      setCategory('Maternidade & Bebê');
      setCampaignDescription('');
      setDeliverables('');
      setYear('2025 - 2026');
      setWebsite('');
    }
    setError(null);
    setSuccess(false);
  }, [editingCompany, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    setError(null);
    setIsProcessing(true);
    const res = await processLogoFile(file);
    setIsProcessing(false);

    if (res.success && res.dataUrl) {
      setLogoUrl(res.dataUrl);
      if (!name) {
        // Auto-guess name from filename if empty
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setName(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    } else {
      setError(res.error || 'Erro ao processar imagem da logo.');
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, informe o nome da empresa.');
      return;
    }

    if (!logoUrl.trim()) {
      setError('Por favor, faça o upload do arquivo de imagem da logo.');
      return;
    }

    const finalLogo = logoUrl.trim();

    if (editingCompany) {
      updateCompany(editingCompany.id, {
        name: name.trim(),
        logoUrl: finalLogo,
        category,
        campaignDescription: campaignDescription.trim(),
        deliverables: deliverables.trim(),
        year: year.trim(),
        website: website.trim(),
      });
    } else {
      addCompany({
        name: name.trim(),
        logoUrl: finalLogo,
        category,
        campaignDescription: campaignDescription.trim() || 'Ação de divulgação e engajamento com público materno e feminino.',
        deliverables: deliverables.trim() || 'Stories + Reels',
        year: year.trim() || '2026',
        website: website.trim() || 'https://instagram.com/eujessicarosaa',
      });
    }

    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className={`relative w-full max-w-lg my-8 rounded-3xl border p-5 sm:p-7 shadow-2xl space-y-5 transition-colors ${
          isDark ? 'border-neutral-800 bg-neutral-950' : 'border-neutral-200 bg-white'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl ${
                isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600'
              }`}
            >
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                {editingCompany ? 'Editar Empresa Parceira' : 'Adicionar Nova Empresa à Galeria'}
              </h3>
              <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Logo e detalhes das marcas que já trabalharam com Jessica Rosa
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback alerts */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{editingCompany ? 'Empresa atualizada com sucesso!' : 'Empresa adicionada à galeria com sucesso!'}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Logo Upload Dropzone */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={`text-xs font-semibold ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Logo da Empresa (Upload Obrigatório) <span className="text-rose-500">*</span>
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
              id="company-logo-dropzone"
              onDrop={onDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed p-4 sm:p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                isDragging
                  ? 'border-rose-500 bg-rose-500/10'
                  : isDark
                  ? 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 hover:bg-neutral-900/80'
                  : 'border-neutral-300 bg-neutral-50 hover:border-neutral-400 hover:bg-neutral-100/80'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp, image/svg+xml"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />

              {logoUrl ? (
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-xl p-2 border flex items-center justify-center overflow-hidden ${
                    isDark ? 'bg-neutral-950 border-neutral-700' : 'bg-white border-neutral-200 shadow-xs'
                  }`}>
                    <img
                      src={logoUrl}
                      alt="Preview logo"
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="text-left">
                    <p className={`text-xs font-semibold ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>
                      Logo carregada com sucesso
                    </p>
                    <p className="text-[11px] text-rose-500 underline">
                      Clique para selecionar outra imagem do dispositivo
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className={`p-2.5 rounded-xl ${isDark ? 'bg-neutral-800 text-rose-400' : 'bg-rose-50 text-rose-600'}`}>
                    <UploadCloud className="w-6 h-6 animate-pulse" />
                  </div>
                  <p className={`text-xs font-medium ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                    Arraste o arquivo da logo aqui ou <span className="text-rose-500 font-semibold underline">clique para enviar</span>
                  </p>
                  <span className={`text-[10px] ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Upload direto do celular ou computador (PNG, JPG, SVG ou WebP)
                  </span>
                </>
              )}

              {isProcessing && (
                <div className="absolute inset-0 rounded-2xl bg-black/60 backdrop-blur-xs flex items-center justify-center">
                  <span className="text-xs font-semibold text-white animate-pulse">
                    Processando e otimizando imagem...
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Brand Name and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Nome da Empresa *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Pampers, Natura, C&A..."
                required
                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-rose-500 ${
                  isDark
                    ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-rose-500 ${
                  isDark
                    ? 'bg-neutral-900 border-neutral-800 text-white'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                }`}
              >
                {COMPANY_CATEGORIES.filter((c) => c !== 'Todas').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Campaign Description & Deliverables */}
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              Descrição da Campanha / Parceria
            </label>
            <textarea
              rows={2}
              value={campaignDescription}
              onChange={(e) => setCampaignDescription(e.target.value)}
              placeholder="Ex: Ação especial de Dia das Mães focando em autocuidado e rotina com Lucca."
              className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-rose-500 ${
                isDark
                  ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400'
              }`}
            />
          </div>

          {/* Formats and Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Formatos Entregues
              </label>
              <input
                type="text"
                value={deliverables}
                onChange={(e) => setDeliverables(e.target.value)}
                placeholder="Ex: Reels + 5 Stories + Presença VIP"
                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-rose-500 ${
                  isDark
                    ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Período / Ano
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Ex: 2025 - 2026"
                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-rose-500 ${
                  isDark
                    ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400'
                }`}
              />
            </div>
          </div>

          {/* Website / Instagram */}
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
              Link da Marca ou Publicação (Opcional)
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://..."
              className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-rose-500 ${
                isDark
                  ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400'
              }`}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                isDark
                  ? 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md shadow-rose-950/30 cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{editingCompany ? 'Salvar Alterações' : 'Adicionar à Galeria'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
