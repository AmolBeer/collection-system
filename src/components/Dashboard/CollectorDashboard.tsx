import React from 'react';
import { Card, Row, Col, Statistic, Progress, Table, List, Avatar, Tag, Badge } from 'antd';
import { BarChartOutlined, CheckCircleOutlined, ClockCircleOutlined, DollarOutlined, ArrowUpOutlined, PhoneOutlined, SendOutlined } from '@ant-design/icons';
import { useLanguage } from '../../i18n/LanguageContext';

interface TaskData {
  id: string;
  borrower: string;
  amount: number;
  overdueDays: number;
  stage: string;
  status: string;
  assignedTime: string;
}

interface ActivityData {
  id: string;
  action: string;
  case: string;
  result: string;
  time: string;
}

interface PerformanceData {
  day: string;
  cases: number;
  amount: number;
}

const CollectorDashboard: React.FC = () => {
  const { t } = useLanguage();

  const summaryData = {
    currentTasks: 15,
    completedTasks: 45,
    personalRecoveryRate: 78.5,
    totalAmount: 850000,
    recoveredAmount: 667250,
  };

  const currentTasks: TaskData[] = [
    { id: 'KREDITOK008946', borrower: 'EZI SADRAKH SAPUTRA', amount: 267947, overdueDays: 12, stage: 'M1', status: 'Open', assignedTime: '10 May 2024, 09:00' },
    { id: 'KREDITOK008947', borrower: 'JOHN DOE', amount: 800000, overdueDays: 35, stage: 'M2', status: 'Processing', assignedTime: '09 May 2024, 14:30' },
    { id: 'KREDITOK008948', borrower: 'JANE SMITH', amount: 300000, overdueDays: 5, stage: 'M0', status: 'Open', assignedTime: '10 May 2024, 10:15' },
    { id: 'KREDITOK008949', borrower: 'MICHAEL BROWN', amount: 600000, overdueDays: 65, stage: 'M3', status: 'Processing', assignedTime: '08 May 2024, 11:20' },
  ];

  const recentActivities: ActivityData[] = [
    { id: 'ACT-001', action: '电话联系', case: 'KREDITOK008946', result: '已承诺还款', time: '10 May 2024, 10:30' },
    { id: 'ACT-002', action: '短信提醒', case: 'KREDITOK008947', result: '已读未回复', time: '10 May 2024, 09:15' },
    { id: 'ACT-003', action: '上门拜访', case: 'KREDITOK008948', result: '已还款', time: '09 May 2024, 16:45' },
    { id: 'ACT-004', action: '电话联系', case: 'KREDITOK008949', result: '无法联系', time: '09 May 2024, 14:20' },
  ];

  const performanceTrend: PerformanceData[] = [
    { day: '周一', cases: 8, amount: 120000 },
    { day: '周二', cases: 10, amount: 150000 },
    { day: '周三', cases: 7, amount: 90000 },
    { day: '周四', cases: 12, amount: 180000 },
    { day: '周五', cases: 8, amount: 127250 },
  ];

  const taskColumns = [
    {
      title: '任务ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <span style={{ color: '#0d4f3c', fontWeight: '500', fontSize: '13px' }}>{id}</span>
      ),
    },
    {
      title: t.borrowerName,
      dataIndex: 'borrower',
      key: 'borrower',
      render: (name: string) => (
        <span style={{ color: '#1f2937', fontWeight: '500', fontSize: '13px' }}>{name}</span>
      ),
    },
    {
      title: t.overdueAmount,
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span style={{ fontWeight: '600', color: '#dc2626' }}>
          {amount.toLocaleString()} IDR
        </span>
      ),
    },
    {
      title: t.overdueDays,
      dataIndex: 'overdueDays',
      key: 'overdueDays',
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
      title: t.status,
      dataIndex: 'status',
      key: 'status',
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
      title: t.assignedTime,
      dataIndex: 'assignedTime',
      key: 'assignedTime',
      render: (time: string) => (
        <span style={{ color: '#6b7280', fontSize: '12px' }}>{time}</span>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <Statistic
              title={t.currentTasks}
              value={summaryData.currentTasks}
              prefix={<ClockCircleOutlined style={{ color: '#3b82f6' }} />}
              valueStyle={{ color: '#3b82f6', fontWeight: '700', fontSize: '28px' }}
              titleStyle={{ color: '#6b7280', fontSize: '13px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <Statistic
              title={t.completedTasks}
              value={summaryData.completedTasks}
              prefix={<CheckCircleOutlined style={{ color: '#22c55e' }} />}
              valueStyle={{ color: '#22c55e', fontWeight: '700', fontSize: '28px' }}
              titleStyle={{ color: '#6b7280', fontSize: '13px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <Statistic
              title={t.personalRecoveryRate}
              value={summaryData.personalRecoveryRate}
              suffix="%"
              prefix={<ArrowUpOutlined style={{ color: '#0d4f3c' }} />}
              valueStyle={{ color: '#0d4f3c', fontWeight: '700', fontSize: '28px' }}
              titleStyle={{ color: '#6b7280', fontSize: '13px' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <Statistic
              title={t.recoveredAmount}
              value={summaryData.recoveredAmount}
              prefix={<DollarOutlined style={{ color: '#f97316' }} />}
              valueStyle={{ color: '#f97316', fontWeight: '700', fontSize: '28px' }}
              titleStyle={{ color: '#6b7280', fontSize: '13px' }}
              formatter={(value) => `${value.toLocaleString()} IDR`}
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
                <span style={{ fontWeight: '600', color: '#1f2937' }}>{t.currentTasks}</span>
              </div>
            }
            style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          >
            <Table
              columns={taskColumns}
              dataSource={currentTasks}
              rowKey="id"
              size="middle"
              pagination={false}
            />
          </Card>
        </Col>
        <Col span={10}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PhoneOutlined style={{ color: '#0d4f3c' }} />
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
                      {item.action === '电话联系' ? (
                        <PhoneOutlined style={{ color: '#22c55e' }} />
                      ) : (
                        <SendOutlined style={{ color: '#3b82f6' }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: '500', color: '#1f2937' }}>
                          {item.action}
                        </span>
                        <Tag color="blue" style={{ fontSize: '11px' }}>{item.case}</Tag>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                        <Badge 
                          status={item.result === '已还款' ? 'success' : item.result === '已承诺还款' ? 'processing' : 'default'} 
                          text={item.result} 
                          style={{ fontSize: '11px' }}
                        />
                        <span style={{ fontSize: '11px', color: '#9ca3af' }}>{item.time}</span>
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowUpOutlined style={{ color: '#0d4f3c' }} />
                <span style={{ fontWeight: '600', color: '#1f2937' }}>{t.performanceTrend}</span>
              </div>
            }
            style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          >
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '100%', padding: '20px' }}>
                {performanceTrend.map((item) => (
                  <div key={item.day} style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ width: '60px', textAlign: 'left', fontWeight: '500', color: '#1f2937' }}>
                      {item.day}
                    </div>
                    <div style={{ flex: 1, margin: '0 20px' }}>
                      <div style={{ 
                        height: '24px', 
                        backgroundColor: '#f3f4f6', 
                        borderRadius: '6px',
                        overflow: 'hidden'
                      }}>
                        <div 
                          style={{ 
                            height: '100%', 
                            width: `${(item.cases / 15) * 100}%`,
                            background: 'linear-gradient(90deg, #0d4f3c 0%, #1a6b56 100%)',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            paddingLeft: '12px',
                            transition: 'width 0.3s ease'
                          }}
                        >
                          <span style={{ color: '#ffffff', fontSize: '12px', fontWeight: '500' }}>
                            {item.cases} 件
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ width: '150px', textAlign: 'right' }}>
                      <span style={{ fontWeight: '600', color: '#0d4f3c' }}>
                        {item.amount.toLocaleString()} IDR
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CollectorDashboard;
