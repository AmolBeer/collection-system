import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Tag, Space, Modal, message, Select, Input, Row, Col, Divider, Timeline, Avatar, Statistic } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ClockCircleOutlined,
  UserOutlined,
  DollarOutlined,
  EyeOutlined,
  PauseCircleOutlined,
  TeamOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { useLanguage } from '../../i18n/LanguageContext';

const { TextArea } = Input;

// 工单类型
type WorkOrderType = 'reduction' | 'suspend' | 'coCollection';

// 工单状态
type WorkOrderStatus = 'pending' | 'approved' | 'rejected' | 'completed';

// 工单详情接口
interface WorkOrderDetail {
  id: string;
  orderId: string;
  caseId: string;
  customerName: string;
  phone: string;
  type: WorkOrderType;
  status: WorkOrderStatus;
  applyTime: string;
  applicant: string;
  reason: string;
  // 减免相关字段
  totalAmount?: number;
  requestedAmount?: number;
  approvedAmount?: number;
  // 停催相关字段
  suspendDays?: number;
  suspendReason?: string;
  // 协催相关字段
  targetCollector?: string;
  coCollectionReason?: string;
  // 审核字段
  reviewTime?: string;
  reviewer?: string;
  reviewComment?: string;
  completedTime?: string;
}

// 模拟工单数据
const mockWorkOrders: WorkOrderDetail[] = [
  // 减免申请工单
  {
    id: 'WO001',
    orderId: 'WO-20240510-001',
    caseId: 'C001',
    customerName: 'EZI SADRAKH SAPUTRA',
    phone: '0821 6273 6949',
    type: 'reduction',
    status: 'pending',
    applyTime: '10 May 2024, 09:30',
    applicant: 'Dewi Anggraini',
    reason: '客户失业，无法全额还款',
    totalAmount: 4400000,
    requestedAmount: 660000,
    approvedAmount: 0,
  },
  {
    id: 'WO002',
    orderId: 'WO-20240508-002',
    caseId: 'C002',
    customerName: 'JOHN DOE',
    phone: '0812 3456 7890',
    type: 'reduction',
    status: 'approved',
    applyTime: '08 May 2024, 14:20',
    applicant: 'Budi Santoso',
    reason: '客户医疗紧急情况',
    totalAmount: 1800000,
    requestedAmount: 270000,
    approvedAmount: 200000,
    reviewTime: '08 May 2024, 16:45',
    reviewer: 'Ahmad Rizal (Supervisor)',
    reviewComment: '客户承诺周末还款，批准减免20万',
  },
  // 停催申请工单
  {
    id: 'WO003',
    orderId: 'WO-20240512-001',
    caseId: 'C003',
    customerName: 'JANE SMITH',
    phone: '0856 7890 1234',
    type: 'suspend',
    status: 'pending',
    applyTime: '12 May 2024, 11:00',
    applicant: 'Siti Aminah',
    reason: '客户正在办理破产申请',
    suspendDays: 30,
    suspendReason: '客户财务困难，需要时间处理破产程序',
  },
  {
    id: 'WO004',
    orderId: 'WO-20240511-001',
    caseId: 'C004',
    customerName: 'ROBERT BROWN',
    phone: '0899 8765 4321',
    type: 'suspend',
    status: 'approved',
    applyTime: '11 May 2024, 09:15',
    applicant: 'Dewi Anggraini',
    reason: '客户住院治疗',
    suspendDays: 14,
    suspendReason: '客户因重病住院，无法处理还款事宜',
    reviewTime: '11 May 2024, 15:30',
    reviewer: 'Ahmad Rizal (Supervisor)',
    reviewComment: '批准停催14天',
  },
  // 协催申请工单
  {
    id: 'WO005',
    orderId: 'WO-20240513-001',
    caseId: 'C005',
    customerName: 'SARAH JONES',
    phone: '0813 2345 6789',
    type: 'coCollection',
    status: 'pending',
    applyTime: '13 May 2024, 14:00',
    applicant: 'Budi Santoso',
    reason: '客户态度强硬，需要资深催收员协助',
    targetCollector: 'Rudi Hartono',
    coCollectionReason: '客户多次拒绝沟通，需要经验丰富的催收员介入',
  },
  {
    id: 'WO006',
    orderId: 'WO-20240509-001',
    caseId: 'C006',
    customerName: 'MICHAEL DAVIS',
    phone: '0878 9012 3456',
    type: 'coCollection',
    status: 'completed',
    applyTime: '09 May 2024, 10:30',
    applicant: 'Siti Aminah',
    reason: '大额案件需要协同处理',
    targetCollector: 'Dewi Anggraini',
    coCollectionReason: '案件金额较大，需要两人协同催收',
    reviewTime: '09 May 2024, 11:30',
    reviewer: 'Ahmad Rizal (Supervisor)',
    reviewComment: '批准协催申请',
    completedTime: '12 May 2024, 16:00',
  },
  // 已驳回工单
  {
    id: 'WO007',
    orderId: 'WO-20240505-001',
    caseId: 'C007',
    customerName: 'CHRIS WILSON',
    phone: '0811 1234 5678',
    type: 'reduction',
    status: 'rejected',
    applyTime: '05 May 2024, 16:20',
    applicant: 'Dewi Anggraini',
    reason: '希望获得全额减免',
    totalAmount: 2000000,
    requestedAmount: 2000000,
    approvedAmount: 0,
    reviewTime: '05 May 2024, 17:00',
    reviewer: 'Ahmad Rizal (Supervisor)',
    reviewComment: '驳回 - 申请全额减免不符合政策',
  },
];

