import React, { useState } from 'react';
import { Card, Table, Button, Modal, Input, Form, Select, Switch, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { providers, labelStyle, getEnabledProvidersByType, nowStr, buildCommonColumns } from './shared';

interface AITemplate {
  id: string; name: string; providerId: string; providerName: string;
  strategyId: string; status: 'active' | 'inactive'; createTime: string; description?: string;
}

const defaultData: AITemplate[] = [
  { id: 'A001', name: 'AI智能催收话术', providerId: 'SP008', providerName: 'OpenAI GPT',
    strategyId: 'STRATEGY_COLLECTION_M1_001', status: 'active', createTime: '2024-04-08 09:00:00', description: 'AI驱动的M1阶段催收' },
  { id: 'A002', name: 'AI还款协商话术', providerId: 'SP008', providerName: 'OpenAI GPT',
    strategyId: 'STRATEGY_NEGOTIATION_002', status: 'active', createTime: '2024-04-15 14:00:00', description: '还款方案协商对话策略' },
  { id: 'A003', name: 'AI高风险客户话术', providerId: 'SP008', providerName: 'OpenAI GPT',
    strategyId: 'STRATEGY_HIGH_RISK_003', status: 'inactive', createTime: '2024-04-20 10:00:00', description: '高风险客户专用话术' },
];

const AITemplateMgmt: React.FC = () => {
  const [templates, setTemplates] = useState<AITemplate[]>(defaultData);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<AITemplate | null>(null);
  const [search, setSearch] = useState('');
  const [form] = Form.useForm();

  const filtered = templates.filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => { setEditing(null); form.resetFields(); form.setFieldsValue({ status: true }); setModalVisible(true); };
  const handleEdit = (r: AITemplate) => { setEditing(r); form.setFieldsValue({ ...r, status: r.status === 'active' }); setModalVisible(true); };
  const handleDelete = (id: string) => { setTemplates(p => p.filter(t => t.id !== id)); message.success('已删除'); };
  const handleCopy = (r: AITemplate) => { setTemplates(p => [...p, { ...r, id: `A${Date.now().toString().slice(-5)}`, name: `${r.name} - 副本`, status: 'inactive' as const, createTime: nowStr() }]); message.success('已复制'); };
  const handleToggle = (id: string, checked: boolean) => { setTemplates(p => p.map(t => t.id === id ? { ...t, status: checked ? 'active' : 'inactive' } : t)); };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const provider = providers.find(p => p.id === values.providerId);
    if (editing) {
      setTemplates(p => p.map(t => t.id === editing.id ? { ...t, ...values, providerName: provider?.name || '', status: values.status ? 'active' : 'inactive' } : t));
      message.success('已更新');
    } else {
      setTemplates(p => [...p, { id: `A${Date.now().toString().slice(-5)}`, ...values, providerName: provider?.name || '', status: values.status ? 'active' : 'inactive', createTime: nowStr() }]);
      message.success('已创建');
    }
    setModalVisible(false);
  };

  const columns = [
    ...buildCommonColumns<AITemplate>('AI', { onEdit: handleEdit, onCopy: handleCopy, onDelete: handleDelete, onToggleStatus: handleToggle }),
    {
      title: '策略ID', dataIndex: 'strategyId', key: 'strategyId', width: 280,
      render: (text: string) => <span style={{ fontFamily: 'monospace', fontSize: '13px', color: '#7c3aed' }}>{text}</span>,
    },
  ];

  return (
    <Card variant="borderless" title={<span style={{ color: '#0d4f3c', fontWeight: 600 }}>AI 模板管理</span>}
      extra={<div style={{ display: 'flex', gap: 8 }}>
        <Input placeholder="搜索模板名称" prefix={<SearchOutlined style={{ color: '#9ca3af' }} />} allowClear value={search} onChange={e => setSearch(e.target.value)} style={{ width: 200, borderRadius: 6 }} />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ backgroundColor: '#0d4f3c', borderColor: '#0d4f3c', borderRadius: 6 }}>创建模板</Button>
      </div>}>
      <Table dataSource={filtered} columns={columns} rowKey="id" pagination={{ pageSize: 10, showTotal: (t) => <span style={{ fontSize: '13px', color: '#6b7280' }}>共 {t} 条</span> }} size="middle" />

      <Modal title={<span style={{ color: '#0d4f3c' }}>{editing ? '编辑' : '创建'} AI 模板</span>}
        open={modalVisible} onOk={handleSubmit} onCancel={() => setModalVisible(false)} width={560} okText="保存" cancelText="取消"
        okButtonProps={{ style: { backgroundColor: '#0d4f3c', borderColor: '#0d4f3c' } }} destroyOnHidden>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label={<span style={labelStyle}>模板名称</span>} rules={[{ required: true, message: '请输入' }]}>
            <Input placeholder="例如：AI智能催收话术" style={{ borderRadius: 6 }} />
          </Form.Item>
          <Form.Item name="providerId" label={<span style={labelStyle}>绑定服务商</span>} rules={[{ required: true, message: '请选择' }]}>
            <Select placeholder="选择服务商" style={{ borderRadius: 6 }} options={getEnabledProvidersByType('AI').map(p => ({ value: p.id, label: `${p.name} (${p.id})` }))} />
          </Form.Item>
          <Form.Item name="strategyId" label={<span style={labelStyle}>策略ID</span>} rules={[{ required: true, message: '请输入策略ID' }]}
            extra={<span style={{ fontSize: '12px', color: '#9ca3af' }}>填写在AI平台已配置好的策略ID</span>}>
            <Input placeholder="例如：STRATEGY_COLLECTION_M1_001" style={{ borderRadius: 6, fontFamily: 'monospace' }} />
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

export default AITemplateMgmt;
