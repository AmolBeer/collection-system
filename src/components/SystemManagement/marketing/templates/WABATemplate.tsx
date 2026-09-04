import React, { useState } from 'react';
import { Card, Table, Button, Modal, Input, Form, Select, Switch, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { providers, labelStyle, getEnabledProvidersByType, nowStr, buildCommonColumns } from './shared';

interface WABATemplate {
  id: string; name: string; providerId: string; providerName: string;
  templateName: string; status: 'active' | 'inactive'; createTime: string; description?: string;
}

const defaultData: WABATemplate[] = [
  { id: 'W001', name: 'WABA还款提醒', providerId: 'SP003', providerName: 'WhatsApp Business API',
    templateName: 'repayment_reminder_v1', status: 'active', createTime: '2024-04-03 09:15:00', description: '已在WhatsApp后台注册的还款提醒模板' },
  { id: 'W002', name: 'WABA逾期通知', providerId: 'SP003', providerName: 'WhatsApp Business API',
    templateName: 'overdue_notice_v2', status: 'inactive', createTime: '2024-04-04 14:20:00', description: '已暂停使用，等待审核' },
  { id: 'W003', name: 'WABA还款确认', providerId: 'SP003', providerName: 'WhatsApp Business API',
    templateName: 'payment_confirmation_v1', status: 'active', createTime: '2024-04-18 11:00:00', description: '还款确认通知模板' },
];

const WABATemplateMgmt: React.FC = () => {
  const [templates, setTemplates] = useState<WABATemplate[]>(defaultData);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<WABATemplate | null>(null);
  const [search, setSearch] = useState('');
  const [form] = Form.useForm();

  const filtered = templates.filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => { setEditing(null); form.resetFields(); form.setFieldsValue({ status: true }); setModalVisible(true); };
  const handleEdit = (r: WABATemplate) => { setEditing(r); form.setFieldsValue({ ...r, status: r.status === 'active' }); setModalVisible(true); };
  const handleDelete = (id: string) => { setTemplates(p => p.filter(t => t.id !== id)); message.success('已删除'); };
  const handleCopy = (r: WABATemplate) => { setTemplates(p => [...p, { ...r, id: `W${Date.now().toString().slice(-5)}`, name: `${r.name} - 副本`, status: 'inactive' as const, createTime: nowStr() }]); message.success('已复制'); };
  const handleToggle = (id: string, checked: boolean) => { setTemplates(p => p.map(t => t.id === id ? { ...t, status: checked ? 'active' : 'inactive' } : t)); };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const provider = providers.find(p => p.id === values.providerId);
    if (editing) {
      setTemplates(p => p.map(t => t.id === editing.id ? { ...t, ...values, providerName: provider?.name || '', status: values.status ? 'active' : 'inactive' } : t));
      message.success('已更新');
    } else {
      setTemplates(p => [...p, { id: `W${Date.now().toString().slice(-5)}`, ...values, providerName: provider?.name || '', status: values.status ? 'active' : 'inactive', createTime: nowStr() }]);
      message.success('已创建');
    }
    setModalVisible(false);
  };

  const columns = [
    ...buildCommonColumns<WABATemplate>('WABA', { onEdit: handleEdit, onCopy: handleCopy, onDelete: handleDelete, onToggleStatus: handleToggle }),
    {
      title: '模板名称', dataIndex: 'templateName', key: 'templateName', width: 250,
      render: (text: string) => <span style={{ fontFamily: 'monospace', fontSize: '13px', color: '#16a34a' }}>{text}</span>,
    },
  ];

  return (
    <Card variant="borderless" title={<span style={{ color: '#0d4f3c', fontWeight: 600 }}>WABA 模板管理</span>}
      extra={<div style={{ display: 'flex', gap: 8 }}>
        <Input placeholder="搜索模板名称" prefix={<SearchOutlined style={{ color: '#9ca3af' }} />} allowClear value={search} onChange={e => setSearch(e.target.value)} style={{ width: 200, borderRadius: 6 }} />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ backgroundColor: '#0d4f3c', borderColor: '#0d4f3c', borderRadius: 6 }}>创建模板</Button>
      </div>}>
      <Table dataSource={filtered} columns={columns} rowKey="id" pagination={{ pageSize: 10, showTotal: (t) => <span style={{ fontSize: '13px', color: '#6b7280' }}>共 {t} 条</span> }} size="middle" />

      <Modal title={<span style={{ color: '#0d4f3c' }}>{editing ? '编辑' : '创建'} WABA 模板</span>}
        open={modalVisible} onOk={handleSubmit} onCancel={() => setModalVisible(false)} width={560} okText="保存" cancelText="取消"
        okButtonProps={{ style: { backgroundColor: '#0d4f3c', borderColor: '#0d4f3c' } }} destroyOnHidden>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label={<span style={labelStyle}>模板名称</span>} rules={[{ required: true, message: '请输入' }]}>
            <Input placeholder="例如：WABA还款提醒" style={{ borderRadius: 6 }} />
          </Form.Item>
          <Form.Item name="providerId" label={<span style={labelStyle}>绑定服务商</span>} rules={[{ required: true, message: '请选择' }]}>
            <Select placeholder="选择服务商" style={{ borderRadius: 6 }} options={getEnabledProvidersByType('WABA').map(p => ({ value: p.id, label: `${p.name} (${p.id})` }))} />
          </Form.Item>
          <Form.Item name="templateName" label={<span style={labelStyle}>WABA 模板名称</span>} rules={[{ required: true, message: '请输入模板名称' }]}
            extra={<span style={{ fontSize: '12px', color: '#9ca3af' }}>请填写在 WhatsApp Business 后台已注册的模板名称，模板内容由三方管理</span>}>
            <Input placeholder="例如：repayment_reminder_v1" style={{ borderRadius: 6, fontFamily: 'monospace' }} />
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

export default WABATemplateMgmt;
