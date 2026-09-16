import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  Search,
  Plus,
  ExternalLink,
  Tag,
  CheckCircle2,
  Calendar,
  Layers,
  SlidersHorizontal,
  X,
  Trash2,
  Edit2,
  ArrowUpRight,
  ShieldCheck,
  HeartHandshake,
} from 'lucide-react';
import { useBrandGallery } from '../context/BrandGalleryContext';
import { useTheme } from '../context/ThemeContext';
import { COMPANY_CATEGORIES } from '../data/companyLogosData';
import { CompanyLogo } from '../types';
import { AddCompanyLogoModal } from './AddCompanyLogoModal';

interface CompanyLogosGalleryProps {
  onOpenContact?: () => void;
  allowEdit?: boolean;
}

export const CompanyLogosGallery: React.FC<CompanyLogosGalleryProps> = ({
  onOpenContact,
  allowEdit = false,
}) => {
  const { companies, deleteCompany } = useBrandGallery();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [activeCategory, setActiveCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'marquee'>('marquee');
  const [selectedCompany, setSelectedCompany] = useState<CompanyLogo | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<CompanyLogo | null>(null);

  // Filtered companies based on search and category
  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesCategory =
        activeCategory === 'Todas' || company.category === activeCategory;
      const matchesSearch =
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (company.campaignDescription &&
          company.campaignDescription.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (company.deliverables &&
          company.deliverables.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [companies, activeCategory, searchQuery]);

  const handleEdit = (comp: CompanyLogo, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCompany(comp);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Deseja remover esta empresa da galeria?')) {
      deleteCompany(id);
      if (selectedCompany?.id === id) {
        setSelectedCompany(null);
      }
    }
  };

  return (
    <section id="company-logos-gallery" className="space-y-5">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-xl border ${
              isDark
                ? 'bg-neutral-900 border-neutral-800 text-rose-400'
                : 'bg-rose-50 border-rose-200 text-rose-600'
            }`}
          >
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-lg font-bold ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>
                Marcas Parceiras
              </h2>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${
                  isDark
                    ? 'bg-neutral-800 text-neutral-300 border-neutral-700'
                    : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                }`}
              >
                +{companies.length} marcas
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Marcas que já escolheram Jessica Rosa para amplificar autoridade e vendas
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Grid vs Marquee switcher */}
          <div
            className={`flex items-center p-1 rounded-2xl border ${
              isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-slate-100 border-slate-200/80'
            }`}
          >
            <button
              onClick={() => setViewMode('marquee')}
              className={`px-3 py-1 text-xs rounded-xl font-semibold transition-all cursor-pointer ${
                viewMode === 'marquee'
                  ? isDark
                    ? 'bg-neutral-800 text-white shadow-xs'
                    : 'bg-white text-rose-600 shadow-2xs'
                  : isDark
                  ? 'text-neutral-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Carrossel
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 text-xs rounded-xl font-semibold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? isDark
                    ? 'bg-neutral-800 text-white shadow-xs'
                    : 'bg-white text-rose-600 shadow-2xs'
                  : isDark
                  ? 'text-neutral-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Grade ({companies.length})
            </button>
          </div>

          {allowEdit && (
            <button
              id="btn-add-company-logo"
              onClick={() => {
                setEditingCompany(null);
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-sm shadow-rose-950/20 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Marca</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: Infinite Marquee Ticker */}
      {viewMode === 'marquee' ? (
        <div
          className={`relative w-full rounded-2xl border overflow-hidden p-3.5 sm:p-4 backdrop-blur-md transition-all ${
            isDark
              ? 'border-neutral-800/80 bg-neutral-900/40'
              : 'border-slate-200/80 bg-white/80 shadow-2xs'
          }`}
        >
          {/* Marquee Track */}
          <div className="relative w-full overflow-hidden mask-gradient-x py-1">
            <div className="flex w-max items-center gap-3 animate-marquee hover:[animation-play-state:paused]">
              {[...companies, ...companies].map((comp, idx) => (
                <div
                  key={`${comp.id}-marquee-${idx}`}
                  onClick={() => setSelectedCompany(comp)}
                  className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-all duration-300 cursor-pointer select-none shrink-0 ${
                    isDark
                      ? 'border-neutral-800 bg-neutral-950/80 hover:border-rose-500/50 hover:bg-neutral-900'
                      : 'border-slate-200/80 bg-slate-50/70 hover:border-rose-300 hover:bg-white hover:shadow-2xs'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg overflow-hidden p-1 flex items-center justify-center border transition-colors ${
                      isDark ? 'border-neutral-800 bg-neutral-900' : 'border-slate-200/70 bg-white'
                    }`}
                  >
                    <img
                      src={comp.logoUrl}
                      alt={comp.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain transition-all duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <h4
                      className={`text-xs font-bold transition-colors ${
                        isDark ? 'text-neutral-200 group-hover:text-rose-400' : 'text-slate-800 group-hover:text-rose-600'
                      }`}
                    >
                      {comp.name}
                    </h4>
                    <span className={`text-[10px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                      {comp.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 px-1">
            <span>Passe o mouse para pausar o carrossel</span>
            <button
              onClick={() => setViewMode('grid')}
              className="text-rose-600 hover:text-rose-700 font-medium hover:underline cursor-pointer"
            >
              Ver todas em grade detalhada →
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {COMPANY_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-rose-600 text-white font-semibold shadow-2xs'
                      : isDark
                      ? 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800 hover:border-neutral-700'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search input */}
            <div className="relative min-w-[200px] sm:w-64">
              <Search
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${
                  isDark ? 'text-neutral-500' : 'text-slate-400'
                }`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar empresa ou campanha..."
                className={`w-full pl-8 pr-3 py-1.5 rounded-xl border text-xs focus:outline-none focus:border-rose-500 transition-colors ${
                  isDark
                    ? 'bg-neutral-900 border-neutral-800 text-white placeholder-neutral-500'
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-2xs'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

      {/* Bento Grid of Company Logos */}
      {filteredCompanies.length === 0 ? (
        <div
          className={`p-10 rounded-2xl md:rounded-3xl border text-center space-y-3 ${
            isDark ? 'border-neutral-800/80 bg-neutral-900/30' : 'border-neutral-200 bg-white'
          }`}
        >
          <Building2 className="w-8 h-8 text-neutral-500 mx-auto" />
          <h3 className={`text-sm font-bold ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
            Nenhuma empresa encontrada com os filtros selecionados
          </h3>
          <p className={`text-xs max-w-sm mx-auto ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Tente buscar com outro termo ou clique no botão abaixo para adicionar a primeira marca desta categoria.
          </p>
          <button
            onClick={() => {
              setActiveCategory('Todas');
              setSearchQuery('');
            }}
            className="text-xs text-rose-500 hover:underline cursor-pointer"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredCompanies.map((comp, idx) => (
            <motion.div
              key={comp.id}
              layout
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              whileHover={{ scale: 1.025, y: -2 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: Math.min(idx * 0.04, 0.25) }}
              onClick={() => setSelectedCompany(comp)}
              className={`group relative rounded-2xl md:rounded-3xl border p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                isDark
                  ? 'border-neutral-800/90 bg-neutral-900/60 hover:border-rose-500/50 hover:bg-neutral-900/90 shadow-xl'
                  : 'border-neutral-200/90 bg-white/90 hover:border-rose-300 hover:shadow-md'
              }`}
            >
              {/* Card Top: Logo Container & Category */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      isDark
                        ? 'bg-neutral-800 text-neutral-300 border-neutral-700'
                        : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                    }`}
                  >
                    {comp.category}
                  </span>

                  {allowEdit && comp.isCustom && (
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={(e) => handleEdit(comp, e)}
                        className={`p-1 rounded-md transition-colors ${
                          isDark ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-500'
                        }`}
                        title="Editar empresa"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(comp.id, e)}
                        className="p-1 rounded-md text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Remover empresa"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Main Logo Container */}
                <div
                  className={`w-full h-24 sm:h-28 rounded-2xl p-3 border flex items-center justify-center overflow-hidden transition-colors ${
                    isDark
                      ? 'border-neutral-800/80 bg-neutral-950/80 group-hover:border-rose-500/30'
                      : 'border-neutral-100 bg-neutral-50/90 group-hover:border-rose-200 group-hover:bg-white'
                  }`}
                >
                  <img
                    src={comp.logoUrl}
                    alt={comp.name}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain transition-all duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Company Title */}
                <div className="mt-3">
                  <h3
                    className={`text-sm sm:text-base font-bold transition-colors ${
                      isDark ? 'text-neutral-100 group-hover:text-rose-400' : 'text-neutral-900 group-hover:text-rose-600'
                    }`}
                  >
                    {comp.name}
                  </h3>
                  {comp.campaignDescription && (
                    <p
                      className={`text-xs line-clamp-2 mt-1 ${
                        isDark ? 'text-neutral-400' : 'text-neutral-600'
                      }`}
                    >
                      {comp.campaignDescription}
                    </p>
                  )}
                </div>
              </div>

              {/* Card Footer: Deliverables & Year */}
              <div className="mt-3 pt-2.5 border-t flex items-center justify-between text-[11px] gap-2 border-neutral-800/40 dark:border-neutral-800/40">
                <span
                  className={`font-medium truncate ${
                    isDark ? 'text-rose-400/90' : 'text-rose-600'
                  }`}
                >
                  {comp.deliverables || 'Parceria Oficial'}
                </span>
                <span
                  className={`shrink-0 font-mono text-[10px] ${
                    isDark ? 'text-neutral-500' : 'text-neutral-400'
                  }`}
                >
                  {comp.year || '2025'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
        </div>
      )}

      {/* Brand Detail Modal */}
      <AnimatePresence>
        {selectedCompany && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={`relative w-full max-w-md rounded-3xl border p-6 sm:p-7 shadow-2xl space-y-5 transition-colors ${
                isDark ? 'border-neutral-800 bg-neutral-950' : 'border-neutral-200 bg-white'
              }`}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedCompany(null)}
                className={`absolute top-5 right-5 p-1.5 rounded-xl transition-colors cursor-pointer ${
                  isDark
                    ? 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <X className="w-4 h-4" />
              </button>

              {/* Top Logo and Tag */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-16 h-16 rounded-2xl p-2 border flex items-center justify-center overflow-hidden shrink-0 ${
                    isDark ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-neutral-50'
                  }`}
                >
                  <img
                    src={selectedCompany.logoUrl}
                    alt={selectedCompany.name}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div>
                  <span
                    className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mb-1 ${
                      isDark
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {selectedCompany.category}
                  </span>
                  <h3
                    className={`text-base sm:text-lg font-bold ${
                      isDark ? 'text-white' : 'text-neutral-900'
                    }`}
                  >
                    {selectedCompany.name}
                  </h3>
                </div>
              </div>

              {/* Campaign Story */}
              <div
                className={`p-4 rounded-2xl border space-y-2 ${
                  isDark ? 'border-neutral-800/80 bg-neutral-900/50' : 'border-neutral-200 bg-neutral-50'
                }`}
              >
                <span
                  className={`text-[11px] font-mono font-semibold uppercase tracking-wider block ${
                    isDark ? 'text-neutral-400' : 'text-neutral-500'
                  }`}
                >
                  Escopo da Campanha Realizada
                </span>
                <p
                  className={`text-xs sm:text-sm leading-relaxed ${
                    isDark ? 'text-neutral-300' : 'text-neutral-700'
                  }`}
                >
                  {selectedCompany.campaignDescription ||
                    'Parceria estratégica de posicionamento de marca e engajamento comunitário.'}
                </p>
              </div>

              {/* Meta details list */}
              <div className="space-y-2 text-xs">
                {selectedCompany.deliverables && (
                  <div className="flex items-center justify-between py-1 border-b border-neutral-800/30">
                    <span className={isDark ? 'text-neutral-400' : 'text-neutral-500'}>
                      Formatos Entregues:
                    </span>
                    <span
                      className={`font-semibold ${
                        isDark ? 'text-neutral-200' : 'text-neutral-800'
                      }`}
                    >
                      {selectedCompany.deliverables}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between py-1 border-b border-neutral-800/30">
                  <span className={isDark ? 'text-neutral-400' : 'text-neutral-500'}>
                    Período da Parceria:
                  </span>
                  <span
                    className={`font-mono ${
                      isDark ? 'text-neutral-300' : 'text-neutral-700'
                    }`}
                  >
                    {selectedCompany.year || '2025 - 2026'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className={isDark ? 'text-neutral-400' : 'text-neutral-500'}>
                    Validação Comprovada:
                  </span>
                  <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Case de Sucesso
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-2">
                {selectedCompany.website && (
                  <a
                    href={selectedCompany.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors ${
                      isDark
                        ? 'border-neutral-800 hover:bg-neutral-900 text-neutral-300'
                        : 'border-neutral-200 hover:bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    <span>Conhecer a Marca</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                {onOpenContact && (
                  <button
                    onClick={() => {
                      setSelectedCompany(null);
                      onOpenContact();
                    }}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-rose-950/20"
                  >
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>Quero Essa Entrega</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add / Edit Modal (Only rendered when allowEdit is active) */}
      {allowEdit && (
        <AddCompanyLogoModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingCompany(null);
          }}
          editingCompany={editingCompany}
        />
      )}
    </section>
  );
};
