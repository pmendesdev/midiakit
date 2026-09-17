import React, { createContext, useContext, useState, useEffect } from 'react';
import { InfluencerProfile } from '../types';
import { INFLUENCER_PROFILE } from '../data/influencerData';
import { fetchSiteSettings, saveSiteSettings } from '../lib/supabaseClient';

interface ProfileContextType {
  profile: InfluencerProfile;
  updateProfile: (updated: Partial<InfluencerProfile>) => boolean;
  resetProfile: () => boolean;
  isCustomProfile: boolean;
  isAuthorized: boolean;
  setAuthSession: (logged: boolean) => void;
  checkAuth: () => boolean;
  verifyPassword: (passwordInput: string) => boolean;
  updatePassword: (currentPassword: string, newPassword: string) => { success: boolean; message: string };
  resetPasswordToDefault: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const STORAGE_KEY = 'jessica_rosa_custom_profile';
const ADMIN_LOGGED_KEY = 'jessica_rosa_admin_logged';
const ADMIN_PASSWORD_KEY = 'jessica_admin_password';
export const DEFAULT_ADMIN_PASSWORD = 'JessicaCretinaS2';

const getStoredPassword = (): string => {
  try {
    const saved = localStorage.getItem(ADMIN_PASSWORD_KEY);
    return saved && saved.trim().length > 0 ? saved : DEFAULT_ADMIN_PASSWORD;
  } catch {
    return DEFAULT_ADMIN_PASSWORD;
  }
};

const checkAdminLogged = (): boolean => {
  try {
    return localStorage.getItem(ADMIN_LOGGED_KEY) === 'true';
  } catch {
    return false;
  }
};

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => checkAdminLogged());

  const [profile, setProfileState] = useState<InfluencerProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...INFLUENCER_PROFILE,
          ...parsed,
          contact: {
            ...INFLUENCER_PROFILE.contact,
            ...(parsed.contact || {}),
          },
          niches: Array.isArray(parsed.niches) && parsed.niches.length > 0
            ? parsed.niches
            : INFLUENCER_PROFILE.niches,
        };
      }
    } catch (e) {
      console.warn('Failed to parse saved profile from storage, using defaults', e);
    }
    return INFLUENCER_PROFILE;
  });

  const setAuthSession = (logged: boolean) => {
    try {
      if (logged) {
        localStorage.setItem(ADMIN_LOGGED_KEY, 'true');
      } else {
        localStorage.removeItem(ADMIN_LOGGED_KEY);
      }
    } catch (e) {
      console.error('Failed to update admin session in localStorage:', e);
    }
    setIsAuthorized(logged);
  };

  useEffect(() => {
    fetchSiteSettings().then((res) => {
      if (res.data?.profile) {
        setProfileState(res.data.profile);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(res.data.profile));
        } catch {}
      }
    });
  }, []);

  const checkAuth = () => {
    const status = checkAdminLogged();
    setIsAuthorized(status);
    return status;
  };

  const updateProfile = (updated: Partial<InfluencerProfile>): boolean => {
    // Security check: Only allow modifications if user is logged into the admin panel
    if (!checkAdminLogged() && !isAuthorized) {
      console.warn('Ação bloqueada: É necessário estar logado no painel administrativo para alterar os textos.');
      return false;
    }

    setProfileState((prev) => {
      const newProfile: InfluencerProfile = {
        ...prev,
        ...updated,
        contact: {
          ...prev.contact,
          ...(updated.contact || {}),
        },
        niches: updated.niches || prev.niches,
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      } catch (e) {
        console.error('Failed to save profile to localStorage:', e);
      }

      saveSiteSettings({ profile: newProfile }).catch(console.error);
      return newProfile;
    });

    return true;
  };

  const resetProfile = (): boolean => {
    if (!checkAdminLogged() && !isAuthorized) {
      console.warn('Ação bloqueada: É necessário estar logado no painel administrativo para restaurar os textos.');
      return false;
    }

    setProfileState(INFLUENCER_PROFILE);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to remove custom profile from localStorage:', e);
    }
    saveSiteSettings({ profile: INFLUENCER_PROFILE }).catch(console.error);
    return true;
  };

  const isCustomProfile = JSON.stringify(profile) !== JSON.stringify(INFLUENCER_PROFILE);

  const verifyPassword = (passwordInput: string): boolean => {
    const current = getStoredPassword();
    return passwordInput.trim() === current.trim();
  };

  const updatePassword = (currentPassword: string, newPassword: string): { success: boolean; message: string } => {
    const current = getStoredPassword();
    if (currentPassword.trim() !== current.trim()) {
      return { success: false, message: 'A senha atual informada está incorreta.' };
    }
    if (!newPassword || newPassword.trim().length < 4) {
      return { success: false, message: 'A nova senha deve conter pelo menos 4 caracteres.' };
    }
    try {
      localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword.trim());
      return { success: true, message: 'Senha atualizada com sucesso!' };
    } catch (e) {
      console.error('Failed to save new password:', e);
      return { success: false, message: 'Erro ao salvar a nova senha no navegador.' };
    }
  };

  const resetPasswordToDefault = () => {
    try {
      localStorage.setItem(ADMIN_PASSWORD_KEY, DEFAULT_ADMIN_PASSWORD);
    } catch (e) {
      console.error('Failed to reset password:', e);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        updateProfile,
        resetProfile,
        isCustomProfile,
        isAuthorized,
        setAuthSession,
        checkAuth,
        verifyPassword,
        updatePassword,
        resetPasswordToDefault,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
