import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Tag, Space, Modal, message, Select, Input, Form, Descriptions, Statistic, Row, Col, Divider, Timeline, Avatar, InputNumber } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ClockCircleOutlined,
  UserOutlined,
  DollarOutlined,
  EyeOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useLanguage } from '../../i18n/LanguageContext';

const { TextArea } = Input;

// 减免申请状态
type ReductionStatus = 'pending' | 'approved' | 'rejected' | 'completed';

// 减免申请记录
interface ReductionApplication {
  id: string;
  applicationId: string;
  caseId: string;
  customerName: string;
  phone: string;
  orderId: string;
  applyTime: string;
  applicant: string;
  billCount: number;
  totalAmount: number;
  requestedReduction: number;
  approvedReduction: number;
  status: ReductionStatus;
  reviewTime?: string;
  reviewer?: string;
  reviewComment?: string;
  paymentCode?: string;
  paymentTime?: string;
  completedTime?: string;
  billDetails: {
    billNumber: string;
    originalAmount: number;
    reductionAmount: number;
    finalAmount: number;
  }[];
}

// 模拟减免申请数据
const mockApplications: ReductionApplication[] = [
  {
    id: 'RA001',
    applicationId: 'RED-20240510-001',
    caseId: 'C001',
    customerName: 'EZI SADRAKH SAPUTRA',
    phone: '0821 6273 6949',
    orderId: 'ORD001',
    applyTime: '10 May 2024, 09:30',
    applicant: 'Dewi Anggraini',
    billCount: 2,
    totalAmount: 4400000,
    requestedReduction: 660000,
    approvedReduction: 0,
    status: 'pending',
    billDetails: [
      { billNumber: 'INV-2024-0515', originalAmount: 2200000, reductionAmount: 330000, finalAmount: 1870000 },
      { billNumber: 'INV-2024-0615', originalAmount: 2200000, reductionAmount: 330000, finalAmount: 1870000 },
    ],
  },
  {
    id: 'RA002',
    applicationId: 'RED-20240508-001',
    caseId: 'C002',
    customerName: 'JOHN DOE',
    phone: '0812 3456 7890',
    orderId: 'ORD002',
    applyTime: '08 May 2024, 14:20',
    applicant: 'Budi Santoso',
    billCount: 1,
    totalAmount: 1800000,
    requestedReduction: 270000,
    approvedReduction: 200000,
    status: 'approved',
    reviewTime: '08 May 2024, 16:45',
    reviewer: 'Ahmad Rizal (Supervisor)',
    reviewComment: '客户承诺周末还款，批准减免20万',
    paymentCode: 'VA-20240512-001',
    billDetails: [
      { billNumber: 'INV-2024-0701', originalAmount: 1800000, reductionAmount: 200000, finalAmount: 1600000 },
    ],
  },
  {
    id: 'RA003',
    applicationId: 'RED-20240505-001',
    caseId: 'C003',
    customerName: 'JANE SMITH',
    phone: '0856 7890 1234',
    orderId: 'ORD003',
    applyTime: '05 May 2024, 11:00',
    applicant: 'Siti Aminah',
    billCount: 3,
    totalAmount: 6000000,
    requestedReduction: 1200000,
    approvedReduction: 1200000,
    status: 'completed',
    reviewTime: '05 May 2024, 15:30',
    reviewer: 'Ahmad Rizal (Supervisor)',
    reviewComment: '逾期超过60天，符合M3减免规则',
    paymentCode: 'VA-20240506-001',
    paymentTime: '06 May 2024, 10:30',
    completedTime: '06 May 2024, 10:35',
    billDetails: [
      { billNumber: 'INV-2024-0301', originalAmount: 2000000, reductionAmount: 400000, finalAmount: 1600000 },
      { billNumber: 'INV-2024-0401', originalAmount: 2000000, reductionAmount: 400000, finalAmount: 1600000 },
      { billNumber: 'INV-2024-0501', originalAmount: 2000000, reductionAmount: 400000, finalAmount: 1600000 },
    ],
  },
  {
    id: 'RA004',
    applicationId: 'RED-20240503-001',
    caseId: 'C004',
    customerName: 'ROBERT BROWN',
    phone: '0899 8765 4321',
    orderId: 'ORD004',
    applyTime: '03 May 2024, 09:15',
    applicant: 'Dewi Anggraini',
    billCount: 2,
    totalAmount: 4000000,
    requestedReduction: 800000,
    approvedReduction: 0,
    status: 'rejected',
    reviewTime: '03 May 2024, 14:00',
    reviewer: 'Ahmad Rizal (Supervisor)',
    reviewComment: '逾期天数不足30天，不符合减免条件',
    billDetails: [
      { billNumber: 'INV-2024-0601', originalAmount: 2000000, reductionAmount: 0, finalAmount: 2000000 },
      { billNumber: 'INV-2024-0701', originalAmount: 2000000, reductionAmount: 0, finalAmount: 2000000 },
    ],
  },
];

