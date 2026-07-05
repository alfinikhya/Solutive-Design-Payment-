import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type WeatherMode = 'MORNING' | 'AFTERNOON' | 'SUNSET' | 'NIGHT';

interface WeatherBackgroundProps {
  mode: WeatherMode;
}

export function WeatherBackground({ mode }: WeatherBackgroundProps) {
  // We can render custom visual effects based on the selected mode
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 select-none">
      {/* Dynamic Sky Gradient Layer with ultra-smooth transition */}
      <div
        className={`absolute inset-0 w-full h-full transition-all duration-[1200ms] cubic-bezier(0.4, 0, 0.2, 1) ${
          mode === 'MORNING'
            ? 'bg-gradient-to-b from-amber-100/90 via-sky-100/95 to-sky-50/90'
            : mode === 'AFTERNOON'
            ? 'bg-gradient-to-b from-sky-400/30 via-sky-200/40 to-slate-50/90'
            : mode === 'SUNSET'
            ? 'bg-gradient-to-b from-orange-400/40 via-pink-500/30 to-indigo-900/40'
            : 'bg-gradient-to-b from-slate-950 via-indigo-950/95 to-slate-900/90'
        }`}
      />

      {/* Mode-specific animated features */}
      <AnimatePresence mode="wait">
        {mode === 'MORNING' && (
          <motion.div
            key="morning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Sunrise Glowing Orb */}
            <div className="absolute top-16 left-12 w-28 h-28 bg-gradient-to-br from-amber-300 to-orange-400 rounded-full blur-md opacity-70 animate-pulse" />
            
            {/* Soft Sunrise Lightbeams */}
            <svg className="absolute top-0 left-0 w-full h-48 opacity-40 mix-blend-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="12,16 0,100 30,100" fill="url(#morning-ray)" />
              <polygon points="12,16 20,100 60,100" fill="url(#morning-ray)" />
              <polygon points="12,16 50,100 90,100" fill="url(#morning-ray)" />
              <defs>
                <linearGradient id="morning-ray" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffedd5" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Floating morning light clouds */}
            <div className="absolute top-12 right-4 w-24 h-6 bg-white/40 blur-xs rounded-full animate-[drift_25s_infinite_linear]" />
            <div className="absolute top-24 left-10 w-16 h-4 bg-white/30 blur-xs rounded-full animate-[drift_18s_infinite_linear_reverse]" />

            {/* Dew sparkle particles */}
            <div className="absolute top-32 left-1/4 w-1.5 h-1.5 bg-amber-200 rounded-full animate-ping [animation-duration:3s]" />
            <div className="absolute top-48 right-1/3 w-1 h-1 bg-white rounded-full animate-ping [animation-duration:4s] [animation-delay:1.5s]" />
            <div className="absolute top-16 right-12 w-1.2 h-1.2 bg-amber-100 rounded-full animate-ping [animation-duration:2.5s] [animation-delay:0.5s]" />
          </motion.div>
        )}

        {mode === 'AFTERNOON' && (
          <motion.div
            key="afternoon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Bright Sun with Slow Spinning Ray Ring */}
            <div className="absolute top-12 left-16 w-16 h-16 bg-yellow-300 rounded-full shadow-[0_0_30px_#fde047] flex items-center justify-center">
              <div className="absolute w-24 h-24 border-2 border-dashed border-yellow-200/50 rounded-full animate-[spin_40s_linear_infinite]" />
              <div className="absolute w-28 h-28 border border-dotted border-yellow-100/30 rounded-full animate-[spin_60s_linear_infinite_reverse]" />
            </div>

            {/* Big Fluffy Clouds drifting */}
            <div className="absolute top-16 -left-20 w-36 h-10 bg-white/60 blur-[1px] rounded-full animate-[drift-large_32s_infinite_linear]" />
            <div className="absolute top-28 right-[-100px] w-28 h-8 bg-white/50 blur-[1px] rounded-full animate-[drift-large_24s_infinite_linear_reverse]" />
            
            {/* Sun Rays floating particle shimmer */}
            <div className="absolute top-40 left-12 w-1 h-1 bg-yellow-100 rounded-full animate-pulse [animation-duration:2s]" />
            <div className="absolute top-24 right-20 w-1.5 h-1.5 bg-white/80 rounded-full animate-pulse [animation-duration:3.5s] [animation-delay:1s]" />
            <div className="absolute top-52 right-8 w-1 h-1 bg-yellow-200 rounded-full animate-pulse [animation-duration:2.5s] [animation-delay:0.5s]" />
          </motion.div>
        )}

        {mode === 'SUNSET' && (
          <motion.div
            key="sunset"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Large Red Sunset Sun sinking */}
            <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-36 h-36 bg-gradient-to-t from-orange-600 to-yellow-400 rounded-full blur-[2px] opacity-85 shadow-[0_0_40px_rgba(234,88,12,0.5)]" />

            {/* Golden clouds blocking sun */}
            <div className="absolute bottom-[36%] left-10 w-44 h-7 bg-pink-400/40 blur-xs rounded-full animate-[drift_28s_infinite_linear]" />
            <div className="absolute bottom-[44%] right-10 w-32 h-6 bg-purple-500/30 blur-xs rounded-full animate-[drift_20s_infinite_linear_reverse]" />

            {/* Warm glowing sparks floating upwards */}
            <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-orange-300 rounded-full animate-[floatUp_6s_infinite_linear]" />
            <div className="absolute bottom-12 left-1/2 w-1 h-1 bg-yellow-300 rounded-full animate-[floatUp_8s_infinite_linear] [animation-delay:2s]" />
            <div className="absolute bottom-24 right-1/4 w-2 h-2 bg-orange-400 rounded-full animate-[floatUp_7s_infinite_linear] [animation-delay:3.5s]" />
            <div className="absolute bottom-32 right-12 w-1.2 h-1.2 bg-pink-300 rounded-full animate-[floatUp_5s_infinite_linear] [animation-delay:1s]" />
          </motion.div>
        )}

        {mode === 'NIGHT' && (
          <motion.div
            key="night"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Starry Twinkling field */}
            <div className="absolute inset-0 w-full h-full">
              {/* Star 1 */}
              <div className="absolute top-8 left-12 w-1 h-1 bg-white rounded-full animate-[twinkle_2.5s_infinite_ease-in-out]" />
              {/* Star 2 */}
              <div className="absolute top-24 left-1/3 w-1.5 h-1.5 bg-indigo-200 rounded-full animate-[twinkle_3.5s_infinite_ease-in-out] [animation-delay:1s]" />
              {/* Star 3 */}
              <div className="absolute top-16 right-16 w-1 h-1 bg-white rounded-full animate-[twinkle_2s_infinite_ease-in-out] [animation-delay:0.5s]" />
              {/* Star 4 */}
              <div className="absolute top-36 right-1/4 w-1.2 h-1.2 bg-sky-200 rounded-full animate-[twinkle_4s_infinite_ease-in-out] [animation-delay:1.5s]" />
              {/* Star 5 */}
              <div className="absolute top-48 left-8 w-1 h-1 bg-white rounded-full animate-[twinkle_3s_infinite_ease-in-out] [animation-delay:2.2s]" />
              {/* Star 6 */}
              <div className="absolute top-56 right-8 w-1.5 h-1.5 bg-indigo-100 rounded-full animate-[twinkle_2.8s_infinite_ease-in-out] [animation-delay:0.8s]" />
              {/* Star 7 */}
              <div className="absolute top-72 left-20 w-1 h-1 bg-white rounded-full animate-[twinkle_3.2s_infinite_ease-in-out] [animation-delay:1.7s]" />
            </div>

            {/* Glowing Silver Crescent Moon */}
            <div className="absolute top-12 right-12 w-14 h-14 select-none pointer-events-none">
              {/* Moon crescent shape using box-shadow trick */}
              <div className="w-10 h-10 rounded-full bg-transparent shadow-[3px_-3px_0_0_#e2e8f0] relative">
                {/* Soft moon glowing aura */}
                <div className="absolute -top-1 -right-1 w-12 h-12 rounded-full bg-indigo-300/10 blur-sm pointer-events-none" />
              </div>
            </div>

            {/* Cosmic Aurora Light Mist */}
            <div className="absolute top-2 w-full h-40 bg-indigo-500/5 blur-3xl rounded-b-full pointer-events-none animate-pulse [animation-duration:8s]" />

            {/* Shooting Star / Meteor effect */}
            <div className="absolute top-10 left-10 w-[80px] h-[1.5px] bg-gradient-to-r from-white to-transparent -rotate-[35deg] origin-left scale-0 animate-[shooting-star_12s_infinite_ease-in-out]" />
            <div className="absolute top-36 left-1/4 w-[100px] h-[1px] bg-gradient-to-r from-sky-200 to-transparent -rotate-[35deg] origin-left scale-0 animate-[shooting-star_16s_infinite_ease-in-out] [animation-delay:6s]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global CSS Inject for specific high performance weather animations */}
      <style>{`
        @keyframes drift {
          0% { transform: translateX(-30px); }
          50% { transform: translateX(30px); }
          100% { transform: translateX(-30px); }
        }
        @keyframes drift-large {
          0% { transform: translateX(-150px); }
          100% { transform: translateX(450px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes floatUp {
          0% { transform: translateY(100px) scale(0.8); opacity: 0; }
          20% { opacity: 0.7; }
          80% { opacity: 0.7; }
          100% { transform: translateY(-120px) scale(1.1); opacity: 0; }
        }
        @keyframes shooting-star {
          0% { transform: translate(0, 0) rotate(-35deg) scaleX(0); opacity: 0; }
          1% { opacity: 1; transform: translate(0, 0) rotate(-35deg) scaleX(1); }
          5% { opacity: 0; transform: translate(150px, 105px) rotate(-35deg) scaleX(0); }
          100% { opacity: 0; transform: translate(150px, 105px) rotate(-35deg) scaleX(0); }
        }
      `}</style>
    </div>
  );
}
