import React, { useState, useMemo } from 'react';
import { Table, Button, Tag, Input, DatePicker, Select, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, RedoOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';

type SendChannel = 'SMS' | 'Email' | 'RCS' | 'IVR' | 'AI' | 'WABA' | 'APP Push';

interface SendRecord {
  id: string;
  sendTime: string;
  sendMethod: '手动' | '定时';
  channel: SendChannel;
  providerName?: string;
  content: string;
  batchNumber: string;
  result: 'Success' | 'Partial' | 'Failed';
  sendCount: number;
  failedCount: number;
  successRate: number;
  status: 'Sent' | 'Failed';
}

const initialRecords: SendRecord[] = [
  { id: '1', sendTime: '2026-05-20 13:23:30', sendMethod: '手动', channel: 'APP Push', providerName: 'Firebase FCM', content: '[哈哈哈] 100001836哈哈红红火火...', batchNumber: 'BATCH5760403178A94C3DBFD13E80465B0051', result: 'Success', sendCount: 1, failedCount: 0, successRate: 100, status: 'Sent' },
  { id: '2', sendTime: '2026-05-20 13:16:01', sendMethod: '手动', channel: 'APP Push', providerName: 'Firebase FCM', content: '[222] 2222', batchNumber: 'BATCH8518E4CB60DB44E2A52D1B0A99F2336', result: 'Success', sendCount: 1, failedCount: 0, successRate: 100, status: 'Sent' },
  { id: '3', sendTime: '2026-05-20 13:11:05', sendMethod: '手动', channel: 'APP Push', providerName: 'Firebase FCM', content: '[111] 111', batchNumber: 'BATCH34DD060B3DCA44DD8083115D0D6FEA56', result: 'Success', sendCount: 1, failedCount: 0, successRate: 100, status: 'Sent' },
  { id: '4', sendTime: '2026-05-20 13:01:29', sendMethod: '手动', channel: 'APP Push', providerName: 'Firebase FCM', content: '[pushpush] content', batchNumber: 'BATCH686B8F0E358844BEF9C92567D9965', result: 'Partial', sendCount: 2, failedCount: 1, successRate: 50, status: 'Sent' },
  { id: '5', sendTime: '2026-05-20 12:43:01', sendMethod: '手动', channel: 'APP Push', providerName: 'OneSignal Push', content: '[ios] ios', batchNumber: 'BATCH654917317884436872C2FC8A9AFF56', result: 'Failed', sendCount: 1, failedCount: 1, successRate: 0, status: 'Failed' },
  { id: '6', sendTime: '2026-05-20 10:19:26', sendMethod: '手动', channel: 'APP Push', providerName: 'OneSignal Push', content: '[立马发Android] 立马发Android', batchNumber: 'BATCHD94A6E29782A492AC4D474FC3DA1C442', result: 'Failed', sendCount: 1, failedCount: 1, successRate: 0, status: 'Failed' },
  { id: '7', sendTime: '2026-05-20 09:59:21', sendMethod: '手动', channel: 'APP Push', providerName: 'Firebase FCM', content: '[推送1] 推送1', batchNumber: 'BATCH9E16EE302D94C7AA85348B7D539FA1', result: 'Failed', sendCount: 1, failedCount: 1, successRate: 0, status: 'Failed' },
  { id: '8', sendTime: '2026-05-20 09:08:43', sendMethod: '手动', channel: 'APP Push', providerName: 'OneSignal Push', content: '[pushpush] content', batchNumber: 'BATCH06770DCF1D8A429BA34F408792F8EA5D', result: 'Partial', sendCount: 2, failedCount: 1, successRate: 50, status: 'Sent' },
  { id: '9', sendTime: '2026-05-19 16:30:00', sendMethod: '定时', channel: 'SMS', providerName: 'Twilio SMS Gateway', content: '【还款提醒】您有一笔逾期款项，请尽快处理', batchNumber: 'BATCH20260519163000001', result: 'Success', sendCount: 3280, failedCount: 45, successRate: 98.6, status: 'Sent' },
  { id: '10', sendTime: '2026-05-19 14:00:00', sendMethod: '定时', channel: 'Email', providerName: 'SendGrid Email', content: '还款提醒邮件 - 主题：逾期还款提醒', batchNumber: 'BATCH20260519140000002', result: 'Success', sendCount: 1240, failedCount: 12, successRate: 99.0, status: 'Sent' },
  { id: '11', sendTime: '2026-05-18 11:20:00', sendMethod: '定时', channel: 'WABA', providerName: 'WhatsApp Business API', content: 'WhatsApp还款提醒消息', batchNumber: 'BATCH20260518112000003', result: 'Partial', sendCount: 856, failedCount: 34, successRate: 96.0, status: 'Sent' },
  { id: '12', sendTime: '2026-05-17 09:30:00', sendMethod: '定时', channel: 'IVR', providerName: 'Twilio Voice', content: 'IVR语音催收话术', batchNumber: 'BATCH20260517093000004', result: 'Failed', sendCount: 432, failedCount: 432, successRate: 0, status: 'Failed' },
  { id: '13', sendTime: '2026-05-21 09:30:00', sendMethod: '定时', channel: 'AI', providerName: 'AI Rudder', content: 'AI智能催收话术 - 工作日外呼（CL01-CL04）', batchNumber: 'BATCH20260521093000005', result: 'Success', sendCount: 2150, failedCount: 23, successRate: 98.9, status: 'Sent' },
  { id: '14', sendTime: '2026-05-21 14:00:00', sendMethod: '定时', channel: 'AI', providerName: 'Dyna', content: 'AI智能催收话术-II - 高风险客户外呼（CL05-CL08）', batchNumber: 'BATCH20260521140000006', result: 'Partial', sendCount: 856, failedCount: 78, successRate: 90.9, status: 'Sent' },
  { id: '15', sendTime: '2026-05-20 10:00:00', sendMethod: '定时', channel: 'AI', providerName: 'AI Rudder', content: 'AI智能催收话术 - 非工作日外呼（CL01-CL03）', batchNumber: 'BATCH20260520100000007', result: 'Success', sendCount: 1240, failedCount: 15, successRate: 98.8, status: 'Sent' },
  { id: '16', sendTime: '2026-05-19 15:30:00', sendMethod: '手动', channel: 'AI', providerName: 'Dyna', content: 'AI智能催收话术-II - 紧急催收外呼（CL06-CL08）', batchNumber: 'BATCH20260519153000008', result: 'Failed', sendCount: 432, failedCount: 432, successRate: 0, status: 'Failed' },
  { id: '17', sendTime: '2026-05-18 16:00:00', sendMethod: '定时', channel: 'AI', providerName: 'AI Rudder', content: 'AI智能催收话术 - 失联客户预警外呼（CL04-CL05）', batchNumber: 'BATCH20260518160000009', result: 'Success', sendCount: 432, failedCount: 8, successRate: 98.1, status: 'Sent' },
];

const resultColorMap: Record<SendRecord['result'], string> = {
  Success: 'success', Partial: 'warning', Failed: 'error',
};

const channelColorMap: Record<SendChannel, string> = {
  SMS: 'blue',
  Email: 'cyan',
  RCS: 'purple',
  IVR: 'orange',
  AI: 'magenta',
  WABA: 'green',
  'APP Push': 'geekblue',
};

const channelOptions: { value: SendChannel; label: string }[] = [
  { value: 'SMS', label: '短信 SMS' },
  { value: 'Email', label: '邮件 Email' },
  { value: 'RCS', label: '富媒体 RCS' },
  { value: 'IVR', label: '语音 IVR' },
  { value: 'AI', label: 'AI智能' },
  { value: 'WABA', label: 'WhatsApp' },
  { value: 'APP Push', label: 'APP Push' },
];

const SendRecords: React.FC = () => {
  const [records, setRecords] = useState<SendRecord[]>(initialRecords);
  const [searchText, setSearchText] = useState('');
  const [methodFilter, setMethodFilter] = useState<SendChannel | ''>('');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const filtered = useMemo(() => {
    return records.filter(r => {
      if (methodFilter && r.channel !== methodFilter) return false;
      if (searchText && !r.batchNumber.toLowerCase().includes(searchText.toLowerCase()) &&
          !r.content.toLowerCase().includes(searchText.toLowerCase())) {
        return false;
      }
      const recordDate = dayjs(r.sendTime);
      if (startDate && recordDate < startDate.startOf('day')) return false;
      if (endDate && recordDate > endDate.endOf('day')) return false;
      return true;
    });
  }, [records, searchText, methodFilter, startDate, endDate]);

  const handleSearch = () => {
    message.info(`搜索完成，找到 ${filtered.length} 条记录`);
  };

  const handleReset = () => {
    setSearchText('');
    setMethodFilter('');
    setStartDate(null);
    setEndDate(null);
  };

  const handleResend = (record: SendRecord) => {
    if (record.failedCount <= 0) {
      message.info('无需补发');
      return;
    }
    const retrySuccess = Math.floor(record.failedCount * (0.8 + Math.random() * 0.15));
    const stillFailed = record.failedCount - retrySuccess;
    setRecords(prev => prev.map(r => r.id === record.id ? {
      ...r,
      failedCount: stillFailed,
      successRate: stillFailed === 0 ? 100 : Math.round(((r.sendCount - stillFailed) / r.sendCount) * 1000) / 10,
      result: stillFailed === 0 ? 'Success' : stillFailed < r.failedCount ? 'Partial' : r.result,
      status: stillFailed === 0 ? 'Sent' : 'Failed',
    } : r));
    message.success(`补发完成：成功 ${retrySuccess} 条，剩余 ${stillFailed} 条`);
  };

  const columns: ColumnsType<SendRecord> = [
    {
      title: '发送时间', dataIndex: 'sendTime', key: 'sendTime', width: 160,
      sorter: (a, b) => a.sendTime.localeCompare(b.sendTime),
      render: (t: string) => <span style={{ color: '#374151', fontSize: '13px' }}>{t}</span>,
    },
    {
      title: '触发方式', dataIndex: 'sendMethod', key: 'sendMethod', width: 100,
      render: (m: string) => (
        <Tag color={m === '定时' ? 'blue' : 'green'} style={{ borderRadius: 4 }}>{m}</Tag>
      ),
    },
    {
      title: '发送方式', dataIndex: 'channel', key: 'channel', width: 110,
      render: (c: SendChannel) => (
        <Tag color={channelColorMap[c]} style={{ borderRadius: 4 }}>{c}</Tag>
      ),
    },
    {
      title: '服务商', dataIndex: 'providerName', key: 'providerName', width: 160, ellipsis: true,
      render: (t?: string) => <span style={{ color: '#374151', fontSize: '13px' }}>{t || '-'}</span>,
    },
    {
      title: '发送内容', dataIndex: 'content', key: 'content', width: 220, ellipsis: true,
      render: (t: string) => <span style={{ color: '#374151', fontSize: '13px' }}>{t}</span>,
    },
    {
      title: '批次号', dataIndex: 'batchNumber', key: 'batchNumber', width: 260, ellipsis: true,
      render: (t: string) => (
        <code style={{ fontSize: '12px', color: '#0d4f3c', backgroundColor: '#f0fdf4', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace' }}>
          {t}
        </code>
      ),
    },
    {
      title: '发送结果', dataIndex: 'result', key: 'result', width: 100,
      render: (r: SendRecord['result']) => (
        <Tag color={resultColorMap[r]} style={{ borderRadius: 4 }}>{r}</Tag>
      ),
    },
    {
      title: '发送数', dataIndex: 'sendCount', key: 'sendCount', width: 90,
      render: (n: number) => <span style={{ color: '#374151', fontSize: '13px' }}>{n.toLocaleString()} 条</span>,
    },
    {
      title: '失败数', dataIndex: 'failedCount', key: 'failedCount', width: 90,
      render: (n: number) => (
        <span style={{ color: n > 0 ? '#ef4444' : '#6b7280', fontSize: '13px', fontWeight: n > 0 ? 500 : 400 }}>
          {n.toLocaleString()} 条
        </span>
      ),
    },
    {
      title: '成功率', dataIndex: 'successRate', key: 'successRate', width: 90,
      render: (r: number) => (
        <span style={{ color: r >= 95 ? '#22c55e' : r >= 80 ? '#f59e0b' : '#ef4444', fontWeight: 500 }}>
          {r}%
        </span>
      ),
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 80,
      render: (s: string) => (
        <Tag color={s === 'Sent' ? 'success' : 'error'} style={{ borderRadius: 4 }}>{s}</Tag>
      ),
    },
    {
      title: '操作', key: 'actions', width: 120, fixed: 'right',
      render: (_, record) => {
        if (record.failedCount === 0) {
          return <span style={{ color: '#9ca3af', fontSize: '12px' }}>无需补发</span>;
        }
        return (
          <Button type="link" size="small" icon={<RedoOutlined style={{ color: '#f59e0b' }} />}
            onClick={() => handleResend(record)} style={{ color: '#f59e0b', fontWeight: 500 }}>
            补发
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>发送记录</h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#6b7280' }}>查看历史发送记录，对失败的消息进行补发</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <Select<SendChannel | ''>
          placeholder="发送方式"
          value={methodFilter || undefined}
          onChange={(v) => setMethodFilter(v || '')}
          allowClear
          style={{ width: 160, borderRadius: 6 }}
          options={channelOptions}
        />
        <Input placeholder="搜索批次号或内容" value={searchText} onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 260, borderRadius: 6 }}
          prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
          onPressEnter={handleSearch}
        />
        <DatePicker.RangePicker showTime value={[startDate, endDate]}
          onChange={(dates) => { setStartDate(dates?.[0] || null); setEndDate(dates?.[1] || null); }}
          placeholder={['开始时间', '结束时间']}
          style={{ borderRadius: 6 }}
        />
        <Button type="primary" onClick={handleSearch}
          style={{ backgroundColor: '#0d4f3c', borderColor: '#0d4f3c', borderRadius: 6 }}>
          搜索
        </Button>
        <Button onClick={handleReset} style={{ borderRadius: 6 }}>重置</Button>
      </div>

      <Table columns={columns} dataSource={filtered} rowKey="id"
        pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50'], showTotal: (t) => `共 ${t} 条` }}
        size="middle"
        scroll={{ x: 1560 }}
      />
    </div>
  );
};

export default SendRecords;
