'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface SearchInputProps {
  placeholder?: string;
  paramName?: string;
  className?: string;
  debounceMs?: number;
}

export function SearchInput({
  placeholder,
  paramName = 'q',
  className = '',
  debounceMs = 300,
}: SearchInputProps) {
  const t = useTranslations('search');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const initialValue = searchParams.get(paramName) || '';
  const [value, setValue] = useState(initialValue);

  // Sync with URL params
  useEffect(() => {
    setValue(searchParams.get(paramName) || '');
  }, [searchParams, paramName]);

  const updateUrl = useCallback(
    (newValue: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newValue.trim()) {
        params.set(paramName, newValue.trim());
      } else {
        params.delete(paramName);
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname, searchParams, paramName]
  );

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (value !== initialValue) {
        updateUrl(value);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs, updateUrl, initialValue]);

  const handleClear = () => {
    setValue('');
    updateUrl('');
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder || t('placeholder')}
        className="w-full rounded-xl border border-white/10 bg-surface py-2.5 pl-10 pr-10 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
