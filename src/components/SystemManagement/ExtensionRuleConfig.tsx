import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Modal, Form, Input, InputNumber, Select, Tag, message, Space, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  extensionRuleStore,
  extensionProducts as products,
  extensionOverdueStages as overdueStages,
  EXTENSION_VALIDITY_DAYS_OPTIONS,
  DEFAULT_EXTENSION_DAYS,
  DEFAULT_EXTENSION_TIMES,
  FIXED_PENALTY_RATIO,
  type ExtensionRule,
} from '../../data/extensionRules';

// 生成规则code：EXT-RULE-XXX 递增
const generateRuleCode = (rules: ExtensionRule[]) => {
  const maxSeq = rules.reduce((max, rule) => {
    const matched = rule.code.match(/(\d+)$/);
    return matched ? Math.max(max, Number(matched[1])) : max;
  }, 0);
  return `EXT-RULE-${String(maxSeq + 1).padStart(3, '0')}`;
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
  const [stageFilter, setStageFilter] = useState<string | undefined>();
  const [appliedKeyword, setAppliedKeyword] = useState('');
  const [appliedStage, setAppliedStage] = useState<string | undefined>();

  const filteredRules = useMemo(() => {
    return rules.filter(rule => {
      if (appliedKeyword) {
        const kw = appliedKeyword.toLowerCase();
        if (!rule.name.toLowerCase().includes(kw) && !rule.code.toLowerCase().includes(kw)) return false;
      }
      if (appliedStage && !rule.overdueStages.includes(appliedStage)) return false;
      return true;
    });
  }, [rules, appliedKeyword, appliedStage]);

  const handleSearch = () => {
    setAppliedKeyword(keyword);
    setAppliedStage(stageFilter);
  };

  const handleReset = () => {
    setKeyword('');
    setStageFilter(undefined);
    setAppliedKeyword('');
    setAppliedStage(undefined);
  };

  const handleAdd = () => {
    setEditingRule(null);
    form.resetFields();
    form.setFieldsValue({
      validityDays: 7,
      extensionDays: DEFAULT_EXTENSION_DAYS,
      extensionTimes: DEFAULT_EXTENSION_TIMES,
      feeRatio: { principal: 0, interest: 0, penalty: FIXED_PENALTY_RATIO },
    });
    setModalVisible(true);
  };

  const handleEdit = (rule: ExtensionRule) => {
    setEditingRule(rule);
    form.setFieldsValue({
      name: rule.name,
      products: rule.products,
      overdueStages: rule.overdueStages,
      feeRatio: { ...rule.feeRatio, penalty: FIXED_PENALTY_RATIO },
      validityDays: rule.validityDays,
      extensionDays: rule.extensionDays,
      extensionTimes: rule.extensionTimes,
    });
    setModalVisible(true);
  };

  const handleDelete = (ruleId: string) => {
    updateRules(rules.filter(rule => rule.id !== ruleId));
    message.success('规则删除成功');
  };

  // 校验：同一产品的同一逾期阶段只允许存在一个规则（逾期阶段支持多选）
  const validateConflict = (values: any, currentId?: string) => {
    const { products: selectedProducts = [], overdueStages: selectedStages = [] } = values;
    const conflict = rules.find(rule => {
      if (rule.id === currentId) return false;
      const stageOverlap = rule.overdueStages.some(stage => selectedStages.includes(stage));
      if (!stageOverlap) return false;
      return rule.products.some(p => selectedProducts.includes(p));
    });
    return conflict;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const conflict = validateConflict(values, editingRule?.id);
      if (conflict) {
        const conflictProducts = values.products.filter((p: string) => conflict.products.includes(p)).join('、');
        const conflictStages = values.overdueStages.filter((s: string) => conflict.overdueStages.includes(s)).join('、');
        message.error(`产品「${conflictProducts}」在 ${conflictStages} 阶段已存在规则「${conflict.name}」，同一产品同一阶段不允许重复配置`);
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
      title: '逾期阶段',
      dataIndex: 'overdueStages',
      key: 'overdueStages',
      width: 160,
      render: (stages: string[]) => (
        <Space size={[4, 4]} wrap>
          {stages.map(stage => <Tag key={stage} color="orange">{stage}</Tag>)}
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
          <Select
            placeholder="逾期阶段"
            value={stageFilter}
            onChange={setStageFilter}
            allowClear
            style={{ width: 160 }}
            options={overdueStages.map(stage => ({ value: stage, label: stage }))}
          />
          <Button type="primary" onClick={handleSearch}>查询</Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>重置</Button>
        </Space>
      </Card>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#6b7280', fontSize: 13 }}>
            同一产品的任一逾期阶段仅允许存在一个规则（逾期阶段支持多选）
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
          scroll={{ x: 1600 }}
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
            name="overdueStages"
            label="逾期阶段"
            rules={[{ required: true, message: '请选择逾期阶段' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择逾期阶段（可多选）"
              options={overdueStages.map(stage => ({ value: stage, label: stage }))}
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
            逾期阶段支持多选；同一产品的任一阶段仅允许存在一个规则，重复配置将无法保存。
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ExtensionRuleConfig;
