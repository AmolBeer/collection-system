import React, { useState, useMemo } from 'react';
import { Table, Button, Space, Input, Select, Card, Tag, message, Modal, Form, DatePicker, Checkbox } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, EyeOutlined, SwapOutlined, PauseCircleOutlined, FilterOutlined } from '@ant-design/icons';
import { useLanguage } from '../../i18n/LanguageContext';
import dayjs, { Dayjs } from 'dayjs';

interface Case {
  id: string;
  borrowerName: string;
  phone: string;
  overdueDays: number;
  amount: number;
  stage: string;
  status: string;
  assignedTo: string;
  createTime: string;
  lastUpdateTime: string;
}

const defaultCases: Case[] = [
  { id: 'KREDITOK008946', borrowerName: 'EZI SADRAKH SAPUTRA', phone: '0821 6273 6949', overdueDays: 12, amount: 267947, stage: 'M1', status: 'Open', assignedTo: 'Dewi Anggraini', createTime: '2024-03-15 10:00:00', lastUpdateTime: '2024-03-30 14:30:00' },
  { id: 'KREDITOK008947', borrowerName: 'JOHN DOE', phone: '0812 3456 7890', overdueDays: 35, amount: 800000, stage: 'M2', status: 'Processing', assignedTo: 'Budi Santoso', createTime: '2024-03-10 09:00:00', lastUpdateTime: '2024-03-31 10:15:00' },
  { id: 'KREDITOK008948', borrowerName: 'JANE SMITH', phone: '0813 2233 4455', overdueDays: 5, amount: 300000, stage: 'M0', status: 'Open', assignedTo: 'Dewi Anggraini', createTime: '2024-03-20 11:00:00', lastUpdateTime: '2024-03-29 09:45:00' },
  { id: 'KREDITOK008949', borrowerName: 'MICHAEL BROWN', phone: '0811 6677 8899', overdueDays: 65, amount: 600000, stage: 'M3', status: 'Processing', assignedTo: 'Siti Aminah', createTime: '2024-02-25 14:00:00', lastUpdateTime: '2024-03-31 16:20:00' },
  { id: 'KREDITOK008950', borrowerName: 'SARAH DAVIS', phone: '0822 1122 3344', overdueDays: 100, amount: 1200000, stage: 'M4+', status: 'Open', assignedTo: 'Budi Santoso', createTime: '2024-02-10 08:00:00', lastUpdateTime: '2024-03-28 11:30:00' },
  { id: 'KREDITOK008951', borrowerName: 'ROBERT WILSON', phone: '0819 5566 7788', overdueDays: 25, amount: 450000, stage: 'M1', status: 'Completed', assignedTo: 'Dewi Anggraini', createTime: '2024-03-18 13:00:00', lastUpdateTime: '2024-03-30 15:45:00' },
  { id: 'KREDITOK008952', borrowerName: 'EMILY JOHNSON', phone: '0818 9900 1122', overdueDays: 45, amount: 750000, stage: 'M2', status: 'Processing', assignedTo: 'Siti Aminah', createTime: '2024-03-05 10:30:00', lastUpdateTime: '2024-03-31 09:20:00' },
  { id: 'KREDITOK008953', borrowerName: 'WILLIAM TAYLOR', phone: '0817 3344 5566', overdueDays: 85, amount: 900000, stage: 'M3', status: 'Open', assignedTo: 'Budi Santoso', createTime: '2024-02-20 15:00:00', lastUpdateTime: '2024-03-29 14:15:00' },
];

const teams = [
  { value: 'team1', label: '催收一组' },
  { value: 'team2', label: '催收二组' },
  { value: 'team3', label: '催收三组' },
];

const collectors = [
  { value: 'collector1', label: 'Dewi Anggraini', team: 'team1' },
  { value: 'collector2', label: 'Budi Santoso', team: 'team2' },
  { value: 'collector3', label: 'Siti Aminah', team: 'team3' },
  { value: 'collector4', label: 'Rudi Hartono', team: 'team1' },
  { value: 'collector5', label: 'Lisa Wijaya', team: 'team2' },
];

