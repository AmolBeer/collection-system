import React from 'react';
import { Card, Row, Col, Statistic, Progress, Table, List, Avatar, Tag } from 'antd';
import { BarChartOutlined, TeamOutlined, UserOutlined, DollarOutlined, CheckCircleOutlined, ClockCircleOutlined, ArrowUpOutlined } from '@ant-design/icons';
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
    { id: '1', user: 'Dewi Anggraini', action: '完成案件', case: 'KREDITOK008946', time: '10 May 2024, 10:30' },
    { id: '2', user: 'Budi Santoso', action: '分配案件', case: 'KREDITOK008947', time: '10 May 2024, 09:15' },
    { id: '3', user: 'Siti Aminah', action: '更新状态', case: 'KREDITOK008948', time: '10 May 2024, 08:45' },
    { id: '4', user: 'Rudi Hartono', action: '完成案件', case: 'KREDITOK008949', time: '09 May 2024, 17:20' },
  ];

  const columns = [
    {
      title: t.stageName,
      dataIndex: 'stage',
      key: 'stage',
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
      title: t.totalCases,
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: t.totalAmount,
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span style={{ fontWeight: '600', color: '#dc2626' }}>
          {amount.toLocaleString()} IDR
        </span>
      ),
    },
    {
      title: t.recoveryRate,
      dataIndex: 'recoveryRate',
      key: 'recoveryRate',
      render: (rate: number) => (
        <div>
          <Progress percent={rate} size="small" strokeColor="#0d4f3c" />
          <span style={{ display: 'block', marginTop: 4, textAlign: 'right', fontWeight: '500', color: '#0d4f3c' }}>{rate}%</span>
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
      render: (rate: number) => (
        <span style={{ fontWeight: '600', color: '#0d4f3c' }}>{rate}%</span>
      ),
    },
    {
      title: t.recoveredAmount,
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span style={{ fontWeight: '600', color: '#16a34a' }}>
          {amount.toLocaleString()} IDR
        </span>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <Statistic
              title={t.totalCases}
              value={summaryData.totalCases}
              prefix={<UserOutlined style={{ color: '#0d4f3c' }} />}
              valueStyle={{ color: '#1f2937', fontWeight: '700', fontSize: '28px' }}
              titleStyle={{ color: '#6b7280', fontSize: '13px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <Statistic
              title={t.pendingCases}
              value={summaryData.pendingCases}
              prefix={<ClockCircleOutlined style={{ color: '#f97316' }} />}
              valueStyle={{ color: '#f97316', fontWeight: '700', fontSize: '28px' }}
              titleStyle={{ color: '#6b7280', fontSize: '13px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <Statistic
              title={t.completedCases}
              value={summaryData.completedCases}
              prefix={<CheckCircleOutlined style={{ color: '#22c55e' }} />}
              valueStyle={{ color: '#22c55e', fontWeight: '700', fontSize: '28px' }}
              titleStyle={{ color: '#6b7280', fontSize: '13px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <Statistic
              title={t.recoveryRate}
              value={summaryData.recoveryRate}
              suffix="%"
              prefix={<ArrowUpOutlined style={{ color: '#0d4f3c' }} />}
              valueStyle={{ color: '#0d4f3c', fontWeight: '700', fontSize: '28px' }}
              titleStyle={{ color: '#6b7280', fontSize: '13px' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={14}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChartOutlined style={{ color: '#0d4f3c' }} />
                <span style={{ fontWeight: '600', color: '#1f2937' }}>{t.caseDistribution}</span>
              </div>
            }
            style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          >
            <Table
              columns={columns}
              dataSource={caseDistribution}
              rowKey="stage"
              size="middle"
              pagination={false}
            />
          </Card>
        </Col>
        <Col span={10}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TeamOutlined style={{ color: '#0d4f3c' }} />
                <span style={{ fontWeight: '600', color: '#1f2937' }}>{t.teamPerformance}</span>
              </div>
            }
            style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          >
            <Table
              columns={teamColumns}
              dataSource={teamPerformance}
              rowKey="name"
              size="middle"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarOutlined style={{ color: '#0d4f3c' }} />
                <span style={{ fontWeight: '600', color: '#1f2937' }}>{t.recentActivities}</span>
              </div>
            }
            style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          >
            <List
              dataSource={recentActivities}
              rowKey="id"
              renderItem={(item) => (
                <List.Item 
                  style={{ 
                    padding: '12px 0', 
                    borderBottom: '1px solid #f3f4f6',
                    marginBottom: '0'
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        style={{ backgroundColor: '#0d4f3c' }}
                      >
                        {item.user.charAt(0)}
                      </Avatar>
                    }
                    title={
                      <span>
                        <strong style={{ color: '#1f2937' }}>{item.user}</strong> 
                        <span style={{ color: '#6b7280', margin: '0 8px' }}>{item.action}</span>
                        <Tag color="blue" style={{ fontSize: '11px' }}>{item.case}</Tag>
                      </span>
                    }
                    description={
                      <span style={{ color: '#9ca3af', fontSize: '12px' }}>{item.time}</span>
                    }
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
