import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, InputNumber, Select, Tag, message, Space, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import { useLanguage } from '../../i18n/LanguageContext';

interface ReductionRule {
  id: string;
  name: string;
  product: string;
  orderStatus: string;
  billStatus: string;
  overdueDaysMin: number;
  overdueDaysMax: number | null;
  originalAmountMin: number;
  originalAmountMax: number | null;
  reductionType: 'fixed' | 'percentage';
  principalReduction: number; // 本金减免比例或金额
  interestReduction: number; // 利息减免比例或金额
  serviceFeeReduction: number; // 服务费减免比例或金额
  penaltyReduction: number; // 罚息减免比例或金额
  maxReductionAmount: number;
  enabled: boolean;
  createTime: string;
  createBy: string;
}

const defaultRules: ReductionRule[] = [
  {
    id: '1',
    name: 'M1阶段小额减免',
    product: '消费贷',
    orderStatus: '逾期',
    billStatus: '逾期',
    overdueDaysMin: 1,
    overdueDaysMax: 30,
    originalAmountMin: 0,
    originalAmountMax: 10000,
    reductionType: 'fixed',
    principalReduction: 100,
    interestReduction: 50,
    serviceFeeReduction: 30,
    penaltyReduction: 20,
    maxReductionAmount: 500,
    enabled: true,
    createTime: '2024-03-01 10:00:00',
    createBy: '管理员',
  },
  {
    id: '2',
    name: 'M2阶段大额减免',
    product: '消费贷',
    orderStatus: '逾期',
    billStatus: '逾期',
    overdueDaysMin: 31,
    overdueDaysMax: 60,
    originalAmountMin: 10000,
    originalAmountMax: null,
    reductionType: 'percentage',
    principalReduction: 2,
    interestReduction: 10,
    serviceFeeReduction: 15,
    penaltyReduction: 20,
    maxReductionAmount: 2000,
    enabled: true,
    createTime: '2024-03-01 10:00:00',
    createBy: '管理员',
  },
  {
    id: '3',
    name: 'M3阶段特殊减免',
    product: '消费贷',
    orderStatus: '逾期',
    billStatus: '逾期',
    overdueDaysMin: 61,
    overdueDaysMax: null,
    originalAmountMin: 0,
    originalAmountMax: null,
    reductionType: 'fixed',
    principalReduction: 200,
    interestReduction: 150,
    serviceFeeReduction: 100,
    penaltyReduction: 50,
    maxReductionAmount: 5000,
    enabled: false,
    createTime: '2024-03-01 10:00:00',
    createBy: '管理员',
  },
];