const ReductionReview: React.FC = () => {
  const [applications, setApplications] = useState<ReductionApplication[]>(mockApplications);
  const [filterStatus, setFilterStatus] = useState<ReductionStatus | 'all'>('all');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<ReductionApplication | null>(null);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [reviewComment, setReviewComment] = useState('');
  const [approvedAmount, setApprovedAmount] = useState<number>(0);
  const { t } = useLanguage();
  const [form] = Form.useForm();

  // 筛选后的申请列表
  const filteredApplications = useMemo(() => {
    if (filterStatus === 'all') return applications;
    return applications.filter(app => app.status === filterStatus);
  }, [applications, filterStatus]);

  // 统计信息
  const statistics = useMemo(() => {
    const pending = applications.filter(app => app.status === 'pending').length;
    const approved = applications.filter(app => app.status === 'approved').length;
    const completed = applications.filter(app => app.status === 'completed').length;
    const rejected = applications.filter(app => app.status === 'rejected').length;
    const totalReduction = applications
      .filter(app => app.status === 'completed')
      .reduce((sum, app) => sum + app.approvedReduction, 0);
    
    return { pending, approved, completed, rejected, totalReduction };
  }, [applications]);

  // 打开详情弹窗
  const handleViewDetail = (application: ReductionApplication) => {
    setSelectedApplication(application);
    setDetailModalVisible(true);
  };

  // 打开审核弹窗
  const handleReview = (application: ReductionApplication, action: 'approve' | 'reject') => {
    setSelectedApplication(application);
    setReviewAction(action);
    setApprovedAmount(application.requestedReduction);
    setReviewComment('');
    setReviewModalVisible(true);
  };

  // 提交审核
  const handleSubmitReview = () => {
    if (!selectedApplication) return;

    setApplications(prev => prev.map(app => {
      if (app.id === selectedApplication.id) {
        return {
          ...app,
          status: reviewAction === 'approve' ? 'approved' : 'rejected',
          approvedReduction: reviewAction === 'approve' ? approvedAmount : 0,
          reviewTime: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + 
                     new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          reviewer: 'Ahmad Rizal (Supervisor)',
          reviewComment: reviewComment,
        };
      }
      return app;
    }));

    message.success(reviewAction === 'approve' ? t.reductionApprovedSuccess : t.reductionRejectedSuccess);
    setReviewModalVisible(false);
  };

  // 模拟生成还款码
  const handleGeneratePaymentCode = (application: ReductionApplication) => {
    const paymentCode = `VA-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${application.id}`;
    
    setApplications(prev => prev.map(app => {
      if (app.id === application.id) {
        return {
          ...app,
          paymentCode,
          paymentTime: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + 
                       new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        };
      }
      return app;
    }));

    message.success(t.paymentCodeGeneratedSuccess + '：' + paymentCode);
  };

  // 模拟确认还款完成
  const handleConfirmPayment = (application: ReductionApplication) => {
    setApplications(prev => prev.map(app => {
      if (app.id === application.id) {
        return {
          ...app,
          status: 'completed',
          completedTime: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + 
                         new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        };
      }
      return app;
    }));

    message.success(t.paymentCompletedSuccess);
  };

  // 表格列定义
  const columns: ColumnsType<ReductionApplication> = [
    {
      title: t.applicationId,
      dataIndex: 'applicationId',
      key: 'applicationId',
      width: 180,
      render: (id: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#0d4f3c' }}>{id}</span>
      ),
    },
    {
      title: t.customer,
      key: 'customer',
      width: 180,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: '500', color: '#1f2937' }}>{record.customerName}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>{record.phone}</div>
        </div>
      ),
    },
    {
      title: t.caseNo,
      dataIndex: 'caseId',
      key: 'caseId',
      width: 100,
      render: (id: string) => (
        <span style={{ color: '#0d4f3c' }}>{id}</span>
      ),
    },
    {
      title: t.orderId,
      dataIndex: 'orderId',
      key: 'orderId',
      width: 120,
    },
    {
      title: t.applyTime,
      dataIndex: 'applyTime',
      key: 'applyTime',
      width: 150,
    },
    {
      title: t.applyBy,
      dataIndex: 'applicant',
      key: 'applicant',
      width: 140,
      render: (name: string) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#0d4f3c' }} />
          {name}
        </span>
      ),
    },
    {
      title: t.billAmount,
      dataIndex: 'billCount',
      key: 'billCount',
      width: 80,
      align: 'center',
    },
    {
      title: t.totalAmount,
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 130,
      align: 'right',
      render: (amount: number) => (
        <span style={{ fontWeight: '500' }}>{amount.toLocaleString('id-ID')} IDR</span>
      ),
    },
    {
      title: t.requested,
      dataIndex: 'requestedReduction',
      key: 'requestedReduction',
      width: 130,
      align: 'right',
      render: (amount: number) => (
        <span style={{ color: '#f97316', fontWeight: '500' }}>-{amount.toLocaleString('id-ID')} IDR</span>
      ),
    },
    {
      title: t.approvedAmount,
      dataIndex: 'approvedReduction',
      key: 'approvedReduction',
      width: 130,
      align: 'right',
      render: (amount: number) => (
        <span style={{ color: amount > 0 ? '#22c55e' : '#9ca3af', fontWeight: '500' }}>
          {amount > 0 ? `-${amount.toLocaleString('id-ID')} IDR` : '-'}
        </span>
      ),
    },
    {
      title: t.status,
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: ReductionStatus) => {
        const statusConfig: Record<ReductionStatus, { color: string; label: string }> = {
          pending: { color: 'orange', label: t.pendingReview },
          approved: { color: 'blue', label: t.approve },
          rejected: { color: 'red', label: t.reject },
          completed: { color: 'green', label: t.statusCompleted },
        };
        const config = statusConfig[status];
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: t.action,
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
            style={{ padding: '0 4px' }}
          >
            {t.detail}
          </Button>
          {record.status === 'pending' && (
            <>
              <Button 
                type="link" 
                icon={<CheckCircleOutlined />}
                onClick={() => handleReview(record, 'approve')}
                style={{ color: '#22c55e', padding: '0 4px' }}
              >
                {t.approve}
              </Button>
              <Button 
                type="link" 
                icon={<CloseCircleOutlined />}
                onClick={() => handleReview(record, 'reject')}
                style={{ color: '#ef4444', padding: '0 4px' }}
              >
                {t.reject}
              </Button>
            </>
          )}
          {record.status === 'approved' && !record.paymentCode && (
            <Button 
              type="link" 
              icon={<DollarOutlined />}
              onClick={() => handleGeneratePaymentCode(record)}
              style={{ color: '#0d4f3c', padding: '0 4px' }}
            >
              {t.generateVa}
            </Button>
          )}
          {record.status === 'approved' && record.paymentCode && !record.paymentTime && (
            <Button 
              type="link" 
              icon={<CheckCircleOutlined />}
              onClick={() => handleConfirmPayment(record)}
              style={{ color: '#22c55e', padding: '0 4px' }}
            >
              {t.confirmPayment}
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
          {t.reductionReview}
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
          {t.reviewReductionApplications}
        </p>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card variant="borderless" style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <Statistic
              title={<span style={{ fontSize: '13px', color: '#6b7280' }}>{t.pendingReviewCount}</span>}
              value={statistics.pending}
              prefix={<ClockCircleOutlined style={{ color: '#f97316' }} />}
              valueStyle={{ color: '#f97316', fontSize: '28px', fontWeight: '600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <Statistic
              title={<span style={{ fontSize: '13px', color: '#6b7280' }}>{t.approve}</span>}
              value={statistics.approved}
              prefix={<CheckCircleOutlined style={{ color: '#3b82f6' }} />}
              valueStyle={{ color: '#3b82f6', fontSize: '28px', fontWeight: '600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <Statistic
              title={<span style={{ fontSize: '13px', color: '#6b7280' }}>{t.statusCompleted}</span>}
              value={statistics.completed}
              prefix={<CheckCircleOutlined style={{ color: '#22c55e' }} />}
              valueStyle={{ color: '#22c55e', fontSize: '28px', fontWeight: '600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <Statistic
              title={<span style={{ fontSize: '13px', color: '#6b7280' }}>{t.totalReductionAmount}</span>}
              value={statistics.totalReduction}
              prefix={<DollarOutlined style={{ color: '#0d4f3c' }} />}
              valueStyle={{ color: '#0d4f3c', fontSize: '28px', fontWeight: '600' }}
              formatter={(value) => `${Number(value).toLocaleString('id-ID')}`}
              suffix="IDR"
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选和表格 */}
      <Card variant="borderless" style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>{t.applicationList}</h3>
          <Space>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>{t.status}:</span>
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: 150 }}
              options={[
                { value: 'all', label: t.all },
                { value: 'pending', label: t.pendingReview },
                { value: 'approved', label: t.approve },
                { value: 'rejected', label: t.reject },
                { value: 'completed', label: t.statusCompleted },
              ]}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredApplications}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1500 }}
          size="middle"
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title={t.reductionApplicationDetail}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedApplication && (
          <div>
            {/* 基本信息 */}
            <Descriptions bordered column={2} size="small" style={{ marginBottom: '16px' }}>
              <Descriptions.Item label={t.applicationId} span={2}>
                <span style={{ fontFamily: 'monospace', fontWeight: '500' }}>{selectedApplication.applicationId}</span>
              </Descriptions.Item>
              <Descriptions.Item label={t.customerName}>
                {selectedApplication.customerName}
              </Descriptions.Item>
              <Descriptions.Item label={t.phone}>
                {selectedApplication.phone}
              </Descriptions.Item>
              <Descriptions.Item label={t.caseNo}>
                {selectedApplication.caseId}
              </Descriptions.Item>
              <Descriptions.Item label={t.orderId}>
                {selectedApplication.orderId}
              </Descriptions.Item>
              <Descriptions.Item label={t.applyTime}>
                {selectedApplication.applyTime}
              </Descriptions.Item>
              <Descriptions.Item label={t.applyBy}>
                {selectedApplication.applicant}
              </Descriptions.Item>
              <Descriptions.Item label={t.status}>
                <Tag color={
                  selectedApplication.status === 'pending' ? 'orange' :
                  selectedApplication.status === 'approved' ? 'blue' :
                  selectedApplication.status === 'rejected' ? 'red' : 'green'
                }>
                  {selectedApplication.status === 'pending' ? t.pendingReview :
                   selectedApplication.status === 'approved' ? t.approve :
                   selectedApplication.status === 'rejected' ? t.reject : t.statusCompleted}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Divider>{t.billDetails}</Divider>

            {/* 账单明细 */}
            <Table
              dataSource={selectedApplication.billDetails}
              rowKey="billNumber"
              pagination={false}
              size="small"
              columns={[
                { title: t.billNumber, dataIndex: 'billNumber', key: 'billNumber' },
                { 
                  title: t.originalAmount, 
                  dataIndex: 'originalAmount', 
                  key: 'originalAmount',
                  align: 'right',
                  render: (val: number) => `${val.toLocaleString('id-ID')} IDR`
                },
                { 
                  title: t.reduction, 
                  dataIndex: 'reductionAmount', 
                  key: 'reductionAmount',
                  align: 'right',
                  render: (val: number) => (
                    <span style={{ color: val > 0 ? '#22c55e' : '#9ca3af' }}>
                      {val > 0 ? `-${val.toLocaleString('id-ID')}` : '-'} IDR
                    </span>
                  )
                },
                { 
                  title: t.finalAmount, 
                  dataIndex: 'finalAmount', 
                  key: 'finalAmount',
                  align: 'right',
                  render: (val: number) => <strong>{val.toLocaleString('id-ID')} IDR</strong>
                },
              ]}
            />

            {/* 汇总 */}
            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <Row gutter={16}>
                <Col span={8}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{t.totalAmount}</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                      {selectedApplication.totalAmount.toLocaleString('id-ID')} IDR
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{t.requestedReduction}</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#f97316' }}>
                      -{selectedApplication.requestedReduction.toLocaleString('id-ID')} IDR
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{t.approvedReduction}</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#22c55e' }}>
                      {selectedApplication.approvedReduction > 0 
                        ? `-${selectedApplication.approvedReduction.toLocaleString('id-ID')} IDR`
                        : '-'}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {/* 审核信息 */}
            {selectedApplication.reviewTime && (
              <>
                <Divider>{t.reviewInformation}</Divider>
                <Descriptions bordered column={2} size="small">
                  <Descriptions.Item label={t.reviewTime} span={2}>
                    {selectedApplication.reviewTime}
                  </Descriptions.Item>
                  <Descriptions.Item label={t.reviewer} span={2}>
                    {selectedApplication.reviewer}
                  </Descriptions.Item>
                  <Descriptions.Item label={t.comment} span={2}>
                    {selectedApplication.reviewComment}
                  </Descriptions.Item>
                </Descriptions>
              </>
            )}

            {/* 还款信息 */}
            {selectedApplication.paymentCode && (
              <>
                <Divider>{t.paymentInformation}</Divider>
                <Descriptions bordered column={2} size="small">
                  <Descriptions.Item label={t.paymentCode}>
                    <span style={{ fontFamily: 'monospace', fontWeight: '500' }}>{selectedApplication.paymentCode}</span>
                  </Descriptions.Item>
                  <Descriptions.Item label={t.paymentDate}>
                    {selectedApplication.paymentTime || t.waitingForPayment}
                  </Descriptions.Item>
                  {selectedApplication.completedTime && (
                    <Descriptions.Item label={t.completedTime} span={2}>
                      {selectedApplication.completedTime}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </>
            )}

            {/* 流程时间线 */}
            <Divider>{t.processTimeline}</Divider>
            <Timeline
              items={[
                {
                  color: 'green',
                  children: (
                    <div>
                      <div style={{ fontWeight: '500' }}>{t.applicationSubmitted}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{selectedApplication.applyTime}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{t.by}: {selectedApplication.applicant}</div>
                    </div>
                  ),
                },
                {
                  color: selectedApplication.status === 'rejected' ? 'red' : 'blue',
                  children: selectedApplication.reviewTime ? (
                    <div>
                      <div style={{ fontWeight: '500' }}>
                        {selectedApplication.status === 'approved' ? t.approve : t.reject}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{selectedApplication.reviewTime}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{t.by}: {selectedApplication.reviewer}</div>
                      {selectedApplication.reviewComment && (
                        <div style={{ fontSize: '12px', color: '#4b5563', marginTop: '4px' }}>
                          {t.comment}: {selectedApplication.reviewComment}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ color: '#9ca3af' }}>{t.pendingReview}</div>
                  ),
                },
                ...(selectedApplication.paymentCode ? [{
                  color: selectedApplication.paymentTime ? 'green' : 'orange',
                  children: (
                    <div>
                      <div style={{ fontWeight: '500' }}>
                        {selectedApplication.paymentCode ? t.paymentCodeGenerated : t.generating}
                      </div>
                      {selectedApplication.paymentCode && (
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {t.code}: {selectedApplication.paymentCode}
                        </div>
                      )}
                      {selectedApplication.paymentTime && (
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {t.paidAt}: {selectedApplication.paymentTime}
                        </div>
                      )}
                    </div>
                  ),
                }] : []),
                ...(selectedApplication.completedTime ? [{
                  color: 'green',
                  children: (
                    <div>
                      <div style={{ fontWeight: '500' }}>{t.completedAndSettled}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{selectedApplication.completedTime}</div>
                    </div>
                  ),
                }] : []),
              ]}
            />
          </div>
        )}
      </Modal>

      {/* 审核弹窗 */}
      <Modal
        title={reviewAction === 'approve' ? t.reductionApplication : t.reductionApplication}
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        onOk={handleSubmitReview}
        okText={reviewAction === 'approve' ? t.approve : t.reject}
        okButtonProps={{ 
          danger: reviewAction === 'reject',
          style: reviewAction === 'reject' ? { backgroundColor: '#ef4444' } : { backgroundColor: '#22c55e' }
        }}
      >
        {selectedApplication && (
          <div>
            {/* 申请信息 */}
            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#6b7280' }}>{t.customerName}:</span>
                <span style={{ fontWeight: '500' }}>{selectedApplication.customerName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#6b7280' }}>{t.totalAmount}:</span>
                <span style={{ fontWeight: '500' }}>{selectedApplication.totalAmount.toLocaleString('id-ID')} IDR</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>{t.requestedReduction}:</span>
                <span style={{ fontWeight: '500', color: '#f97316' }}>
                  -{selectedApplication.requestedReduction.toLocaleString('id-ID')} IDR
                </span>
              </div>
            </div>

            {reviewAction === 'approve' ? (
              <Form form={form} layout="vertical">
                <Form.Item 
                  label={t.approvedReduction}
                  required
                  help={t.approvedAmount}
                >
                  <InputNumber
                    value={approvedAmount}
                    onChange={(value: string | number | null) => setApprovedAmount(value ? Number(value) : 0)}
                    min={0}
                    max={selectedApplication.requestedReduction}
                    style={{ width: '100%' }}
                    formatter={(value: string | number | undefined) => value !== undefined ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                    parser={(value: string | undefined) => value ? parseInt(value.replace(/,/g, ''), 10) : 0}
                  />
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    {t.max}: {selectedApplication.requestedReduction.toLocaleString('id-ID')} IDR
                  </div>
                </Form.Item>
              </Form>
            ) : (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  {t.rejectionReason} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <TextArea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder={t.enterRejectionReason}
                  rows={4}
                />
              </div>
            )}

            {reviewAction === 'approve' && (
              <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
                <ExclamationCircleOutlined style={{ color: '#f59e0b', marginRight: '8px' }} />
                <span style={{ fontSize: '13px', color: '#92400e' }}>
                  {t.afterApprovalGenerateCode}
                </span>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReductionReview;
