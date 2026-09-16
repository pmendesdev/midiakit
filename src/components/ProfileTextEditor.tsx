import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Save,
  RotateCcw,
  Plus,
  X,
  Baby,
  MapPin,
  Calendar,
  Heart,
  BadgeCheck,
  CheckCircle2,
  Sparkles,
  User,
  Phone,
  Mail,
  Instagram,
  Lock,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { useAvatar } from '../context/AvatarContext';
import { useTheme } from '../context/ThemeContext';
import { INFLUENCER_PROFILE } from '../data/influencerData';

interface ProfileTextEditorProps {
  onSaved?: () => void;
}

export const ProfileTextEditor: React.FC<ProfileTextEditorProps> = ({ onSaved }) => {
  const { profile, updateProfile, resetProfile, isCustomProfile, isAuthorized } = useProfile();
  const { avatarUrl } = useAvatar();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Local form states
  const [name, setName] = useState(profile.name);
  const [handle, setHandle] = useState(profile.handle);
  const [city, setCity] = useState(profile.city);
  const [state, setState] = useState(profile.state);
  const [age, setAge] = useState(profile.age);
  const [sonName, setSonName] = useState(profile.sonName);
  const [sonAge, setSonAge] = useState(profile.sonAge);
  const [badgeText, setBadgeText] = useState(profile.badgeText || `Mãe do ${profile.sonName} (${profile.sonAge} anos)`);
  const [bio, setBio] = useState(profile.bio);
  const [niches, setNiches] = useState<string[]>(profile.niches || INFLUENCER_PROFILE.niches || []);
  const [newTagInput, setNewTagInput] = useState('');
  const [ctaText, setCtaText] = useState(profile.ctaText || 'Solicitar Proposta');

  // Contact info states
  const [phone, setPhone] = useState(profile.contact.phone);
  const [phoneFormatted, setPhoneFormatted] = useState(profile.contact.phoneFormatted);
  const [email, setEmail] = useState(profile.contact.email);
  const [instagram, setInstagram] = useState(profile.contact.instagram);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newTagInput.trim();
    if (!trimmed) return;
    if (niches.includes(trimmed)) {
      setToastMessage('Essa tag já existe na lista.');
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }
    setNiches([...niches, trimmed]);
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNiches(niches.filter((t) => t !== tagToRemove));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthorized) {
      setToastMessage('Acesso bloqueado: Faça login no painel administrativo para salvar alterações nos textos.');
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    const success = updateProfile({
      name: name.trim(),
      handle: handle.trim(),
      city: city.trim(),
      state: state.trim(),
      age: Number(age) || 28,
      sonName: sonName.trim(),
      sonAge: Number(sonAge) || 7,
      badgeText: badgeText.trim(),
      bio: bio.trim(),
      niches,
      ctaText: ctaText.trim() || 'Solicitar Proposta',
      contact: {
        phone: phone.trim(),
        phoneFormatted: phoneFormatted.trim(),
        email: email.trim(),
        instagram: instagram.trim(),
      },
    });

    if (success) {
      setToastMessage('Textos do perfil atualizados com sucesso!');
      setTimeout(() => setToastMessage(null), 3000);
      if (onSaved) onSaved();
    } else {
      setToastMessage('Erro: É necessário estar logado como administrador para salvar.');
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleReset = () => {
    if (!isAuthorized) {
      setToastMessage('Acesso bloqueado: Faça login no painel para restaurar os textos.');
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    if (confirm('Deseja restaurar todos os textos e informações para os dados originais padrão?')) {
      const success = resetProfile();
      if (!success) {
        setToastMessage('Erro: Não autorizado para restaurar os textos.');
        return;
      }
      setName(INFLUENCER_PROFILE.name);
      setHandle(INFLUENCER_PROFILE.handle);
      setCity(INFLUENCER_PROFILE.city);
      setState(INFLUENCER_PROFILE.state);
      setAge(INFLUENCER_PROFILE.age);
      setSonName(INFLUENCER_PROFILE.sonName);
      setSonAge(INFLUENCER_PROFILE.sonAge);
      setBadgeText(INFLUENCER_PROFILE.badgeText || `Mãe do ${INFLUENCER_PROFILE.sonName} (${INFLUENCER_PROFILE.sonAge} anos)`);
      setBio(INFLUENCER_PROFILE.bio);
      setNiches(INFLUENCER_PROFILE.niches || []);
      setCtaText(INFLUENCER_PROFILE.ctaText || 'Solicitar Proposta');
      setPhone(INFLUENCER_PROFILE.contact.phone);
      setPhoneFormatted(INFLUENCER_PROFILE.contact.phoneFormatted);
      setEmail(INFLUENCER_PROFILE.contact.email);
      setInstagram(INFLUENCER_PROFILE.contact.instagram);

      setToastMessage('Textos restaurados para o padrão oficial.');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl border text-xs font-semibold shadow-2xl flex items-center gap-2 bg-emerald-950/90 border-emerald-500/40 text-emerald-200"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </motion.div>
      )}

      {/* Live Preview Card */}
      <div className={`rounded-2xl border p-5 sm:p-6 backdrop-blur-xl transition-all ${
        isDark ? 'border-neutral-800 bg-neutral-900/60' : 'border-rose-100 bg-rose-50/30 shadow-sm'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-bold">
              PRÉ-VISUALIZAÇÃO EM TEMPO REAL
            </span>
            <span className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              Como o cabeçalho oficial do Mídia Kit aparece para marcas
            </span>
          </div>
          {isCustomProfile && (
            <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              Personalizado
            </span>
          )}
        </div>

        {/* Mini Preview Box */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-white border-slate-200/90 shadow-md'
        }`}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="relative shrink-0">
              <img
                src={avatarUrl}
                alt={name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-rose-200"
              />
              <div className="absolute -bottom-1.5 -right-1.5 bg-white rounded-lg p-0.5 shadow-sm border border-slate-200">
                <BadgeCheck className="w-4 h-4 text-sky-500 fill-sky-500/20" />
              </div>
            </div>

            <div className="space-y-2.5 text-center sm:text-left flex-1 min-w-0">
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {name || 'Jessica Rosa'}
                  </h3>
                  <span className="text-xs font-mono font-semibold text-rose-500">
                    {handle || '@eujessicarosaa'}
                  </span>
                </div>

                <div className={`flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs mt-1 ${
                  isDark ? 'text-neutral-400' : 'text-slate-500'
                }`}>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-neutral-400" />
                    {city || 'Porto Alegre'} ({state || 'RS'})
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-neutral-400" />
                    {age || 28} anos
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-rose-600 font-medium">
                    <Baby className="w-3 h-3 text-rose-500" />
                    {badgeText || `Mãe do ${sonName} (${sonAge} anos)`}
                  </span>
                </div>
              </div>

              {/* Bio */}
              <p className={`text-xs sm:text-sm leading-relaxed ${
                isDark ? 'text-neutral-300' : 'text-slate-600'
              }`}>
                {bio || 'Insira uma biografia cativante para apresentar a sua trajetória às marcas.'}
              </p>

              {/* Tags & CTA */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
                {niches.map((tag) => (
                  <span
                    key={tag}
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-medium border ${
                      isDark
                        ? 'bg-neutral-800 text-neutral-300 border-neutral-700'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {tag}
                  </span>
                ))}

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-rose-600 text-white ml-auto shadow-xs">
                  <Heart className="w-3 h-3 fill-current" />
                  {ctaText || 'Solicitar Proposta'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Status Banner */}
      {!isAuthorized ? (
        <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between gap-3 backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-rose-500 shrink-0" />
            <div>
              <p className="font-bold text-sm text-rose-600 dark:text-rose-400">Edição Bloqueada</p>
              <p className="text-xs opacity-90">
                Você precisa estar logado no painel administrativo para editar os textos, biografia e dados de contato.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-semibold text-[11px] shrink-0">
            Acesso Restrito
          </span>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs flex flex-wrap items-center justify-between gap-2 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              <strong>Sessão de Administrador Ativa:</strong> As alterações de texto são salvas e refletidas em tempo real no Mídia Kit.
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-semibold">
            ● Edição Autorizada
          </span>
        </div>
      )}

      {/* Edit Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Main Bio Section (Highlighted like screenshot) */}
        <div className={`rounded-2xl border p-6 backdrop-blur-xl space-y-4 ${
          isDark ? 'border-neutral-800 bg-neutral-900/60' : 'border-neutral-200 bg-white/90 shadow-sm'
        }`}>
          <div className="flex items-center justify-between border-b pb-3 border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  Texto Principal da Biografia (Bio)
                </h3>
                <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Este é o parágrafo central em destaque logo abaixo da foto
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBio(INFLUENCER_PROFILE.bio)}
              className="text-[11px] text-rose-500 hover:underline cursor-pointer font-medium"
            >
              Restaurar texto original
            </button>
          </div>

          <div>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Descreva sua trajetória, maternidade, lifestyle e foco de conteúdo..."
              className={`w-full p-3.5 rounded-xl border text-sm focus:outline-none focus:border-rose-500 leading-relaxed transition-colors ${
                isDark
                  ? 'bg-neutral-950 border-neutral-800 text-white'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-900'
              }`}
            />
            <div className="flex items-center justify-between mt-1 text-[11px] text-neutral-400">
              <span>Dica: Mencione idade, cidade, o Lucca e seus nichos de atuação.</span>
              <span className="font-mono">{bio.length} caracteres</span>
            </div>
          </div>
        </div>

        {/* Subtitle / Family Badge & Tags Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Badge & CTA */}
          <div className={`rounded-2xl border p-6 backdrop-blur-xl space-y-4 ${
            isDark ? 'border-neutral-800 bg-neutral-900/60' : 'border-neutral-200 bg-white/90 shadow-sm'
          }`}>
            <div className="flex items-center gap-2 border-b pb-3 border-neutral-200 dark:border-neutral-800">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                <Baby className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  Destaque Familiar & Botão CTA
                </h3>
                <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Personalize o selo do filho e o texto do botão
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  Texto do Selo com Ícone Infantil
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    placeholder="Ex: Mãe do Lucca (7 anos)"
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-rose-500 transition-colors ${
                      isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                    }`}
                  />
                  <Baby className="w-4 h-4 text-rose-500 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                  Texto do Botão de Ação (CTA)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="Ex: Solicitar Proposta"
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-rose-500 transition-colors ${
                      isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                    }`}
                  />
                  <Heart className="w-4 h-4 text-rose-500 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Niches / Pillars Tags */}
          <div className={`rounded-2xl border p-6 backdrop-blur-xl space-y-4 ${
            isDark ? 'border-neutral-800 bg-neutral-900/60' : 'border-neutral-200 bg-white/90 shadow-sm'
          }`}>
            <div className="flex items-center gap-2 border-b pb-3 border-neutral-200 dark:border-neutral-800">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  Tags de Nicho & Pilares
                </h3>
                <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  Os pilares editoriais exibidos ao lado do botão
                </p>
              </div>
            </div>

            {/* Existing tags list */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 min-h-[42px] p-2.5 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-950/40 items-center">
                {niches.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-2xs text-neutral-800 dark:text-neutral-200"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-neutral-400 hover:text-rose-500 p-0.5 rounded transition-colors cursor-pointer"
                      title="Remover tag"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add tag form */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Nova tag (ex: Moda Mãe & Filho)..."
                  className={`flex-1 px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-rose-500 transition-colors ${
                    isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => handleAddTag()}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-neutral-800 dark:bg-neutral-700 hover:bg-neutral-900 text-white cursor-pointer transition-colors inline-flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar</span>
                </button>
              </div>

              {/* Suggestions */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[10px] text-neutral-400 self-center mr-1">Sugestões:</span>
                {['Moda & Beleza', 'Rotina Materna', 'Dicas & Compras', 'Educação Infantil'].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => {
                      if (!niches.includes(sug)) setNiches([...niches, sug]);
                    }}
                    className="text-[10px] px-2 py-0.5 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:border-rose-300 cursor-pointer"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Details & Location Section */}
        <div className={`rounded-2xl border p-6 backdrop-blur-xl space-y-4 ${
          isDark ? 'border-neutral-800 bg-neutral-900/60' : 'border-neutral-200 bg-white/90 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 border-b pb-3 border-neutral-200 dark:border-neutral-800">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                Dados Pessoais & Localização
              </h3>
              <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Nome oficial, arroba, idade e cidade exibidos no Mídia Kit
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Nome de Exibição
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-rose-500 ${
                  isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Arroba (@) Instagram
              </label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-rose-500 font-mono ${
                  isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Idade
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-rose-500 ${
                  isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Cidade / UF
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Porto Alegre"
                  className={`flex-1 px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-rose-500 ${
                    isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                  }`}
                />
                <input
                  type="text"
                  value={state}
                  maxLength={2}
                  onChange={(e) => setState(e.target.value.toUpperCase())}
                  placeholder="RS"
                  className={`w-14 px-2 py-2 rounded-xl border text-xs focus:outline-none focus:border-rose-500 text-center font-bold ${
                    isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-neutral-100 dark:border-neutral-800/60">
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Nome do Filho
              </label>
              <input
                type="text"
                value={sonName}
                onChange={(e) => setSonName(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-rose-500 ${
                  isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Idade do Filho (anos)
              </label>
              <input
                type="number"
                value={sonAge}
                onChange={(e) => setSonAge(Number(e.target.value))}
                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-rose-500 ${
                  isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                WhatsApp Comercial
              </label>
              <input
                type="text"
                value={phoneFormatted}
                onChange={(e) => setPhoneFormatted(e.target.value)}
                placeholder="(51) 98537-1797"
                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-rose-500 font-mono ${
                  isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                E-mail Comercial
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="assessoria@jessicarosa.com"
                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-rose-500 ${
                  isDark ? 'bg-neutral-950 border-neutral-800 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 backdrop-blur-xl ${
          isDark ? 'border-neutral-800 bg-neutral-900/80' : 'border-neutral-200 bg-white/95 shadow-sm'
        }`}>
          <button
            type="button"
            onClick={handleReset}
            disabled={!isAuthorized}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              !isAuthorized
                ? 'opacity-50 cursor-not-allowed text-neutral-400 border-neutral-200 dark:border-neutral-800'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 cursor-pointer'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Valores Padrão</span>
          </button>

          <button
            type="submit"
            disabled={!isAuthorized}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
              !isAuthorized
                ? 'opacity-50 cursor-not-allowed bg-neutral-400 text-neutral-200 shadow-none'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/30 cursor-pointer'
            }`}
          >
            {!isAuthorized ? <Lock className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{!isAuthorized ? 'Faça Login para Salvar' : 'Salvar Alterações no Mídia Kit'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
