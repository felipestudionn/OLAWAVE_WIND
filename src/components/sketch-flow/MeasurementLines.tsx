'use client';

interface MeasurementLinesProps {
  measurements?: {
    bust?: string;
    waist?: string;
    seat?: string;
  };
}

const LINES = [
  { label: 'bust', y: 22 },
  { label: 'waist', y: 32 },
  { label: 'seat', y: 40 },
];

export default function MeasurementLines({ measurements = {} }: MeasurementLinesProps) {
  return (
    <div className="absolute left-0 top-0 h-full w-[60px] flex flex-col pointer-events-none">
      {LINES.map((line) => (
        <div
          key={line.label}
          className="absolute flex items-center"
          style={{ top: `${line.y}%`, left: 0, right: 0 }}
        >
          <span className="text-[8px] text-gray-400 font-medium uppercase tracking-wide mr-1 whitespace-nowrap">
            {line.label}
          </span>
          <div className="flex-1 border-t border-dashed border-gray-300" />
          {measurements[line.label as keyof typeof measurements] && (
            <span className="text-[7px] text-gray-500 ml-0.5">
              {measurements[line.label as keyof typeof measurements]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
