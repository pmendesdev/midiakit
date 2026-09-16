import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, Award, ShieldCheck, Calendar, Activity } from 'lucide-react';
import { FOLLOWER_GROWTH_DATA } from '../data/influencerData';
import { FollowerGrowthPoint } from '../types';
import { useTheme } from '../context/ThemeContext';

export const FollowerGrowthChart: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [chartType, setChartType] = useState<'line' | 'area' | 'monthly'>('line');
  const [activeItem, setActiveItem] = useState<FollowerGrowthPoint>(
    FOLLOWER_GROWTH_DATA[FOLLOWER_GROWTH_DATA.length - 1]
  );

  const totalGrowth = FOLLOWER_GROWTH_DATA[FOLLOWER_GROWTH_DATA.length - 1].followers - FOLLOWER_GROWTH_DATA[0].followers;
  const growthPercentage = ((totalGrowth / FOLLOWER_GROWTH_DATA[0].followers) * 100).toFixed(1);

  return (
    <div
      id="follower-growth-chart-card"
      className={`relative rounded-3xl border p-5 sm:p-7 transition-all backdrop-blur-md overflow-hidden ${
        isDark
          ? 'bg-neutral-900/80 border-neutral-800 shadow-xl'
          : 'bg-white border-slate-200/90 shadow-2xs'
      }`}
    >
      {/* Card Header */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b mb-5 ${
        isDark ? 'border-neutral-800' : 'border-slate-100'
      }`}>
        <div className="flex items-start sm:items-center gap-3">
          <div
            className={`p-2.5 rounded-2xl border shrink-0 ${
              isDark
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                : 'bg-rose-50 text-rose-600 border-rose-100'
            }`}
          >
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Tendência de Crescimento de Seguidores
              </h3>
              <span className={`inline-flex items-center text-[11px] font-semibold font-mono px-2.5 py-0.5 rounded-full border ${
                isDark
                  ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                  : 'bg-rose-50 text-rose-700 border-rose-200/80'
              }`}>
                +{totalGrowth.toLocaleString('pt-BR')} (+{growthPercentage}%)
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
              Evolução dos últimos 6 meses (Abril a Setembro) auditada via Instagram Insights
            </p>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-2 self-start lg:self-auto">
          <div className={`inline-flex p-1 rounded-2xl border ${
            isDark
              ? 'bg-neutral-800/80 border-neutral-700'
              : 'bg-slate-100/90 border-slate-200/70'
          }`}>
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                chartType === 'line'
                  ? isDark
                    ? 'bg-neutral-900 text-white shadow-xs font-bold'
                    : 'bg-white text-rose-600 shadow-2xs font-bold'
                  : isDark
                  ? 'text-neutral-400 hover:text-neutral-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Gráfico de Linha
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                chartType === 'area'
                  ? isDark
                    ? 'bg-neutral-900 text-white shadow-xs font-bold'
                    : 'bg-white text-rose-600 shadow-2xs font-bold'
                  : isDark
                  ? 'text-neutral-400 hover:text-neutral-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Área
            </button>
            <button
              onClick={() => setChartType('monthly')}
              className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                chartType === 'monthly'
                  ? isDark
                    ? 'bg-neutral-900 text-white shadow-xs font-bold'
                    : 'bg-white text-rose-600 shadow-2xs font-bold'
                  : isDark
                  ? 'text-neutral-400 hover:text-neutral-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Barras Mensais
            </button>
          </div>
        </div>
      </div>

      {/* Snapshot Highlight Badges - Neutral & Rose Palette */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-colors ${
          isDark
            ? 'bg-neutral-950/40 border-neutral-800/80'
            : 'bg-slate-50/70 border-slate-200/60 hover:bg-slate-50'
        }`}>
          <span className={`text-[11px] font-medium ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
            Base Atual (Setembro)
          </span>
          <div className="mt-1.5 flex items-baseline justify-between gap-1">
            <span className={`text-xl font-extrabold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
              110.8K
            </span>
            <span className={`text-[11px] font-bold font-mono px-1.5 py-0.5 rounded ${
              isDark
                ? 'bg-rose-500/15 text-rose-300'
                : 'bg-rose-50 text-rose-600 border border-rose-100/80'
            }`}>
              +4.6K/mês
            </span>
          </div>
        </div>

        <div className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-colors ${
          isDark
            ? 'bg-neutral-950/40 border-neutral-800/80'
            : 'bg-slate-50/70 border-slate-200/60 hover:bg-slate-50'
        }`}>
          <span className={`text-[11px] font-medium ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
            Média Mensal
          </span>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className={`text-xl font-extrabold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
              +3.7K
            </span>
            <span className={`text-[11px] font-medium ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
              novos fãs
            </span>
          </div>
        </div>

        <div className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-colors ${
          isDark
            ? 'bg-neutral-950/40 border-neutral-800/80'
            : 'bg-slate-50/70 border-slate-200/60 hover:bg-slate-50'
        }`}>
          <span className={`text-[11px] font-medium ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
            Mês de Destaque
          </span>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold font-mono text-rose-600">
              Julho
            </span>
            <span className="text-[11px] font-semibold text-rose-500/90">
              Marco 100K
            </span>
          </div>
        </div>

        <div className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-colors ${
          isDark
            ? 'bg-neutral-950/40 border-neutral-800/80'
            : 'bg-slate-50/70 border-slate-200/60 hover:bg-slate-50'
        }`}>
          <span className={`text-[11px] font-medium ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
            Qualidade da Base
          </span>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className={`text-xl font-extrabold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
              98.4%
            </span>
            <span className="text-[11px] font-semibold text-rose-600">
              Retenção Real
            </span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart
              data={FOLLOWER_GROWTH_DATA}
              margin={{ top: 16, right: 16, left: -14, bottom: 4 }}
              onMouseMove={(e: any) => {
                if (e?.activePayload?.[0]?.payload) {
                  setActiveItem(e.activePayload[0].payload as FollowerGrowthPoint);
                }
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.06)'}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                dy={8}
                tick={{
                  fontSize: 12,
                  fill: isDark ? '#a3a3a3' : '#64748b',
                  fontWeight: 600,
                }}
              />
              <YAxis
                domain={[80000, 115000]}
                tickLine={false}
                axisLine={false}
                dx={-4}
                tickFormatter={(val: number) => `${Math.round(val / 1000)}k`}
                tick={{
                  fontSize: 11,
                  fill: isDark ? '#737373' : '#94a3b8',
                  fontFamily: 'monospace',
                }}
              />
              <ReferenceLine
                y={100000}
                stroke="#f43f5e"
                strokeDasharray="4 4"
                strokeOpacity={0.65}
                label={{
                  value: '★ Marco 100K',
                  position: 'insideTopLeft',
                  fill: isDark ? '#fb7185' : '#e11d48',
                  fontSize: 10,
                  fontWeight: 700,
                }}
              />
              <Tooltip
                content={<CustomTooltip isDark={isDark} />}
                cursor={{
                  stroke: isDark ? 'rgba(244, 63, 94, 0.4)' : 'rgba(244, 63, 94, 0.3)',
                  strokeWidth: 1.5,
                  strokeDasharray: '4 4',
                }}
              />
              <Line
                type="monotone"
                dataKey="followers"
                name="Seguidores"
                stroke="#e11d48"
                strokeWidth={3}
                dot={{
                  r: 4.5,
                  fill: isDark ? '#171717' : '#ffffff',
                  stroke: '#e11d48',
                  strokeWidth: 2.5,
                }}
                activeDot={{
                  r: 7,
                  fill: '#e11d48',
                  stroke: isDark ? '#171717' : '#ffffff',
                  strokeWidth: 3,
                }}
              />
            </LineChart>
          ) : chartType === 'area' ? (
            <AreaChart
              data={FOLLOWER_GROWTH_DATA}
              margin={{ top: 12, right: 12, left: -14, bottom: 4 }}
              onMouseMove={(e: any) => {
                if (e?.activePayload?.[0]?.payload) {
                  setActiveItem(e.activePayload[0].payload as FollowerGrowthPoint);
                }
              }}
            >
              <defs>
                <linearGradient id="roseFollowerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity={isDark ? 0.32 : 0.22} />
                  <stop offset="60%" stopColor="#fb7185" stopOpacity={isDark ? 0.12 : 0.06} />
                  <stop offset="100%" stopColor="#fda4af" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.06)'}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                dy={8}
                tick={{
                  fontSize: 12,
                  fill: isDark ? '#a3a3a3' : '#64748b',
                  fontWeight: 600,
                }}
              />
              <YAxis
                domain={[80000, 115000]}
                tickLine={false}
                axisLine={false}
                dx={-4}
                tickFormatter={(val: number) => `${Math.round(val / 1000)}k`}
                tick={{
                  fontSize: 11,
                  fill: isDark ? '#737373' : '#94a3b8',
                  fontFamily: 'monospace',
                }}
              />
              <ReferenceLine
                y={100000}
                stroke="#f43f5e"
                strokeDasharray="4 4"
                strokeOpacity={0.65}
                label={{
                  value: '★ Marco 100K',
                  position: 'insideTopLeft',
                  fill: isDark ? '#fb7185' : '#e11d48',
                  fontSize: 10,
                  fontWeight: 700,
                }}
              />
              <Tooltip
                content={<CustomTooltip isDark={isDark} />}
                cursor={{
                  stroke: isDark ? 'rgba(244, 63, 94, 0.35)' : 'rgba(244, 63, 94, 0.25)',
                  strokeWidth: 1.5,
                  strokeDasharray: '4 4',
                }}
              />
              <Area
                type="natural"
                dataKey="followers"
                stroke="#e11d48"
                strokeWidth={2.5}
                fill="url(#roseFollowerGradient)"
                activeDot={{
                  r: 5.5,
                  fill: '#e11d48',
                  stroke: isDark ? '#171717' : '#ffffff',
                  strokeWidth: 2.5,
                }}
              />
            </AreaChart>
          ) : (
            <BarChart
              data={FOLLOWER_GROWTH_DATA}
              margin={{ top: 12, right: 12, left: -14, bottom: 4 }}
              onMouseMove={(e: any) => {
                if (e?.activePayload?.[0]?.payload) {
                  setActiveItem(e.activePayload[0].payload as FollowerGrowthPoint);
                }
              }}
            >
              <defs>
                <linearGradient id="roseBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e11d48" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#fb7185" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                dy={8}
                tick={{
                  fontSize: 12,
                  fill: isDark ? '#a3a3a3' : '#64748b',
                  fontWeight: 600,
                }}
              />
              <YAxis
                domain={[0, 5500]}
                tickLine={false}
                axisLine={false}
                dx={-4}
                tickFormatter={(val: number) => `+${(val / 1000).toFixed(1)}k`}
                tick={{
                  fontSize: 11,
                  fill: isDark ? '#737373' : '#94a3b8',
                  fontFamily: 'monospace',
                }}
              />
              <Tooltip
                content={<CustomTooltip isMonthly isDark={isDark} />}
                cursor={{
                  fill: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(244, 63, 94, 0.04)',
                  radius: 8,
                }}
              />
              <Bar
                dataKey="newFollowers"
                fill="url(#roseBarGradient)"
                radius={[8, 8, 2, 2]}
                maxBarSize={44}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Selected Month Milestone Info Banner */}
      <div className={`mt-5 pt-4 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
        isDark ? 'border-neutral-800' : 'border-slate-100'
      }`}>
        <div className="flex items-center gap-2.5">
          <span className={`p-1.5 rounded-xl border shrink-0 ${
            isDark
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              : 'bg-rose-50 text-rose-600 border-rose-100'
          }`}>
            <Calendar className="w-3.5 h-3.5" />
          </span>
          <span className={isDark ? 'text-neutral-300' : 'text-slate-600'}>
            <strong className={isDark ? 'text-white' : 'text-slate-900'}>{activeItem.monthFull}</strong>:{' '}
            {activeItem.highlightEvent || 'Consistência e engajamento contínuo da comunidade.'}
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500 shrink-0">
          <span className={`inline-flex items-center gap-1.5 ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>
            <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
            100% Orgânico
          </span>
          <span>•</span>
          <span className={`inline-flex items-center gap-1.5 ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>
            <Award className="w-3.5 h-3.5 text-slate-400" />
            {activeItem.impressions} impressões
          </span>
        </div>
      </div>
    </div>
  );
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  isMonthly?: boolean;
  isDark?: boolean;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, isDark = false }) => {
  if (!active || !payload || !payload.length) return null;
  const data: FollowerGrowthPoint = payload[0].payload;

  return (
    <div
      className={`rounded-2xl border p-3.5 shadow-xl space-y-2 min-w-[210px] backdrop-blur-md transition-all ${
        isDark
          ? 'border-neutral-800 bg-neutral-900/95 text-white shadow-neutral-950/60'
          : 'border-slate-200/90 bg-white/95 text-slate-900 shadow-slate-200/50'
      }`}
    >
      <div
        className={`flex items-center justify-between gap-2 border-b pb-1.5 ${
          isDark ? 'border-neutral-800' : 'border-slate-100'
        }`}
      >
        <span className="text-xs font-bold tracking-tight">{data.monthFull} 2026</span>
        <span
          className={`text-[10px] font-semibold font-mono px-2 py-0.5 rounded-full border ${
            isDark
              ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
              : 'bg-rose-50 text-rose-700 border-rose-100'
          }`}
        >
          {data.growthRate}
        </span>
      </div>

      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className={isDark ? 'text-neutral-400' : 'text-slate-500'}>Total de Seguidores:</span>
          <span className="font-bold font-mono">{data.followers.toLocaleString('pt-BR')}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className={isDark ? 'text-neutral-400' : 'text-slate-500'}>Novos no Mês:</span>
          <span className="font-semibold font-mono text-rose-600">+{data.newFollowers.toLocaleString('pt-BR')}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className={isDark ? 'text-neutral-400' : 'text-slate-500'}>Impressões:</span>
          <span className={`font-medium font-mono ${isDark ? 'text-neutral-300' : 'text-slate-700'}`}>
            {data.impressions}
          </span>
        </div>
      </div>

      {data.highlightEvent && (
        <div
          className={`pt-1.5 border-t text-[11px] leading-snug ${
            isDark ? 'border-neutral-800 text-neutral-400' : 'border-slate-100 text-slate-600'
          }`}
        >
          {data.highlightEvent}
        </div>
      )}
    </div>
  );
};
