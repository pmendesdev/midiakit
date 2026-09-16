import React, { createContext, useContext, useState, useEffect } from 'react';
import { CompanyLogo } from '../types';
import { INITIAL_COMPANY_LOGOS } from '../data/companyLogosData';

interface BrandGalleryContextType {
  companies: CompanyLogo[];
  addCompany: (newCompany: Omit<CompanyLogo, 'id'>) => string;
  updateCompany: (id: string, updated: Partial<CompanyLogo>) => void;
  deleteCompany: (id: string) => void;
  resetCompanies: () => void;
  processLogoFile: (file: File) => Promise<{ success: boolean; dataUrl?: string; error?: string }>;
}

const BrandGalleryContext = createContext<BrandGalleryContextType | undefined>(undefined);

const STORAGE_KEY = 'jessica_rosa_company_logos';

export const BrandGalleryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companies, setCompanies] = useState<CompanyLogo[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse stored company logos', e);
    }
    return INITIAL_COMPANY_LOGOS;
  });

  // Persist to local storage whenever modified
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
    } catch (e) {
      console.warn('LocalStorage quota limit reached for company logos:', e);
    }
  }, [companies]);

  const addCompany = (newCompany: Omit<CompanyLogo, 'id'>): string => {
    const id = `custom-brand-${Date.now()}`;
    const brandItem: CompanyLogo = {
      ...newCompany,
      id,
      isCustom: true,
    };
    setCompanies((prev) => [brandItem, ...prev]);
    return id;
  };

  const updateCompany = (id: string, updated: Partial<CompanyLogo>) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
  };

  const deleteCompany = (id: string) => {
    setCompanies((prev) => prev.filter((c) => c.id !== id));
  };

  const resetCompanies = () => {
    setCompanies(INITIAL_COMPANY_LOGOS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const processLogoFile = (file: File): Promise<{ success: boolean; dataUrl?: string; error?: string }> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve({ success: false, error: 'Por favor, selecione um arquivo de imagem (PNG, JPG, SVG, WebP).' });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        resolve({ success: false, error: 'O arquivo de logo deve ter no máximo 10MB.' });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (!result) {
          resolve({ success: false, error: 'Erro ao ler arquivo da logo.' });
          return;
        }

        // Optimize if raster image
        const img = new Image();
        img.onload = () => {
          const maxDim = 600;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({ success: true, dataUrl: result });
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const optimized = canvas.toDataURL('image/png');
          resolve({ success: true, dataUrl: optimized });
        };

        img.onerror = () => {
          resolve({ success: true, dataUrl: result });
        };

        img.src = result;
      };

      reader.onerror = () => {
        resolve({ success: false, error: 'Não foi possível ler o arquivo selecionado.' });
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <BrandGalleryContext.Provider
      value={{
        companies,
        addCompany,
        updateCompany,
        deleteCompany,
        resetCompanies,
        processLogoFile,
      }}
    >
      {children}
    </BrandGalleryContext.Provider>
  );
};

export const useBrandGallery = () => {
  const context = useContext(BrandGalleryContext);
  if (!context) {
    throw new Error('useBrandGallery must be used within a BrandGalleryProvider');
  }
  return context;
};
