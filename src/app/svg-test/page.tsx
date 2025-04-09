import React from 'react';
import Image from 'next/image';

export default function SVGTestPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">SVG Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="border rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-4">SVG {num}</h2>
            <div className="aspect-square relative bg-gray-50 rounded-md overflow-hidden">
              <Image 
                src={`/images/svg/${num}.svg`} 
                alt={`SVG ${num}`}
                width={300}
                height={300}
                className="object-contain"
              />
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Direct SVG rendering:
            </div>
            <div 
              className="mt-2 p-4 border rounded-md bg-gray-50 h-[200px] flex items-center justify-center"
              dangerouslySetInnerHTML={{ 
                __html: `<svg viewBox="0 0 100 100" style="width: 100%; height: 100%; stroke: currentColor; fill: none;">
                  ${num === 1 ? 
                    `<circle cx="50" cy="50" r="45" stroke-width="1"></circle>
                    <circle cx="50" cy="50" r="35" stroke-width="1"></circle>
                    <circle cx="50" cy="50" r="25" stroke-width="1"></circle>
                    <circle cx="50" cy="50" r="15" stroke-width="1"></circle>` 
                  : num === 2 ? 
                    `<path d="M20,50 Q35,20 50,50 Q65,80 80,50" stroke-width="2"></path>
                    <path d="M20,60 Q35,30 50,60 Q65,90 80,60" stroke-width="2"></path>` 
                  : num === 3 ? 
                    `<path d="M20,50 L80,50" stroke-width="2"></path>
                    <path d="M20,40 L80,40" stroke-width="2"></path>
                    <path d="M20,60 L80,60" stroke-width="2"></path>
                    <path d="M20,30 L80,30" stroke-width="2"></path>
                    <path d="M20,70 L80,70" stroke-width="2"></path>` 
                  : 
                    `<path d="M20,80 C40,20 60,20 80,80" stroke-width="2"></path>`
                  }
                </svg>` 
              }}
            />
          </div>
        ))}
      </div>
      
      <div className="mt-12 p-6 bg-white rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Feature Cards (Like in the image)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="font-medium mb-3">Predictive Context</h3>
            <div className="h-24 flex items-center justify-center mb-4">
              <div className="w-16 h-16">
                <svg viewBox="0 0 100 100" className="w-full h-full" stroke="currentColor" fill="none">
                  <circle cx="50" cy="50" r="45" stroke-width="1"></circle>
                  <circle cx="50" cy="50" r="35" stroke-width="1"></circle>
                  <circle cx="50" cy="50" r="25" stroke-width="1"></circle>
                  <circle cx="50" cy="50" r="15" stroke-width="1"></circle>
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-600">Anticipates not just trends, but their causes</p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="font-medium mb-3">Pattern Recognition</h3>
            <div className="h-24 flex items-center justify-center mb-4">
              <div className="w-16 h-16">
                <svg viewBox="0 0 100 100" className="w-full h-full" stroke="currentColor" fill="none">
                  <path d="M20,50 Q35,20 50,50 Q65,80 80,50" stroke-width="2"></path>
                  <path d="M20,60 Q35,30 50,60 Q65,90 80,60" stroke-width="2"></path>
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-600">Identifies patterns invisible to humans</p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="font-medium mb-3">Enhanced Data-Driven Decisions</h3>
            <div className="h-24 flex items-center justify-center mb-4">
              <div className="w-16 h-16">
                <svg viewBox="0 0 100 100" className="w-full h-full" stroke="currentColor" fill="none">
                  <path d="M20,50 L80,50" stroke-width="2"></path>
                  <path d="M20,40 L80,40" stroke-width="2"></path>
                  <path d="M20,60 L80,60" stroke-width="2"></path>
                  <path d="M20,30 L80,30" stroke-width="2"></path>
                  <path d="M20,70 L80,70" stroke-width="2"></path>
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-600">Turns uncertainty into strategic advantage</p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <h3 className="font-medium mb-3">Retail Optimization</h3>
            <div className="h-24 flex items-center justify-center mb-4">
              <div className="w-16 h-16">
                <svg viewBox="0 0 100 100" className="w-full h-full" stroke="currentColor" fill="none">
                  <path d="M20,80 C40,20 60,20 80,80" stroke-width="2"></path>
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-600">Enhances pricing, stock, conversion, and customer experience</p>
          </div>
        </div>
      </div>
    </div>
  );
}
