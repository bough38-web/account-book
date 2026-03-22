import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

import type { Transaction } from '../../App';

export const SpendingChart = ({ transactions }: { transactions: Transaction[] }) => {
  const expenses = transactions.filter(t => t.amount < 0);
  
  const categoryTotals = expenses.reduce((acc: any, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + Math.abs(tx.amount);
    return acc;
  }, {});

  const data = Object.keys(categoryTotals).map(category => ({
    name: category,
    value: categoryTotals[category],
    color: transactions.find(t => t.category === category)?.color || '#6366f1'
  }));

  if (data.length === 0) return null;
  return (
    <div className="chart-container glass-card">
      <h3 className="section-title">지출 분석</h3>
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.9)', 
              borderRadius: '12px', 
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff'
            }}
            itemStyle={{ color: '#fff' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="chart-legend" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
        {data.map((item) => (
          <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
            <span style={{ color: 'var(--text-muted)' }}>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
