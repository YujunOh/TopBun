export function Footer() {
  return (
    <footer className="bg-[var(--color-surface)] border-t border-white/10 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-[var(--color-text-muted)]">
        <p>&copy; 2026 TopBun</p>
        <a
          href="https://github.com/YujunOh/TopBun"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--color-text)] transition"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
