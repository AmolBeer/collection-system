import React, { useState, useMemo } from 'react';
import { Table, Button, Space, Input, Select, Card, Tag, message, Modal, Form } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, FilterOutlined, EyeOutlined, TeamOutlined, UserOutlined, SwapOutlined } from '@ant-design/icons';
import { useLanguage } from '../../i18n/LanguageContext';

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
  { id: 'CASE-001', borrowerName: '张三', phone: '13800138001', overdueDays: 15, amount: 50000, stage: 'M1', status: '待处理', assignedTo: '催收员A', createTime: '2024-03-15 10:00:00', lastUpdateTime: '2024-03-30 14:30:00' },
  { id: 'CASE-002', borrowerName: '李四', phone: '13800138002', overdueDays: 35, amount: 80000, stage: 'M2', status: '处理中', assignedTo: '催收员B', createTime: '2024-03-10 09:00:00', lastUpdateTime: '2024-03-31 10:15:00' },
  { id: 'CASE-003', borrowerName: '王五', phone: '13800138003', overdueDays: 5, amount: 30000, stage: 'M0', status: '待处理', assignedTo: '催收员A', createTime: '2024-03-20 11:00:00', lastUpdateTime: '2024-03-29 09:45:00' },
  { id: 'CASE-004', borrowerName: '赵六', phone: '13800138004', overdueDays: 65, amount: 60000, stage: 'M3', status: '处理中', assignedTo: '催收员C', createTime: '2024-02-25 14:00:00', lastUpdateTime: '2024-03-31 16:20:00' },
  { id: 'CASE-005', borrowerName: '钱七', phone: '13800138005', overdueDays: 100, amount: 120000, stage: 'M4+', status: '待处理', assignedTo: '催收员B', createTime: '2024-02-10 08:00:00', lastUpdateTime: '2024-03-28 11:30:00' },
  { id: 'CASE-006', borrowerName: '孙八', phone: '13800138006', overdueDays: 25, amount: 45000, stage: 'M1', status: '已完成', assignedTo: '催收员A', createTime: '2024-03-18 13:00:00', lastUpdateTime: '2024-03-30 15:45:00' },
  { id: 'CASE-007', borrowerName: '周九', phone: '13800138007', overdueDays: 45, amount: 75000, stage: 'M2', status: '处理中', assignedTo: '催收员C', createTime: '2024-03-05 10:30:00', lastUpdateTime: '2024-03-31 09:20:00' },
  { id: 'CASE-008', borrowerName: '吴十', phone: '13800138008', overdueDays: 85, amount: 90000, stage: 'M3', status: '待处理', assignedTo: '催收员B', createTime: '2024-02-20 15:00:00', lastUpdateTime: '2024-03-29 14:15:00' },
];

const teams = [
  { value: 'team1', label: '催收一组' },
  { value: 'team2', label: '催收二组' },
  { value: 'team3', label: '催收三组' },
];

const collectors = [
  { value: 'collector1', label: '催收员A', team: 'team1' },
  { value: 'collector2', label: '催收员B', team: 'team2' },
  { value: 'collector3', label: '催收员C', team: 'team3' },
  { value: 'collector4', label: '催收员D', team: 'team1' },
  { value: 'collector5', label: '催收员E', team: 'team2' },
];

const CaseList: React.FC<{ onViewDetail: (caseId: string) => void }> = ({ onViewDetail }) => {
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
  const { t } = useLanguage();

  const filteredCases = useMemo(() => {
    return cases.filter(caseItem => {
      const matchesSearch = caseItem.borrowerName.includes(searchText) || 
                          caseItem.phone.includes(searchText) || 
                          caseItem.id.includes(searchText);
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

    // 模拟指派逻辑
    const updatedCases = cases.map(caseItem => {
      if (selectedCases.includes(caseItem.id)) {
        let newAssignedTo = caseItem.assignedTo;
        if (assignMode === 'collector') {
          const collector = collectors.find(c => c.value === selectedCollector);
          newAssignedTo = collector ? collector.label : newAssignedTo;
        } else if (assignMode === 'team') {
          // 均分模式：简单轮询分配
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
      width: 100,
    },
    {
      title: t.borrowerName,
      dataIndex: 'borrowerName',
      key: 'borrowerName',
      width: 100,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
    },
    {
      title: t.overdueDays,
      dataIndex: 'overdueDays',
      key: 'overdueDays',
      width: 80,
      render: (days: number) => (
        <Tag color={days > 30 ? 'red' : days > 15 ? 'orange' : 'blue'}>
          {days} 天
        </Tag>
      ),
    },
    {
      title: t.overdueAmount,
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: t.stageName,
      dataIndex: 'stage',
      key: 'stage',
      width: 80,
    },
    {
      title: t.status,
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === '待处理' ? 'blue' : status === '处理中' ? 'orange' : 'green'}>
          {status}
        </Tag>
      ),
    },
    {
      title: '分配给',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
    },
    {
      title: '最后更新',
      dataIndex: 'lastUpdateTime',
      key: 'lastUpdateTime',
      width: 150,
    },
    {
      title: t.action,
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => onViewDetail(record.id)}
          >
            详情
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0 }}>案件列表</h2>
        <Space size="middle">
          <Button
            type="primary"
            icon={<SwapOutlined />}
            disabled={selectedCases.length === 0}
            onClick={handleAssign}
          >
            人工指派
          </Button>
          <Input
            placeholder="搜索借款人、电话或案件ID"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Select
            placeholder="筛选状态"
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 120 }}
            options={[
              { value: 'all', label: '全部' },
              { value: '处理中', label: '处理中' },
              { value: '已完成', label: '已完成' },
              { value: '已拒绝', label: '已拒绝' },
            ]}
          />
          <Select
            placeholder="筛选阶段"
            value={stageFilter}
            onChange={setStageFilter}
            style={{ width: 100 }}
            options={[
              { value: 'all', label: '全部' },
              { value: 'M0', label: 'M0' },
              { value: 'M1', label: 'M1' },
              { value: 'M2', label: 'M2' },
              { value: 'M3', label: 'M3' },
            ]}
          />
          <Select
            placeholder="筛选催收员"
            value={collectorFilter}
            onChange={setCollectorFilter}
            style={{ width: 120 }}
            options={[
              { value: 'all', label: '全部' },
              ...collectors.map(collector => ({ value: collector.value, label: collector.label })),
            ]}
          />
        </Space>
      </div>
      <Card>
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
          size="small"
          rowSelection={{
            selectedRowKeys: selectedCases,
            onChange: (selectedRowKeys) => setSelectedCases(selectedRowKeys as string[]),
          }}
        />
      </Card>

      {/* 指派模态框 */}
      <Modal
        title="人工指派案件"
        open={assignModalVisible}
        onOk={handleAssignConfirm}
        onCancel={() => setAssignModalVisible(false)}
        width={500}
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
                  label: `${collector.label} (${teams.find(t => t.value === collector.team)?.label})`,
                }))}
              />
            </Form.Item>
          )}

          <Form.Item>
            <div style={{ color: '#666' }}>
              已选择 {selectedCases.length} 个案件
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CaseList;