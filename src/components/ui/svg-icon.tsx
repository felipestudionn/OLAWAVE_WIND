import React from 'react';
import Image from 'next/image';

export type SVGIconName = '1' | '2' | '3' | '4';

interface SVGIconProps {
  name: SVGIconName;
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
}

export const SVGIcon: React.FC<SVGIconProps> = ({
  name,
  width = 24,
  height = 24,
  className = '',
  alt = 'SVG Icon',
}) => {
  return (
    <Image
      src={`/images/svg/${name}.svg`}
      width={width}
      height={height}
      className={className}
      alt={alt}
    />
  );
};
