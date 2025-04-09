import React from 'react';
import Image from 'next/image';

interface ColoredSvgProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  color?: string;
  className?: string;
}

export function ColoredSvg({
  src,
  alt,
  width,
  height,
  color = '#000000', // Default black color
  className = '',
}: ColoredSvgProps) {
  // Create a style object with the filter
  const svgStyle = {
    filter: color ? `invert(1) sepia(1) saturate(0) hue-rotate(175deg) brightness(1) contrast(0.8)` : undefined,
  };

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full"
        style={svgStyle}
      />
    </div>
  );
}
