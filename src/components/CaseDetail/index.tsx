import React, { useState, useMemo, useCallback } from 'react';
import { 
  Card, 
  Tabs, 
  Button, 
  Tag, 
  Avatar, 
  Space, 
  List,
  Divider,
  Badge,
  Table,
  message,
  Modal,
  Select,
  Input,
  DatePicker,
  Checkbox,
  InputNumber,
  Radio
} from 'antd';
import { 
  UserOutlined, 
  PhoneOutlined,
  MessageOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  SendOutlined,
  CalendarOutlined,
  RightOutlined,
  PlayCircleOutlined,
  CopyOutlined,
  DownloadOutlined,
  EyeOutlined,
  PlusOutlined,
  CreditCardOutlined,
  ShoppingCartOutlined,
  WalletOutlined,
  DownOutlined,
  UpOutlined
} from '@ant-design/icons';
import { useLanguage } from '../../i18n/LanguageContext';
import { ReductionRule, ReductionType } from '../../types';
import { findMatchingRule, calculateMaxReduction, allocateReduction } from '../../utils/reductionCalc';

// 银行logo映射
const bankLogos: Record<string, string> = {
  BNI: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=BNI%20bank%20logo%20Indonesia%20simple%20icon&image_size=square',
  BSI: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=BSI%20bank%20logo%20Indonesia%20simple%20icon&image_size=square',
  BRI: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=BRI%20bank%20logo%20Indonesia%20simple%20icon&image_size=square',
  Mandiri: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Mandiri%20bank%20logo%20Indonesia%20simple%20icon&image_size=square',
  BSS: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=BSS%20bank%20logo%20Indonesia%20simple%20icon&image_size=square',
};

// 渠道商列表
// 银行列表
const banks = [
  { code: 'BNI', name: 'BNI', logo: bankLogos.BNI },
  { code: 'BSI', name: 'BSI', logo: bankLogos.BSI },
  { code: 'BRI', name: 'BRI', logo: bankLogos.BRI },
  { code: 'Mandiri', name: 'Mandiri', logo: bankLogos.Mandiri },
  { code: 'BSS', name: 'BSS', logo: bankLogos.BSS },
];

interface Bill {
  id: string;
  orderId: string;
  billNumber: string;
  installments: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: 'paid' | 'unpaid' | 'overdue';
  penalty?: number;
  serviceFee?: number;
  interest?: number;
  principal?: number;
}

interface VAInfo {
  id: string;
  billIds: string[];
  amount: number;
  channel: 'VA' | 'Alfamart';
  bank?: string;
  vaNumber: string;
  status: 'active' | 'expired' | 'used';
  createdAt: string;
  expiresAt: string;
}

interface WarningLetter {
  id: string;
  title: string;
  sentDate: string;
  status: 'sent' | 'delivered' | 'opened';
  previewUrl: string;
}

interface Contact {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  type: 'mobile' | 'whatsapp' | 'company';
  source: string;
  createdAt: string;
}

const formatIDR = (amount: number): string => {
  return amount.toLocaleString('id-ID');
};

interface CaseDetailProps {
  caseId: string;
  onBack: () => void;
}

interface PersonalInfo {
  fullName: string;
  nik: string;
  gender: string;
  age: number;
  maritalStatus: string;
  education: string;
  mothersName: string;
  noOfDependants: number;
}

interface ResidenceInfo {
  province: string;
  city: string;
  district: string;
  subDistrict: string;
  fullAddress: string;
  postalCode: string;
  residenceStatus: string;
  lengthOfStay: string;
}

interface EmploymentInfo {
  companyName: string;
  industry: string;
  position: string;
  department: string;
  monthlySalary: number;
  workingPeriod: string;
  companyAddress: string;
}

interface CaseSummary {
  loanType: string;
  loanAmount: number;
  disbursementDate: string;
  dueDate: string;
  daysPastDue: number;
  caseStatus: string;
  lastPaymentDate: string;
  nextAction: string;
}

interface Activity {
  id: string;
  type: string;
  content: string;
  time: string;
  user: string;
  icon: React.ReactNode;
}

// 案件流转记录
interface CaseTransferRecord {
  id: string;
  transferTime: string;
  fromCollector: string;
  toCollector: string;
  reason: string;
  transferType: 'auto' | 'manual' | 'system';
  operator?: string;
}

