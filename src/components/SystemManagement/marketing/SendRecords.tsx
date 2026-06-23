import React, { useState } from 'react';
import { Table, Button, Modal, Form, message, Space, Card, Tag, Input, DatePicker, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, ReloadOutlined, SendOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import { useLanguage } from '../../../i18n/LanguageContext';

interface SendRecord {
  id: string;
  sendTime: string;
  sendMethod: 'automatic' | 'manual';
  sendChannel: 'SMS' | 'Push';
  batchNumber: string;
  sendResult: 'success' | 'failed' | 'partial';
  sendCount: number;
  failCount: number;
  successRate: number;
  status: 'pending' | 'sending' | 'sent' | 'failed';
  content: string;
}

const defaultRecords: SendRecord[] = [
  {
    id: '1',
    sendTime: '2024-04-01 10:00:00',
    sendMethod: 'manual',
    sendChannel: 'SMS',
    batchNumber: 'BATCH20240401001',
    sendResult: 'success',
    sendCount: 5,
    failCount: 0,
    successRate: 100,
    status: 'sent',
    content: '尊敬的用户，您的还款金额为5000元，还款日期为2024-04-15，请及时还款。',
  },
  {
    id: '2',
    sendTime: '2024-04-02 14:30:00',
    sendMethod: 'automatic',
    sendChannel: 'SMS',
    batchNumber: 'BATCH20240402001',
    sendResult: 'partial',
    sendCount: 8,
    failCount: 2,
    successRate: 75,
    status: 'sent',
    content: '尊敬的用户，您的贷款已逾期3天，请尽快处理以免影响您的信用记录。',
  },
  {
    id: '3',
    sendTime: '2024-04-03 09:15:00',
    sendMethod: 'manual',
    sendChannel: 'Push',
    batchNumber: 'BATCH20240403001',
    sendResult: 'failed',
    sendCount: 3,
    failCount: 3,
    successRate: 0,
    status: 'failed',
    content: '【还款提醒】您有一笔贷款即将到期，请及时登录APP查看详情。',
  },
];

const SendRecords: React.FC = () => {
  const { t } = useLanguage();
  const [records] = useState<SendRecord[]>(defaultRecords);
  const [resendModalVisible, setResendModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SendRecord | null>(null);
  const [resendForm] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);

  const handleResend = (record: SendRecord) => {
    if (record.failCount === 0) {
      message.info('该批次没有失败记录，无需补发');
      return;
    }
    setSelectedRecord(record);
    resendForm.setFieldsValue({ resendCount: record.failCount });
    setResendModalVisible(true);
  };

  const handleConfirmResend = () => {
    resendForm.validateFields().then((values) => {
      message.success(`成功补发 ${values.resendCount} 条失败记录`);
      setResendModalVisible(false);
      resendForm.resetFields();
      setSelectedRecord(null);
    });
  };

  const handleRefresh = () => {
    message.success('刷新成功');
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.batchNumber.toLowerCase().includes(searchText.toLowerCase()) ||
      record.sendTime.includes(searchText);
    
    let matchesDate = true;
    if (dateRange[0] && dateRange[1]) {
      const recordDate = new Date(record.sendTime);
      matchesDate = recordDate >= dateRange[0].toDate() && recordDate <= dateRange[1].toDate();
    }
    
    return matchesSearch && matchesDate;
  });

  const columns: ColumnsType<SendRecord> = [
    {
      title: t.sentDate,
      dataIndex: 'sendTime',
      key: 'sendTime',
      width: 180,
      sorter: (a, b) => new Date(a.sendTime).getTime() - new Date(b.sendTime).getTime(),
    },
    {
      title: t.sendMethod,
      dataIndex: 'sendMethod',
      key: 'sendMethod',
      width: 100,
      render: (method: string) => (
        <Tag color={method === 'automatic' ? 'blue' : 'green'}>
          {method === 'automatic' ? t.automatic : t.manual}
        </Tag>
      ),
    },
    {
      title: t.sendChannel,
      dataIndex: 'sendChannel',
      key: 'sendChannel',
      width: 80,
      render: (channel: string) => (
        <Tag color={channel === 'SMS' ? 'purple' : 'orange'}>
          {channel === 'SMS' ? t.SMS : t.Push}
        </Tag>
      ),
    },
    {
      title: t.sendContent,
      dataIndex: 'content',
      key: 'content',
      width: 300,
      ellipsis: true,
      render: (content: string) => (
        <span title={content}>{content}</span>
      ),
    },
    {
      title: t.batchNumber,
      dataIndex: 'batchNumber',
      key: 'batchNumber',
      width: 180,
    },
    {
      title: t.sendResult,
      dataIndex: 'sendResult',
      key: 'sendResult',
      width: 100,
      render: (result: string) => {
        const resultMap: Record<string, { text: string, color: string, icon: React.ReactNode }> = {
          'success': { text: t.success, color: 'green', icon: <CheckCircleOutlined /> },
          'failed': { text: t.failed, color: 'red', icon: <CloseCircleOutlined /> },
          'partial': { text: t.partial, color: 'orange', icon: <SendOutlined /> },
        };
        const resultInfo = resultMap[result];
        return (
          <Tag color={resultInfo.color} icon={resultInfo.icon}>
            {resultInfo.text}
          </Tag>
        );
      },
    },
    {
      title: t.sendCount,
      dataIndex: 'sendCount',
      key: 'sendCount',
      width: 100,
      render: (count: number) => `${count} ${t.items}`,
    },
    {
      title: t.failCount,
      dataIndex: 'failCount',
      key: 'failCount',
      width: 100,
      render: (count: number) => (
        <span style={{ color: count > 0 ? 'red' : 'inherit' }}>
          {count} {t.items}
        </span>
      ),
    },
    {
      title: t.successRate,
      dataIndex: 'successRate',
      key: 'successRate',
      width: 100,
      render: (rate: number) => (
        <span style={{ color: rate === 100 ? 'green' : rate > 0 ? 'orange' : 'red' }}>
          {rate}%
        </span>
      ),
    },
    {
      title: t.status,
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap: Record<string, { text: string, color: string }> = {
          'pending': { text: t.pending, color: 'default' },
          'sending': { text: t.pending, color: 'blue' },
          'sent': { text: t.sent, color: 'green' },
          'failed': { text: t.failed, color: 'red' },
        };
        const statusInfo = statusMap[status];
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: t.action,
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          {record.failCount > 0 && (
            <Button 
              type="link" 
              size="small"
              onClick={() => handleResend(record)}
            >
              {t.resend}
            </Button>
          )}
          {record.failCount === 0 && (
            <span style={{ color: '#999', fontSize: 12 }}>{t.noNeedResend}</span>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
          刷新
        </Button>
      </div>
      
      <Card variant="borderless">
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Input
              placeholder="搜索批次编号或发送时间"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={8}>
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [Dayjs | null, Dayjs | null])}
              placeholder={['开始日期', '结束日期']}
            />
          </Col>
        </Row>
        
        <Table
          columns={columns}
          dataSource={filteredRecords}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
      
      <Modal
        title="失败对象补发"
        open={resendModalVisible}
        onOk={handleConfirmResend}
        onCancel={() => {
          setResendModalVisible(false);
          resendForm.resetFields();
          setSelectedRecord(null);
        }}
        okText="确认补发"
        cancelText="取消"
      >
        <Form form={resendForm} layout="vertical">
          <Form.Item label="批次信息">
            <div style={{ padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
              <p style={{ margin: '4px 0' }}><strong>批次编号：</strong>{selectedRecord?.batchNumber}</p>
              <p style={{ margin: '4px 0' }}><strong>发送时间：</strong>{selectedRecord?.sendTime}</p>
              <p style={{ margin: '4px 0' }}><strong>失败数量：</strong>{selectedRecord?.failCount} 条</p>
            </div>
          </Form.Item>
          
          <Form.Item
            name="resendCount"
            label="补发数量"
            rules={[
              { required: true, message: '请输入补发数量' },
              {
                validator: (_, value) => {
                  if (value > (selectedRecord?.failCount || 0)) {
                    return Promise.reject('补发数量不能超过失败数量');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              type="number"
              min={1}
              max={selectedRecord?.failCount}
              placeholder="请输入补发数量"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SendRecords;