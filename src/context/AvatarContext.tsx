import React, { createContext, useContext, useState, useEffect } from 'react';
import { INFLUENCER_PROFILE } from '../data/influencerData';
import { fetchSiteSettings, saveSiteSettings } from '../lib/supabaseClient';

interface AvatarContextType {
  avatarUrl: string;
  isCustomAvatar: boolean;
  setCustomAvatar: (dataUrl: string) => Promise<{ success: boolean; error?: string }>;
  resetAvatar: () => Promise<{ success: boolean; error?: string }>;
  processAndSaveImageFile: (file: File) => Promise<{ success: boolean; error?: string }>;
}

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

const STORAGE_KEY = 'jessica_rosa_custom_avatar';

export const AvatarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [avatarUrl, setAvatarUrlState] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && (stored.startsWith('data:image/') || stored.startsWith('http'))) {
        return stored;
      }
    } catch {
      // fallback
    }
    return INFLUENCER_PROFILE.avatarUrl;
  });

  useEffect(() => {
    fetchSiteSettings().then((res) => {
      if (res.data?.avatar_url) {
        setAvatarUrlState(res.data.avatar_url);
        try {
          localStorage.setItem(STORAGE_KEY, res.data.avatar_url);
        } catch {}
      }
    });
  }, []);

  const isCustomAvatar = avatarUrl !== INFLUENCER_PROFILE.avatarUrl;

  const setCustomAvatar = async (dataUrl: string): Promise<{ success: boolean; error?: string }> => {
    setAvatarUrlState(dataUrl);
    try {
      localStorage.setItem(STORAGE_KEY, dataUrl);
    } catch (e) {
      console.warn('LocalStorage quota limit reached, keeping in memory:', e);
    }
    const res = await saveSiteSettings({ avatar_url: dataUrl });
    if (res.error) {
      console.warn('Supabase save error for avatar:', res.error);
      return { success: false, error: res.error };
    }
    return { success: true };
  };

  const resetAvatar = async (): Promise<{ success: boolean; error?: string }> => {
    setAvatarUrlState(INFLUENCER_PROFILE.avatarUrl);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    const res = await saveSiteSettings({ avatar_url: INFLUENCER_PROFILE.avatarUrl });
    if (res.error) {
      return { success: false, error: res.error };
    }
    return { success: true };
  };

  // Helper to read and optimize image file to avoid quota limits while maintaining crisp resolution on all devices
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

        // Optimize image with canvas (500px max dimension, 0.8 JPEG quality for fast mobile uploads)
        const img = new Image();
        img.onload = async () => {
          const maxDimension = 500;
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
            const saveRes = await setCustomAvatar(result);
            resolve(saveRes);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          const saveRes = await setCustomAvatar(optimizedDataUrl);
          resolve(saveRes);
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
