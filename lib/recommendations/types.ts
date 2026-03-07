import type { Bucket } from '@/types';

export type ProductType = 'savings' | 'brokerage' | 'robo' | 'cd' | 'money_market';

export interface FinancialProduct {
  id: string;
  name: string;
  type: ProductType;
  provider: string;
  apy?: string;
  features: string[];
  bestFor: Bucket[];
  minTimeHorizonMonths?: number;
  maxTimeHorizonMonths?: number;
  affiliateUrl: string;
  affiliateNetwork: string;
  estimatedPayout: number;
  descriptionKey: string;
}

export interface Recommendation {
  goalId: string;
  products: FinancialProduct[];
  primaryProduct: FinancialProduct;
  reasonKey: string;
}

export type Placement = 'post_goal' | 'dashboard';
export type Position = 'primary' | 'alternative_1' | 'alternative_2';

export interface TrackingContext {
  placement: Placement;
  position: Position;
  goalBucket?: Bucket;
}
