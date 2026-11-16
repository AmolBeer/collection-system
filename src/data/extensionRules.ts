// 展期规则数据（案件详情与展期规则配置页共用）
export interface ExtensionFeeRatio {
  principal: number; // 本金比例 %
  interest: number; // 利息比例 %
  penalty: number; // 罚息比例 %
}

export interface ExtensionRule {
  id: string;
  name: string;
  code: string;
  products: string[];
  overdueStages: string[];
  feeRatio: ExtensionFeeRatio;
  validityDays: number; // APP 端展期入口开放的有效期天数
  extensionDays: number; // 展期天数：首期账单顺延的天数
  extensionTimes: number; // 展期次数：允许申请展期的最大次数
  createdAt: string;
  updatedAt: string;
}

// 有效期天数的推荐区间
export const EXTENSION_VALIDITY_DAYS_OPTIONS = [3, 5, 7, 14, 30];

// 展期天数 / 展期次数的默认值
export const DEFAULT_EXTENSION_DAYS = 15;
export const DEFAULT_EXTENSION_TIMES = 99;
// 罚息比例固定值（不支持修改）
export const FIXED_PENALTY_RATIO = 100;

export const extensionProducts = ['个人贷款', '企业贷款', '信用卡', '消费金融', '其他'];
export const extensionOverdueStages = ['M0', 'M1', 'M2', 'M3', 'M4+'];

export const defaultExtensionRules: ExtensionRule[] = [
  {
    id: '1',
    name: '个人贷款M1展期规则',
    code: 'EXT-RULE-001',
    products: ['个人贷款'],
    overdueStages: ['M1'],
    feeRatio: { principal: 2, interest: 0, penalty: 100 },
    validityDays: 7,
    extensionDays: 15,
    extensionTimes: 99,
    createdAt: '2024-05-10 10:00:00',
    updatedAt: '2024-05-10 10:00:00',
  },
  {
    id: '2',
    name: '信用卡M2展期规则',
    code: 'EXT-RULE-002',
    products: ['信用卡'],
    overdueStages: ['M2'],
    feeRatio: { principal: 3, interest: 0, penalty: 100 },
    validityDays: 5,
    extensionDays: 15,
    extensionTimes: 99,
    createdAt: '2024-05-12 14:30:00',
    updatedAt: '2024-05-12 14:30:00',
  },
  {
    id: '3',
    name: '企业贷款M3展期规则',
    code: 'EXT-RULE-003',
    products: ['企业贷款'],
    overdueStages: ['M3'],
    feeRatio: { principal: 5, interest: 0, penalty: 100 },
    validityDays: 14,
    extensionDays: 15,
    extensionTimes: 99,
    createdAt: '2024-05-15 09:20:00',
    updatedAt: '2024-05-15 09:20:00',
  },
];

// 内存中的数据源：配置页的增删改会写回，案件详情读取最新规则
export const extensionRuleStore: { rules: ExtensionRule[] } = {
  rules: defaultExtensionRules.map(rule => ({ ...rule, products: [...rule.products], feeRatio: { ...rule.feeRatio } })),
};

// 逾期天数 -> 逾期阶段
export const getOverdueStageByDays = (days: number): string => {
  if (days <= 0) return 'M0';
  if (days <= 30) return 'M1';
  if (days <= 60) return 'M2';
  if (days <= 90) return 'M3';
  return 'M4+';
};

// 案件贷款类型 -> 产品
export const getProductByLoanType = (loanType: string): string => {
  const type = loanType.toLowerCase();
  if (type.includes('personal')) return '个人贷款';
  if (type.includes('business') || type.includes('enterprise')) return '企业贷款';
  if (type.includes('credit card')) return '信用卡';
  if (type.includes('consumer')) return '消费金融';
  return '其他';
};

// 按产品 + 逾期阶段匹配展期规则，未匹配时返回 null
export const findExtensionRule = (product: string, stage: string): ExtensionRule | null => {
  return (
    extensionRuleStore.rules.find(
      rule => rule.overdueStages.includes(stage) && rule.products.includes(product)
    ) || null
  );
};
