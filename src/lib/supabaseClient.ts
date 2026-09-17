import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Partnership } from '../types';
import { INITIAL_PARTNERSHIPS } from '../data/influencerData';

// Local storage key for fallback persistence
const LOCAL_STORAGE_KEY = 'jessica_rosa_partnerships_v1';
const SUPABASE_CONFIG_KEY = 'jessica_rosa_supabase_credentials';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

// Fallback project credentials (vazio por padrão para evitar falsas conexões)
const DEFAULT_SUPABASE_URL = '';
const DEFAULT_SUPABASE_ANON_KEY = '';

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
    const stored = localStorage.getItem(SUPABASE_CONFIG_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.url && parsed.anonKey) {
        return {
          url: String(parsed.url).replace(/["']/g, '').trim(),
          anonKey: String(parsed.anonKey).replace(/["']/g, '').trim(),
        };
      }
    }
  } catch (e) {
    console.error('Error reading Supabase config:', e);
  }
  if (DEFAULT_SUPABASE_URL && DEFAULT_SUPABASE_ANON_KEY) {
    return { url: DEFAULT_SUPABASE_URL, anonKey: DEFAULT_SUPABASE_ANON_KEY };
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
 */
export async function deletePartnership(id: string): Promise<{ success: boolean; error?: string; isRemote: boolean }> {
  const client = getSupabaseClient();
  if (client && !id.startsWith('local-')) {
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

  // Local delete
  const current = getLocalPartnerships();
  const filtered = current.filter((item) => item.id !== id);
  saveLocalPartnerships(filtered);
  return { success: true, isRemote: false };
}

/**
 * Bulk upload local partnerships to Supabase if table is empty or upon user action.
 */
export async function syncLocalToSupabase(): Promise<{ success: boolean; count: number; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, count: 0, error: 'Cliente Supabase não está configurado.' };
  }

  const localItems = getLocalPartnerships();
  if (localItems.length === 0) {
    return { success: true, count: 0 };
  }

  try {
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

    return { success: true, count: data?.length || payload.length };
  } catch (err: any) {
    return { success: false, count: 0, error: err?.message || 'Erro ao sincronizar com Supabase' };
  }
}
