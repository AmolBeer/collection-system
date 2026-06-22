import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Tag, Popconfirm, Card, Select, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, StopOutlined, CodeOutlined } from '@ant-design/icons';
import { useLanguage } from '../../../i18n/LanguageContext';

const templateParams = [
  { value: '{name}', label: '姓名', description: '客户姓名' },
  { value: '{gender}', label: '性别', description: '客户性别' },
  { value: '{billDueDate}', label: '账单到期日', description: '账单到期日期' },
  { value: '{overdueDays}', label: '逾期天数', description: '逾期天数（支持负数）' },
  { value: '{totalAmount}', label: '应还总额', description: '应还总金额' },
  { value: '{principal}', label: '本金', description: '待还本金' },
  { value: '{interest}', label: '利息', description: '待还利息' },
  { value: '{penalty}', label: '罚息', description: '待还罚息' },
  { value: '{serviceFee}', label: '服务费', description: '待还服务费' },
  { value: '{productName}', label: '产品名称', description: '贷款产品名称' },
];

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
  const { t } = useLanguage();
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
      title: t.templateName,
      dataIndex: 'templateName',
      key: 'templateName',
    },
    {
      title: t.smsContent,
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
      title: t.createTime,
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: t.status,
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? t.enabled : t.disabled}
        </Tag>
      ),
    },
    {
      title: t.action,
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
            {record.status === 'active' ? t.disabled : t.enabled}
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            {t.edit}
          </Button>
          <Popconfirm
            title={t.confirmDelete}
            onConfirm={() => handleDelete(record.id)}
            okText={t.yes}
            cancelText={t.no}
          >
            <Button 
              type="link" 
              size="small" 
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
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {t.createTemplate}
        </Button>
      </div>
      
      <Card variant="borderless">
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
        title={editingTemplate ? t.editTemplate : t.createTemplate}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="templateName"
            label={t.templateName}
            rules={[{ required: true, message: t.pleaseInputTemplateName }]}
          >
            <Input placeholder={t.pleaseInputTemplateName} />
          </Form.Item>
          <Form.Item
            name="content"
            label={t.smsContent}
            rules={[{ required: true, message: t.pleaseInputContent }]}
          >
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: '#666', marginRight: 8 }}>可用参数：</span>
              <Space wrap>
                {templateParams.map((param) => (
                  <Tooltip key={param.value} title={param.description}>
                    <Button
                      type="text"
                      size="small"
                      icon={<CodeOutlined />}
                      onClick={() => {
                        const currentValue = form.getFieldValue('content') || '';
                        form.setFieldsValue({
                          content: currentValue + param.value,
                        });
                      }}
                      style={{
                        padding: '2px 8px',
                        border: '1px solid #d9d9d9',
                        borderRadius: 4,
                        fontSize: 12,
                        color: '#1890ff',
                      }}
                    >
                      {param.label}
                    </Button>
                  </Tooltip>
                ))}
              </Space>
            </div>
            <Input.TextArea 
              rows={4} 
              placeholder={t.pleaseInputContent}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TemplateManagement;