import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'success' | 'warning';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-primary text-primary-foreground shadow-sm',
    secondary: 'bg-secondary text-secondary-foreground shadow-sm',
    destructive: 'bg-destructive text-destructive-foreground shadow-sm',
    success: 'bg-success text-success-foreground shadow-sm',
    warning: 'bg-warning text-warning-foreground shadow-sm'
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200 ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
