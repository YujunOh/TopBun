export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h1 className="text-6xl font-bold text-[var(--color-primary)]">404</h1>
      <p className="text-xl text-[var(--color-text-muted)]">
        페이지를 찾을 수 없습니다
      </p>
    </div>
  );
}
