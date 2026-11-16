import React, { useState, useMemo } from 'react';
import { Table, Button, Modal, Form, Select, Input, message, Space, Tag, Popconfirm, Card, Row, Col, InputNumber, Checkbox } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useLanguage } from '../../i18n/LanguageContext';

// 催收小组分案比例
interface GroupAllocation {
  group: string;
  ratio: number; // 分案比例（%）
}

interface AutoAllocationRule {
  id: string;
  ruleName: string;
  products: string[];
  overdueStage: string;
  overdueStageRange: { start: string; end: string } | null;
  groupAllocations: GroupAllocation[];
  allocationType: 'average' | 'loadBalance' | 'random';
  priority: number;
  maxCasesPerCollector: number | null;
  startTime: string;
  endTime: string | null;
  status: 'active' | 'inactive';
  createTime: string;
  updateTime: string;
}

const defaultRules: AutoAllocationRule[] = [
  {
    id: '1',
    ruleName: '个人贷款M1阶段分配规则',
    products: ['个人贷款'],
    overdueStage: 'M1',
    overdueStageRange: null,
    groupAllocations: [
      { group: '催收一组', ratio: 60 },
      { group: '催收二组', ratio: 40 },
    ],
    allocationType: 'average',
    priority: 1,
    maxCasesPerCollector: 50,
    startTime: '09:00',
    endTime: '18:00',
    status: 'active',
    createTime: '2024-04-01 10:00:00',
    updateTime: '2024-04-05 14:30:00',
  },
  {
    id: '2',
    ruleName: '企业贷款M1-M3阶段分配规则',
    products: ['企业贷款', '个人贷款'],
    overdueStage: 'custom',
    overdueStageRange: { start: 'M1', end: 'M3' },
    groupAllocations: [
      { group: '催收三组', ratio: 50 },
      { group: '催收四组', ratio: 30 },
      { group: 'VIP催收组', ratio: 20 },
    ],
    allocationType: 'loadBalance',
    priority: 2,
    maxCasesPerCollector: 30,
    startTime: '08:30',
    endTime: '17:30',
    status: 'active',
    createTime: '2024-04-02 11:00:00',
    updateTime: '2024-04-06 09:15:00',
  },
];

const products = ['个人贷款', '企业贷款', '信用卡', '消费金融', '其他'];
const overdueStages = ['M0', 'M1', 'M2', 'M3', 'M4+'];
const collectorGroups = ['催收一组', '催收二组', '催收三组', '催收四组', 'VIP催收组'];
const allocationTypes = [
  { value: 'average', label: '均分' },
  { value: 'loadBalance', label: '负载均衡' },
  { value: 'random', label: '随机分配' },
];

const stageColors: Record<string, string> = {
  'M0': 'green',
  'M1': 'blue',
  'M2': 'orange',
  'M3': 'red',
  'M4+': 'purple',
};

