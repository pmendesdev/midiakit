import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Copy, Check, Terminal, FileCode, Shield, Layers } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface CodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SQL_CODE = `-- ==============================================================================
-- 1. BANCO DE DADOS (Supabase PostgreSQL + RLS)
-- Criação da tabela de parcerias com RLS para Mídia Kit Jessica Rosa
-- ==============================================================================

-- 1.1 Criar a tabela partnerships
CREATE TABLE IF NOT EXISTS public.partnerships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    brand_name TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    campaign_description TEXT NOT NULL,
    link TEXT,
    category TEXT DEFAULT 'Maternidade & Família',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 1.2 Habilitar Row Level Security (RLS)
ALTER TABLE public.partnerships ENABLE ROW LEVEL SECURITY;

-- 1.3 Política 1: Leitura pública (qualquer visitante pode visualizar as marcas)
CREATE POLICY "Leitura pública permitida para todos"
ON public.partnerships
FOR SELECT
USING (true);

-- 1.4 Política 2: Inserção restrita apenas a usuários autenticados (Admin)
CREATE POLICY "Inserção restrita a usuários autenticados"
ON public.partnerships
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 1.5 Política 3: Atualização restrita a usuários autenticados (Admin)
CREATE POLICY "Atualização restrita a usuários autenticados"
ON public.partnerships
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 1.6 Política 4: Exclusão restrita a usuários autenticados (Admin)
CREATE POLICY "Exclusão restrita a usuários autenticados"
ON public.partnerships
FOR DELETE
TO authenticated
USING (true);

-- 1.7 Índices para performance de consulta
CREATE INDEX IF NOT EXISTS idx_partnerships_created_at 
ON public.partnerships (created_at DESC);`;

const MIDDLEWARE_CODE = `// ==============================================================================
// 2. MIDDLEWARE E AUTENTICAÇÃO (middleware.ts)
// Protege a rota /admin redirecionando para /login se não houver sessão ativa
// ==============================================================================

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Atualiza/valida a sessão do usuário via cookies
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Verifica se o caminho atual inicia com /admin
  const isAccessingAdmin = req.nextUrl.pathname.startsWith('/admin');

  // Se estiver tentando acessar /admin sem sessão ativa, redireciona para /login
  if (isAccessingAdmin && !session) {
    const redirectUrl = new URL('/login', req.url);
    // Guarda o callbackUrl para redirecionar de volta após login
    redirectUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// Configuração do Matcher para otimizar execução do middleware
export const config = {
  matcher: ['/admin/:path*'],
};`;

