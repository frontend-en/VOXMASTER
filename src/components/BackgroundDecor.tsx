import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export function BackgroundDecor() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      const root = document.documentElement;
      const currentlyDark = root.classList.contains("dark");
      setIsDark(currentlyDark);
    };

    // Check theme on mount
    checkTheme();

    // Listen for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      style={{
        top: "8%",
        right: "20%",
      }}
      className="background-decor fixed pointer-events-none z-0 opacity-20 w-32 h-32"
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0, scale: 0.8, rotate: -30 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
              y: [0, 2, 0],
            }}
            exit={{ opacity: 1, scale: 0.8, rotate: 30 }}
            transition={{
              duration: 0.6,
              y: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="w-full h-full text-primary"
          >
            {/* Moon SVG */}
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <motion.path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                fill="currentColor"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
              />
              {/* Stars around moon */}
              <motion.circle
                cx="18"
                cy="6"
                r="0.5"
                fill="currentColor"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 0.5,
                }}
              />
              <motion.circle
                cx="20"
                cy="9"
                r="0.3"
                fill="currentColor"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: 1,
                }}
              />
              <motion.circle
                cx="19"
                cy="4"
                r="0.2"
                fill="currentColor"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: 1.5,
                }}
              />
            </svg>
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
            }}
            exit={{ opacity: 0, scale: 0.8, rotate: 45 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full text-yellow-400"
            style={{
              top: "10%",
              right: "20%",
            }}
          >
            {/* Sun SVG */}
            <motion.svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-full h-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {/* Sun rays */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0.6, 1, 0.6],
                  scale: [0.9, 1, 0.9],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <path
                  d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </motion.g>

              {/* Sun center */}
              <motion.circle
                cx="12"
                cy="12"
                r="5"
                fill="currentColor"
                initial={{ scale: 0 }}
                animate={{
                  scale: 1,
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  scale: { duration: 0.5, delay: 0.3 },
                  opacity: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              />
            </motion.svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Additional decoration in bottom left */}
      <div className="bottom-left-decor fixed bottom-8 left-8 pointer-events-none z-0 opacity-10 w-20 h-20">
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="stars"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full h-full text-secondary/30"
            >
              {/* Small stars constellation */}
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                {[...Array(6)].map((_, i) => (
                  <motion.circle
                    key={i}
                    cx={4 + (i % 3) * 8}
                    cy={4 + Math.floor(i / 3) * 8}
                    r="0.5"
                    fill="currentColor"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </svg>
            </motion.div>
          ) : (
            <motion.div
              key="cloud"
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: 1,
                x: 0,
                y: [0, -3, 0],
              }}
              exit={{ opacity: 0, x: -20 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                y: {
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="w-full h-full text-muted-foreground/20"
            >
              {/* Cloud SVG */}
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                <motion.path
                  d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"
                  fill="currentColor"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
