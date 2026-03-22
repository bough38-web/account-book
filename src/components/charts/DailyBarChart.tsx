import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { day: '월', amount: 45000 },
  { day: '화', amount: 52000 },
  { day: '수', amount: 38000 },
  { day: '목', amount: 65000 },
  { day: '금', amount: 48000 },
  { day: '토', amount: 85000 },
  { day: '일', amount: 72000 },
];

export const DailyBarChart: React.FC = () => {
  return (
    <div className="chart-container glass-card" style={{ marginTop: '16px', height: '250px' }}>
      <h3 className="section-title">일별 지출 추이</h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
          />
          <YAxis hide />
          <Tooltip 
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            contentStyle={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.9)', 
              borderRadius: '12px', 
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff'
            }} 
          />
          <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.amount > 60000 ? 'var(--accent)' : 'var(--primary)'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
