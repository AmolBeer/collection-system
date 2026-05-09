import React from 'react';
import { Card, Row, Col, Statistic, Progress, Table, List, Avatar, Tag } from 'antd';
import { BarChartOutlined, LineChartOutlined, TeamOutlined, UserOutlined, DollarOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useLanguage } from '../../i18n/LanguageContext';

interface CaseData {
  stage: string;
  count: number;
  amount: number;
  recoveryRate: number;
}

interface TeamData {
  name: string;
  cases: number;
  recoveryRate: number;
  amount: number;
}

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();

  // 模拟数据
  const summaryData = {
    totalCases: 1250,
    pendingCases: 320,
    completedCases: 930,
    recoveryRate: 74.4,
    totalAmount: 5800000,
    recoveredAmount: 4315200,
  };

  const caseDistribution: CaseData[] = [
    { stage: 'M0', count: 450, amount: 1800000, recoveryRate: 95 },
    { stage: 'M1', count: 320, amount: 1280000, recoveryRate: 82 },
    { stage: 'M2', count: 250, amount: 1000000, recoveryRate: 65 },
    { stage: 'M3', count: 150, amount: 600000, recoveryRate: 45 },
    { stage: 'M4+', count: 80, amount: 1120000, recoveryRate: 20 },
  ];

  const teamPerformance: TeamData[] = [
    { name: '催收一组', cases: 420, recoveryRate: 78, amount: 1560000 },
    { name: '催收二组', cases: 380, recoveryRate: 75, amount: 1425000 },
    { name: '催收三组', cases: 450, recoveryRate: 70, amount: 1335200 },
  ];

  const recentActivities = [
    { id: '1', user: '张三', action: '完成案件', case: 'CASE-001', time: '2024-04-01 10:30' },
    { id: '2', user: '李四', action: '分配案件', case: 'CASE-002', time: '2024-04-01 09:15' },
    { id: '3', user: '王五', action: '更新状态', case: 'CASE-003', time: '2024-04-01 08:45' },
    { id: '4', user: '赵六', action: '完成案件', case: 'CASE-004', time: '2024-03-31 17:20' },
  ];

  const columns = [
    {
      title: t.stageName,
      dataIndex: 'stage',
      key: 'stage',
    },
    {
      title: t.totalCases,
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: t.totalAmount,
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: t.recoveryRate,
      dataIndex: 'recoveryRate',
      key: 'recoveryRate',
      render: (rate: number) => (
        <div>
          <Progress percent={rate} size="small" />
          <span style={{ display: 'block', marginTop: 4 }}>{rate}%</span>
        </div>
      ),
    },
  ];

  const teamColumns = [
    {
      title: t.department,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t.totalCases,
      dataIndex: 'cases',
      key: 'cases',
    },
    {
      title: t.recoveryRate,
      dataIndex: 'recoveryRate',
      key: 'recoveryRate',
      render: (rate: number) => `${rate}%`,
    },
    {
      title: t.recoveredAmount,
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title={t.totalCases}
              value={summaryData.totalCases}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t.pendingCases}
              value={summaryData.pendingCases}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t.completedCases}
              value={summaryData.completedCases}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t.recoveryRate}
              value={summaryData.recoveryRate}
              suffix="%"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title={t.caseDistribution} extra={<BarChartOutlined />}>
            <Table
              columns={columns}
              dataSource={caseDistribution}
              rowKey="stage"
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title={t.teamPerformance} extra={<TeamOutlined />}>
            <Table
              columns={teamColumns}
              dataSource={teamPerformance}
              rowKey="name"
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title={t.recentActivities} extra={<LineChartOutlined />}>
            <List
              dataSource={recentActivities}
              rowKey="id"
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar>{item.user.charAt(0)}</Avatar>}
                    title={
                      <span>
                        {item.user} {item.action} <Tag color="blue">{item.case}</Tag>
                      </span>
                    }
                    description={item.time}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;