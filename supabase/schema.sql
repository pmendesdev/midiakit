-- ==============================================================================
-- SCHEMA SUPABASE: Mídia Kit Jessica Rosa
-- Execute este script no SQL Editor do seu projeto Supabase (https://supabase.com)
-- ==============================================================================

-- 1. Tabela de parcerias e campanhas
CREATE TABLE IF NOT EXISTS public.partnerships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    brand_name TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    campaign_description TEXT NOT NULL,
    link TEXT,
    category TEXT DEFAULT 'Maternidade & Família',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabela de configurações globais (Perfil, Foto e Logos de Empresas para Sincronização Multi-Dispositivo)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    profile JSONB,
    avatar_url TEXT,
    brand_logos JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE public.partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 4. Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Visualização pública de parcerias" ON public.partnerships;
DROP POLICY IF EXISTS "Gerenciamento de parcerias" ON public.partnerships;
DROP POLICY IF EXISTS "Visualização pública de configurações" ON public.site_settings;
DROP POLICY IF EXISTS "Gerenciamento de configurações" ON public.site_settings;

-- 5. Políticas para a tabela partnerships
CREATE POLICY "Visualização pública de parcerias"
ON public.partnerships FOR SELECT USING (true);

CREATE POLICY "Gerenciamento de parcerias"
ON public.partnerships FOR ALL USING (true) WITH CHECK (true);

-- 6. Políticas para a tabela site_settings
CREATE POLICY "Visualização pública de configurações"
ON public.site_settings FOR SELECT USING (true);

CREATE POLICY "Gerenciamento de configurações"
ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- 7. Índice de performance
CREATE INDEX IF NOT EXISTS idx_partnerships_created_at 
ON public.partnerships (created_at DESC);

-- 8. Inserir dados iniciais de exemplo (opcional)
INSERT INTO public.partnerships (brand_name, logo_url, campaign_description, link, category)
VALUES
  ('Pampers', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80', 'Campanha de fraldas Premium Care e rotina noturna do bebê', 'https://instagram.com', 'Maternidade'),
  ('Natura Mamãe e Bebê', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&auto=format&fit=crop&q=80', 'Lançamento de linha de cuidados suaves e massagem shantala', 'https://instagram.com', 'Cuidados Pessoais'),
  ('Chicco Brasil', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&auto=format&fit=crop&q=80', 'Review de carrinho de bebê dobrável e cadeira de alimentação', 'https://instagram.com', 'Equipamentos Infantis')
ON CONFLICT DO NOTHING;
