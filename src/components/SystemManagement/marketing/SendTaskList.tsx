import React, { useState, useMemo } from 'react';
import { Table, Button, Tag, Modal, Form, Select, DatePicker, InputNumber, message, Space, Collapse, Popconfirm, Input, Radio, Progress } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, ApiOutlined, EyeOutlined, SearchOutlined, ReloadOutlined, CopyOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';

type SendMethod = 'SMS' | 'Email' | 'RCS' | 'IVR' | 'AI' | 'WABA' | 'APP Push';
type TaskStatus = 'enabled' | 'disabled';

interface SendTask {
  id: string;
  name: string;
  templateName: string;
  templateIds?: string[];
  audience: string;
  audienceCount: number;
  providerName: string;
  scheduledTime: string;
  status: TaskStatus;
  createdAt: string;
  // AI 特有
  dayType?: 'workday' | 'nonworkday';
  products?: string[];
}

interface TemplateOption {
  id: string;
  name: string;
  type: SendMethod;
  providerId: string;
  providerName: string;
}

interface AudienceOption {
  value: string;
  label: string;
  count: number;
}

const audienceOptions: AudienceOption[] = [
  { value: 'AUD001', label: 'M1逾期可联系客户', count: 3280 },
  { value: 'AUD002', label: '高风险逾期客户', count: 856 },
  { value: 'AUD003', label: 'VIP客户还款提醒', count: 1240 },
  { value: 'AUD004', label: '失联客户预警', count: 432 },
  { value: 'AUD005', label: 'M0新客户提醒', count: 2100 },
];

// 产品选项
const productOptions = [
  { value: 'CL01', label: 'CL01' },
  { value: 'CL02', label: 'CL02' },
  { value: 'CL03', label: 'CL03' },
  { value: 'CL04', label: 'CL04' },
  { value: 'CL05', label: 'CL05' },
  { value: 'CL06', label: 'CL06' },
  { value: 'CL07', label: 'CL07' },
  { value: 'CL08', label: 'CL08' },
];

const dayTypeLabels: Record<string, string> = {
  workday: '工作日',
  nonworkday: '非工作日',
};

const templatesByType: Record<SendMethod, TemplateOption[]> = {
  SMS: [
    { id: 'TP001', name: '还款提醒短信', type: 'SMS', providerId: 'SP001', providerName: 'Twilio SMS Gateway' },
    { id: 'TP002', name: '逾期催收短信', type: 'SMS', providerId: 'SP002', providerName: 'Infobip SMS' },
  ],
  Email: [
    { id: 'TP005', name: '还款提醒邮件', type: 'Email', providerId: 'SP004', providerName: 'SendGrid Email' },
    { id: 'TP006', name: '逾期通知邮件', type: 'Email', providerId: 'SP005', providerName: 'Amazon SES' },
  ],
  RCS: [
    { id: 'TP007', name: 'RCS还款提醒', type: 'RCS', providerId: 'SP006', providerName: 'Google RBM' },
  ],
  IVR: [
    { id: 'TP008', name: 'IVR逾期催收话术', type: 'IVR', providerId: 'SP007', providerName: 'Twilio Voice' },
  ],
  AI: [
    { id: 'TP009', name: 'AI智能催收话术', type: 'AI', providerId: 'SP008', providerName: 'AI Rudder' },
    { id: 'TP012', name: 'AI智能催收话术-II', type: 'AI', providerId: 'SP009', providerName: 'Dyna' },
  ],
  WABA: [
    { id: 'TP003', name: 'WABA还款提醒', type: 'WABA', providerId: 'SP003', providerName: 'WhatsApp Business API' },
    { id: 'TP004', name: 'WABA逾期通知', type: 'WABA', providerId: 'SP003', providerName: 'WhatsApp Business API' },
  ],
  'APP Push': [
    { id: 'TP010', name: 'APP还款提醒推送', type: 'APP Push', providerId: 'SP010', providerName: 'Firebase FCM' },
    { id: 'TP011', name: 'APP逾期推送通知', type: 'APP Push', providerId: 'SP011', providerName: 'OneSignal Push' },
  ],
};

