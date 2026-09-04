import React, { useState } from 'react';
import { Card, Table, Button, Modal, Input, Form, Select, Switch, message, Tooltip, Space } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { providers, labelStyle, getEnabledProvidersByType, nowStr, buildCommonColumns } from './shared';

interface RCSTemplate {
  id: string; name: string; providerId: string; providerName: string;
  content: string; status: 'active' | 'inactive'; createTime: string; description?: string;
}

const defaultData: RCSTemplate[] = [
  { id: 'R001', name: 'RCS还款提醒', providerId: 'SP006', providerName: 'Google RBM',
    content: '您好 {{customerName}}，您的 {{productName}} 应还金额 {{amount}}，到期日 {{dueDate}}。点击下方按钮立即还款。',
    status: 'active', createTime: '2024-04-06 08:30:00', description: 'RCS富文本消息，支持按钮交互' },
  { id: 'R002', name: 'RCS逾期催收', providerId: 'SP006', providerName: 'Google RBM',
    content: '{{customerName}}您好，您的贷款已逾期 {{overdueDays}} 天，欠款 {{amount}} 元。回复1立即还款，回复2转人工客服。',
    status: 'active', createTime: '2024-04-12 10:00:00', description: '逾期RCS催收消息' },
];

const variables = ['{{customerName}}', '{{amount}}', '{{dueDate}}', '{{productName}}', '{{overdueDays}}', '{{phoneNumber}}'];

const RCSTemplateMgmt: React.FC = () => {
  const [templates, setTemplates] = useState<RCSTemplate[]>(defaultData);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<RCSTemplate | null>(null);
  const [search, setSearch] = useState('');
  const [form] = Form.useForm();

  const filtered = templates.filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => { setEditing(null); form.resetFields(); form.setFieldsValue({ status: true }); setModalVisible(true); };
  const handleEdit = (r: RCSTemplate) => { setEditing(r); form.setFieldsValue({ ...r, status: r.status === 'active' }); setModalVisible(true); };
  const handleDelete = (id: string) => { setTemplates(p => p.filter(t => t.id !== id)); message.success('已删除'); };
  const handleCopy = (r: RCSTemplate) => { setTemplates(p => [...p, { ...r, id: `R${Date.now().toString().slice(-5)}`, name: `${r.name} - 副本`, status: 'inactive' as const, createTime: nowStr() }]); message.success('已复制'); };
  const handleToggle = (id: string, checked: boolean) => { setTemplates(p => p.map(t => t.id === id ? { ...t, status: checked ? 'active' : 'inactive' } : t)); };
  const insertVar = (v: string) => { const cur = form.getFieldValue('content') || ''; form.setFieldsValue({ content: cur + v }); };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const provider = providers.find(p => p.id === values.providerId);
    if (editing) {
      setTemplates(p => p.map(t => t.id === editing.id ? { ...t, ...values, providerName: provider?.name || '', status: values.status ? 'active' : 'inactive' } : t));
      message.success('已更新');
    } else {
      setTemplates(p => [...p, { id: `R${Date.now().toString().slice(-5)}`, ...values, providerName: provider?.name || '', status: values.status ? 'active' : 'inactive', createTime: nowStr() }]);
      message.success('已创建');
    }
    setModalVisible(false);
  };

  const columns = [
    ...buildCommonColumns<RCSTemplate>('RCS', { onEdit: handleEdit, onCopy: handleCopy, onDelete: handleDelete, onToggleStatus: handleToggle }),
    {
      title: '发送内容', dataIndex: 'content', key: 'content', ellipsis: true,
      render: (text: string) => <Tooltip title={text}><span style={{ fontSize: '13px', color: '#4b5563' }}>{text.length > 60 ? text.slice(0, 60) + '...' : text}</span></Tooltip>,
    },
  ];

  return (
    <Card variant="borderless" title={<span style={{ color: '#0d4f3c', fontWeight: 600 }}>RCS 模板管理</span>}
      extra={<div style={{ display: 'flex', gap: 8 }}>
        <Input placeholder="搜索模板名称" prefix={<SearchOutlined style={{ color: '#9ca3af' }} />} allowClear value={search} onChange={e => setSearch(e.target.value)} style={{ width: 200, borderRadius: 6 }} />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ backgroundColor: '#0d4f3c', borderColor: '#0d4f3c', borderRadius: 6 }}>创建模板</Button>
      </div>}>
      <Table dataSource={filtered} columns={columns} rowKey="id" pagination={{ pageSize: 10, showTotal: (t) => <span style={{ fontSize: '13px', color: '#6b7280' }}>共 {t} 条</span> }} size="middle" />

      <Modal title={<span style={{ color: '#0d4f3c' }}>{editing ? '编辑' : '创建'} RCS 模板</span>}
        open={modalVisible} onOk={handleSubmit} onCancel={() => setModalVisible(false)} width={600} okText="保存" cancelText="取消"
        okButtonProps={{ style: { backgroundColor: '#0d4f3c', borderColor: '#0d4f3c' } }} destroyOnHidden>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label={<span style={labelStyle}>模板名称</span>} rules={[{ required: true, message: '请输入' }]}>
            <Input placeholder="例如：RCS还款提醒" style={{ borderRadius: 6 }} />
          </Form.Item>
          <Form.Item name="providerId" label={<span style={labelStyle}>绑定服务商</span>} rules={[{ required: true, message: '请选择' }]}>
            <Select placeholder="选择服务商" style={{ borderRadius: 6 }} options={getEnabledProvidersByType('RCS').map(p => ({ value: p.id, label: `${p.name} (${p.id})` }))} />
          </Form.Item>
          <Form.Item name="content" label={<span style={labelStyle}>发送内容</span>} rules={[{ required: true, message: '请输入发送内容' }]}>
            <div style={{ marginBottom: 8 }}>
              <Space wrap size={[4, 4]}>
                {variables.map(v => (
                  <Button key={v} type="text" size="small" onClick={() => insertVar(v)}
                    style={{ padding: '2px 8px', border: '1px solid #0d4f3c', borderRadius: 6, fontSize: '12px', color: '#0d4f3c', height: 'auto' }}>{v}</Button>
                ))}
              </Space>
            </div>
            <Input.TextArea rows={5} placeholder="请输入RCS消息内容" style={{ borderRadius: 6 }} />
          </Form.Item>
          <Form.Item name="description" label={<span style={labelStyle}>描述</span>}>
            <Input.TextArea rows={2} placeholder="模板用途说明..." style={{ borderRadius: 6 }} />
          </Form.Item>
          <Form.Item name="status" label={<span style={labelStyle}>状态</span>} valuePropName="checked">
            <Switch checkedChildren="启用" unCheckedChildren="停用" defaultChecked />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default RCSTemplateMgmt;
