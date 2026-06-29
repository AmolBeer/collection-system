import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, InputNumber, Select, Tag, message, Space, Popconfirm, Tabs } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useLanguage } from '../../i18n/LanguageContext';
import { ReductionRule, SpecialReductionRule } from '../../types';

const products = [
  { value: '消费贷', label: '消费贷' },
  { value: '经营贷', label: '经营贷' },
  { value: '房贷', label: '房贷' },
  { value: '车贷', label: '车贷' },
];

const defaultRules: ReductionRule[] = [
  {
    id: '1',
    name: '产品A-结清-30天',
    products: ['消费贷'],
    overdueDays: 30,
    settlementType: 'settle',
    subjectCaps: { principal: 0, interest: 50, penalty: 100 },
    enabled: true,
    createTime: '2024-03-01 10:00:00',
    createBy: '管理员',
    updateTime: '2024-03-01 10:00:00',
    updateBy: '管理员',
  },
  {
    id: '2',
    name: '产品A-结清-90天',
    products: ['消费贷'],
    overdueDays: 90,
    settlementType: 'settle',
    subjectCaps: { principal: 10, interest: 70, penalty: 100 },
    enabled: true,
    createTime: '2024-03-01 10:00:00',
    createBy: '管理员',
    updateTime: '2024-03-01 10:00:00',
    updateBy: '管理员',
  },
  {
    id: '3',
    name: '产品A-非结清-30天',
    products: ['消费贷'],
    overdueDays: 30,
    settlementType: 'nonSettle',
    subjectCaps: { principal: 0, interest: 30, penalty: 50 },
    enabled: true,
    createTime: '2024-03-01 10:00:00',
    createBy: '管理员',
    updateTime: '2024-03-01 10:00:00',
    updateBy: '管理员',
  },
  {
    id: '4',
    name: '产品B-结清-30天',
    products: ['经营贷'],
    overdueDays: 30,
    settlementType: 'settle',
    subjectCaps: { principal: 0, interest: 40, penalty: 80 },
    enabled: true,
    createTime: '2024-03-05 14:00:00',
    createBy: '管理员',
    updateTime: '2024-03-05 14:00:00',
    updateBy: '管理员',
  },
  {
    id: '5',
    name: '产品B-结清-90天',
    products: ['经营贷'],
    overdueDays: 90,
    settlementType: 'settle',
    subjectCaps: { principal: 5, interest: 60, penalty: 100 },
    enabled: false,
    createTime: '2024-03-05 14:00:00',
    createBy: '管理员',
    updateTime: '2024-03-05 14:00:00',
    updateBy: '管理员',
  },
];

const defaultSpecialRules: SpecialReductionRule[] = [
  {
    id: 'SR1',
    name: '重大投诉息费全免',
    products: ['消费贷', '经营贷'],
    description: '客户重大投诉后给予的特殊减免，可减免全部利息和罚息',
    enabled: true,
    createTime: '2024-03-10 09:00:00',
    createBy: '管理员',
    updateTime: '2024-03-10 09:00:00',
    updateBy: '管理员',
  },
  {
    id: 'SR2',
    name: '法律诉讼和解减免',
    products: ['消费贷', '经营贷', '房贷'],
    description: '通过法律诉讼达成和解后的本金减免',
    enabled: true,
    createTime: '2024-03-12 11:00:00',
    createBy: '管理员',
    updateTime: '2024-03-12 11:00:00',
    updateBy: '管理员',
  },
];

