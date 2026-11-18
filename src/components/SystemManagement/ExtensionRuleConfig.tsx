import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Modal, Form, Input, InputNumber, Select, Tag, message, Space, Popconfirm, Switch, Radio } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  extensionRuleStore,
  extensionProducts as products,
  EXTENSION_VALIDITY_DAYS_OPTIONS,
  DEFAULT_EXTENSION_DAYS,
  DEFAULT_EXTENSION_TIMES,
  FIXED_PENALTY_RATIO,
  isValidNumericCondition,
  matchesNumericCondition,
  numericConditionsOverlap,
  type ExtensionRule,
} from '../../data/extensionRules';

const installmentOptions = Array.from({ length: 12 }, (_, index) => {
  const installment = String(index + 1);
  return { value: installment, label: `第 ${installment} 期` };
});

// 生成规则code：EXT-RULE-XXX 递增
const generateRuleCode = (rules: ExtensionRule[]) => {
  const maxSeq = rules.reduce((max, rule) => {
    const matched = rule.code.match(/(\d+)$/);
    return matched ? Math.max(max, Number(matched[1])) : max;
  }, 0);
  return `EXT-RULE-${String(maxSeq + 1).padStart(3, '0')}`;
};

const getNumericConditionError = (values: string[] | undefined, minValue: number, label: string) => {
  if (!values || values.length === 0) return `请输入${label}`;
  const invalid = values.find(value => !isValidNumericCondition(value, minValue));
  return invalid
    ? `「${invalid}」格式不正确，请输入不小于 ${minValue} 的整数或区间（如 3、5-10），且区间起始值不能大于结束值`
    : null;
};

