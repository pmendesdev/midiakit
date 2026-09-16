import React from 'react';
import { motion } from 'motion/react';
import { Users, TrendingUp, Heart, Eye, Share2 } from 'lucide-react';
import { METRICS_DATA } from '../data/influencerData';
import { useTheme } from '../context/ThemeContext';
import { FollowerGrowthChart } from './FollowerGrowthChart';

const iconMap: Record<string, React.ElementType> = {
  Users,
  TrendingUp,
  Heart,
  Eye,
  Share2,
};

export const MetricsCards: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section id="metrics-section" className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-2 rounded-xl border ${
              isDark
                ? 'bg-neutral-900 border-neutral-800 text-rose-400'
                : 'bg-rose-50 border-rose-100 text-rose-600'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-base sm:text-lg font-bold ${isDark ? 'text-neutral-100' : 'text-slate-900'}`}>
                Performance & Alcance
              </h2>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${
                  isDark
                    ? 'bg-neutral-800 text-neutral-300 border-neutral-700'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                +1.2M impressões/mês
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
              Métricas consolidadas e auditadas dos últimos 30 dias no Instagram
            </p>
          </div>
        </div>

        <span className={`text-xs font-mono px-2.5 py-1 rounded-lg border ${
          isDark
            ? 'bg-neutral-900 border-neutral-800 text-neutral-400'
            : 'bg-white border-slate-200 text-slate-600'
        }`}>
          Atualizado mensalmente
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {METRICS_DATA.map((metric, index) => {
          const Icon = iconMap[metric.iconName] || Users;
          return (
            <motion.div
              key={metric.id}
              id={`metric-card-${metric.id}`}
              initial={{ opacity: 0, scale: 0.93, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              whileHover={{ scale: 1.025, y: -2 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: index * 0.06 }}
              className={`group relative rounded-2xl border p-5 transition-all duration-200 backdrop-blur-md overflow-hidden ${
                metric.highlight
                  ? isDark
                    ? 'bg-neutral-900/80 border-rose-500/30 hover:border-rose-500/60 shadow-lg shadow-rose-950/20'
                    : 'bg-gradient-to-b from-rose-50/70 to-white border-rose-200/90 shadow-2xs hover:shadow-xs'
                  : isDark
                  ? 'bg-neutral-900/50 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/80'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs'
              }`}
            >
              {/* Subtle top indicator highlight */}
              {metric.highlight && (
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-500 to-amber-500" />
              )}

              <div className="flex items-start justify-between mb-3.5">
                <span className={`text-xs font-semibold ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>
                  {metric.label}
                </span>
                <div
                  className={`p-2 rounded-xl border transition-colors ${
                    metric.highlight
                      ? isDark
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : 'bg-rose-100/70 text-rose-600 border-rose-200/70'
                      : isDark
                      ? 'bg-neutral-800/80 text-neutral-400 border-neutral-700'
                      : 'bg-slate-100 text-slate-600 border-slate-200/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1">
                <div className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-mono ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {metric.value}
                </div>
                {metric.change && (
                  <div className={`inline-flex items-center text-xs font-semibold font-mono ${
                    isDark ? 'text-emerald-400/90' : 'text-emerald-600'
                  }`}>
                    {metric.change}
                  </div>
                )}
              </div>

              <p className={`mt-3 text-xs leading-relaxed border-t pt-3 ${
                isDark
                  ? 'text-neutral-400 border-neutral-800/60'
                  : 'text-slate-500 border-slate-100'
              }`}>
                {metric.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Follower Growth Chart (Last 6 Months) with Recharts */}
      <FollowerGrowthChart />
    </section>
  );
};
