export interface Transaction {
  id: string;
  amount: number;
  user: string;
  timestamp: string;
  riskScore: number;
}

export type RiskLevel = 'all' | 'high' | 'medium' | 'low';

export function getRiskLevel(riskScore: number): 'high' | 'medium' | 'low' {
  if (riskScore > 70) return 'high';
  if (riskScore >= 40) return 'medium';
  return 'low';
}