const AutoAllocationManagement: React.FC = () => {
  const { t } = useLanguage();
  const [rules, setRules] = useState<AutoAllocationRule[]>(defaultRules);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState<AutoAllocationRule | null>(null);
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useState({
    product: '',
    status: '',
    keyword: '',
  });
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  // 各催收小组的分案比例输入值
  const [ratioInputs, setRatioInputs] = useState<Record<string, number | null>>({});

  const filteredRules = useMemo(() => {
    return rules.filter(rule => {
      const matchProduct = !searchParams.product || rule.products.includes(searchParams.product);
      const matchStatus = !searchParams.status || rule.status === searchParams.status;
      const matchKeyword = !searchParams.keyword || 
        rule.ruleName.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
        rule.products.some(p => p.toLowerCase().includes(searchParams.keyword.toLowerCase())) ||
        rule.groupAllocations.some(g => g.group.toLowerCase().includes(searchParams.keyword.toLowerCase()));
      return matchProduct && matchStatus && matchKeyword;
    });
  }, [rules, searchParams]);

  const productList = useMemo(() => {
    const productsSet = new Set(rules.flatMap(rule => rule.products));
    return Array.from(productsSet);
  }, [rules]);

  const filteredRulesByProduct = useMemo(() => {
    if (!selectedProduct) {
      return filteredRules;
    }
    return filteredRules.filter(rule => rule.products.includes(selectedProduct));
  }, [filteredRules, selectedProduct]);

  const handleAdd = () => {
    form.resetFields();
    setEditingRule(null);
    setRatioInputs({});
    setModalVisible(true);
  };

  const handleEdit = (record: AutoAllocationRule) => {
    form.setFieldsValue({
      ...record,
      collectorGroups: record.groupAllocations.map(g => g.group),
    });
    setRatioInputs(
      record.groupAllocations.reduce((acc, g) => ({ ...acc, [g.group]: g.ratio }), {} as Record<string, number | null>)
    );
    setEditingRule(record);
    setModalVisible(true);
  };

  // 小组选择变化时，保留已有比例，新增小组默认空值
  const syncRatioInputs = (groups: string[] = []) => {
    setRatioInputs(prev => {
      const next: Record<string, number | null> = {};
      groups.forEach(group => {
        next[group] = prev[group] ?? null;
      });
      return next;
    });
  };

  const handleDelete = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
    message.success('删除成功');
  };

  const handleToggleStatus = (id: string) => {
    setRules(rules.map(r => 
      r.id === id ? { ...r, status: r.status === 'active' ? 'inactive' : 'active' } : r
    ));
    message.success('状态更新成功');
  };

  const validateDuplicateRule = (values: any): Promise<void> => {
    const { products, overdueStage } = values;
    
    const exists = rules.some(r => 
      r.id !== editingRule?.id && 
      r.overdueStage === overdueStage &&
      products.some((p: string) => r.products.includes(p))
    );
    
    if (exists) {
      return Promise.reject(new Error(`已存在相同产品和逾期阶段【${overdueStage}】的分案规则`));
    }
    return Promise.resolve();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      // 校验小组分案比例：必填且合计必须为 100%
      const selectedGroups: string[] = values.collectorGroups || [];
      const groupAllocations: GroupAllocation[] = selectedGroups.map(group => ({
        group,
        ratio: ratioInputs[group] as number,
      }));
      const missingRatio = groupAllocations.some(g => g.ratio === null || g.ratio === undefined);
      if (missingRatio) {
        message.error('请为每个已选催收小组填写分案比例');
        return;
      }
      const totalRatio = groupAllocations.reduce((sum, g) => sum + Number(g.ratio), 0);
      if (Math.abs(totalRatio - 100) > 0.001) {
        message.error(`各小组分案比例之和必须为 100%，当前合计 ${totalRatio}%，请调整后再保存`);
        return;
      }

      const processedValues = {
        ...values,
        groupAllocations,
        overdueStageRange: values.overdueStage === 'custom' ? values.overdueStageRange : null,
      };
      delete processedValues.collectorGroups;

      await validateDuplicateRule(processedValues);
      
      if (editingRule) {
        setRules(rules.map(r => 
          r.id === editingRule.id ? { ...r, ...processedValues, updateTime: new Date().toLocaleString('zh-CN') } : r
        ));
        message.success('修改成功');
      } else {
        const newRule: AutoAllocationRule = {
          ...processedValues,
          id: Date.now().toString(),
          status: 'active',
          createTime: new Date().toLocaleString('zh-CN'),
          updateTime: new Date().toLocaleString('zh-CN'),
        };
        setRules([...rules, newRule]);
        message.success('添加成功');
      }
      setModalVisible(false);
      form.resetFields();
    } catch (error: any) {
      console.error('Form submission failed:', error);
      if (error.message) {
        message.error(error.message);
      } else {
        message.error('提交失败，请检查表单填写是否完整');
      }
    }
  };

  const handleModalOk = () => {
    handleSave();
  };

  const columns: ColumnsType<AutoAllocationRule> = [
    {
      title: t.ruleName,
      dataIndex: 'ruleName',
      key: 'ruleName',
      width: 180,
    },
    {
      title: t.productType,
      dataIndex: 'products',
      key: 'products',
      width: 150,
      render: (products: string[]) => (
        <Space size="small">
          {products.map(product => (
            <Tag key={product} color="blue">{product}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: t.overdueStage,
      dataIndex: 'overdueStage',
      key: 'overdueStage',
      width: 100,
      render: (stage: string, record: AutoAllocationRule) => {
        if (stage === 'custom' && record.overdueStageRange) {
          return <Tag color="orange">{record.overdueStageRange.start}-{record.overdueStageRange.end}</Tag>;
        }
        return <Tag color={stageColors[stage] || 'default'}>{stage}</Tag>;
      },
    },
    {
      title: t.groupAllocationRatio,
      dataIndex: 'groupAllocations',
      key: 'groupAllocations',
      width: 240,
      render: (groupAllocations: GroupAllocation[]) => (
        <Space size={[4, 4]} wrap>
          {groupAllocations.map(g => (
            <Tag key={g.group} color="blue">{g.group} {g.ratio}%</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: t.allocationTeam,
      dataIndex: 'allocationType',
      key: 'allocationType',
      width: 100,
      render: (type: string) => {
        const typeMap: Record<string, string> = {
          'average': t.average,
          'loadBalance': t.loadBalance,
          'random': t.random,
        };
        return typeMap[type] || type;
      },
    },
    {
      title: t.priority || 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      render: (priority: number) => (
        <Tag color={priority <= 2 ? 'red' : priority <= 5 ? 'orange' : 'green'}>
          {priority}
        </Tag>
      ),
    },
    {
      title: t.maxPerCollector,
      dataIndex: 'maxCasesPerCollector',
      key: 'maxCasesPerCollector',
      width: 120,
      render: (count: number | null | undefined) => count !== null && count !== undefined ? `${count}` : '-',
    },
    {
      title: t.timeRange,
      key: 'timeRange',
      width: 140,
      render: (_, record) => `${record.startTime} - ${record.endTime || '-'}`,
    },
    {
      title: t.status,
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? t.enabled : t.disabled}
        </Tag>
      ),
    },
    {
      title: t.action || 'Action',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title={record.status === 'active' ? '确定要禁用该规则吗？' : '确定要启用该规则吗？'}
            onConfirm={() => handleToggleStatus(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="link" 
              size="small" 
            >
              {record.status === 'active' ? '禁用' : '启用'}
            </Button>
          </Popconfirm>
          <Popconfirm
            title="确定要删除该规则吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="link" 
              size="small" 
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
        <h3 style={{ margin: 0 }}>自动分案规则管理</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加规则
        </Button>
      </div>
      
      <Card variant="borderless">
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Input
              placeholder="搜索规则名称"
              prefix={<SearchOutlined />}
              value={searchParams.keyword}
              onChange={(e) => setSearchParams({ ...searchParams, keyword: e.target.value })}
              allowClear
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="选择产品类型"
              options={[{ value: '', label: '全部' }, ...products.map(p => ({ value: p, label: p }))]}
              value={searchParams.product}
              onChange={(value) => setSearchParams({ ...searchParams, product: value })}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="选择状态"
              options={[
                { value: '', label: '全部' },
                { value: 'active', label: '启用' },
                { value: 'inactive', label: '禁用' },
              ]}
              value={searchParams.status}
              onChange={(value) => setSearchParams({ ...searchParams, status: value })}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
        
        <div style={{ marginBottom: 16 }}>
          <span style={{ marginRight: 8, fontSize: 14, fontWeight: 500 }}>产品维度：</span>
          <Space size="small">
            {productList.length > 0 ? (
              productList.map(product => (
                <Button
                  key={product}
                  type={selectedProduct === product ? 'primary' : 'default'}
                  onClick={() => setSelectedProduct(selectedProduct === product ? '' : product)}
                >
                  {product}
                  <span style={{ marginLeft: 4, fontSize: 12, color: '#999' }}>
                    ({rules.filter(r => r.products.includes(product)).length})
                  </span>
                </Button>
              ))
            ) : (
              <span style={{ color: '#999' }}>暂无产品</span>
            )}
          </Space>
        </div>
        
        {filteredRulesByProduct.length > 0 ? (
          <div>
            {selectedProduct && (
              <div style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
                <span style={{ fontWeight: 'bold', fontSize: 14 }}>{selectedProduct}</span>
                <span style={{ marginLeft: 8, color: '#666' }}>
                  共 {filteredRulesByProduct.length} 条分案规则
                </span>
              </div>
            )}
            <Table
              columns={columns}
              dataSource={filteredRulesByProduct}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
            暂无数据
          </div>
        )}
      </Card>
      
      <Modal
        title={editingRule ? '编辑规则' : '添加规则'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setModalVisible(false);
          setRatioInputs({});
          form.resetFields();
        }}
        width={600}
        okText={editingRule ? '保存修改' : '确认提交'}
      >
        <Form
          form={form}
          layout="vertical"
          onValuesChange={(changedValues) => {
            if ('collectorGroups' in changedValues) {
              syncRatioInputs(changedValues.collectorGroups);
            }
          }}
        >
          <Form.Item
            name="ruleName"
            label="规则名称"
            rules={[{ required: true, message: '请输入规则名称' }]}
          >
            <Input placeholder="请输入规则名称" />
          </Form.Item>
          
          <Form.Item
            name="products"
            label="产品类型"
            rules={[{ required: true, message: '请选择至少一个产品类型' }]}
          >
            <Checkbox.Group
              options={products.map(product => ({ label: product, value: product }))}
            />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="overdueStage"
                label="逾期阶段"
                rules={[{ required: true, message: '请选择逾期阶段或自定义范围' }]}
              >
                <Select
                  placeholder="请选择逾期阶段"
                  options={[...overdueStages.map(stage => ({ value: stage, label: stage })), { value: 'custom', label: '自定义范围' }]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="collectorGroups"
                label="分配对象（催收小组）"
                rules={[{ required: true, message: '请至少选择一个催收小组' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="请选择催收小组（可多选）"
                  options={collectorGroups.map(group => ({ value: group, label: group }))}
                  maxTagCount="responsive"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* 各小组分案比例 */}
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.collectorGroups !== currentValues.collectorGroups}
          >
            {({ getFieldValue }) => {
              const groups: string[] = getFieldValue('collectorGroups') || [];
              if (groups.length === 0) return null;
              const totalRatio = groups.reduce((sum, group) => sum + (ratioInputs[group] ?? 0), 0);
              return (
                <Form.Item label="分案比例" required>
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: '10px 12px' }}>
                    {groups.map((group, index) => (
                      <div
                        key={group}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}
                      >
                        <span style={{ color: '#374151', fontSize: 13 }}>
                          {index + 1}. {group}
                        </span>
                        <InputNumber
                          min={0}
                          max={100}
                          precision={0}
                          placeholder="请输入分案比例"
                          addonAfter="%"
                          style={{ width: 160 }}
                          value={ratioInputs[group] ?? undefined}
                          onChange={(value) =>
                            setRatioInputs(prev => ({ ...prev, [group]: value === null ? null : Number(value) }))
                          }
                        />
                      </div>
                    ))}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderTop: '1px solid #f3f4f6',
                        paddingTop: 8,
                        fontSize: 13,
                        color: totalRatio === 100 ? '#16a34a' : '#dc2626',
                      }}
                    >
                      <span>合计</span>
                      <span>
                        {totalRatio}%{totalRatio !== 100 && '（需等于 100%）'}
                      </span>
                    </div>
                    <div style={{ marginTop: 8, fontSize: 12, color: '#9ca3af', lineHeight: '18px' }}>
                      分配逻辑：按比例计算后先向下取整，剩余订单分配给小数部分最大的小组；小数部分相同时，按上述小组配置顺序分配。
                    </div>
                  </div>
                </Form.Item>
              );
            }}
          </Form.Item>
          
          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.overdueStage !== currentValues.overdueStage}>
            {({ getFieldValue }) => {
              const overdueStage = getFieldValue('overdueStage');
              if (overdueStage === 'custom') {
                return (
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name={['overdueStageRange', 'start']}
                        label="逾期阶段起始"
                        rules={[{ required: true, message: '请选择起始阶段' }]}
                      >
                        <Select
                          placeholder="请选择起始阶段"
                          options={overdueStages.map(stage => ({ value: stage, label: stage }))}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name={['overdueStageRange', 'end']}
                        label="逾期阶段结束"
                        rules={[{ required: true, message: '请选择结束阶段' }]}
                      >
                        <Select
                          placeholder="请选择结束阶段"
                          options={overdueStages.map(stage => ({ value: stage, label: stage }))}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                );
              }
              return null;
            }}
          </Form.Item>
          
          <Form.Item
            name="allocationType"
            label="分配模式"
            rules={[{ required: true, message: '请选择分配模式' }]}
          >
            <Select
              placeholder="请选择分配模式"
              options={allocationTypes}
            />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="优先级"
                rules={[
                  { required: true, message: '请输入优先级' },
                  { type: 'number', min: 1, max: 10, message: '优先级范围为1-10' },
                ]}
              >
                <InputNumber
                  min={1}
                  max={10}
                  placeholder="请输入优先级"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="maxCasesPerCollector"
                label="每人最大案件数（选填）"
              >
                <InputNumber
                  min={1}
                  max={1000}
                  placeholder="请输入每人最大案件数"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          

        </Form>
      </Modal>
    </div>
  );
};

export default AutoAllocationManagement;