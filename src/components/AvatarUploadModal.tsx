import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UploadCloud,
  X,
  Camera,
  Image as ImageIcon,
  RotateCcw,
  Check,
  AlertCircle,
  Link as LinkIcon,
} from 'lucide-react';
import { useAvatar } from '../context/AvatarContext';
import { useTheme } from '../context/ThemeContext';
import { INFLUENCER_PROFILE } from '../data/influencerData';

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({ isOpen, onClose }) => {
  const { avatarUrl, isCustomAvatar, resetAvatar, processAndSaveImageFile, setCustomAvatar } = useAvatar();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isApplyingUrl, setIsApplyingUrl] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (file: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsProcessing(true);

    const result = await processAndSaveImageFile(file);
    setIsProcessing(false);

    if (result.success) {
      setSuccessMessage('Foto de perfil atualizada com sucesso!');
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setErrorMessage(result.error || 'Erro ao processar imagem.');
    }
  };

  const handleApplyUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) {
      setErrorMessage('Por favor, informe uma URL válida de imagem.');
      return;
    }
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image/')) {
      setErrorMessage('A URL deve começar com https:// ou http://');
      return;
    }

    setIsApplyingUrl(true);
    setErrorMessage(null);

    const testImg = new Image();
    testImg.onload = () => {
      setCustomAvatar(trimmed);
      setIsApplyingUrl(false);
      setSuccessMessage('Foto de perfil atualizada com sucesso!');
      setTimeout(() => {
        onClose();
      }, 1200);
    };
    testImg.onerror = () => {
      setIsApplyingUrl(false);
      setErrorMessage('Não foi possível carregar a imagem da URL fornecida. Verifique o link.');
    };
    testImg.src = trimmed;
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className={`relative w-full max-w-lg rounded-3xl border p-6 sm:p-7 shadow-2xl space-y-5 transition-colors ${
          isDark ? 'border-neutral-800 bg-neutral-950' : 'border-neutral-200 bg-white'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl ${
                isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600'
              }`}
            >
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Alterar Foto de Perfil
              </h3>
              <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Personalize o Mídia Kit com a foto oficial da Jessica
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
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Current Avatar preview with comparison */}
        <div className="flex items-center justify-center gap-4 py-2">
          <div className="text-center">
            <div
              className={`w-24 h-24 rounded-2xl overflow-hidden border-2 p-1 mx-auto shadow-md transition-colors ${
                isDark ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-neutral-50'
              }`}
            >
              <img
                src={avatarUrl}
                alt="Foto atual"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <span className={`text-[11px] font-mono mt-1.5 block ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              {isCustomAvatar ? 'Foto Personalizada' : 'Foto Padrão'}
            </span>
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <div
          id="avatar-dropzone"
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2.5 ${
            isDragging
              ? 'border-rose-500 bg-rose-500/10 scale-[1.01]'
              : isDark
              ? 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 hover:bg-neutral-900/80'
              : 'border-neutral-300 bg-neutral-50 hover:border-neutral-400 hover:bg-neutral-100/70'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/gif"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFileChange(e.target.files[0]);
              }
            }}
          />

          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
              isDragging
                ? 'bg-rose-500 text-white'
                : isDark
                ? 'bg-neutral-800 text-rose-400'
                : 'bg-rose-50 text-rose-600'
            }`}
          >
            <UploadCloud className="w-6 h-6 animate-bounce" />
          </div>

          <div className="space-y-1">
            <p className={`text-xs sm:text-sm font-bold ${isDark ? 'text-neutral-200' : 'text-neutral-800'}`}>
              Arraste e solte sua foto aqui
            </p>
            <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              ou <span className="text-rose-500 font-semibold underline underline-offset-2">clique para selecionar</span> do seu computador ou celular
            </p>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
              isDark ? 'bg-neutral-800 border-neutral-700 text-neutral-400' : 'bg-white border-neutral-200 text-neutral-500'
            }`}>
              JPG, PNG, WEBP até 15MB
            </span>
          </div>

          {isProcessing && (
            <div className="absolute inset-0 rounded-2xl bg-black/60 backdrop-blur-xs flex items-center justify-center">
              <span className="text-xs font-semibold text-white animate-pulse">
                Processando imagem...
              </span>
            </div>
          )}
        </div>

        {/* Option 2: Image URL input */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Ou cole o link direto da imagem
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                <LinkIcon className="w-3.5 h-3.5" />
              </div>
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApplyUrl();
                  }
                }}
                placeholder="https://exemplo.com/sua-foto.jpg"
                className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border outline-hidden transition-all ${
                  isDark
                    ? 'bg-neutral-900 border-neutral-800 text-neutral-200 focus:border-rose-500/80 focus:ring-1 focus:ring-rose-500/50'
                    : 'bg-white border-neutral-200 text-neutral-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20 shadow-2xs'
                }`}
              />
            </div>
            <button
              type="button"
              onClick={handleApplyUrl}
              disabled={isApplyingUrl || !imageUrlInput.trim()}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all cursor-pointer shadow-xs shrink-0"
            >
              {isApplyingUrl ? 'Verificando...' : 'Aplicar'}
            </button>
          </div>
        </div>

        {/* Reset Option (if custom avatar) */}
        {isCustomAvatar && (
          <div className="flex items-center justify-center pt-1 text-xs">
            <button
              type="button"
              onClick={() => {
                resetAvatar();
                setSuccessMessage('Foto original restaurada!');
                setTimeout(() => onClose(), 1000);
              }}
              className="text-rose-500 hover:text-rose-600 font-medium flex items-center gap-1.5 cursor-pointer hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar foto original da Jessica</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