const CaseList: React.FC<{ onViewDetail: (caseId: string) => void; onSuspend: (caseIds: string[]) => void }> = ({ onViewDetail, onSuspend }) => {
  const [cases, setCases] = useState<Case[]>(defaultCases);
  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [collectorFilter, setCollectorFilter] = useState('all');
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [assignMode, setAssignMode] = useState<'team' | 'collector'>('team');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedCollector, setSelectedCollector] = useState('');
  const [distributionMode, setDistributionMode] = useState<'average' | 'manual'>('average');
  const [suspendModalVisible, setSuspendModalVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [validityDate, setValidityDate] = useState<Dayjs | null>(null);
  const { t } = useLanguage();

  const suspendReasons = [
    { value: '投诉', label: '投诉' },
    { value: '死亡', label: '死亡' },
    { value: '住院', label: '住院' },
    { value: '起诉', label: '起诉' },
    { value: '其他', label: '其他' },
  ];

  const forbiddenFeatures = [
    { value: '禁止分案', label: '禁止分案' },
    { value: '禁止发送短信', label: '禁止发送短信' },
    { value: '禁止电话外呼', label: '禁止电话外呼' },
    { value: '禁止WA发送', label: '禁止WA发送' },
    { value: '禁止Email发送', label: '禁止Email发送' },
    { value: '停止计算罚息', label: '停止计算罚息' },
  ];

  const filteredCases = useMemo(() => {
    return cases.filter(caseItem => {
      const matchesSearch = caseItem.borrowerName.toLowerCase().includes(searchText.toLowerCase()) || 
                          caseItem.phone.includes(searchText) || 
                          caseItem.id.toLowerCase().includes(searchText.toLowerCase());
      const matchesStage = stageFilter === 'all' || caseItem.stage === stageFilter;
      const matchesStatus = statusFilter === 'all' || caseItem.status === statusFilter;
      const matchesCollector = collectorFilter === 'all' || caseItem.assignedTo === collectorFilter;
      return matchesSearch && matchesStage && matchesStatus && matchesCollector;
    });
  }, [cases, searchText, stageFilter, statusFilter, collectorFilter]);

  const handleAssign = () => {
    if (selectedCases.length === 0) {
      message.error('请选择要指派的案件');
      return;
    }
    setAssignModalVisible(true);
  };

  const handleAssignConfirm = () => {
    if (assignMode === 'team' && !selectedTeam) {
      message.error('请选择催收组');
      return;
    }
    if (assignMode === 'collector' && !selectedCollector) {
      message.error('请选择催收员');
      return;
    }

    const updatedCases = cases.map(caseItem => {
      if (selectedCases.includes(caseItem.id)) {
        let newAssignedTo = caseItem.assignedTo;
        if (assignMode === 'collector') {
          const collector = collectors.find(c => c.value === selectedCollector);
          newAssignedTo = collector ? collector.label : newAssignedTo;
        } else if (assignMode === 'team') {
          const teamCollectors = collectors.filter(c => c.team === selectedTeam);
          if (teamCollectors.length > 0) {
            const index = selectedCases.indexOf(caseItem.id) % teamCollectors.length;
            newAssignedTo = teamCollectors[index].label;
          }
        }
        return {
          ...caseItem,
          assignedTo: newAssignedTo,
          lastUpdateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        };
      }
      return caseItem;
    });

    setCases(updatedCases);
    setAssignModalVisible(false);
    setSelectedCases([]);
    message.success(`成功指派 ${selectedCases.length} 个案件`);
  };

  const columns: ColumnsType<Case> = [
    {
      type: 'checkbox',
      key: 'selection',
      width: 50,
    },
    {
      title: '案件ID',
      dataIndex: 'id',
      key: 'id',
      width: 140,
      render: (id: string) => (
        <span style={{ color: '#0d4f3c', fontWeight: '500', fontSize: '13px' }}>{id}</span>
      ),
    },
    {
      title: '借款人',
      dataIndex: 'borrowerName',
      key: 'borrowerName',
      width: 180,
      render: (name: string) => (
        <span style={{ color: '#1f2937', fontWeight: '500', fontSize: '13px' }}>{name}</span>
      ),
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
      render: (phone: string) => (
        <span style={{ color: '#6b7280', fontSize: '13px' }}>{phone}</span>
      ),
    },
    {
      title: '逾期天数',
      dataIndex: 'overdueDays',
      key: 'overdueDays',
      width: 90,
      render: (days: number) => (
        <Tag 
          color={days > 60 ? 'red' : days > 30 ? 'orange' : days > 15 ? 'gold' : 'blue'}
          style={{ fontSize: '12px', fontWeight: '500' }}
        >
          {days} 天
        </Tag>
      ),
    },
    {
      title: '逾期金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount: number) => (
        <span style={{ color: '#dc2626', fontWeight: '600', fontSize: '13px' }}>
          {amount.toLocaleString('id-ID')} IDR
        </span>
      ),
    },
    {
      title: '阶段',
      dataIndex: 'stage',
      key: 'stage',
      width: 80,
      render: (stage: string) => (
        <Tag 
          color={stage === 'M0' ? 'blue' : stage === 'M1' ? 'gold' : stage === 'M2' ? 'orange' : stage === 'M3' ? 'red' : 'purple'}
          style={{ fontSize: '12px', fontWeight: '500' }}
        >
          {stage}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag 
          color={status === 'Open' ? 'green' : status === 'Processing' ? 'orange' : 'blue'}
          style={{ fontSize: '12px', fontWeight: '500' }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: '催收员',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      width: 130,
      render: (name: string) => (
        <span style={{ color: '#1f2937', fontSize: '13px' }}>{name}</span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
      render: (time: string) => (
        <span style={{ color: '#6b7280', fontSize: '12px' }}>{time}</span>
      ),
    },
    {
      title: '最后更新',
      dataIndex: 'lastUpdateTime',
      key: 'lastUpdateTime',
      width: 160,
      render: (time: string) => (
        <span style={{ color: '#6b7280', fontSize: '12px' }}>{time}</span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => onViewDetail(record.id)}
            style={{ color: '#0d4f3c', fontWeight: '500', padding: '0' }}
          >
            详情
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ minWidth: '1200px' }}>
      {/* 顶部工具栏 */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>案件列表</h2>
          <p style={{ margin: '0', fontSize: '13px', color: '#6b7280' }}>
            共 {filteredCases.length} 个案件
          </p>
        </div>
        <Space size="middle">
          <Button
            type="primary"
            icon={<SwapOutlined />}
            disabled={selectedCases.length === 0}
            onClick={handleAssign}
            style={{ borderRadius: '8px' }}
          >
            人工指派
          </Button>
          <Button
            type="default"
            icon={<PauseCircleOutlined />}
            disabled={selectedCases.length === 0}
            onClick={() => setSuspendModalVisible(true)}
            style={{ borderRadius: '8px' }}
          >
            停催
          </Button>
          <div style={{ 
            position: 'relative',
            width: '280px'
          }}>
            <input
              type="text"
              placeholder="搜索借款人、电话或案件ID..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 36px 10px 14px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '13px',
                backgroundColor: '#f9fafb',
                transition: 'all 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#0d4f3c';
                e.target.style.backgroundColor = '#ffffff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.backgroundColor = '#f9fafb';
              }}
            />
            <SearchOutlined style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <FilterOutlined style={{ color: '#9ca3af' }} />
            <Select
              placeholder="状态"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 120 }}
              options={[
                { value: 'all', label: '全部' },
                { value: 'Open', label: '待处理' },
                { value: 'Processing', label: '处理中' },
                { value: 'Completed', label: '已完成' },
              ]}
            />
            <Select
              placeholder="阶段"
              value={stageFilter}
              onChange={setStageFilter}
              style={{ width: 100 }}
              options={[
                { value: 'all', label: '全部' },
                { value: 'M0', label: 'M0' },
                { value: 'M1', label: 'M1' },
                { value: 'M2', label: 'M2' },
                { value: 'M3', label: 'M3' },
                { value: 'M4+', label: 'M4+' },
              ]}
            />
            <Select
              placeholder="催收员"
              value={collectorFilter}
              onChange={setCollectorFilter}
              style={{ width: 140 }}
              options={[
                { value: 'all', label: '全部' },
                ...collectors.map(collector => ({ value: collector.label, label: collector.label })),
              ]}
            />
          </div>
        </Space>
      </div>

      {/* 案件表格 */}
      <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflowX: 'auto' }}>
        <Table
          columns={columns}
          dataSource={filteredCases}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `共 ${total} 条`,
          }}
          size="middle"
          rowSelection={{
            selectedRowKeys: selectedCases,
            onChange: (selectedRowKeys) => setSelectedCases(selectedRowKeys as string[]),
          }}
          style={{ marginTop: '16px' }}
          scroll={{ x: 1400 }}
        />
      </Card>

      {/* 指派模态框 */}
      <Modal
        title="人工指派案件"
        open={assignModalVisible}
        onOk={handleAssignConfirm}
        onCancel={() => setAssignModalVisible(false)}
        width={500}
        style={{ borderRadius: '12px' }}
      >
        <Form layout="vertical">
          <Form.Item label="指派模式">
            <Select
              value={assignMode}
              onChange={setAssignMode}
              options={[
                { value: 'team', label: '按催收组分配' },
                { value: 'collector', label: '直接指定催收员' },
              ]}
            />
          </Form.Item>

          {assignMode === 'team' && (
            <>
              <Form.Item label="选择催收组">
                <Select
                  value={selectedTeam}
                  onChange={setSelectedTeam}
                  options={teams}
                />
              </Form.Item>
              <Form.Item label="分配方式">
                <Select
                  value={distributionMode}
                  onChange={setDistributionMode}
                  options={[
                    { value: 'average', label: '均分' },
                    { value: 'manual', label: '手动' },
                  ]}
                />
              </Form.Item>
            </>
          )}

          {assignMode === 'collector' && (
            <Form.Item label="选择催收员">
              <Select
                value={selectedCollector}
                onChange={setSelectedCollector}
                options={collectors.map(collector => ({
                  value: collector.value,
                  label: `${collector.label}`,
                }))}
              />
            </Form.Item>
          )}

          <Form.Item>
            <div style={{ color: '#6b7280', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              已选择 <strong style={{ color: '#0d4f3c' }}>{selectedCases.length}</strong> 个案件
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* 停催模态框 */}
      <Modal
        title="停催设置"
        open={suspendModalVisible}
        onOk={() => {
          if (!selectedReason) {
            message.error('请选择停催原因');
            return;
          }
          if (selectedFeatures.length === 0) {
            message.error('请至少选择一项禁止功能');
            return;
          }
          
          setCases(cases.filter(c => !selectedCases.includes(c.id)));
          onSuspend(selectedCases);
          setSuspendModalVisible(false);
          setSelectedCases([]);
          setSelectedReason('');
          setSelectedFeatures([]);
          setValidityDate(null);
          message.success(`成功将 ${selectedCases.length} 个案件加入停催列表`);
        }}
        onCancel={() => {
          setSuspendModalVisible(false);
          setSelectedReason('');
          setSelectedFeatures([]);
          setValidityDate(null);
        }}
        width={600}
        style={{ borderRadius: '12px' }}
      >
        <Form layout="vertical">
          <Form.Item label="停催原因 *">
            <Select
              value={selectedReason}
              onChange={setSelectedReason}
              options={suspendReasons}
              placeholder="请选择停催原因"
            />
          </Form.Item>

          <Form.Item label="有效期">
            <DatePicker
              value={validityDate}
              onChange={setValidityDate}
              showTime
              placeholder="选择停催到期时间"
            />
          </Form.Item>

          <Form.Item label="禁止功能 *">
            <Checkbox.Group
              options={forbiddenFeatures}
              value={selectedFeatures}
              onChange={setSelectedFeatures}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}
            />
          </Form.Item>

          <Form.Item>
            <div style={{ color: '#6b7280', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              已选择 <strong style={{ color: '#0d4f3c' }}>{selectedCases.length}</strong> 个案件
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CaseList;
