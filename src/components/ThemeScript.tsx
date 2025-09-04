// This script runs before React hydration to prevent theme flash
export function ThemeScript() {
  const script = `
    (function() {
      try {
        var theme = localStorage.getItem('theme');
        
        if (theme === 'light') {
          document.documentElement.classList.remove('dark');
        } else {
          // По умолчанию всегда тёмная
          document.documentElement.classList.add('dark');
        }
      } catch (e) {
        // Fallback — всегда тёмная
        document.documentElement.classList.add('dark');
      }
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
