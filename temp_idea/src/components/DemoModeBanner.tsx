import { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { isInDemoMode } from '../utils/api';

/**
 * Banner que se muestra cuando la app está en modo DEMO
 * (es decir, cuando el backend no está disponible)
 */
export function DemoModeBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Verificar si está en modo demo después de un pequeño delay
    const timer = setTimeout(() => {
      if (isInDemoMode() && !isDismissed) {
        setIsVisible(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isDismissed]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 shadow-lg"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 flex-shrink-0 animate-pulse">✨</div>
            <div>
              <p className="font-medium">
                Modo DEMO - Explora con datos de ejemplo
              </p>
              <p className="text-sm text-white/90">
                Estás usando la versión demo. Para conectar tu backend, inícialo en <code className="bg-white/20 px-1 rounded">localhost:4000</code> y recarga la página.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsDismissed(true);
              setIsVisible(false);
            }}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
