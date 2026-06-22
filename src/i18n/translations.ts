import { Language } from '../types';

export interface Translations {
  // 工单审核相关
  workOrderReview: string;
  reviewWorkOrders: string;
  workOrderList: string;
  workOrderDetail: string;
  workOrderId: string;
  workOrderApprovedSuccess: string;
  workOrderRejectedSuccess: string;
  workOrderCompleted: string;
  approveWorkOrder: string;
  rejectWorkOrder: string;
  approveComment: string;
  enterApproveComment: string;
  applicationInformation: string;
  otherOrders: string;
  // 工单类型
  reductionApplication: string;
  suspendCollection: string;
  coCollection: string;
  // 字段
  amountOrDays: string;
  targetCollector: string;
  coCollectionReason: string;
  completed: string;
  // 新增字段
  type: string;
  suspendDays: string;
  reason: string;
  // 通用
  customerGroup: string;
  smsTemplate: string;
  userTag: string;
  tagName: string;
  filterByTag: string;
  selectTag: string;
  filterCustomers: string;
  export: string;
  batchSchedule: string;
  addSchedule: string;
  scheduled: string;
  statusCompleted: string;
  pending: string;
  scheduleCalendar: string;
  todaySchedule: string;
  noScheduleToday: string;
  scheduleList: string;
  selectDate: string;
  allCollectors: string;
  selectDepartment: string;
  allDepartments: string;
  resetFilter: string;
  editSchedule: string;
  pleaseSelect: string;
  leaveReason: string;
  tips: string;
  batchScheduleSkipExisting: string;
  ensureDateRangeCorrect: string;
  suggestMax30Days: string;
  dateRange: string;
  pleaseSelectDateRange: string;
  sickLeave: string;
  personalLeave: string;
  annualLeave: string;
  compensatoryLeave: string;
  otherLeave: string;
  pleaseInput: string;
  day: string;
  globalSearchPlaceholder: string;
  callCenter: string;
  payments: string;
  documents: string;
  reports: string;
  profile: string;
  settings: string;
  logout: string;
  // 排班状态
  working: string;
  onLeave: string;
  holiday: string;
  collectorName: string;
  date: string;
  markCompleted: string;
  markOnLeave: string;
  scheduleManagementTitle: string;
  all: string;
  // 停催原因
  complaint: string;
  death: string;
  hospitalized: string;
  lawsuit: string;
  other: string;
  // 禁止功能
  prohibitAllocation: string;
  prohibitSms: string;
  prohibitCall: string;
  prohibitWa: string;
  prohibitEmail: string;
  stopPenalty: string;
  // 消息提示
  pleaseSelectCasesToAssign: string;
  pleaseSelectCollectionTeam: string;
  pleaseSelectCollector: string;
  successfullyAssigned: string;
  deleteSuccess: string;
  addSuccess: string;
  modifySuccess: string;
  alreadyExists: string;
  endDateBeforeStartDate: string;
  noNewRecords: string;
  pleaseAddValidCondition: string;
  confirmRestoreCases: string;
  confirmDeleteTag: string;
  reductionRuleDeleted: string;
  reductionRuleEdited: string;
  // 案件列表相关
  search: string;
  or: string;
  total: string;
  items: string;
  manualAssignment: string;
  assignmentMode: string;
  assignByTeam: string;
  assignToCollector: string;
  selectTeam: string;
  distributionMethod: string;
  average: string;
  manual: string;
  selectCollector: string;
  selected: string;
  suspendSettings: string;
  pleaseSelectSuspendReason: string;
  pleaseSelectForbiddenFeature: string;
  successfullyAddedToSuspended: string;
  suspendReason: string;
  validityPeriod: string;
  selectSuspendEndTime: string;
  forbiddenFeatures: string;
  // 角色管理
  roleName: string;
  description: string;
  permissionCount: string;
  // 减免规则
  normalStatus: string;
  minOverdueDays: string;
  pleaseInputMinOverdueDays: string;
  maxOverdueDays: string;
  pleaseInputMaxOverdueDays: string;
  reductionMethod: string;
  pleaseSelectReductionMethod: string;
  fixedAmount: string;
  percentage: string;
  reductionDetails: string;
  principalReduction: string;
  pleaseInputPrincipalReduction: string;
  interestReduction: string;
  pleaseInputInterestReduction: string;
  serviceFeeReduction: string;
  pleaseInputServiceFeeReduction: string;
  penaltyReduction: string;
  pleaseInputPenaltyReduction: string;
  unitCurrency: string;
  unitPercent: string;
  // 通用词汇
  help: string;
  collector: string;
  overview: string;
  caseSummary: string;
  loanType: string;
  loanAmount: string;
  disbursementDate: string;
  dueDate: string;
  daysPastDue: string;
  caseStatus: string;
  lastPaymentDate: string;
  na: string;
  nextAction: string;
  recentActivity: string;
  viewAllActivity: string;
  // 阶段配置
  stageConfig: string;
  stageCode: string;
  stageName: string;
  overdueRange: string;
  status: string;
  action: string;
  addStage: string;
  edit: string;
  delete: string;
  enabled: string;
  disabled: string;
  cancel: string;
  save: string;
  confirm: string;
  editStage: string;
  addNewStage: string;
  stageNameLabel: string;
  startDays: string;
  endDays: string;
  infinite: string;
  finite: string;
  deleteConfirmTitle: string;
  deleteConfirmContent: string;
  overlapError: string;
  minMaxError: string;
  filterByStage: string;
  selectAll: string;
  assignTo: string;
  confirmAssign: string;
  selectedCount: string;
  casesSuffix: string;
  borrowerName: string;
  overdueDays: string;
  overdueAmount: string;
  noData: string;
  creator: string;
  createTime: string;
  updater: string;
  updateTime: string;
  product: string;
  selectProduct: string;
  allProducts: string;
  systemManagement: string;
  accountManagement: string;
  organizationStructure: string;
  department: string;
  position: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  addUser: string;
  editUser: string;
  addDepartment: string;
  editDepartment: string;
  parentDepartment: string;
  departmentName: string;
  departmentEditSuccess: string;
  departmentAddSuccess: string;
  departmentStructure: string;
  people: string;
  dashboard: string;
  adminDashboard: string;
  collectorDashboard: string;
  totalCases: string;
  pendingCases: string;
  completedCases: string;
  recoveryRate: string;
  totalAmount: string;
  recoveredAmount: string;
  currentTasks: string;
  completedTasks: string;
  personalRecoveryRate: string;
  recentActivities: string;
  performanceTrend: string;
  caseDistribution: string;
  overdueAnalysis: string;
  teamPerformance: string;
  topCollectors: string;
  dailyRecovery: string;
  weeklyTrend: string;
  // 催收系统
  collectionSystem: string;
  caseList: string;
  recoveryList: string;
  reductionReview: string;
  suspendedCases: string;
  businessConfig: string;
  // 系统设置
  systemSettings: string;
  roleManagement: string;
  menuManagement: string;
  dictionaryManagement: string;
  operationLog: string;
  // 营销管理
  marketingManagement: string;
  sendManagement: string;
  sendRecords: string;
  // 减免规则
  reductionRule: string;
  autoAllocation: string;
  overdueStage: string;
  scheduleManagement: string;
  // 停催列表
  suspendedCaseList: string;
  suspensionReason: string;
  suspensionDate: string;
  suspend: string;
  resume: string;
  endTime: string;
  caseId: string;
  suspensionTime: string;
  operator: string;
  restoreTip: string;
  // 组织架构
  confirmDelete: string;
  questionMark: string;
  yes: string;
  no: string;
  member: string;
  customerName: string;
  joinDate: string;
  onJob: string;
  resigned: string;
  // 减免规则配置
  ruleName: string;
  billStatus: string;
  reductionRuleConfig: string;
  addReductionRule: string;
  editReductionRule: string;
  pleaseInputRuleName: string;
  consumerLoan: string;
  businessLoan: string;
  homeLoan: string;
  carLoan: string;
  pleaseSelectBillStatus: string;
  isOverdue: string;
  // CaseDetail组件
  repaymentHistory: string;
  paymentDate: string;
  billNumber: string;
  installments: string;
  amount: string;
  paymentChannel: string;
  paymentMethod: string;
  paymentCode: string;
  transactionNo: string;
  collectionRecords: string;
  method: string;
  result: string;
  duration: string;
  recording: string;
  note: string;
  title: string;
  sentDate: string;
  // 案件列表
  billInformation: string;
  billId: string;
  orderId: string;
  billAmount: string;
  paidAmount: string;
  vaManagement: string;
  validVA: string;
  vaId: string;
  bank: string;
  vaNumber: string;
  expireTime: string;
  caseNo: string;
  stage: string;
  statusPending: string;
  statusProcessing: string;
  detail: string;
  cases: string;
  assignedTime: string;
  // 催回列表
  originalAmount: string;
  team: string;
  recoveryMethod: string;
  remark: string;
  startDate: string;
  endDate: string;
  // 减免审核
  reductionApprovedSuccess: string;
  reductionRejectedSuccess: string;
  paymentCodeGeneratedSuccess: string;
  paymentCompletedSuccess: string;
  applicationId: string;
  customer: string;
  applyTime: string;
  applyBy: string;
  requested: string;
  approvedAmount: string;
  pendingReview: string;
  approve: string;
  reject: string;
  generateVa: string;
  confirmPayment: string;
  reviewReductionApplications: string;
  pendingReviewCount: string;
  totalReductionAmount: string;
  applicationList: string;
  reductionApplicationDetail: string;
  billDetails: string;
  reduction: string;
  finalAmount: string;
  requestedReduction: string;
  approvedReduction: string;
  searchPlaceholder: string;
  reviewInformation: string;
  reviewTime: string;
  reviewer: string;
  comment: string;
  paymentInformation: string;
  waitingForPayment: string;
  completedTime: string;
  processTimeline: string;
  applicationSubmitted: string;
  by: string;
  paymentCodeGenerated: string;
  generating: string;
  code: string;
  paidAt: string;
  completedAndSettled: string;
  max: string;
  rejectionReason: string;
  enterRejectionReason: string;
  afterApprovalGenerateCode: string;
  productType: string;
  collectorGroup: string;
  loadBalance: string;
  random: string;
  // 自动分案配置
  timeRange: string;
  allocationTeam: string;
  allocationCollector: string;
  roundRobin: string;
  capacity: string;
  priority: string;
  maxPerCollector: string;
  lastExecution: string;
  notExecuted: string;
  // 营销管理
  groupName: string;
  uploadTime: string;
  customerCount: string;
  userId: string;
  customerGroupManagement: string;
  downloadTemplate: string;
  sendMethod: string;
  automatic: string;
  sendChannel: string;
  SMS: string;
  Push: string;
  sendContent: string;
  batchNumber: string;
  sendResult: string;
  success: string;
  failed: string;
  partial: string;
  sendCount: string;
  failCount: string;
  successRate: string;
  sent: string;
  resend: string;
  noNeedResend: string;
  templateName: string;
  smsContent: string;
  createTemplate: string;
  editTemplate: string;
  pleaseInputContent: string;
  tagType: string;
  language: string;
  businessCategory: string;
  conditionCount: string;
  userCount: string;
  addCondition: string;
  addConditionGroup: string;
  userTagManagement: string;
  totalTags: string;
  tagCategory: string;
  tagColor: string;
  pleaseInputDescription: string;
  condition: string;
  // 语言切换
  chinese: string;
  english: string;
  indonesian: string;
}

