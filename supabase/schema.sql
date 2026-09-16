-- ==============================================================================
-- SCHEMA SUPABASE: Mídia Kit Jessica Rosa
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

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.partnerships ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Segurança (RLS)
-- Permitir que visitantes visualizem todas as parcerias
CREATE POLICY "Visualização pública de parcerias"
ON public.partnerships
FOR SELECT
USING (true);

-- Permitir inserção, alteração e exclusão para usuários com a chave anônima/autenticados
CREATE POLICY "Gerenciamento de parcerias"
ON public.partnerships
FOR ALL
USING (true)
WITH CHECK (true);

-- 4. Índice de performance
CREATE INDEX IF NOT EXISTS idx_partnerships_created_at 
ON public.partnerships (created_at DESC);

-- 5. Inserir dados iniciais de exemplo (opcional)
INSERT INTO public.partnerships (brand_name, logo_url, campaign_description, link, category)
VALUES
  ('Pampers', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80', 'Campanha de fraldas Premium Care e rotina noturna do bebê', 'https://instagram.com', 'Maternidade'),
  ('Natura Mamãe e Bebê', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&auto=format&fit=crop&q=80', 'Lançamento de linha de cuidados suaves e massagem shantala', 'https://instagram.com', 'Cuidados Pessoais'),
  ('Chicco Brasil', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&auto=format&fit=crop&q=80', 'Review de carrinho de bebê dobrável e cadeira de alimentação', 'https://instagram.com', 'Equipamentos Infantis')
ON CONFLICT DO NOTHING;
