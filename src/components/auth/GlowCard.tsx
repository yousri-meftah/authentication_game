import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'primary' | 'secondary' | 'success' | 'error';
  hover?: boolean;
}

export const GlowCard = ({ 
  children, 
  className, 
  glowColor = 'primary',
  hover = true 
}: GlowCardProps) => {
  const glowClasses = {
    primary: 'hover:glow-primary border-primary/30',
    secondary: 'hover:glow-secondary border-secondary/30',
    success: 'hover:glow-success border-success/30',
    error: 'hover:glow-error border-destructive/30',
  };

  return (
    <motion.div
      whileHover={hover ? { scale: 1.02 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'relative bg-card/80 backdrop-blur-sm border rounded-lg p-6',
        'transition-all duration-300',
        hover && glowClasses[glowColor],
        className
      )}
    >
      {children}
    </motion.div>
  );
};