const ReductionRuleConfig: React.FC = () => {
  const [rules, setRules] = useState<ReductionRule[]>(defaultRules);
  const [specialRules, setSpecialRules] = useState<SpecialReductionRule[]>(defaultSpecialRules);
  const [modalVisible, setModalVisible] = useState(false);
  const [specialModalVisible, setSpecialModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState<ReductionRule | null>(null);
  const [editingSpecialRule, setEditingSpecialRule] = useState<SpecialReductionRule | null>(null);
  const [form] = Form.useForm();
  const [specialForm] = Form.useForm();
  const { t } = useLanguage();

  const handleAdd = () => {
    setEditingRule(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (rule: ReductionRule) => {
    setEditingRule(rule);
    form.setFieldsValue({
      ...rule,
      subjectCaps: rule.subjectCaps,
    });
    setModalVisible(true);
  };

  const handleDelete = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId));
    message.success(t.reductionRuleDeleted);
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      
      if (editingRule) {
        const updatedRules = rules.map(rule =>
          rule.id === editingRule.id
            ? { 
                ...rule, 
                ...values, 
                updateTime: now,
                updateBy: '当前用户'
              }
            : rule
        );
        setRules(updatedRules);
        message.success(t.reductionRuleEdited);
      } else {
        const newRule: ReductionRule = {
          id: Date.now().toString(),
          ...values,
          createTime: now,
          createBy: '当前用户',
          updateTime: now,
          updateBy: '当前用户',
        };
        setRules([...rules, newRule]);
        message.success(t.addSuccess);
      }
      setModalVisible(false);
    });
  };

  const handleAddSpecial = () => {
    setEditingSpecialRule(null);
    specialForm.resetFields();
    setSpecialModalVisible(true);
  };

  const handleEditSpecial = (rule: SpecialReductionRule) => {
    setEditingSpecialRule(rule);
    specialForm.setFieldsValue(rule);
    setSpecialModalVisible(true);
  };

  const handleDeleteSpecial = (ruleId: string) => {
    setSpecialRules(specialRules.filter(rule => rule.id !== ruleId));
    message.success(t.reductionRuleDeleted);
  };

  const handleSubmitSpecial = () => {
    specialForm.validateFields().then(values => {
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      
      if (editingSpecialRule) {
        const updatedRules = specialRules.map(rule =>
          rule.id === editingSpecialRule.id
            ? { 
                ...rule, 
                ...values, 
                updateTime: now,
                updateBy: '当前用户'
              }
            : rule
        );
        setSpecialRules(updatedRules);
        message.success(t.reductionRuleEdited);
      } else {
        const newRule: SpecialReductionRule = {
          id: 'SR' + Date.now(),
          ...values,
          createTime: now,
          createBy: '当前用户',
          updateTime: now,
          updateBy: '当前用户',
        };
        setSpecialRules([...specialRules, newRule]);
        message.success(t.addSuccess);
      }
      setSpecialModalVisible(false);
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
      dataIndex: 'products',
      key: 'products',
      render: (products: string[]) => (
        <Space wrap>
          {products.map(p => (
            <Tag key={p} color="blue">{p}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: t.overdueDays,
      dataIndex: 'overdueDays',
      key: 'overdueDays',
      width: 140,
      render: (value: number) => `${value} ${t.day}`,
    },
    {
      title: t.settlementType,
      dataIndex: 'settlementType',
      key: 'settlementType',
      width: 120,
      render: (type: string) => (
        <Tag color={type === 'settle' ? 'green' : 'orange'}>
          {type === 'settle' ? t.settleRule : t.nonSettleRule}
        </Tag>
      ),
    },
    {
      title: t.principalReduction,
      dataIndex: ['subjectCaps', 'principal'],
      key: 'principalCap',
      width: 120,
      align: 'center',
      render: (value: number) => `${value}%`,
    },
    {
      title: t.interestReduction,
      dataIndex: ['subjectCaps', 'interest'],
      key: 'interestCap',
      width: 120,
      align: 'center',
      render: (value: number) => `${value}%`,
    },
    {
      title: t.penaltyReduction,
      dataIndex: ['subjectCaps', 'penalty'],
      key: 'penaltyCap',
      width: 120,
      align: 'center',
      render: (value: number) => `${value}%`,
    },
    {
      title: t.status,
      dataIndex: 'enabled',
      key: 'enabled',
      width: 80,
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
      width: 180,
    },
    {
      title: t.action,
      key: 'action',
      width: 120,
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

  const specialColumns: ColumnsType<SpecialReductionRule> = [
    {
      title: t.ruleName,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t.product,
      dataIndex: 'products',
      key: 'products',
      render: (products: string[]) => (
        <Space wrap>
          {products.map(p => (
            <Tag key={p} color="purple">{p}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: t.description,
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: t.status,
      dataIndex: 'enabled',
      key: 'enabled',
      width: 80,
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
      width: 180,
    },
    {
      title: t.action,
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditSpecial(record)}
          >
            {t.edit}
          </Button>
          <Popconfirm
            title={t.deleteConfirmTitle}
            onConfirm={() => handleDeleteSpecial(record.id)}
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
      </div>

      <Tabs defaultActiveKey="normal" items={[
        {
          key: 'normal',
          label: t.normalReductionRule,
          children: (
            <div>
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
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
            </div>
          ),
        },
        {
          key: 'special',
          label: t.specialReductionRule,
          children: (
            <div>
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddSpecial}>
                  {t.addSpecialReductionRule}
                </Button>
              </div>
              <Card>
                <Table
                  columns={specialColumns}
                  dataSource={specialRules}
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
            </div>
          ),
        },
      ]} />

      <Modal
        title={editingRule ? t.editReductionRule : t.addReductionRule}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={650}
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
            name="products"
            label={t.product}
            rules={[{ required: true, message: t.selectProduct }]}
          >
            <Select mode="multiple" placeholder={t.selectProduct}>
              {products.map(p => (
                <Select.Option key={p.value} value={p.value}>{p.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="overdueDays"
            label={t.overdueDays}
            rules={[{ required: true, message: t.pleaseInputOverdueDays }]}
          >
            <InputNumber min={0} placeholder={t.overdueDays} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="settlementType"
            label={t.settlementType}
            rules={[{ required: true, message: t.pleaseSelectSettlementType }]}
          >
            <Select placeholder={t.pleaseSelectSettlementType}>
              <Select.Option value="settle">{t.settleRule}</Select.Option>
              <Select.Option value="nonSettle">{t.nonSettleRule}</Select.Option>
            </Select>
          </Form.Item>

          <div style={{ marginBottom: 16 }}>
            <h4 style={{ marginBottom: 12, color: '#333' }}>{t.reductionDetails}</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <Form.Item
                name={['subjectCaps', 'principal']}
                label={t.principalReduction}
                rules={[{ required: true, message: t.pleaseInputPrincipalReduction }]}
              >
                <InputNumber min={0} max={100} placeholder={t.principalReduction} style={{ width: '100%' }} suffix="%" />
              </Form.Item>
              <Form.Item
                name={['subjectCaps', 'interest']}
                label={t.interestReduction}
                rules={[{ required: true, message: t.pleaseInputInterestReduction }]}
              >
                <InputNumber min={0} max={100} placeholder={t.interestReduction} style={{ width: '100%' }} suffix="%" />
              </Form.Item>
              <Form.Item
                name={['subjectCaps', 'penalty']}
                label={t.penaltyReduction}
                rules={[{ required: true, message: t.pleaseInputPenaltyReduction }]}
              >
                <InputNumber min={0} max={100} placeholder={t.penaltyReduction} style={{ width: '100%' }} suffix="%" />
              </Form.Item>
            </div>
          </div>
          <Form.Item
            name="enabled"
            label={t.status}
            initialValue={true}
          >
            <Select placeholder={t.pleaseSelect}>
              <Select.Option value={true}>{t.enabled}</Select.Option>
              <Select.Option value={false}>{t.disabled}</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingSpecialRule ? t.editSpecialReductionRule : t.addSpecialReductionRule}
        open={specialModalVisible}
        onOk={handleSubmitSpecial}
        onCancel={() => setSpecialModalVisible(false)}
        width={600}
      >
        <Form form={specialForm} layout="vertical">
          <Form.Item
            name="name"
            label={t.ruleName}
            rules={[{ required: true, message: t.pleaseInputRuleName }]}
          >
            <Input placeholder={t.ruleName} />
          </Form.Item>
          <Form.Item
            name="products"
            label={t.product}
            rules={[{ required: true, message: t.selectProduct }]}
          >
            <Select mode="multiple" placeholder={t.selectProduct}>
              {products.map(p => (
                <Select.Option key={p.value} value={p.value}>{p.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label={t.description}
            rules={[{ required: true, message: t.pleaseInputDescription }]}
          >
            <Input.TextArea rows={4} placeholder={t.description} />
          </Form.Item>
          <Form.Item
            name="enabled"
            label={t.status}
            initialValue={true}
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
