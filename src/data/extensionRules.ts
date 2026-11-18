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
  installments: string[]; // 适用期次，支持单值和区间，如 1、3-6
  overdueDays: string[]; // 适用逾期天数，支持单值和区间，如 1、5-10
  feeRatio: ExtensionFeeRatio;
  validityDays: number; // APP 端展期入口开放的有效期天数
  extensionDays: number; // 展期天数：首期账单顺延的天数
  extensionTimes: number; // 展期次数：允许申请展期的最大次数
  enabled: boolean; // 启用状态：停用后不参与案件展期规则匹配
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

export const defaultExtensionRules: ExtensionRule[] = [
  {
    id: '1',
    name: '个人贷款短期逾期展期规则',
    code: 'EXT-RULE-001',
    products: ['个人贷款'],
    installments: ['1', '2', '3', '5'],
    overdueDays: ['1-15', '20', '25-30'],
    feeRatio: { principal: 2, interest: 0, penalty: 100 },
    validityDays: 7,
    extensionDays: 15,
    extensionTimes: 99,
    enabled: true,
    createdAt: '2024-05-10 10:00:00',
    updatedAt: '2024-05-10 10:00:00',
  },
  {
    id: '2',
    name: '信用卡中期逾期展期规则',
    code: 'EXT-RULE-002',
    products: ['信用卡'],
    installments: ['1', '2', '3', '4', '5', '6'],
    overdueDays: ['31-60'],
    feeRatio: { principal: 3, interest: 0, penalty: 100 },
    validityDays: 5,
    extensionDays: 15,
    extensionTimes: 99,
    enabled: true,
    createdAt: '2024-05-12 14:30:00',
    updatedAt: '2024-05-12 14:30:00',
  },
  {
    id: '3',
    name: '企业贷款长期逾期展期规则',
    code: 'EXT-RULE-003',
    products: ['企业贷款'],
    installments: ['2', '4', '5', '6'],
    overdueDays: ['61', '63-90'],
    feeRatio: { principal: 5, interest: 0, penalty: 100 },
    validityDays: 14,
    extensionDays: 15,
    extensionTimes: 99,
    enabled: true,
    createdAt: '2024-05-15 09:20:00',
    updatedAt: '2024-05-15 09:20:00',
  },
];

// 内存中的数据源：配置页的增删改会写回，案件详情读取最新规则
export const extensionRuleStore: { rules: ExtensionRule[] } = {
  rules: defaultExtensionRules.map(rule => ({
    ...rule,
    products: [...rule.products],
    installments: [...rule.installments],
    overdueDays: [...rule.overdueDays],
    feeRatio: { ...rule.feeRatio },
  })),
};

interface NumericRange {
  min: number;
  max: number;
}

const parseNumericCondition = (condition: string): NumericRange | null => {
  const normalized = condition.trim().replace(/[～~—–]/g, '-');
  const matched = normalized.match(/^(\d+)(?:-(\d+))?$/);
  if (!matched) return null;
  const min = Number(matched[1]);
  const max = Number(matched[2] ?? matched[1]);
  if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max) || min > max) return null;
  return { min, max };
};

export const isValidNumericCondition = (condition: string, minValue = 0): boolean => {
  const range = parseNumericCondition(condition);
  return range !== null && range.min >= minValue;
};

const parseNumericConditions = (conditions: string[]): NumericRange[] => {
  return conditions
    .map(parseNumericCondition)
    .filter((range): range is NumericRange => range !== null);
};

// 判断数字是否命中任意一个单值或闭区间
export const matchesNumericCondition = (value: number, conditions: string[]): boolean => {
  return parseNumericConditions(conditions).some(range => value >= range.min && value <= range.max);
};

// 判断两组单值/区间是否存在交集，用于规则冲突校验
export const numericConditionsOverlap = (left: string[], right: string[]): boolean => {
  const leftRanges = parseNumericConditions(left);
  const rightRanges = parseNumericConditions(right);
  return leftRanges.some(a => rightRanges.some(b => a.min <= b.max && b.min <= a.max));
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

// 按产品 + 逾期天数 + 当前期次匹配展期规则，未匹配时返回 null
export const findExtensionRule = (
  product: string,
  overdueDays: number,
  installment?: number
): ExtensionRule | null => {
  return (
    extensionRuleStore.rules.find(
      rule =>
        rule.enabled &&
        rule.products.includes(product) &&
        matchesNumericCondition(overdueDays, rule.overdueDays) &&
        (installment === undefined || matchesNumericCondition(installment, rule.installments))
    ) || null
  );
};
