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