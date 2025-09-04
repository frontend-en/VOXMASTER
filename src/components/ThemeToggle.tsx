import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
   const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // пока не смонтировались — рендерим пустую кнопку, чтобы не было «рывка» иконки
    return (
      <motion.button className="theme-toggle-btn" aria-label="Переключить тему" />
    );
  }

  const isDark = (resolvedTheme ?? theme) !== 'light';

  const handleToggle = () => {
    setIsAnimating(true);
    setTheme(isDark ? 'light' : 'dark'); // всё управление — через провайдер
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <motion.button
      onClick={handleToggle}
      className="theme-toggle-btn"
      aria-label={isDark ? "Переключить на светлую тему" : "Переключить на тёмную тему"}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        borderColor: isDark ? '#7aa2ff' : '#f59e0b',
        backgroundColor: isDark 
          ? 'rgba(11, 12, 16, 0.9)' 
          : 'rgba(255, 255, 255, 0.9)',
        boxShadow: isDark 
          ? '0 0 20px rgba(122, 162, 255, 0.3), inset 0 0 10px rgba(122, 162, 255, 0.1)' 
          : '0 0 15px rgba(245, 158, 11, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
        rotate: isAnimating ? [0, -15, 15, 0] : 0
      }}
      transition={{ duration: isAnimating ? 0.1 : 0.1 }}
    >
      <div className="theme-icon-container">
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              className="theme-icon"
              initial={{ scale: 0, opacity: 0, rotate: -90 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0, rotate: 90 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <Moon className="moon-icon" />
              
              {/* Moon glow effect */}
              <motion.div
                className="moon-glow"
                animate={{ 
                  opacity: [0.3, 0.6, 0.3],
                  scale: [0.9, 1.1, 0.9]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
              
              {/* Stars around moon */}
              <div className="stars">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`star star-${i + 1}`}
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      scale: [0.8, 1.2, 0.8]
                    }}
                    transition={{
                      duration: 2 + i * 0.5,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: 'easeInOut'
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              className="theme-icon"
              initial={{ scale: 0, opacity: 0, rotate: 90 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0, rotate: -90 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 20, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              >
                <Sun className="sun-icon" />
              </motion.div>
              
              {/* Sun rays */}
              <div className="sun-rays">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`sun-ray ray-${i + 1}`}
                    style={{ transform: `rotate(${i * 45}deg)` }}
                    animate={{
                      opacity: [0.4, 0.8, 0.4],
                      scaleY: [0.8, 1.2, 0.8]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: 'easeInOut'
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
}