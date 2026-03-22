import React from 'react';
import { Home, List, PieChart, Cpu, Plus } from 'lucide-react';
import './BottomNav.css';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
    <div className="nav-icon">{icon}</div>
    <span className="nav-label">{label}</span>
  </button>
);

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="bottom-nav glass">
      <NavItem 
        icon={<Home size={24} />} 
        label="홈" 
        active={activeTab === 'home'} 
        onClick={() => setActiveTab('home')} 
      />
      <NavItem 
        icon={<List size={24} />} 
        label="내역" 
        active={activeTab === 'history'} 
        onClick={() => setActiveTab('history')} 
      />
      
      <div className="nav-item central-btn" onClick={() => setActiveTab('sync')}>
        <div className="plus-btn-inner">
          <Plus size={32} color="white" />
        </div>
        <span className="nav-label">추가</span>
      </div>

      <NavItem 
        icon={<PieChart size={24} />} 
        label="통계" 
        active={activeTab === 'stats'} 
        onClick={() => setActiveTab('stats')} 
      />
      <NavItem 
        icon={<Cpu size={24} />} 
        label="분석" 
        active={activeTab === 'mcp'} 
        onClick={() => setActiveTab('mcp')} 
      />
    </nav>
  );
};

export default BottomNav;
