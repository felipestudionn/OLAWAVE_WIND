'use client';

interface SketchOverlayProps {
  svgContent: string;
  className?: string;
}

function sanitizeSvg(svg: string): string {
  return svg
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '');
}

export default function SketchOverlay({ svgContent, className }: SketchOverlayProps) {
  if (!svgContent) return null;

  const sanitized = sanitizeSvg(svgContent);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
