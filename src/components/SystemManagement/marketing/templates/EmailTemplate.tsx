import React, { useState } from 'react';
import { Card, Table, Button, Modal, Input, Form, Select, Switch, message, Tooltip } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { providers, labelStyle, getEnabledProvidersByType, nowStr, buildCommonColumns } from './shared';
import RichTextEditor from './RichTextEditor';

interface EmailTemplate {
  id: string; name: string; providerId: string; providerName: string;
  emailSubject: string; emailContent: string;
  status: 'active' | 'inactive'; createTime: string; description?: string;
}

const defaultData: EmailTemplate[] = [
  { id: 'E001', name: '还款提醒邮件', providerId: 'SP004', providerName: 'SendGrid Email',
    emailSubject: '【还款提醒】{{customerName}}，您的{{productName}}即将到期',
    emailContent: '<p>尊敬的<strong>{{customerName}}</strong>：</p><p>您的 <em>{{productName}}</em> 应还金额为 <span style="color:#ef4444;font-size:18px"><strong>{{amount}}元</strong></span>，到期日为 {{dueDate}}。</p><p>请及时登录APP完成还款，逾期将影响您的信用记录。</p>',
    status: 'active', createTime: '2024-04-05 16:45:00', description: '还款日前3天邮件提醒' },
  { id: 'E002', name: '逾期催收邮件', providerId: 'SP005', providerName: 'Amazon SES',
    emailSubject: '【逾期通知】{{customerName}}，您的贷款已逾期{{overdueDays}}天',
    emailContent: '<p>尊敬的 {{customerName}}：</p><p style="color:#ef4444">您的贷款已逾期 <strong>{{overdueDays}}</strong> 天，应还金额 <strong>{{amount}}元</strong>。</p><p>请尽快处理，以免影响信用记录。</p>',
    status: 'active', createTime: '2024-04-10 10:00:00', description: '逾期阶段邮件催收' },
];

const EmailTemplateMgmt: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>(defaultData);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<EmailTemplate | null>(null);
  const [search, setSearch] = useState('');
  const [form] = Form.useForm();

  const filtered = templates.filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => { setEditing(null); form.resetFields(); form.setFieldsValue({ status: true }); setModalVisible(true); };
  const handleEdit = (r: EmailTemplate) => { setEditing(r); form.setFieldsValue({ ...r, status: r.status === 'active' }); setModalVisible(true); };
  const handleDelete = (id: string) => { setTemplates(p => p.filter(t => t.id !== id)); message.success('已删除'); };
  const handleCopy = (r: EmailTemplate) => { setTemplates(p => [...p, { ...r, id: `E${Date.now().toString().slice(-5)}`, name: `${r.name} - 副本`, status: 'inactive' as const, createTime: nowStr() }]); message.success('已复制'); };
  const handleToggle = (id: string, checked: boolean) => { setTemplates(p => p.map(t => t.id === id ? { ...t, status: checked ? 'active' : 'inactive' } : t)); };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const provider = providers.find(p => p.id === values.providerId);
    if (editing) {
      setTemplates(p => p.map(t => t.id === editing.id ? { ...t, ...values, providerName: provider?.name || '', status: values.status ? 'active' : 'inactive' } : t));
      message.success('已更新');
    } else {
      setTemplates(p => [...p, { id: `E${Date.now().toString().slice(-5)}`, ...values, providerName: provider?.name || '', status: values.status ? 'active' : 'inactive', createTime: nowStr() }]);
      message.success('已创建');
    }
    setModalVisible(false);
  };

  const columns = [
    ...buildCommonColumns<EmailTemplate>('Email', { onEdit: handleEdit, onCopy: handleCopy, onDelete: handleDelete, onToggleStatus: handleToggle }),
    {
      title: '邮件主题', dataIndex: 'emailSubject', key: 'emailSubject', width: 300, ellipsis: true,
      render: (text: string) => <Tooltip title={text}><span style={{ fontSize: '13px', color: '#4b5563' }}>{text}</span></Tooltip>,
    },
  ];

  return (
    <Card variant="borderless" title={<span style={{ color: '#0d4f3c', fontWeight: 600 }}>Email 模板管理</span>}
      extra={<div style={{ display: 'flex', gap: 8 }}>
        <Input placeholder="搜索模板名称" prefix={<SearchOutlined style={{ color: '#9ca3af' }} />} allowClear value={search} onChange={e => setSearch(e.target.value)} style={{ width: 200, borderRadius: 6 }} />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ backgroundColor: '#0d4f3c', borderColor: '#0d4f3c', borderRadius: 6 }}>创建模板</Button>
      </div>}>
      <Table dataSource={filtered} columns={columns} rowKey="id" pagination={{ pageSize: 10, showTotal: (t) => <span style={{ fontSize: '13px', color: '#6b7280' }}>共 {t} 条</span> }} size="middle" />

      <Modal title={<span style={{ color: '#0d4f3c' }}>{editing ? '编辑' : '创建'} Email 模板</span>}
        open={modalVisible} onOk={handleSubmit} onCancel={() => setModalVisible(false)} width={750} okText="保存" cancelText="取消"
        okButtonProps={{ style: { backgroundColor: '#0d4f3c', borderColor: '#0d4f3c' } }} destroyOnHidden>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label={<span style={labelStyle}>模板名称</span>} rules={[{ required: true, message: '请输入' }]}>
            <Input placeholder="例如：还款提醒邮件" style={{ borderRadius: 6 }} />
          </Form.Item>
          <Form.Item name="providerId" label={<span style={labelStyle}>绑定服务商</span>} rules={[{ required: true, message: '请选择' }]}>
            <Select placeholder="选择服务商" style={{ borderRadius: 6 }} options={getEnabledProvidersByType('Email').map(p => ({ value: p.id, label: `${p.name} (${p.id})` }))} />
          </Form.Item>
          <Form.Item name="emailSubject" label={<span style={labelStyle}>邮件标题</span>} rules={[{ required: true, message: '请输入邮件标题' }]}>
            <Input placeholder="例如：【还款提醒】{{customerName}}，您的贷款即将到期" style={{ borderRadius: 6 }} />
          </Form.Item>
          <Form.Item name="emailContent" label={<span style={labelStyle}>邮件内容</span>} rules={[{ required: true, message: '请输入邮件内容' }]}
            extra={<span style={{ fontSize: '12px', color: '#9ca3af' }}>支持富文本编辑：字体、字号、颜色、对齐等</span>}>
            <RichTextEditor placeholder="请输入邮件内容，可使用 {{customerName}} 等变量" height={280} />
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

export default EmailTemplateMgmt;
