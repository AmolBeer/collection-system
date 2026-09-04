import React, { useState } from 'react';
import { Card, Table, Button, Modal, Input, Form, Select, Switch, Tag, message, Tooltip, Space, Radio, Row, Col } from 'antd';
import { PlusOutlined, SearchOutlined, LinkOutlined, RocketOutlined, GlobalOutlined, StopOutlined } from '@ant-design/icons';
import { providers, labelStyle, getEnabledProvidersByType, nowStr, buildCommonColumns } from './shared';

type JumpType = 'none' | 'deep_link' | 'app_page' | 'external_url';

const jumpTypeConfig: Record<JumpType, { label: string; icon: React.ReactNode; desc: string }> = {
  none:         { label: '不跳转',      icon: <StopOutlined />,    desc: '点击推送仅关闭通知，不做跳转' },
  app_page:     { label: 'APP内页面',  icon: <RocketOutlined />,  desc: '跳转APP原生页面路由，如 pages/repayment/detail' },
  deep_link:    { label: 'Deep Link',  icon: <LinkOutlined />,    desc: '使用深链接跳转，如 myapp://repayment?caseId={{caseId}}' },
  external_url: { label: '外部链接',   icon: <GlobalOutlined />,  desc: '使用浏览器打开外部URL，如 https://example.com/...' },
};

interface AppPushTemplate {
  id: string; name: string; providerId: string; providerName: string;
  pushName: string; pushTitle: string; content: string;
  jumpType: JumpType;
  jumpTarget?: string;
  status: 'active' | 'inactive'; createTime: string; description?: string;
}

const defaultData: AppPushTemplate[] = [
  { id: 'P001', name: 'APP还款提醒推送', providerId: 'SP010', providerName: 'Firebase Cloud Messaging',
    pushName: 'repayment_reminder', pushTitle: '还款提醒',
    content: '您有一笔 {{productName}} 还款即将到期，金额 {{amount}}，到期日 {{dueDate}}，请及时处理。',
    jumpType: 'deep_link', jumpTarget: 'myapp://repayment?caseId={{caseId}}&source=push',
    status: 'active', createTime: '2024-04-05 16:45:00', description: '推送到APP内的还款提醒，点击跳转到还款页' },
  { id: 'P002', name: 'APP逾期推送通知', providerId: 'SP010', providerName: 'Firebase Cloud Messaging',
    pushName: 'overdue_alert', pushTitle: '逾期提醒',
    content: '您的贷款已逾期 {{overdueDays}} 天，请尽快联系客服处理。',
    jumpType: 'app_page', jumpTarget: 'pages/case/detail?caseId={{caseId}}',
    status: 'active', createTime: '2024-04-06 08:30:00', description: '逾期超过3天的APP推送' },
  { id: 'P003', name: 'APP系统公告推送', providerId: 'SP011', providerName: 'OneSignal Push',
    pushName: 'system_notice', pushTitle: '系统公告',
    content: '{{customerName}}您好，系统已为您开通新功能，点击查看详情。',
    jumpType: 'external_url', jumpTarget: 'https://www.xxx.com/announcement?id={{noticeId}}',
    status: 'active', createTime: '2024-04-15 10:00:00', description: '公告类推送，点击打开H5公告详情' },
  { id: 'P004', name: 'APP静默消息推送', providerId: 'SP010', providerName: 'Firebase Cloud Messaging',
    pushName: 'silent_notify', pushTitle: '账户安全提醒',
    content: '您的账户存在异常登录，如果不是您本人操作请及时联系客服。',
    jumpType: 'none',
    status: 'inactive', createTime: '2024-04-20 16:00:00', description: '不跳转的静默提示类消息' },
];

const variables = ['{{customerName}}', '{{amount}}', '{{dueDate}}', '{{productName}}', '{{overdueDays}}', '{{phoneNumber}}', '{{caseId}}', '{{noticeId}}'];

