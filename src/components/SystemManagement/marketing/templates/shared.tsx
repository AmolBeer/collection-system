import React from 'react';
import { Space, Tooltip, Button, Popconfirm, Switch, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';

export type TemplateType = 'Email' | 'SMS' | 'RCS' | 'IVR' | 'AI' | 'WABA' | 'APP Push';

export interface ProviderOption {
  id: string;
  name: string;
  type: TemplateType;
  enabled: boolean;
}

export const providers: ProviderOption[] = [
  { id: 'SP001', name: 'Twilio SMS Gateway', type: 'SMS', enabled: true },
  { id: 'SP002', name: 'Infobip SMS', type: 'SMS', enabled: true },
  { id: 'SP003', name: 'WhatsApp Business API', type: 'WABA', enabled: true },
  { id: 'SP004', name: 'SendGrid Email', type: 'Email', enabled: true },
  { id: 'SP005', name: 'Amazon SES', type: 'Email', enabled: true },
  { id: 'SP006', name: 'Google RBM', type: 'RCS', enabled: true },
  { id: 'SP007', name: 'Twilio Voice (IVR)', type: 'IVR', enabled: true },
  { id: 'SP008', name: 'OpenAI GPT', type: 'AI', enabled: true },
  { id: 'SP009', name: 'Nexmo SMS', type: 'SMS', enabled: false },
  { id: 'SP010', name: 'Firebase Cloud Messaging', type: 'APP Push', enabled: true },
  { id: 'SP011', name: 'OneSignal Push', type: 'APP Push', enabled: true },
];

export const typeColorMap: Record<string, string> = {
  Email: 'cyan', SMS: 'blue', RCS: 'geekblue', IVR: 'orange', AI: 'purple', WABA: 'green', 'APP Push': 'magenta',
};

export const labelStyle: React.CSSProperties = {
  fontSize: '13px', color: '#374151', fontWeight: 500,
};

export const getEnabledProvidersByType = (type: TemplateType): ProviderOption[] =>
  providers.filter((p) => p.type === type && p.enabled);

export const nowStr = () =>
  new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-');

// 公共表格列：名称、服务商、状态、创建时间、操作
export function buildCommonColumns<T extends { id: string; name: string; providerName: string; providerId: string; status: string; createTime: string }>(
  type: TemplateType,
  handlers: {
    onEdit: (record: T) => void;
    onCopy: (record: T) => void;
    onDelete: (id: string) => void;
    onToggleStatus: (id: string, checked: boolean) => void;
  }
) {
  const color = typeColorMap[type];
  return [
    {
      title: '模板名称', dataIndex: 'name', key: 'name', width: 200,
      render: (text: string, record: T) => (
        <div>
          <div style={{ fontWeight: 500, color: '#1f2937' }}>
            <Tag color={color} style={{ borderRadius: 4, marginRight: 6 }}>{type}</Tag>
            {text}
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>{record.id}</div>
        </div>
      ),
    },
    {
      title: '绑定服务商', dataIndex: 'providerName', key: 'providerName', width: 180,
      render: (text: string) => <span style={{ color: '#1f2937', fontWeight: 500 }}>{text}</span>,
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 100,
      render: (status: string, record: T) => (
        <Switch
          checked={status === 'active'}
          onChange={(checked) => handlers.onToggleStatus(record.id, checked)}
          checkedChildren="启用" unCheckedChildren="停用"
        />
      ),
    },
    {
      title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 170,
      render: (text: string) => <span style={{ color: '#6b7280', fontSize: '13px' }}>{text}</span>,
    },
    {
      title: '操作', key: 'action', width: 140,
      render: (_: unknown, record: T) => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button type="text" size="small" icon={<EditOutlined style={{ color: '#0d4f3c' }} />} onClick={() => handlers.onEdit(record)} />
          </Tooltip>
          <Tooltip title="复制">
            <Button type="text" size="small" icon={<CopyOutlined style={{ color: '#2563eb' }} />} onClick={() => handlers.onCopy(record)} />
          </Tooltip>
          <Popconfirm title="确认删除" description="确认要删除此模板吗？" onConfirm={() => handlers.onDelete(record.id)} okText="确认" cancelText="取消"
            okButtonProps={{ style: { backgroundColor: '#0d4f3c', borderColor: '#0d4f3c' } }}>
            <Tooltip title="删除">
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];
}
