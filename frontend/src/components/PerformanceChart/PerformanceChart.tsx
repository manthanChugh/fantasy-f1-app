'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

type DataPoint = {
  race: string;
  points: number;
};

type Props = {
  data: DataPoint[];
};

export default function PerformanceChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        No historical data available yet.
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" vertical={false} />
          <XAxis 
            dataKey="race" 
            stroke="var(--text-secondary)" 
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="var(--text-secondary)" 
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0,0,0,0.8)', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: 'var(--text-primary)'
            }}
            itemStyle={{ color: 'var(--f1-red)' }}
          />
          <Line 
            type="monotone" 
            dataKey="points" 
            stroke="var(--f1-red)" 
            strokeWidth={3}
            dot={{ r: 4, fill: 'var(--f1-red)', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#fff', stroke: 'var(--f1-red)', strokeWidth: 2 }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
