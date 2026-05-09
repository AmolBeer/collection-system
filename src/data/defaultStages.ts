import { OverdueStage, Product } from '../types';

export const products: Product[] = [
  { id: '1', name: '消费贷' },
  { id: '2', name: '经营贷' },
];

export const defaultStages: OverdueStage[] = [
  { id: '1', stageCode: 'P1_M0', name: 'M0', minDays: 0, maxDays: 0, enabled: true, createTime: '2024-01-01 10:00:00', createBy: '系统', updateTime: '2024-01-01 10:00:00', updateBy: '系统', productId: '1' },
  { id: '2', stageCode: 'P1_M1', name: 'M1', minDays: 1, maxDays: 30, enabled: true, createTime: '2024-01-01 10:00:00', createBy: '系统', updateTime: '2024-01-01 10:00:00', updateBy: '系统', productId: '1' },
  { id: '3', stageCode: 'P1_M2', name: 'M2', minDays: 31, maxDays: 60, enabled: true, createTime: '2024-01-01 10:00:00', createBy: '系统', updateTime: '2024-01-01 10:00:00', updateBy: '系统', productId: '1' },
  { id: '4', stageCode: 'P1_M3', name: 'M3', minDays: 61, maxDays: 90, enabled: true, createTime: '2024-01-01 10:00:00', createBy: '系统', updateTime: '2024-01-01 10:00:00', updateBy: '系统', productId: '1' },
  { id: '5', stageCode: 'P1_M4P', name: 'M4+', minDays: 91, maxDays: null, enabled: true, createTime: '2024-01-01 10:00:00', createBy: '系统', updateTime: '2024-01-01 10:00:00', updateBy: '系统', productId: '1' },
  { id: '6', stageCode: 'P2_M0', name: 'M0', minDays: 0, maxDays: 0, enabled: true, createTime: '2024-01-01 10:00:00', createBy: '系统', updateTime: '2024-01-01 10:00:00', updateBy: '系统', productId: '2' },
  { id: '7', stageCode: 'P2_M1', name: 'M1', minDays: 1, maxDays: 30, enabled: true, createTime: '2024-01-01 10:00:00', createBy: '系统', updateTime: '2024-01-01 10:00:00', updateBy: '系统', productId: '2' },
  { id: '8', stageCode: 'P2_M2', name: 'M2', minDays: 31, maxDays: 60, enabled: true, createTime: '2024-01-01 10:00:00', createBy: '系统', updateTime: '2024-01-01 10:00:00', updateBy: '系统', productId: '2' },
];