import React from 'react';
import { motion } from 'motion/react';
import { PieChart, MapPin, Users2 } from 'lucide-react';
import { DEMOGRAPHICS_DATA } from '../data/influencerData';
import { useTheme } from '../context/ThemeContext';

export const DemographicsBento: React.FC = () => {
  const { femalePercentage, malePercentage, ageBrackets, topLocations } = DEMOGRAPHICS_DATA;
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.div
      id="demographics-card"
      initial={{ opacity: 0, scale: 0.95, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className={`rounded-3xl border p-6 sm:p-7 backdrop-blur-md flex flex-col justify-between w-full transition-colors ${
        isDark
          ? 'border-neutral-800/80 bg-neutral-900/70 shadow-xl'
          : 'border-slate-200/90 bg-white/95 shadow-xs'
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
              <PieChart className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base sm:text-lg font-bold tracking-tight leading-tight ${
                isDark ? 'text-neutral-100' : 'text-slate-900'
              }`}>
                Público & Demografia
              </h3>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                Dados auditados via Instagram Insights oficial
              </p>
            </div>
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${
              isDark
                ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                : 'bg-rose-50 text-rose-700 border-rose-200/80'
            }`}
          >
            Foco Materno & Família
          </span>
        </div>

        {/* Gender Breakdown Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          className={`space-y-3 rounded-2xl p-4 sm:p-5 border mb-5 transition-colors ${
            isDark
              ? 'bg-neutral-950/60 border-neutral-800/80'
              : 'bg-slate-50/70 border-slate-200/70'
          }`}
        >
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className={`font-semibold ${isDark ? 'text-neutral-200' : 'text-slate-800'}`}>
                Mulheres
              </span>
              <span className="text-rose-500 font-mono font-extrabold text-sm">
                {femalePercentage.toFixed(1)}%
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sky-500 font-mono font-extrabold text-sm">
                {malePercentage.toFixed(1)}%
              </span>
              <span className={`font-semibold ${isDark ? 'text-neutral-200' : 'text-slate-800'}`}>
                Homens
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            </div>
          </div>

          {/* Unified Dual Progress Track */}
          <div
            className={`relative h-3 w-full overflow-hidden rounded-full p-0.5 ${
              isDark ? 'bg-neutral-800' : 'bg-slate-200/80'
            }`}
          >
            <div className="flex h-full w-full rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${femalePercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 h-full"
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${malePercentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="bg-sky-500 h-full"
              />
            </div>
          </div>

          <p className={`text-[11px] leading-relaxed ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>
            Público altamente qualificado com predominância feminina: mães, chefes de família e decisoras de compras para alimentação, bem-estar infantil e cuidados pessoais.
          </p>
        </motion.div>

        {/* Age Brackets with visual mini gauges */}
        <div className="space-y-2.5 mb-5">
          <div
            className={`text-xs font-semibold flex items-center justify-between ${
              isDark ? 'text-neutral-300' : 'text-slate-700'
            }`}
          >
            <span>Faixa Etária Predominante</span>
            <span className={`text-[11px] font-mono font-bold ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>
              25 - 44 anos (84% da audiência)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {ageBrackets.map((bracket, idx) => (
              <motion.div
                key={bracket.range}
                initial={{ opacity: 0, scale: 0.93, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                whileHover={{ scale: 1.025, y: -2 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.28 + idx * 0.05 }}
                className={`p-3 rounded-2xl border flex flex-col justify-between gap-1.5 transition-colors ${
                  isDark
                    ? 'bg-neutral-950/40 border-neutral-800/80 hover:border-neutral-700'
                    : 'bg-white border-slate-200/70 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-medium ${isDark ? 'text-neutral-300' : 'text-slate-600'}`}>
                    {bracket.range}
                  </span>
                  <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {bracket.percentage}%
                  </span>
                </div>
                {/* Visual mini bar */}
                <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-neutral-800' : 'bg-slate-100'}`}>
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${bracket.percentage}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Locations with mini meters */}
      <div className={`pt-4 border-t ${isDark ? 'border-neutral-800/80' : 'border-slate-100'}`}>
        <div
          className={`text-xs font-semibold flex items-center justify-between mb-3 ${
            isDark ? 'text-neutral-300' : 'text-slate-700'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>Distribuição Geográfica Principal</span>
          </div>
          <span className={`text-[11px] font-mono ${isDark ? 'text-neutral-500' : 'text-slate-500'}`}>
            Top Regiões
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {topLocations.slice(0, 4).map((loc, idx) => (
            <motion.div
              key={loc.city}
              initial={{ opacity: 0, scale: 0.92, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.35 + idx * 0.05 }}
              className={`p-2.5 rounded-xl border flex flex-col justify-between transition-colors ${
                isDark
                  ? 'bg-neutral-950/40 border-neutral-800/60 hover:border-neutral-700'
                  : 'bg-slate-50/70 border-slate-200/70 hover:border-slate-300'
              }`}
            >
              <span className={`text-[11px] truncate font-medium ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
                {loc.city}
              </span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-xs font-bold font-mono text-rose-500">
                  {loc.percentage}%
                </span>
                <span className={`text-[10px] ${isDark ? 'text-neutral-500' : 'text-slate-400'}`}>
                  {loc.state}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
