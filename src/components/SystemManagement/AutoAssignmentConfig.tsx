import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Tag, message, Space, Popconfirm, Switch, InputNumber } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { useLanguage } from '../../i18n/LanguageContext';

interface AssignmentRule {
  id: string;
  name: string;
  products: string[];
  overdueStage: string;
  overdueStageRange: { start: string; end: string } | null;
  team: string;
  collectors: string[];
  distributionMode: 'average' | 'roundRobin' | 'capacity';
  priority: number;
  maxCasesPerCollector: number;
  enabled: boolean;
  createTime: string;
  createBy: string;
  lastRunTime?: string;
}

const defaultRules: AssignmentRule[] = [
  {
    id: '1',
    name: '消费贷M1阶段自动分案',
    products: ['消费贷'],
    overdueStage: 'M1',
    overdueStageRange: null,
    team: '催收一组',
    collectors: ['催收员A', '催收员B'],
    distributionMode: 'average',
    priority: 1,
    maxCasesPerCollector: 50,
    enabled: true,
    createTime: '2024-03-01 10:00:00',
    createBy: '管理员',
    lastRunTime: '2024-03-30 15:30:00',
  },
  {
    id: '2',
    name: '消费贷M2阶段自动分案',
    products: ['消费贷'],
    overdueStage: 'M2',
    overdueStageRange: null,
    team: '催收二组',
    collectors: ['催收员C', '催收员D'],
    distributionMode: 'roundRobin',
    priority: 2,
    maxCasesPerCollector: 40,
    enabled: true,
    createTime: '2024-03-01 10:00:00',
    createBy: '管理员',
    lastRunTime: '2024-03-30 15:30:00',
  },
  {
    id: '3',
    name: '经营贷M1-M2阶段自动分案',
    products: ['经营贷', '消费贷'],
    overdueStage: 'custom',
    overdueStageRange: { start: 'M1', end: 'M2' },
    team: '催收三组',
    collectors: ['催收员E'],
    distributionMode: 'capacity',
    priority: 3,
    maxCasesPerCollector: 30,
    enabled: false,
    createTime: '2024-03-01 10:00:00',
    createBy: '管理员',
  },
];

const products = ['消费贷', '经营贷', '房贷', '车贷'];
const overdueStages = ['M0', 'M1', 'M2', 'M3', 'M3+'];
const teams = ['催收一组', '催收二组', '催收三组'];
const allCollectors = [
  { value: '催收员A', label: '催收员A', team: '催收一组' },
  { value: '催收员B', label: '催收员B', team: '催收一组' },
  { value: '催收员C', label: '催收员C', team: '催收二组' },
  { value: '催收员D', label: '催收员D', team: '催收二组' },
  { value: '催收员E', label: '催收员E', team: '催收三组' },
];

