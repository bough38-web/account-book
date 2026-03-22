import React from 'react';
import './Skeleton.css';

export const Skeleton: React.FC<{ 
  width?: string; 
  height?: string; 
  borderRadius?: string;
  style?: React.CSSProperties;
}> = ({ 
  width = '100%', 
  height = '20px', 
  borderRadius = '4px',
  style
}) => {
  return (
    <div 
      className="skeleton-pulse" 
      style={{ width, height, borderRadius, ...style }}
    />
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="fade-in" style={{ padding: '20px' }}>
      <Skeleton width="150px" height="32px" borderRadius="8px" />
      <Skeleton width="200px" height="16px" borderRadius="4px" style={{ marginTop: '8px' } as any} />
      
      <div style={{ marginTop: '24px' }}>
        <Skeleton height="160px" borderRadius="24px" />
      </div>

      <div className="stats-grid" style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Skeleton height="100px" borderRadius="20px" />
        <Skeleton height="100px" borderRadius="20px" />
      </div>

      <div style={{ marginTop: '24px' }}>
        <Skeleton height="250px" borderRadius="24px" />
      </div>
    </div>
  );
};
