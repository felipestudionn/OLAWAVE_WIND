'use client';

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

interface TrendDataPoint {
  month: string;
  value: number;
}

interface TrendEvolutionChartProps {
  data: TrendDataPoint[];
  title?: string;
  color?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  animated?: boolean;
}

// Custom tooltip component for better styling
const CustomTooltip = ({ active, payload, label, color }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border rounded-md shadow-md">
        <p className="font-medium text-sm mb-1">{`${label}`}</p>
        <p className="text-sm">
          <span className="font-medium" style={{ color: color || '#8884d8' }}>
            Interest Level:
          </span>{' '}
          {`${payload[0].value}%`}
        </p>
      </div>
    );
  }
  return null;
};

export function TrendEvolutionChart({ 
  data, 
  title = 'Trend Evolution', 
  color = '#8884d8',
  height = 300,
  showGrid = true,
  showLegend = false,
  showTooltip = true,
  animated = true
}: TrendEvolutionChartProps) {
  // State to track if chart has been viewed for animation
  const [viewed, setViewed] = useState(false);
  
  // Set viewed to true after component mounts for animation
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setViewed(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full">
      {title && <h3 className="text-sm font-medium mb-2">{title}</h3>}
      <div style={{ width: '100%', height }} className="transition-all duration-300 ease-in-out">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
            <defs>
              <linearGradient id={`colorGradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#f0f0f0' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#f0f0f0' }}
              width={30}
              tickFormatter={(value) => `${value}%`}
            />
            {showTooltip && (
              <Tooltip 
                content={<CustomTooltip color={color} />}
                cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '3 3' }}
              />
            )}
            {showLegend && <Legend />}
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fillOpacity={1}
              fill={`url(#colorGradient-${color.replace('#', '')})`}
              strokeWidth={2}
              activeDot={{ r: 6, stroke: 'white', strokeWidth: 2, fill: color }}
              isAnimationActive={animated}
              animationDuration={1500}
              animationEasing="ease-in-out"
              // Animation only on first render if animated is true
              animationBegin={animated ? (viewed ? 0 : 300) : 0}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
