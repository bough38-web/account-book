import React, { useState, useEffect } from 'react';
import { parseSMS } from '../utils/smsParser';
import type { ParsedSMS } from '../utils/smsParser';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface SmsSyncProps {
  onAdd: (tx: any) => void;
  onUpdate?: (tx: any) => void;
  editData?: any;
}

export const SmsSync: React.FC<SmsSyncProps> = ({ onAdd, onUpdate, editData }) => {
  const [isManual, setIsManual] = useState(false);
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<ParsedSMS | null>(null);
  const [error, setError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('식비');
  
  // Manual states
  const [manualMerchant, setManualMerchant] = useState('');
  const [manualAmount, setManualAmount] = useState('');
  const [manualType, setManualType] = useState<'expense' | 'income'>('expense');

  useEffect(() => {
    if (editData) {
      setIsManual(true);
      setManualMerchant(editData.merchant);
      setManualAmount(Math.abs(editData.amount).toString());
      setManualType(editData.amount > 0 ? 'income' : 'expense');
      setSelectedCategory(editData.category);
    }
  }, [editData]);

  const categories = [
    { name: '식비', color: '#6366f1' },
    { name: '카페', color: '#f59e0b' },
    { name: '쇼핑', color: '#ec4899' },
    { name: '교통', color: '#a855f7' },
    { name: '수입', color: '#10b981' },
    { name: '기타', color: '#94a3b8' },
  ];

  const handleAdd = () => {
    if (isManual) {
      if (!manualMerchant || !manualAmount) return;
      
      const txData = {
        id: editData?.id,
        date: editData?.date || new Date().toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }).replace('.', '/').trim(),
        merchant: manualMerchant,
        amount: manualType === 'expense' ? -Number(manualAmount) : Number(manualAmount),
        category: manualType === 'income' ? '수입' : selectedCategory,
        color: manualType === 'income' ? '#10b981' : (categories.find(c => c.name === selectedCategory)?.color || '#6366f1')
      };

      if (editData && onUpdate) {
        onUpdate(txData);
      } else {
        onAdd(txData);
      }

      setManualMerchant('');
      setManualAmount('');
    } else if (result) {
      onAdd({
        date: result.date,
        merchant: result.merchant,
        amount: -result.amount,
        category: selectedCategory,
        color: categories.find(c => c.name === selectedCategory)?.color || '#6366f1'
      });
      setInputText('');
      setResult(null);
    }
  };

  const handleParse = (text: string) => {
    setInputText(text);
    const parsed = parseSMS(text);
    if (parsed) {
      setResult(parsed);
      setError(false);
    } else if (text.length > 10) {
      setError(true);
      setResult(null);
    } else {
      setResult(null);
      setError(false);
    }
  };

  const mockSamples = [
    "[Web발신] 현대0123승인 15,200원 03/22 14:30 (주)배달의민족",
    "KB국민카드(1*2*) 8,500원 03/22 12:45 스타벅스 성수점 승인"
  ];

  return (
    <div className="sms-sync-view fade-in">
      <header className="page-header">
        <h1>{isManual ? '수동 내역 입력' : '문자 자동 입력'}</h1>
        <p className="text-muted">직접 입력하거나 문자를 활용해 내역을 추가하세요.</p>
        
        <div style={{ 
          display: 'flex', 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '12px', 
          padding: '4px',
          marginTop: '16px'
        }}>
          <button 
            onClick={() => setIsManual(false)}
            style={{ 
              flex: 1, 
              padding: '8px', 
              borderRadius: '8px',
              border: 'none',
              background: !isManual ? 'var(--primary)' : 'transparent',
              color: 'white',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            문자 파싱
          </button>
          <button 
            onClick={() => setIsManual(true)}
            style={{ 
              flex: 1, 
              padding: '8px', 
              borderRadius: '8px',
              border: 'none',
              background: isManual ? 'var(--primary)' : 'transparent',
              color: 'white',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            직접 입력
          </button>
        </div>
      </header>

      {isManual ? (
        <div className="manual-section glass-card fade-in" style={{ padding: '24px', marginTop: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <button 
              onClick={() => setManualType('expense')}
              style={{ 
                flex: 1, 
                padding: '10px', 
                borderRadius: '12px',
                border: '1px solid',
                borderColor: manualType === 'expense' ? 'var(--expense)' : 'var(--glass-border)',
                background: manualType === 'expense' ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                color: manualType === 'expense' ? 'var(--expense)' : 'white',
                fontSize: '14px'
              }}
            >
              지출
            </button>
            <button 
              onClick={() => setManualType('income')}
              style={{ 
                flex: 1, 
                padding: '10px', 
                borderRadius: '12px',
                border: '1px solid',
                borderColor: manualType === 'income' ? 'var(--primary)' : 'var(--glass-border)',
                background: manualType === 'income' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                color: manualType === 'income' ? 'var(--primary)' : 'white',
                fontSize: '14px'
              }}
            >
              수입
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>내용 (가맹점)</label>
              <input 
                type="text" 
                placeholder="어디에서 사용하셨나요?"
                value={manualMerchant}
                onChange={(e) => setManualMerchant(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--glass-border)',
                  color: 'white',
                  outline: 'none'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>금액</label>
              <input 
                type="number" 
                placeholder="숫자만 입력하세요"
                value={manualAmount}
                onChange={(e) => setManualAmount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--glass-border)',
                  color: 'white',
                  outline: 'none',
                  fontSize: '18px',
                  fontWeight: '700'
                }}
              />
            </div>
            
            {manualType === 'expense' && (
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>카테고리</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {categories.filter(c => c.name !== '수입').map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat.name)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        border: '1px solid',
                        borderColor: selectedCategory === cat.name ? cat.color : 'var(--glass-border)',
                        background: selectedCategory === cat.name ? `${cat.color}22` : 'transparent',
                        color: selectedCategory === cat.name ? cat.color : 'white'
                      }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button 
            className="glass"
            onClick={handleAdd}
            disabled={!manualMerchant || !manualAmount}
            style={{ 
              width: '100%', 
              marginTop: '24px', 
              padding: '16px', 
              borderRadius: '16px', 
              background: 'var(--primary)', 
              color: 'white',
              fontWeight: '700',
              opacity: (!manualMerchant || !manualAmount) ? 0.5 : 1
            }}
          >
            {editData ? '수정 완료' : '저장하기'}
          </button>
        </div>
      ) : (
        <>
          <div className="input-section glass-card" style={{ padding: '20px', marginTop: '20px' }}>
        <textarea 
          placeholder="여기에 문자를 붙여넣으세요..."
          value={inputText}
          onChange={(e) => handleParse(e.target.value)}
          style={{
            width: '100%',
            height: '100px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--glass-border)',
            borderRadius: '12px',
            color: 'white',
            padding: '12px',
            fontSize: '14px',
            resize: 'none',
            outline: 'none'
          }}
        />
        
        <div className="samples" style={{ marginTop: '12px' }}>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>샘플 문자 테스트 (클릭)</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {mockSamples.map((s, i) => (
              <button 
                key={i} 
                onClick={() => handleParse(s)}
                className="glass"
                style={{ fontSize: '10px', padding: '6px 10px', borderRadius: '8px', color: 'var(--primary)' }}
              >
                샘플 {i+1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <div className="result-section glass-card fade-in" style={{ padding: '20px', marginTop: '16px', borderLeft: '4px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary)' }}>파싱 성공!</span>
            <CheckCircle2 size={16} color="var(--primary)" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">가맹점</span>
              <span style={{ fontWeight: '600' }}>{result.merchant}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">금액</span>
              <span style={{ fontWeight: '700', fontSize: '18px', color: 'var(--accent)' }}>₩{result.amount.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">카드</span>
              <span>{result.cardName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">일시</span>
              <span>{result.date} {result.time}</span>
            </div>
            
            <div style={{ marginTop: '12px' }}>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>카테고리 선택</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      border: '1px solid',
                      borderColor: selectedCategory === cat.name ? cat.color : 'var(--glass-border)',
                      background: selectedCategory === cat.name ? `${cat.color}22` : 'transparent',
                      color: selectedCategory === cat.name ? cat.color : 'white',
                      transition: 'all 0.2s',
                      cursor: 'pointer'
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button 
            className="glass"
            onClick={handleAdd}
            style={{ 
              width: '100%', 
              marginTop: '16px', 
              padding: '12px', 
              borderRadius: '12px', 
              background: 'var(--primary)', 
              color: 'white',
              fontWeight: '600'
            }}
          >
            내역에 추가하기
          </button>
        </div>
      )}

      {error && (
        <div className="error-section glass-card fade-in" style={{ padding: '16px', marginTop: '16px', borderLeft: '4px solid var(--expense)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--expense)' }}>
            <AlertCircle size={18} />
            <span style={{ fontSize: '13px' }}>인식할 수 없는 문자 형식입니다.</span>
          </div>
        </div>
      )}
    </>
  )}
</div>
  );
};