const providersByType: Record<SendMethod, { id: string; name: string }[]> = {
  SMS: [{ id: 'SP001', name: 'Twilio SMS Gateway' }, { id: 'SP002', name: 'Infobip SMS' }],
  Email: [{ id: 'SP004', name: 'SendGrid Email' }, { id: 'SP005', name: 'Amazon SES' }],
  RCS: [{ id: 'SP006', name: 'Google RBM' }],
  IVR: [{ id: 'SP007', name: 'Twilio Voice' }],
  AI: [{ id: 'SP008', name: 'AI Rudder' }, { id: 'SP009', name: 'Dyna' }],
  WABA: [{ id: 'SP003', name: 'WhatsApp Business API' }],
  'APP Push': [{ id: 'SP010', name: 'Firebase FCM' }, { id: 'SP011', name: 'OneSignal Push' }],
};

const statusConfig: Record<TaskStatus, { label: string; color: string }> = {
  enabled: { label: '启用', color: 'success' },
  disabled: { label: '关闭', color: 'default' },
};

const generateMockTasks = (method: SendMethod): SendTask[] => {
  const templates = templatesByType[method];
  const providers = providersByType[method];
  const tasks: SendTask[] = [];
  const statuses: TaskStatus[] = ['enabled', 'enabled', 'disabled', 'enabled', 'disabled'];
  const dayTypes: ('workday' | 'nonworkday')[] = ['workday', 'nonworkday'];
  const productValues = productOptions.map(p => p.value);
  for (let i = 0; i < 5; i++) {
    const tpl = templates[i % templates.length];
    const aud = audienceOptions[i % audienceOptions.length];
    const status = statuses[i % statuses.length];

    // AI 任务支持多模板
    const isAI = method === 'AI';
    let templateName = tpl.name;
    let templateIds: string[] | undefined;
    if (isAI) {
      const selectedTpls = [tpl, templates[(i + 1) % templates.length]];
      templateIds = selectedTpls.map(t => t.id);
      templateName = selectedTpls.map(t => t.name).join('、');
    }

    tasks.push({
      id: `${method.replace(/\s/g, '').toUpperCase()}${String(i + 1).padStart(3, '0')}`,
      name: `${aud.label}-${method}`,
      templateName,
      templateIds,
      audience: aud.label,
      audienceCount: aud.count,
      providerName: providers[i % providers.length].name,
      scheduledTime: dayjs().subtract(i, 'day').format('YYYY-MM-DD HH:mm:ss'),
      status,
      createdAt: dayjs().subtract(i, 'day').format('YYYY-MM-DD HH:mm:ss'),
      dayType: isAI ? dayTypes[i % dayTypes.length] : undefined,
      products: isAI ? [productValues[i % productValues.length], productValues[(i + 2) % productValues.length]] : undefined,
    });
  }
  return tasks;
};

interface SendTaskListProps {
  method: SendMethod;
}

