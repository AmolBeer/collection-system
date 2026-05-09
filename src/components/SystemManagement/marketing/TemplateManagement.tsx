import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Tag, Popconfirm, Card } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';

interface SMSTemplate {
  id: string;
  templateName: string;
  content: string;
  createTime: string;
  status: 'active' | 'inactive';
}

const defaultTemplates: SMSTemplate[] = [
  {
    id: '1',
    templateName: '还款提醒模板',
    content: '尊敬的{name}，您的还款金额为{amount}元，还款日期为{date}，请及时还款。',
    createTime: '2024-04-01 10:00:00',
    status: 'active',
  },
  {
    id: '2',
    templateName: '逾期提醒模板',
    content: '尊敬的{name}，您的贷款已逾期{days}天，请尽快处理以免影响您的信用记录。',
    createTime: '2024-04-02 11:00:00',
    status: 'active',
  },
];

const TemplateManagement: React.FC = () => {
  const [templates, setTemplates] = useState<SMSTemplate[]>(defaultTemplates);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<SMSTemplate | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    form.resetFields();
    setEditingTemplate(null);
    setModalVisible(true);
  };

  const handleEdit = (record: SMSTemplate) => {
    form.setFieldsValue(record);
    setEditingTemplate(record);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    message.success('删除成功');
  };

  const handleToggleStatus = (id: string) => {
    setTemplates(templates.map(t => 
      t.id === id ? { ...t, status: t.status === 'active' ? 'inactive' : 'active' } : t
    ));
    message.success('状态更新成功');
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (editingTemplate) {
        setTemplates(templates.map(t => 
          t.id === editingTemplate.id ? { ...t, ...values } : t
        ));
        message.success('修改成功');
      } else {
        const newTemplate: SMSTemplate = {
          ...values,
          id: Date.now().toString(),
          createTime: new Date().toLocaleString('zh-CN'),
          status: 'active',
        };
        setTemplates([...templates, newTemplate]);
        message.success('添加成功');
      }
      setModalVisible(false);
    });
  };

  const columns: ColumnsType<SMSTemplate> = [
    {
      title: '模板名称',
      dataIndex: 'templateName',
      key: 'templateName',
    },
    {
      title: '短信内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (content: string) => (
        <div style={{ maxWidth: 400 }}>
          {content}
        </div>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small" 
            icon={record.status === 'active' ? <StopOutlined /> : <CheckCircleOutlined />}
            onClick={() => handleToggleStatus(record.id)}
          >
            {record.status === 'active' ? '禁用' : '启用'}
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该模板吗？"
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
        <h3 style={{ margin: 0 }}>短信模板管理</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          创建模板
        </Button>
      </div>
      
      <Card bordered={false}>
        <Table
          columns={columns}
          dataSource={templates}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
          }}
        />
      </Card>
      
      <Modal
        title={editingTemplate ? '编辑模板' : '创建模板'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="templateName"
            label="模板名称"
            rules={[{ required: true, message: '请输入模板名称' }]}
          >
            <Input placeholder="请输入模板名称" />
          </Form.Item>
          <Form.Item
            name="content"
            label="短信内容"
            rules={[{ required: true, message: '请输入短信内容' }]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="请输入短信内容，支持变量如：{name}、{amount}、{date}等"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TemplateManagement;