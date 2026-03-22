import { useState } from 'react'
import BottomNav from './components/common/BottomNav'
import './App.css'

import { SpendingChart } from './components/charts/SpendingChart'
import { DailyBarChart } from './components/charts/DailyBarChart'
import { SmsSync } from './pages/SmsSync'
import { McpVisualizer } from './pages/McpVisualizer'
import { TransactionList } from './components/TransactionList'
import { Utensils, Coffee, ShoppingBag, Car, MoreHorizontal } from 'lucide-react'

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
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS)

  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'icon' | 'color'>) => {
    const tx: Transaction = {
      ...newTx,
      id: Date.now(),
      icon: MoreHorizontal, // Default icon for manual/SMS entries
      color: '#6366f1' // Default color
    };
    setTransactions([tx, ...transactions]);
    setActiveTab('history'); // Go to list view to show the new entry
  };

  const totalBalance = transactions.reduce((acc, tx) => acc + tx.amount, 0);
  const monthlyIncome = transactions.filter(tx => tx.amount > 0).reduce((acc, tx) => acc + tx.amount, 0);
  const monthlyExpense = Math.abs(transactions.filter(tx => tx.amount < 0).reduce((acc, tx) => acc + tx.amount, 0));

  return (
    <main className="app-container">
      <div className="fade-in">
        {activeTab === 'home' && (
          <div className="dashboard-view">
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
                  <span className="stat-label">이번 달 수입</span>
                  <span className="stat-value income">+₩{monthlyIncome.toLocaleString()}</span>
                </div>
                <div className="glass-card stat-item">
                  <span className="stat-label">이번 달 지출</span>
                  <span className="stat-value expense">-₩{monthlyExpense.toLocaleString()}</span>
                </div>
              </div>
            </section>
          </div>
        )}
        
        {activeTab === 'history' && <TransactionList transactions={transactions} />}
        {activeTab === 'sync' && <SmsSync onAdd={handleAddTransaction} />}
        {activeTab === 'stats' && (
          <div className="stats-view fade-in">
            <header className="page-header">
              <h1>소비 분석</h1>
              <p className="text-muted">나의 소비 패턴을 분석합니다.</p>
            </header>
            <SpendingChart transactions={transactions} />
            <DailyBarChart />
          </div>
        )}
        {activeTab === 'mcp' && <McpVisualizer />}
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </main>
  )
}

export default App
