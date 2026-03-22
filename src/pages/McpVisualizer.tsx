import React from 'react';
import { motion } from 'framer-motion';
import { Database, Cpu, Layout, ArrowRight } from 'lucide-react';

const Node = ({ icon: Icon, title, description, color }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -5, boxShadow: `0 10px 30px ${color}44` }}
    className="glass-card"
    style={{ 
      padding: '24px', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      textAlign: 'center',
      gap: '12px',
      border: `1px solid ${color}44`,
      flex: 1,
      minWidth: '200px'
    }}
  >
    <div style={{ padding: '12px', borderRadius: '16px', background: `${color}22`, color }}>
      <Icon size={32} />
    </div>
    <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{title}</h3>
    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{description}</p>
  </motion.div>
);

export const McpVisualizer: React.FC = () => {
  return (
    <div className="mcp-visualizer-view fade-in">
      <header className="page-header">
        <h1>MCP 아키텍처</h1>
        <p className="text-muted">Model Context Protocol 연동 시각화</p>
      </header>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '24px', 
        marginTop: '32px',
        position: 'relative'
      }}>
        <Node 
          icon={Database} 
          title="MCP Context Server" 
          description="은행 API 및 카드사 데이터를 안전하게 가져오는 데이터 인터페이스"
          color="#3b82f6"
        />

        <div style={{ display: 'flex', justifyContent: 'center', color: '#3b82f6' }}>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowRight style={{ transform: 'rotate(90deg)' }} />
          </motion.div>
        </div>

        <Node 
          icon={Cpu} 
          title="AI Reasoning Agent" 
          description="가져온 컨텍스트를 분석하여 소비 패턴 인식 및 자동 카테고리 분류"
          color="#a855f7"
        />

        <div style={{ display: 'flex', justifyContent: 'center', color: '#a855f7' }}>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            <ArrowRight style={{ transform: 'rotate(90deg)' }} />
          </motion.div>
        </div>

        <Node 
          icon={Layout} 
          title="Account Book Web/App" 
          description="최종 사용자에게 시각화된 데이터와 관리 도구 제공 (PWA)"
          color="#ec4899"
        />
      </div>

      <div className="glass-card" style={{ marginTop: '32px', padding: '20px' }}>
        <h4 style={{ marginBottom: '12px', color: 'var(--primary)' }}>Expert Techniques Used</h4>
        <ul style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <li>• Glassmorphism UI</li>
          <li>• Framer Motion</li>
          <li>• PWA Capabilities</li>
          <li>• Responsive Grid</li>
          <li>• Real-time Parsing</li>
          <li>• HSL Color System</li>
        </ul>
      </div>
    </div>
  );
};
