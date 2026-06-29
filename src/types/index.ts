export interface Product {
  id: string;
  name: string;
}

export interface OverdueStage {
  id: string;
  stageCode: string;
  name: string;
  minDays: number;
  maxDays: number | null;
  enabled: boolean;
  createTime: string;
  createBy: string;
  updateTime: string;
  updateBy: string;
  productId: string;
}

export interface CaseItem {
  id: string;
  borrowerName: string;
  overdueDays: number;
  amount: number;
  stageCode: string;
  productId: string;
}

export type Language = 'zh' | 'en' | 'id';

export interface SubjectReduction {
  principal: number;
  interest: number;
  penalty: number;
}

export interface SubjectAmount {
  principal: number;
  interest: number;
  penalty: number;
}

export type ReductionType = 'settle' | 'nonSettle';

export type SettlementType = 'settle' | 'nonSettle';

export interface ReductionRule {
  id: string;
  name: string;
  products: string[];
  minOverdueDays: number;
  maxOverdueDays: number;
  settlementType: SettlementType;
  subjectCaps: SubjectReduction;
  enabled: boolean;
  createTime: string;
  createBy: string;
  updateTime: string;
  updateBy: string;
}

export interface SpecialReductionRule {
  id: string;
  name: string;
  products: string[];
  description: string;
  enabled: boolean;
  createTime: string;
  createBy: string;
  updateTime: string;
  updateBy: string;
}

export interface BillDetail {
  billNumber: string;
  installments: string;
  originalAmount: number;
  principal: number;
  interest: number;
  penalty: number;
  reductionAmount: number;
  reductionBreakdown: SubjectReduction;
  finalAmount: number;
}

export interface ReductionApplication {
  id: string;
  applicationId: string;
  caseId: string;
  customerName: string;
  phone: string;
  orderId: string;
  applyTime: string;
  applicant: string;
  reductionType: ReductionType;
  settlementType: SettlementType;
  billCount: number;
  totalAmount: number;
  maxReductionAmount: number;
  requestedReduction: number;
  requestedBreakdown: SubjectReduction;
  approvedReduction: number;
  approvedBreakdown: SubjectReduction;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  reviewTime?: string;
  reviewer?: string;
  reviewComment?: string;
  paymentCode?: string;
  paymentTime?: string;
  completedTime?: string;
  billDetails: BillDetail[];
  ruleId?: string;
  specialRuleId?: string;
}

export interface SettlementResult {
  totalPaid: number;
  remainingAmount: number;
  settledBills: BillDetail[];
  partialSettledBill?: BillDetail;
}