const PAGE_CODE = `// ==============================================================================
// 3. ROTA PÚBLICA (app/page.tsx - Next.js Server Component)
// Apresentação completa em Bento Grid com Dark Mode nativo
// ==============================================================================

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Users, 
  TrendingUp, 
  Heart, 
  BadgeCheck, 
  MapPin, 
  Baby, 
  ExternalLink, 
  MessageCircle, 
  Mail, 
  Instagram, 
  Layers, 
  CheckCircle2, 
  Radio, 
  PackageCheck, 
  Zap, 
  CalendarCheck 
} from 'lucide-react';

interface Partnership {
  id: string;
  brand_name: string;
  logo_url: string;
  campaign_description: string;
  link: string;
  created_at: string;
}

export const revalidate = 60; // ISR / Cache revalidation

export default async function MediaKitPage() {
  const supabase = createServerComponentClient({ cookies });

  // Consumir dados diretamente da tabela 'partnerships'
  const { data: partnerships } = await supabase
    .from('partnerships')
    .select('*')
    .order('created_at', { ascending: false });

  const partnerList: Partnership[] = partnerships || [];

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 p-4 sm:p-6 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER BENTO CARD */}
        <header className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-3 flex justify-center">
              <div className="group relative w-40 h-40 rounded-2xl overflow-hidden border border-neutral-700 bg-neutral-950 p-1">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"
                  alt="Jessica Rosa"
                  className="w-full h-full object-cover rounded-xl grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
            <div className="md:col-span-9 space-y-3 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Jessica Rosa</h1>
                <span className="text-rose-400 font-mono text-sm">@eujessicarosaa</span>
                <BadgeCheck className="w-5 h-5 text-sky-400" />
              </div>
              <p className="text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
                28 anos, Porto Alegre (RS). Mãe do Lucca, 7 anos. Criadora de conteúdo focada em Maternidade, Autocuidado, Lifestyle e Entretenimento.
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300">Porto Alegre (RS)</span>
                <span className="px-3 py-1 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300">Mãe do Lucca (7 anos)</span>
                <span className="px-3 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300">Mídia Kit Oficial 2026</span>
              </div>
            </div>
          </div>
        </header>

        {/* MÉTRICAS BENTO GRID */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-semibold">Seguidores</span>
              <Users className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-4xl font-extrabold font-mono text-white">+110K</div>
            <p className="text-xs text-neutral-400 mt-2">Comunidade engajada e autêntica</p>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-semibold">Impressões Mensais</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-4xl font-extrabold font-mono text-white">+1.7M</div>
            <p className="text-xs text-neutral-400 mt-2">Alcance massivo em Reels e Feed</p>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs font-semibold">Média de Curtidas</span>
              <Heart className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-4xl font-extrabold font-mono text-white">+5K</div>
            <p className="text-xs text-neutral-400 mt-2">Por publicação com alto engajamento</p>
          </div>
        </section>

        {/* DEMOGRAFIA & ENTREGÁVEIS BENTO */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* DEMOGRAFIA */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Demografia de Audiência</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-rose-400">Mulheres 81,1%</span>
                <span className="text-sky-400">Homens 18,9%</span>
              </div>
              <div className="h-3 w-full bg-neutral-800 rounded-full overflow-hidden flex">
                <div style={{ width: '81.1%' }} className="bg-rose-500 h-full" />
                <div style={{ width: '18.9%' }} className="bg-sky-500 h-full" />
              </div>
            </div>
            <p className="text-xs text-neutral-400">Público majoritariamente feminino: mães e tomadoras de decisão de compra para o lar.</p>
          </div>

          {/* ENTREGÁVEIS */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Formatos & Entregáveis</h3>
            <div className="flex flex-wrap gap-2">
              {['Lives', 'Review', 'Unboxing', 'Publi-Post', 'Publi-Stories', 'Publi-Eventos'].map((format) => (
                <span key={format} className="px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-medium text-neutral-200">
                  {format}
                </span>
              ))}
            </div>
            <p className="text-xs text-neutral-400">Pacotes completos com relatórios pós-campanha e métricas validadas.</p>
          </div>
        </section>

        {/* PARCERIAS (Server Component Grid) */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-white">Parcerias Recentes</h2>
          {partnerList.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-800 p-8 text-center text-neutral-400 text-sm">
              Nenhuma parceria cadastrada no momento. Seja a primeira marca parceira!
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {partnerList.map((p) => (
                <div key={p.id} className="group p-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 flex flex-col items-center gap-2 text-center hover:border-neutral-600 transition-all">
                  <div className="w-16 h-16 rounded-xl bg-neutral-950 p-2 border border-neutral-800 flex items-center justify-center">
                    <img src={p.logo_url} alt={p.brand_name} className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                  </div>
                  <span className="text-xs font-bold text-neutral-200 truncate w-full">{p.brand_name}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* RODAPÉ CTA CONTATO */}
        <footer className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Solicite uma Proposta</h2>
            <p className="text-xs text-neutral-400">Atendimento direto com a assessoria da influenciadora</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <a href="https://wa.me/5551985371797" target="_blank" className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors">
              WhatsApp (51) 985371797
            </a>
            <a href="mailto:assessoriajeroosaaa@gmail.com" className="px-4 py-2 rounded-xl bg-neutral-800 text-white border border-neutral-700 hover:bg-neutral-700 transition-colors">
              assessoriajeroosaaa
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}`;

