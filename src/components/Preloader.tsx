import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coffee } from 'lucide-react';

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress while background assets buffer
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 600); // Wait a moment at 100% before fading out
          return 100;
        }
        // Speed up the loading slightly so it takes about 1.5 seconds total
        return p + 1.5; 
      });
    }, 20);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FAF6F0]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="relative flex flex-col items-center">
        {/* The Coffee Cup Container */}
        <div className="relative w-24 h-24 mb-8">
          {/* Background/Outline Cup */}
          <Coffee className="absolute inset-0 w-full h-full text-[#4A2C2A]/20" strokeWidth={1.5} />
          
          {/* Filled Cup - uses clip-path to animate the "pour" from bottom to top */}
          <div 
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }}
          >
            <Coffee className="absolute inset-0 w-full h-full text-[#8C6246] fill-[#8C6246]" strokeWidth={1.5} />
          </div>

          {/* Steam animations (only show when mostly full) */}
          <AnimatePresence>
            {progress > 70 && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 0.5, y: -25, scale: 1.2 }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: 'mirror', ease: "easeInOut" }}
                  className="absolute -top-2 left-6 w-3 h-10 bg-[#8C6246] rounded-full blur-md"
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 0.3, y: -35, scale: 1.5 }}
                  transition={{ duration: 1.8, delay: 0.3, repeat: Infinity, repeatType: 'mirror', ease: "easeInOut" }}
                  className="absolute -top-4 right-8 w-2 h-12 bg-[#8C6246] rounded-full blur-md"
                />
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Brand Name & Progress */}
        <motion.div 
          className="flex flex-col items-center w-64"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-black text-3xl tracking-tight text-[#4A2C2A] mb-4">COFFEE & CO.</span>
          
          {/* Progress Bar */}
          <div className="w-full h-1 bg-[#4A2C2A]/10 rounded-full overflow-hidden mb-3 relative">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-[#8C6246] rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Brewing Text */}
          <span className="text-[#8C6246] font-bold text-xs uppercase tracking-[0.2em]">
            {progress < 100 ? 'Brewing...' : 'Ready'}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
