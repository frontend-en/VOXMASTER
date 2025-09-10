export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              © voxcraft.studio. Онлайн-занятия.
            </p>
            <p className="text-xs text-muted-foreground">
              Кирюшин Вадим Андреевич ИНН 631405447411
            </p>
          </div>

          <div className="flex justify-center items-center gap-4 text-sm">
            <a
              href="/offer.html"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Публичная оферта
            </a>
            <span className="text-muted-foreground">•</span>
            <a
              href="/privacy.html"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Политика конфиденциальности
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
