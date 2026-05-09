import { Language } from '../types';

export interface Translations {
  stageConfig: string;
  caseDistribution: string;
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
}

export const translations: Record<Language, Translations> = {
  zh: {
    stageConfig: '逾期阶段配置',
    caseDistribution: '分案管理',
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
    件案件: '件案件',
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
  },
  id: {
    stageConfig: 'Konfigurasi Tahap',
    caseDistribution: 'Distribusi Kasus',
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
    件案件: 'kasus',
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
  },
};