const SendTaskList: React.FC<SendTaskListProps> = ({ method }) => {
  const [tasks, setTasks] = useState<SendTask[]>(() => generateMockTasks(method));
  const [modalVisible, setModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentTask, setCurrentTask] = useState<SendTask | null>(null);
  const [form] = Form.useForm();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateOption | null>(null);
  const [selectedTemplates, setSelectedTemplates] = useState<TemplateOption[]>([]);

  // 查询条件
  const [searchName, setSearchName] = useState('');
  const [searchStatus, setSearchStatus] = useState<TaskStatus | undefined>();
  const [searchStartDate, setSearchStartDate] = useState<Dayjs | null>(null);
  const [searchEndDate, setSearchEndDate] = useState<Dayjs | null>(null);

  const templates = templatesByType[method] || [];

  const filtered = useMemo(() => {
    return tasks.filter(t => {
      if (searchName && !t.name.toLowerCase().includes(searchName.toLowerCase()) && !t.id.toLowerCase().includes(searchName.toLowerCase())) return false;
      if (searchStatus && t.status !== searchStatus) return false;
      const recordDate = dayjs(t.scheduledTime);
      if (searchStartDate && recordDate < searchStartDate.startOf('day')) return false;
      if (searchEndDate && recordDate > searchEndDate.endOf('day')) return false;
      return true;
    });
  }, [tasks, searchName, searchStatus, searchStartDate, searchEndDate]);

  const handleReset = () => {
    setSearchName('');
    setSearchStatus(undefined);
    setSearchStartDate(null);
    setSearchEndDate(null);
  };

  const handleTemplateChange = (value: string | string[]) => {
    if (method === 'AI' && Array.isArray(value)) {
      // AI 多选：根据所选模板推导出对应服务商
      const selected = templates.filter(tp => value.includes(tp.id));
      setSelectedTemplates(selected);
      setSelectedTemplate(selected.length > 0 ? selected[0] : null);
    } else {
      const t = templates.find(tp => tp.id === value);
      setSelectedTemplate(t || null);
      setSelectedTemplates(t ? [t] : []);
    }
  };

  // 多服务商分配仅展示已选模板绑定的服务商（去重）
  const availableProviders = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    selectedTemplates.forEach(t => {
      if (!map.has(t.providerId)) {
        map.set(t.providerId, { id: t.providerId, name: t.providerName });
      }
    });
    return Array.from(map.values());
  }, [selectedTemplates]);

  const buildTaskFromValues = (values: any): SendTask => {
    const audienceValues: string[] = Array.isArray(values.audience) ? values.audience : values.audience ? [values.audience] : [];
    const audiences = audienceValues.map((v: string) => audienceOptions.find(a => a.value === v)).filter(Boolean) as AudienceOption[];
    const totalCount = audiences.reduce((s, a) => s + a.count, 0);
    const audienceLabel = audiences.map(a => a.label).join(' + ');

    let templateName = '';
    let providerName = '';
    let templateIds: string[] | undefined;

    if (method === 'AI' && Array.isArray(values.templateId)) {
      const selected = templates.filter(tp => values.templateId.includes(tp.id));
      templateIds = values.templateId;
      templateName = selected.map(s => s.name).join('、');
      providerName = selected[0]?.providerName || '';
    } else {
      const template = templates.find(t => t.id === values.templateId);
      templateName = template?.name || '';
      providerName = template?.providerName || '';
    }

    return {
      id: `${method.replace(/\s/g, '').toUpperCase()}${String(Date.now()).slice(-6)}`,
      name: values.name || `${audienceLabel}-${method}`,
      templateName,
      templateIds,
      audience: audienceLabel,
      audienceCount: totalCount,
      providerName,
      scheduledTime: values.scheduledTime ? (values.scheduledTime as Dayjs).format('YYYY-MM-DD HH:mm:ss') : dayjs().format('YYYY-MM-DD HH:mm:ss'),
      status: 'enabled',
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      dayType: method === 'AI' ? (values.dayType || 'workday') : undefined,
      products: method === 'AI' ? (values.products || []) : undefined,
    };
  };

  const handleAddTask = async () => {
    try {
      const values = await form.validateFields();
      const newTask = buildTaskFromValues(values);

      setTasks(prev => [newTask, ...prev]);
      message.success(`任务「${newTask.name}」已创建`);
      form.resetFields();
      setSelectedTemplate(null);
      setSelectedTemplates([]);
      setModalVisible(false);
    } catch { /* validation */ }
  };

  // 复制任务：打开新建弹窗并预填该任务配置
  const handleCopyTask = (task: SendTask) => {
    form.resetFields();

    const fillValues: any = {
      name: `${task.name}-副本`,
    };

    // 从已合并的客群名称反向解析出 audience values
    // 简化处理：遍历 audienceOptions 找到匹配的
    const audienceLabels = task.audience.split(' + ').map(s => s.trim());
    const matchedAudience = audienceOptions.filter(a => audienceLabels.includes(a.label)).map(a => a.value);
    fillValues.audience = matchedAudience.length > 0 ? matchedAudience : undefined;

    if (method === 'AI' && task.templateIds && task.templateIds.length > 0) {
      fillValues.templateId = task.templateIds;
      const selected = templates.filter(tp => task.templateIds!.includes(tp.id));
      setSelectedTemplates(selected);
      setSelectedTemplate(selected.length > 0 ? selected[0] : null);
      fillValues.dayType = task.dayType || 'workday';
      fillValues.products = task.products || [];
    } else {
      const tpl = templates.find(tp => tp.name === task.templateName);
      fillValues.templateId = tpl?.id;
      setSelectedTemplate(tpl || null);
      setSelectedTemplates(tpl ? [tpl] : []);
    }

    form.setFieldsValue(fillValues);
    setModalVisible(true);
    message.info(`已复制任务「${task.name}」，请确认后创建`);
  };

  const handleToggleStatus = (task: SendTask) => {
    const newStatus = task.status === 'enabled' ? 'disabled' : 'enabled';
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    message.success(`任务「${task.name}」已${newStatus === 'enabled' ? '启用' : '关闭'}`);
  };

  const handleViewDetail = (task: SendTask) => {
    setCurrentTask(task);
    setDetailVisible(true);
  };

  const columns: ColumnsType<SendTask> = [
    {
      title: '任务名称', dataIndex: 'name', key: 'name', width: 180,
      render: (text: string, record) => (
        <div>
          <div style={{ fontWeight: 500, color: '#1f2937' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>{record.id}</div>
        </div>
      ),
    },
    {
      title: '模板', dataIndex: 'templateName', key: 'templateName', width: 140, ellipsis: true,
    },
    {
      title: '客群', key: 'audience', width: 160,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '13px', color: '#374151' }}>{record.audience}</div>
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>{record.audienceCount.toLocaleString()} 人</div>
        </div>
      ),
    },
    {
      title: '服务商', dataIndex: 'providerName', key: 'providerName', width: 160, ellipsis: true,
      render: (t: string) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <ApiOutlined style={{ color: '#0d4f3c', fontSize: 12 }} />
          <span style={{ fontSize: '13px', color: '#374151' }}>{t}</span>
        </div>
      ),
    },
    {
      title: '发送时间', dataIndex: 'scheduledTime', key: 'scheduledTime', width: 160,
      sorter: (a, b) => a.scheduledTime.localeCompare(b.scheduledTime),
      render: (t: string) => <span style={{ color: '#6b7280', fontSize: '13px' }}>{t}</span>,
    },
    // AI 特有配置列
    ...(method === 'AI' ? [{
      title: 'AI配置', key: 'aiConfig', width: 200,
      render: (_: unknown, record: SendTask) => (
        <Space size={4} wrap>
          {record.dayType && <Tag color="blue" style={{ borderRadius: 4 }}>{dayTypeLabels[record.dayType]}</Tag>}
          {record.products && record.products.map(p => (
            <Tag key={p} color="geekblue" style={{ borderRadius: 4 }}>{p}</Tag>
          ))}
        </Space>
      ),
    }] : []),
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 90,
      render: (s: TaskStatus) => <Tag color={statusConfig[s].color} style={{ borderRadius: 4 }}>{statusConfig[s].label}</Tag>,
    },
    {
      title: '操作', key: 'actions', width: 200, fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}
            style={{ color: '#0d4f3c' }}>详情</Button>
          <Button type="link" size="small" icon={<CopyOutlined />} onClick={() => handleCopyTask(record)}
            style={{ color: '#0d4f3c' }}>复制</Button>
          <Popconfirm
            title={record.status === 'enabled' ? '确认关闭此任务？' : '确认启用此任务？'}
            onConfirm={() => handleToggleStatus(record)}
            okText="确认" cancelText="取消"
          >
            <Button type="link" size="small" danger={record.status === 'enabled'}>
              {record.status === 'enabled' ? '关闭' : '启用'}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>{method} 发送任务</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#6b7280' }}>
            管理 {method} 类型的发送任务，支持查询、新建和关停
          </p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setSelectedTemplate(null); setModalVisible(true); }}
          style={{ backgroundColor: '#0d4f3c', borderColor: '#0d4f3c', borderRadius: 6 }}>
          新建任务
        </Button>
      </div>

      {/* 统计卡片 */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, padding: '12px 16px', backgroundColor: '#ecfdf5', borderRadius: 8, border: '1px solid #a7f3d0' }}>
          <div style={{ fontSize: '12px', color: '#065f46' }}>启用中</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#047857', marginTop: 2 }}>
            {tasks.filter(t => t.status === 'enabled').length}
          </div>
        </div>
        <div style={{ flex: 1, padding: '12px 16px', backgroundColor: '#f3f4f6', borderRadius: 8, border: '1px solid #d1d5db' }}>
          <div style={{ fontSize: '12px', color: '#374151' }}>已关闭</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#6b7280', marginTop: 2 }}>
            {tasks.filter(t => t.status === 'disabled').length}
          </div>
        </div>
        <div style={{ flex: 1, padding: '12px 16px', backgroundColor: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0' }}>
          <div style={{ fontSize: '12px', color: '#166534' }}>任务总数</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#16a34a', marginTop: 2 }}>
            {tasks.length}
          </div>
        </div>
      </div>

      {/* 查询栏 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <Input placeholder="任务名称/ID" value={searchName} onChange={(e) => setSearchName(e.target.value)}
          style={{ width: 200, borderRadius: 6 }} prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
          allowClear
        />
        <Select placeholder="发送状态" value={searchStatus} onChange={setSearchStatus}
          style={{ width: 140, borderRadius: 6 }} allowClear
          options={(Object.keys(statusConfig) as TaskStatus[]).map(s => ({ value: s, label: statusConfig[s].label }))}
        />
        <DatePicker.RangePicker
          value={[searchStartDate, searchEndDate]}
          onChange={(dates) => { setSearchStartDate(dates?.[0] || null); setSearchEndDate(dates?.[1] || null); }}
          placeholder={['开始时间', '结束时间']}
          style={{ borderRadius: 6 }}
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
        scroll={{ x: 1200 }}
      />

      {/* 新建任务弹窗 */}
      <Modal title={`新建 ${method} 发送任务`} open={modalVisible} width={560}
        onOk={handleAddTask}
        onCancel={() => { form.resetFields(); setSelectedTemplate(null); setSelectedTemplates([]); setModalVisible(false); }}
        okText="创建任务" cancelText="取消"
      >
        <Form form={form} layout="vertical" style={{ padding: '8px 0' }}>
          <Form.Item name="name" label="任务名称">
            <Input placeholder="请输入任务名称（可选）" style={{ borderRadius: 6 }} />
          </Form.Item>
          <Form.Item name="templateId"
            label={method === 'AI' ? '发送模板（可多选）' : '发送模板'}
            rules={[{ required: true, message: '请选择模板' }]}>
            {method === 'AI' ? (
              <Select mode="multiple" placeholder="选择AI策略模板（可多选）" style={{ borderRadius: 6 }}
                onChange={handleTemplateChange}
                options={templates.map(t => ({ value: t.id, label: `${t.name} (${t.id})` }))}
                optionFilterProp="label"
              />
            ) : (
              <Select placeholder="选择模板" style={{ borderRadius: 6 }}
                onChange={handleTemplateChange}
                options={templates.map(t => ({ value: t.id, label: `${t.name} (${t.id})` }))}
              />
            )}
          </Form.Item>

          {/* AI 特有配置 */}
          {method === 'AI' && (
            <>
              <Form.Item name="dayType" label="执行日期"
                rules={[{ required: true, message: '请选择执行日期' }]}>
                <Radio.Group>
                  <Radio value="workday">工作日</Radio>
                  <Radio value="nonworkday">非工作日</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item name="products" label="产品"
                rules={[{ required: true, message: '请选择产品' }]}>
                <Select mode="multiple" placeholder="选择产品（可多选）" style={{ borderRadius: 6 }}
                  options={productOptions}
                  optionFilterProp="label"
                />
              </Form.Item>
            </>
          )}

          {selectedTemplate && method !== 'AI' && (
            <div style={{ marginBottom: 16, padding: '10px 14px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ApiOutlined style={{ color: '#16a34a' }} />
                <span style={{ fontSize: '13px', color: '#374151' }}>
                  绑定服务商：<strong>{selectedTemplate.providerName}</strong>
                </span>
              </div>
            </div>
          )}
          <Form.Item name="scheduledTime" label="定时发送（可选）"
            extra={<span style={{ fontSize: '12px', color: '#9ca3af' }}>不选择则立即发送</span>}>
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss"
              disabledDate={(current: Dayjs) => !!current && current < dayjs().startOf('day')}
              placeholder="选择定时发送时间"
              style={{ width: '100%', borderRadius: 6 }}
            />
          </Form.Item>
          <Form.Item name="audience" label="选择客群"
            rules={[{ required: true, message: '请选择客群' }]}>
            <Select mode="multiple" placeholder="请选择目标客群（可多选）" style={{ borderRadius: 6 }} showSearch
              optionFilterProp="label"
              options={audienceOptions.map(a => ({ value: a.value, label: `${a.label} (${a.count.toLocaleString()} 人)` }))}
            />
          </Form.Item>

          {/* 高级配置：服务商跟随已选模板 */}
          <Collapse
            items={[{
              key: 'advanced',
              label: <span style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>高级配置：多服务商分配</span>,
              children: availableProviders.length > 0 ? (
                <AdvancedProviderConfig
                  key={availableProviders.map(p => p.id).join(',')}
                  method={method}
                  providers={availableProviders}
                  defaultProviderId={availableProviders[0].id}
                />
              ) : (
                <div style={{ color: '#9ca3af', fontSize: '13px', padding: '8px 0' }}>请先选择模板，服务商将根据所选模板自动出现</div>
              ),
            }]}
            style={{ marginBottom: 8, borderRadius: 6 }}
          />
        </Form>
      </Modal>

      {/* 任务详情弹窗 */}
      <Modal title="任务详情" open={detailVisible} onCancel={() => setDetailVisible(false)}
        footer={[<Button key="close" onClick={() => setDetailVisible(false)}>关闭</Button>]}
        width={520}>
        {currentTask && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: 4 }}>任务名称</div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#1f2937' }}>
                {currentTask.name}
                <Tag color={statusConfig[currentTask.status].color} style={{ marginLeft: 8, borderRadius: 4 }}>
                  {statusConfig[currentTask.status].label}
                </Tag>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div><div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: 4 }}>任务ID</div><div style={{ color: '#374151' }}>{currentTask.id}</div></div>
              <div><div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: 4 }}>模板</div><div style={{ color: '#374151' }}>{currentTask.templateName}</div></div>
              <div><div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: 4 }}>服务商</div><div style={{ color: '#374151' }}>{currentTask.providerName}</div></div>
              <div><div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: 4 }}>客群</div><div style={{ color: '#374151' }}>{currentTask.audience}</div></div>
              <div><div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: 4 }}>客群人数</div><div style={{ color: '#0d4f3c', fontWeight: 600 }}>{currentTask.audienceCount.toLocaleString()} 人</div></div>
              <div><div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: 4 }}>发送时间</div><div style={{ color: '#374151' }}>{currentTask.scheduledTime}</div></div>
            </div>
            {method === 'AI' && (currentTask.dayType || currentTask.products?.length) && (
              <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f9fafb', borderRadius: 8 }}>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: 8 }}>AI 任务配置</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {currentTask.dayType && <Tag color="blue" style={{ borderRadius: 4 }}>执行日期：{dayTypeLabels[currentTask.dayType]}</Tag>}
                  {currentTask.products && currentTask.products.map(p => (
                    <Tag key={p} color="geekblue" style={{ borderRadius: 4 }}>产品：{p}</Tag>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

const AdvancedProviderConfig: React.FC<{ method: SendMethod; providers: { id: string; name: string }[]; defaultProviderId: string }> = ({ method, providers: availableProviders, defaultProviderId }) => {
  // 服务商来源：已选模板绑定的服务商（由父组件传入）
  const allProviders = availableProviders;
  const [providers, setProviders] = useState<{ id: string; name: string; ratio: number }[]>(() => {
    const primary = allProviders.find(p => p.id === defaultProviderId);
    const others = allProviders.filter(p => p.id !== defaultProviderId);
    const result: { id: string; name: string; ratio: number }[] = [];
    if (primary) result.push({ id: primary.id, name: primary.name, ratio: 100 });
    others.forEach(p => result.push({ id: p.id, name: p.name, ratio: 0 }));
    return result;
  });

  const total = providers.reduce((s, p) => s + p.ratio, 0);

  const handleRatioChange = (idx: number, value: number) => {
    setProviders(prev => prev.map((p, i) => i === idx ? { ...p, ratio: value } : p));
  };

  const handleRemove = (idx: number) => {
    if (providers.length <= 1) return;
    setProviders(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAdd = () => {
    const usedIds = providers.map(p => p.id);
    const available = allProviders.find(p => !usedIds.includes(p.id));
    if (available) {
      setProviders(prev => [...prev, { id: available.id, name: available.name, ratio: 0 }]);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: '13px', color: '#374151' }}>为「{method}」已选模板对应的服务商分配比例</span>
        <Tag color={total > 100 ? 'error' : total === 100 ? 'success' : 'warning'} style={{ borderRadius: 4 }}>
          总比例：{total}%{total > 100 && <span style={{ marginLeft: 4 }}>(已超出)</span>}
        </Tag>
      </div>
      <Progress percent={Math.min(total, 100)} showInfo={false}
        strokeColor={total > 100 ? '#ef4444' : total === 100 ? '#22c55e' : '#f59e0b'}
        style={{ marginBottom: 12 }}
      />
      {providers.map((p, idx) => (
        <div key={p.id} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <div style={{ flex: 1, padding: '6px 12px', backgroundColor: '#f9fafb', borderRadius: 6, fontSize: '13px', color: '#374151' }}>
            <ApiOutlined style={{ marginRight: 6, color: '#0d4f3c' }} />
            {p.name}
          </div>
          <InputNumber min={0} max={100} addonAfter="%" value={p.ratio}
            onChange={(v) => handleRatioChange(idx, Number(v) || 0)}
            style={{ width: 130 }} />
          <Button type="text" danger onClick={() => handleRemove(idx)} disabled={providers.length <= 1}>移除</Button>
        </div>
      ))}
      {providers.length < allProviders.length && (
        <Button type="dashed" block onClick={handleAdd} style={{ borderRadius: 6, marginTop: 8 }}>+ 添加服务商</Button>
      )}
      {allProviders.length === 1 && (
        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: 8 }}>当前仅绑定一个服务商，无需分配比例。</div>
      )}
    </div>
  );
};

export default SendTaskList;
