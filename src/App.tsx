import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { MetricsCards } from './components/MetricsCards';
import { DemographicsBento } from './components/DemographicsBento';
import { DeliverablesBento } from './components/DeliverablesBento';
import { PartnershipsGrid } from './components/PartnershipsGrid';
import { ContactFooter } from './components/ContactFooter';
import { AdminDashboard } from './components/AdminDashboard';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AvatarProvider, useAvatar } from './context/AvatarContext';
import { BrandGalleryProvider } from './context/BrandGalleryContext';
import { ProfileProvider, useProfile } from './context/ProfileContext';
import { CompanyLogosGallery } from './components/CompanyLogosGallery';
import { Partnership } from './types';
import { fetchPartnerships } from './lib/supabaseClient';
import { ShieldCheck, ArrowLeft, ArrowUpRight, MessageCircle } from 'lucide-react';

function AppContent() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { profile, isAuthorized } = useProfile();
  const { avatarUrl } = useAvatar();

  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public');
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [isLoadingPartnerships, setIsLoadingPartnerships] = useState(true);
  const [isRemoteConnected, setIsRemoteConnected] = useState(false);
  const [remoteError, setRemoteError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoadingPartnerships(true);
    try {
      const { data, isRemote, error } = await fetchPartnerships();
      setPartnerships(data);
      setIsRemoteConnected(isRemote);
      setRemoteError(error || null);
    } catch (e: any) {
      console.error('Failed to load partnerships', e);
      setRemoteError(e?.message || 'Erro inesperado ao conectar');
    } finally {
      setIsLoadingPartnerships(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const scrollToContact = () => {
    const el = document.getElementById('contact-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (sectionId: string) => {
    if (viewMode !== 'public') {
      setViewMode('public');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 relative ${
        isDark ? 'bg-neutral-950 text-neutral-100' : 'bg-slate-50/80 text-neutral-900'
      }`}
    >
      {/* Soft Ambient Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-rose-100/35 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-amber-100/25 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-[600px] h-[600px] bg-rose-50/40 rounded-full blur-3xl" />
      </div>

      {/* Top Banner with quick actions */}
      <header
        className={`border-b sticky top-0 z-40 px-3 sm:px-6 py-2.5 backdrop-blur-xl transition-colors duration-300 ${
          isDark
            ? 'border-neutral-800/80 bg-neutral-950/85'
            : 'border-slate-200/80 bg-white/85 shadow-2xs'
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Brand Identity */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="relative flex items-center">
              <img
                src={avatarUrl}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover ring-1.5 ring-rose-200/80"
              />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white"></span>
              </span>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-xs font-bold tracking-tight ${
                    isDark ? 'text-neutral-100' : 'text-slate-900'
                  }`}
                >
                  {profile.name}
                </span>
                <span className="text-[10px] font-mono font-semibold text-rose-500 hidden sm:inline">
                  {profile.handle}
                </span>
              </div>
              <span className={`text-[10px] font-medium hidden md:inline-block ${
                isDark ? 'text-neutral-400' : 'text-slate-500'
              }`}>
                Mídia Kit Comercial Oficial
              </span>
            </div>
          </div>

          {/* Jump Navigation Links (Desktop) */}
          {viewMode === 'public' && (
            <nav className="hidden lg:flex items-center gap-1 text-xs font-medium">
              <button
                onClick={() => scrollToSection('metrics-section')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDark ? 'text-neutral-300 hover:text-white hover:bg-neutral-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Métricas
              </button>
              <button
                onClick={() => scrollToSection('company-logos-gallery')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDark ? 'text-neutral-300 hover:text-white hover:bg-neutral-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Marcas
              </button>
              <button
                onClick={() => scrollToSection('demographics-card')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDark ? 'text-neutral-300 hover:text-white hover:bg-neutral-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Público
              </button>
              <button
                onClick={() => scrollToSection('deliverables-card')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDark ? 'text-neutral-300 hover:text-white hover:bg-neutral-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Formatos
              </button>
              <button
                onClick={() => scrollToSection('partnerships-section')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDark ? 'text-neutral-300 hover:text-white hover:bg-neutral-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Cases
              </button>
            </nav>
          )}

          {/* Quick Actions & Controls */}
          <div className="flex items-center gap-2 text-xs">
            {/* Falar com Assessoria CTA */}
            <button
              onClick={scrollToContact}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-xs cursor-pointer text-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Falar com Assessoria</span>
              <span className="sm:hidden">Contato</span>
            </button>

            {/* Admin / Public Switcher */}
            {viewMode === 'public' ? (
              <button
                id="btn-top-admin"
                onClick={() => setViewMode('admin')}
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border font-semibold transition-all cursor-pointer shadow-2xs text-xs ${
                  isAuthorized
                    ? isDark
                      ? 'text-rose-400 bg-rose-950/30 hover:bg-rose-900/40 border-rose-800/60'
                      : 'text-rose-700 bg-rose-50 hover:bg-rose-100 border-rose-200'
                    : isDark
                    ? 'text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border-neutral-800'
                    : 'text-slate-700 bg-slate-50 hover:bg-slate-100 border-slate-200 hover:border-slate-300'
                }`}
                title={isAuthorized ? 'Painel Administrativo (Logado)' : 'Área Restrita (Login)'}
              >
                <ShieldCheck className={`w-3.5 h-3.5 ${isAuthorized ? 'text-rose-500' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">{isAuthorized ? 'Painel Admin' : 'Área Restrita'}</span>
                {isAuthorized && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Sessão Ativa" />
                )}
              </button>
            ) : (
              <button
                id="btn-top-public"
                onClick={() => setViewMode('public')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold border transition-all cursor-pointer shadow-2xs text-xs ${
                  isDark
                    ? 'bg-neutral-900 hover:bg-neutral-800 text-white border-neutral-800'
                    : 'bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-200'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Ver Mídia Kit</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <AnimatePresence mode="wait">
          {viewMode === 'public' ? (
            <motion.div
              key="public-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {/* 1. Profile Header */}
              <Header
                onOpenContact={scrollToContact}
              />

              {/* 2. Marcas Parceiras (Logos de Empresas) */}
              <CompanyLogosGallery onOpenContact={scrollToContact} />

              {/* 3. Key Metrics Cards (Seguidores Ativos, Engajamento, etc.) */}
              <MetricsCards />

              {/* 4. Bento Grid: Demographics (81,1% Mulheres) + Deliverables */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-6 flex">
                  <DemographicsBento />
                </div>
                <div className="lg:col-span-6 flex">
                  <DeliverablesBento onOpenContact={scrollToContact} />
                </div>
              </div>

              {/* 5. Partnerships Grid (Supabase Powered) */}
              <PartnershipsGrid
                partnerships={partnerships}
                isLoading={isLoadingPartnerships}
                onRefresh={loadData}
                isRemote={isRemoteConnected}
              />

              {/* 6. Contact CTA Footer */}
              <ContactFooter />
            </motion.div>
          ) : (
            <motion.div
              key="admin-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
            >
              <AdminDashboard
                partnerships={partnerships}
                onPartnershipsChange={loadData}
                onBackToPublic={() => setViewMode('public')}
                isRemote={isRemoteConnected}
                remoteError={remoteError}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Executive Footer */}
      <footer
        className={`w-full border-t py-6 mt-12 transition-colors duration-300 ${
          isDark
            ? 'border-neutral-800/80 bg-neutral-950/90 text-neutral-400'
            : 'border-slate-200/80 bg-white/90 text-slate-500 shadow-2xs'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className={`font-bold ${isDark ? 'text-neutral-100' : 'text-slate-900'}`}>
              {profile.name}
            </span>
            <span className={isDark ? 'text-neutral-700' : 'text-slate-300'}>•</span>
            <span className="font-mono text-rose-500 font-semibold">{profile.handle}</span>
            <span className={isDark ? 'text-neutral-700' : 'text-slate-300'}>•</span>
            <span>Mídia Kit Comercial Oficial © 2026</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Auditoria Instagram Insights Atualizada
            </span>
            <span className={isDark ? 'text-neutral-700' : 'text-slate-300'}>•</span>
            <button
              onClick={() => setViewMode(viewMode === 'public' ? 'admin' : 'public')}
              className="hover:text-rose-500 font-medium transition-colors cursor-pointer"
            >
              {viewMode === 'public' ? 'Área Restrita / Gestão' : 'Voltar ao Mídia Kit'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <AvatarProvider>
          <BrandGalleryProvider>
            <AppContent />
          </BrandGalleryProvider>
        </AvatarProvider>
      </ProfileProvider>
    </ThemeProvider>
  );
}
