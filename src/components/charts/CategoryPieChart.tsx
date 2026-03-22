import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DataPoint {
  name: string;
  value: number;
}

export const CategoryPieChart: React.FC<{ transactions: any[] }> = ({ transactions }) => {
  const expensesOnly = transactions.filter(tx => tx.amount < 0);
  
  const categoryMap = expensesOnly.reduce((acc: any, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + Math.abs(tx.amount);
    return acc;
  }, {});

  const data: DataPoint[] = Object.keys(categoryMap).map(key => ({
    name: key,
    value: categoryMap[key]
  }));

  const COLORS = ['#6366f1', '#f59e0b', '#ec4899', '#a855f7', '#10b981', '#94a3b8'];

  return (
    <div className="glass-card" style={{ padding: '24px', height: '350px' }}>
      <h3 style={{ marginBottom: '20px', fontSize: '16px' }}>카테고리별 지출</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ background: 'rgba(30, 41, 59, 0.8)', border: 'none', borderRadius: '12px', backdropFilter: 'blur(8px)' }}
            formatter={(value) => [`${value?.toLocaleString() || '0'}원`, '금액']}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
