import React, { useState } from 'react';
import { Table, Tag, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ApiOutlined, SearchOutlined } from '@ant-design/icons';

interface Provider {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive';
  templates: string[];
}

const initialProviders: Provider[] = [
  { id: 'SP001', name: 'Twilio SMS Gateway', type: 'SMS', status: 'active', templates: ['还款提醒短信'] },
  { id: 'SP002', name: 'Infobip SMS', type: 'SMS', status: 'active', templates: ['逾期催收短信'] },
  { id: 'SP003', name: 'WhatsApp Business API', type: 'WABA', status: 'active', templates: ['WABA还款提醒', 'WABA逾期通知'] },
  { id: 'SP004', name: 'SendGrid Email', type: 'Email', status: 'active', templates: ['还款提醒邮件'] },
  { id: 'SP005', name: 'Amazon SES', type: 'Email', status: 'inactive', templates: ['逾期通知邮件'] },
  { id: 'SP006', name: 'Google RBM', type: 'RCS', status: 'active', templates: ['RCS还款提醒'] },
  { id: 'SP007', name: 'Twilio Voice', type: 'IVR', status: 'active', templates: ['IVR逾期催收话术'] },
  { id: 'SP008', name: 'AI Rudder', type: 'AI', status: 'active', templates: ['AI智能催收话术'] },
  { id: 'SP009', name: 'Dyna', type: 'AI', status: 'active', templates: ['AI智能催收话术-II'] },
  { id: 'SP010', name: 'Firebase FCM', type: 'APP Push', status: 'active', templates: ['APP还款提醒推送'] },
  { id: 'SP011', name: 'OneSignal Push', type: 'APP Push', status: 'active', templates: ['APP逾期推送通知'] },
];

const typeColorMap: Record<string, string> = {
  SMS: 'blue', Email: 'cyan', RCS: 'geekblue', IVR: 'orange',
  AI: 'purple', WABA: 'green', 'APP Push': 'magenta',
};

const ServiceProviderManagement: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = initialProviders.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.type.toLowerCase().includes(search.toLowerCase())
  );

  const columns: ColumnsType<Provider> = [
    {
      title: '服务商名称', dataIndex: 'name', key: 'name', width: 220,
      render: (text: string, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ApiOutlined style={{ color: '#0d4f3c' }} />
          <div>
            <div style={{ fontWeight: 500, color: '#1f2937' }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>{record.id}</div>
          </div>
        </div>
      ),
    },
    {
      title: '类型', dataIndex: 'type', key: 'type', width: 100,
      render: (t: string) => <Tag color={typeColorMap[t]} style={{ borderRadius: 4 }}>{t}</Tag>,
    },
    {
      title: '绑定模板', dataIndex: 'templates', key: 'templates', width: 240,
      render: (templates: string[]) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {templates.map(t => <Tag key={t} style={{ borderRadius: 4 }}>{t}</Tag>)}
        </div>
      ),
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 100,
      render: (s: string) => (
        <Tag color={s === 'active' ? 'success' : 'default'} style={{ borderRadius: 4 }}>
          {s === 'active' ? '已开启' : '已关闭'}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>服务商管理</h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#6b7280' }}>
          查看各渠道服务商列表及启用状态。新增或调整服务商请联系技术支持。
        </p>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        <div style={{ flex: 1, padding: '16px 20px', backgroundColor: '#ecfdf5', borderRadius: 8, border: '1px solid #a7f3d0' }}>
          <div style={{ fontSize: '13px', color: '#065f46' }}>已开启服务商</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#047857', marginTop: 4 }}>
            {initialProviders.filter(p => p.status === 'active').length} <span style={{ fontSize: '14px', fontWeight: 500 }}>/ {initialProviders.length}</span>
          </div>
        </div>
        <div style={{ flex: 1, padding: '16px 20px', backgroundColor: '#f3f4f6', borderRadius: 8, border: '1px solid #d1d5db' }}>
          <div style={{ fontSize: '13px', color: '#374151' }}>已关闭服务商</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#6b7280', marginTop: 4 }}>
            {initialProviders.filter(p => p.status === 'inactive').length}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Input placeholder="搜索服务商名称/ID/类型" value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ width: 280, borderRadius: 6 }}
          prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
          allowClear
        />
      </div>

      <Table columns={columns} dataSource={filtered} rowKey="id"
        pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50'], showTotal: (t) => `共 ${t} 条` }}
        size="middle"
      />
    </div>
  );
};

export default ServiceProviderManagement;
