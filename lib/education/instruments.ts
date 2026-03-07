import type { Bucket } from '@/types';
import type { InvestmentInstrument } from './types';

const safetyInstruments: InvestmentInstrument[] = [
  {
    id: 'hysa',
    nameKey: 'instruments.hysa.name',
    descriptionKey: 'instruments.hysa.description',
    bucket: 'safety',
    riskLevel: 'low',
    typicalReturn: '1-5%',
    prosKeys: [
      'instruments.hysa.pros.fdic',
      'instruments.hysa.pros.liquid',
      'instruments.hysa.pros.noMinimum',
    ],
    consKeys: [
      'instruments.hysa.cons.lowReturn',
      'instruments.hysa.cons.variableRate',
    ],
  },
  {
    id: 'money-market',
    nameKey: 'instruments.moneyMarket.name',
    descriptionKey: 'instruments.moneyMarket.description',
    bucket: 'safety',
    riskLevel: 'low',
    typicalReturn: '1-5%',
    prosKeys: [
      'instruments.moneyMarket.pros.stable',
      'instruments.moneyMarket.pros.liquid',
      'instruments.moneyMarket.pros.diversified',
    ],
    consKeys: [
      'instruments.moneyMarket.cons.lowReturn',
      'instruments.moneyMarket.cons.fees',
    ],
  },
  {
    id: 'short-term-cd',
    nameKey: 'instruments.shortTermCd.name',
    descriptionKey: 'instruments.shortTermCd.description',
    bucket: 'safety',
    riskLevel: 'low',
    typicalReturn: '2-5%',
    prosKeys: [
      'instruments.shortTermCd.pros.guaranteed',
      'instruments.shortTermCd.pros.fdic',
      'instruments.shortTermCd.pros.predictable',
    ],
    consKeys: [
      'instruments.shortTermCd.cons.locked',
      'instruments.shortTermCd.cons.penalty',
    ],
  },
  {
    id: 'treasury-bills',
    nameKey: 'instruments.treasuryBills.name',
    descriptionKey: 'instruments.treasuryBills.description',
    bucket: 'safety',
    riskLevel: 'low',
    typicalReturn: '3-5%',
    prosKeys: [
      'instruments.treasuryBills.pros.government',
      'instruments.treasuryBills.pros.taxAdvantage',
      'instruments.treasuryBills.pros.shortTerm',
    ],
    consKeys: [
      'instruments.treasuryBills.cons.lowReturn',
      'instruments.treasuryBills.cons.minimumPurchase',
    ],
  },
  {
    id: 'i-bonds',
    nameKey: 'instruments.iBonds.name',
    descriptionKey: 'instruments.iBonds.description',
    bucket: 'safety',
    riskLevel: 'low',
    typicalReturn: '4-7%',
    prosKeys: [
      'instruments.iBonds.pros.inflationProtected',
      'instruments.iBonds.pros.government',
      'instruments.iBonds.pros.taxDeferred',
    ],
    consKeys: [
      'instruments.iBonds.cons.holdingPeriod',
      'instruments.iBonds.cons.purchaseLimit',
    ],
  },
];

