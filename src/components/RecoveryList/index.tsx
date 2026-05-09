import React, { useState, useMemo } from 'react';
import { Card, Table, Input, Select, Space, Tag, DatePicker, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, FilterOutlined, EyeOutlined, DollarOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import { useLanguage } from '../../i18n/LanguageContext';

interface Recovery {
  id: string;
  caseId: string;
  borrowerName: string;
  phone: string;
  originalAmount: number;
  recoveredAmount: number;
  recoveryDate: string;
  collector: string;
  collectorId: string;
  team: string;
  teamLeader: string;
  recoveryMethod: string;
  notes: string;
}

interface User {
  id: string;
  name: string;
  role: 'admin' | 'teamLeader' | 'collector';
  team: string;
  managedUsers: string[];
}

const defaultRecoveries: Recovery[] = [
  { id: 'REC-001', caseId: 'CASE-006', borrowerName: '孙八', phone: '13800138006', originalAmount: 45000, recoveredAmount: 45000, recoveryDate: '2024-03-30', collector: '催收员A', collectorId: 'collector1', team: '催收一组', teamLeader: '催收主管1', recoveryMethod: '电话催收', notes: '借款人主动还款' },
  { id: 'REC-002', caseId: 'CASE-009', borrowerName: '郑十一', phone: '13800138009', originalAmount: 35000, recoveredAmount: 35000, recoveryDate: '2024-03-29', collector: '催收员B', collectorId: 'collector2', team: '催收二组', teamLeader: '催收主管2', recoveryMethod: '上门催收', notes: '借款人在家人陪同下还款' },
  { id: 'REC-003', caseId: 'CASE-010', borrowerName: '王十二', phone: '13800138010', originalAmount: 60000, recoveredAmount: 60000, recoveryDate: '2024-03-28', collector: '催收员C', collectorId: 'collector3', team: '催收三组', teamLeader: '催收主管3', recoveryMethod: '短信催收', notes: '借款人通过VA码还款' },
  { id: 'REC-004', caseId: 'CASE-011', borrowerName: '赵十三', phone: '13800138011', originalAmount: 25000, recoveredAmount: 25000, recoveryDate: '2024-03-27', collector: '催收员D', collectorId: 'collector4', team: '催收一组', teamLeader: '催收主管1', recoveryMethod: '电话催收', notes: '借款人承诺还款并按时到账' },
  { id: 'REC-005', caseId: 'CASE-012', borrowerName: '钱十四', phone: '13800138012', originalAmount: 55000, recoveredAmount: 55000, recoveryDate: '2024-03-26', collector: '催收员E', collectorId: 'collector5', team: '催收二组', teamLeader: '催收主管2', recoveryMethod: '上门催收', notes: '借款人亲属代为还款' },
];

// 模拟当前用户信息
const currentUser: User = {
  id: 'collector1',
  name: '催收员A',
  role: 'collector',
  team: '催收一组',
  managedUsers: [],
};

// 模拟用户列表
const users: User[] = [
  { id: 'admin', name: '管理员', role: 'admin', team: '管理组', managedUsers: ['collector1', 'collector2', 'collector3', 'collector4', 'collector5'] },
  { id: 'teamLeader1', name: '催收主管1', role: 'teamLeader', team: '催收一组', managedUsers: ['collector1', 'collector4'] },
  { id: 'teamLeader2', name: '催收主管2', role: 'teamLeader', team: '催收二组', managedUsers: ['collector2', 'collector5'] },
  { id: 'teamLeader3', name: '催收主管3', role: 'teamLeader', team: '催收三组', managedUsers: ['collector3'] },
  { id: 'collector1', name: '催收员A', role: 'collector', team: '催收一组', managedUsers: [] },
  { id: 'collector2', name: '催收员B', role: 'collector', team: '催收二组', managedUsers: [] },
  { id: 'collector3', name: '催收员C', role: 'collector', team: '催收三组', managedUsers: [] },
  { id: 'collector4', name: '催收员D', role: 'collector', team: '催收一组', managedUsers: [] },
  { id: 'collector5', name: '催收员E', role: 'collector', team: '催收二组', managedUsers: [] },
];

const RecoveryList: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [teamFilter, setTeamFilter] = useState('all');
  const [collectorFilter, setCollectorFilter] = useState('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const { t } = useLanguage();

  // 获取当前用户可查看的催收员ID列表
  const getViewableCollectorIds = () => {
    if (currentUser.role === 'admin') {
      return users.filter(u => u.role === 'collector').map(u => u.id);
    } else if (currentUser.role === 'teamLeader') {
      return currentUser.managedUsers;
    } else {
      return [currentUser.id];
    }
  };

  // 过滤数据
  const filteredRecoveries = useMemo(() => {
    const viewableCollectorIds = getViewableCollectorIds();
    
    return defaultRecoveries.filter(recovery => {
      // 权限过滤
      if (!viewableCollectorIds.includes(recovery.collectorId)) {
        return false;
      }
      
      // 搜索过滤
      const matchesSearch = recovery.borrowerName.includes(searchText) || 
                          recovery.phone.includes(searchText) || 
                          recovery.caseId.includes(searchText) ||
                          recovery.collector.includes(searchText);
      
      // 团队过滤
      const matchesTeam = teamFilter === 'all' || recovery.team === teamFilter;
      
      // 催收员过滤
      const matchesCollector = collectorFilter === 'all' || recovery.collectorId === collectorFilter;
      
      // 日期过滤
      const matchesDate = (!startDate || recovery.recoveryDate >= startDate) &&
                        (!endDate || recovery.recoveryDate <= endDate);
      
      return matchesSearch && matchesTeam && matchesCollector && matchesDate;
    });
  }, [searchText, teamFilter, collectorFilter, startDate, endDate]);

  // 计算汇总数据
  const summaryData = useMemo(() => {
    return filteredRecoveries.reduce(
      (acc, recovery) => {
        acc.totalCases += 1;
        acc.totalOriginalAmount += recovery.originalAmount;
        acc.totalRecoveredAmount += recovery.recoveredAmount;
        return acc;
      },
      { totalCases: 0, totalOriginalAmount: 0, totalRecoveredAmount: 0 }
    );
  }, [filteredRecoveries]);

  // 获取可选择的团队列表
  const teams = useMemo(() => {
    const viewableCollectorIds = getViewableCollectorIds();
    const viewableTeams = new Set<string>();
    
    defaultRecoveries.forEach(recovery => {
      if (viewableCollectorIds.includes(recovery.collectorId)) {
        viewableTeams.add(recovery.team);
      }
    });
    
    return Array.from(viewableTeams).map(team => ({ value: team, label: team }));
  }, []);

  // 获取可选择的催收员列表
  const collectors = useMemo(() => {
    const viewableCollectorIds = getViewableCollectorIds();
    return users
      .filter(user => viewableCollectorIds.includes(user.id) && user.role === 'collector')
      .map(user => ({ value: user.id, label: user.name }));
  }, []);

  const columns: ColumnsType<Recovery> = [
    {
      title: '回收ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '案件ID',
      dataIndex: 'caseId',
      key: 'caseId',
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
      title: '原始金额',
      dataIndex: 'originalAmount',
      key: 'originalAmount',
      width: 100,
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '回收金额',
      dataIndex: 'recoveredAmount',
      key: 'recoveredAmount',
      width: 100,
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '回收率',
      dataIndex: 'recoveredAmount',
      key: 'recoveryRate',
      width: 80,
      render: (recoveredAmount: number, record: Recovery) => {
        const rate = ((recoveredAmount / record.originalAmount) * 100).toFixed(2);
        return `${rate}%`;
      },
    },
    {
      title: '回收日期',
      dataIndex: 'recoveryDate',
      key: 'recoveryDate',
      width: 100,
    },
    {
      title: '催收员',
      dataIndex: 'collector',
      key: 'collector',
      width: 100,
    },
    {
      title: '所属团队',
      dataIndex: 'team',
      key: 'team',
      width: 100,
    },
    {
      title: '回收方式',
      dataIndex: 'recoveryMethod',
      key: 'recoveryMethod',
      width: 100,
      render: (method: string) => (
        <Tag color="green">{method}</Tag>
      ),
    },
    {
      title: '备注',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0 }}>催回列表</h2>
        <Space size="middle">
          <Input
            placeholder="搜索借款人、电话或案件ID"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
          />
          <Select
            placeholder="选择团队"
            value={teamFilter}
            onChange={setTeamFilter}
            style={{ width: 120 }}
            options={[
              { value: 'all', label: '全部' },
              ...teams,
            ]}
          />
          <Select
            placeholder="选择催收员"
            value={collectorFilter}
            onChange={setCollectorFilter}
            style={{ width: 120 }}
            options={[
              { value: 'all', label: '全部' },
              ...collectors,
            ]}
          />
          <DatePicker
            placeholder="开始日期"
            onChange={(date) => setStartDate(date ? date.format('YYYY-MM-DD') : '')}
            style={{ width: 150 }}
          />
          <DatePicker
            placeholder="结束日期"
            onChange={(date) => setEndDate(date ? date.format('YYYY-MM-DD') : '')}
            style={{ width: 150 }}
          />
        </Space>
      </div>

      {/* 汇总信息 */}
      <div style={{ marginBottom: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>{summaryData.totalCases}</div>
            <div style={{ color: '#666', marginTop: 4 }}>回收案件数</div>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#fa8c16' }}>¥{summaryData.totalOriginalAmount.toLocaleString()}</div>
            <div style={{ color: '#666', marginTop: 4 }}>原始金额</div>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>¥{summaryData.totalRecoveredAmount.toLocaleString()}</div>
            <div style={{ color: '#666', marginTop: 4 }}>回收金额</div>
          </div>
        </Card>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#722ed1' }}>
              {summaryData.totalOriginalAmount > 0 
                ? ((summaryData.totalRecoveredAmount / summaryData.totalOriginalAmount) * 100).toFixed(2) 
                : '0.00'
              }%
            </div>
            <div style={{ color: '#666', marginTop: 4 }}>总回收率</div>
          </div>
        </Card>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredRecoveries}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `共 ${total} 条`,
          }}
          size="small"
        />
      </Card>
    </div>
  );
};

export default RecoveryList;