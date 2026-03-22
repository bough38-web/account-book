import React from 'react';
import { Home, List, PieChart, Activity, Plus } from 'lucide-react';
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
        icon={<Home size={22} />} 
        label="홈" 
        active={activeTab === 'home'} 
        onClick={() => setActiveTab('home')}
      />
      <NavItem 
        icon={<List size={22} />} 
        label="내역" 
        active={activeTab === 'list'} 
        onClick={() => setActiveTab('list')}
      />
      
      <button className="nav-plus-btn">
        <Plus size={32} color="white" />
      </button>

      <NavItem 
        icon={<PieChart size={22} />} 
        label="통계" 
        active={activeTab === 'stats'} 
        onClick={() => setActiveTab('stats')}
      />
      <NavItem 
        icon={<Activity size={22} />} 
        label="MCP" 
        active={activeTab === 'mcp'} 
        onClick={() => setActiveTab('mcp')}
      />
    </nav>
  );
};

export default BottomNav;
