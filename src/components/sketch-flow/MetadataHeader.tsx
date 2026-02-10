'use client';

interface MetadataHeaderProps {
  brandName: string;
  designerName: string;
  season: string;
  styleName: string;
  patternCutter: string;
  extension: string;
  dateCreated: string;
  onFieldChange: (field: string, value: string) => void;
}

export default function MetadataHeader({
  brandName,
  designerName,
  season,
  styleName,
  patternCutter,
  extension,
  dateCreated,
  onFieldChange,
}: MetadataHeaderProps) {
  return (
    <div className="border-b border-gray-300 pb-3 mb-3">
      {/* Brand row */}
      <div className="flex items-baseline justify-between mb-2">
        <input
          value={brandName}
          onChange={(e) => onFieldChange('brandName', e.target.value)}
          placeholder="NOMBRE DE MARCA"
          className="text-sm font-bold tracking-wider uppercase bg-transparent border-none outline-none placeholder:text-gray-300 w-1/2"
        />
        <input
          value={designerName}
          onChange={(e) => onFieldChange('designerName', e.target.value)}
          placeholder="Nombre del diseñador/a"
          className="text-[10px] text-gray-500 text-right bg-transparent border-none outline-none placeholder:text-gray-300 w-1/2"
          style={{ fontStyle: 'italic' }}
        />
      </div>

      {/* Metadata table */}
      <table className="w-full border-collapse text-[9px]">
        <tbody>
          <tr>
            <td className="border border-gray-300 px-2 py-1">
              <span className="text-gray-400 mr-1">Fecha:</span>
              <input
                value={dateCreated}
                onChange={(e) => onFieldChange('dateCreated', e.target.value)}
                className="bg-transparent border-none outline-none text-gray-700 w-16"
              />
            </td>
            <td className="border border-gray-300 px-2 py-1">
              <span className="text-gray-400 mr-1">Temporada:</span>
              <span className="text-gray-700 font-medium">{season}</span>
            </td>
            <td className="border border-gray-300 px-2 py-1">
              <span className="text-gray-400 mr-1">Estilo:</span>
              <input
                value={styleName}
                onChange={(e) => onFieldChange('styleName', e.target.value)}
                className="bg-transparent border-none outline-none text-gray-700 font-medium w-20"
              />
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-2 py-1">
              <span className="text-gray-400 mr-1">Diseñador/a:</span>
              <input
                value={designerName}
                onChange={(e) => onFieldChange('designerName', e.target.value)}
                className="bg-transparent border-none outline-none text-gray-700 w-16"
              />
            </td>
            <td className="border border-gray-300 px-2 py-1">
              <span className="text-gray-400 mr-1">Ext:</span>
              <input
                value={extension}
                onChange={(e) => onFieldChange('extension', e.target.value)}
                className="bg-transparent border-none outline-none text-gray-700 w-16"
              />
            </td>
            <td className="border border-gray-300 px-2 py-1">
              <span className="text-gray-400 mr-1">Patronista:</span>
              <input
                value={patternCutter}
                onChange={(e) => onFieldChange('patternCutter', e.target.value)}
                className="bg-transparent border-none outline-none text-gray-700 w-16"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
