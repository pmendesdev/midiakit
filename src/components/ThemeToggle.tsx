import React from 'react';
import { motion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      id="theme-toggle-button"
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'}
      title={isDark ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-300 cursor-pointer ${
        isDark
          ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 shadow-sm'
          : 'bg-white border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:border-neutral-300 shadow-sm'
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        <motion.div
          initial={false}
          animate={{
            scale: isDark ? 0 : 1,
            rotate: isDark ? 90 : 0,
            opacity: isDark ? 0 : 1,
          }}
          transition={{ duration: 0.25 }}
          className="absolute text-amber-500"
        >
          <Sun className="w-4 h-4" />
        </motion.div>

        <motion.div
          initial={false}
          animate={{
            scale: isDark ? 1 : 0,
            rotate: isDark ? 0 : -90,
            opacity: isDark ? 1 : 0,
          }}
          transition={{ duration: 0.25 }}
          className="absolute text-rose-400"
        >
          <Moon className="w-4 h-4" />
        </motion.div>
      </div>

      {showLabel && (
        <span className="font-medium text-[11px]">
          {isDark ? 'Modo Escuro' : 'Modo Claro'}
        </span>
      )}
    </button>
  );
};