export const translations: Record<Language, Translations> = {
  zh: {
    // 工单审核相关
    workOrderReview: '工单审核',
    reviewWorkOrders: '审核工单申请，包括减免、停催、协催等业务场景',
    workOrderList: '工单列表',
    workOrderDetail: '工单详情',
    workOrderId: '工单编号',
    workOrderApprovedSuccess: '工单已批准',
    workOrderRejectedSuccess: '工单已驳回',
    workOrderCompleted: '工单已完成',
    approveWorkOrder: '批准工单',
    rejectWorkOrder: '驳回工单',
    approveComment: '批准意见',
    enterApproveComment: '请输入批准意见',
    applicationInformation: '申请信息',
    otherOrders: '其他工单',
    // 工单类型
    reductionApplication: '减免申请',
    suspendCollection: '停催申请',
    coCollection: '协催申请',
    // 字段
    amountOrDays: '金额/天数',
    targetCollector: '目标催收员',
    coCollectionReason: '协催原因',
    completed: '已完成',
    type: '类型',
    suspendDays: '停催天数',
    reason: '原因',
    // 通用
    customerGroup: '客群管理',
    smsTemplate: '短信模板',
    userTag: '用户标签',
    tagName: '标签名称',
    filterByTag: '按标签筛选',
    selectTag: '选择标签',
    filterCustomers: '筛选客户',
    export: '导出',
    batchSchedule: '批量排班',
    addSchedule: '添加排班',
    scheduled: '已排班',
    statusCompleted: '已完成',
    pending: '进行中',
    scheduleCalendar: '排班日历',
    todaySchedule: '今日排班',
    noScheduleToday: '今日无排班',
    scheduleList: '排班列表',
    selectDate: '选择日期',
    allCollectors: '全部催员',
    selectDepartment: '选择部门',
    allDepartments: '全部部门',
    resetFilter: '重置筛选',
    editSchedule: '编辑排班',
    pleaseSelect: '请选择',
    leaveReason: '请假原因',
    tips: '提示',
    batchScheduleSkipExisting: '批量排班将跳过已存在的记录',
    ensureDateRangeCorrect: '请确保日期范围正确',
    suggestMax30Days: '建议每次批量操作不超过30天',
    dateRange: '日期范围',
    pleaseSelectDateRange: '请选择日期范围',
    sickLeave: '病假',
    personalLeave: '事假',
    annualLeave: '年假',
    compensatoryLeave: '调休',
    otherLeave: '其他',
    pleaseInput: '请输入',
    day: '天',
    globalSearchPlaceholder: '案件、客户、电话...',
    callCenter: '呼叫中心',
    payments: '支付',
    documents: '文档',
    reports: '报表',
    profile: '个人资料',
    settings: '账户设置',
    logout: '退出登录',
    working: '上班',
    onLeave: '请假',
    holiday: '节假日',
    collectorName: '催员名称',
    date: '日期',
    markCompleted: '标记完成',
    markOnLeave: '标记请假',
    scheduleManagementTitle: '催员值班',
    all: '全部',
    roleName: '角色名称',
    description: '描述',
    permissionCount: '权限数量',
    normalStatus: '正常状态',
    minOverdueDays: '最小逾期天数',
    pleaseInputMinOverdueDays: '请输入最小逾期天数',
    maxOverdueDays: '最大逾期天数',
    pleaseInputMaxOverdueDays: '请输入最大逾期天数',
    reductionMethod: '减免方式',
    pleaseSelectReductionMethod: '请选择减免方式',
    fixedAmount: '固定金额',
    percentage: '百分比',
    reductionDetails: '减免详情',
    principalReduction: '本金减免',
    pleaseInputPrincipalReduction: '请输入本金减免',
    interestReduction: '利息减免',
    pleaseInputInterestReduction: '请输入利息减免',
    serviceFeeReduction: '服务费减免',
    pleaseInputServiceFeeReduction: '请输入服务费减免',
    penaltyReduction: '罚息减免',
    pleaseInputPenaltyReduction: '请输入罚息减免',
    unitCurrency: '元',
    unitPercent: '%',
    complaint: '投诉',
    death: '死亡',
    hospitalized: '住院',
    lawsuit: '起诉',
    other: '其他',
    prohibitAllocation: '禁止分案',
    prohibitSms: '禁止发送短信',
    prohibitCall: '禁止电话外呼',
    prohibitWa: '禁止WA发送',
    prohibitEmail: '禁止Email发送',
    stopPenalty: '停止计算罚息',
    pleaseSelectCasesToAssign: '请选择要指派的案件',
    pleaseSelectCollectionTeam: '请选择催收组',
    pleaseSelectCollector: '请选择催收员',
    successfullyAssigned: '成功指派 {count} 个案件',
    deleteSuccess: '删除成功',
    addSuccess: '添加成功',
    modifySuccess: '修改成功',
    alreadyExists: '该日期已存在排班记录',
    endDateBeforeStartDate: '结束日期不能早于开始日期',
    noNewRecords: '没有新的排班记录需要添加',
    pleaseAddValidCondition: '请至少添加一个有效条件',
    confirmRestoreCases: '确定要恢复选中的 {count} 个案件吗？',
    confirmDeleteTag: '确定要删除该标签吗？',
    reductionRuleDeleted: '减免规则删除成功',
    reductionRuleEdited: '减免规则编辑成功',
    search: '搜索',
    or: '或',
    total: '共',
    items: '条',
    manualAssignment: '人工指派案件',
    assignmentMode: '指派模式',
    assignByTeam: '按催收组分配',
    assignToCollector: '直接指定催收员',
    selectTeam: '选择催收组',
    distributionMethod: '分配方式',
    average: '均分',
    manual: '手动',
    selectCollector: '选择催收员',
    selected: '已选择',
    suspendSettings: '停催设置',
    pleaseSelectSuspendReason: '请选择停催原因',
    pleaseSelectForbiddenFeature: '请至少选择一项禁止功能',
    successfullyAddedToSuspended: '成功将 {count} 个案件加入停催列表',
    suspendReason: '停催原因',
    validityPeriod: '有效期',
    selectSuspendEndTime: '选择停催到期时间',
    forbiddenFeatures: '禁止功能',
    help: '帮助',
    collector: '催收员',
    overview: '概览',
    caseSummary: '案件摘要',
    loanType: '贷款类型',
    loanAmount: '贷款金额',
    disbursementDate: '放款日期',
    dueDate: '到期日期',
    daysPastDue: '逾期天数',
    caseStatus: '案件状态',
    lastPaymentDate: '最后还款日期',
    na: '无',
    nextAction: '下一步行动',
    recentActivity: '最近活动',
    viewAllActivity: '查看全部活动',
    stageConfig: '逾期阶段配置',
    stageCode: '阶段编码',
    stageName: '阶段名称',
    overdueRange: '逾期范围',
    status: '状态',
    action: '操作',
    addStage: '+ 新增阶段',
    edit: '编辑',
    delete: '删除',
    enabled: '启用',
    disabled: '停用',
    cancel: '取消',
    save: '保存',
    confirm: '确认',
    editStage: '编辑逾期阶段',
    addNewStage: '新增逾期阶段',
    stageNameLabel: '阶段名称',
    startDays: '逾期开始天数',
    endDays: '逾期结束天数',
    infinite: '无限大 (∞)',
    finite: '有限天数',
    deleteConfirmTitle: '确认删除',
    deleteConfirmContent: '删除后将影响分案策略，是否确认？',
    overlapError: '逾期区间存在重叠，请调整',
    minMaxError: '最小天数不能大于最大天数',
    filterByStage: '逾期阶段筛选',
    selectAll: '全选',
    assignTo: '批量分配至',
    confirmAssign: '确认分配',
    selectedCount: '已选择',
    casesSuffix: '件案件',
    borrowerName: '借款人',
    overdueDays: '逾期天数',
    overdueAmount: '逾期金额',
    noData: '暂无数据',
    creator: '创建人',
    createTime: '创建时间',
    updater: '更新人',
    updateTime: '更新时间',
    product: '产品',
    selectProduct: '请选择产品',
    allProducts: '全部产品',
    systemManagement: '系统管理',
    accountManagement: '账户管理',
    organizationStructure: '组织架构',
    department: '部门',
    position: '职位',
    username: '用户名',
    email: '邮箱',
    phone: '电话',
    role: '角色',
    addUser: '添加用户',
    editUser: '编辑用户',
    addDepartment: '添加部门',
    editDepartment: '编辑部门',
    parentDepartment: '上级部门',
    departmentName: '部门名称',
    departmentEditSuccess: '部门编辑成功',
    departmentAddSuccess: '部门添加成功',
    departmentStructure: '部门结构',
    people: '人',
    dashboard: '数据面板',
    adminDashboard: '管理员面板',
    collectorDashboard: '催员面板',
    totalCases: '总案件数',
    pendingCases: '待处理案件',
    completedCases: '已完成案件',
    recoveryRate: '回收率',
    totalAmount: '总金额',
    recoveredAmount: '已回收金额',
    currentTasks: '当前任务',
    completedTasks: '已完成任务',
    personalRecoveryRate: '个人回收率',
    recentActivities: '最近活动',
    performanceTrend: '业绩趋势',
    caseDistribution: '案件分布',
    overdueAnalysis: '逾期分析',
    teamPerformance: '团队绩效',
    topCollectors: '优秀催员',
    dailyRecovery: '每日回收',
    weeklyTrend: '周趋势',
    collectionSystem: '催收系统',
    caseList: '案件列表',
    recoveryList: '催回列表',
    reductionReview: '工单列表',
    suspendedCases: '停催列表',
    businessConfig: '业务配置',
    systemSettings: '系统设置',
    roleManagement: '角色管理',
    menuManagement: '菜单管理',
    dictionaryManagement: '字典管理',
    operationLog: '操作日志',
    marketingManagement: '营销管理',
    sendManagement: '发送管理',
    sendRecords: '发送记录',
    reductionRule: '减免规则',
    autoAllocation: '自动分案',
    overdueStage: '逾期阶段',
    scheduleManagement: '催员值班',
    suspendedCaseList: '停催列表',
    suspensionReason: '停催原因',
    suspensionDate: '停催日期',
    suspend: '停催',
    resume: '恢复',
    endTime: '停催到期时间',
    caseId: '案件号',
    suspensionTime: '停催时间',
    operator: '操作人',
    restoreTip: '恢复后案件将回到案件列表，所有限制将被解除。',
    confirmDelete: '确认删除',
    questionMark: '？',
    yes: '是',
    no: '否',
    member: '成员',
    customerName: '客户名称',
    joinDate: '入职日期',
    onJob: '在职',
    resigned: '离职',
    ruleName: '规则名称',
    billStatus: '账单状态',
    reductionRuleConfig: '减免规则配置',
    addReductionRule: '添加减免规则',
    editReductionRule: '编辑减免规则',
    pleaseInputRuleName: '请输入规则名称',
    consumerLoan: '消费贷',
    businessLoan: '经营贷',
    homeLoan: '房贷',
    carLoan: '车贷',
    pleaseSelectBillStatus: '请选择账单状态',
    isOverdue: '逾期',
    repaymentHistory: '还款记录',
    paymentDate: '还款日期',
    billNumber: '账单号',
    installments: '期数',
    amount: '金额',
    paymentChannel: '还款渠道',
    paymentMethod: '还款方式',
    paymentCode: '还款码',
    transactionNo: '交易号',
    collectionRecords: '催收记录',
    method: '方式',
    result: '结果',
    duration: '时长',
    recording: '录音',
    note: '备注',
    title: '标题',
    sentDate: '发送日期',
    billInformation: '账单信息',
    billId: '账单ID',
    orderId: '订单ID',
    billAmount: '账单金额',
    paidAmount: '已付金额',
    vaManagement: 'VA管理',
    validVA: '有效VA',
    vaId: 'VA ID',
    bank: '银行',
    vaNumber: 'VA号码',
    expireTime: '过期时间',
    caseNo: '案件号',
    stage: '阶段',
    statusPending: '待处理',
    statusProcessing: '处理中',
    detail: '详情',
    cases: '案件',
    assignedTime: '分配时间',
    originalAmount: '原始金额',
    team: '团队',
    recoveryMethod: '催收方式',
    remark: '备注',
    startDate: '开始日期',
    endDate: '结束日期',
    reductionApprovedSuccess: '减免申请已通过',
    reductionRejectedSuccess: '减免申请已拒绝',
    paymentCodeGeneratedSuccess: '支付码已生成',
    paymentCompletedSuccess: '支付已完成',
    applicationId: '申请ID',
    customer: '客户',
    applyTime: '申请时间',
    applyBy: '申请人',
    requested: '已申请',
    approvedAmount: '批准金额',
    pendingReview: '待审核',
    approve: '批准',
    reject: '拒绝',
    generateVa: '生成VA',
    confirmPayment: '确认支付',
    reviewReductionApplications: '减免申请审核',
    pendingReviewCount: '待审核数量',
    totalReductionAmount: '减免总金额',
    applicationList: '申请列表',
    reductionApplicationDetail: '减免申请详情',
    billDetails: '账单详情',
    reduction: '减免',
    finalAmount: '最终金额',
    requestedReduction: '申请减免',
    approvedReduction: '批准减免',
    searchPlaceholder: '搜索占位符',
    reviewInformation: '审核信息',
    reviewTime: '审核时间',
    reviewer: '审核人',
    comment: '备注',
    paymentInformation: '支付信息',
    waitingForPayment: '等待支付',
    completedTime: '完成时间',
    processTimeline: '处理时间线',
    applicationSubmitted: '申请已提交',
    by: '由',
    paymentCodeGenerated: '支付码已生成',
    generating: '生成中',
    code: '编码',
    paidAt: '支付时间',
    completedAndSettled: '已完成并结算',
    max: '最大',
    rejectionReason: '拒绝原因',
    enterRejectionReason: '请输入拒绝原因',
    afterApprovalGenerateCode: '审批后生成支付码',
    productType: '产品类型',
    collectorGroup: '催收组',
    loadBalance: '负载均衡',
    random: '随机',
    timeRange: '时间范围',
    allocationTeam: '分配到组',
    allocationCollector: '分配到催员',
    roundRobin: '轮询分配',
    capacity: '容量分配',
    priority: '优先级',
    maxPerCollector: '单催员最大数',
    lastExecution: '上次执行',
    notExecuted: '未执行',
    groupName: '客群名称',
    uploadTime: '上传时间',
    customerCount: '客户数量',
    userId: '用户ID',
    customerGroupManagement: '客群管理',
    downloadTemplate: '下载模板',
    sendMethod: '发送方式',
    automatic: '自动',
    sendChannel: '发送渠道',
    SMS: '短信',
    Push: '推送',
    sendContent: '发送内容',
    batchNumber: '批次号',
    sendResult: '发送结果',
    success: '成功',
    failed: '失败',
    partial: '部分成功',
    sendCount: '发送数量',
    failCount: '失败数量',
    successRate: '成功率',
    sent: '已发送',
    resend: '重新发送',
    noNeedResend: '无需重发',
    templateName: '模板名称',
    smsContent: '短信内容',
    createTemplate: '创建模板',
    editTemplate: '编辑模板',
    pleaseInputContent: '请输入内容',
    tagType: '标签类型',
    language: '语言',
    businessCategory: '业务类别',
    conditionCount: '条件数量',
    userCount: '用户数量',
    addCondition: '添加条件',
    addConditionGroup: '添加条件组',
    userTagManagement: '用户标签管理',
    totalTags: '标签总数',
    tagCategory: '标签分类',
    tagColor: '标签颜色',
    pleaseInputDescription: '请输入描述',
    condition: '条件',
    chinese: '中文',
    english: 'English',
    indonesian: 'Bahasa',
  },
  en: {
    // 工单审核相关
    workOrderReview: 'Work Order Review',
    reviewWorkOrders: 'Review work order applications, including reduction, suspend collection, co-collection and other business scenarios',
    workOrderList: 'Work Order List',
    workOrderDetail: 'Work Order Detail',
    workOrderId: 'Work Order ID',
    workOrderApprovedSuccess: 'Work order approved',
    workOrderRejectedSuccess: 'Work order rejected',
    workOrderCompleted: 'Work order completed',
    approveWorkOrder: 'Approve Work Order',
    rejectWorkOrder: 'Reject Work Order',
    approveComment: 'Approve Comment',
    enterApproveComment: 'Enter approve comment',
    applicationInformation: 'Application Information',
    otherOrders: 'Other Orders',
    // 工单类型
    reductionApplication: 'Reduction Application',
    suspendCollection: 'Suspend Collection',
    coCollection: 'Co-Collection',
    // 字段
    amountOrDays: 'Amount/Days',
    targetCollector: 'Target Collector',
    coCollectionReason: 'Co-Collection Reason',
    completed: 'Completed',
    type: 'Type',
    suspendDays: 'Suspend Days',
    reason: 'Reason',
    // 通用
    customerGroup: 'Customer Group',
    smsTemplate: 'SMS Template',
    userTag: 'User Tag',
    tagName: 'Tag Name',
    filterByTag: 'Filter by Tag',
    selectTag: 'Select Tag',
    filterCustomers: 'Filter Customers',
    export: 'Export',
    batchSchedule: 'Batch Schedule',
    addSchedule: 'Add Schedule',
    scheduled: 'Scheduled',
    statusCompleted: 'Completed',
    pending: 'In Progress',
    scheduleCalendar: 'Schedule Calendar',
    todaySchedule: "Today's Schedule",
    noScheduleToday: 'No schedule today',
    scheduleList: 'Schedule List',
    selectDate: 'Select Date',
    allCollectors: 'All Collectors',
    selectDepartment: 'Select Department',
    allDepartments: 'All Departments',
    resetFilter: 'Reset Filter',
    editSchedule: 'Edit Schedule',
    pleaseSelect: 'Please select',
    leaveReason: 'Leave Reason',
    tips: 'Tips',
    batchScheduleSkipExisting: 'Batch scheduling will skip existing records',
    ensureDateRangeCorrect: 'Please ensure date range is correct',
    suggestMax30Days: 'Suggest max 30 days per batch',
    dateRange: 'Date Range',
    pleaseSelectDateRange: 'Please select date range',
    sickLeave: 'Sick Leave',
    personalLeave: 'Personal Leave',
    annualLeave: 'Annual Leave',
    compensatoryLeave: 'Compensatory Leave',
    otherLeave: 'Others',
    pleaseInput: 'Please input',
    day: 'Days',
    globalSearchPlaceholder: 'case, customer, phone...',
    callCenter: 'Call Center',
    payments: 'Payments',
    documents: 'Documents',
    reports: 'Reports',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    working: 'Working',
    onLeave: 'On Leave',
    holiday: 'Holiday',
    collectorName: 'Collector Name',
    date: 'Date',
    markCompleted: 'Mark Completed',
    markOnLeave: 'Mark On Leave',
    scheduleManagementTitle: 'Collector Schedule',
    all: 'All',
    roleName: 'Role Name',
    description: 'Description',
    permissionCount: 'Permission Count',
    normalStatus: 'Normal Status',
    minOverdueDays: 'Min Overdue Days',
    pleaseInputMinOverdueDays: 'Please input min overdue days',
    maxOverdueDays: 'Max Overdue Days',
    pleaseInputMaxOverdueDays: 'Please input max overdue days',
    reductionMethod: 'Reduction Method',
    pleaseSelectReductionMethod: 'Please select reduction method',
    fixedAmount: 'Fixed Amount',
    percentage: 'Percentage',
    reductionDetails: 'Reduction Details',
    principalReduction: 'Principal Reduction',
    pleaseInputPrincipalReduction: 'Please input principal reduction',
    interestReduction: 'Interest Reduction',
    pleaseInputInterestReduction: 'Please input interest reduction',
    serviceFeeReduction: 'Service Fee Reduction',
    pleaseInputServiceFeeReduction: 'Please input service fee reduction',
    penaltyReduction: 'Penalty Reduction',
    pleaseInputPenaltyReduction: 'Please input penalty reduction',
    unitCurrency: '$',
    unitPercent: '%',
    complaint: 'Complaint',
    death: 'Death',
    hospitalized: 'Hospitalized',
    lawsuit: 'Lawsuit',
    other: 'Other',
    prohibitAllocation: 'Prohibit Allocation',
    prohibitSms: 'Prohibit SMS',
    prohibitCall: 'Prohibit Call',
    prohibitWa: 'Prohibit WA',
    prohibitEmail: 'Prohibit Email',
    stopPenalty: 'Stop Penalty',
    pleaseSelectCasesToAssign: 'Please select cases to assign',
    pleaseSelectCollectionTeam: 'Please select collection team',
    pleaseSelectCollector: 'Please select collector',
    successfullyAssigned: 'Successfully assigned {count} cases',
    deleteSuccess: 'Deleted successfully',
    addSuccess: 'Added successfully',
    modifySuccess: 'Modified successfully',
    alreadyExists: 'Schedule record already exists for this date',
    endDateBeforeStartDate: 'End date cannot be earlier than start date',
    noNewRecords: 'No new schedule records to add',
    pleaseAddValidCondition: 'Please add at least one valid condition',
    confirmRestoreCases: 'Are you sure you want to restore {count} selected cases?',
    confirmDeleteTag: 'Are you sure you want to delete this tag?',
    reductionRuleDeleted: 'Reduction rule deleted successfully',
    reductionRuleEdited: 'Reduction rule edited successfully',
    search: 'Search',
    or: 'or',
    total: 'Total',
    items: 'items',
    manualAssignment: 'Manual Assignment',
    assignmentMode: 'Assignment Mode',
    assignByTeam: 'Assign by Team',
    assignToCollector: 'Assign to Collector',
    selectTeam: 'Select Team',
    distributionMethod: 'Distribution Method',
    average: 'Average',
    manual: 'Manual',
    selectCollector: 'Select Collector',
    selected: 'Selected',
    suspendSettings: 'Suspend Settings',
    pleaseSelectSuspendReason: 'Please select suspend reason',
    pleaseSelectForbiddenFeature: 'Please select at least one forbidden feature',
    successfullyAddedToSuspended: 'Successfully added {count} cases to suspended list',
    suspendReason: 'Suspend Reason',
    validityPeriod: 'Validity Period',
    selectSuspendEndTime: 'Select suspend end time',
    forbiddenFeatures: 'Forbidden Features',
    help: 'Help',
    collector: 'Collector',
    overview: 'Overview',
    caseSummary: 'Case Summary',
    loanType: 'Loan Type',
    loanAmount: 'Loan Amount',
    disbursementDate: 'Disbursement Date',
    dueDate: 'Due Date',
    daysPastDue: 'Days Past Due',
    caseStatus: 'Case Status',
    lastPaymentDate: 'Last Payment Date',
    na: 'N/A',
    nextAction: 'Next Action',
    recentActivity: 'Recent Activity',
    viewAllActivity: 'View all activity',
    stageConfig: 'Stage Configuration',
    stageCode: 'Stage Code',
    stageName: 'Stage Name',
    overdueRange: 'Overdue Range',
    status: 'Status',
    action: 'Action',
    addStage: '+ Add Stage',
    edit: 'Edit',
    delete: 'Delete',
    enabled: 'Enabled',
    disabled: 'Disabled',
    cancel: 'Cancel',
    save: 'Save',
    confirm: 'Confirm',
    editStage: 'Edit Stage',
    addNewStage: 'Add New Stage',
    stageNameLabel: 'Stage Name',
    startDays: 'Start Days',
    endDays: 'End Days',
    infinite: 'Infinite (∞)',
    finite: 'Finite Days',
    deleteConfirmTitle: 'Confirm Delete',
    deleteConfirmContent: 'Deleting will affect case distribution strategy, confirm?',
    overlapError: 'Overdue range overlap, please adjust',
    minMaxError: 'Min days cannot be greater than max days',
    filterByStage: 'Filter by Stage',
    selectAll: 'Select All',
    assignTo: 'Assign To',
    confirmAssign: 'Confirm Assign',
    selectedCount: 'Selected',
    casesSuffix: 'cases',
    borrowerName: 'Borrower',
    overdueDays: 'Overdue Days',
    overdueAmount: 'Overdue Amount',
    noData: 'No Data',
    creator: 'Creator',
    createTime: 'Create Time',
    updater: 'Updater',
    updateTime: 'Update Time',
    product: 'Product',
    selectProduct: 'Select Product',
    allProducts: 'All Products',
    systemManagement: 'System Management',
    accountManagement: 'Account Management',
    organizationStructure: 'Organization Structure',
    department: 'Department',
    position: 'Position',
    username: 'Username',
    email: 'Email',
    phone: 'Phone',
    role: 'Role',
    addUser: 'Add User',
    editUser: 'Edit User',
    addDepartment: 'Add Department',
    editDepartment: 'Edit Department',
    parentDepartment: 'Parent Department',
    departmentName: 'Department Name',
    departmentEditSuccess: 'Department edited successfully',
    departmentAddSuccess: 'Department added successfully',
    departmentStructure: 'Department Structure',
    people: 'people',
    dashboard: 'Dashboard',
    adminDashboard: 'Admin Dashboard',
    collectorDashboard: 'Collector Dashboard',
    totalCases: 'Total Cases',
    pendingCases: 'Pending Cases',
    completedCases: 'Completed Cases',
    recoveryRate: 'Recovery Rate',
    totalAmount: 'Total Amount',
    recoveredAmount: 'Recovered Amount',
    currentTasks: 'Current Tasks',
    completedTasks: 'Completed Tasks',
    personalRecoveryRate: 'Personal Recovery Rate',
    recentActivities: 'Recent Activities',
    performanceTrend: 'Performance Trend',
    caseDistribution: 'Case Distribution',
    overdueAnalysis: 'Overdue Analysis',
    teamPerformance: 'Team Performance',
    topCollectors: 'Top Collectors',
    dailyRecovery: 'Daily Recovery',
    weeklyTrend: 'Weekly Trend',
    collectionSystem: 'Collection System',
    caseList: 'Case List',
    recoveryList: 'Recovery List',
    reductionReview: 'Reduction Review',
    suspendedCases: 'Suspended Cases',
    businessConfig: 'Business Configuration',
    systemSettings: 'System Settings',
    roleManagement: 'Role Management',
    menuManagement: 'Menu Management',
    dictionaryManagement: 'Dictionary Management',
    operationLog: 'Operation Log',
    marketingManagement: 'Marketing Management',
    sendManagement: 'Send Management',
    sendRecords: 'Send Records',
    reductionRule: 'Reduction Rule',
    autoAllocation: 'Auto Allocation',
    overdueStage: 'Overdue Stage',
    scheduleManagement: 'Collector Schedule',
    suspendedCaseList: 'Suspended Case List',
    suspensionReason: 'Suspension Reason',
    suspensionDate: 'Suspension Date',
    suspend: 'Suspend',
    resume: 'Resume',
    endTime: 'End Time',
    caseId: 'Case ID',
    suspensionTime: 'Suspension Time',
    operator: 'Operator',
    restoreTip: 'After restoration, cases will return to the case list and all restrictions will be lifted.',
    confirmDelete: 'Confirm Delete',
    questionMark: '?',
    yes: 'Yes',
    no: 'No',
    member: 'Member',
    customerName: 'Customer Name',
    joinDate: 'Join Date',
    onJob: 'On Job',
    resigned: 'Resigned',
    ruleName: 'Rule Name',
    billStatus: 'Bill Status',
    reductionRuleConfig: 'Reduction Rule Config',
    addReductionRule: 'Add Reduction Rule',
    editReductionRule: 'Edit Reduction Rule',
    pleaseInputRuleName: 'Please input rule name',
    consumerLoan: 'Consumer Loan',
    businessLoan: 'Business Loan',
    homeLoan: 'Home Loan',
    carLoan: 'Car Loan',
    pleaseSelectBillStatus: 'Please select bill status',
    isOverdue: 'Overdue',
    repaymentHistory: 'Repayment History',
    paymentDate: 'Payment Date',
    billNumber: 'Bill Number',
    installments: 'Installments',
    amount: 'Amount',
    paymentChannel: 'Payment Channel',
    paymentMethod: 'Payment Method',
    paymentCode: 'Payment Code',
    transactionNo: 'Transaction No',
    collectionRecords: 'Collection Records',
    method: 'Method',
    result: 'Result',
    duration: 'Duration',
    recording: 'Recording',
    note: 'Note',
    title: 'Title',
    sentDate: 'Sent Date',
    billInformation: 'Bill Information',
    billId: 'Bill ID',
    orderId: 'Order ID',
    billAmount: 'Bill Amount',
    paidAmount: 'Paid Amount',
    vaManagement: 'VA Management',
    validVA: 'Valid VA',
    vaId: 'VA ID',
    bank: 'Bank',
    vaNumber: 'VA Number',
    expireTime: 'Expire Time',
    caseNo: 'Case No',
    stage: 'Stage',
    statusPending: 'Pending',
    statusProcessing: 'Processing',
    detail: 'Detail',
    cases: 'Cases',
    assignedTime: 'Assigned Time',
    originalAmount: 'Original Amount',
    team: 'Team',
    recoveryMethod: 'Recovery Method',
    remark: 'Remark',
    startDate: 'Start Date',
    endDate: 'End Date',
    reductionApprovedSuccess: 'Reduction application approved',
    reductionRejectedSuccess: 'Reduction application rejected',
    paymentCodeGeneratedSuccess: 'Payment code generated',
    paymentCompletedSuccess: 'Payment completed',
    applicationId: 'Application ID',
    customer: 'Customer',
    applyTime: 'Apply Time',
    applyBy: 'Apply By',
    requested: 'Requested',
    approvedAmount: 'Approved Amount',
    pendingReview: 'Pending Review',
    approve: 'Approve',
    reject: 'Reject',
    generateVa: 'Generate VA',
    confirmPayment: 'Confirm Payment',
    reviewReductionApplications: 'Review Reduction Applications',
    pendingReviewCount: 'Pending Review Count',
    totalReductionAmount: 'Total Reduction Amount',
    applicationList: 'Application List',
    reductionApplicationDetail: 'Reduction Application Detail',
    billDetails: 'Bill Details',
    reduction: 'Reduction',
    finalAmount: 'Final Amount',
    requestedReduction: 'Requested Reduction',
    approvedReduction: 'Approved Reduction',
    searchPlaceholder: 'Search placeholder',
    reviewInformation: 'Review Information',
    reviewTime: 'Review Time',
    reviewer: 'Reviewer',
    comment: 'Comment',
    paymentInformation: 'Payment Information',
    waitingForPayment: 'Waiting for Payment',
    completedTime: 'Completed Time',
    processTimeline: 'Process Timeline',
    applicationSubmitted: 'Application Submitted',
    by: 'By',
    paymentCodeGenerated: 'Payment Code Generated',
    generating: 'Generating',
    code: 'Code',
    paidAt: 'Paid At',
    completedAndSettled: 'Completed and Settled',
    max: 'Max',
    rejectionReason: 'Rejection Reason',
    enterRejectionReason: 'Enter rejection reason',
    afterApprovalGenerateCode: 'Generate code after approval',
    productType: 'Product Type',
    collectorGroup: 'Collector Group',
    loadBalance: 'Load Balance',
    random: 'Random',
    timeRange: 'Time Range',
    allocationTeam: 'Allocation Team',
    allocationCollector: 'Allocation Collector',
    roundRobin: 'Round Robin',
    capacity: 'Capacity',
    priority: 'Priority',
    maxPerCollector: 'Max Per Collector',
    lastExecution: 'Last Execution',
    notExecuted: 'Not Executed',
    groupName: 'Group Name',
    uploadTime: 'Upload Time',
    customerCount: 'Customer Count',
    userId: 'User ID',
    customerGroupManagement: 'Customer Group Management',
    downloadTemplate: 'Download Template',
    sendMethod: 'Send Method',
    automatic: 'Automatic',
    sendChannel: 'Send Channel',
    SMS: 'SMS',
    Push: 'Push',
    sendContent: 'Send Content',
    batchNumber: 'Batch Number',
    sendResult: 'Send Result',
    success: 'Success',
    failed: 'Failed',
    partial: 'Partial',
    sendCount: 'Send Count',
    failCount: 'Fail Count',
    successRate: 'Success Rate',
    sent: 'Sent',
    resend: 'Resend',
    noNeedResend: 'No Need Resend',
    templateName: 'Template Name',
    smsContent: 'SMS Content',
    createTemplate: 'Create Template',
    editTemplate: 'Edit Template',
    pleaseInputContent: 'Please input content',
    tagType: 'Tag Type',
    language: 'Language',
    businessCategory: 'Business Category',
    conditionCount: 'Condition Count',
    userCount: 'User Count',
    addCondition: 'Add Condition',
    addConditionGroup: 'Add Condition Group',
    userTagManagement: 'User Tag Management',
    totalTags: 'Total Tags',
    tagCategory: 'Tag Category',
    tagColor: 'Tag Color',
    pleaseInputDescription: 'Please input description',
    condition: 'Condition',
    chinese: '中文',
    english: 'English',
    indonesian: 'Bahasa',
  },
  id: {
    // 工单审核相关
    workOrderReview: 'Review Pekerjaan',
    reviewWorkOrders: 'Tinjau permintaan pesanan kerja, termasuk pengurangan, penangguhan koleksi, koleksi bersama, dan skenario bisnis lainnya',
    workOrderList: 'Daftar Pekerjaan',
    workOrderDetail: 'Detail Pekerjaan',
    workOrderId: 'ID Pekerjaan',
    workOrderApprovedSuccess: 'Pekerjaan disetujui',
    workOrderRejectedSuccess: 'Pekerjaan ditolak',
    workOrderCompleted: 'Pekerjaan selesai',
    approveWorkOrder: 'Setujui Pekerjaan',
    rejectWorkOrder: 'Tolak Pekerjaan',
    approveComment: 'Komentar Persetujuan',
    enterApproveComment: 'Masukkan komentar persetujuan',
    applicationInformation: 'Informasi Pengajuan',
    otherOrders: 'Pesanan Lainnya',
    // 工单类型
    reductionApplication: 'Pengajuan Pengurangan',
    suspendCollection: 'Penangguhan Koleksi',
    coCollection: 'Koleksi Bersama',
    // 字段
    amountOrDays: 'Jumlah/Hari',
    targetCollector: 'Pengumpul Target',
    coCollectionReason: 'Alasan Koleksi Bersama',
    completed: 'Selesai',
    type: 'Tipe',
    suspendDays: 'Hari Penangguhan',
    reason: 'Alasan',
    // 通用
    customerGroup: 'Grup Pelanggan',
    smsTemplate: 'Template SMS',
    userTag: 'Tag Pengguna',
    tagName: 'Nama Tag',
    filterByTag: 'Filter Berdasarkan Tag',
    selectTag: 'Pilih Tag',
    filterCustomers: 'Filter Pelanggan',
    export: 'Ekspor',
    batchSchedule: 'Jadwal Massal',
    addSchedule: 'Tambah Jadwal',
    scheduled: 'Telah Dijadwalkan',
    statusCompleted: 'Selesai',
    pending: 'Sedang Berjalan',
    scheduleCalendar: 'Kalender Jadwal',
    todaySchedule: 'Jadwal Hari Ini',
    noScheduleToday: 'Tidak ada jadwal hari ini',
    scheduleList: 'Daftar Jadwal',
    selectDate: 'Pilih Tanggal',
    allCollectors: 'Semua Kolektor',
    selectDepartment: 'Pilih Departemen',
    allDepartments: 'Semua Departemen',
    resetFilter: 'Reset Filter',
    editSchedule: 'Edit Jadwal',
    pleaseSelect: 'Silakan pilih',
    leaveReason: 'Alasan Cuti',
    tips: 'Tips',
    batchScheduleSkipExisting: 'Jadwal massal akan melewati catatan yang sudah ada',
    ensureDateRangeCorrect: 'Silakan pastikan rentang tanggal benar',
    suggestMax30Days: 'Sarankan maksimal 30 hari per batch',
    dateRange: 'Rentang Tanggal',
    pleaseSelectDateRange: 'Silakan pilih rentang tanggal',
    sickLeave: 'Cuti Sakit',
    personalLeave: 'Cuti Pribadi',
    annualLeave: 'Cuti Tahunan',
    compensatoryLeave: 'Cuti Kompensasi',
    otherLeave: 'Lainnya',
    pleaseInput: 'Silakan masukkan',
    day: 'Hari',
    globalSearchPlaceholder: 'kasus, pelanggan, telepon...',
    callCenter: 'Pusat Panggilan',
    payments: 'Pembayaran',
    documents: 'Dokumen',
    reports: 'Laporan',
    profile: 'Profil',
    settings: 'Pengaturan',
    logout: 'Keluar',
    working: 'Bekerja',
    onLeave: 'Cuti',
    holiday: 'Hari Libur',
    collectorName: 'Nama Kolektor',
    date: 'Tanggal',
    markCompleted: 'Tandai Selesai',
    markOnLeave: 'Tandai Cuti',
    scheduleManagementTitle: 'Jadwal Kolektor',
    all: 'Semua',
    roleName: 'Nama Peran',
    description: 'Deskripsi',
    permissionCount: 'Jumlah Izin',
    normalStatus: 'Status Normal',
    minOverdueDays: 'Hari Tertinggal Minimum',
    pleaseInputMinOverdueDays: 'Silakan masukkan hari tertinggal minimum',
    maxOverdueDays: 'Hari Tertinggal Maksimum',
    pleaseInputMaxOverdueDays: 'Silakan masukkan hari tertinggal maksimum',
    reductionMethod: 'Metode Pengurangan',
    pleaseSelectReductionMethod: 'Silakan pilih metode pengurangan',
    fixedAmount: 'Jumlah Tetap',
    percentage: 'Persentase',
    reductionDetails: 'Detail Pengurangan',
    principalReduction: 'Pengurangan Pokok',
    pleaseInputPrincipalReduction: 'Silakan masukkan pengurangan pokok',
    interestReduction: 'Pengurangan Bunga',
    pleaseInputInterestReduction: 'Silakan masukkan pengurangan bunga',
    serviceFeeReduction: 'Pengurangan Biaya Layanan',
    pleaseInputServiceFeeReduction: 'Silakan masukkan pengurangan biaya layanan',
    penaltyReduction: 'Pengurangan Denda',
    pleaseInputPenaltyReduction: 'Silakan masukkan pengurangan denda',
    unitCurrency: 'Rp',
    unitPercent: '%',
    complaint: 'Keluhan',
    death: 'Kematian',
    hospitalized: 'Dirawat',
    lawsuit: 'Tuntutan',
    other: 'Lainnya',
    prohibitAllocation: 'Larangan Alokasi',
    prohibitSms: 'Larangan SMS',
    prohibitCall: 'Larangan Panggilan',
    prohibitWa: 'Larangan WA',
    prohibitEmail: 'Larangan Email',
    stopPenalty: 'Hentikan Denda',
    pleaseSelectCasesToAssign: 'Silakan pilih kasus untuk ditugaskan',
    pleaseSelectCollectionTeam: 'Silakan pilih tim koleksi',
    pleaseSelectCollector: 'Silakan pilih kolektor',
    successfullyAssigned: 'Berhasil menugaskan {count} kasus',
    deleteSuccess: 'Dihapus berhasil',
    addSuccess: 'Ditambahkan berhasil',
    modifySuccess: 'Dimodifikasi berhasil',
    alreadyExists: 'Rekaman jadwal sudah ada untuk tanggal ini',
    endDateBeforeStartDate: 'Tanggal akhir tidak dapat lebih awal dari tanggal mulai',
    noNewRecords: 'Tidak ada rekaman jadwal baru untuk ditambahkan',
    pleaseAddValidCondition: 'Silakan tambahkan setidaknya satu kondisi valid',
    confirmRestoreCases: 'Apakah Anda yakin ingin memulihkan {count} kasus terpilih?',
    confirmDeleteTag: 'Apakah Anda yakin ingin menghapus tag ini?',
    reductionRuleDeleted: 'Aturan pengurangan dihapus berhasil',
    reductionRuleEdited: 'Aturan pengurangan diedit berhasil',
    search: 'Cari',
    or: 'atau',
    total: 'Total',
    items: 'item',
    manualAssignment: 'Penugasan Manual',
    assignmentMode: 'Mode Penugasan',
    assignByTeam: 'Tugaskan per Tim',
    assignToCollector: 'Tugaskan ke Kolektor',
    selectTeam: 'Pilih Tim',
    distributionMethod: 'Metode Distribusi',
    average: 'Rata-rata',
    manual: 'Manual',
    selectCollector: 'Pilih Kolektor',
    selected: 'Dipilih',
    suspendSettings: 'Pengaturan Tertunda',
    pleaseSelectSuspendReason: 'Silakan pilih alasan tunda',
    pleaseSelectForbiddenFeature: 'Silakan pilih setidaknya satu fitur terlarang',
    successfullyAddedToSuspended: 'Berhasil menambahkan {count} kasus ke daftar tertunda',
    suspendReason: 'Alasan Tunda',
    validityPeriod: 'Masa Berlaku',
    selectSuspendEndTime: 'Pilih waktu akhir tunda',
    forbiddenFeatures: 'Fitur Terlarang',
    help: 'Bantuan',
    collector: 'Kolektor',
    overview: 'Ringkasan',
    caseSummary: 'Ringkasan Kasus',
    loanType: 'Tipe Pinjaman',
    loanAmount: 'Jumlah Pinjaman',
    disbursementDate: 'Tanggal Pencairan',
    dueDate: 'Tanggal Jatuh Tempo',
    daysPastDue: 'Hari Terlambat',
    caseStatus: 'Status Kasus',
    lastPaymentDate: 'Tanggal Pembayaran Terakhir',
    na: 'Tidak Ada',
    nextAction: 'Aksi Berikutnya',
    recentActivity: 'Aktivitas Terkini',
    viewAllActivity: 'Lihat semua aktivitas',
    stageConfig: 'Konfigurasi Tahap',
    stageCode: 'Kode Tahap',
    stageName: 'Nama Tahap',
    overdueRange: 'Rentang',
    status: 'Status',
    action: 'Aksi',
    addStage: '+ Tambah',
    edit: 'Edit',
    delete: 'Hapus',
    enabled: 'Aktif',
    disabled: 'Nonaktif',
    cancel: 'Batal',
    save: 'Simpan',
    confirm: 'Konfirmasi',
    editStage: 'Edit Tahap',
    addNewStage: 'Tambah Tahap',
    stageNameLabel: 'Nama Tahap',
    startDays: 'Hari Mulai',
    endDays: 'Hari Akhir',
    infinite: 'Tak Terhingga',
    finite: 'Terbatas',
    deleteConfirmTitle: 'Konfirmasi',
    deleteConfirmContent: 'Hapus akan memengaruhi strategi?',
    overlapError: 'Rentang tumpang tindih',
    minMaxError: 'Min tidak boleh > Max',
    filterByStage: 'Filter Tahap',
    selectAll: 'Pilih Semua',
    assignTo: 'Distribusikan ke',
    confirmAssign: 'Konfirmasi',
    selectedCount: 'Dipilih',
    casesSuffix: 'kasus',
    borrowerName: 'Nama',
    overdueDays: 'Hari',
    overdueAmount: 'Jumlah',
    noData: 'Tidak ada',
    creator: 'Pembuat',
    createTime: 'Waktu Buat',
    updater: 'Pengubah',
    updateTime: 'Waktu Ubah',
    product: 'Produk',
    selectProduct: 'Pilih Produk',
    allProducts: 'Semua Produk',
    systemManagement: 'Manajemen Sistem',
    accountManagement: 'Manajemen Akun',
    organizationStructure: 'Struktur Organisasi',
    department: 'Departemen',
    position: 'Posisi',
    username: 'Nama Pengguna',
    email: 'Email',
    phone: 'Telepon',
    role: 'Peran',
    addUser: 'Tambah Pengguna',
    editUser: 'Edit Pengguna',
    addDepartment: 'Tambah Departemen',
    editDepartment: 'Edit Departemen',
    parentDepartment: 'Departemen Induk',
    departmentName: 'Nama Departemen',
    departmentEditSuccess: 'Departemen berhasil diedit',
    departmentAddSuccess: 'Departemen berhasil ditambahkan',
    departmentStructure: 'Struktur Departemen',
    people: 'orang',
    dashboard: 'Dashboard',
    adminDashboard: 'Dashboard Admin',
    collectorDashboard: 'Dashboard Kolektor',
    totalCases: 'Total Kasus',
    pendingCases: 'Kasus Menunggu',
    completedCases: 'Kasus Selesai',
    recoveryRate: 'Tingkat Pemulihan',
    totalAmount: 'Jumlah Total',
    recoveredAmount: 'Jumlah Dikembalikan',
    currentTasks: 'Tugas Saat Ini',
    completedTasks: 'Tugas Selesai',
    personalRecoveryRate: 'Tingkat Pemulihan Pribadi',
    recentActivities: 'Aktivitas Terbaru',
    performanceTrend: 'Tren Kinerja',
    caseDistribution: 'Distribusi Kasus',
    overdueAnalysis: 'Analisis Keterlambatan',
    teamPerformance: 'Kinerja Tim',
    topCollectors: 'Kolektor Terbaik',
    dailyRecovery: 'Pemulihan Harian',
    weeklyTrend: 'Tren Mingguan',
    collectionSystem: 'Sistem Penagihan',
    caseList: 'Daftar Kasus',
    recoveryList: 'Daftar Pemulihan',
    reductionReview: 'Review Pengurangan',
    suspendedCases: 'Kasus Ditangguhkan',
    businessConfig: 'Konfigurasi Bisnis',
    systemSettings: 'Pengaturan Sistem',
    roleManagement: 'Manajemen Peran',
    menuManagement: 'Manajemen Menu',
    dictionaryManagement: 'Manajemen Kamus',
    operationLog: 'Log Operasi',
    marketingManagement: 'Manajemen Pemasaran',
    sendManagement: 'Manajemen Pengiriman',
    sendRecords: 'Catatan Pengiriman',
    reductionRule: 'Aturan Pengurangan',
    autoAllocation: 'Alokasi Otomatis',
    overdueStage: 'Tahap Keterlambatan',
    scheduleManagement: 'Jadwal Kolektor',
    suspendedCaseList: 'Daftar Kasus Ditangguhkan',
    suspensionReason: 'Alasan Penangguhan',
    suspensionDate: 'Tanggal Penangguhan',
    suspend: 'Tangguhkan',
    resume: 'Lanjutkan',
    endTime: 'Waktu Akhir',
    caseId: 'ID Kasus',
    suspensionTime: 'Waktu Penangguhan',
    operator: 'Operator',
    restoreTip: 'Setelah dipulihkan, kasus akan kembali ke daftar kasus dan semua batasan akan dihapus.',
    confirmDelete: 'Konfirmasi Hapus',
    questionMark: '?',
    yes: 'Ya',
    no: 'Tidak',
    member: 'Anggota',
    customerName: 'Nama Pelanggan',
    joinDate: 'Tanggal Bergabung',
    onJob: 'Bekerja',
    resigned: 'Mengundurkan Diri',
    ruleName: 'Nama Aturan',
    billStatus: 'Status Tagihan',
    reductionRuleConfig: 'Konfigurasi Aturan Pengurangan',
    addReductionRule: 'Tambah Aturan Pengurangan',
    editReductionRule: 'Edit Aturan Pengurangan',
    pleaseInputRuleName: 'Silakan masukkan nama aturan',
    consumerLoan: 'Pinjaman Konsumen',
    businessLoan: 'Pinjaman Bisnis',
    homeLoan: 'Pinjaman Rumah',
    carLoan: 'Pinjaman Mobil',
    pleaseSelectBillStatus: 'Silakan pilih status tagihan',
    isOverdue: 'Terlambat',
    repaymentHistory: 'Riwayat Pembayaran',
    paymentDate: 'Tanggal Pembayaran',
    billNumber: 'Nomor Tagihan',
    installments: 'Angsuran',
    amount: 'Jumlah',
    paymentChannel: 'Saluran Pembayaran',
    paymentMethod: 'Metode Pembayaran',
    paymentCode: 'Kode Pembayaran',
    transactionNo: 'Nomor Transaksi',
    collectionRecords: 'Catatan Koleksi',
    method: 'Metode',
    result: 'Hasil',
    duration: 'Durasi',
    recording: 'Rekaman',
    note: 'Catatan',
    title: 'Judul',
    sentDate: 'Tanggal Dikirim',
    billInformation: 'Informasi Tagihan',
    billId: 'ID Tagihan',
    orderId: 'ID Pesanan',
    billAmount: 'Jumlah Tagihan',
    paidAmount: 'Jumlah Dibayar',
    vaManagement: 'Manajemen VA',
    validVA: 'VA Valid',
    vaId: 'ID VA',
    bank: 'Bank',
    vaNumber: 'Nomor VA',
    expireTime: 'Waktu Kadaluarsa',
    caseNo: 'Nomor Kasus',
    stage: 'Tahap',
    statusPending: 'Tertunda',
    statusProcessing: 'Diproses',
    detail: 'Detail',
    cases: 'Kasus',
    assignedTime: 'Waktu Ditugaskan',
    originalAmount: 'Jumlah Original',
    team: 'Tim',
    recoveryMethod: 'Metode Pemulihan',
    remark: 'Catatan',
    startDate: 'Tanggal Mulai',
    endDate: 'Tanggal Akhir',
    reductionApprovedSuccess: 'Aplikasi pengurangan disetujui',
    reductionRejectedSuccess: 'Aplikasi pengurangan ditolak',
    paymentCodeGeneratedSuccess: 'Kode pembayaran dibuat',
    paymentCompletedSuccess: 'Pembayaran selesai',
    applicationId: 'ID Aplikasi',
    customer: 'Pelanggan',
    applyTime: 'Waktu Pengajuan',
    applyBy: 'Pengaju',
    requested: 'Diminta',
    approvedAmount: 'Jumlah Disetujui',
    pendingReview: 'Tunggu Review',
    approve: 'Setujui',
    reject: 'Tolak',
    generateVa: 'Buat VA',
    confirmPayment: 'Konfirmasi Pembayaran',
    reviewReductionApplications: 'Review Aplikasi Pengurangan',
    pendingReviewCount: 'Jumlah Tunggu Review',
    totalReductionAmount: 'Jumlah Pengurangan Total',
    applicationList: 'Daftar Aplikasi',
    reductionApplicationDetail: 'Detail Aplikasi Pengurangan',
    billDetails: 'Detail Tagihan',
    reduction: 'Pengurangan',
    finalAmount: 'Jumlah Akhir',
    requestedReduction: 'Pengurangan Diminta',
    approvedReduction: 'Pengurangan Disetujui',
    searchPlaceholder: 'Tempat Pencarian',
    reviewInformation: 'Informasi Review',
    reviewTime: 'Waktu Review',
    reviewer: 'Peninjau',
    comment: 'Komentar',
    paymentInformation: 'Informasi Pembayaran',
    waitingForPayment: 'Menunggu Pembayaran',
    completedTime: 'Waktu Selesai',
    processTimeline: 'Lini Proses',
    applicationSubmitted: 'Aplikasi Diserahkan',
    by: 'Oleh',
    paymentCodeGenerated: 'Kode Pembayaran Dibuat',
    generating: 'Membuat',
    code: 'Kode',
    paidAt: 'Dibayar Pada',
    completedAndSettled: 'Selesai dan Dilunasi',
    max: 'Maks',
    rejectionReason: 'Alasan Penolakan',
    enterRejectionReason: 'Masukkan alasan penolakan',
    afterApprovalGenerateCode: 'Buat kode setelah persetujuan',
    productType: 'Jenis Produk',
    collectorGroup: 'Grup Kolektor',
    loadBalance: 'Keseimbangan Beban',
    random: 'Acak',
    timeRange: 'Rentang Waktu',
    allocationTeam: 'Tim Alokasi',
    allocationCollector: 'Kolektor Alokasi',
    roundRobin: 'Round Robin',
    capacity: 'Kapasitas',
    priority: 'Prioritas',
    maxPerCollector: 'Maks Per Kolektor',
    lastExecution: 'Eksekusi Terakhir',
    notExecuted: 'Belum Dieksekusi',
    groupName: 'Nama Grup',
    uploadTime: 'Waktu Unggah',
    customerCount: 'Jumlah Pelanggan',
    userId: 'ID Pengguna',
    customerGroupManagement: 'Manajemen Grup Pelanggan',
    downloadTemplate: 'Unduh Template',
    sendMethod: 'Metode Pengiriman',
    automatic: 'Otomatis',
    sendChannel: 'Saluran Pengiriman',
    SMS: 'SMS',
    Push: 'Push',
    sendContent: 'Konten Pengiriman',
    batchNumber: 'Nomor Batch',
    sendResult: 'Hasil Pengiriman',
    success: 'Berhasil',
    failed: 'Gagal',
    partial: 'Sebagian',
    sendCount: 'Jumlah Pengiriman',
    failCount: 'Jumlah Gagal',
    successRate: 'Tingkat Berhasil',
    sent: 'Terkirim',
    resend: 'Kirim Ulang',
    noNeedResend: 'Tidak Perlu Kirim Ulang',
    templateName: 'Nama Template',
    smsContent: 'Konten SMS',
    createTemplate: 'Buat Template',
    editTemplate: 'Edit Template',
    pleaseInputContent: 'Silakan masukkan konten',
    tagType: 'Jenis Tag',
    language: 'Bahasa',
    businessCategory: 'Kategori Bisnis',
    conditionCount: 'Jumlah Kondisi',
    userCount: 'Jumlah Pengguna',
    addCondition: 'Tambah Kondisi',
    addConditionGroup: 'Tambah Grup Kondisi',
    userTagManagement: 'Manajemen Tag Pengguna',
    totalTags: 'Total Tag',
    tagCategory: 'Kategori Tag',
    tagColor: 'Warna Tag',
    pleaseInputDescription: 'Silakan masukkan deskripsi',
    condition: 'Kondisi',
    chinese: '中文',
    english: 'English',
    indonesian: 'Bahasa',
  },
};
