import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  className?: string;
  variant?: 'default' | 'gold' | 'red';
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  children,
  onClick,
  disabled = false,
  title,
  className = '',
  variant = 'default',
  type = 'button',
}: ButtonProps) {
  const baseClasses = 'bg-transparent border-none cursor-pointer font-almendra text-xl h-[30px] px-3 py-[10px] flex items-center justify-center';
  const variantClasses = {
    default: 'text-clocktower-text',
    gold: 'text-clocktower-gold',
    red: 'text-clocktower-red',
  };

  return (
    <motion.button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      {children}
    </motion.button>
  );
}