const AutoAssignmentConfig: React.FC = () => {
  const [rules, setRules] = useState<AssignmentRule[]>(defaultRules);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState<AssignmentRule | null>(null);
  const [form] = Form.useForm();
  const { t } = useLanguage();

  const handleAdd = () => {
    setEditingRule(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (rule: AssignmentRule) => {
    setEditingRule(rule);
    form.setFieldsValue(rule);
    setModalVisible(true);
  };

  const handleDelete = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
    message.success('自动分案规则删除成功');
  };

  const handleToggleStatus = (ruleId: string, enabled: boolean) => {
    const updatedRules = rules.map(rule => 
      rule.id === ruleId 
        ? { ...rule, enabled }
        : rule
    );
    setRules(updatedRules);
    message.success(`规则已${enabled ? '启用' : '禁用'}`);
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const processedValues = {
        ...values,
        overdueStageRange: values.overdueStage === 'custom' ? values.overdueStageRange : null,
      };
      
      if (editingRule) {
        const updatedRules = rules.map(rule => 
          rule.id === editingRule.id 
            ? { ...rule, ...processedValues, id: rule.id, createTime: rule.createTime, createBy: rule.createBy }
            : rule
        );
        setRules(updatedRules);
        message.success('自动分案规则编辑成功');
      } else {
        const newRule: AssignmentRule = {
          id: (rules.length + 1).toString(),
          ...processedValues,
          createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
          createBy: '当前用户',
          enabled: true,
        };
        setRules([...rules, newRule]);
        message.success('自动分案规则创建成功');
      }
      setModalVisible(false);
    });
  };

  const handleRunNow = (ruleId: string) => {
    message.success('自动分案任务已启动');
    // 实际项目中这里会调用API启动分案任务
  };

  const columns: ColumnsType<AssignmentRule> = [
    {
      title: t.ruleName,
      dataIndex: 'name',
      key: 'name',
      width: 180,
    },
    {
      title: t.product,
      dataIndex: 'products',
      key: 'products',
      width: 150,
      render: (products: string[]) => (
        <Space size="small" wrap>
          {products.map((product, index) => (
            <Tag key={index} color="blue">{product}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: t.overdueStage,
      dataIndex: 'overdueStage',
      key: 'overdueStage',
      width: 120,
      render: (stage: string, record: AssignmentRule) => {
        if (stage === 'custom' && record.overdueStageRange) {
          return <Tag color="orange">{record.overdueStageRange.start}-{record.overdueStageRange.end}</Tag>;
        }
        return <Tag color="blue">{stage}</Tag>;
      },
    },
    {
      title: t.allocationTeam,
      dataIndex: 'team',
      key: 'team',
      width: 120,
    },
    {
      title: t.allocationCollector,
      dataIndex: 'collectors',
      key: 'collectors',
      width: 150,
      render: (collectors: string[]) => (
        <Space size="small" wrap>
          {collectors.map((collector, index) => (
            <Tag key={index} size="small">{collector}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: t.distributionMode,
      dataIndex: 'distributionMode',
      key: 'distributionMode',
      width: 100,
      render: (mode: string) => {
        const modeMap: Record<string, string> = {
          'average': t.average,
          'roundRobin': t.roundRobin,
          'capacity': t.capacity,
        };
        return modeMap[mode] || mode;
      },
    },
    {
      title: t.priority,
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
    },
    {
      title: t.maxPerCollector,
      dataIndex: 'maxCasesPerCollector',
      key: 'maxCasesPerCollector',
      width: 100,
      render: (max: number) => `${max}${t.case}`,
    },
    {
      title: t.status,
      dataIndex: 'enabled',
      key: 'enabled',
      width: 100,
      render: (enabled: boolean, record) => (
        <Switch
          checked={enabled}
          onChange={(checked) => handleToggleStatus(record.id, checked)}
          checkedChildren={t.enabled}
          unCheckedChildren={t.disabled}
        />
      ),
    },
    {
      title: t.lastExecution,
      dataIndex: 'lastRunTime',
      key: 'lastRunTime',
      width: 150,
      render: (time: string) => time || t.notExecuted,
    },
    {
      title: t.action,
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<PlayCircleOutlined />}
            onClick={() => handleRunNow(record.id)}
            disabled={!record.enabled}
          >
            立即执行
          </Button>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个自动分案规则吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0 }}>自动分案配置</h2>
          <p style={{ color: '#666', marginTop: 4 }}>配置入催案件的自动分配规则，将案件按规则分配给指定催收团队</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加分案规则
        </Button>
      </div>
      
      <Card>
        <Table
          columns={columns}
          dataSource={rules}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `共 ${total} 条`,
          }}
          size="small"
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 自动分案规则编辑模态框 */}
      <Modal
        title={editingRule ? '编辑自动分案规则' : '添加自动分案规则'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="规则名称"
            rules={[{ required: true, message: '请输入规则名称' }]}
          >
            <Input placeholder="请输入规则名称，如：消费贷M1阶段自动分案" />
          </Form.Item>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Form.Item
              name="products"
              label="产品类型"
              rules={[{ required: true, message: '请选择至少一个产品类型' }]}
            >
              <Select mode="multiple" placeholder="请选择产品类型">
                {products.map(product => (
                  <Select.Option key={product} value={product}>{product}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="overdueStage"
              label="逾期阶段"
              rules={[{ required: true, message: '请选择逾期阶段或自定义范围' }]}
            >
              <Select placeholder="请选择逾期阶段">
                {overdueStages.map(stage => (
                  <Select.Option key={stage} value={stage}>{stage}</Select.Option>
                ))}
                <Select.Option key="custom" value="custom">自定义范围</Select.Option>
              </Select>
            </Form.Item>
          </div>
          
          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.overdueStage !== currentValues.overdueStage}>
            {({ getFieldValue }) => {
              const overdueStage = getFieldValue('overdueStage');
              if (overdueStage === 'custom') {
                return (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    <Form.Item
                      name={['overdueStageRange', 'start']}
                      label="逾期阶段起始"
                      rules={[{ required: true, message: '请选择起始阶段' }]}
                    >
                      <Select placeholder="请选择起始阶段">
                        {overdueStages.map(stage => (
                          <Select.Option key={stage} value={stage}>{stage}</Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name={['overdueStageRange', 'end']}
                      label="逾期阶段结束"
                      rules={[{ required: true, message: '请选择结束阶段' }]}
                    >
                      <Select placeholder="请选择结束阶段">
                        {overdueStages.map(stage => (
                          <Select.Option key={stage} value={stage}>{stage}</Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                );
              }
              return null;
            }}
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Form.Item
              name="team"
              label="分配团队"
              rules={[{ required: true, message: '请选择分配团队' }]}
            >
              <Select placeholder="请选择分配团队">
                {teams.map(team => (
                  <Select.Option key={team} value={team}>{team}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="distributionMode"
              label="分配模式"
              rules={[{ required: true, message: '请选择分配模式' }]}
            >
              <Select placeholder="请选择分配模式">
                <Select.Option value="average">均分（平均分配）</Select.Option>
                <Select.Option value="roundRobin">轮询（轮流分配）</Select.Option>
                <Select.Option value="capacity">容量（按剩余容量分配）</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="collectors"
            label="分配催收员"
            rules={[{ required: true, message: '请选择分配催收员' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择分配催收员"
              options={allCollectors.map(collector => ({
                value: collector.value,
                label: `${collector.label} (${collector.team})`,
              }))}
            />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Form.Item
              name="priority"
              label="优先级"
              rules={[{ required: true, message: '请输入优先级' }]}
            >
              <InputNumber min={1} max={10} placeholder="优先级（1-10，数字越小优先级越高）" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="maxCasesPerCollector"
              label="每人最大案件数"
              rules={[{ required: true, message: '请输入每人最大案件数' }]}
            >
              <InputNumber min={1} max={200} placeholder="每人最大案件数" style={{ width: '100%' }} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default AutoAssignmentConfig;