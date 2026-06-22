import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, InputNumber, Select, Tag, message, Space, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import { useLanguage } from '../../i18n/LanguageContext';

interface ReductionRule {
  id: string;
  name: string;
  product: string;
  billStatus: string;
  overdueDaysMin: number;
  overdueDaysMax: number | null;
  reductionType: 'fixed' | 'percentage';
  principalReduction: number; // 本金减免比例或金额
  interestReduction: number; // 利息减免比例或金额
  serviceFeeReduction: number; // 服务费减免比例或金额
  penaltyReduction: number; // 罚息减免比例或金额
  enabled: boolean;
  createTime: string;
  createBy: string;
}

const defaultRules: ReductionRule[] = [
  {
    id: '1',
    name: 'M1阶段减免',
    product: '消费贷',
    billStatus: '逾期',
    overdueDaysMin: 1,
    overdueDaysMax: 30,
    reductionType: 'fixed',
    principalReduction: 100,
    interestReduction: 50,
    serviceFeeReduction: 30,
    penaltyReduction: 20,
    enabled: true,
    createTime: '2024-03-01 10:00:00',
    createBy: '管理员',
  },
  {
    id: '2',
    name: 'M2阶段减免',
    product: '消费贷',
    billStatus: '逾期',
    overdueDaysMin: 31,
    overdueDaysMax: 60,
    reductionType: 'percentage',
    principalReduction: 2,
    interestReduction: 10,
    serviceFeeReduction: 15,
    penaltyReduction: 20,
    enabled: true,
    createTime: '2024-03-01 10:00:00',
    createBy: '管理员',
  },
  {
    id: '3',
    name: 'M3阶段减免',
    product: '消费贷',
    billStatus: '逾期',
    overdueDaysMin: 61,
    overdueDaysMax: null,
    reductionType: 'fixed',
    principalReduction: 200,
    interestReduction: 150,
    serviceFeeReduction: 100,
    penaltyReduction: 50,
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
    form.setFieldsValue({ billStatus: '逾期' });
    setModalVisible(true);
  };

  const handleEdit = (rule: ReductionRule) => {
    setEditingRule(rule);
    form.setFieldsValue(rule);
    setModalVisible(true);
  };

  const handleDelete = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
    message.success(t.reductionRuleDeleted);
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
        message.success(t.reductionRuleEdited);
      } else {
        const newRule: ReductionRule = {
          id: (rules.length + 1).toString(),
          ...values,
          createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
          createBy: '当前用户', // 实际项目中应该从登录信息获取
        };
        setRules([...rules, newRule]);
        message.success(t.addSuccess);
      }
      setModalVisible(false);
    });
  };

  const columns: ColumnsType<ReductionRule> = [
    {
      title: t.ruleName,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t.product,
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: t.billStatus,
      dataIndex: 'billStatus',
      key: 'billStatus',
    },
    {
      title: t.overdueDays,
      dataIndex: ['overdueDaysMin', 'overdueDaysMax'],
      key: 'overdueDays',
      render: (_, record) => {
        if (record.overdueDaysMax === null) {
          return `${record.overdueDaysMin}+ ${t.day}`;
        }
        return `${record.overdueDaysMin}-${record.overdueDaysMax} ${t.day}`;
      },
    },
    {
      title: t.principalReduction,
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
      title: t.interestReduction,
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
      title: t.serviceFeeReduction,
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
      title: t.penaltyReduction,
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
      title: t.status,
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean) => (
        <Tag color={enabled ? 'green' : 'red'}>
          {enabled ? t.enabled : t.disabled}
        </Tag>
      ),
    },
    {
      title: t.createTime,
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: t.action,
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            {t.edit}
          </Button>
          <Popconfirm
            title={t.deleteConfirmTitle}
            onConfirm={() => handleDelete(record.id)}
            okText={t.confirm}
            cancelText={t.cancel}
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              {t.delete}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>{t.reductionRuleConfig}</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {t.addReductionRule}
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
        title={editingRule ? t.editReductionRule : t.addReductionRule}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label={t.ruleName}
            rules={[{ required: true, message: t.pleaseInputRuleName }]}
          >
            <Input placeholder={t.ruleName} />
          </Form.Item>
          <Form.Item
            name="product"
            label={t.product}
            rules={[{ required: true, message: t.pleaseSelectProduct }]}
          >
            <Select placeholder={t.pleaseSelectProduct}>
              <Select.Option value="消费贷">{t.consumerLoan}</Select.Option>
              <Select.Option value="经营贷">{t.businessLoan}</Select.Option>
              <Select.Option value="房贷">{t.homeLoan}</Select.Option>
              <Select.Option value="车贷">{t.carLoan}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="billStatus"
            label={t.billStatus}
            rules={[{ required: true, message: t.pleaseSelectBillStatus }]}
          >
            <Select placeholder={t.pleaseSelectBillStatus}>
              <Select.Option value="逾期">{t.isOverdue}</Select.Option>
              <Select.Option value="正常">{t.normalStatus}</Select.Option>
            </Select>
          </Form.Item>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Form.Item
              name="overdueDaysMin"
              label={t.minOverdueDays}
              rules={[{ required: true, message: t.pleaseInputMinOverdueDays }]}
            >
              <InputNumber min={0} placeholder={t.minOverdueDays} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="overdueDaysMax"
              label={t.maxOverdueDays}
            >
              <InputNumber min={0} placeholder={t.maxOverdueDays} style={{ width: '100%' }} />
            </Form.Item>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Form.Item
              name="reductionType"
              label={t.reductionMethod}
              rules={[{ required: true, message: t.pleaseSelectReductionMethod }]}
            >
              <Select placeholder={t.reductionMethod}>
                <Select.Option value="fixed">{t.fixedAmount}</Select.Option>
                <Select.Option value="percentage">{t.percentage}</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div style={{ marginBottom: 16 }}>
            <h4 style={{ marginBottom: 12, color: '#333' }}>{t.reductionDetails}</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Form.Item
                name="principalReduction"
                label={t.principalReduction}
                rules={[{ required: true, message: t.pleaseInputPrincipalReduction }]}
              >
                <InputNumber min={0} placeholder={t.principalReduction} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="interestReduction"
                label={t.interestReduction}
                rules={[{ required: true, message: t.pleaseInputInterestReduction }]}
              >
                <InputNumber min={0} placeholder={t.interestReduction} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="serviceFeeReduction"
                label={t.serviceFeeReduction}
                rules={[{ required: true, message: t.pleaseInputServiceFeeReduction }]}
              >
                <InputNumber min={0} placeholder={t.serviceFeeReduction} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item
                name="penaltyReduction"
                label={t.penaltyReduction}
                rules={[{ required: true, message: t.pleaseInputPenaltyReduction }]}
              >
                <InputNumber min={0} placeholder={t.penaltyReduction} style={{ width: '100%' }} />
              </Form.Item>
            </div>
            <p style={{ color: '#666', fontSize: '12px', marginTop: 8 }}>
              {form.getFieldValue('reductionType') === 'fixed' ? t.unitCurrency : t.unitPercent}
            </p>
          </div>
          <Form.Item
            name="enabled"
            label={t.status}
          >
            <Select placeholder={t.pleaseSelect}>
              <Select.Option value={true}>{t.enabled}</Select.Option>
              <Select.Option value={false}>{t.disabled}</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReductionRuleConfig;
