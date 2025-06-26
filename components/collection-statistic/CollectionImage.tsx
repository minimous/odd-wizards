// components/nft-collections/CollectionImage.jsx
import { generateFallbackImage } from '@/lib/formatters';
import React from 'react';

interface CollectionImageProps {
    src: string
    alt: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    className?: string
}

const CollectionImage = ({ 
  src, 
  alt, 
  size = 'md',
  className = "" 
}: CollectionImageProps) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10', 
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const sizeClass = sizes[size];

  const handleImageError = (e: any) => {
    const fallback = generateFallbackImage('?');
    e.target.src = fallback;
  };

  return (
    <div className={`${sizeClass} rounded-[10px] overflow-hidden bg-gray-800 flex-shrink-0 ${className}`}>
      <img 
        src={src} 
        alt={alt}
        className="w-full h-full object-cover"
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  );
};

export default CollectionImage;