const ExtensionRuleConfig: React.FC = () => {
  const [rules, setRules] = useState<ExtensionRule[]>(extensionRuleStore.rules);

  // 写回共享数据源，供案件详情展期弹框读取
  const updateRules = (next: ExtensionRule[]) => {
    setRules(next);
    extensionRuleStore.rules = next;
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState<ExtensionRule | null>(null);
  const [form] = Form.useForm();

  // 查询条件
  const [keyword, setKeyword] = useState('');
  const [overdueDaysFilter, setOverdueDaysFilter] = useState<number | undefined>();
  const [appliedKeyword, setAppliedKeyword] = useState('');
  const [appliedOverdueDays, setAppliedOverdueDays] = useState<number | undefined>();

  const filteredRules = useMemo(() => {
    return rules.filter(rule => {
      if (appliedKeyword) {
        const kw = appliedKeyword.toLowerCase();
        if (!rule.name.toLowerCase().includes(kw) && !rule.code.toLowerCase().includes(kw)) return false;
      }
      if (appliedOverdueDays !== undefined && !matchesNumericCondition(appliedOverdueDays, rule.overdueDays)) return false;
      return true;
    });
  }, [rules, appliedKeyword, appliedOverdueDays]);

  const handleSearch = () => {
    setAppliedKeyword(keyword);
    setAppliedOverdueDays(overdueDaysFilter);
  };

  const handleReset = () => {
    setKeyword('');
    setOverdueDaysFilter(undefined);
    setAppliedKeyword('');
    setAppliedOverdueDays(undefined);
  };

  const handleAdd = () => {
    setEditingRule(null);
    form.resetFields();
    form.setFieldsValue({
      validityDays: 7,
      extensionDays: DEFAULT_EXTENSION_DAYS,
      extensionTimes: DEFAULT_EXTENSION_TIMES,
      enabled: true,
      feeRatio: { principal: 0, interest: 0, penalty: FIXED_PENALTY_RATIO },
    });
    setModalVisible(true);
  };

  const handleEdit = (rule: ExtensionRule) => {
    setEditingRule(rule);
    form.setFieldsValue({
      name: rule.name,
      products: rule.products,
      installments: rule.installments,
      overdueDays: rule.overdueDays,
      feeRatio: { ...rule.feeRatio, penalty: FIXED_PENALTY_RATIO },
      validityDays: rule.validityDays,
      extensionDays: rule.extensionDays,
      extensionTimes: rule.extensionTimes,
      enabled: rule.enabled,
    });
    setModalVisible(true);
  };

  const handleDelete = (ruleId: string) => {
    updateRules(rules.filter(rule => rule.id !== ruleId));
    message.success('规则删除成功');
  };

  // 列表内快捷启停，停用后该规则不参与案件匹配
  const handleToggleStatus = (ruleId: string, enabled: boolean) => {
    updateRules(rules.map(rule => (rule.id === ruleId ? { ...rule, enabled } : rule)));
    message.success(`规则已${enabled ? '启用' : '停用'}`);
  };

  // 校验：同一产品在逾期天数与期次均有交集时不允许重复配置
  const validateConflict = (values: any, currentId?: string) => {
    const {
      products: selectedProducts = [],
      overdueDays: selectedDays = [],
      installments: selectedInstallments = [],
    } = values;
    return rules.find(rule => {
      if (rule.id === currentId) return false;
      return (
        rule.products.some(product => selectedProducts.includes(product)) &&
        numericConditionsOverlap(rule.overdueDays, selectedDays) &&
        numericConditionsOverlap(rule.installments, selectedInstallments)
      );
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const conflict = validateConflict(values, editingRule?.id);
      if (conflict) {
        const conflictProducts = values.products.filter((p: string) => conflict.products.includes(p)).join('、');
        const conflictDays = values.overdueDays.filter((day: string) => numericConditionsOverlap([day], conflict.overdueDays)).join('、');
        const conflictInstallments = values.installments.filter((item: string) => numericConditionsOverlap([item], conflict.installments)).join('、');
        message.error(`产品「${conflictProducts}」在逾期天数「${conflictDays}」、期次「${conflictInstallments}」已与规则「${conflict.name}」存在交集，请调整后再保存`);
        return;
      }

      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

      // 利息比例已移除、罚息比例固定 100%，保存时统一归一化
      const normalizedValues = {
        ...values,
        feeRatio: {
          principal: values.feeRatio?.principal ?? 0,
          interest: 0,
          penalty: FIXED_PENALTY_RATIO,
        },
      };

      if (editingRule) {
        updateRules(
          rules.map(rule =>
            rule.id === editingRule.id
              ? { ...rule, ...normalizedValues, updatedAt: now }
              : rule
          )
        );
        message.success('规则修改成功');
      } else {
        const newRule: ExtensionRule = {
          id: Date.now().toString(),
          code: generateRuleCode(rules),
          ...normalizedValues,
          createdAt: now,
          updatedAt: now,
        };
        updateRules([...rules, newRule]);
        message.success(`规则新增成功，规则code：${newRule.code}`);
      }
      setModalVisible(false);
    } catch (error) {
      // 表单校验未通过，保持弹窗
    }
  };

  const columns: ColumnsType<ExtensionRule> = [
    {
      title: '规则名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '规则code',
      dataIndex: 'code',
      key: 'code',
      width: 150,
      render: (code: string) => (
        <span style={{ fontFamily: 'monospace', color: '#0d4f3c', backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: '4px' }}>
          {code}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 110,
      align: 'center',
      render: (enabled: boolean, record) => (
        <Switch
          checked={enabled}
          checkedChildren="启用"
          unCheckedChildren="停用"
          onChange={checked => handleToggleStatus(record.id, checked)}
        />
      ),
    },
    {
      title: '适用产品',
      dataIndex: 'products',
      key: 'products',
      width: 240,
      render: (value: string[]) => (
        <Space size={[4, 4]} wrap>
          {value.map(p => <Tag key={p} color="blue">{p}</Tag>)}
        </Space>
      ),
    },
    {
      title: '适用期次',
      dataIndex: 'installments',
      key: 'installments',
      width: 180,
      render: (installments: string[]) => (
        <Space size={[4, 4]} wrap>
          {installments.map(item => <Tag key={item} color="purple">第 {item} 期</Tag>)}
        </Space>
      ),
    },
    {
      title: '逾期天数',
      dataIndex: 'overdueDays',
      key: 'overdueDays',
      width: 200,
      render: (days: string[]) => (
        <Space size={[4, 4]} wrap>
          {days.map(day => <Tag key={day} color="orange">{day} 天</Tag>)}
        </Space>
      ),
    },
    {
      title: '本金比例',
      dataIndex: ['feeRatio', 'principal'],
      key: 'principal',
      width: 100,
      align: 'center',
      render: (value: number) => `${value}%`,
    },
    {
      title: '罚息比例',
      dataIndex: ['feeRatio', 'penalty'],
      key: 'penalty',
      width: 100,
      align: 'center',
      render: (value: number) => `${value}%`,
    },
    {
      title: '展期天数',
      dataIndex: 'extensionDays',
      key: 'extensionDays',
      width: 100,
      align: 'center',
      render: (value: number) => (
        <span>
          <span style={{ fontWeight: 600, color: '#0d4f3c' }}>{value}</span>
          <span style={{ color: '#6b7280', fontSize: 12 }}> 天</span>
        </span>
      ),
    },
    {
      title: '展期次数',
      dataIndex: 'extensionTimes',
      key: 'extensionTimes',
      width: 100,
      align: 'center',
      render: (value: number) => (
        <span>
          <span style={{ fontWeight: 600, color: '#0d4f3c' }}>{value}</span>
          <span style={{ color: '#6b7280', fontSize: 12 }}> 次</span>
        </span>
      ),
    },
    {
      title: 'APP入口有效期',
      dataIndex: 'validityDays',
      key: 'validityDays',
      width: 140,
      align: 'center',
      render: (value: number) => (
        <span>
          <span style={{ fontWeight: 600, color: '#0d4f3c' }}>{value}</span>
          <span style={{ color: '#6b7280', fontSize: 12 }}> 天</span>
        </span>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} style={{ padding: 0 }}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除该展期规则？"
            onConfirm={() => handleDelete(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />} style={{ padding: 0 }}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>展期规则配置</h2>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Space size="middle" wrap>
          <Input
            placeholder="规则名称 / 规则code"
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 240 }}
            allowClear
          />
          <InputNumber
            placeholder="逾期天数"
            value={overdueDaysFilter}
            onChange={value => setOverdueDaysFilter(value ?? undefined)}
            onPressEnter={handleSearch}
            min={0}
            precision={0}
            addonAfter="天"
            style={{ width: 160 }}
          />
          <Button type="primary" onClick={handleSearch}>查询</Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>重置</Button>
        </Space>
      </Card>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#6b7280', fontSize: 13 }}>
            同一产品的逾期天数与期次均存在交集时，不允许重复配置
          </span>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增展期规则
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={filteredRules}
          rowKey="id"
          size="small"
          scroll={{ x: 1950 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: total => `共 ${total} 条`,
          }}
        />
      </Card>

      <Modal
        title={editingRule ? '编辑展期规则' : '新增展期规则'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={620}
        okText="确认"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="规则名称"
            rules={[{ required: true, message: '请输入规则名称' }]}
          >
            <Input placeholder="请输入规则名称" maxLength={50} />
          </Form.Item>

          <Form.Item label="规则code">
            <Input
              value={editingRule ? editingRule.code : '保存后由系统自动生成'}
              disabled
              style={{ fontFamily: 'monospace', backgroundColor: '#f5f5f5', color: '#6b7280' }}
            />
          </Form.Item>

          <Form.Item
            name="enabled"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
            extra="停用后该规则不参与案件展期匹配，列表和案件详情均按启用规则生效"
          >
            <Radio.Group>
              <Radio value={true}>启用</Radio>
              <Radio value={false}>停用</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="products"
            label="适用产品"
            rules={[{ required: true, message: '请选择适用产品' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择适用产品（可多选）"
              options={products.map(p => ({ value: p, label: p }))}
              maxTagCount="responsive"
            />
          </Form.Item>

          <Form.Item
            name="installments"
            label="适用期次"
            extra="可选择第 1 期至第 12 期，支持多选"
            rules={[{ required: true, message: '请选择适用期次' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择适用期次（可多选）"
              options={installmentOptions}
              maxTagCount="responsive"
            />
          </Form.Item>

          <Form.Item
            name="overdueDays"
            label="逾期天数"
            extra="支持多个单值或区间，区间包含首尾天数，例如：1、3、5-10"
            rules={[
              { required: true, message: '请输入逾期天数' },
              {
                validator: (_, value: string[]) => {
                  const error = getNumericConditionError(value, 0, '逾期天数');
                  return error ? Promise.reject(new Error(error)) : Promise.resolve();
                },
              },
            ]}
          >
            <Select
              mode="tags"
              placeholder="输入逾期天数后回车，如 1、3、5-10"
              tokenSeparators={[',', '，', '、', ' ']}
              open={false}
              suffixIcon={null}
              maxTagCount="responsive"
            />
          </Form.Item>

          <div style={{ marginBottom: 8, fontWeight: 500 }}>展期费计算口径（按比例）</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name={['feeRatio', 'principal']}
              label="本金比例"
              rules={[{ required: true, message: '请输入本金比例' }]}
            >
              <InputNumber min={0} max={100} precision={2} addonAfter="%" style={{ width: '100%' }} placeholder="0" />
            </Form.Item>
            <Form.Item
              name={['feeRatio', 'penalty']}
              label="罚息比例"
              extra="罚息比例固定 100%，不支持修改"
            >
              <InputNumber
                min={FIXED_PENALTY_RATIO}
                max={FIXED_PENALTY_RATIO}
                precision={0}
                disabled
                addonAfter="%"
                style={{ width: '100%', backgroundColor: '#f5f5f5' }}
              />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Form.Item
              name="extensionDays"
              label="展期天数（天）"
              rules={[{ required: true, message: '请输入展期天数' }]}
              extra="首期账单顺延的天数"
            >
              <InputNumber
                min={1}
                max={365}
                precision={0}
                addonAfter="天"
                style={{ width: '100%' }}
                placeholder={`默认为 ${DEFAULT_EXTENSION_DAYS}`}
              />
            </Form.Item>
            <Form.Item
              name="extensionTimes"
              label="展期次数（次）"
              rules={[{ required: true, message: '请输入展期次数' }]}
              extra="允许申请展期的最大次数"
            >
              <InputNumber
                min={1}
                max={999}
                precision={0}
                addonAfter="次"
                style={{ width: '100%' }}
                placeholder={`默认为 ${DEFAULT_EXTENSION_TIMES}`}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="validityDays"
            label="APP 入口有效期（天）"
            rules={[{ required: true, message: '请输入 APP 入口有效期' }]}
            extra="控制 APP 端展期入口对用户开放的天数，同时在展期弹窗中提醒催员申请有效期"
          >
            <InputNumber
              min={1}
              max={90}
              precision={0}
              addonAfter="天"
              style={{ width: '100%' }}
              placeholder="请输入有效期天数"
            />
          </Form.Item>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {EXTENSION_VALIDITY_DAYS_OPTIONS.map(d => (
              <Button
                key={d}
                size="small"
                type="dashed"
                onClick={() => form.setFieldValue('validityDays', d)}
              >
                {d} 天
              </Button>
            ))}
          </div>

          <div style={{ fontSize: 12, color: '#9ca3af', lineHeight: '18px' }}>
            展期费按比例计算：本金 × 本金比例 + 罚息 × 100%（利息不计入展期费）。
            期次和逾期天数均支持单值与区间混合配置；同一产品的两个条件均存在交集时无法保存。
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ExtensionRuleConfig;
