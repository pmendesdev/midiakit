import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Partnership, InfluencerProfile, CompanyLogo } from '../types';
import { INITIAL_PARTNERSHIPS, INFLUENCER_PROFILE } from '../data/influencerData';
import { INITIAL_COMPANY_LOGOS } from '../data/companyLogosData';

// Local storage key for fallback persistence
const LOCAL_STORAGE_KEY = 'jessica_rosa_partnerships_v1';
const SUPABASE_CONFIG_KEY = 'jessica_rosa_supabase_credentials';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

// Fallback project credentials
const DEFAULT_SUPABASE_URL = 'https://mhmbhlwrckhizsineohk.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_YolaCI1oFf3fcO2hflfTXw_C5Up_Gp9';

export function getStoredSupabaseConfig(): SupabaseConfig | null {
  try {
    const metaEnv = (import.meta as any).env || {};
    const envUrl = metaEnv.VITE_SUPABASE_URL;
    const envKey = metaEnv.VITE_SUPABASE_ANON_KEY;
    if (envUrl && envKey) {
      const cleanUrl = String(envUrl).replace(/["']/g, '').trim();
      const cleanKey = String(envKey).replace(/["']/g, '').trim();
      if (cleanUrl !== '' && cleanKey !== '') {
        return { url: cleanUrl, anonKey: cleanKey };
      }
    }

    if (DEFAULT_SUPABASE_URL && DEFAULT_SUPABASE_ANON_KEY) {
      const cleanDefaultUrl = String(DEFAULT_SUPABASE_URL).replace(/["']/g, '').trim();
      const cleanDefaultKey = String(DEFAULT_SUPABASE_ANON_KEY).replace(/["']/g, '').trim();
      if (cleanDefaultUrl !== '' && cleanDefaultKey !== '') {
        return { url: cleanDefaultUrl, anonKey: cleanDefaultKey };
      }
    }

    const stored = localStorage.getItem(SUPABASE_CONFIG_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.url && parsed.anonKey && String(parsed.url).trim() !== '' && String(parsed.anonKey).trim() !== '') {
        return {
          url: String(parsed.url).replace(/["']/g, '').trim(),
          anonKey: String(parsed.anonKey).replace(/["']/g, '').trim(),
        };
      }
    }
  } catch (e) {
    console.error('Error reading Supabase config:', e);
  }
  return null;
}

export function saveStoredSupabaseConfig(config: SupabaseConfig | null) {
  if (config) {
    localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(config));
  } else {
    localStorage.removeItem(SUPABASE_CONFIG_KEY);
  }
}

let cachedClient: SupabaseClient | null = null;
let currentConfigKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const config = getStoredSupabaseConfig();
  if (!config?.url || !config?.anonKey) {
    return null;
  }
  const key = `${config.url}::${config.anonKey}`;
  if (!cachedClient || currentConfigKey !== key) {
    cachedClient = createClient(config.url, config.anonKey);
    currentConfigKey = key;
  }
  return cachedClient;
}

// Local mock storage helpers
export function getLocalPartnerships(): Partnership[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PARTNERSHIPS));
      return INITIAL_PARTNERSHIPS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading local partnerships:', e);
    return INITIAL_PARTNERSHIPS;
  }
}

export function saveLocalPartnerships(items: Partnership[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving local partnerships:', e);
  }
}

/**
 * Helper to check if a string is a valid PostgreSQL UUID
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidUUID(id: string): boolean {
  return UUID_REGEX.test(id);
}

/**
 * Unified data fetcher for partnerships.
 * If Supabase is connected, queries Supabase table 'partnerships'.
 * Otherwise, falls back smoothly to local storage mock database.
 */
export async function fetchPartnerships(): Promise<{ data: Partnership[]; isRemote: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('partnerships')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch error, falling back to local:', error.message);
        return { data: getLocalPartnerships(), isRemote: false, error: error.message };
      }

      if (!data || data.length === 0) {
        // Auto-seed initial partnerships in Supabase if table is empty
        try {
          const payload = INITIAL_PARTNERSHIPS.map((item) => ({
            brand_name: item.brand_name,
            logo_url: item.logo_url,
            campaign_description: item.campaign_description,
            link: item.link || 'https://instagram.com/eujessicarosaa',
            category: item.category || 'Maternidade & Família',
          }));
          const { data: seeded } = await client.from('partnerships').insert(payload).select();
          if (seeded && seeded.length > 0) {
            return { data: seeded as Partnership[], isRemote: true };
          }
        } catch (seedErr) {
          console.warn('Auto-seed partnerships error:', seedErr);
        }
      }

      return { data: (data as Partnership[]) || [], isRemote: true };
    } catch (err: any) {
      console.warn('Exception during Supabase fetch:', err);
      return { data: getLocalPartnerships(), isRemote: false, error: err?.message };
    }
  }

  // Local mode
  return {
    data: getLocalPartnerships(),
    isRemote: false,
    error: 'Credenciais do Supabase não encontradas. Adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY nas variáveis de ambiente da Vercel (e faça um Redeploy) ou configure no painel Admin.',
  };
}

/**
 * Insert new partnership.
 */
export async function createPartnership(
  newEntry: Omit<Partnership, 'id' | 'created_at'>
): Promise<{ data: Partnership | null; error?: string; isRemote: boolean }> {
  const client = getSupabaseClient();
  const timestamp = new Date().toISOString();

  if (client) {
    try {
      const { data, error } = await client
        .from('partnerships')
        .insert([
          {
            brand_name: newEntry.brand_name,
            logo_url: newEntry.logo_url,
            campaign_description: newEntry.campaign_description,
            link: newEntry.link,
            category: newEntry.category || 'Maternidade & Família',
          },
        ])
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message, isRemote: true };
      }
      return { data: data as Partnership, isRemote: true };
    } catch (err: any) {
      return { data: null, error: err?.message || 'Falha ao conectar com Supabase', isRemote: true };
    }
  }

  // Local fallback
  const created: Partnership = {
    ...newEntry,
    id: 'local-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
    created_at: timestamp,
  };

  const current = getLocalPartnerships();
  const updated = [created, ...current];
  saveLocalPartnerships(updated);
  return { data: created, isRemote: false };
}

/**
 * Delete partnership by ID.
 * Validates UUID format to prevent PostgreSQL 22P02 type errors.
 */
export async function deletePartnership(id: string): Promise<{ success: boolean; error?: string; isRemote: boolean }> {
  const client = getSupabaseClient();
  if (client && isValidUUID(id)) {
    try {
      const { error } = await client.from('partnerships').delete().eq('id', id);
      if (error) {
        return { success: false, error: error.message, isRemote: true };
      }
      return { success: true, isRemote: true };
    } catch (err: any) {
      return { success: false, error: err?.message, isRemote: true };
    }
  }

  // Local delete fallback for non-UUID / demo IDs
  const current = getLocalPartnerships();
  const filtered = current.filter((item) => item.id !== id);
  saveLocalPartnerships(filtered);
  return { success: true, isRemote: false };
}

export interface SiteSettingsPayload {
  profile?: InfluencerProfile;
  avatar_url?: string;
  brand_logos?: CompanyLogo[];
}

/**
 * Fetch remote site settings (profile bio, avatar, company logos) from Supabase table 'site_settings'
 */
export async function fetchSiteSettings(): Promise<{
  data: SiteSettingsPayload | null;
  isRemote: boolean;
  error?: string;
}> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('site_settings')
        .select('*')
        .eq('id', 'main')
        .maybeSingle();

      if (error) {
        console.warn('Supabase site_settings fetch warning:', error.message);
        return { data: null, isRemote: false, error: error.message };
      }

      if (!data) {
        // Auto-seed site_settings in Supabase if empty
        const initialPayload = {
          profile: INFLUENCER_PROFILE,
          avatar_url: INFLUENCER_PROFILE.avatarUrl,
          brand_logos: INITIAL_COMPANY_LOGOS,
        };
        await saveSiteSettings(initialPayload);
        return { data: initialPayload, isRemote: true };
      }

      let profile = data.profile ? { ...data.profile } : undefined;
      if (profile) {
        if (profile.age !== undefined) profile.age = Number(profile.age) || 28;
        if (profile.sonAge !== undefined) profile.sonAge = Number(profile.sonAge) || 7;
      }

      return {
        data: {
          profile,
          avatar_url: data.avatar_url,
          brand_logos: data.brand_logos,
        },
        isRemote: true,
      };
    } catch (err: any) {
      return { data: null, isRemote: false, error: err?.message };
    }
  }
  return { data: null, isRemote: false };
}

