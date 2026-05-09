import React from 'react';
import { Card, Row, Col, Statistic, Progress, Table, List, Avatar, Tag, Badge } from 'antd';
import { BarChartOutlined, LineChartOutlined, CheckCircleOutlined, ClockCircleOutlined, DollarOutlined, UserOutlined } from '@ant-design/icons';
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

  // 模拟数据
  const summaryData = {
    currentTasks: 15,
    completedTasks: 45,
    personalRecoveryRate: 78.5,
    totalAmount: 850000,
    recoveredAmount: 667250,
  };

  const currentTasks: TaskData[] = [
    { id: 'TASK-001', borrower: '张三', amount: 50000, overdueDays: 15, stage: 'M1', status: '待处理', assignedTime: '2024-04-01 09:00' },
    { id: 'TASK-002', borrower: '李四', amount: 80000, overdueDays: 35, stage: 'M2', status: '处理中', assignedTime: '2024-03-31 14:30' },
    { id: 'TASK-003', borrower: '王五', amount: 30000, overdueDays: 5, stage: 'M0', status: '待处理', assignedTime: '2024-04-01 10:15' },
    { id: 'TASK-004', borrower: '赵六', amount: 60000, overdueDays: 65, stage: 'M3', status: '处理中', assignedTime: '2024-03-30 11:20' },
  ];

  const recentActivities: ActivityData[] = [
    { id: 'ACT-001', action: '电话联系', case: 'TASK-005', result: '已承诺还款', time: '2024-04-01 10:30' },
    { id: 'ACT-002', action: '短信提醒', case: 'TASK-006', result: '已读未回复', time: '2024-04-01 09:15' },
    { id: 'ACT-003', action: '上门拜访', case: 'TASK-007', result: '已还款', time: '2024-03-31 16:45' },
    { id: 'ACT-004', action: '电话联系', case: 'TASK-008', result: '无法联系', time: '2024-03-31 14:20' },
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
    },
    {
      title: t.borrowerName,
      dataIndex: 'borrower',
      key: 'borrower',
    },
    {
      title: t.overdueAmount,
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: t.overdueDays,
      dataIndex: 'overdueDays',
      key: 'overdueDays',
      render: (days: number) => (
        <Tag color={days > 30 ? 'red' : days > 15 ? 'orange' : 'blue'}>
          {days} 天
        </Tag>
      ),
    },
    {
      title: t.stageName,
      dataIndex: 'stage',
      key: 'stage',
    },
    {
      title: t.status,
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === '待处理' ? 'blue' : status === '处理中' ? 'orange' : 'green'}>
          {status}
        </Tag>
      ),
    },
    {
      title: '分配时间',
      dataIndex: 'assignedTime',
      key: 'assignedTime',
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title={t.currentTasks}
              value={summaryData.currentTasks}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t.completedTasks}
              value={summaryData.completedTasks}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t.personalRecoveryRate}
              value={summaryData.personalRecoveryRate}
              suffix="%"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={t.recoveredAmount}
              value={summaryData.recoveredAmount}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#fa8c16' }}
              formatter={(value) => `¥${(value / 10000).toFixed(2)}万`}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title={t.currentTasks} extra={<BarChartOutlined />}>
            <Table
              columns={taskColumns}
              dataSource={currentTasks}
              rowKey="id"
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title={t.recentActivities} extra={<LineChartOutlined />}>
            <List
              dataSource={recentActivities}
              rowKey="id"
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar>{item.action.charAt(0)}</Avatar>}
                    title={
                      <span>
                        {item.action} <Tag color="blue">{item.case}</Tag>
                      </span>
                    }
                    description={
                      <div>
                        <Badge status={item.result === '已还款' ? 'success' : item.result === '已承诺还款' ? 'processing' : 'default'} text={item.result} />
                        <span style={{ marginLeft: 8 }}>{item.time}</span>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title={t.performanceTrend} extra={<LineChartOutlined />}>
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <h3>本周业绩趋势</h3>
                <div style={{ marginTop: 20 }}>
                  {performanceTrend.map((item) => (
                    <div key={item.day} style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                      <div style={{ width: 60, textAlign: 'left' }}>{item.day}</div>
                      <div style={{ flex: 1, margin: '0 16px' }}>
                        <Progress 
                          percent={(item.cases / 12) * 100} 
                          size="small" 
                          status="active"
                        />
                      </div>
                      <div style={{ width: 120, textAlign: 'right' }}>
                        {item.cases} 件 / ¥{item.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CollectorDashboard;