const WorkOrderReview: React.FC = () => {
  const [orders, setOrders] = useState<WorkOrderDetail[]>(mockWorkOrders);
  const [filterType, setFilterType] = useState<WorkOrderType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<WorkOrderStatus | 'all'>('all');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<WorkOrderDetail | null>(null);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [reviewComment, setReviewComment] = useState('');
  const [approvedAmount, setApprovedAmount] = useState<number>(0);
  const { t } = useLanguage();

  // 工单类型配置
  const typeConfig: Record<WorkOrderType, { color: string; label: string; icon: React.ReactNode }> = {
    reduction: { color: 'orange', label: t.reductionApplication, icon: <DollarOutlined /> },
    suspend: { color: 'blue', label: t.suspendCollection, icon: <PauseCircleOutlined /> },
    coCollection: { color: 'purple', label: t.coCollection, icon: <TeamOutlined /> },
  };

  // 状态配置
  const statusConfig: Record<WorkOrderStatus, { color: string; label: string }> = {
    pending: { color: 'orange', label: t.pendingReview },
    approved: { color: 'blue', label: t.approve },
    rejected: { color: 'red', label: t.reject },
    completed: { color: 'green', label: t.statusCompleted },
  };

  // 筛选后的工单列表
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const typeMatch = filterType === 'all' || order.type === filterType;
      const statusMatch = filterStatus === 'all' || order.status === filterStatus;
      return typeMatch && statusMatch;
    });
  }, [orders, filterType, filterStatus]);

  // 统计信息
  const statistics = useMemo(() => {
    const pending = orders.filter(o => o.status === 'pending').length;
    const approved = orders.filter(o => o.status === 'approved').length;
    const completed = orders.filter(o => o.status === 'completed').length;
    const rejected = orders.filter(o => o.status === 'rejected').length;
    
    const reductionCount = orders.filter(o => o.type === 'reduction').length;
    const suspendCount = orders.filter(o => o.type === 'suspend').length;
    const coCollectionCount = orders.filter(o => o.type === 'coCollection').length;
    
    return { pending, approved, completed, rejected, reductionCount, suspendCount, coCollectionCount };
  }, [orders]);

  // 打开详情弹窗
  const handleViewDetail = (order: WorkOrderDetail) => {
    setSelectedOrder(order);
    setDetailModalVisible(true);
  };

  // 打开审核弹窗
  const handleReview = (order: WorkOrderDetail, action: 'approve' | 'reject') => {
    setSelectedOrder(order);
    setReviewAction(action);
    setApprovedAmount(order.requestedAmount || 0);
    setReviewComment('');
    setReviewModalVisible(true);
  };

  // 提交审核
  const handleSubmitReview = () => {
    if (!selectedOrder) return;

    setOrders(prev => prev.map(order => {
      if (order.id === selectedOrder.id) {
        return {
          ...order,
          status: reviewAction === 'approve' ? 'approved' : 'rejected',
          approvedAmount: reviewAction === 'approve' ? (order.type === 'reduction' ? approvedAmount : order.requestedAmount) : 0,
          reviewTime: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + 
                     new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          reviewer: 'Ahmad Rizal (Supervisor)',
          reviewComment: reviewComment,
        };
      }
      return order;
    }));

    message.success(reviewAction === 'approve' ? t.workOrderApprovedSuccess : t.workOrderRejectedSuccess);
    setReviewModalVisible(false);
  };

  // 完成工单
  const handleComplete = (order: WorkOrderDetail) => {
    setOrders(prev => prev.map(o => {
      if (o.id === order.id) {
        return {
          ...o,
          status: 'completed',
          completedTime: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + 
                         new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        };
      }
      return o;
    }));
    message.success(t.workOrderCompleted);
  };

  // 表格列定义
  const columns: ColumnsType<WorkOrderDetail> = [
    {
      title: t.workOrderId,
      dataIndex: 'orderId',
      key: 'orderId',
      width: 160,
      render: (id: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#0d4f3c' }}>{id}</span>
      ),
    },
    {
      title: t.type,
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: WorkOrderType) => {
        const config = typeConfig[type];
        return (
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: `var(--ant-color-${config.color})` }}>{config.icon}</span>
            <Tag color={config.color}>{config.label}</Tag>
          </span>
        );
      },
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
      title: t.amountOrDays,
      key: 'amountOrDays',
      width: 140,
      align: 'right',
      render: (_, record) => {
        if (record.type === 'reduction') {
          return (
            <span style={{ color: '#f97316', fontWeight: '500' }}>
              -{(record.requestedAmount || 0).toLocaleString('id-ID')} IDR
            </span>
          );
        } else if (record.type === 'suspend') {
          return (
            <span style={{ color: '#3b82f6', fontWeight: '500' }}>
              {record.suspendDays} {t.day}
            </span>
          );
        } else {
          return (
            <span style={{ color: '#8b5cf6', fontWeight: '500' }}>
              {record.targetCollector}
            </span>
          );
        }
      },
    },
    {
      title: t.status,
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: WorkOrderStatus) => {
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
          {record.status === 'approved' && record.type !== 'reduction' && (
            <Button 
              type="link" 
              icon={<CheckCircleOutlined />}
              onClick={() => handleComplete(record)}
              style={{ color: '#22c55e', padding: '0 4px' }}
            >
              {t.markCompleted}
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
          {t.workOrderReview}
        </h2>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
          {t.reviewWorkOrders}
        </p>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={4}>
          <Card variant="borderless" style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <Statistic
              title={<span style={{ fontSize: '13px', color: '#6b7280' }}>{t.pendingReviewCount}</span>}
              value={statistics.pending}
              prefix={<ClockCircleOutlined style={{ color: '#f97316' }} />}
              valueStyle={{ color: '#f97316', fontSize: '28px', fontWeight: '600' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless" style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <Statistic
              title={<span style={{ fontSize: '13px', color: '#6b7280' }}>{t.approve}</span>}
              value={statistics.approved}
              prefix={<CheckCircleOutlined style={{ color: '#3b82f6' }} />}
              valueStyle={{ color: '#3b82f6', fontSize: '28px', fontWeight: '600' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless" style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <Statistic
              title={<span style={{ fontSize: '13px', color: '#6b7280' }}>{t.statusCompleted}</span>}
              value={statistics.completed}
              prefix={<CheckCircleOutlined style={{ color: '#22c55e' }} />}
              valueStyle={{ color: '#22c55e', fontSize: '28px', fontWeight: '600' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless" style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <Statistic
              title={<span style={{ fontSize: '13px', color: '#6b7280' }}>{t.reject}</span>}
              value={statistics.rejected}
              prefix={<CloseCircleOutlined style={{ color: '#ef4444' }} />}
              valueStyle={{ color: '#ef4444', fontSize: '28px', fontWeight: '600' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless" style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <Statistic
              title={<span style={{ fontSize: '13px', color: '#6b7280' }}>{t.reductionApplication}</span>}
              value={statistics.reductionCount}
              prefix={<DollarOutlined style={{ color: '#f97316' }} />}
              valueStyle={{ color: '#f97316', fontSize: '28px', fontWeight: '600' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card variant="borderless" style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <Statistic
              title={<span style={{ fontSize: '13px', color: '#6b7280' }}>{t.otherOrders}</span>}
              value={statistics.suspendCount + statistics.coCollectionCount}
              prefix={<WarningOutlined style={{ color: '#8b5cf6' }} />}
              valueStyle={{ color: '#8b5cf6', fontSize: '28px', fontWeight: '600' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选和表格 */}
      <Card variant="borderless" style={{ borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>{t.workOrderList}</h3>
          <Space>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>{t.type}:</span>
            <Select
              value={filterType}
              onChange={setFilterType}
              style={{ width: 150 }}
              options={[
                { value: 'all', label: t.all },
                { value: 'reduction', label: t.reductionApplication },
                { value: 'suspend', label: t.suspendCollection },
                { value: 'coCollection', label: t.coCollection },
              ]}
            />
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
          dataSource={filteredOrders}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1500 }}
          size="middle"
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title={t.workOrderDetail}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div>
            {/* 基本信息 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>{t.workOrderId}</div>
                <div style={{ fontFamily: 'monospace', fontWeight: '600', color: '#0d4f3c' }}>{selectedOrder.orderId}</div>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>{t.type}</div>
                <div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: `var(--ant-color-${typeConfig[selectedOrder.type].color})` }}>
                      {typeConfig[selectedOrder.type].icon}
                    </span>
                    <Tag color={typeConfig[selectedOrder.type].color}>
                      {typeConfig[selectedOrder.type].label}
                    </Tag>
                  </span>
                </div>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>{t.customerName}</div>
                <div style={{ fontWeight: '500', color: '#1f2937' }}>{selectedOrder.customerName}</div>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>{t.phone}</div>
                <div style={{ fontWeight: '500', color: '#1f2937' }}>{selectedOrder.phone}</div>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>{t.caseNo}</div>
                <div style={{ fontWeight: '500', color: '#0d4f3c' }}>{selectedOrder.caseId}</div>
              </div>
              <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>{t.status}</div>
                <Tag color={statusConfig[selectedOrder.status].color}>
                  {statusConfig[selectedOrder.status].label}
                </Tag>
              </div>
            </div>

            {/* 申请信息 */}
            <Divider>{t.applicationInformation}</Divider>
            <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#6b7280' }}>{t.applyBy}:</span>
                <span style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#0d4f3c' }} />
                  {selectedOrder.applicant}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#6b7280' }}>{t.applyTime}:</span>
                <span style={{ fontWeight: '500' }}>{selectedOrder.applyTime}</span>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ color: '#6b7280', display: 'block', marginBottom: '4px' }}>{t.reason}:</span>
                <p style={{ margin: 0, color: '#1f2937' }}>{selectedOrder.reason}</p>
              </div>
              
              {/* 工单类型特定信息 */}
              {selectedOrder.type === 'reduction' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280' }}>{t.totalAmount}:</span>
                  <span style={{ fontWeight: '500' }}>{(selectedOrder.totalAmount || 0).toLocaleString('id-ID')} IDR</span>
                </div>
              )}
              {selectedOrder.type === 'reduction' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px' }}>
                  <span style={{ color: '#6b7280' }}>{t.requestedReduction}:</span>
                  <span style={{ fontWeight: '500', color: '#f97316' }}>
                    -{(selectedOrder.requestedAmount || 0).toLocaleString('id-ID')} IDR
                  </span>
                </div>
              )}
              {selectedOrder.type === 'suspend' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280' }}>{t.suspendDays}:</span>
                  <span style={{ fontWeight: '500', color: '#3b82f6' }}>{selectedOrder.suspendDays} {t.day}</span>
                </div>
              )}
              {selectedOrder.type === 'suspend' && selectedOrder.suspendReason && (
                <div style={{ paddingTop: '8px' }}>
                  <span style={{ color: '#6b7280', display: 'block', marginBottom: '4px' }}>{t.suspendReason}:</span>
                  <p style={{ margin: 0, color: '#1f2937' }}>{selectedOrder.suspendReason}</p>
                </div>
              )}
              {selectedOrder.type === 'coCollection' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6b7280' }}>{t.targetCollector}:</span>
                  <span style={{ fontWeight: '500', color: '#8b5cf6' }}>{selectedOrder.targetCollector}</span>
                </div>
              )}
              {selectedOrder.type === 'coCollection' && selectedOrder.coCollectionReason && (
                <div style={{ paddingTop: '8px' }}>
                  <span style={{ color: '#6b7280', display: 'block', marginBottom: '4px' }}>{t.coCollectionReason}:</span>
                  <p style={{ margin: 0, color: '#1f2937' }}>{selectedOrder.coCollectionReason}</p>
                </div>
              )}
            </div>

            {/* 审核信息 */}
            {selectedOrder.reviewTime && (
              <>
                <Divider>{t.reviewInformation}</Divider>
                <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#6b7280' }}>{t.reviewTime}:</span>
                    <span style={{ fontWeight: '500' }}>{selectedOrder.reviewTime}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#6b7280' }}>{t.reviewer}:</span>
                    <span style={{ fontWeight: '500' }}>{selectedOrder.reviewer}</span>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280', display: 'block', marginBottom: '4px' }}>{t.comment}:</span>
                    <p style={{ margin: 0, color: '#1f2937' }}>{selectedOrder.reviewComment}</p>
                  </div>
                </div>
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
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{selectedOrder.applyTime}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{t.by}: {selectedOrder.applicant}</div>
                    </div>
                  ),
                },
                {
                  color: selectedOrder.status === 'rejected' ? 'red' : 'blue',
                  children: selectedOrder.reviewTime ? (
                    <div>
                      <div style={{ fontWeight: '500' }}>
                        {selectedOrder.status === 'approved' ? t.approve : t.reject}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{selectedOrder.reviewTime}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{t.by}: {selectedOrder.reviewer}</div>
                      {selectedOrder.reviewComment && (
                        <div style={{ fontSize: '12px', color: '#4b5563', marginTop: '4px' }}>
                          {t.comment}: {selectedOrder.reviewComment}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ color: '#9ca3af' }}>{t.pendingReview}</div>
                  ),
                },
                ...(selectedOrder.completedTime ? [{
                  color: 'green',
                  children: (
                    <div>
                      <div style={{ fontWeight: '500' }}>{t.completed}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{selectedOrder.completedTime}</div>
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
        title={reviewAction === 'approve' ? t.approveWorkOrder : t.rejectWorkOrder}
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        onOk={handleSubmitReview}
        okText={reviewAction === 'approve' ? t.approve : t.reject}
        okButtonProps={{ 
          danger: reviewAction === 'reject',
          style: reviewAction === 'reject' ? { backgroundColor: '#ef4444' } : { backgroundColor: '#22c55e' }
        }}
      >
        {selectedOrder && (
          <div>
            {/* 工单信息 */}
            <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#6b7280' }}>{t.workOrderId}:</span>
                <span style={{ fontWeight: '500', fontFamily: 'monospace' }}>{selectedOrder.orderId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#6b7280' }}>{t.type}:</span>
                <span style={{ fontWeight: '500' }}>{typeConfig[selectedOrder.type].label}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>{t.customerName}:</span>
                <span style={{ fontWeight: '500' }}>{selectedOrder.customerName}</span>
              </div>
            </div>

            {/* 申请原因 */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>{t.reason}</label>
              <p style={{ margin: 0, padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', color: '#4b5563' }}>
                {selectedOrder.reason}
              </p>
            </div>

            {/* 减免金额输入（仅减免工单） */}
            {reviewAction === 'approve' && selectedOrder.type === 'reduction' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  {t.approvedReduction} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <Input
                  type="number"
                  value={approvedAmount}
                  onChange={(e) => setApprovedAmount(Number(e.target.value) || 0)}
                  placeholder={`${t.max}: ${(selectedOrder.requestedAmount || 0).toLocaleString('id-ID')} IDR`}
                  style={{ width: '100%' }}
                />
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  {t.max}: {(selectedOrder.requestedAmount || 0).toLocaleString('id-ID')} IDR
                </div>
              </div>
            )}

            {/* 审核意见 */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                {reviewAction === 'approve' ? t.approveComment : t.rejectionReason} 
                <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <TextArea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder={reviewAction === 'approve' ? t.enterApproveComment : t.enterRejectionReason}
                rows={4}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WorkOrderReview;