const CaseDetail: React.FC<CaseDetailProps> = ({ caseId }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [detailModalActiveTab, setDetailModalActiveTab] = useState<string>('personal');
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [callModalVisible, setCallModalVisible] = useState<boolean>(false);
  const { t } = useLanguage();

  // 模拟数据
  const personalInfo: PersonalInfo = {
    fullName: 'EZI SADRAKH SAPUTRA',
    nik: '2171120802069008',
    gender: 'Male',
    age: 20,
    maritalStatus: 'Single',
    education: 'Senior High School',
    mothersName: 'SRI WAHYUNI',
    noOfDependants: 0,
  };

  const residenceInfo: ResidenceInfo = {
    province: 'Jawa Barat',
    city: 'Kota Bandung',
    district: 'Cibiru',
    subDistrict: 'Ciburuying Kaler',
    fullAddress: 'Jl. Sukajadi No. 123, Bandung',
    postalCode: '40161',
    residenceStatus: 'Family Own',
    lengthOfStay: '3 Years 2 Months',
  };

  const employmentInfo: EmploymentInfo = {
    companyName: 'PT. Maju Bersama',
    industry: 'Retail',
    position: 'Sales Staff',
    department: 'Sales',
    monthlySalary: 4500000,
    workingPeriod: '1 Year 6 Months',
    companyAddress: 'Jl. Asia Afrika No. 45, Bandung',
  };

  const caseSummary: CaseSummary = {
    loanType: 'Personal Loan',
    loanAmount: 25000000,
    disbursementDate: '12 Jan 2024',
    dueDate: '12 Jan 2025',
    daysPastDue: 12,
    caseStatus: 'Open',
    lastPaymentDate: '',
    nextAction: 'Call Customer',
  };

  const activities: Activity[] = [
    { 
      id: '1', 
      type: 'Outgoing Call', 
      content: 'Connected with customer', 
      time: '10 May 2024, 10:30', 
      user: 'Dewi Anggraini',
      icon: <PhoneOutlined style={{ color: '#22c55e' }} />
    },
    { 
      id: '2', 
      type: 'Note Added', 
      content: 'Customer promised to pay next week', 
      time: '9 May 2024, 15:20', 
      user: 'Dewi Anggraini',
      icon: <FileTextOutlined style={{ color: '#f97316' }} />
    },
    { 
      id: '3', 
      type: 'Note Added', 
      content: 'Customer promised to pay next week', 
      time: '9 May 2024, 14:55', 
      user: 'Dewi Anggraini',
      icon: <FileTextOutlined style={{ color: '#f97316' }} />
    },
    { 
      id: '4', 
      type: 'SMS Sent', 
      content: 'Payment reminder SMS has been sent', 
      time: '9 May 2024, 10:15', 
      user: 'System',
      icon: <SendOutlined style={{ color: '#3b82f6' }} />
    },
  ];

  const paymentHistory = [
    { key: '1', date: '15 Apr 2024', billNumber: 'INV-2024-0415', installments: 'Month 4', amount: 2000000, channel: 'BCA Virtual Account', method: 'VA', paymentCode: '1234567890', transactionNo: 'TXN-20240415-0001' },
    { key: '2', date: '15 Mar 2024', billNumber: 'INV-2024-0215, INV-2024-0315', installments: 'Month 2-3', amount: 4000000, channel: 'Mandiri Virtual Account', method: 'VA', paymentCode: '0987654321', transactionNo: 'TXN-20240315-0002' },
    { key: '3', date: '15 Feb 2024', billNumber: 'INV-2024-0215', installments: 'Month 2', amount: 2000000, channel: 'Alfamart', method: 'Alfamart', paymentCode: 'AFM-20240215', transactionNo: 'TXN-20240215-0003' },
    { key: '4', date: '15 Jan 2024', billNumber: 'INV-2024-0115', installments: 'Month 1', amount: 2000000, channel: 'BCA Virtual Account', method: 'VA', paymentCode: '1122334455', transactionNo: 'TXN-20240115-0004' },
  ];

  // 案件流转记录数据
  const transferRecords: CaseTransferRecord[] = [
    { 
      id: 'TR001', 
      transferTime: '10 May 2024, 09:30', 
      fromCollector: 'Budi Santoso', 
      toCollector: 'Dewi Anggraini', 
      reason: 'Workload rebalancing - collector rotation',
      transferType: 'manual',
      operator: 'Ahmad Rizal (Supervisor)'
    },
    { 
      id: 'TR002', 
      transferTime: '25 Apr 2024, 14:15', 
      fromCollector: 'Siti Aminah', 
      toCollector: 'Budi Santoso', 
      reason: 'Collector on leave - temporary assignment',
      transferType: 'manual',
      operator: 'Ahmad Rizal (Supervisor)'
    },
    { 
      id: 'TR003', 
      transferTime: '15 Apr 2024, 08:00', 
      fromCollector: 'System', 
      toCollector: 'Siti Aminah', 
      reason: 'New case assignment - auto allocation',
      transferType: 'auto'
    },
    { 
      id: 'TR004', 
      transferTime: '01 Apr 2024, 16:45', 
      fromCollector: 'Dewi Anggraini', 
      toCollector: 'System', 
      reason: 'Case returned to pool - performance issue',
      transferType: 'system'
    },
    { 
      id: 'TR005', 
      transferTime: '20 Mar 2024, 11:20', 
      fromCollector: 'Rudi Hartono', 
      toCollector: 'Dewi Anggraini', 
      reason: 'Specialist assignment - difficult case',
      transferType: 'manual',
      operator: 'Ahmad Rizal (Supervisor)'
    },
  ];

  // 账单数据 - 模拟2笔6期的订单（测试数据：多期未还款，便于测试期次多选和金额调整）
  const bills: Bill[] = [
    // 订单1: ORD001 (6期) - 前2期已还，后4期逾期/未还
    { id: 'B001', orderId: 'ORD001', billNumber: 'INV-2024-0115', installments: 'Installment 1', dueDate: '15 Jan 2024', amount: 2500000, paidAmount: 2500000, status: 'paid', principal: 2000000, interest: 300000, serviceFee: 150000, penalty: 50000 },
    { id: 'B002', orderId: 'ORD001', billNumber: 'INV-2024-0215', installments: 'Installment 2', dueDate: '15 Feb 2024', amount: 2500000, paidAmount: 2500000, status: 'paid', principal: 2000000, interest: 300000, serviceFee: 150000, penalty: 50000 },
    { id: 'B003', orderId: 'ORD001', billNumber: 'INV-2024-0315', installments: 'Installment 3', dueDate: '15 Mar 2024', amount: 2500000, paidAmount: 0, status: 'overdue', principal: 2000000, interest: 300000, serviceFee: 150000, penalty: 50000 },
    { id: 'B004', orderId: 'ORD001', billNumber: 'INV-2024-0415', installments: 'Installment 4', dueDate: '15 Apr 2024', amount: 2500000, paidAmount: 0, status: 'overdue', principal: 2000000, interest: 300000, serviceFee: 150000, penalty: 50000 },
    { id: 'B005', orderId: 'ORD001', billNumber: 'INV-2024-0515', installments: 'Installment 5', dueDate: '15 May 2024', amount: 2800000, paidAmount: 0, status: 'overdue', principal: 2200000, interest: 350000, serviceFee: 180000, penalty: 70000 },
    { id: 'B006', orderId: 'ORD001', billNumber: 'INV-2024-0615', installments: 'Installment 6', dueDate: '15 Jun 2024', amount: 2800000, paidAmount: 0, status: 'unpaid', principal: 2200000, interest: 350000, serviceFee: 180000, penalty: 70000 },
    
    // 订单2: ORD002 (6期) - 全部未还，便于测试多选
    { id: 'B007', orderId: 'ORD002', billNumber: 'INV-2024-0701', installments: 'Installment 1', dueDate: '01 Jul 2024', amount: 3000000, paidAmount: 0, status: 'overdue', principal: 2400000, interest: 360000, serviceFee: 180000, penalty: 60000 },
    { id: 'B008', orderId: 'ORD002', billNumber: 'INV-2024-0801', installments: 'Installment 2', dueDate: '01 Aug 2024', amount: 3000000, paidAmount: 0, status: 'overdue', principal: 2400000, interest: 360000, serviceFee: 180000, penalty: 60000 },
    { id: 'B009', orderId: 'ORD002', billNumber: 'INV-2024-0901', installments: 'Installment 3', dueDate: '01 Sep 2024', amount: 3000000, paidAmount: 0, status: 'unpaid', principal: 2400000, interest: 360000, serviceFee: 180000, penalty: 60000 },
    { id: 'B010', orderId: 'ORD002', billNumber: 'INV-2024-1001', installments: 'Installment 4', dueDate: '01 Oct 2024', amount: 3000000, paidAmount: 0, status: 'unpaid', principal: 2400000, interest: 360000, serviceFee: 180000, penalty: 60000 },
    { id: 'B011', orderId: 'ORD002', billNumber: 'INV-2024-1101', installments: 'Installment 5', dueDate: '01 Nov 2024', amount: 3200000, paidAmount: 0, status: 'unpaid', principal: 2500000, interest: 400000, serviceFee: 200000, penalty: 100000 },
    { id: 'B012', orderId: 'ORD002', billNumber: 'INV-2024-1201', installments: 'Installment 6', dueDate: '01 Dec 2024', amount: 3200000, paidAmount: 0, status: 'unpaid', principal: 2500000, interest: 400000, serviceFee: 200000, penalty: 100000 },
  ];

  // VA码数据
  const vaList: VAInfo[] = [
    { id: 'VA001', billIds: ['B001'], amount: 2200000, channel: 'VA', bank: 'BNI', vaNumber: '8881234567890', status: 'active', createdAt: '10 May 2024', expiresAt: '10 Jun 2024' },
    { id: 'VA002', billIds: ['B002'], amount: 2200000, channel: 'Alfamart', vaNumber: 'ALF-20240510-001', status: 'active', createdAt: '10 May 2024', expiresAt: '10 Jun 2024' },
    { id: 'VA003', billIds: ['B001'], amount: 2200000, channel: 'VA', bank: 'Mandiri', vaNumber: '9990987654321', status: 'used', createdAt: '05 May 2024', expiresAt: '05 Jun 2024' },
  ];

  // 警告信数据
  const warningLetters: WarningLetter[] = [
    { id: 'WL001', title: 'First Warning Letter', sentDate: '08 May 2024', status: 'delivered', previewUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=warning%20letter%20document%20formal%20collection%20notice&image_size=landscape_4_3' },
    { id: 'WL002', title: 'Second Warning Letter', sentDate: '10 May 2024', status: 'opened', previewUrl: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=second%20warning%20letter%20final%20notice%20legal%20document&image_size=landscape_4_3' },
  ];

  // 联系人数据
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 'C001', name: 'SRI WAHYUNI', relationship: 'Mother', phoneNumber: '0812 3456 7890', type: 'mobile', source: 'Application Form', createdAt: '12 Jan 2024' },
    { id: 'C002', name: 'PT. Maju Bersama', relationship: 'Company', phoneNumber: '022 1234 5678', type: 'company', source: 'Employment Info', createdAt: '12 Jan 2024' },
    { id: 'C003', name: 'JOHN DOE', relationship: 'Colleague', phoneNumber: '0878 1234 5678', type: 'whatsapp', source: 'Customer Provided', createdAt: '15 Feb 2024' },
    { id: 'C004', name: 'ANNA SMITH', relationship: 'Emergency', phoneNumber: '0813 9876 5432', type: 'mobile', source: 'Application Form', createdAt: '12 Jan 2024' },
  ]);

  // 减免申请记录类型
  type ReductionApplicationStatus = 'pending' | 'approved' | 'rejected' | 'completed';

  interface ReductionApplication {
    id: string;
    applicationId: string;
    billIds: string[];
    totalAmount: number;
    requestedReduction: number;
    approvedReduction: number;
    reason: string;
    status: ReductionApplicationStatus;
    applyTime: string;
    reviewer?: string;
    reviewTime?: string;
    reviewComment?: string;
    paymentCode?: string;
    paymentTime?: string;
    completedTime?: string;
  }

  // 减免申请记录（模拟）- 覆盖整个流程状态
  const [reductionApplications, setReductionApplications] = useState<ReductionApplication[]>([
    // 状态1: Pending - 待审核（可测试审核流程）
    {
      id: 'RA001',
      applicationId: 'RED-20240525-001',
      billIds: ['B005', 'B006'],
      totalAmount: 4400000,
      requestedReduction: 660000,
      approvedReduction: 0,
      reason: 'Customer experienced job loss and unable to pay full amount',
      status: 'pending',
      applyTime: '25 May 2024, 10:30',
    },
    // 状态2: Approved - 已批准但未生成还款码（可测试生成还款码）
    {
      id: 'RA002',
      applicationId: 'RED-20240524-001',
      billIds: ['B007', 'B008'],
      totalAmount: 3600000,
      requestedReduction: 540000,
      approvedReduction: 540000,
      reason: 'Customer has medical emergency, approved full reduction request',
      status: 'approved',
      applyTime: '24 May 2024, 15:45',
      reviewTime: '24 May 2024, 16:30',
      reviewer: 'Ahmad Rizal (Supervisor)',
      reviewComment: 'Approved as per M2 reduction rules',
    },
    // 状态3: Approved + Payment Code - 已批准且生成还款码（可测试确认还款）
    {
      id: 'RA003',
      applicationId: 'RED-20240520-001',
      billIds: ['B009', 'B010', 'B011'],
      totalAmount: 5400000,
      requestedReduction: 810000,
      approvedReduction: 700000,
      reason: 'Customer negotiated for partial reduction',
      status: 'approved',
      applyTime: '20 May 2024, 09:15',
      reviewTime: '20 May 2024, 11:00',
      reviewer: 'Ahmad Rizal (Supervisor)',
      reviewComment: 'Approved 700K reduction based on customer situation',
      paymentCode: 'VA-20240521-001',
    },
    // 状态4: Completed - 已完成（用户已还款，案件平账）
    {
      id: 'RA004',
      applicationId: 'RED-20240515-001',
      billIds: ['B005'],
      totalAmount: 2200000,
      requestedReduction: 330000,
      approvedReduction: 300000,
      reason: 'Customer paid early, granted small reduction',
      status: 'completed',
      applyTime: '15 May 2024, 14:00',
      reviewTime: '15 May 2024, 14:30',
      reviewer: 'Ahmad Rizal (Supervisor)',
      reviewComment: 'Approved for early payment incentive',
      paymentCode: 'VA-20240515-001',
      paymentTime: '16 May 2024, 09:20',
      completedTime: '16 May 2024, 09:25',
    },
    // 状态5: Rejected - 已驳回（可测试驳回流程）
    {
      id: 'RA005',
      applicationId: 'RED-20240518-001',
      billIds: ['B012'],
      totalAmount: 1800000,
      requestedReduction: 270000,
      approvedReduction: 0,
      reason: 'Customer wants reduction without valid reason',
      status: 'rejected',
      applyTime: '18 May 2024, 11:20',
      reviewTime: '18 May 2024, 13:00',
      reviewer: 'Ahmad Rizal (Supervisor)',
      reviewComment: 'Rejected - no valid reason provided, bill not overdue yet',
    },
  ]);

  // 减免规则（模拟）
  const reductionRules: ReductionRule[] = [
    { id: 'R1', name: '消费贷-结清-30天', products: ['消费贷'], overdueDays: 30, settlementType: 'settle', subjectCaps: { principal: 0, interest: 50, penalty: 100 }, enabled: true, createTime: '2024-03-01 10:00:00', createBy: 'admin', updateTime: '2024-03-01 10:00:00', updateBy: 'admin' },
    { id: 'R2', name: '消费贷-结清-90天', products: ['消费贷'], overdueDays: 90, settlementType: 'settle', subjectCaps: { principal: 10, interest: 70, penalty: 100 }, enabled: true, createTime: '2024-03-01 10:00:00', createBy: 'admin', updateTime: '2024-03-01 10:00:00', updateBy: 'admin' },
    { id: 'R3', name: '消费贷-非结清-30天', products: ['消费贷'], overdueDays: 30, settlementType: 'nonSettle', subjectCaps: { principal: 0, interest: 30, penalty: 50 }, enabled: true, createTime: '2024-03-01 10:00:00', createBy: 'admin', updateTime: '2024-03-01 10:00:00', updateBy: 'admin' },
    { id: 'R4', name: '消费贷-非结清-90天', products: ['消费贷'], overdueDays: 90, settlementType: 'nonSettle', subjectCaps: { principal: 0, interest: 50, penalty: 70 }, enabled: true, createTime: '2024-03-01 10:00:00', createBy: 'admin', updateTime: '2024-03-01 10:00:00', updateBy: 'admin' },
  ];

  // 当前产品
  const currentProduct = '消费贷';

  // 逾期天数
  const overdueDays = 45;

  // 减免类型
  const [reductionType, setReductionType] = useState<ReductionType>('nonSettle');

  // 请求减免金额
  const [requestedReduction, setRequestedReduction] = useState<number>(0);

  // 减免申请理由
  const [reductionReason, setReductionReason] = useState<string>('');

  // 状态管理
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedBills, setSelectedBills] = useState<string[]>([]);
  const [vaModalVisible, setVaModalVisible] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<'VA' | 'Alfamart'>('VA');
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [reductionModalVisible, setReductionModalVisible] = useState(false);
  const [previewLetterUrl, setPreviewLetterUrl] = useState<string | null>(null);
  const [addContactModalVisible, setAddContactModalVisible] = useState(false);
  
  // 订单折叠状态管理
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set(['ORD001'])); // 默认展开第一个订单
  
  // 切换订单折叠状态
  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  // 获取选中账单对应的账单数据
  const getSelectedBills = useMemo(() => {
    return selectedBills.map(billId => {
      const bill = bills.find(b => b.id === billId);
      return bill;
    }).filter(Boolean) as typeof bills;
  }, [selectedBills, bills]);

  // 计算最大可减免金额
  const reductionCalculation = useMemo(() => {
    if (getSelectedBills.length === 0) {
      return { maxReduction: 0, breakdown: { principal: 0, interest: 0, penalty: 0 }, billDetails: [], appliedRule: null };
    }

    if (reductionType === 'settle') {
      const matchingRule = findMatchingRule(reductionRules, currentProduct, overdueDays, 'settle');
      if (matchingRule) {
        const { maxReduction, breakdown, billDetails } = calculateMaxReduction(getSelectedBills, matchingRule);
        return { maxReduction, breakdown, billDetails, appliedRule: matchingRule };
      }
    } else if (reductionType === 'nonSettle') {
      const matchingRule = findMatchingRule(reductionRules, currentProduct, overdueDays, 'nonSettle');
      if (matchingRule) {
        const { maxReduction, breakdown, billDetails } = calculateMaxReduction(getSelectedBills, matchingRule);
        return { maxReduction, breakdown, billDetails, appliedRule: matchingRule };
      }
    }

    return { maxReduction: 0, breakdown: { principal: 0, interest: 0, penalty: 0 }, billDetails: [], appliedRule: null };
  }, [getSelectedBills, reductionType, currentProduct, overdueDays]);

  // 计算减免后应还总额
  const selectedTotal = useMemo(() => {
    return getSelectedBills.reduce((sum, bill) => sum + bill.amount, 0);
  }, [getSelectedBills]);

  const afterReductionTotal = useMemo(() => {
    return Math.max(0, selectedTotal - requestedReduction);
  }, [selectedTotal, requestedReduction]);

  // 获取分配后的减免明细
  const allocatedDetails = useMemo(() => {
    if ((reductionType === 'settle' || reductionType === 'nonSettle') && reductionCalculation.appliedRule) {
      const rule = reductionCalculation.appliedRule as ReductionRule;
      return allocateReduction(getSelectedBills, rule, requestedReduction);
    }
    return null;
  }, [getSelectedBills, reductionType, requestedReduction]);

  // 检查是否符合减免条件（必须有账单被选中）
  const canApplyReduction = useMemo(() => {
    if (selectedBills.length === 0) return false;
    return true;
  }, [selectedBills]);

  // 判断是否选中了某一订单的全部未结清账单
  const isAllUnpaidSelected = useMemo(() => {
    if (selectedBills.length === 0) return false;
    
    const selectedBillObjs = selectedBills.map(id => bills.find(b => b.id === id)).filter(Boolean);
    if (selectedBillObjs.length === 0) return false;
    
    const orders = new Set(selectedBillObjs.map(b => b!.orderId));
    if (orders.size !== 1) return false;
    
    const selectedOrderId = orders.values().next().value;
    const orderUnpaidBills = bills.filter(b => b.orderId === selectedOrderId && b.status !== 'paid');
    
    if (orderUnpaidBills.length === 0) return false;
    
    const selectedBillSet = new Set(selectedBills);
    return orderUnpaidBills.every(bill => selectedBillSet.has(bill.id));
  }, [selectedBills, bills]);

  // 获取有效VA码
  const activeVA = useMemo(() => vaList.filter(va => va.status === 'active'), [vaList]);

  // 计算选中账单的总额
  const selectedBillsTotal = useMemo(() => {
    return selectedBills.reduce((sum, billId) => {
      const bill = bills.find(b => b.id === billId);
      return sum + (bill?.amount || 0);
    }, 0);
  }, [selectedBills, bills]);

  // 处理账单选择（确保选择最早的未结清账单及后续账单）
  const handleBillSelection = useCallback((billId: string) => {
    const billIndex = bills.findIndex(b => b.id === billId);
    if (billIndex === -1) return;

    setSelectedBills(prev => {
      if (prev.includes(billId)) {
        const selectedIndex = prev.indexOf(billId);
        return prev.slice(0, selectedIndex);
      } else {
        const unpaidStartIndex = bills.findIndex(b => b.status !== 'paid');
        if (unpaidStartIndex === -1) return prev;
        const newSelected = bills.slice(unpaidStartIndex, billIndex + 1).map(b => b.id);
        return newSelected;
      }
    });
  }, [bills]);

  // 创建VA码
  const handleCreateVA = useCallback(() => {
    if (selectedBills.length === 0) {
      message.warning('请先选择账单');
      return;
    }
    
    const selectedOrders = new Set(selectedBills.map(billId => {
      const bill = bills.find(b => b.id === billId);
      return bill?.orderId;
    }));
    
    if (selectedOrders.size > 1) {
      message.error('不允许跨订单创建VA码，请只选择同一订单的账单');
      return;
    }
    
    if (selectedChannel === 'VA' && !selectedBank) {
      message.warning('请选择银行');
      return;
    }
    message.success(`VA码创建成功！金额: ${formatIDR(selectedBillsTotal)} IDR`);
    setVaModalVisible(false);
    setSelectedBills([]);
    setSelectedBank('');
  }, [selectedBills, bills, selectedChannel, selectedBank, selectedBillsTotal]);

  // 申请减免
  const handleApplyReduction = useCallback(() => {
    if (selectedBills.length === 0) {
      message.error('请选择要申请减免的账单');
      return;
    }
    
    const selectedBillIds = selectedBills;
    
    const selectedOrders = new Set(selectedBillIds.map(billId => {
      const bill = bills.find(b => b.id === billId);
      return bill?.orderId;
    }));
    
    if (selectedOrders.size > 1) {
      message.error('不允许跨订单申请减免，请只选择同一订单的期次');
      return;
    }
    
    if (!reductionReason.trim()) {
      message.error('请填写减免申请理由');
      return;
    }
    
    if (requestedReduction === 0) {
      message.error('请输入减免金额');
      return;
    }

    if (requestedReduction > reductionCalculation.maxReduction) {
      message.error(`超出最大可减免额度，最大可减免 ${formatIDR(reductionCalculation.maxReduction)} IDR`);
      return;
    }

    const newApplication: ReductionApplication = {
      id: `RA${Date.now()}`,
      applicationId: `RED-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
      billIds: selectedBillIds,
      totalAmount: selectedTotal,
      requestedReduction,
      approvedReduction: 0,
      reason: reductionReason,
      status: 'pending',
      applyTime: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' +
                 new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    };

    setReductionApplications(prev => [newApplication, ...prev]);
    setReductionReason('');
    setRequestedReduction(0);
    setReductionType('nonSettle');
    message.success(`减免申请提交成功！申请编号: ${newApplication.applicationId}`);
    setReductionModalVisible(false);
  }, [selectedBills, bills, reductionReason, requestedReduction, reductionType, selectedTotal, reductionCalculation]);

  const images = [
    { id: '1', name: 'KTP (身份证)', type: '证件', url: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Indonesian%20KTP%20identity%20card%20front%20view%20official%20document&image_size=portrait_4_3' },
    { id: '2', name: 'Selfie with KTP', type: '证件', url: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Person%20holding%20Indonesian%20ID%20card%20for%20verification%20selfie&image_size=portrait_4_3' },
    { id: '3', name: 'Bank Statement', type: '财务', url: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Indonesian%20bank%20statement%20document%20financial%20record&image_size=landscape_4_3' },
    { id: '4', name: 'Salary Slip', type: '收入证明', url: 'https://neeko-copilot.bytedance.net/api/text2image?prompt=Salary%20slip%20payroll%20document%20Indonesian%20format&image_size=landscape_4_3' },
  ];

  const tabsItems = useMemo(() => [
    {
      key: 'overview',
      label: t.overview,
      children: (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
          {/* Case Summary */}
          <div style={{ gridColumn: 'span 1' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>{t.caseSummary}</h3>
            <div style={{ backgroundColor: '#f9fafb', borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ color: '#6b7280', fontSize: '13px' }}>{t.loanType}</span>
                <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>{caseSummary.loanType}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ color: '#6b7280', fontSize: '13px' }}>{t.loanAmount}</span>
                <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>{caseSummary.loanAmount.toLocaleString()} IDR</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ color: '#6b7280', fontSize: '13px' }}>{t.disbursementDate}</span>
                <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>{caseSummary.disbursementDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ color: '#6b7280', fontSize: '13px' }}>{t.dueDate}</span>
                <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>{caseSummary.dueDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ color: '#6b7280', fontSize: '13px' }}>{t.daysPastDue}</span>
                <Tag color="red" style={{ fontSize: '12px' }}>{caseSummary.daysPastDue} {t.day}</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ color: '#6b7280', fontSize: '13px' }}>{t.caseStatus}</span>
                <Tag color="green" style={{ fontSize: '12px' }}>{caseSummary.caseStatus}</Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ color: '#6b7280', fontSize: '13px' }}>{t.lastPaymentDate}</span>
                <span style={{ color: '#9ca3af', fontSize: '13px', fontStyle: 'italic' }}>{t.na}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                <span style={{ color: '#6b7280', fontSize: '13px' }}>{t.nextAction}</span>
                <span style={{ color: '#0d4f3c', fontSize: '13px', fontWeight: '500' }}>{caseSummary.nextAction}</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{t.recentActivity}</h3>
              <Button 
                type="text" 
                style={{ color: '#0d4f3c', fontSize: '12px', padding: '0' }}
                onClick={() => setActiveTab('collection')}
              >
                {t.viewAllActivity}
              </Button>
            </div>
            <List
              dataSource={activities}
              renderItem={(item) => (
                <List.Item 
                  key={item.id}
                  style={{ 
                    padding: '12px 0', 
                    borderBottom: '1px solid #f3f4f6',
                    marginBottom: '0'
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '50%', 
                      backgroundColor: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: '500', color: '#1f2937' }}>{item.type}</span>
                        <span style={{ fontSize: '11px', color: '#9ca3af' }}>{item.time}</span>
                      </div>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>{item.content}</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#9ca3af' }}>by {item.user}</p>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </div>

          {/* Next Action */}
          <div style={{ gridColumn: 'span 1' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>Next Action</h3>
            <div 
              style={{ 
                backgroundColor: '#f0fdf4', 
                borderRadius: '10px', 
                padding: '20px',
                border: '1px solid #86efac'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  borderRadius: '12px', 
                  backgroundColor: '#0d4f3c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <PhoneOutlined style={{ color: '#ffffff', fontSize: '20px' }} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>Call Customer</h4>
                  <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>Follow up payment commitment</p>
                </div>
              </div>
              <Button 
                type="primary" 
                block
                icon={<PhoneOutlined />}
                style={{ borderRadius: '8px', marginBottom: '16px' }}
              >
                Start Call
              </Button>
              <Divider style={{ margin: '16px 0' }} />
              <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <CalendarOutlined style={{ color: '#0d4f3c' }} />
                  <span style={{ fontSize: '12px', fontWeight: '500', color: '#1f2937' }}>Scheduled Follow-up</span>
                </div>
                <p style={{ margin: '0', fontSize: '14px', fontWeight: '600', color: '#0d4f3c' }}>14 May 2024, 10:00</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>by Dewi Anggraini</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'loan',
      label: 'Loan Details',
      children: (
        <div style={{ backgroundColor: '#f9fafb', borderRadius: '10px', padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '12px' }}>LOAN INFORMATION</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ color: '#6b7280', fontSize: '13px' }}>Loan Type</span>
                <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>Personal Loan</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ color: '#6b7280', fontSize: '13px' }}>Loan Amount</span>
                <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>{formatIDR(25000000)} IDR</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ color: '#6b7280', fontSize: '13px' }}>Interest Rate</span>
                <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>2.95% per month</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                <span style={{ color: '#6b7280', fontSize: '13px' }}>Tenor</span>
                <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>12 Months</span>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#6b7280', marginBottom: '12px' }}>DISBURSEMENT INFORMATION</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ color: '#6b7280', fontSize: '13px' }}>Disbursement Date</span>
                <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>12 January 2024</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ color: '#6b7280', fontSize: '13px' }}>Disbursement Amount</span>
                <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>{formatIDR(25000000)} IDR</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                <span style={{ color: '#6b7280', fontSize: '13px' }}>Bank Name</span>
                <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>Bank BCA</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                <span style={{ color: '#6b7280', fontSize: '13px' }}>Account Number</span>
                <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>1234567890</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'repayment',
      label: t.repaymentHistory,
      children: (
        <Table
          dataSource={paymentHistory}
          columns={[
            { title: t.paymentDate, dataIndex: 'date', key: 'date', width: '120px' },
            { title: t.billNumber, dataIndex: 'billNumber', key: 'billNumber', width: '150px' },
            { title: t.installments, dataIndex: 'installments', key: 'installments', width: '120px' },
            { 
              title: t.amount, 
              dataIndex: 'amount', 
              key: 'amount', 
              width: '150px',
              render: (amount: number) => <span style={{ fontWeight: '500', color: '#0d4f3c' }}>{formatIDR(amount)} IDR</span>
            },
            { title: t.paymentChannel, dataIndex: 'channel', key: 'channel', width: '150px' },
            { 
              title: t.paymentMethod, 
              dataIndex: 'method', 
              key: 'method', 
              width: '120px',
              render: (method: string) => <Tag color={method === 'VA' ? 'blue' : 'orange'}>{method}</Tag>
            },
            { title: t.paymentCode, dataIndex: 'paymentCode', key: 'paymentCode', width: '150px' },
            { 
              title: t.transactionNo, 
              dataIndex: 'transactionNo', 
              key: 'transactionNo', 
              width: '180px',
              render: (no: string) => <span style={{ fontFamily: 'monospace', color: '#0d4f3c', fontWeight: '500' }}>{no}</span>
            },
          ]}
          pagination={false}
          size="middle"
          scroll={{ x: 1200 }}
        />
      ),
    },
    {
      key: 'collection',
      label: t.collectionRecords,
      children: (
        <Table
          dataSource={[
            { key: '1', date: '10 May 2024', collector: 'Dewi Anggraini', method: 'Call', result: 'Connected', duration: '5 min 30 sec', recording: true, note: 'Promised to pay next week' },
            { key: '2', date: '08 May 2024', collector: 'Dewi Anggraini', method: 'SMS', result: 'Sent', duration: '-', recording: false, note: 'Payment reminder' },
            { key: '3', date: '05 May 2024', collector: 'Dewi Anggraini', method: 'Call', result: 'No Answer', duration: '-', recording: false, note: 'Called 3 times, no answer' },
            { key: '4', date: '03 May 2024', collector: 'Dewi Anggraini', method: 'Call', result: 'Connected', duration: '3 min 15 sec', recording: true, note: 'Discussed payment plan' },
            { key: '5', date: '01 May 2024', collector: 'Dewi Anggraini', method: 'SMS', result: 'Sent', duration: '-', recording: false, note: 'Initial reminder' },
          ]}
          columns={[
            { title: t.paymentDate, dataIndex: 'date', key: 'date', width: '150px' },
            { title: t.collector, dataIndex: 'collector', key: 'collector', width: '150px' },
            { title: t.method, dataIndex: 'method', key: 'method', width: '100px' },
            { 
              title: t.result, 
              dataIndex: 'result', 
              key: 'result',
              render: (result: string) => (
                <Tag color={result === 'Contacted' || result === 'Connected' ? 'green' : result === 'Sent' ? 'blue' : 'orange'}>
                  {result}
                </Tag>
              )
            },
            { title: t.duration, dataIndex: 'duration', key: 'duration', width: '100px' },
            { 
              title: t.recording, 
              dataIndex: 'recording', 
              key: 'recording', 
              width: '120px',
              render: (recording: boolean) => recording ? (
                <Button type="link" icon={<PlayCircleOutlined style={{ color: '#22c55e' }} />} onClick={() => message.info('Playing recording...')} style={{ padding: 0, height: 'auto' }}>
                  Play
                </Button>
              ) : (
                <span style={{ color: '#9ca3af' }}>N/A</span>
              )
            },
            { title: t.note, dataIndex: 'note', key: 'note' },
          ]}
          pagination={{ pageSize: 10 }}
          size="middle"
        />
      ),
    },
    {
      key: 'warning',
      label: 'Warning Letter',
      children: (
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>Sent Warning Letters</h3>
          <Table
            dataSource={warningLetters}
            columns={[
              { title: t.title, dataIndex: 'title', key: 'title' },
              { title: t.sentDate, dataIndex: 'sentDate', key: 'sentDate', width: '150px' },
              { 
                title: t.status, 
                dataIndex: 'status', 
                key: 'status',
                width: '120px',
                render: (status: string) => (
                  <Tag color={status === 'opened' ? 'green' : status === 'delivered' ? 'blue' : 'gray'}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Tag>
                )
              },
              { 
                title: t.action, 
                key: 'action',
                width: '150px',
                render: (_, record: WarningLetter) => (
                  <Space>
                    <Button 
                      type="link" 
                      icon={<EyeOutlined />} 
                      onClick={() => setPreviewLetterUrl(record.previewUrl)}
                      style={{ padding: 0, height: 'auto', color: '#0d4f3c' }}
                    >
                      Preview
                    </Button>
                    <Button 
                      type="link" 
                      icon={<DownloadOutlined />} 
                      onClick={() => message.info(`Downloading ${record.title}...`)}
                      style={{ padding: 0, height: 'auto', color: '#0d4f3c' }}
                    >
                      Download
                    </Button>
                  </Space>
                )
              },
            ]}
            pagination={false}
            size="middle"
          />
        </div>
      ),
    },
    {
      key: 'contacts',
      label: 'Contact List',
      children: (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', margin: 0 }}>Emergency Contacts</h3>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setAddContactModalVisible(true)}
            >
              Add Contact
            </Button>
          </div>
          <Table
            dataSource={contacts}
            columns={[
              { title: 'Name', dataIndex: 'name', key: 'name', width: '150px' },
              { title: 'Relationship', dataIndex: 'relationship', key: 'relationship', width: '120px' },
              { 
                title: 'Phone Number', 
                dataIndex: 'phoneNumber', 
                key: 'phoneNumber',
                width: '180px',
                render: (phone: string, record: Contact) => (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{phone}</span>
                    <Tag color={record.type === 'mobile' ? 'blue' : 'green'}>{record.type}</Tag>
                  </div>
                )
              },
              { title: 'Source', dataIndex: 'source', key: 'source', width: '150px' },
              { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt', width: '150px' },
              { 
                title: 'Action', 
                key: 'action',
                width: '100px',
                render: (_, record: Contact) => (
                  <Space>
                    {/* Call按钮 - 所有类型都显示（仅图标） */}
                    <button
                      onClick={() => setCallModalVisible(true)}
                      style={{ 
                        padding: 0, 
                        backgroundColor: '#22c55e',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(34, 197, 94, 0.3)',
                      }}
                    >
                      <PhoneOutlined style={{ color: '#fff', fontSize: '12px' }} />
                    </button>
                    
                    {/* WhatsApp按钮 - 仅个人手机号码显示 */}
                    {record.type !== 'company' && (
                      <button
                        onClick={() => {
                          let phone = record.phoneNumber.replace(/\s/g, '');
                          // 添加印度尼西亚国家代码
                          if (phone.startsWith('0')) {
                            phone = '62' + phone.slice(1);
                          } else if (!phone.startsWith('+')) {
                            phone = '62' + phone;
                          }
                          window.open(`https://web.whatsapp.com/send?phone=${phone}`, '_blank');
                        }}
                        style={{ 
                          padding: 0, 
                          backgroundColor: '#25d366',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 2px 4px rgba(37, 211, 102, 0.3)',
                        }}
                      >
                        <MessageOutlined style={{ color: '#fff', fontSize: '12px' }} />
                      </button>
                    )}
                    
                    {/* Message按钮 - 仅个人手机号码显示（仅图标） */}
                    {record.type !== 'company' && (
                      <button
                        onClick={() => setCallModalVisible(true)}
                        style={{ 
                          padding: 0, 
                          backgroundColor: '#3b82f6',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)',
                        }}
                      >
                        <SendOutlined style={{ color: '#fff', fontSize: '12px' }} />
                      </button>
                    )}
                  </Space>
                )
              },
            ]}
            pagination={{ pageSize: 10 }}
            size="middle"
          />
        </div>
      ),
    },
    {
      key: 'images',
      label: 'Images',
      children: (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {images.map((image) => (
            <div 
              key={image.id} 
              style={{ 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px', 
                overflow: 'hidden',
                cursor: 'pointer'
              }}
              onClick={() => setPreviewImage(image.url)}
            >
              <img 
                src={image.url} 
                alt={image.name}
                style={{ width: '100%', height: '150px', objectFit: 'cover' }}
              />
              <div style={{ padding: '12px', backgroundColor: '#f9fafb' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '500', color: '#1f2937' }}>
                  {image.name}
                </p>
                <Tag color="blue" style={{ fontSize: '11px' }}>{image.type}</Tag>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: 'transfer',
      label: 'Transfer Records',
      children: (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', margin: 0 }}>Case Transfer History</h3>
            <Tag color="blue">{transferRecords.length} Records</Tag>
          </div>
          <Table
            dataSource={transferRecords}
            columns={[
              { 
                title: 'Transfer Time', 
                dataIndex: 'transferTime', 
                key: 'transferTime',
                width: '180px',
                render: (time: string) => (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ClockCircleOutlined style={{ color: '#6b7280' }} />
                    {time}
                  </span>
                )
              },
              { 
                title: 'From', 
                dataIndex: 'fromCollector', 
                key: 'fromCollector',
                width: '150px',
                render: (collector: string) => (
                  <span style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    color: collector === 'System' ? '#6b7280' : '#1f2937',
                    fontWeight: collector === 'System' ? 'normal' : '500'
                  }}>
                    <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: collector === 'System' ? '#9ca3af' : '#ef4444' }} />
                    {collector}
                  </span>
                )
              },
              { 
                title: 'To', 
                dataIndex: 'toCollector', 
                key: 'toCollector',
                width: '150px',
                render: (collector: string) => (
                  <span style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    color: collector === 'System' ? '#6b7280' : '#1f2937',
                    fontWeight: collector === 'System' ? 'normal' : '500'
                  }}>
                    <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: collector === 'System' ? '#9ca3af' : '#22c55e' }} />
                    {collector}
                  </span>
                )
              },
              { 
                title: 'Reason', 
                dataIndex: 'reason', 
                key: 'reason',
                render: (reason: string) => (
                  <span style={{ color: '#4b5563' }}>{reason}</span>
                )
              },
              { 
                title: 'Type', 
                dataIndex: 'transferType', 
                key: 'transferType',
                width: '120px',
                render: (type: string) => {
                  const typeConfig: Record<string, { color: string; label: string }> = {
                    auto: { color: 'blue', label: 'Auto' },
                    manual: { color: 'orange', label: 'Manual' },
                    system: { color: 'purple', label: 'System' },
                  };
                  const config = typeConfig[type] || { color: 'default', label: type };
                  return <Tag color={config.color}>{config.label}</Tag>;
                }
              },
              { 
                title: 'Operator', 
                dataIndex: 'operator', 
                key: 'operator',
                width: '180px',
                render: (operator: string | undefined) => operator ? (
                  <span style={{ color: '#6b7280', fontSize: '13px' }}>{operator}</span>
                ) : (
                  <span style={{ color: '#9ca3af', fontSize: '13px' }}>-</span>
                )
              },
            ]}
            pagination={{ pageSize: 10 }}
            size="middle"
            rowKey="id"
          />
          
          {/* 流转统计 */}
          <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '10px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>Transfer Statistics</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#fff', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: '600', color: '#0d4f3c' }}>{transferRecords.length}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Transfers</div>
              </div>
              <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#fff', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: '600', color: '#22c55e' }}>
                  {transferRecords.filter(r => r.transferType === 'auto').length}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Auto Assignment</div>
              </div>
              <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#fff', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: '600', color: '#f97316' }}>
                  {transferRecords.filter(r => r.transferType === 'manual').length}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Manual Transfer</div>
              </div>
              <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#fff', borderRadius: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: '600', color: '#8b5cf6' }}>
                  {transferRecords.filter(r => r.transferType === 'system').length}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>System Action</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ], [activities, caseSummary, images, paymentHistory, contacts, transferRecords]);

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      {/* 客户信息头部卡片 */}
      <Card 
        style={{ 
          marginBottom: '24px', 
          borderRadius: '12px',
          border: 'none',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {/* 左侧客户信息 */}
          <div style={{ display: 'flex', gap: '20px' }}>
            <Avatar 
              size={80} 
              icon={<UserOutlined />}
              style={{ 
                backgroundColor: '#0d4f3c', 
                fontSize: '32px',
                border: '3px solid #e5e7eb'
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '400px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <h2 style={{ margin: '0', fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
                  {personalInfo.fullName}
                </h2>
                <Badge 
                  status="processing" 
                  text="Active" 
                  style={{ backgroundColor: '#22c55e', color: '#ffffff', fontSize: '12px', padding: '2px 8px' }}
                />
                <Tag color="orange">NEW</Tag>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontWeight: '500', color: '#1f2937' }}>Case Number:</span>
                    <span style={{ color: '#0d4f3c', fontWeight: '500' }}>{caseId}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontWeight: '500', color: '#1f2937' }}>Phone:</span>
                    <span style={{ color: '#1f2937' }}>0821 6273 6949</span>
                    <Space size={4}>
                      <Button type="link" icon={<PhoneOutlined style={{ color: '#22c55e' }} />} onClick={() => setCallModalVisible(true)} style={{ padding: '0', height: 'auto', lineHeight: '1.5' }} />
                      <Button 
                        type="link" 
                        onClick={() => setCallModalVisible(true)} 
                        style={{ 
                          padding: '0', 
                          height: '24px', 
                          width: '24px',
                          backgroundColor: '#25D366',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <MessageOutlined style={{ color: '#fff', fontSize: '12px' }} />
                      </Button>
                    </Space>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontWeight: '500', color: '#1f2937' }}>Email:</span>
                    <span style={{ color: '#6b7280' }}>ezi.sadrakh@example.com</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontWeight: '500', color: '#1f2937' }}>NIK:</span>
                    <span style={{ color: '#6b7280' }}>{personalInfo.nik}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontWeight: '500', color: '#1f2937' }}>Gender:</span>
                    <span style={{ color: '#6b7280' }}>{personalInfo.gender}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontWeight: '500', color: '#1f2937' }}>Age:</span>
                    <span style={{ color: '#6b7280' }}>{personalInfo.age}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontWeight: '500', color: '#1f2937' }}>Company:</span>
                    <span style={{ color: '#6b7280' }}>{employmentInfo.companyName}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontWeight: '500', color: '#1f2937' }}>Company Address:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, maxWidth: '300px' }}>
                      <span 
                        style={{ 
                          color: '#6b7280', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap',
                          cursor: 'pointer'
                        }} 
                        onClick={() => {
                          navigator.clipboard.writeText(employmentInfo.companyAddress);
                          message.success('Address copied to clipboard');
                        }}
                        title={employmentInfo.companyAddress}
                      >
                        {employmentInfo.companyAddress}
                      </span>
                      <CopyOutlined 
                        style={{ 
                          color: '#9ca3af', 
                          cursor: 'pointer',
                          fontSize: '12px'
                        }} 
                        onClick={() => {
                          navigator.clipboard.writeText(employmentInfo.companyAddress);
                          message.success('Address copied to clipboard');
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontWeight: '500', color: '#1f2937' }}>Company Phone:</span>
                    <span style={{ color: '#1f2937' }}>(022) 1234 5678</span>
                    <Space size={4}>
                      <Button type="link" icon={<PhoneOutlined style={{ color: '#22c55e' }} />} onClick={() => setCallModalVisible(true)} style={{ padding: '0', height: 'auto', lineHeight: '1.5' }} />
                      <Button 
                    type="link" 
                    onClick={() => setCallModalVisible(true)} 
                    style={{ 
                      padding: '0', 
                      lineHeight: '1.5',
                      backgroundColor: '#25D366',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <MessageOutlined style={{ color: '#fff', fontSize: '12px' }} />
                  </Button>
                    </Space>
                  </div>
                </div>
                <Button 
                  type="text" 
                  icon={<RightOutlined />} 
                  onClick={() => setDetailModalVisible(true)}
                  style={{ color: '#0d4f3c', padding: '0', marginTop: '8px', textAlign: 'left' }}
                >
                  View Detailed Information
                </Button>
            </div>
          </div>

        </div>

        {/* 金额统计卡片 */}
        <Divider style={{ margin: '20px 0' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div 
            style={{ 
              backgroundColor: '#fef2f2', 
              borderRadius: '10px', 
              padding: '16px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Total Arrears</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#dc2626' }}>{formatIDR(267947)} IDR</div>
          </div>
          <div 
            style={{ 
              backgroundColor: '#eff6ff', 
              borderRadius: '10px', 
              padding: '16px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Remaining Principal</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#2563eb' }}>{formatIDR(210000)} IDR</div>
          </div>
          <div 
            style={{ 
              backgroundColor: '#fff7ed', 
              borderRadius: '10px', 
              padding: '16px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Remaining Interest</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#ea580c' }}>{formatIDR(45360)} IDR</div>
          </div>
          <div 
            style={{ 
              backgroundColor: '#fef2f2', 
              borderRadius: '10px', 
              padding: '16px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Overdue Interest</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#dc2626' }}>{formatIDR(0)} IDR</div>
          </div>
          <div 
            style={{ 
              backgroundColor: '#f0fdf4', 
              borderRadius: '10px', 
              padding: '16px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Total Repaid Amount</div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#16a34a' }}>{formatIDR(0)} IDR</div>
          </div>
          <div 
            style={{ 
              backgroundColor: '#fff', 
              borderRadius: '10px', 
              padding: '16px',
              textAlign: 'center',
              border: '1px solid #e5e7eb'
            }}
          >
            <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Risk Grade</div>
            <Tag color="red" style={{ fontSize: '14px', fontWeight: '600', padding: '4px 12px' }}>RG3</Tag>
          </div>
        </div>
      </Card>

      {/* 账单信息 */}
      <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileTextOutlined style={{ color: '#0d4f3c' }} />
            <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>Bill Information</h3>
          </div>
          <Space>
            {canApplyReduction && (
              <Button 
                type="primary" 
                onClick={() => {
                  setReductionType(isAllUnpaidSelected ? 'settle' : 'nonSettle');
                  setReductionModalVisible(true);
                }}
                style={{ backgroundColor: '#f97316', borderColor: '#f97316' }}
              >
                Apply Reduction
              </Button>
            )}
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setVaModalVisible(true)}
            >
              Create VA Code
            </Button>
          </Space>
        </div>
        
        {/* 按订单分组展示账单 */}
        {(() => {
          const groupedBills = bills.reduce((acc, bill) => {
            if (!acc[bill.orderId]) {
              acc[bill.orderId] = [];
            }
            acc[bill.orderId].push(bill);
            return acc;
          }, {} as Record<string, Bill[]>);
          
          return Object.entries(groupedBills).map(([orderId, orderBills]) => {
            const orderTotal = orderBills.reduce((sum, bill) => sum + bill.amount, 0);
            const orderSelected = orderBills.some(bill => selectedBills.includes(bill.id));
            const orderUnpaid = orderBills.some(bill => bill.status !== 'paid');
            
            const isExpanded = expandedOrders.has(orderId);
                
                return (
                  <div key={orderId} style={{ marginBottom: '16px', border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
                    {/* 订单头部 - 可点击折叠/展开 */}
                    <div 
                      style={{ 
                        backgroundColor: '#f9fafb', 
                        padding: '12px 16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                      onClick={() => toggleOrderExpand(orderId)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Checkbox
                          checked={orderSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              const unpaidStartIndex = orderBills.findIndex(b => b.status !== 'paid');
                              if (unpaidStartIndex !== -1) {
                                const newSelected = orderBills.slice(unpaidStartIndex).map(b => b.id);
                                setSelectedBills(prev => [...new Set([...prev, ...newSelected])]);
                              }
                            } else {
                              setSelectedBills(prev => prev.filter(id => !orderBills.find(b => b.id === id)));
                            }
                          }}
                          disabled={!orderUnpaid}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span style={{ fontWeight: '600', color: '#0d4f3c' }}>Order: {orderId}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '13px', color: '#6b7280' }}>
                          {orderBills.length} bills
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                          Total: {formatIDR(orderTotal)} IDR
                        </span>
                        {isExpanded ? (
                          <UpOutlined style={{ fontSize: '16px', color: '#6b7280' }} />
                        ) : (
                          <DownOutlined style={{ fontSize: '16px', color: '#6b7280' }} />
                        )}
                      </div>
                    </div>
                    
                    {/* 订单下的账单列表 - 根据折叠状态显示/隐藏 */}
                    {isExpanded && (
                      <Table
                        dataSource={orderBills}
                        columns={[
                          { 
                            title: 'Select', 
                            key: 'select',
                            width: '60px',
                            render: (_, bill: Bill) => (
                              <Checkbox
                                checked={selectedBills.includes(bill.id)}
                                onChange={() => handleBillSelection(bill.id)}
                                disabled={bill.status === 'paid'}
                              />
                            )
                          },
                          { title: 'Bill Number', dataIndex: 'billNumber', key: 'billNumber', width: '180px' },
                          { title: 'Installments', dataIndex: 'installments', key: 'installments', width: '120px' },
                          { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate', width: '120px' },
                          { 
                            title: 'Amount', 
                            dataIndex: 'amount', 
                            key: 'amount', 
                            width: '150px',
                            render: (amount: number) => <span style={{ fontWeight: '500' }}>{formatIDR(amount)} IDR</span>
                          },
                          { 
                            title: 'Status', 
                            dataIndex: 'status', 
                            key: 'status',
                            width: '100px',
                            render: (status: string) => (
                              <Tag color={status === 'paid' ? 'green' : status === 'overdue' ? 'red' : 'orange'}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </Tag>
                            )
                          },
                        ]}
                        pagination={false}
                        size="middle"
                        scroll={{ x: 700 }}
                        style={{ margin: 0 }}
                      />
                    )}
                  </div>
                );
          });
        })()}
        
        {/* 有效VA码 */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <WalletOutlined style={{ color: '#0d4f3c' }} />
            <h4 style={{ margin: '0', fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>Active VA Codes</h4>
          </div>
          {activeVA.length > 0 ? (
            <Table
              dataSource={activeVA}
              columns={[
                { 
                  title: 'Channel', 
                  dataIndex: 'channel', 
                  key: 'channel',
                  width: '120px',
                  render: (channel: string) => (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {channel === 'VA' ? <CreditCardOutlined /> : <ShoppingCartOutlined />}
                      {channel}
                    </span>
                  )
                },
                { 
                  title: 'Bank', 
                  dataIndex: 'bank', 
                  key: 'bank',
                  width: '150px',
                  render: (bank: string | undefined) => bank ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img 
                        src={bankLogos[bank]} 
                        alt={bank} 
                        style={{ width: '24px', height: '24px', borderRadius: '4px' }} 
                      />
                      {bank}
                    </span>
                  ) : '-'
                },
                { 
                  title: 'VA Number', 
                  dataIndex: 'vaNumber', 
                  key: 'vaNumber',
                  render: (vaNumber: string) => (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: '500' }}>{vaNumber}</span>
                      <Button 
                        type="link" 
                        size="small"
                        onClick={() => {
                          navigator.clipboard.writeText(vaNumber);
                          message.success('VA码已复制到剪贴板');
                        }}
                        style={{ padding: '0', height: 'auto', color: '#0d4f3c' }}
                      >
                        <CopyOutlined style={{ fontSize: '14px' }} />
                      </Button>
                    </span>
                  )
                },
                { 
                  title: 'Amount', 
                  dataIndex: 'amount', 
                  key: 'amount',
                  render: (amount: number) => <span style={{ fontWeight: '500', color: '#0d4f3c' }}>{formatIDR(amount)} IDR</span>
                },
                { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt', width: '120px' },
                { title: 'Expires At', dataIndex: 'expiresAt', key: 'expiresAt', width: '120px' },
              ]}
              pagination={false}
              size="middle"
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
              <WalletOutlined style={{ fontSize: '32px', color: '#d1d5db', marginBottom: '8px' }} />
              <p>No active VA codes</p>
            </div>
          )}
        </div>

        {/* 减免申请记录 */}
        {reductionApplications.length > 0 && (
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <FileTextOutlined style={{ color: '#0d4f3c' }} />
              <h4 style={{ margin: '0', fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>Reduction Applications</h4>
            </div>
            <Table
              dataSource={reductionApplications}
              columns={[
                { 
                  title: 'Application ID', 
                  dataIndex: 'applicationId', 
                  key: 'applicationId',
                  width: '180px',
                  render: (id: string) => (
                    <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#0d4f3c' }}>{id}</span>
                  )
                },
                { 
                  title: 'Apply Time', 
                  dataIndex: 'applyTime', 
                  key: 'applyTime',
                  width: '150px',
                },
                { 
                  title: 'Bills', 
                  dataIndex: 'billIds', 
                  key: 'billIds',
                  width: '80px',
                  render: (billIds: string[]) => `${billIds.length} bills`
                },
                { 
                  title: 'Total Amount', 
                  dataIndex: 'totalAmount', 
                  key: 'totalAmount',
                  width: '140px',
                  align: 'right',
                  render: (amount: number) => <span style={{ fontWeight: '500' }}>{formatIDR(amount)} IDR</span>
                },
                { 
                  title: 'Requested', 
                  dataIndex: 'requestedReduction', 
                  key: 'requestedReduction',
                  width: '130px',
                  align: 'right',
                  render: (amount: number) => (
                    <span style={{ color: '#f97316', fontWeight: '500' }}>-{formatIDR(amount)} IDR</span>
                  )
                },
                { 
                  title: 'Approved', 
                  dataIndex: 'approvedReduction', 
                  key: 'approvedReduction',
                  width: '130px',
                  align: 'right',
                  render: (amount: number) => (
                    <span style={{ color: amount > 0 ? '#22c55e' : '#9ca3af', fontWeight: '500' }}>
                      {amount > 0 ? `-${formatIDR(amount)} IDR` : '-'}
                    </span>
                  )
                },
                { 
                  title: 'Status', 
                  dataIndex: 'status', 
                  key: 'status',
                  width: '100px',
                  render: (status: ReductionApplicationStatus) => {
                    const statusConfig: Record<ReductionApplicationStatus, { color: string; label: string }> = {
                      pending: { color: 'orange', label: 'Pending' },
                      approved: { color: 'blue', label: 'Approved' },
                      rejected: { color: 'red', label: 'Rejected' },
                      completed: { color: 'green', label: 'Completed' },
                    };
                    const config = statusConfig[status];
                    return <Tag color={config.color}>{config.label}</Tag>;
                  }
                },
                { 
                  title: 'Payment Code', 
                  dataIndex: 'paymentCode', 
                  key: 'paymentCode',
                  width: '180px',
                  render: (code: string | undefined) => code ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: '500' }}>{code}</span>
                      <Button 
                        type="link" 
                        size="small"
                        onClick={() => {
                          navigator.clipboard.writeText(code);
                          message.success('还款码已复制');
                        }}
                        style={{ padding: '0', height: 'auto', color: '#0d4f3c' }}
                      >
                        <CopyOutlined style={{ fontSize: '12px' }} />
                      </Button>
                    </span>
                  ) : (
                    <span style={{ color: '#9ca3af', fontSize: '12px' }}>-</span>
                  )
                },
              ]}
              pagination={false}
              size="middle"
            />
          </div>
        )}
      </Card>

      {/* 标签页内容 */}
      <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          style={{ marginBottom: '24px' }}
          items={tabsItems}
        />
      </Card>

      {/* Image Preview Modal */}
      <Modal
        open={!!previewImage}
        footer={null}
        onCancel={() => setPreviewImage(null)}
        width={700}
        centered
      >
        {previewImage && (
          <img 
            src={previewImage} 
            alt="Preview"
            style={{ width: '100%', maxHeight: '600px', objectFit: 'contain' }}
          />
        )}
      </Modal>

      {/* Detailed Information Modal */}
      <Modal
        title="Detailed Information"
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setDetailModalActiveTab('personal');
        }}
        width={900}
        footer={null}
      >
        <Tabs 
            activeKey={detailModalActiveTab} 
            onChange={setDetailModalActiveTab}
            items={[
              {
                key: 'personal',
                label: 'Personal Information',
                children: (
                  <div style={{ backgroundColor: '#f9fafb', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>Full Name</span>
                        <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>{personalInfo.fullName}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>NIK</span>
                        <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>{personalInfo.nik}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>Gender</span>
                        <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>{personalInfo.gender}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>Age</span>
                        <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>{personalInfo.age}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>Marital Status</span>
                        <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>{personalInfo.maritalStatus}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>Education</span>
                        <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>{personalInfo.education}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>Mother's Name</span>
                        <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>{personalInfo.mothersName}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>No. of Dependents</span>
                        <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>{personalInfo.noOfDependants}</span>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                key: 'residence',
                label: 'Residence Information',
                children: (
                  <div style={{ backgroundColor: '#f9fafb', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>Province</span>
                        <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>{residenceInfo.province}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>City</span>
                        <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>{residenceInfo.city}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>District</span>
                        <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>{residenceInfo.district}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>Sub District</span>
                        <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>{residenceInfo.subDistrict}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>Postal Code</span>
                        <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>{residenceInfo.postalCode}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>Residence Status</span>
                        <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>{residenceInfo.residenceStatus}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>Length of Stay</span>
                        <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>{residenceInfo.lengthOfStay}</span>
                      </div>
                      <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>Full Address</span>
                        <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>{residenceInfo.fullAddress}</span>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                key: 'employment',
                label: 'Employment Information',
                children: (
                  <div style={{ backgroundColor: '#f9fafb', borderRadius: '10px', padding: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>Company Name</span>
                        <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>{employmentInfo.companyName}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>Industry</span>
                        <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>{employmentInfo.industry}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>Position</span>
                        <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>{employmentInfo.position}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>Department</span>
                        <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>{employmentInfo.department}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>Monthly Salary</span>
                        <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>{formatIDR(employmentInfo.monthlySalary)} IDR</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>Working Period</span>
                        <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>{employmentInfo.workingPeriod}</span>
                      </div>
                      <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                        <span style={{ color: '#6b7280', fontSize: '13px' }}>Company Address</span>
                        <span style={{ color: '#1f2937', fontSize: '13px', fontWeight: '500' }}>{employmentInfo.companyAddress}</span>
                      </div>
                    </div>
                  </div>
                ),
              },
            ]}
          />
      </Modal>

      {/* Call Collection Record Modal */}
      <Modal
        title="Add Collection Record"
        open={callModalVisible}
        onCancel={() => setCallModalVisible(false)}
        onOk={() => {
          message.success('Collection record added successfully');
          setCallModalVisible(false);
        }}
        width={500}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>Call Target</label>
            <Input value={`${personalInfo.fullName} - 0821 6273 6949`} disabled style={{ backgroundColor: '#f3f4f6' }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>Call Method</label>
            <Select defaultValue="Call" style={{ width: '100%' }}>
              <Select.Option value="Call">Call</Select.Option>
              <Select.Option value="SMS">SMS</Select.Option>
              <Select.Option value="Email">Email</Select.Option>
            </Select>
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>Call Result</label>
            <Select defaultValue="Connected" style={{ width: '100%' }}>
              <Select.Option value="Connected">Connected</Select.Option>
              <Select.Option value="No Answer">No Answer</Select.Option>
              <Select.Option value="Busy">Busy</Select.Option>
              <Select.Option value="Rejected">Rejected</Select.Option>
            </Select>
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>Note</label>
            <textarea 
              placeholder="Enter call notes..." 
              style={{ width: '100%', height: '100px', borderRadius: '8px', padding: '12px', border: '1px solid #d1d5db', fontSize: '13px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>Follow-up Date (Optional)</label>
            <DatePicker 
              style={{ width: '100%' }} 
              placeholder="Select follow-up date"
              format="YYYY-MM-DD"
            />
          </div>
        </div>
      </Modal>

      {/* Create VA Code Modal */}
      <Modal
        title="Create VA Code"
        open={vaModalVisible}
        onCancel={() => {
          setVaModalVisible(false);
          setSelectedChannel('VA');
          setSelectedBank('');
        }}
        onOk={handleCreateVA}
        width={600}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Selected Bills Summary */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>Selected Bills ({selectedBills.length})</label>
            <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '12px', maxHeight: '150px', overflowY: 'auto' }}>
              {selectedBills.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedBills.map(billId => {
                    const bill = bills.find(b => b.id === billId);
                    return bill ? (
                      <div key={bill.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: '#1f2937' }}>{bill.billNumber} ({bill.installments})</span>
                        <span style={{ fontSize: '13px', fontWeight: '500', color: '#0d4f3c' }}>{formatIDR(bill.amount)} IDR</span>
                      </div>
                    ) : null;
                  })}
                  <Divider style={{ margin: '8px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '600', color: '#1f2937' }}>
                    <span>Total Amount</span>
                    <span style={{ color: '#0d4f3c' }}>{formatIDR(selectedBillsTotal)} IDR</span>
                  </div>
                </div>
              ) : (
                <p style={{ color: '#9ca3af', textAlign: 'center', margin: 0 }}>No bills selected</p>
              )}
            </div>
          </div>

          {/* Channel Selection */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>Channel</label>
            <Radio.Group value={selectedChannel} onChange={(e) => setSelectedChannel(e.target.value)}>
              <Radio value="VA">
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCardOutlined /> VA (Virtual Account)
                </span>
              </Radio>
              <Radio value="Alfamart" style={{ marginLeft: '16px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingCartOutlined /> Alfamart
                </span>
              </Radio>
            </Radio.Group>
          </div>

          {/* Bank Selection (only for VA) */}
          {selectedChannel === 'VA' && (
            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>Bank</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                {banks.map(bank => (
                  <button
                    key={bank.code}
                    onClick={() => setSelectedBank(bank.code)}
                    style={{
                      padding: '12px 8px',
                      borderRadius: '8px',
                      border: selectedBank === bank.code ? '2px solid #0d4f3c' : '1px solid #d1d5db',
                      backgroundColor: selectedBank === bank.code ? '#f0fdf4' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <img 
                      src={bank.logo} 
                      alt={bank.name} 
                      style={{ width: '40px', height: '40px', marginBottom: '8px', objectFit: 'contain' }} 
                    />
                    <div style={{ fontSize: '12px', fontWeight: '500', color: '#374151' }}>{bank.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Aggregator Selection */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>Aggregator</label>
            <Select defaultValue="InstaMoney" style={{ width: '100%' }}>
              <Select.Option value="InstaMoney">InstaMoney</Select.Option>
              <Select.Option value="Paytren">Paytren</Select.Option>
              <Select.Option value="Doku">Doku</Select.Option>
              <Select.Option value="Midtrans">Midtrans</Select.Option>
            </Select>
          </div>
        </div>
      </Modal>

      {/* Apply Reduction Modal */}
      <Modal
        title="Apply Reduction"
        open={reductionModalVisible}
        onCancel={() => {
          setReductionModalVisible(false);
          setRequestedReduction(0);
          setReductionType('nonSettle');
        }}
        onOk={handleApplyReduction}
        width={750}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Settlement Type */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>Settlement Type <span style={{ color: '#ef4444' }}>*</span></label>
            <Radio.Group value={reductionType} onChange={(e) => {
              setReductionType(e.target.value);
              setRequestedReduction(0);
            }}>
              <Radio value="nonSettle">Non-Settle (非结清)</Radio>
              <Radio value="settle" style={{ marginLeft: '16px' }}>Settle (结清)</Radio>
            </Radio.Group>
          </div>

          {/* Selected Bills Summary */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>Selected Bills ({selectedBills.length})</label>
            <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '12px', maxHeight: '150px', overflowY: 'auto' }}>
              {selectedBills.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedBills.map(billId => {
                    const bill = bills.find(b => b.id === billId);
                    return bill ? (
                      <div key={bill.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: '#1f2937' }}>{bill.billNumber} ({bill.installments})</span>
                        <span style={{ fontSize: '13px', fontWeight: '500', color: '#0d4f3c' }}>{formatIDR(bill.amount)} IDR</span>
                      </div>
                    ) : null;
                  })}
                  <Divider style={{ margin: '8px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '600', color: '#1f2937' }}>
                    <span>Original Amount</span>
                    <span style={{ color: '#0d4f3c' }}>{formatIDR(selectedBillsTotal)} IDR</span>
                  </div>
                </div>
              ) : (
                <p style={{ color: '#9ca3af', textAlign: 'center', margin: 0 }}>No bills selected</p>
              )}
            </div>
          </div>

          {/* Max Reduction Amount */}
          <div style={{ backgroundColor: '#fef3c7', borderRadius: '8px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#92400e' }}>Maximum Reduction Amount</span>
              <span style={{ fontSize: '20px', fontWeight: '700', color: '#f59e0b' }}>{formatIDR(reductionCalculation.maxReduction)} IDR</span>
            </div>
            {(reductionType === 'settle' || reductionType === 'nonSettle') && reductionCalculation.breakdown && (
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '12px', color: '#b45309' }}>
                <span>Principal: {formatIDR(reductionCalculation.breakdown.principal)}</span>
                <span>Interest: {formatIDR(reductionCalculation.breakdown.interest)}</span>
                <span>Penalty: {formatIDR(reductionCalculation.breakdown.penalty)}</span>
              </div>
            )}
          </div>

          {/* Requested Reduction Amount */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>Requested Reduction Amount <span style={{ color: '#ef4444' }}>*</span></label>
            <InputNumber
              min={0}
              max={reductionCalculation.maxReduction}
              value={requestedReduction}
              onChange={(value) => {
                const newVal = value || 0;
                if (newVal <= reductionCalculation.maxReduction) {
                  setRequestedReduction(newVal);
                } else {
                  message.error(`超出最大可减免额度，最大可减免 ${formatIDR(reductionCalculation.maxReduction)} IDR`);
                }
              }}
              formatter={(value) => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
              parser={(value) => parseFloat(value?.replace(/,/g, '') || '0')}
              style={{ width: '100%' }}
              placeholder={`Max: ${formatIDR(reductionCalculation.maxReduction)}`}
              disabled={reductionCalculation.maxReduction === 0}
            />
          </div>

          {/* Subject Breakdown */}
          {(reductionType === 'settle' || reductionType === 'nonSettle') && allocatedDetails && requestedReduction > 0 && (
            <div>
              <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>Reduction Breakdown</label>
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div style={{ backgroundColor: '#fff', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Principal (本金)</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#f97316' }}>-{formatIDR(allocatedDetails.allocatedBreakdown.principal)} IDR</div>
                  </div>
                  <div style={{ backgroundColor: '#fff', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Interest (利息)</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#f97316' }}>-{formatIDR(allocatedDetails.allocatedBreakdown.interest)} IDR</div>
                  </div>
                  <div style={{ backgroundColor: '#fff', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Penalty (罚息)</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#f97316' }}>-{formatIDR(allocatedDetails.allocatedBreakdown.penalty)} IDR</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Amount After Reduction */}
          <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #bbf7d0' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#065f46' }}>Amount Payable After Reduction</span>
              <span style={{ fontSize: '20px', fontWeight: '700', color: '#0d4f3c' }}>{formatIDR(afterReductionTotal)} IDR</span>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>Reason <span style={{ color: '#ef4444' }}>*</span></label>
            <textarea 
              placeholder="Enter reason for reduction request..." 
              style={{ width: '100%', height: '80px', borderRadius: '8px', padding: '12px', border: '1px solid #d1d5db', fontSize: '13px' }}
              value={reductionReason}
              onChange={(e) => setReductionReason(e.target.value)}
            />
          </div>

          {/* Application Notice */}
          <div style={{ backgroundColor: '#eff6ff', borderRadius: '8px', padding: '12px', border: '1px solid #bfdbfe' }}>
            <div style={{ fontSize: '12px', color: '#1e40af' }}>
              <strong>Notice:</strong> After submission, the application will be reviewed by the supervisor. Once approved, a payment code will be generated for the customer.
            </div>
          </div>
        </div>
      </Modal>

      {/* Warning Letter Preview Modal */}
      <Modal
        title="Warning Letter Preview"
        open={!!previewLetterUrl}
        onCancel={() => setPreviewLetterUrl(null)}
        width={800}
        footer={null}
      >
        <div style={{ padding: '24px', backgroundColor: '#ffffff', minHeight: '400px' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>WARNING LETTER</h2>
              <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#6b7280' }}>Case Number: {caseId}</p>
            </div>
            <Divider />
            <div style={{ margin: '16px 0' }}>
              <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.8' }}>
                Dear {personalInfo.fullName},
              </p>
              <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.8', margin: '16px 0' }}>
                This is to inform you that your loan account has become overdue. Please settle the outstanding amount immediately to avoid further actions.
              </p>
              <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.8' }}>
                Outstanding Amount: <span style={{ fontWeight: '600', color: '#dc2626' }}>{formatIDR(selectedBillsTotal)} IDR</span>
              </p>
              <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.8', margin: '16px 0' }}>
                Please contact our collection team at your earliest convenience to discuss payment arrangements.
              </p>
              <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.8' }}>
                Sincerely,<br/>
                Collection Team
              </p>
            </div>
            <Divider />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
              <Button onClick={() => message.info('Downloading letter...')}>
                <DownloadOutlined /> Download PDF
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Add Contact Modal */}
      <Modal
        title="Add Contact"
        open={addContactModalVisible}
        onCancel={() => setAddContactModalVisible(false)}
        onOk={() => {
          const newContact: Contact = {
            id: `C${String(contacts.length + 1).padStart(3, '0')}`,
            name: (document.getElementById('contactName') as HTMLInputElement)?.value || '',
            relationship: (document.getElementById('relationship') as HTMLSelectElement)?.value || '',
            phoneNumber: (document.getElementById('phoneNumber') as HTMLInputElement)?.value || '',
            type: ((document.getElementById('contactType') as HTMLSelectElement)?.value || 'mobile') as 'mobile' | 'whatsapp' | 'company',
            source: (document.getElementById('source') as HTMLSelectElement)?.value || '',
            createdAt: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', ''),
          };
          setContacts([...contacts, newContact]);
          message.success('Contact added successfully');
          setAddContactModalVisible(false);
        }}
        width={500}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>Name</label>
            <Input id="contactName" placeholder="Enter contact name" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>Relationship</label>
            <Select id="relationship" placeholder="Select relationship" style={{ width: '100%' }}>
              <Select.Option value="Mother">Mother</Select.Option>
              <Select.Option value="Father">Father</Select.Option>
              <Select.Option value="Spouse">Spouse</Select.Option>
              <Select.Option value="Sibling">Sibling</Select.Option>
              <Select.Option value="Colleague">Colleague</Select.Option>
              <Select.Option value="Friend">Friend</Select.Option>
              <Select.Option value="Company">Company</Select.Option>
              <Select.Option value="Emergency">Emergency</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>Phone Number</label>
            <Input id="phoneNumber" placeholder="Enter phone number" style={{ width: '100%' }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>Type</label>
            <Select id="contactType" defaultValue="mobile" style={{ width: '100%' }}>
              <Select.Option value="mobile">Mobile</Select.Option>
              <Select.Option value="whatsapp">WhatsApp</Select.Option>
              <Select.Option value="company">Company</Select.Option>
            </Select>
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>Source</label>
            <Select id="source" placeholder="Select source" style={{ width: '100%' }}>
              <Select.Option value="Application Form">Application Form</Select.Option>
              <Select.Option value="Employment Info">Employment Info</Select.Option>
              <Select.Option value="Customer Provided">Customer Provided</Select.Option>
              <Select.Option value="Collection Call">Collection Call</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CaseDetail;
