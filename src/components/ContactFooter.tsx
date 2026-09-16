import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  MessageCircle,
  Mail,
  Instagram,
  Copy,
  Check,
  ArrowUpRight,
  Clock,
  FileCheck,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useProfile } from '../context/ProfileContext';

export const ContactFooter: React.FC = () => {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { profile } = useProfile();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2500);
  };

  const whatsappMessage = encodeURIComponent(
    `Olá, assessoria de ${profile.name}! Vi o Mídia Kit oficial e gostaria de consultar disponibilidade e valores para uma proposta de parceria.`
  );
  const whatsappUrl = `https://wa.me/55${profile.contact.phone}?text=${whatsappMessage}`;
  const instagramUrl = `https://instagram.com/${profile.contact.instagram}`;
  const mailtoUrl = `mailto:${profile.contact.email}?subject=${encodeURIComponent(
    `Proposta Comercial - Parceria ${profile.name}`
  )}`;

  return (
    <motion.footer
      id="contact-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`relative rounded-3xl border p-6 sm:p-8 md:p-10 backdrop-blur-xl overflow-hidden space-y-8 transition-all duration-300 ${
        isDark
          ? 'border-neutral-800 bg-neutral-900/80 shadow-2xl'
          : 'border-slate-200/90 bg-gradient-to-b from-white via-white to-rose-50/30 shadow-sm'
      }`}
    >
      {/* Subtle ambient lighting */}
      <div
        className={`absolute -top-16 -right-16 h-64 w-64 rounded-full blur-3xl pointer-events-none transition-opacity ${
          isDark ? 'bg-rose-500/10' : 'bg-rose-400/15'
        }`}
      />
      <div
        className={`absolute -bottom-16 -left-16 h-64 w-64 rounded-full blur-3xl pointer-events-none transition-opacity ${
          isDark ? 'bg-amber-500/5' : 'bg-amber-300/15'
        }`}
      />

      {/* Header Section */}
      <div className="relative space-y-4 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
              isDark
                ? 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                : 'bg-rose-50 text-rose-700 border-rose-200/80'
            }`}
          >
            Parcerias Comerciais & Embaixadorias
          </span>

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
              isDark
                ? 'bg-neutral-800 text-neutral-300 border-neutral-700'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
            }`}
          >
            <Clock className="w-3 h-3 text-emerald-600" />
            Resposta média em até 2h
          </span>
        </div>

        <h2
          className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          Vamos criar uma{' '}
          <span className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 bg-clip-text text-transparent">
            narrativa autêntica
          </span>{' '}
          juntos?
        </h2>

        <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-neutral-400' : 'text-slate-600'}`}>
          A assessoria de <strong>{profile.name}</strong> analisa propostas comerciais personalizadas para
          campanhas pontuais, lançamentos ou embaixadorias anuais, com entrega de relatórios e métricas de conversão.
        </p>
      </div>

      {/* Action Channels Grid */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* WhatsApp Direct */}
        <a
          id="link-whatsapp"
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer noopener"
          className={`group rounded-2xl border p-5 transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer hover:-translate-y-1 ${
            isDark
              ? 'bg-neutral-950/70 border-neutral-800 hover:border-emerald-500/60 hover:bg-neutral-900 shadow-lg'
              : 'bg-gradient-to-b from-emerald-50/50 to-white border-emerald-200/80 hover:border-emerald-400 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl border transition-colors ${
                  isDark
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 block">
                  Canal Prioritário
                </span>
                <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  WhatsApp Comercial
                </span>
              </div>
            </div>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          <div className={`pt-2 border-t space-y-1 ${isDark ? 'border-neutral-800' : 'border-emerald-100/60'}`}>
            <div className={`text-sm sm:text-base font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {profile.contact.phoneFormatted}
            </div>
            <p className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
              Ideal para propostas com urgência e verificação de datas.
            </p>
          </div>

          <div className={`inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl text-xs font-bold transition-all group-hover:bg-emerald-600 group-hover:text-white ${
            isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100/70 text-emerald-800'
          }`}>
            <span>Iniciar Conversa</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </a>

        {/* Email Direct */}
        <a
          id="link-email"
          href={mailtoUrl}
          className={`group rounded-2xl border p-5 transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer hover:-translate-y-1 ${
            isDark
              ? 'bg-neutral-950/70 border-neutral-800 hover:border-rose-500/60 hover:bg-neutral-900 shadow-lg'
              : 'bg-gradient-to-b from-rose-50/50 to-white border-rose-200/80 hover:border-rose-400 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl border transition-colors ${
                  isDark
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    : 'bg-rose-100 text-rose-700 border-rose-200'
                }`}
              >
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-500 block">
                  Briefings & Contratos
                </span>
                <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Assessoria E-mail
                </span>
              </div>
            </div>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          <div className={`pt-2 border-t space-y-1 ${isDark ? 'border-neutral-800' : 'border-rose-100/60'}`}>
            <div className={`text-xs sm:text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {profile.contact.email}
            </div>
            <p className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
              Envio de briefings detalhados e propostas contratuais formais.
            </p>
          </div>

          <div className={`inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl text-xs font-bold transition-all group-hover:bg-rose-600 group-hover:text-white ${
            isDark ? 'bg-rose-500/20 text-rose-300' : 'bg-rose-100/70 text-rose-800'
          }`}>
            <span>Enviar Mensagem</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </a>

        {/* Instagram Direct */}
        <a
          id="link-instagram"
          href={instagramUrl}
          target="_blank"
          rel="noreferrer noopener"
          className={`group rounded-2xl border p-5 transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer hover:-translate-y-1 ${
            isDark
              ? 'bg-neutral-950/70 border-neutral-800 hover:border-fuchsia-500/60 hover:bg-neutral-900 shadow-lg'
              : 'bg-gradient-to-b from-fuchsia-50/50 to-white border-fuchsia-200/80 hover:border-fuchsia-400 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl border transition-colors ${
                  isDark
                    ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20'
                    : 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200'
                }`}
              >
                <Instagram className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-fuchsia-500 block">
                  Perfil Verificado
                </span>
                <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Instagram Oficial
                </span>
              </div>
            </div>
            <div className="p-1.5 rounded-lg bg-fuchsia-50 text-fuchsia-600 group-hover:bg-fuchsia-600 group-hover:text-white transition-all">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          <div className={`pt-2 border-t space-y-1 ${isDark ? 'border-neutral-800' : 'border-fuchsia-100/60'}`}>
            <div className={`text-sm sm:text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {profile.handle}
            </div>
            <p className={`text-[11px] ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
              Comunidade com +110 mil seguidores e 4.85% de engajamento.
            </p>
          </div>

          <div className={`inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl text-xs font-bold transition-all group-hover:bg-fuchsia-600 group-hover:text-white ${
            isDark ? 'bg-fuchsia-500/20 text-fuchsia-300' : 'bg-fuchsia-100/70 text-fuchsia-800'
          }`}>
            <span>Acessar Instagram</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </a>
      </div>

      {/* Quick copy & Trust badges bar */}
      <div
        className={`relative pt-5 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs ${
          isDark ? 'border-neutral-800 text-neutral-400' : 'border-slate-200/80 text-slate-600'
        }`}
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => copyToClipboard(profile.contact.phoneFormatted, 'phone')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              copiedItem === 'phone'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : isDark
                ? 'bg-neutral-800/80 hover:bg-neutral-800 text-neutral-200 border-neutral-700'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs hover:border-slate-300'
            }`}
          >
            {copiedItem === 'phone' ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{copiedItem === 'phone' ? 'Telefone Copiado!' : 'Copiar Telefone'}</span>
          </button>

          <button
            onClick={() => copyToClipboard(profile.contact.email, 'email')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              copiedItem === 'email'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : isDark
                ? 'bg-neutral-800/80 hover:bg-neutral-800 text-neutral-200 border-neutral-700'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-2xs hover:border-slate-300'
            }`}
          >
            {copiedItem === 'email' ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{copiedItem === 'email' ? 'E-mail Copiado!' : 'Copiar E-mail'}</span>
          </button>
        </div>

        <div className={`flex items-center gap-2 text-[11px] font-medium ${isDark ? 'text-neutral-400' : 'text-slate-500'}`}>
          <FileCheck className="w-4 h-4 text-rose-500" />
          <span>Emissão de NF-e • Contratos formais • Relatórios pós-campanha</span>
        </div>
      </div>
    </motion.footer>
  );
};

