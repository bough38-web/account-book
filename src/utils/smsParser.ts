export interface ParsedSMS {
  cardName: string;
  amount: number;
  date: string;
  time: string;
  merchant: string;
  type: '승인' | '취소';
}

export const parseSMS = (text: string): ParsedSMS | null => {
  // Example formats:
  // [Web발신] 현대0000승인 15,200원 03/22 14:30 (주)배달의민족
  // KB국민카드(1*2*) 8,500원 03/22 12:45 스타벅스 성수점 승인
  
  const hCardRegex = /\[Web발신\]\s(.*)\d{4}승인\s([\d,]+)원\s(\d{2}\/\d{2})\s(\d{2}:\d{2})\s(.*)/;
  const kbCardRegex = /(.*)카드\(\d\*\d\*\)\s([\d,]+)원\s(\d{2}\/\d{2})\s(\d{2}:\d{2})\s(.*)\s(승인|취소)/;

  let match = text.match(hCardRegex);
  if (match) {
    return {
      cardName: match[1] + '카드',
      amount: parseInt(match[2].replace(/,/g, '')),
      date: match[3],
      time: match[4],
      merchant: match[5],
      type: '승인'
    };
  }

  match = text.match(kbCardRegex);
  if (match) {
    return {
      cardName: match[1] + '카드',
      amount: parseInt(match[2].replace(/,/g, '')),
      date: match[3],
      time: match[4],
      merchant: match[5],
      type: match[6] as '승인' | '취소'
    };
  }

  // Generic fallback if it contains common keywords
  if (text.includes('원') && (text.includes('승인') || text.includes('결제'))) {
    const amountMatch = text.match(/([\d,]+)원/);
    const merchant = merchantRegexFallback(text);
    
    return {
      cardName: '알 수 없음',
      amount: amountMatch ? parseInt(amountMatch[1].replace(/,/g, '')) : 0,
      date: new Date().toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }).replace('. ', '/').replace('.', ''),
      time: new Date().toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      merchant: typeof merchant === 'string' ? merchant : '가맹점 알 수 없음',
      type: '승인'
    };
  }

  return null;
};

const merchantRegexFallback = (text: string) => {
  // Simple heuristic to extract merchant name
  const parts = text.split(' ');
  return parts[parts.length - 1]; // Last word is often the merchant
};
