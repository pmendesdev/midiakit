import React, { createContext, useContext, useState, useEffect } from 'react';
import { INFLUENCER_PROFILE } from '../data/influencerData';

interface AvatarContextType {
  avatarUrl: string;
  isCustomAvatar: boolean;
  setCustomAvatar: (dataUrl: string) => void;
  resetAvatar: () => void;
  processAndSaveImageFile: (file: File) => Promise<{ success: boolean; error?: string }>;
}

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

const STORAGE_KEY = 'jessica_rosa_custom_avatar';

export const AvatarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [avatarUrl, setAvatarUrlState] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && stored.startsWith('data:image/')) {
        return stored;
      }
    } catch {
      // fallback
    }
    return INFLUENCER_PROFILE.avatarUrl;
  });

  const isCustomAvatar = avatarUrl !== INFLUENCER_PROFILE.avatarUrl;

  const setCustomAvatar = (dataUrl: string) => {
    setAvatarUrlState(dataUrl);
    try {
      localStorage.setItem(STORAGE_KEY, dataUrl);
    } catch (e) {
      console.warn('LocalStorage quota limit reached, keeping in memory:', e);
    }
  };

  const resetAvatar = () => {
    setAvatarUrlState(INFLUENCER_PROFILE.avatarUrl);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  // Helper to read and optimize image file to avoid quota limits while maintaining crisp resolution
  const processAndSaveImageFile = (file: File): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve({ success: false, error: 'Por favor, selecione um arquivo de imagem válido (JPG, PNG, WebP).' });
        return;
      }

      if (file.size > 15 * 1024 * 1024) {
        resolve({ success: false, error: 'A imagem é muito grande. Escolha uma foto de até 15MB.' });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (!result) {
          resolve({ success: false, error: 'Não foi possível ler o arquivo selecionado.' });
          return;
        }

        // Optimize image with canvas
        const img = new Image();
        img.onload = () => {
          const maxDimension = 900;
          let width = img.width;
          let height = img.height;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            setCustomAvatar(result);
            resolve({ success: true });
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
          setCustomAvatar(optimizedDataUrl);
          resolve({ success: true });
        };

        img.onerror = () => {
          resolve({ success: false, error: 'Falha ao processar a imagem.' });
        };

        img.src = result;
      };

      reader.onerror = () => {
        resolve({ success: false, error: 'Erro ao carregar o arquivo.' });
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <AvatarContext.Provider
      value={{
        avatarUrl,
        isCustomAvatar,
        setCustomAvatar,
        resetAvatar,
        processAndSaveImageFile,
      }}
    >
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatar = () => {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error('useAvatar must be used within an AvatarProvider');
  }
  return context;
};
