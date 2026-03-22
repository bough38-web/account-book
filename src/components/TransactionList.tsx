import React from 'react';
import { motion } from 'framer-motion';

import type { Transaction } from '../App';

export const TransactionList: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="transaction-list-view fade-in">
      <header className="page-header">
        <h1>소비 내역</h1>
        <p className="text-muted">최근 7일간의 거래 기록입니다.</p>
      </header>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}
      >
        {transactions.map((tx) => (
          <motion.div 
            key={tx.id} 
            variants={item}
            className="glass-card" 
            style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}
          >
            <div style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '12px', 
              background: `${tx.color}22`, 
              color: tx.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <tx.icon size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '15px' }}>{tx.merchant}</h4>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{tx.category} • {tx.date}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ 
                fontWeight: '700', 
                fontSize: '15px',
                color: tx.amount > 0 ? '#10b981' : 'white'
              }}>
                {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}원
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
