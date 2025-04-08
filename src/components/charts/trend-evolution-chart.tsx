'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
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
}

export function TrendEvolutionChart({ 
  data, 
  title = 'Trend Evolution', 
  color = '#8884d8',
  height = 300
}: TrendEvolutionChartProps) {
  return (
    <div className="w-full">
      {title && <h3 className="text-sm font-medium mb-2">{title}</h3>}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value: any) => [`${value}%`, 'Interest']}
              labelFormatter={(label: any) => `Month: ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              activeDot={{ r: 8 }}
              name="Interest Level"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
