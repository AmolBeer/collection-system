import React, { useState } from 'react';
import { Card, Table, Button, Modal, Input, Form, Select, Switch, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { providers, labelStyle, getEnabledProvidersByType, nowStr, buildCommonColumns } from './shared';

interface IVRTemplate {
  id: string; name: string; providerId: string; providerName: string;
  ivrTemplateId: string; status: 'active' | 'inactive'; createTime: string; description?: string;
}

const defaultData: IVRTemplate[] = [
  { id: 'I001', name: 'IVR逾期催收话术', providerId: 'SP007', providerName: 'Twilio Voice (IVR)',
    ivrTemplateId: 'IVR_OVERDUE_REMINDER_001', status: 'active', createTime: '2024-04-07 10:00:00', description: '逾期IVR语音催收' },
  { id: 'I002', name: 'IVR还款确认话术', providerId: 'SP007', providerName: 'Twilio Voice (IVR)',
    ivrTemplateId: 'IVR_PAYMENT_CONFIRM_002', status: 'active', createTime: '2024-04-14 09:00:00', description: '还款后确认话术' },
];

const IVRTemplateMgmt: React.FC = () => {
  const [templates, setTemplates] = useState<IVRTemplate[]>(defaultData);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<IVRTemplate | null>(null);
  const [search, setSearch] = useState('');
  const [form] = Form.useForm();

  const filtered = templates.filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => { setEditing(null); form.resetFields(); form.setFieldsValue({ status: true }); setModalVisible(true); };
  const handleEdit = (r: IVRTemplate) => { setEditing(r); form.setFieldsValue({ ...r, status: r.status === 'active' }); setModalVisible(true); };
  const handleDelete = (id: string) => { setTemplates(p => p.filter(t => t.id !== id)); message.success('已删除'); };
  const handleCopy = (r: IVRTemplate) => { setTemplates(p => [...p, { ...r, id: `I${Date.now().toString().slice(-5)}`, name: `${r.name} - 副本`, status: 'inactive' as const, createTime: nowStr() }]); message.success('已复制'); };
  const handleToggle = (id: string, checked: boolean) => { setTemplates(p => p.map(t => t.id === id ? { ...t, status: checked ? 'active' : 'inactive' } : t)); };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const provider = providers.find(p => p.id === values.providerId);
    if (editing) {
      setTemplates(p => p.map(t => t.id === editing.id ? { ...t, ...values, providerName: provider?.name || '', status: values.status ? 'active' : 'inactive' } : t));
      message.success('已更新');
    } else {
      setTemplates(p => [...p, { id: `I${Date.now().toString().slice(-5)}`, ...values, providerName: provider?.name || '', status: values.status ? 'active' : 'inactive', createTime: nowStr() }]);
      message.success('已创建');
    }
    setModalVisible(false);
  };

  const columns = [
    ...buildCommonColumns<IVRTemplate>('IVR', { onEdit: handleEdit, onCopy: handleCopy, onDelete: handleDelete, onToggleStatus: handleToggle }),
    {
      title: 'IVR模板ID', dataIndex: 'ivrTemplateId', key: 'ivrTemplateId', width: 250,
      render: (text: string) => <span style={{ fontFamily: 'monospace', fontSize: '13px', color: '#0d4f3c' }}>{text}</span>,
    },
  ];

  return (
    <Card variant="borderless" title={<span style={{ color: '#0d4f3c', fontWeight: 600 }}>IVR 模板管理</span>}
      extra={<div style={{ display: 'flex', gap: 8 }}>
        <Input placeholder="搜索模板名称" prefix={<SearchOutlined style={{ color: '#9ca3af' }} />} allowClear value={search} onChange={e => setSearch(e.target.value)} style={{ width: 200, borderRadius: 6 }} />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ backgroundColor: '#0d4f3c', borderColor: '#0d4f3c', borderRadius: 6 }}>创建模板</Button>
      </div>}>
      <Table dataSource={filtered} columns={columns} rowKey="id" pagination={{ pageSize: 10, showTotal: (t) => <span style={{ fontSize: '13px', color: '#6b7280' }}>共 {t} 条</span> }} size="middle" />

      <Modal title={<span style={{ color: '#0d4f3c' }}>{editing ? '编辑' : '创建'} IVR 模板</span>}
        open={modalVisible} onOk={handleSubmit} onCancel={() => setModalVisible(false)} width={560} okText="保存" cancelText="取消"
        okButtonProps={{ style: { backgroundColor: '#0d4f3c', borderColor: '#0d4f3c' } }} destroyOnHidden>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label={<span style={labelStyle}>模板名称</span>} rules={[{ required: true, message: '请输入' }]}>
            <Input placeholder="例如：IVR逾期催收话术" style={{ borderRadius: 6 }} />
          </Form.Item>
          <Form.Item name="providerId" label={<span style={labelStyle}>绑定服务商</span>} rules={[{ required: true, message: '请选择' }]}>
            <Select placeholder="选择服务商" style={{ borderRadius: 6 }} options={getEnabledProvidersByType('IVR').map(p => ({ value: p.id, label: `${p.name} (${p.id})` }))} />
          </Form.Item>
          <Form.Item name="ivrTemplateId" label={<span style={labelStyle}>IVR模板ID</span>} rules={[{ required: true, message: '请输入IVR模板ID' }]}
            extra={<span style={{ fontSize: '12px', color: '#9ca3af' }}>填写在IVR系统中已配置好的模板ID</span>}>
            <Input placeholder="例如：IVR_OVERDUE_REMINDER_001" style={{ borderRadius: 6, fontFamily: 'monospace' }} />
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

export default IVRTemplateMgmt;
