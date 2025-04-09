import React from 'react';
import { SVGIcon, SVGIconName } from './ui/svg-icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export const SVGShowcase: React.FC = () => {
  const svgIcons: SVGIconName[] = ['1', '2', '3', '4'];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {svgIcons.map((icon) => (
        <Card key={icon} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>SVG Icon {icon}</CardTitle>
            <CardDescription>Fashion trend visualization</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
            <SVGIcon 
              name={icon} 
              width={150} 
              height={150} 
              alt={`Fashion trend visualization ${icon}`} 
              className="object-contain"
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
