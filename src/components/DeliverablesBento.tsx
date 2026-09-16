import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Radio,
  CheckCircle2,
  PackageCheck,
  Image,
  Zap,
  CalendarCheck,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { DELIVERABLES_DATA } from '../data/influencerData';
import { useTheme } from '../context/ThemeContext';

const iconMap: Record<string, React.ElementType> = {
  Radio,
  CheckCircle2,
  PackageCheck,
  Image,
  Zap,
  CalendarCheck,
};

const CATEGORIES = [
  { id: 'all', label: 'Todos os Formatos (6)' },
  { id: 'Stories & Lives', label: 'Stories & Lives' },
  { id: 'Vídeo & Review', label: 'Vídeo & Review' },
  { id: 'Feed & Presença', label: 'Feed & Presença' },
];

interface DeliverablesBentoProps {
  onOpenContact?: () => void;
}

export const DeliverablesBento: React.FC<DeliverablesBentoProps> = ({ onOpenContact }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredItems = activeCategory === 'all'
    ? DELIVERABLES_DATA
    : DELIVERABLES_DATA.filter((item) => item.category === activeCategory);

  return (
    <motion.div
      id="deliverables-card"
      initial={{ opacity: 0, scale: 0.95, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className={`rounded-3xl border p-6 sm:p-7 shadow-xs flex flex-col justify-between w-full backdrop-blur-md transition-colors ${
        isDark
          ? 'bg-neutral-900/70 border-neutral-800/80 shadow-xl'
          : 'bg-white/95 border-slate-200/90 shadow-slate-200/30'
      }`}
    >
      <div>
        {/* Section Header */}
        <div className="flex items-start sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border shadow-2xs ${
                isDark
                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  : 'bg-rose-50 border-rose-100 text-rose-600'
              }`}
            >
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3
                className={`text-base sm:text-lg font-bold tracking-tight leading-tight ${
                  isDark ? 'text-neutral-100' : 'text-slate-900'
                }`}
              >
                Formatos & Entregáveis
              </h3>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                Soluções sob medida para ativação de marca, autoridade e conversão
              </p>
            </div>
          </div>

          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${
              isDark
                ? 'bg-neutral-800 text-neutral-300 border-neutral-700'
                : 'bg-slate-100 text-slate-700 border-slate-200/80'
            }`}
          >
            6 Formatos
          </span>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-4 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all duration-150 whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-rose-600 text-white font-bold shadow-xs'
                  : isDark
                  ? 'bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-300 border border-neutral-700/60'
                  : 'bg-slate-100/90 hover:bg-slate-200/80 text-slate-600 border border-slate-200/70'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Deliverables Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => {
              const Icon = iconMap[item.icon] || Zap;
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: index * 0.04 }}
                  className={`group p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                    item.highlight
                      ? isDark
                        ? 'bg-neutral-900/90 border-rose-500/40 hover:border-rose-500/70 shadow-lg shadow-rose-950/20'
                        : 'bg-gradient-to-b from-rose-50/50 to-white border-rose-200/90 hover:border-rose-300 shadow-2xs hover:shadow-xs'
                      : isDark
                      ? 'bg-neutral-950/50 border-neutral-800/80 hover:bg-neutral-900/80 hover:border-neutral-700'
                      : 'bg-slate-50/60 border-slate-200/80 hover:bg-white hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div>
                    {/* Top Row: Icon + Title & Highlight badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 border ${
                            item.highlight
                              ? isDark
                                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                                : 'bg-rose-100 text-rose-600 border-rose-200'
                              : isDark
                              ? 'bg-neutral-800 text-neutral-300 border-neutral-700'
                              : 'bg-white text-rose-600 border-slate-200'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4
                            className={`text-sm font-bold transition-colors leading-tight ${
                              isDark
                                ? 'text-neutral-100 group-hover:text-rose-400'
                                : 'text-slate-900 group-hover:text-rose-600'
                            }`}
                          >
                            {item.title}
                          </h4>
                          <span
                            className={`text-[11px] font-medium ${
                              isDark ? 'text-neutral-400' : 'text-slate-500'
                            }`}
                          >
                            {item.tag}
                          </span>
                        </div>
                      </div>

                      {item.highlight ? (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border ${
                            isDark
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {item.benefit}
                        </span>
                      ) : (
                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-md shrink-0 border ${
                            isDark
                              ? 'bg-neutral-800 text-neutral-400 border-neutral-700'
                              : 'bg-slate-100 text-slate-600 border-slate-200/70'
                          }`}
                        >
                          {item.benefit}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p
                      className={`mt-2.5 text-xs leading-relaxed line-clamp-2 ${
                        isDark ? 'text-neutral-400' : 'text-slate-600'
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>

                  {/* Footer metadata */}
                  <div
                    className={`mt-3 pt-2.5 border-t flex items-center justify-between gap-2 text-xs ${
                      isDark ? 'border-neutral-800/80' : 'border-slate-200/60'
                    }`}
                  >
                    <span
                      className={`text-[11px] font-medium truncate flex items-center gap-1.5 ${
                        isDark ? 'text-neutral-400' : 'text-slate-500'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      {item.format}
                    </span>

                    <span
                      className={`text-[10px] font-semibold font-mono ${
                        isDark ? 'text-emerald-400' : 'text-emerald-600'
                      }`}
                    >
                      Disponível
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Section Footer */}
      <div
        className={`mt-5 pt-3.5 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs ${
          isDark ? 'border-neutral-800/80' : 'border-slate-100'
        }`}
      >
        <span className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
          Possibilidade de pacotes 360° personalizados com exclusividade de segmento.
        </span>

        {onOpenContact && (
          <button
            onClick={onOpenContact}
            className="text-[11px] font-bold text-rose-500 hover:text-rose-600 inline-flex items-center gap-1 cursor-pointer transition-colors shrink-0"
          >
            <span>Consultar Valores & Grade</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