const ReductionRuleConfig: React.FC = () => {
  const [rules, setRules] = useState<ReductionRule[]>(defaultRules);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState<ReductionRule | null>(null);
  const [form] = Form.useForm();
  const { t } = useLanguage();

  const handleAdd = () => {
    setEditingRule(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (rule: ReductionRule) => {
    setEditingRule(rule);
    form.setFieldsValue(rule);
    setModalVisible(true);
  };

  const handleDelete = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
    message.success('减免规则删除成功');
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingRule) {
        const updatedRules = rules.map(rule => 
          rule.id === editingRule.id 
            ? { ...rule, ...values, id: rule.id, createTime: rule.createTime, createBy: rule.createBy }
            : rule
        );
        setRules(updatedRules);
        message.success('减免规则编辑成功');
      } else {
        const newRule: ReductionRule = {
          id: (rules.length + 1).toString(),
          ...values,
          createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
          createBy: '当前用户', // 实际项目中应该从登录信息获取
        };
        setRules([...rules, newRule]);
        message.success('减免规则创建成功');
      }
      setModalVisible(false);
    });
  };

  const columns: ColumnsType<ReductionRule> = [
    {
      title: '规则名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '产品',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
    },
    {
      title: '账单状态',
      dataIndex: 'billStatus',
      key: 'billStatus',
    },
    {
      title: '逾期天数',
      dataIndex: ['overdueDaysMin', 'overdueDaysMax'],
      key: 'overdueDays',
      render: (_, record) => {
        if (record.overdueDaysMax === null) {
          return `${record.overdueDaysMin}+天`;
        }
        return `${record.overdueDaysMin}-${record.overdueDaysMax}天`;
      },
    },
    {
      title: '金额范围',
      dataIndex: ['originalAmountMin', 'originalAmountMax'],
      key: 'amountRange',
      render: (_, record) => {
        if (record.originalAmountMax === null) {
          return `¥${record.originalAmountMin.toLocaleString()}+`;
        }
        return `¥${record.originalAmountMin.toLocaleString()}-¥${record.originalAmountMax.toLocaleString()}`;
      },
    },
    {
      title: '本金减免',
      dataIndex: ['reductionType', 'principalReduction'],
      key: 'principalReduction',
      width: 120,
      render: (_, record) => {
        if (record.reductionType === 'fixed') {
          return `¥${record.principalReduction}`;
        }
        return `${record.principalReduction}%`;
      },
    },
    {
      title: '利息减免',
      dataIndex: ['reductionType', 'interestReduction'],
      key: 'interestReduction',
      width: 120,
      render: (_, record) => {
        if (record.reductionType === 'fixed') {
          return `¥${record.interestReduction}`;
        }
        return `${record.interestReduction}%`;
      },
    },
    {
      title: '服务费减免',
      dataIndex: ['reductionType', 'serviceFeeReduction'],
      key: 'serviceFeeReduction',
      width: 120,
      render: (_, record) => {
        if (record.reductionType === 'fixed') {
          return `¥${record.serviceFeeReduction}`;
        }
        return `${record.serviceFeeReduction}%`;
      },
    },
    {
      title: '罚息减免',
      dataIndex: ['reductionType', 'penaltyReduction'],
      key: 'penaltyReduction',
      width: 120,
      render: (_, record) => {
        if (record.reductionType === 'fixed') {
          return `¥${record.penaltyReduction}`;
        }
        return `${record.penaltyReduction}%`;
      },
    },
    {
      title: '最大减免',
      dataIndex: 'maxReductionAmount',
      key: 'maxReductionAmount',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean) => (
        <Tag color={enabled ? 'green' : 'red'}>
          {enabled ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个减免规则吗？"
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
        <h2 style={{ margin: 0 }}>减免规则配置</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加减免规则
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
        />
      </Card>

      {/* 减免规则编辑模态框 */}
      <Modal
        title={editingRule ? '编辑减免规则' : '添加减免规则'}
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
            <Input placeholder="请输入规则名称" />
          </Form.Item>
          <Form.Item
            name="product"
            label="产品"
            rules={[{ required: true, message: '请选择产品' }]}
          >
            <Select placeholder="请选择产品">
              <Select.Option value="消费贷">消费贷</Select.Option>
              <Select.Option value="经营贷">经营贷</Select.Option>
              <Select.Option value="房贷">房贷</Select.Option>
              <Select.Option value="车贷">车贷</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="orderStatus"
            label="订单状态"
            rules={[{ required: true, message: '请选择订单状态' }]}
          >
            <Select placeholder="请选择订单状态">
              <Select.Option value="逾期">逾期</Select.Option>
              <Select.Option value="正常">正常</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="billStatus"
            label="账单状态"
            rules={[{ required: true, message: '请选择账单状态' }]}
          >
            <Select placeholder="请选择账单状态">
              <Select.Option value="逾期">逾期</Select.Option>
              <Select.Option value="正常">正常</Select.Option>
            </Select>
          </Form.Item>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Form.Item
              name="overdueDaysMin"
              label="逾期天数（最小）"
              rules={[{ required: true, message: '请输入最小逾期天数' }]}
            >
              <InputNumber min={0} placeholder="最小逾期天数" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="overdueDaysMax"
              label="逾期天数（最大）"
            >
              <InputNumber min={0} placeholder="最大逾期天数（留空表示无上限）" style={{ width: '100%' }} />
            </Form.Item>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Form.Item
              name="originalAmountMin"
              label="金额范围（最小）"
              rules={[{ required: true, message: '请输入最小金额' }]}
            >
              <InputNumber min={0} placeholder="最小金额" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="originalAmountMax"
              label="金额范围（最大）"
            >
              <InputNumber min={0} placeholder="最大金额（留空表示无上限）" style={{ width: '100%' }} />
            </Form.Item>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Form.Item
              name="reductionType"
              label="减免方式"
              rules={[{ required: true, message: '请选择减免方式' }]}
            >
              <Select placeholder="请选择减免方式">
                <Select.Option value="fixed">固定金额</Select.Option>
                <Select.Option value="percentage">百分比</Select.Option>
              </Select>
            </Form.Item>
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <h4 style={{ marginBottom: 12, color: '#333' }}>减免明细</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Form.Item
                name="principalReduction"
                label="本金减免"
                rules={[{ required: true, message: '请输入本金减免' }]}
              >
                <InputNumber min={0} placeholder="本金减免" style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="interestReduction"
                label="利息减免"
                rules={[{ required: true, message: '请输入利息减免' }]}
              >
                <InputNumber min={0} placeholder="利息减免" style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="serviceFeeReduction"
                label="服务费减免"
                rules={[{ required: true, message: '请输入服务费减免' }]}
              >
                <InputNumber min={0} placeholder="服务费减免" style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="penaltyReduction"
                label="罚息减免"
                rules={[{ required: true, message: '请输入罚息减免' }]}
              >
                <InputNumber min={0} placeholder="罚息减免" style={{ width: '100%' }} />
              </Form.Item>
            </div>
            <p style={{ color: '#666', fontSize: '12px', marginTop: 8 }}>
              {form.getFieldValue('reductionType') === 'fixed' ? '单位：元' : '单位：%'}
            </p>
          </div>
          <Form.Item
            name="maxReductionAmount"
            label="最大减免金额"
            rules={[{ required: true, message: '请输入最大减免金额' }]}
          >
            <InputNumber min={0} placeholder="最大减免金额" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="enabled"
            label="状态"
          >
            <Select placeholder="请选择状态">
              <Select.Option value={true}>启用</Select.Option>
              <Select.Option value={false}>禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReductionRuleConfig;