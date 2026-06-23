import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Tag, message, Space, Popconfirm, Row, Col, InputNumber } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined, SendOutlined } from '@ant-design/icons';

interface OutsourcingConfig {
  id: string;
  name: string;
  agency: string;
  products: string[];
  overdueDays: string[];
  amountRange: { min: number | null; max: number | null };
  customerLevels: string[];
  periods: string[];
  enabled: boolean;
  createTime: string;
  createBy: string;
}

const defaultConfigs: OutsourcingConfig[] = [
  {
    id: '1',
    name: '消费贷M1阶段委外',
    agency: 'XX催收公司',
    products: ['消费贷'],
    overdueDays: ['30-60天'],
    amountRange: { min: 1000, max: 50000 },
    customerLevels: ['普通客户'],
    periods: ['1-3期'],
    enabled: true,
    createTime: '2024-03-01 10:00:00',
    createBy: '管理员',
  },
  {
    id: '2',
    name: '经营贷高逾期委外',
    agency: 'YY催收机构',
    products: ['经营贷', '消费贷'],
    overdueDays: ['60-90天', '90天以上'],
    amountRange: { min: 50000, max: null },
    customerLevels: ['高风险客户', 'VIP客户'],
    periods: ['4-6期', '7期以上'],
    enabled: false,
    createTime: '2024-03-15 14:30:00',
    createBy: '管理员',
  },
];

const agencies = ['XX催收公司', 'YY催收机构', 'ZZ资产管理', 'AA信用管理'];
const products = ['消费贷', '经营贷', '房贷', '车贷', '信用卡'];
const overdueDayOptions = ['0-30天', '30-60天', '60-90天', '90-180天', '180天以上'];
const customerLevels = ['普通客户', '优质客户', 'VIP客户', '高风险客户'];
const periodOptions = ['1-3期', '4-6期', '7-12期', '12期以上'];

