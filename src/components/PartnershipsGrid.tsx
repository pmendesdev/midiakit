import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, ExternalLink, X, PlusCircle, RefreshCw } from 'lucide-react';
import { Partnership } from '../types';
import { useTheme } from '../context/ThemeContext';

interface PartnershipsGridProps {
  partnerships: Partnership[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onAddPartnership?: () => void;
  isRemote?: boolean;
}

export const PartnershipsGrid: React.FC<PartnershipsGridProps> = ({
  partnerships,
  isLoading = false,
  onRefresh,
  onAddPartnership,
  isRemote = false,
}) => {
  const [selectedPartnership, setSelectedPartnership] = useState<Partnership | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section id="partnerships-section" className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl border ${
            isDark ? 'bg-neutral-900 border-neutral-800 text-rose-400' : 'bg-rose-50 border-rose-100 text-rose-600'
          }`}>
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-base sm:text-lg font-bold ${isDark ? 'text-neutral-100' : 'text-slate-900'}`}>
                Cases & Campanhas Realizadas
              </h2>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${
                isDark
                  ? 'bg-neutral-800 text-neutral-300 border-neutral-700'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                {partnerships.length} parcerias
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
              Histórico comprovado de campanhas autênticas e ativações comerciais
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="Recarregar parcerias"
              className={`p-2 rounded-xl border transition-colors disabled:opacity-50 cursor-pointer ${
                isDark
                  ? 'text-neutral-400 hover:text-white bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                  : 'text-slate-600 hover:text-slate-900 bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          )}

          {onAddPartnership && (
            <button
              onClick={onAddPartnership}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isDark
                  ? 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-neutral-800 hover:border-neutral-700'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5 text-rose-500" />
              <span>Gerenciar</span>
            </button>
          )}
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className={`rounded-2xl border p-12 text-center backdrop-blur-md ${
          isDark ? 'border-neutral-800/80 bg-neutral-900/30' : 'border-neutral-200 bg-white/70 shadow-sm'
        }`}>
          <RefreshCw className="w-6 h-6 text-rose-500 animate-spin mx-auto mb-3" />
          <p className={`text-xs font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            Carregando parcerias do banco Supabase...
          </p>
        </div>
      ) : partnerships.length === 0 ? (
        /* Fallback visual elegante caso a tabela esteja vazia */
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-2xl border border-dashed p-8 sm:p-12 text-center backdrop-blur-md space-y-4 ${
            isDark
              ? 'border-neutral-800 bg-neutral-900/40'
              : 'border-neutral-300 bg-neutral-50/70'
          }`}
        >
          <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto text-rose-500 shadow-inner ${
            isDark ? 'bg-neutral-800/60 border-neutral-700/60' : 'bg-rose-50 border-rose-200'
          }`}>
            <Briefcase className="w-6 h-6" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className={`text-base font-bold ${isDark ? 'text-neutral-200' : 'text-neutral-900'}`}>
              Sua marca pode ser a próxima em destaque
            </h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Nenhuma parceria pública cadastrada no momento nesta temporada. Estamos selecionando marcas alinhadas ao propósito de maternidade real e autocuidado para o próximo trimestre.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {onAddPartnership && (
              <button
                onClick={onAddPartnership}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md cursor-pointer"
              >
                Cadastrar Primeira Parceria (Admin)
              </button>
            )}
          </div>
        </motion.div>
      ) : (
        /* Bento Grid of Partner Brand Logos with hover transitions */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
          {partnerships.map((partner, idx) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: Math.min(idx * 0.04, 0.25) }}
              onClick={() => setSelectedPartnership(partner)}
              className={`group relative rounded-2xl border p-4 sm:p-5 flex flex-col items-center justify-center gap-3 transition-all duration-200 cursor-pointer overflow-hidden text-center ${
                isDark
                  ? 'border-neutral-800/80 bg-neutral-900/60 hover:border-neutral-600 hover:bg-neutral-900 shadow-lg'
                  : 'border-slate-200/90 bg-white hover:border-rose-200/90 shadow-2xs hover:shadow-xs'
              }`}
            >
              {/* Card background subtle glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-rose-500/0 via-transparent to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Logo container with full color logos */}
              <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden p-2 border transition-all flex items-center justify-center ${
                isDark
                  ? 'bg-neutral-950/80 border-neutral-800/60 group-hover:border-neutral-700'
                  : 'bg-slate-50/70 border-slate-200/70 group-hover:bg-white group-hover:border-slate-300'
              }`}>
                <img
                  src={partner.logo_url}
                  alt={partner.brand_name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain group-hover:scale-105 transition-all duration-300 ease-out"
                />
              </div>

              {/* Brand Name & Description hint */}
              <div className="w-full">
                <h4 className={`text-xs font-bold truncate transition-colors ${
                  isDark ? 'text-neutral-200 group-hover:text-rose-400' : 'text-slate-900 group-hover:text-rose-600'
                }`}>
                  {partner.brand_name}
                </h4>
                <p className={`text-[10px] truncate mt-0.5 ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                  {partner.category || 'Campanha Oficial'}
                </p>
              </div>

              {/* Quick hover badge */}
              <span className="text-[10px] font-medium text-slate-400 group-hover:text-rose-600 flex items-center gap-1 transition-colors">
                Ver detalhes <ExternalLink className="w-2.5 h-2.5" />
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Partnership Detail Modal */}
      <AnimatePresence>
        {selectedPartnership && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className={`relative w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4 ${
                isDark
                  ? 'border-neutral-800 bg-neutral-900'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <button
                onClick={() => setSelectedPartnership(null)}
                className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDark
                    ? 'text-neutral-400 hover:text-white bg-neutral-800/80 hover:bg-neutral-800'
                    : 'text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3.5">
                <div className={`w-14 h-14 rounded-xl p-2 border flex items-center justify-center overflow-hidden shrink-0 ${
                  isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <img
                    src={selectedPartnership.logo_url}
                    alt={selectedPartnership.brand_name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                    {selectedPartnership.brand_name}
                  </h3>
                  <span className="text-xs text-rose-500 font-mono">
                    {selectedPartnership.category || 'Parceria Comercial'}
                  </span>
                </div>
              </div>

              <div className={`space-y-1.5 rounded-xl p-3.5 border ${
                isDark ? 'bg-neutral-950/60 border-neutral-800/60' : 'bg-neutral-50 border-neutral-200'
              }`}>
                <span className={`text-[11px] font-semibold uppercase tracking-wider font-mono ${
                  isDark ? 'text-neutral-400' : 'text-neutral-500'
                }`}>
                  Escopo da Campanha
                </span>
                <p className={`text-xs sm:text-sm leading-relaxed ${
                  isDark ? 'text-neutral-200' : 'text-neutral-700'
                }`}>
                  {selectedPartnership.campaign_description}
                </p>
              </div>

              <div className={`flex items-center justify-between text-xs pt-2 border-t ${
                isDark ? 'text-neutral-400 border-neutral-800' : 'text-neutral-600 border-neutral-200'
              }`}>
                <span>
                  Registrada em:{' '}
                  <strong className={`font-mono ${isDark ? 'text-neutral-300' : 'text-neutral-800'}`}>
                    {new Date(selectedPartnership.created_at).toLocaleDateString('pt-BR')}
                  </strong>
                </span>

                {selectedPartnership.link && (
                  <a
                    href={selectedPartnership.link}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isDark
                        ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                    }`}
                  >
                    <span>Abrir Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
