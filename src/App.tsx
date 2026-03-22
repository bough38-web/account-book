import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BottomNav from './components/common/BottomNav'
import './App.css'

import { SpendingChart } from './components/charts/SpendingChart'
import { DailyBarChart } from './components/charts/DailyBarChart'
import { CategoryPieChart } from './components/charts/CategoryPieChart'
import { SmsSync } from './pages/SmsSync'
import { McpVisualizer } from './pages/McpVisualizer'
import { TransactionList } from './components/TransactionList'
import { DashboardSkeleton } from './components/common/Skeleton'
import { Utensils, Coffee, ShoppingBag, Car, MoreHorizontal, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export interface Transaction {
  id: number;
  date: string;
  merchant: string;
  amount: number;
  category: string;
  icon: any;
  color: string;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 1, date: '03/22', merchant: '(주)배달의민족', amount: -15200, category: '식비', icon: Utensils, color: '#6366f1' },
  { id: 2, date: '03/22', merchant: '스타벅스 성수점', amount: -8500, category: '카페', icon: Coffee, color: '#f59e0b' },
  { id: 3, date: '03/21', merchant: '쿠팡 (로켓와우)', amount: -24000, category: '쇼핑', icon: ShoppingBag, color: '#ec4899' },
  { id: 4, date: '03/20', merchant: '지하철 승차', amount: -1250, category: '교통', icon: Car, color: '#a855f7' },
  { id: 5, date: '03/20', merchant: '급여 (M-Bank)', amount: 1200000, category: '수입', icon: MoreHorizontal, color: '#10b981' },
];

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('account-book-txs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((tx: any) => ({ ...tx, icon: MoreHorizontal }));
      } catch (e) {
        return INITIAL_TRANSACTIONS;
      }
    }
    return INITIAL_TRANSACTIONS;
  });
  const [isLoading, setIsLoading] = useState(true)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  useEffect(() => {
    localStorage.setItem('account-book-txs', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'icon' | 'color'>) => {
    const tx: Transaction = {
      ...newTx,
      id: Date.now(),
      icon: MoreHorizontal,
      color: (newTx as any).color || '#6366f1'
    };
    setTransactions([tx, ...transactions]);
    setEditingTransaction(null);
    setActiveTab('history');
  };

  const handleDeleteTransaction = (id: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setTransactions(transactions.filter(tx => tx.id !== id));
    }
  };

  const handleUpdateTransaction = (updatedTx: Transaction) => {
    setTransactions(transactions.map(tx => tx.id === updatedTx.id ? updatedTx : tx));
    setEditingTransaction(null);
    setActiveTab('history');
  };

  const startEditing = (tx: Transaction) => {
    setEditingTransaction(tx);
    setActiveTab('sync');
  };

  const totalBalance = transactions.reduce((acc, tx) => acc + tx.amount, 0);
  const monthlyIncome = transactions.filter(tx => tx.amount > 0).reduce((acc, tx) => acc + tx.amount, 0);
  const monthlyExpense = Math.abs(transactions.filter(tx => tx.amount < 0).reduce((acc, tx) => acc + tx.amount, 0));

  return (
    <main className="app-container">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          style={{ paddingBottom: '100px' }}
        >
          {activeTab === 'home' && (
            isLoading ? <DashboardSkeleton /> : (
            <div className="dashboard-view fade-in">
              <header className="page-header">
                <h1>가계부 Pro</h1>
                <p className="text-muted">안녕하세요, 오늘도 스마트한 자산관리!</p>
              </header>
              
              <section className="summary-cards">
                <div className="glass-card main-balance">
                  <span className="card-label">총 자산</span>
                  <h2 className="balance-amount">₩{totalBalance.toLocaleString()}</h2>
                </div>
                
                <div className="stats-grid">
                  <div className="glass-card stat-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '4px' }}>
                      <ArrowUpRight size={14} />
                      <span className="stat-label">이번 달 수입</span>
                    </div>
                    <span className="stat-value income">+₩{monthlyIncome.toLocaleString()}</span>
                  </div>
                  <div className="glass-card stat-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--expense)', marginBottom: '4px' }}>
                      <ArrowDownRight size={14} />
                      <span className="stat-label">이번 달 지출</span>
                    </div>
                    <span className="stat-value expense">-₩{monthlyExpense.toLocaleString()}</span>
                  </div>
                </div>
              </section>

              <section style={{ marginTop: '24px' }}>
                <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>소비 트렌드</h3>
                <SpendingChart transactions={transactions} />
              </section>
            </div>
            )
          )}
          
          {activeTab === 'history' && (
            <div className="fade-in">
              <TransactionList 
                transactions={transactions} 
                onDelete={handleDeleteTransaction}
                onEdit={startEditing}
              />
            </div>
          )}
          
          {activeTab === 'sync' && (
            <div className="fade-in">
              <SmsSync 
                onAdd={handleAddTransaction} 
                onUpdate={handleUpdateTransaction}
                editData={editingTransaction}
              />
            </div>
          )}
          
          {activeTab === 'stats' && (
            <div className="stats-view fade-in">
              <header className="page-header">
                <h1>소비 분석</h1>
                <p className="text-muted">다양한 관점으로 나의 소비를 파악하세요.</p>
              </header>
              <section style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
                <CategoryPieChart transactions={transactions} />
                <DailyBarChart transactions={transactions} />
                <SpendingChart transactions={transactions} />
              </section>
            </div>
          )}
          
          {activeTab === 'mcp' && <McpVisualizer />}
        </motion.div>
      </AnimatePresence>
      
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </main>
  )
}

export default App