const OutsourcingConfig: React.FC = () => {
  const [configs, setConfigs] = useState<OutsourcingConfig[]>(defaultConfigs);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingConfig, setEditingConfig] = useState<OutsourcingConfig | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingConfig(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (config: OutsourcingConfig) => {
    setEditingConfig(config);
    form.setFieldsValue(config);
    setModalVisible(true);
  };

  const handleDelete = (configId: string) => {
    setConfigs(configs.filter(config => config.id !== configId));
    message.success('委外配置删除成功');
  };

  const handleToggleStatus = (configId: string, enabled: boolean) => {
    const updatedConfigs = configs.map(config => 
      config.id === configId 
        ? { ...config, enabled }
        : config
    );
    setConfigs(updatedConfigs);
    message.success(`配置已${enabled ? '启用' : '禁用'}`);
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingConfig) {
        const updatedConfigs = configs.map(config => 
          config.id === editingConfig.id 
            ? { ...config, ...values, id: config.id, createTime: config.createTime, createBy: config.createBy }
            : config
        );
        setConfigs(updatedConfigs);
        message.success('委外配置编辑成功');
      } else {
        const newConfig: OutsourcingConfig = {
          id: Date.now().toString(),
          ...values,
          createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
          createBy: '当前用户',
          enabled: true,
        };
        setConfigs([...configs, newConfig]);
        message.success('委外配置创建成功');
      }
      setModalVisible(false);
      form.resetFields();
    });
  };

  const handlePushCases = (_configId: string) => {
    message.success('案件推送任务已启动');
  };

  const columns: ColumnsType<OutsourcingConfig> = [
    {
      title: '配置名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
    },
    {
      title: '委外机构',
      dataIndex: 'agency',
      key: 'agency',
      width: 150,
    },
    {
      title: '产品名称',
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
      title: '逾期天数',
      dataIndex: 'overdueDays',
      key: 'overdueDays',
      width: 150,
      render: (days: string[]) => (
        <Space size="small" wrap>
          {days.map((day, index) => (
            <Tag key={index} color="orange">{day}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '待还金额',
      dataIndex: 'amountRange',
      key: 'amountRange',
      width: 150,
      render: (range: { min: number | null; max: number | null }) => {
        const min = range.min !== null ? `${range.min.toLocaleString()}` : '不限';
        const max = range.max !== null ? `${range.max.toLocaleString()}` : '不限';
        return <span>{min} - {max}</span>;
      },
    },
    {
      title: '客群等级',
      dataIndex: 'customerLevels',
      key: 'customerLevels',
      width: 150,
      render: (levels: string[]) => (
        <Space size="small" wrap>
          {levels.map((level, index) => (
            <Tag key={index} color="green">{level}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '期数',
      dataIndex: 'periods',
      key: 'periods',
      width: 120,
      render: (periods: string[]) => (
        <Space size="small" wrap>
          {periods.map((period, index) => (
            <Tag key={index} color="purple">{period}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      width: 80,
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
      width: 170,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<SendOutlined />}
            onClick={() => handlePushCases(record.id)}
            disabled={!record.enabled}
          >
            推送案件
          </Button>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个委外配置吗？"
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
          <Popconfirm
            title={record.enabled ? '确定要禁用该配置吗？' : '确定要启用该配置吗？'}
            onConfirm={() => handleToggleStatus(record.id, !record.enabled)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="link" 
            >
              {record.enabled ? '禁用' : '启用'}
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
          <h2 style={{ margin: 0 }}>委外催收配置</h2>
          <p style={{ color: '#666', marginTop: 4 }}>配置案件委外催收规则，选择推送条件和目标委外机构</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加委外配置
        </Button>
      </div>
      
      <Card>
        <Table
          columns={columns}
          dataSource={configs}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `共 ${total} 条`,
          }}
          size="small"
          scroll={{ x: 1500 }}
        />
      </Card>

      <Modal
        title={editingConfig ? '编辑委外催收配置' : '添加委外催收配置'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="配置名称"
            rules={[{ required: true, message: '请输入配置名称' }]}
          >
            <Input placeholder="请输入配置名称，如：消费贷M1阶段委外" />
          </Form.Item>

          <Form.Item
            name="agency"
            label="委外机构"
            rules={[{ required: true, message: '请选择委外机构' }]}
          >
            <Select placeholder="请选择委外机构">
              {agencies.map(agency => (
                <Select.Option key={agency} value={agency}>{agency}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Form.Item
              name="products"
              label="产品名称"
              rules={[{ required: true, message: '请选择至少一个产品' }]}
            >
              <Select mode="multiple" placeholder="请选择产品名称">
                {products.map(product => (
                  <Select.Option key={product} value={product}>{product}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="overdueDays"
              label="逾期天数"
              rules={[{ required: true, message: '请选择至少一个逾期天数范围' }]}
            >
              <Select mode="multiple" placeholder="请选择逾期天数范围">
                {overdueDayOptions.map(option => (
                  <Select.Option key={option} value={option}>{option}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item label="待还金额范围">
            <Row gutter={16}>
              <Col span={11}>
                <Form.Item
                  name={['amountRange', 'min']}
                  rules={[{ type: 'number', min: 0, message: '最小金额不能为负数' }]}
                >
                  <InputNumber 
                    min={0} 
                    placeholder="最小金额" 
                    style={{ width: '100%' }}
                    formatter={(value: number | undefined) => value ? value.toLocaleString() : ''}
                    parser={(value: string | undefined) => parseFloat(value?.replace(/,/g, '') || '0')}
                  />
                </Form.Item>
              </Col>
              <Col span={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#999' }}>-</span>
              </Col>
              <Col span={11}>
                <Form.Item
                  name={['amountRange', 'max']}
                  rules={[{ type: 'number', min: 0, message: '最大金额不能为负数' }]}
                >
                  <InputNumber 
                    min={0} 
                    placeholder="最大金额（选填）" 
                    style={{ width: '100%' }}
                    formatter={(value: number | undefined) => value ? value.toLocaleString() : ''}
                    parser={(value: string | undefined) => parseFloat(value?.replace(/,/g, '') || '0')}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Form.Item
              name="customerLevels"
              label="客群等级"
              rules={[{ required: true, message: '请选择至少一个客群等级' }]}
            >
              <Select mode="multiple" placeholder="请选择客群等级">
                {customerLevels.map(level => (
                  <Select.Option key={level} value={level}>{level}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="periods"
              label="期数（入库时第几期）"
              rules={[{ required: true, message: '请选择至少一个期数范围' }]}
            >
              <Select mode="multiple" placeholder="请选择期数范围">
                {periodOptions.map(option => (
                  <Select.Option key={option} value={option}>{option}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default OutsourcingConfig;
