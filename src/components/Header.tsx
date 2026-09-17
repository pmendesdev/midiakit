import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BadgeCheck,
  MapPin,
  Heart,
  Baby,
  Calendar,
  Mail,
  Check,
  Send,
  Plane,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAvatar } from '../context/AvatarContext';
import { useProfile } from '../context/ProfileContext';
import { AvatarUploadModal } from './AvatarUploadModal';
import { Camera } from 'lucide-react';

interface HeaderProps {
  onOpenContact: () => void;
  onOpenAdmin?: () => void;
  onOpenCode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenContact }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { avatarUrl } = useAvatar();
  const { profile } = useProfile();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const niches = profile.niches && profile.niches.length > 0
    ? profile.niches
    : ['Maternidade Real', 'Autocuidado Feminino', 'Lifestyle & Rotina', 'Entretenimento Leve'];

  const badgeText = profile.badgeText || `Mãe do ${profile.sonName} (${profile.sonAge} anos)`;
  const ctaText = profile.ctaText || 'Solicitar Proposta Comercial';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.contact.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <motion.header
      id="profile-header"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`relative w-full rounded-3xl border p-6 sm:p-8 md:p-9 backdrop-blur-xl overflow-hidden transition-all duration-300 ${
        isDark
          ? 'border-neutral-800/90 bg-neutral-900/70 shadow-2xl'
          : 'border-neutral-200/90 bg-white/95 shadow-xl shadow-slate-200/40'
      }`}
    >
      {/* Subtle ambient luxury lighting */}
      <div className={`absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full blur-3xl pointer-events-none transition-opacity duration-300 ${
        isDark ? 'bg-rose-500/10' : 'bg-rose-300/20'
      }`} />
      <div className={`absolute bottom-0 left-1/4 -mb-20 h-60 w-60 rounded-full blur-3xl pointer-events-none transition-opacity duration-300 ${
        isDark ? 'bg-amber-500/5' : 'bg-amber-200/20'
      }`} />

      {/* Main Profile Grid */}
      <div className="relative grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-9 items-center">
        {/* Official Profile Portrait */}
        <div className="md:col-span-4 lg:col-span-3 flex justify-center md:justify-start">
          <div className="group relative">
            <div
              id="header-avatar-container"
              onClick={() => setIsAvatarModalOpen(true)}
              className={`relative w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52 rounded-3xl overflow-hidden border p-1.5 shadow-xl transition-all duration-300 cursor-pointer ${
                isDark
                  ? 'border-neutral-700/80 bg-neutral-950 hover:border-rose-500/50'
                  : 'border-neutral-200 bg-white shadow-slate-200/70 hover:border-rose-300'
              }`}
              title="Clique para alterar a foto de perfil"
            >
              <img
                src={avatarUrl}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-2xl grayscale transition-all duration-700 ease-out transform group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 dark:ring-white/10 pointer-events-none" />

              {/* Hover overlay hint */}
              <div className="absolute inset-1.5 rounded-2xl bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1.5 text-white p-3 text-center pointer-events-none">
                <div className="p-2 rounded-full bg-rose-600/90 shadow-lg">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <span className="text-[11px] font-bold tracking-tight leading-tight">
                  Alterar Foto
                </span>
              </div>
            </div>

            {/* Floating verification badge */}
            <div
              className={`absolute -bottom-2 -right-1.5 border rounded-xl px-3 py-1.5 flex items-center gap-1.5 shadow-lg transition-colors ${
                isDark
                  ? 'bg-neutral-900 border-neutral-700/90 text-neutral-200'
                  : 'bg-white border-neutral-200 text-neutral-800 shadow-slate-300/50'
              }`}
              title="Criadora Verificada"
            >
              <BadgeCheck className="w-4 h-4 text-sky-500 fill-sky-500/20" />
              <span className="text-[11px] font-bold tracking-tight">
                Creator Oficial
              </span>
            </div>
          </div>
        </div>

        {/* Profile Info and Narrative */}
        <div className="md:col-span-8 lg:col-span-9 space-y-4 text-center md:text-left">
          <div>
            {/* Category tag */}
            <div className="inline-flex items-center text-[11px] font-semibold uppercase tracking-wider text-rose-500 mb-1.5">
              <span>Maternidade, Autocuidado & Lifestyle Real</span>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-1.5">
              <h1 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight ${
                isDark ? 'text-neutral-100' : 'text-neutral-900'
              }`}>
                {profile.name}
              </h1>
              <span className="text-sm sm:text-base font-semibold text-rose-500 font-mono bg-rose-500/10 px-2.5 py-0.5 rounded-lg border border-rose-500/20">
                {profile.handle}
              </span>
            </div>

            {/* Meta badges */}
            <div className={`flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-xs mt-2.5 ${
              isDark ? 'text-neutral-400' : 'text-slate-600'
            }`}>
              <span className="inline-flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                {profile.city} ({profile.state})
              </span>
              <span className={isDark ? 'text-neutral-700' : 'text-slate-300'}>•</span>
              <span className="inline-flex items-center gap-1 font-medium">
                <Plane className="w-3.5 h-3.5 text-slate-400" />
                Disponível para ações nacionais
              </span>
              <span className={isDark ? 'text-neutral-700' : 'text-slate-300'}>•</span>
              <span className={`inline-flex items-center gap-1 font-semibold ${
                isDark ? 'text-rose-400' : 'text-rose-600'
              }`}>
                <Baby className="w-3.5 h-3.5 text-rose-500" />
                {badgeText}
              </span>
            </div>
          </div>

          {/* Bio text */}
          <p className={`text-sm sm:text-base leading-relaxed max-w-2xl font-normal ${
            isDark ? 'text-neutral-300' : 'text-slate-600'
          }`}>
            {profile.bio}
          </p>

          {/* Niches Pills */}
          <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-2">
            {niches.map((pill) => (
              <span
                key={pill}
                className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-colors ${
                  isDark
                    ? 'bg-neutral-800/80 text-neutral-300 border-neutral-700/60 hover:border-neutral-600'
                    : 'bg-slate-100/90 text-slate-700 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {pill}
              </span>
            ))}
          </div>

          {/* Quick High-Impact KPI Strip */}
          <div className={`mt-4 pt-4 border-t grid grid-cols-2 sm:grid-cols-4 gap-3 ${
            isDark ? 'border-neutral-800/80' : 'border-slate-100'
          }`}>
            <div className="text-left">
              <span className={`text-[11px] font-medium block ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                Seguidores
              </span>
              <span className={`text-base font-bold font-mono tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                +110K
              </span>
            </div>
            <div className="text-left">
              <span className={`text-[11px] font-medium block ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                Público Feminino
              </span>
              <span className={`text-base font-bold font-mono tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                81.1%
              </span>
            </div>
            <div className="text-left">
              <span className={`text-[11px] font-medium block ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                Engajamento
              </span>
              <span className={`text-base font-bold font-mono tracking-tight text-rose-500`}>
                4.85%
              </span>
            </div>
            <div className="text-left">
              <span className={`text-[11px] font-medium block ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
                Impressões / Mês
              </span>
              <span className={`text-base font-bold font-mono tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                +1.7M
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <button
              id="btn-header-contact"
              onClick={onOpenContact}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-md shadow-rose-950/20 hover:shadow-rose-900/30 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{ctaText}</span>
            </button>

            <button
              id="btn-copy-email-header"
              onClick={handleCopyEmail}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                isDark
                  ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs'
              }`}
              title="Copiar e-mail da assessoria"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-500 font-bold">E-mail Copiado!</span>
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 text-rose-500" />
                  <span>{profile.contact.email}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Avatar Upload Modal accessible by clicking the avatar */}
      <AvatarUploadModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
      />
    </motion.header>
  );
};