/**
 * Save or update remote site settings in Supabase table 'site_settings'
 */
export async function saveSiteSettings(
  updated: SiteSettingsPayload
): Promise<{ success: boolean; error?: string; isRemote: boolean }> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data: existing } = await client
        .from('site_settings')
        .select('*')
        .eq('id', 'main')
        .maybeSingle();

      const mergedPayload = {
        id: 'main',
        profile: updated.profile !== undefined ? updated.profile : (existing?.profile || null),
        avatar_url: updated.avatar_url !== undefined ? updated.avatar_url : (existing?.avatar_url || null),
        brand_logos: updated.brand_logos !== undefined ? updated.brand_logos : (existing?.brand_logos || null),
        updated_at: new Date().toISOString(),
      };

      const { error } = await client.from('site_settings').upsert(mergedPayload);
      if (error) {
        console.warn('Error saving site_settings to Supabase:', error.message);
        return { success: false, error: error.message, isRemote: true };
      }
      return { success: true, isRemote: true };
    } catch (err: any) {
      return { success: false, error: err?.message, isRemote: true };
    }
  }
  return { success: false, error: 'Supabase não configurado', isRemote: false };
}

/**
 * Bulk upload local partnerships and settings to Supabase
 */
export async function syncLocalToSupabase(): Promise<{ success: boolean; count: number; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, count: 0, error: 'Cliente Supabase não está configurado.' };
  }

  const localItems = getLocalPartnerships();
  try {
    let count = 0;
    if (localItems.length > 0) {
      const payload = localItems.map((item) => ({
        brand_name: item.brand_name,
        logo_url: item.logo_url,
        campaign_description: item.campaign_description,
        link: item.link || 'https://instagram.com/eujessicarosaa',
        category: item.category || 'Maternidade & Família',
      }));

      const { data, error } = await client.from('partnerships').insert(payload).select();
      if (error) {
        return { success: false, count: 0, error: error.message };
      }
      count = data?.length || payload.length;
    }

    // Also sync site_settings from localStorage if available
    try {
      const storedProfile = localStorage.getItem('jessica_rosa_custom_profile');
      const storedAvatar = localStorage.getItem('jessica_rosa_custom_avatar');
      const storedLogos = localStorage.getItem('jessica_rosa_company_logos');

      if (storedProfile || storedAvatar || storedLogos) {
        await saveSiteSettings({
          profile: storedProfile ? JSON.parse(storedProfile) : undefined,
          avatar_url: storedAvatar || undefined,
          brand_logos: storedLogos ? JSON.parse(storedLogos) : undefined,
        });
      }
    } catch (e) {
      console.warn('Error pushing local settings to Supabase:', e);
    }

    return { success: true, count };
  } catch (err: any) {
    return { success: false, count: 0, error: err?.message || 'Erro ao sincronizar com Supabase' };
  }
}
