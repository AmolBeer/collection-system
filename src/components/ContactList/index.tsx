import React, { useState } from 'react';
import { Table, Button, Input, Select, Card, Tag, Avatar, Space, Modal, Form, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, PlusOutlined, PhoneOutlined, MailOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  type: 'Primary' | 'Secondary' | 'Emergency';
  relationship: string;
  caseId: string;
  createdAt: string;
}

const defaultContacts: Contact[] = [
  { id: 'CT-001', name: 'EZI SADRAKH SAPUTRA', phone: '0821 6273 6949', email: 'ezi@example.com', type: 'Primary', relationship: 'Self', caseId: 'KREDITOK008946', createdAt: '2024-03-15' },
  { id: 'CT-002', name: 'SRI WAHYUNI', phone: '0812 3456 7890', email: 'sri@example.com', type: 'Emergency', relationship: 'Mother', caseId: 'KREDITOK008946', createdAt: '2024-03-15' },
  { id: 'CT-003', name: 'JOHN DOE', phone: '0813 2233 4455', email: 'john@example.com', type: 'Primary', relationship: 'Self', caseId: 'KREDITOK008947', createdAt: '2024-03-10' },
  { id: 'CT-004', name: 'JANE SMITH', phone: '0811 6677 8899', email: 'jane@example.com', type: 'Primary', relationship: 'Self', caseId: 'KREDITOK008948', createdAt: '2024-03-20' },
  { id: 'CT-005', name: 'MICHAEL BROWN', phone: '0822 1122 3344', email: 'michael@example.com', type: 'Primary', relationship: 'Self', caseId: 'KREDITOK008949', createdAt: '2024-02-25' },
  { id: 'CT-006', name: 'SARAH DAVIS', phone: '0819 5566 7788', email: 'sarah@example.com', type: 'Primary', relationship: 'Self', caseId: 'KREDITOK008950', createdAt: '2024-02-10' },
  { id: 'CT-007', name: 'ROBERT WILSON', phone: '0818 9900 1122', email: 'robert@example.com', type: 'Primary', relationship: 'Self', caseId: 'KREDITOK008951', createdAt: '2024-03-18' },
  { id: 'CT-008', name: 'EMILY JOHNSON', phone: '0817 3344 5566', email: 'emily@example.com', type: 'Primary', relationship: 'Self', caseId: 'KREDITOK008952', createdAt: '2024-03-05' },
];

const ContactList: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>(defaultContacts);
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [form] = Form.useForm();

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchText.toLowerCase()) ||
                          contact.phone.includes(searchText) ||
                          contact.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = typeFilter === 'all' || contact.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const columns: ColumnsType<Contact> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#0d4f3c' }} />
          <span>{name}</span>
        </Space>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      render: (phone) => (
        <Button type="link" icon={<PhoneOutlined style={{ color: '#22c55e' }} />} onClick={() => message.info(`Dialing ${phone}...`)} style={{ padding: 0, height: 'auto' }}>
          {phone}
        </Button>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      render: (email) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MailOutlined style={{ color: '#6b7280' }} />
          {email}
        </span>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type) => (
        <Tag color={type === 'Primary' ? 'green' : type === 'Secondary' ? 'blue' : 'orange'}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Relationship',
      dataIndex: 'relationship',
      key: 'relationship',
      width: 120,
    },
    {
      title: 'Case ID',
      dataIndex: 'caseId',
      key: 'caseId',
      width: 150,
      render: (caseId) => <span style={{ color: '#0d4f3c', fontWeight: '500' }}>{caseId}</span>,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
            style={{ color: '#0d4f3c' }}
          />
          <Button 
            type="text" 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)}
            style={{ color: '#dc2626' }}
          />
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setIsEditing(false);
    setEditingContact(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (contact: Contact) => {
    setIsEditing(true);
    setEditingContact(contact);
    form.setFieldsValue(contact);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
    message.success('Contact deleted successfully');
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (isEditing && editingContact) {
        setContacts(contacts.map(c => c.id === editingContact.id ? { ...c, ...values } : c));
        message.success('Contact updated successfully');
      } else {
        const newContact: Contact = {
          ...values,
          id: `CT-${String(contacts.length + 1).padStart(3, '0')}`,
          createdAt: new Date().toISOString().split('T')[0],
        };
        setContacts([...contacts, newContact]);
        message.success('Contact added successfully');
      }
      setModalVisible(false);
    }).catch(errorInfo => {
      console.log('Validation failed:', errorInfo);
    });
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        style={{ marginBottom: '24px', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAdd}
            style={{ borderRadius: '8px' }}
          >
            Add Contact
          </Button>
        }
      >
        <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>Contact List</h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#6b7280' }}>Manage customer contacts</p>
      </Card>

      <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <Input
            placeholder="Search by name, phone, or email..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: '300px' }}
          />
          <Select
            placeholder="Filter by type"
            value={typeFilter}
            onChange={setTypeFilter}
            style={{ width: '150px' }}
            options={[
              { value: 'all', label: 'All' },
              { value: 'Primary', label: 'Primary' },
              { value: 'Secondary', label: 'Secondary' },
              { value: 'Emergency', label: 'Emergency' },
            ]}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredContacts}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `Total ${total} contacts`,
          }}
          size="middle"
        />
      </Card>

      <Modal
        title={isEditing ? 'Edit Contact' : 'Add Contact'}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter contact name' }]}
          >
            <Input placeholder="Enter contact name" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please enter phone number' }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: 'email', message: 'Please enter valid email' }]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: 'Please select contact type' }]}
          >
            <Select placeholder="Select contact type">
              <Select.Option value="Primary">Primary</Select.Option>
              <Select.Option value="Secondary">Secondary</Select.Option>
              <Select.Option value="Emergency">Emergency</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="relationship"
            label="Relationship"
            rules={[{ required: true, message: 'Please enter relationship' }]}
          >
            <Input placeholder="Enter relationship (e.g., Self, Mother, Friend)" />
          </Form.Item>
          <Form.Item
            name="caseId"
            label="Case ID"
            rules={[{ required: true, message: 'Please enter case ID' }]}
          >
            <Input placeholder="Enter case ID" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ContactList;
