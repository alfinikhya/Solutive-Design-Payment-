import React from 'react';
import { motion } from 'motion/react';

interface TypewriterTextProps {
  text: string;
  speed?: number; // Speed in ms per character
  delay?: number; // Initial delay in ms
  className?: string;
}

export function TypewriterText({ text, speed = 40, delay = 150, className = "" }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = React.useState("");
  const [isDone, setIsDone] = React.useState(false);

  React.useEffect(() => {
    // Reset typewriter whenever the input text changes
    setDisplayedText("");
    setIsDone(false);

    let currentIndex = 0;
    let timer: NodeJS.Timeout;

    const startTimeout = setTimeout(() => {
      timer = setInterval(() => {
        if (currentIndex < text.length) {
          currentIndex++;
          setDisplayedText(text.slice(0, currentIndex));
        } else {
          setIsDone(true);
          clearInterval(timer);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (timer) clearInterval(timer);
    };
  }, [text, speed, delay]);

  return (
    <span className={`inline-flex items-center select-none font-mono ${className}`}>
      <span>{displayedText}</span>
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "linear"
        }}
        className="inline-block w-[2px] h-[1.1em] bg-current ml-1 rounded-full shrink-0"
        style={{ verticalAlign: 'middle' }}
      />
    </span>
  );
}