const AppPushTemplateMgmt: React.FC = () => {
  const [templates, setTemplates] = useState<AppPushTemplate[]>(defaultData);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<AppPushTemplate | null>(null);
  const [search, setSearch] = useState('');
  const [form] = Form.useForm();
  const jumpType = Form.useWatch('jumpType', form);

  const filtered = templates.filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ status: true, jumpType: 'none' });
    setModalVisible(true);
  };
  const handleEdit = (r: AppPushTemplate) => {
    setEditing(r);
    form.setFieldsValue({ ...r, status: r.status === 'active' });
    setModalVisible(true);
  };
  const handleDelete = (id: string) => { setTemplates(p => p.filter(t => t.id !== id)); message.success('已删除'); };
  const handleCopy = (r: AppPushTemplate) => { setTemplates(p => [...p, { ...r, id: `P${Date.now().toString().slice(-5)}`, name: `${r.name} - 副本`, status: 'inactive' as const, createTime: nowStr() }]); message.success('已复制'); };
  const handleToggle = (id: string, checked: boolean) => { setTemplates(p => p.map(t => t.id === id ? { ...t, status: checked ? 'active' : 'inactive' } : t)); };
  const insertVar = (v: string) => {
    // 插入到当前聚焦字段：优先 jumpTarget，否则 content
    const jumpVal = form.getFieldValue('jumpTarget') || '';
    if (jumpType && jumpType !== 'none') {
      form.setFieldsValue({ jumpTarget: jumpVal + v });
    } else {
      const contentVal = form.getFieldValue('content') || '';
      form.setFieldsValue({ content: contentVal + v });
    }
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const provider = providers.find(p => p.id === values.providerId);
    const jumpTarget = values.jumpType === 'none' ? undefined : values.jumpTarget;
    if (editing) {
      setTemplates(p => p.map(t => t.id === editing.id ? { ...t, ...values, jumpTarget, providerName: provider?.name || '', status: values.status ? 'active' : 'inactive' } : t));
      message.success('已更新');
    } else {
      setTemplates(p => [...p, { id: `P${Date.now().toString().slice(-5)}`, ...values, jumpTarget, providerName: provider?.name || '', status: values.status ? 'active' : 'inactive', createTime: nowStr() }]);
      message.success('已创建');
    }
    setModalVisible(false);
  };

  const columns = [
    ...buildCommonColumns<AppPushTemplate>('APP Push', { onEdit: handleEdit, onCopy: handleCopy, onDelete: handleDelete, onToggleStatus: handleToggle }),
    {
      title: 'Push Name', dataIndex: 'pushName', key: 'pushName', width: 160,
      render: (text: string) => <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#d946ef' }}>{text}</span>,
    },
    {
      title: '标题', dataIndex: 'pushTitle', key: 'pushTitle', width: 110,
      render: (text: string) => <Tag color="magenta" style={{ borderRadius: 4 }}>{text}</Tag>,
    },
    {
      title: '跳转方式', dataIndex: 'jumpType', key: 'jumpType', width: 130,
      render: (type: JumpType) => {
        const cfg = jumpTypeConfig[type];
        const colorMap = { none: 'default', app_page: 'blue', deep_link: 'purple', external_url: 'cyan' };
        return <Tag icon={cfg.icon} color={colorMap[type]} style={{ borderRadius: 4 }}>{cfg.label}</Tag>;
      },
    },
    {
      title: '跳转目标', dataIndex: 'jumpTarget', key: 'jumpTarget', width: 260, ellipsis: true,
      render: (t?: string, r?: AppPushTemplate) => {
        const record = r as AppPushTemplate;
        return record.jumpType === 'none'
          ? <span style={{ color: '#9ca3af', fontSize: '12px' }}>—</span>
          : <Tooltip title={t}><code style={{ fontSize: '12px', color: '#0d4f3c', background: '#ecfdf5', padding: '2px 6px', borderRadius: 4 }}>{t}</code></Tooltip>;
      },
    },
    {
      title: '推送内容', dataIndex: 'content', key: 'content', ellipsis: true,
      render: (text: string) => <Tooltip title={text}><span style={{ fontSize: '13px', color: '#4b5563' }}>{text.length > 40 ? text.slice(0, 40) + '...' : text}</span></Tooltip>,
    },
  ];

  const needJumpTarget = jumpType && jumpType !== 'none';

  return (
    <Card variant="borderless" title={<span style={{ color: '#0d4f3c', fontWeight: 600 }}>APP Push 模板管理</span>}
      extra={<div style={{ display: 'flex', gap: 8 }}>
        <Input placeholder="搜索模板名称" prefix={<SearchOutlined style={{ color: '#9ca3af' }} />} allowClear value={search} onChange={e => setSearch(e.target.value)} style={{ width: 200, borderRadius: 6 }} />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ backgroundColor: '#0d4f3c', borderColor: '#0d4f3c', borderRadius: 6 }}>创建模板</Button>
      </div>}>
      <Table dataSource={filtered} columns={columns} rowKey="id" pagination={{ pageSize: 10, showTotal: (t) => <span style={{ fontSize: '13px', color: '#6b7280' }}>共 {t} 条</span> }} size="middle" />

      <Modal title={<span style={{ color: '#0d4f3c' }}>{editing ? '编辑' : '创建'} APP Push 模板</span>}
        open={modalVisible} onOk={handleSubmit} onCancel={() => setModalVisible(false)} width={640} okText="保存" cancelText="取消"
        okButtonProps={{ style: { backgroundColor: '#0d4f3c', borderColor: '#0d4f3c' } }} destroyOnHidden>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }} initialValues={{ jumpType: 'none' }}>
          <Form.Item name="name" label={<span style={labelStyle}>模板名称</span>} rules={[{ required: true, message: '请输入' }]}>
            <Input placeholder="例如：APP还款提醒推送" style={{ borderRadius: 6 }} />
          </Form.Item>
          <Form.Item name="providerId" label={<span style={labelStyle}>绑定服务商</span>} rules={[{ required: true, message: '请选择' }]}>
            <Select placeholder="选择服务商" style={{ borderRadius: 6 }} options={getEnabledProvidersByType('APP Push').map(p => ({ value: p.id, label: `${p.name} (${p.id})` }))} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="pushName" label={<span style={labelStyle}>Push Name</span>} rules={[{ required: true, message: '请输入 Push Name' }]}
                extra={<span style={{ fontSize: '12px', color: '#9ca3af' }}>推送标识，内部区分场景</span>}>
                <Input placeholder="例如：repayment_reminder" style={{ borderRadius: 6, fontFamily: 'monospace' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="pushTitle" label={<span style={labelStyle}>推送标题 (Title)</span>} rules={[{ required: true, message: '请输入推送标题' }]}>
                <Input placeholder="例如：还款提醒" style={{ borderRadius: 6 }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="content" label={<span style={labelStyle}>推送内容</span>} rules={[{ required: true, message: '请输入推送内容' }]}>
            <Input.TextArea rows={4} placeholder="请输入推送内容，可使用变量" style={{ borderRadius: 6 }} />
          </Form.Item>

          {/* 跳转逻辑配置 */}
          <Card size="small" style={{ marginBottom: 16, borderRadius: 8, background: '#f9fafb', border: '1px solid #e5e7eb' }}
            title={<span style={{ fontSize: '13px', fontWeight: 600 }}><LinkOutlined style={{ marginRight: 4, color: '#0d4f3c' }} />跳转逻辑配置</span>}>
            <Form.Item name="jumpType" label={<span style={labelStyle}>跳转方式</span>} rules={[{ required: true }]}>
              <Radio.Group style={{ width: '100%' }}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  {(['none', 'app_page', 'deep_link', 'external_url'] as JumpType[]).map(type => {
                    const cfg = jumpTypeConfig[type];
                    return (
                      <Radio.Button key={type} value={type} style={{ width: '100%', height: 'auto', padding: '8px 12px', borderRadius: 6, margin: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                          <span style={{ color: '#0d4f3c', marginTop: 2 }}>{cfg.icon}</span>
                          <div>
                            <div style={{ fontWeight: 500, color: '#1f2937' }}>{cfg.label}</div>
                            <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'normal' }}>{cfg.desc}</div>
                          </div>
                        </div>
                      </Radio.Button>
                    );
                  })}
                </Space>
              </Radio.Group>
            </Form.Item>

            {needJumpTarget && (
              <Form.Item
                name="jumpTarget"
                label={<span style={labelStyle}>
                  {jumpType === 'app_page' ? 'APP页面路由' : jumpType === 'deep_link' ? 'Deep Link 链接' : '外部URL链接'}
                </span>}
                rules={[{ required: true, message: '请输入跳转目标' }]}
                extra={<span style={{ fontSize: '12px', color: '#9ca3af' }}>支持变量，如 ?caseId={'{{caseId}}'}</span>}
              >
                <Input
                  placeholder={
                    jumpType === 'app_page' ? '例如：pages/repayment/detail?caseId={{caseId}}' :
                    jumpType === 'deep_link' ? '例如：myapp://repayment?caseId={{caseId}}' :
                    '例如：https://www.example.com/detail?id={{caseId}}'
                  }
                  addonBefore={
                    jumpType === 'app_page' ? 'App://' :
                    jumpType === 'deep_link' ? '' :
                    'https://'
                  }
                  style={{ borderRadius: 6, fontFamily: 'monospace' }}
                />
              </Form.Item>
            )}

            <div style={{ fontSize: '12px', color: '#9ca3af' }}>
              <Space direction="vertical" size={0} style={{ width: '100%' }}>
                <div style={{ marginBottom: 4 }}>可用变量（点击插入到跳转链接或内容末尾）：</div>
                <div>
                  <Space wrap size={[4, 4]}>
                    {variables.map(v => (
                      <Button key={v} type="text" size="small" onClick={() => insertVar(v)}
                        style={{ padding: '2px 8px', border: '1px solid #0d4f3c', borderRadius: 6, fontSize: '12px', color: '#0d4f3c', height: 'auto' }}>{v}</Button>
                    ))}
                  </Space>
                </div>
              </Space>
            </div>
          </Card>

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

export default AppPushTemplateMgmt;
