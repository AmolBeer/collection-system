import { ReductionRule, SubjectReduction, BillDetail, SettlementResult, SubjectAmount } from '../types';

export interface Bill {
  id: string;
  billNumber: string;
  installments: string;
  orderId: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: 'paid' | 'unpaid' | 'overdue';
  principal?: number;
  interest?: number;
  penalty?: number;
}

export function findMatchingRule(
  rules: ReductionRule[],
  product: string,
  overdueDays: number,
  settlementType: 'settle' | 'nonSettle'
): ReductionRule | undefined {
  const filteredRules = rules.filter(rule => {
    if (!rule.enabled) return false;
    if (!rule.products.includes(product)) return false;
    if (rule.settlementType !== settlementType) return false;
    if (overdueDays < rule.overdueDays) return false;
    return true;
  });

  return filteredRules.sort((a, b) => b.overdueDays - a.overdueDays)[0];
}

export function calculateMaxReduction(
  bills: Bill[],
  rule: ReductionRule
): { maxReduction: number; breakdown: SubjectReduction; billDetails: BillDetail[] } {
  const breakdown: SubjectReduction = { principal: 0, interest: 0, penalty: 0 };
  const billDetails: BillDetail[] = [];

  bills.forEach(bill => {
    const principalCap = (bill.principal || 0) * (rule.subjectCaps.principal / 100);
    const interestCap = (bill.interest || 0) * (rule.subjectCaps.interest / 100);
    const penaltyCap = (bill.penalty || 0) * (rule.subjectCaps.penalty / 100);

    breakdown.principal += principalCap;
    breakdown.interest += interestCap;
    breakdown.penalty += penaltyCap;

    const billReduction = principalCap + interestCap + penaltyCap;
    const billFinal = bill.amount - billReduction;

    billDetails.push({
      billNumber: bill.billNumber,
      installments: bill.installments,
      originalAmount: bill.amount,
      principal: bill.principal || 0,
      interest: bill.interest || 0,
      penalty: bill.penalty || 0,
      reductionAmount: billReduction,
      reductionBreakdown: {
        principal: principalCap,
        interest: interestCap,
        penalty: penaltyCap,
      },
      finalAmount: billFinal,
    });
  });

  const maxReduction = breakdown.principal + breakdown.interest + breakdown.penalty;

  return { maxReduction, breakdown, billDetails };
}

export function allocateReduction(
  bills: Bill[],
  rule: ReductionRule,
  requestedReduction: number
): { allocatedBreakdown: SubjectReduction; billDetails: BillDetail[] } {
  const { maxReduction, breakdown: maxBreakdown } = calculateMaxReduction(bills, rule);
  
  const actualReduction = Math.min(requestedReduction, maxReduction);
  
  const totalCap = maxBreakdown.principal + maxBreakdown.interest + maxBreakdown.penalty;
  
  const principalRatio = totalCap > 0 ? maxBreakdown.principal / totalCap : 0;
  const interestRatio = totalCap > 0 ? maxBreakdown.interest / totalCap : 0;
  const penaltyRatio = totalCap > 0 ? maxBreakdown.penalty / totalCap : 0;
  
  const allocatedBreakdown: SubjectReduction = {
    principal: actualReduction * principalRatio,
    interest: actualReduction * interestRatio,
    penalty: actualReduction * penaltyRatio,
  };

  const subjectTotals = calculateSubjectTotals(bills);
  
  const billDetails: BillDetail[] = bills.map(bill => {
    const billPrincipalRatio = subjectTotals.principal > 0 ? (bill.principal || 0) / subjectTotals.principal : 0;
    const billInterestRatio = subjectTotals.interest > 0 ? (bill.interest || 0) / subjectTotals.interest : 0;
    const billPenaltyRatio = subjectTotals.penalty > 0 ? (bill.penalty || 0) / subjectTotals.penalty : 0;

    const principalReduction = allocatedBreakdown.principal * billPrincipalRatio;
    const interestReduction = allocatedBreakdown.interest * billInterestRatio;
    const penaltyReduction = allocatedBreakdown.penalty * billPenaltyRatio;

    const billReduction = principalReduction + interestReduction + penaltyReduction;
    const billFinal = bill.amount - billReduction;

    return {
      billNumber: bill.billNumber,
      installments: bill.installments,
      originalAmount: bill.amount,
      principal: bill.principal || 0,
      interest: bill.interest || 0,
      penalty: bill.penalty || 0,
      reductionAmount: billReduction,
      reductionBreakdown: {
        principal: principalReduction,
        interest: interestReduction,
        penalty: penaltyReduction,
      },
      finalAmount: billFinal,
    };
  });

  return { allocatedBreakdown, billDetails };
}

export function settlePayment(
  billDetails: BillDetail[],
  paidAmount: number
): SettlementResult {
  const sortedBills = [...billDetails].sort((a, b) => {
    const instA = parseInt(a.installments.replace(/[^0-9]/g, '')) || 0;
    const instB = parseInt(b.installments.replace(/[^0-9]/g, '')) || 0;
    return instA - instB;
  });

  const settledBills: BillDetail[] = [];
  let remainingAmount = paidAmount;

  for (const bill of sortedBills) {
    if (remainingAmount <= 0) break;

    const reductionApplied = bill.reductionAmount;
    const effectivePrincipal = bill.principal - bill.reductionBreakdown.principal;
    const effectiveInterest = bill.interest - bill.reductionBreakdown.interest;
    const effectivePenalty = bill.penalty - bill.reductionBreakdown.penalty;
    const totalEffective = effectivePrincipal + effectiveInterest + effectivePenalty;

    if (remainingAmount >= totalEffective) {
      settledBills.push({
        ...bill,
        finalAmount: 0,
        reductionAmount: reductionApplied,
      });
      remainingAmount -= totalEffective;
    } else {
      let remaining = remainingAmount;
      const settledPrincipal = Math.min(effectivePrincipal, remaining);
      remaining -= settledPrincipal;
      const settledInterest = Math.min(effectiveInterest, remaining);
      remaining -= settledInterest;
      const settledPenalty = Math.min(effectivePenalty, remaining);

      settledBills.push({
        ...bill,
        finalAmount: totalEffective - (settledPrincipal + settledInterest + settledPenalty),
        reductionAmount: reductionApplied,
      });
      remainingAmount = 0;
    }
  }

  return {
    totalPaid: paidAmount - remainingAmount,
    remainingAmount,
    settledBills,
  };
}

export function calculateSubjectTotals(bills: Bill[]): SubjectAmount {
  return bills.reduce(
    (acc, bill) => ({
      principal: acc.principal + (bill.principal || 0),
      interest: acc.interest + (bill.interest || 0),
      penalty: acc.penalty + (bill.penalty || 0),
    }),
    { principal: 0, interest: 0, penalty: 0 }
  );
}
