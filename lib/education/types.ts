import type { Bucket } from '@/types';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface InvestmentInstrument {
  id: string;
  nameKey: string;
  descriptionKey: string;
  bucket: Bucket;
  riskLevel: RiskLevel;
  typicalReturn: string;
  prosKeys: string[];
  consKeys: string[];
}
