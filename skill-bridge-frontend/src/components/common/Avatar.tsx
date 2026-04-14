import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, fallback, size = 'md', className }) => {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-xl',
    xl: 'h-24 w-24 text-3xl',
  };

  return (
    <div className={cn(
      'relative flex shrink-0 overflow-hidden rounded-full border-2 border-blue-600 bg-blue-100 text-blue-600 font-bold items-center justify-center',
      sizes[size],
      className
    )}>
      {src ? (
        <img src={src} alt={alt} className="aspect-square h-full w-full object-cover" />
      ) : (
        <span>{fallback.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
};
