import React, { useState, useMemo } from 'react';
import { Table, Button, Tag, Modal, Form, Input, Select, message, Space, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined, ReloadOutlined, ApiOutlined } from '@ant-design/icons';

type TemplateMethod = 'SMS' | 'Email' | 'RCS' | 'IVR' | 'AI' | 'WABA' | 'APP Push';

interface Template {
  id: string;
  name: string;
  type: TemplateMethod;
  providerId?: string;
  providerName?: string;
  subject?: string;
  content: string;
  pushName?: string;
  title?: string;
  ivrTemplateId?: string;
  strategyId?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface ProviderOption {
  id: string;
  name: string;
  type: TemplateMethod;
  enabled: boolean;
}

const providersByType: Record<TemplateMethod, ProviderOption[]> = {
  SMS: [
    { id: 'SP001', name: 'Twilio SMS Gateway', type: 'SMS', enabled: true },
    { id: 'SP002', name: 'Infobip SMS', type: 'SMS', enabled: true },
  ],
  Email: [
    { id: 'SP004', name: 'SendGrid Email', type: 'Email', enabled: true },
    { id: 'SP005', name: 'Amazon SES', type: 'Email', enabled: true },
  ],
  RCS: [
    { id: 'SP006', name: 'Google RBM', type: 'RCS', enabled: true },
  ],
  IVR: [
    { id: 'SP007', name: 'Twilio Voice', type: 'IVR', enabled: true },
  ],
  AI: [
    { id: 'SP008', name: 'OpenAI GPT', type: 'AI', enabled: true },
  ],
  WABA: [
    { id: 'SP003', name: 'WhatsApp Business API', type: 'WABA', enabled: true },
  ],
  'APP Push': [
    { id: 'SP010', name: 'Firebase FCM', type: 'APP Push', enabled: true },
    { id: 'SP011', name: 'OneSignal Push', type: 'APP Push', enabled: true },
  ],
};

const methodColorMap: Record<string, string> = {
  Email: 'cyan', SMS: 'blue', RCS: 'geekblue', IVR: 'orange',
  AI: 'purple', WABA: 'green', 'APP Push': 'magenta',
};

// 需要选择服务商的类型
const typesRequiringProvider: TemplateMethod[] = ['WABA', 'AI', 'IVR'];

const generateMockTemplates = (method: TemplateMethod): Template[] => {
  const providers = providersByType[method];
  const templates: Template[] = [];
  const baseNames: Record<TemplateMethod, string[]> = {
    SMS: ['还款提醒短信', '逾期催收短信', '提前还款通知'],
    Email: ['还款提醒邮件', '逾期通知邮件'],
    RCS: ['RCS还款提醒', 'RCS逾期通知'],
    IVR: ['IVR逾期催收话术', 'IVR还款提醒话术'],
    AI: ['AI智能催收话术', 'AI温和提醒策略'],
    WABA: ['WABA还款提醒', 'WABA逾期通知'],
    'APP Push': ['APP还款提醒推送', 'APP逾期推送通知', 'APP活动通知推送'],
  };
  const names = baseNames[method];
  names.forEach((name, i) => {
    const provider = providers[i % providers.length];
    templates.push({
      id: `TP${method.replace(/\s/g, '')}${String(i + 1).padStart(3, '0')}`,
      name,
      type: method,
      providerId: typesRequiringProvider.includes(method) ? provider.id : undefined,
      providerName: typesRequiringProvider.includes(method) ? provider.name : undefined,
      subject: method === 'Email' ? `${name} - 主题` : undefined,
      content: method === 'SMS' || method === 'RCS' ? `【催收系统】您有一笔逾期款项，请尽快处理。` :
               method === 'Email' ? `尊敬的客户，您好：\n\n您有一笔逾期款项，请尽快还款。` :
               method === 'APP Push' ? '您有一笔逾期款项需要处理，点击查看详情' : '',
      pushName: method === 'APP Push' ? name : undefined,
      title: method === 'APP Push' ? '还款提醒' : undefined,
      ivrTemplateId: method === 'IVR' ? `IVR_${String(i + 1).padStart(4, '0')}` : undefined,
      strategyId: method === 'AI' ? `AI_STRATEGY_${String(i + 1).padStart(3, '0')}` : undefined,
      status: 'active',
      createdAt: '2026-08-20 10:00:00',
      updatedAt: '2026-08-20 10:00:00',
    });
  });
  return templates;
};

interface TemplateListProps {
  method: TemplateMethod;
}

const TemplateList: React.FC<TemplateListProps> = ({ method }) => {
  const [templates, setTemplates] = useState<Template[]>(() => generateMockTemplates(method));
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [form] = Form.useForm();

  // 查询条件
  const [searchName, setSearchName] = useState('');
  const [searchStatus, setSearchStatus] = useState<string | undefined>();

  const needsProvider = typesRequiringProvider.includes(method);
  const providers = providersByType[method] || [];

  const filtered = useMemo(() => {
    return templates.filter(t => {
      if (searchName && !t.name.toLowerCase().includes(searchName.toLowerCase()) && !t.id.toLowerCase().includes(searchName.toLowerCase())) return false;
      if (searchStatus && t.status !== searchStatus) return false;
      return true;
    });
  }, [templates, searchName, searchStatus]);

  const handleReset = () => {
    setSearchName('');
    setSearchStatus(undefined);
  };

  const handleAdd = () => {
    setEditingTemplate(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    form.setFieldsValue({
      name: template.name,
      providerId: template.providerId,
      subject: template.subject,
      content: template.content,
      pushName: template.pushName,
      title: template.title,
      ivrTemplateId: template.ivrTemplateId,
      strategyId: template.strategyId,
    });
    setModalVisible(true);
  };

  const handleDelete = (template: Template) => {
    setTemplates(prev => prev.filter(t => t.id !== template.id));
    message.success(`模板「${template.name}」已删除`);
  };

  const handleViewDetail = (template: Template) => {
    setCurrentTemplate(template);
    setDetailVisible(true);
  };

  const handleToggleStatus = (template: Template) => {
    const newStatus = template.status === 'active' ? 'inactive' : 'active';
    setTemplates(prev => prev.map(t => t.id === template.id ? { ...t, status: newStatus } : t));
    message.success(`模板「${template.name}」已${newStatus === 'active' ? '启用' : '停用'}`);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const provider = providers.find(p => p.id === values.providerId);

      if (editingTemplate) {
        setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? {
          ...t,
          ...values,
          providerId: provider?.id,
          providerName: provider?.name,
          updatedAt: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
        } : t));
        message.success(`模板「${values.name}」已更新`);
      } else {
        const newTemplate: Template = {
          id: `TP${method.replace(/\s/g, '')}${String(Date.now()).slice(-6)}`,
          type: method,
          ...values,
          providerId: provider?.id,
          providerName: provider?.name,
          status: 'active',
          createdAt: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
          updatedAt: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
        };
        setTemplates(prev => [newTemplate, ...prev]);
        message.success(`模板「${values.name}」已创建`);
      }
      form.resetFields();
      setModalVisible(false);
      setEditingTemplate(null);
    } catch { /* validation */ }
  };

  const columns: ColumnsType<Template> = [
    {
      title: '模板名称', dataIndex: 'name', key: 'name', width: 200,
      render: (text: string, record) => (
        <div>
          <div style={{ fontWeight: 500, color: '#1f2937' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>{record.id}</div>
        </div>
      ),
    },
    ...(needsProvider ? [{
      title: '服务商', key: 'provider', width: 180,
      render: (_: unknown, record: Template) => (
        record.providerName ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ApiOutlined style={{ color: '#0d4f3c', fontSize: 12 }} />
            <span style={{ fontSize: '13px', color: '#374151' }}>{record.providerName}</span>
          </div>
        ) : <span style={{ color: '#9ca3af' }}>-</span>
      ),
    }] : []),
    {
      title: method === 'IVR' ? 'IVR模板ID' : method === 'AI' ? '策略ID' : method === 'APP Push' ? 'Push Name' : '内容预览',
      key: 'preview', width: 220, ellipsis: true,
      render: (_: unknown, record: Template) => {
        if (method === 'IVR') return <code style={{ fontSize: '12px', color: '#0d4f3c', backgroundColor: '#f0fdf4', padding: '2px 6px', borderRadius: 4 }}>{record.ivrTemplateId}</code>;
        if (method === 'AI') return <code style={{ fontSize: '12px', color: '#0d4f3c', backgroundColor: '#f0fdf4', padding: '2px 6px', borderRadius: 4 }}>{record.strategyId}</code>;
        if (method === 'APP Push') return <span style={{ fontSize: '13px', color: '#374151' }}>{record.pushName}</span>;
        if (method === 'Email') return <span style={{ fontSize: '13px', color: '#374151' }}>{record.subject}</span>;
        return <span style={{ fontSize: '13px', color: '#374151' }}>{record.content}</span>;
      },
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 90,
      render: (s: string) => (
        <Tag color={s === 'active' ? 'success' : 'default'} style={{ borderRadius: 4 }}>
          {s === 'active' ? '已启用' : '已停用'}
        </Tag>
      ),
    },
    {
      title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt', width: 160,
      sorter: (a, b) => a.updatedAt.localeCompare(b.updatedAt),
      render: (t: string) => <span style={{ color: '#6b7280', fontSize: '13px' }}>{t}</span>,
    },
    {
      title: '操作', key: 'actions', width: 200, fixed: 'right',
      render: (_: unknown, record: Template) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}
            style={{ color: '#0d4f3c' }}>详情</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}
            style={{ color: '#0d4f3c' }}>编辑</Button>
          <Button type="link" size="small" onClick={() => handleToggleStatus(record)}
            style={{ color: record.status === 'active' ? '#f59e0b' : '#22c55e' }}>
            {record.status === 'active' ? '停用' : '启用'}
          </Button>
          <Popconfirm title="确认删除此模板？" onConfirm={() => handleDelete(record)} okText="确认" cancelText="取消">
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 渲染表单字段（根据类型差异化）
  const renderFormFields = () => {
    const fields: React.ReactNode[] = [];

    // 模板名称（所有类型都有）
    fields.push(
      <Form.Item key="name" name="name" label="模板名称"
        rules={[{ required: true, message: '请输入模板名称' }]}>
        <Input placeholder="请输入模板名称" style={{ borderRadius: 6 }} />
      </Form.Item>
    );

    // 服务商选择（WABA / AI / IVR 需要选择）
    if (needsProvider) {
      fields.push(
        <Form.Item key="providerId" name="providerId" label="服务商"
          rules={[{ required: true, message: '请选择服务商' }]}
          extra={<span style={{ fontSize: '12px', color: '#9ca3af' }}>{method}模板必须绑定服务商</span>}>
          <Select placeholder="请选择服务商" style={{ borderRadius: 6 }}
            options={providers.filter(p => p.enabled).map(p => ({ value: p.id, label: p.name }))}
          />
        </Form.Item>
      );
    }

    // 类型特有字段
    switch (method) {
      case 'SMS':
        fields.push(
          <Form.Item key="content" name="content" label="短信内容"
            rules={[{ required: true, message: '请输入短信内容' }]}>
            <Input.TextArea rows={4} maxLength={500} showCount
              placeholder="请输入短信内容（支持变量：{name}、{amount}、{date}）"
              style={{ borderRadius: 6 }} />
          </Form.Item>
        );
        break;
      case 'Email':
        fields.push(
          <Form.Item key="subject" name="subject" label="邮件标题"
            rules={[{ required: true, message: '请输入邮件标题' }]}>
            <Input placeholder="请输入邮件标题" style={{ borderRadius: 6 }} />
          </Form.Item>
        );
        fields.push(
          <Form.Item key="emailContent" name="content" label="邮件内容"
            rules={[{ required: true, message: '请输入邮件内容' }]}>
            <Input.TextArea rows={6} showCount
              placeholder="请输入邮件内容（支持变量：{name}、{amount}、{date}）"
              style={{ borderRadius: 6 }} />
          </Form.Item>
        );
        break;
      case 'RCS':
        fields.push(
          <Form.Item key="content" name="content" label="发送内容"
            rules={[{ required: true, message: '请输入发送内容' }]}>
            <Input.TextArea rows={4} maxLength={1000} showCount
              placeholder="请输入RCS富媒体内容（支持变量：{name}、{amount}）"
              style={{ borderRadius: 6 }} />
          </Form.Item>
        );
        break;
      case 'IVR':
        fields.push(
          <Form.Item key="ivrTemplateId" name="ivrTemplateId" label="IVR模板ID"
            rules={[{ required: true, message: '请输入IVR模板ID' }]}
            extra={<span style={{ fontSize: '12px', color: '#9ca3af' }}>IVR模板在三方服务商后台配置后获取</span>}>
            <Input placeholder="如：IVR_0001" style={{ borderRadius: 6 }} />
          </Form.Item>
        );
        break;
      case 'AI':
        fields.push(
          <Form.Item key="strategyId" name="strategyId" label="策略ID"
            rules={[{ required: true, message: '请输入策略ID' }]}
            extra={<span style={{ fontSize: '12px', color: '#9ca3af' }}>AI策略在服务商后台配置后获取</span>}>
            <Input placeholder="如：AI_STRATEGY_001" style={{ borderRadius: 6 }} />
          </Form.Item>
        );
        break;
      case 'WABA':
        fields.push(
          <Form.Item key="wabaName" name="content" label="WhatsApp模板名称"
            rules={[{ required: true, message: '请输入WhatsApp模板名称' }]}
            extra={<span style={{ fontSize: '12px', color: '#9ca3af' }}>已在WhatsApp后台注册的模板名称</span>}>
            <Input placeholder="如：payment_reminder_zh" style={{ borderRadius: 6 }} />
          </Form.Item>
        );
        break;
      case 'APP Push':
        fields.push(
          <Form.Item key="pushName" name="pushName" label="Push Name"
            rules={[{ required: true, message: '请输入Push Name' }]}>
            <Input placeholder="请输入Push Name" style={{ borderRadius: 6 }} />
          </Form.Item>
        );
        fields.push(
          <Form.Item key="title" name="title" label="标题"
            rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="请输入推送标题" style={{ borderRadius: 6 }} />
          </Form.Item>
        );
        fields.push(
          <Form.Item key="content" name="content" label="推送内容"
            rules={[{ required: true, message: '请输入推送内容' }]}>
            <Input.TextArea rows={3} maxLength={200} showCount
              placeholder="请输入推送内容（支持变量：{name}、{amount}）"
              style={{ borderRadius: 6 }} />
          </Form.Item>
        );
        break;
    }

    return fields;
  };

  return (
    <div>
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>{method} 模板管理</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#6b7280' }}>
            管理 {method} 类型的模板，支持增删改查{needsProvider ? '（创建/编辑需选择服务商）' : ''}
          </p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}
          style={{ backgroundColor: '#0d4f3c', borderColor: '#0d4f3c', borderRadius: 6 }}>
          新建模板
        </Button>
      </div>

      {/* 统计卡片 */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, padding: '12px 16px', backgroundColor: '#ecfdf5', borderRadius: 8, border: '1px solid #a7f3d0' }}>
          <div style={{ fontSize: '12px', color: '#065f46' }}>已启用</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#047857', marginTop: 2 }}>
            {templates.filter(t => t.status === 'active').length}
          </div>
        </div>
        <div style={{ flex: 1, padding: '12px 16px', backgroundColor: '#f3f4f6', borderRadius: 8, border: '1px solid #d1d5db' }}>
          <div style={{ fontSize: '12px', color: '#374151' }}>已停用</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#6b7280', marginTop: 2 }}>
            {templates.filter(t => t.status === 'inactive').length}
          </div>
        </div>
        <div style={{ flex: 1, padding: '12px 16px', backgroundColor: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe' }}>
          <div style={{ fontSize: '12px', color: '#1e40af' }}>模板总数</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#2563eb', marginTop: 2 }}>
            {templates.length}
          </div>
        </div>
      </div>

      {/* 查询栏 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <Input placeholder="模板名称/ID" value={searchName} onChange={(e) => setSearchName(e.target.value)}
          style={{ width: 220, borderRadius: 6 }} prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
          allowClear
        />
        <Select placeholder="状态" value={searchStatus} onChange={setSearchStatus}
          style={{ width: 120, borderRadius: 6 }} allowClear
          options={[{ value: 'active', label: '已启用' }, { value: 'inactive', label: '已停用' }]}
        />
        <Button type="primary" icon={<SearchOutlined />}
          style={{ backgroundColor: '#0d4f3c', borderColor: '#0d4f3c', borderRadius: 6 }}>
          查询
        </Button>
        <Button icon={<ReloadOutlined />} onClick={handleReset} style={{ borderRadius: 6 }}>重置</Button>
      </div>

      <Table columns={columns} dataSource={filtered} rowKey="id"
        pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50'], showTotal: (t) => `共 ${t} 条` }}
        size="middle"
        scroll={{ x: 1100 }}
      />

      {/* 新建/编辑模板弹窗 */}
      <Modal
        title={editingTemplate ? `编辑 ${method} 模板` : `新建 ${method} 模板`}
        open={modalVisible} width={560}
        onOk={handleSubmit}
        onCancel={() => { form.resetFields(); setEditingTemplate(null); setModalVisible(false); }}
        okText={editingTemplate ? '保存' : '创建'}
        cancelText="取消"
      >
        <Form form={form} layout="vertical" style={{ padding: '8px 0' }}>
          {renderFormFields()}
        </Form>
      </Modal>

      {/* 模板详情弹窗 */}
      <Modal title="模板详情" open={detailVisible} onCancel={() => setDetailVisible(false)}
        footer={[<Button key="close" onClick={() => setDetailVisible(false)}>关闭</Button>]}
        width={520}>
        {currentTemplate && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: 4 }}>模板名称</div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#1f2937' }}>
                {currentTemplate.name}
                <Tag color={currentTemplate.status === 'active' ? 'success' : 'default'} style={{ marginLeft: 8, borderRadius: 4 }}>
                  {currentTemplate.status === 'active' ? '已启用' : '已停用'}
                </Tag>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: 4 }}>模板ID</div>
                <div style={{ color: '#374151' }}>{currentTemplate.id}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: 4 }}>类型</div>
                <Tag color={methodColorMap[currentTemplate.type]} style={{ borderRadius: 4 }}>{currentTemplate.type}</Tag>
              </div>
              {currentTemplate.providerName && (
                <div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: 4 }}>服务商</div>
                  <div style={{ color: '#374151' }}>{currentTemplate.providerName}</div>
                </div>
              )}
              {currentTemplate.subject && (
                <div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: 4 }}>邮件标题</div>
                  <div style={{ color: '#374151' }}>{currentTemplate.subject}</div>
                </div>
              )}
              {currentTemplate.pushName && (
                <div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: 4 }}>Push Name</div>
                  <div style={{ color: '#374151' }}>{currentTemplate.pushName}</div>
                </div>
              )}
              {currentTemplate.title && (
                <div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: 4 }}>标题</div>
                  <div style={{ color: '#374151' }}>{currentTemplate.title}</div>
                </div>
              )}
              {currentTemplate.ivrTemplateId && (
                <div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: 4 }}>IVR模板ID</div>
                  <code style={{ fontSize: '12px', color: '#0d4f3c' }}>{currentTemplate.ivrTemplateId}</code>
                </div>
              )}
              {currentTemplate.strategyId && (
                <div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: 4 }}>策略ID</div>
                  <code style={{ fontSize: '12px', color: '#0d4f3c' }}>{currentTemplate.strategyId}</code>
                </div>
              )}
              <div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: 4 }}>创建时间</div>
                <div style={{ color: '#374151' }}>{currentTemplate.createdAt}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: 4 }}>更新时间</div>
                <div style={{ color: '#374151' }}>{currentTemplate.updatedAt}</div>
              </div>
            </div>
            {currentTemplate.content && (
              <div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: 4 }}>
                  {currentTemplate.type === 'WABA' ? 'WhatsApp模板名称' : '内容'}
                </div>
                <div style={{ color: '#374151', backgroundColor: '#f9fafb', padding: 12, borderRadius: 6, whiteSpace: 'pre-wrap' }}>
                  {currentTemplate.content}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TemplateList;
