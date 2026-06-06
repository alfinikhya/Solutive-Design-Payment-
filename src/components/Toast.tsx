import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export function Toast({ message, isVisible, onClose }: ToastProps) {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="absolute bottom-6 left-4 right-4 z-50 pointer-events-none flex justify-center"
        >
          <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 max-w-sm pointer-events-auto">
            <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-white stroke-[3px]" />
            </div>
            <span className="text-xs font-semibold tracking-wide text-slate-100">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
