-- ==============================================================================
-- SCHEMA DEFINITIVO COMPLETO SUPABASE: Mídia Kit Jessica Rosa
-- Execute este script no SQL Editor do seu projeto Supabase (https://supabase.com)
-- ==============================================================================

-- 1. Criar a tabela de parcerias e campanhas
CREATE TABLE IF NOT EXISTS public.partnerships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    brand_name TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    campaign_description TEXT NOT NULL,
    link TEXT,
    category TEXT DEFAULT 'Maternidade & Família',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Criar a tabela de configurações do site (Perfil, Foto e Logos de Empresas)
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

-- 4. Limpar políticas antigas se existirem
DROP POLICY IF EXISTS "Visualização pública de parcerias" ON public.partnerships;
DROP POLICY IF EXISTS "Gerenciamento de parcerias" ON public.partnerships;
DROP POLICY IF EXISTS "Visualização pública de configurações" ON public.site_settings;
DROP POLICY IF EXISTS "Gerenciamento de configurações" ON public.site_settings;

-- 5. Políticas de Segurança RLS (Leitura e Gravação para o App)
CREATE POLICY "Visualização pública de parcerias" ON public.partnerships FOR SELECT USING (true);
CREATE POLICY "Gerenciamento de parcerias" ON public.partnerships FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Visualização pública de configurações" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Gerenciamento de configurações" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- 6. Índices de alta performance
CREATE INDEX IF NOT EXISTS idx_partnerships_created_at ON public.partnerships (created_at DESC);

-- 7. Inserção dos dados iniciais de Parcerias no Supabase
INSERT INTO public.partnerships (brand_name, logo_url, campaign_description, link, category)
VALUES
  ('Pampers', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80', 'Campanha de fraldas Premium Care e rotina noturna do bebê', 'https://instagram.com/eujessicarosaa', 'Maternidade'),
  ('Natura Mamãe e Bebê', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&auto=format&fit=crop&q=80', 'Lançamento de linha de cuidados suaves e massagem shantala', 'https://instagram.com/eujessicarosaa', 'Cuidados Pessoais'),
  ('Chicco Brasil', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&auto=format&fit=crop&q=80', 'Review de carrinho de bebê dobrável e cadeira de alimentação', 'https://instagram.com/eujessicarosaa', 'Equipamentos Infantis')
ON CONFLICT DO NOTHING;

-- 8. Inserção das configurações de Perfil e Foto iniciais no Supabase
INSERT INTO public.site_settings (id, profile, avatar_url, brand_logos, updated_at)
VALUES (
  'main',
  '{
    "name": "Jessica Rosa",
    "handle": "@eujessicarosaa",
    "age": "28 anos",
    "city": "Porto Alegre (RS)",
    "sonName": "Lucca",
    "sonAge": "7 anos",
    "bio": "Criadora de conteúdo focada em Maternidade Real, Autocuidado, Lifestyle e Entretenimento. Compartilho a rotina maternal com leveza, verdade e altíssimo engajamento comunitário.",
    "instagramUrl": "https://instagram.com/eujessicarosaa",
    "whatsappUrl": "https://wa.me/5551985371797",
    "email": "assessoriajeroosaaa@gmail.com",
    "niches": ["Maternidade", "Autocuidado", "Lifestyle", "Entretenimento"],
    "metrics": {
      "followers": "+110K",
      "monthlyImpressions": "+1.7M",
      "avgLikes": "+5K",
      "womenPercentage": 81.1,
      "menPercentage": 18.9
    },
    "contact": {
      "whatsapp": "(51) 985371797",
      "email": "assessoriajeroosaaa@gmail.com"
    }
  }'::jsonb,
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop',
  '[
    {"id": "brand-pampers", "name": "Pampers", "logoUrl": "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80", "category": "Maternidade"},
    {"id": "brand-natura", "name": "Natura Mamãe & Bebê", "logoUrl": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&auto=format&fit=crop&q=80", "category": "Cuidados Pessoais"},
    {"id": "brand-chicco", "name": "Chicco Brasil", "logoUrl": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&auto=format&fit=crop&q=80", "category": "Equipamentos Infantis"}
  ]'::jsonb,
  now()
)
ON CONFLICT (id) DO NOTHING;
