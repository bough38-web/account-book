import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const DailyBarChart: React.FC<{ transactions: any[] }> = ({ transactions }) => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const today = new Date();
  
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const dayName = days[d.getDay()];
    const dateStr = `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`;
    
    const dailySum = Math.abs(transactions
      .filter(tx => tx.date === dateStr && tx.amount < 0)
      .reduce((acc, tx) => acc + tx.amount, 0));
      
    return { day: dayName, amount: dailySum };
  });

  return (
    <div className="chart-container glass-card" style={{ marginTop: '16px', height: '250px' }}>
      <h3 className="section-title">최근 7일 지출 추이</h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={chartData}>
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
            formatter={(value) => [`${value?.toLocaleString() || '0'}원`, '지출']}
          />
          <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.amount > 50000 ? '#f43f5e' : 'var(--primary)'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
