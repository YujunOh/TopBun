"use client";

import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';

const LABELS: Record<string, string> = {
  light: 'Light mode',
  dark: 'Dark mode', 
  system: 'System',
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={18} />;
      case 'dark':
        return <Moon size={18} />;
      case 'system':
      default:
        return <Monitor size={18} />;
    }
  };

  const label = LABELS[theme];

  return (
    <button
      onClick={cycleTheme}
      className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/5 dark:hover:bg-white/10 rounded-lg transition"
      aria-label={label}
      title={label}
    >
      {getIcon()}
    </button>
  );
}