const ADMIN_CODE = `// ==============================================================================
// 4. PAINEL ADMIN (app/admin/page.tsx - Client Component)
// Formulário de inserção direta no Supabase e tabela com exclusão
// ==============================================================================

'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, RefreshCw, ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Partnership {
  id: string;
  brand_name: string;
  logo_url: string;
  campaign_description: string;
  link: string;
  created_at: string;
}

export default function AdminPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [brandName, setBrandName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [campaignDescription, setCampaignDescription] = useState('');
  const [link, setLink] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchPartnerships = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('partnerships')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPartnerships(data as Partnership[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPartnerships();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const { error } = await supabase.from('partnerships').insert([
      {
        brand_name: brandName,
        logo_url: logoUrl,
        campaign_description: campaignDescription,
        link: link || null,
      },
    ]);

    if (error) {
      setMessage({ text: 'Erro ao cadastrar: ' + error.message, type: 'error' });
    } else {
      setMessage({ text: 'Parceria cadastrada com sucesso!', type: 'success' });
      setBrandName('');
      setLogoUrl('');
      setCampaignDescription('');
      setLink('');
      fetchPartnerships();
      router.refresh();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir esta parceria?')) return;

    const { error } = await supabase.from('partnerships').delete().eq('id', id);
    if (!error) {
      setPartnerships((prev) => prev.filter((item) => item.id !== id));
      setMessage({ text: 'Parceria excluída com sucesso.', type: 'success' });
      router.refresh();
    } else {
      setMessage({ text: 'Erro ao excluir: ' + error.message, type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Voltar ao Mídia Kit Público
          </Link>
          <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="text-xs text-rose-400 hover:underline">
            Sair da Conta
          </button>
        </div>

        <h1 className="text-2xl font-bold text-white">Painel de Gestão de Parcerias</h1>

        {message && (
          <div className={\`p-3 rounded-xl text-xs \${message.type === 'success' ? 'bg-emerald-950 border border-emerald-800 text-emerald-300' : 'bg-rose-950 border border-rose-800 text-rose-300'}\`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* FORMULÁRIO (Client Component) */}
          <form onSubmit={handleCreate} className="lg:col-span-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
            <h2 className="text-base font-bold text-white">Nova Parceria</h2>
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-300">Marca *</label>
              <input required value={brandName} onChange={(e) => setBrandName(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white" placeholder="Nome da Marca" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-300">URL do Logo *</label>
              <input required type="url" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-300">Descrição da Campanha *</label>
              <textarea required rows={3} value={campaignDescription} onChange={(e) => setCampaignDescription(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white" placeholder="Detalhes da ação..." />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-neutral-300">Link</label>
              <input type="url" value={link} onChange={(e) => setLink(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white" placeholder="https://instagram.com/..." />
            </div>
            <button type="submit" disabled={submitting} className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 font-bold text-xs text-white disabled:opacity-50">
              {submitting ? 'Salvando...' : 'Cadastrar Parceria'}
            </button>
          </form>

          {/* TABELA DE LISTAGEM */}
          <div className="lg:col-span-7 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
            <h2 className="text-base font-bold text-white">Parcerias Cadastradas ({partnerships.length})</h2>
            {loading ? (
              <p className="text-xs text-neutral-400">Carregando...</p>
            ) : partnerships.length === 0 ? (
              <p className="text-xs text-neutral-500">Nenhuma parceria encontrada.</p>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400">
                    <th className="py-2">Marca</th>
                    <th className="py-2">Descrição</th>
                    <th className="py-2 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {partnerships.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 font-bold text-white flex items-center gap-2">
                        <img src={item.logo_url} alt={item.brand_name} className="w-6 h-6 object-contain" />
                        {item.brand_name}
                      </td>
                      <td className="py-3 text-neutral-300 max-w-xs truncate">{item.campaign_description}</td>
                      <td className="py-3 text-right">
                        <button onClick={() => handleDelete(item.id)} className="text-neutral-400 hover:text-rose-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}`;

export const CodeViewerModal: React.FC<CodeViewerModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'sql' | 'middleware' | 'page' | 'admin'>('sql');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentCode =
    activeTab === 'sql'
      ? SQL_CODE
      : activeTab === 'middleware'
      ? MIDDLEWARE_CODE
      : activeTab === 'page'
      ? PAGE_CODE
      : ADMIN_CODE;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className={`relative w-full max-w-4xl h-[85vh] rounded-2xl border flex flex-col shadow-2xl overflow-hidden ${
          isDark ? 'border-neutral-800 bg-neutral-950' : 'border-neutral-200 bg-white'
        }`}
      >
        {/* Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${
          isDark ? 'border-neutral-800 bg-neutral-900/60' : 'border-neutral-200 bg-neutral-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${
              isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600'
            }`}>
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-sm sm:text-base font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Código Completo para Next.js & Supabase
              </h3>
              <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Arquivos modulares prontos para produção com TypeScript e App Router
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar Arquivo'}</span>
            </button>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${
                isDark
                  ? 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab selector */}
        <div className={`flex border-b px-4 overflow-x-auto ${
          isDark ? 'border-neutral-800 bg-neutral-900/30' : 'border-neutral-200 bg-neutral-100/60'
        }`}>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'sql'
                ? 'border-rose-500 text-rose-500 font-bold'
                : isDark
                ? 'border-transparent text-neutral-400 hover:text-neutral-200'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            1. Supabase SQL & RLS
          </button>
          <button
            onClick={() => setActiveTab('middleware')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'middleware'
                ? 'border-rose-500 text-rose-500 font-bold'
                : isDark
                ? 'border-transparent text-neutral-400 hover:text-neutral-200'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            2. middleware.ts
          </button>
          <button
            onClick={() => setActiveTab('page')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'page'
                ? 'border-rose-500 text-rose-500 font-bold'
                : isDark
                ? 'border-transparent text-neutral-400 hover:text-neutral-200'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            3. app/page.tsx (Pública)
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'admin'
                ? 'border-rose-500 text-rose-500 font-bold'
                : isDark
                ? 'border-transparent text-neutral-400 hover:text-neutral-200'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            4. app/admin/page.tsx (Admin)
          </button>
        </div>

        {/* Code Content */}
        <div className={`flex-1 overflow-auto p-4 sm:p-6 font-mono text-xs leading-relaxed select-text ${
          isDark ? 'bg-neutral-950 text-neutral-300' : 'bg-neutral-900 text-neutral-200'
        }`}>
          <pre className="whitespace-pre overflow-x-auto">
            <code>{currentCode}</code>
          </pre>
        </div>
      </motion.div>
    </div>
  );
};
