'use client';

interface MeasurementsGridProps {
  measurements: Record<string, string>;
  onMeasurementChange: (key: string, value: string) => void;
}

const MEASUREMENT_ROWS = [
  'bust',
  'waist',
  'hip',
  'total_length',
  'sleeve_length',
];

const SIZE_COLUMNS = ['XS', 'S', 'M', 'L', 'XL'];

const LABELS: Record<string, string> = {
  bust: 'Pecho',
  waist: 'Cintura',
  hip: 'Cadera',
  total_length: 'Largo total',
  sleeve_length: 'Largo manga',
};

export default function MeasurementsGrid({ measurements, onMeasurementChange }: MeasurementsGridProps) {
  return (
    <div className="border-t border-gray-300 pt-2">
      <table className="w-full border-collapse text-[8px]">
        <thead>
          <tr>
            <th className="border border-gray-300 px-1.5 py-1 text-left text-gray-500 font-medium">
              Medida
            </th>
            {SIZE_COLUMNS.map((size) => (
              <th key={size} className="border border-gray-300 px-1.5 py-1 text-center text-gray-500 font-medium w-12">
                {size}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MEASUREMENT_ROWS.map((row) => (
            <tr key={row}>
              <td className="border border-gray-300 px-1.5 py-1 text-gray-600 font-medium">
                {LABELS[row] || row}
              </td>
              {SIZE_COLUMNS.map((size) => {
                const key = `${row}_${size}`;
                return (
                  <td key={key} className="border border-gray-300 px-0.5 py-0.5">
                    <input
                      value={measurements[key] || ''}
                      onChange={(e) => onMeasurementChange(key, e.target.value)}
                      className="w-full text-center text-[8px] bg-transparent border-none outline-none text-gray-700"
                      placeholder="—"
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