const growthInstruments: InvestmentInstrument[] = [
  {
    id: 'cd-ladder',
    nameKey: 'instruments.cdLadder.name',
    descriptionKey: 'instruments.cdLadder.description',
    bucket: 'growth',
    riskLevel: 'low',
    typicalReturn: '3-5%',
    prosKeys: [
      'instruments.cdLadder.pros.guaranteed',
      'instruments.cdLadder.pros.staggeredAccess',
      'instruments.cdLadder.pros.fdic',
    ],
    consKeys: [
      'instruments.cdLadder.cons.complexity',
      'instruments.cdLadder.cons.lowerReturn',
    ],
  },
  {
    id: 'bond-funds',
    nameKey: 'instruments.bondFunds.name',
    descriptionKey: 'instruments.bondFunds.description',
    bucket: 'growth',
    riskLevel: 'medium',
    typicalReturn: '3-6%',
    prosKeys: [
      'instruments.bondFunds.pros.diversified',
      'instruments.bondFunds.pros.income',
      'instruments.bondFunds.pros.liquid',
    ],
    consKeys: [
      'instruments.bondFunds.cons.interestRateRisk',
      'instruments.bondFunds.cons.fees',
    ],
  },
  {
    id: 'balanced-funds',
    nameKey: 'instruments.balancedFunds.name',
    descriptionKey: 'instruments.balancedFunds.description',
    bucket: 'growth',
    riskLevel: 'medium',
    typicalReturn: '5-8%',
    prosKeys: [
      'instruments.balancedFunds.pros.diversified',
      'instruments.balancedFunds.pros.autoRebalanced',
      'instruments.balancedFunds.pros.moderate',
    ],
    consKeys: [
      'instruments.balancedFunds.cons.fees',
      'instruments.balancedFunds.cons.lessControl',
    ],
  },
  {
    id: 'conservative-index',
    nameKey: 'instruments.conservativeIndex.name',
    descriptionKey: 'instruments.conservativeIndex.description',
    bucket: 'growth',
    riskLevel: 'medium',
    typicalReturn: '6-10%',
    prosKeys: [
      'instruments.conservativeIndex.pros.lowFees',
      'instruments.conservativeIndex.pros.diversified',
      'instruments.conservativeIndex.pros.passive',
    ],
    consKeys: [
      'instruments.conservativeIndex.cons.marketRisk',
      'instruments.conservativeIndex.cons.noGuarantee',
    ],
  },
  {
    id: 'target-date',
    nameKey: 'instruments.targetDate.name',
    descriptionKey: 'instruments.targetDate.description',
    bucket: 'growth',
    riskLevel: 'medium',
    typicalReturn: '5-9%',
    prosKeys: [
      'instruments.targetDate.pros.handsFree',
      'instruments.targetDate.pros.autoAdjust',
      'instruments.targetDate.pros.diversified',
    ],
    consKeys: [
      'instruments.targetDate.cons.fees',
      'instruments.targetDate.cons.oneSize',
    ],
  },
];

const dreamInstruments: InvestmentInstrument[] = [
  {
    id: 'stock-index',
    nameKey: 'instruments.stockIndex.name',
    descriptionKey: 'instruments.stockIndex.description',
    bucket: 'dream',
    riskLevel: 'high',
    typicalReturn: '7-12%',
    prosKeys: [
      'instruments.stockIndex.pros.highReturn',
      'instruments.stockIndex.pros.lowFees',
      'instruments.stockIndex.pros.diversified',
    ],
    consKeys: [
      'instruments.stockIndex.cons.volatility',
      'instruments.stockIndex.cons.patience',
    ],
  },
  {
    id: 'growth-etf',
    nameKey: 'instruments.growthEtf.name',
    descriptionKey: 'instruments.growthEtf.description',
    bucket: 'dream',
    riskLevel: 'high',
    typicalReturn: '8-15%',
    prosKeys: [
      'instruments.growthEtf.pros.highGrowth',
      'instruments.growthEtf.pros.liquid',
      'instruments.growthEtf.pros.taxEfficient',
    ],
    consKeys: [
      'instruments.growthEtf.cons.highVolatility',
      'instruments.growthEtf.cons.concentration',
    ],
  },
  {
    id: 'international-stocks',
    nameKey: 'instruments.internationalStocks.name',
    descriptionKey: 'instruments.internationalStocks.description',
    bucket: 'dream',
    riskLevel: 'high',
    typicalReturn: '6-12%',
    prosKeys: [
      'instruments.internationalStocks.pros.globalDiversification',
      'instruments.internationalStocks.pros.emergingMarkets',
      'instruments.internationalStocks.pros.currencyDiversification',
    ],
    consKeys: [
      'instruments.internationalStocks.cons.currencyRisk',
      'instruments.internationalStocks.cons.politicalRisk',
    ],
  },
  {
    id: 'reits',
    nameKey: 'instruments.reits.name',
    descriptionKey: 'instruments.reits.description',
    bucket: 'dream',
    riskLevel: 'medium',
    typicalReturn: '5-10%',
    prosKeys: [
      'instruments.reits.pros.realEstate',
      'instruments.reits.pros.dividends',
      'instruments.reits.pros.liquid',
    ],
    consKeys: [
      'instruments.reits.cons.interestSensitive',
      'instruments.reits.cons.taxInefficient',
    ],
  },
];

const instrumentsByBucket: Record<Bucket, InvestmentInstrument[]> = {
  safety: safetyInstruments,
  growth: growthInstruments,
  dream: dreamInstruments,
};

export function getInstrumentsForBucket(bucket: Bucket): InvestmentInstrument[] {
  return instrumentsByBucket[bucket];
}
