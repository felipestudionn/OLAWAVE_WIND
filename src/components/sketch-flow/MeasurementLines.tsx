'use client';

interface MeasurementLinesProps {
  measurements?: {
    bust?: string;
    waist?: string;
    seat?: string;
  };
}

const LINES = [
  { label: 'pecho', key: 'bust', y: 22 },
  { label: 'cintura', key: 'waist', y: 32 },
  { label: 'cadera', key: 'seat', y: 40 },
];

export default function MeasurementLines({ measurements = {} }: MeasurementLinesProps) {
  return (
    <div className="absolute left-0 top-0 h-full w-[60px] flex flex-col pointer-events-none">
      {LINES.map((line) => (
        <div
          key={line.key}
          className="absolute flex items-center"
          style={{ top: `${line.y}%`, left: 0, right: 0 }}
        >
          <span className="text-[8px] text-gray-400 font-medium tracking-wide mr-1 whitespace-nowrap">
            {line.label}
          </span>
          <div className="flex-1 border-t border-dashed border-gray-300" />
          {measurements[line.key as keyof typeof measurements] && (
            <span className="text-[7px] text-gray-500 ml-0.5">
              {measurements[line.key as keyof typeof measurements]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
