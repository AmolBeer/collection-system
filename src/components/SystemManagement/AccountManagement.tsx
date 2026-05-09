import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useLanguage } from '../../i18n/LanguageContext';

interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  role: string;
  status: boolean;
  createTime: string;
}

const defaultUsers: User[] = [
  { id: '1', username: 'admin', password: '123456', email: 'admin@example.com', phone: '13800138000', department: '技术部', position: '管理员', role: '系统管理员', status: true, createTime: '2024-01-01 10:00:00' },
  { id: '2', username: 'user1', password: '123456', email: 'user1@example.com', phone: '13900139000', department: '催收部', position: '催收员', role: '催收人员', status: true, createTime: '2024-01-02 10:00:00' },
  { id: '3', username: 'user2', password: '123456', email: 'user2@example.com', phone: '13700137000', department: '催收部', position: '催收主管', role: '部门主管', status: true, createTime: '2024-01-03 10:00:00' },
];

const AccountManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(defaultUsers);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const { t } = useLanguage();

  const columns: ColumnsType<User> = [
    {
      title: t.username,
      dataIndex: 'username',
      key: 'username',
      width: 120,
    },
    {
      title: t.email,
      dataIndex: 'email',
      key: 'email',
      width: 180,
    },
    {
      title: t.phone,
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
    },
    {
      title: t.department,
      dataIndex: 'department',
      key: 'department',
      width: 100,
    },
    {
      title: t.position,
      dataIndex: 'position',
      key: 'position',
      width: 100,
    },
    {
      title: t.role,
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role) => <Tag color="blue">{role}</Tag>,
    },
    {
      title: t.status,
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        <Tag color={status ? 'green' : 'red'}>
          {status ? t.enabled : t.disabled}
        </Tag>
      ),
    },
    {
      title: t.createTime,
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
    },
    {
      title: t.action,
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>{t.edit}</Button>
          <Button type="link" size="small" danger onClick={() => handleDelete(record)}>{t.delete}</Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    form.resetFields();
    setEditingUser(null);
    setModalVisible(true);
  };

  const handleEdit = (record: User) => {
    form.setFieldsValue(record);
    setEditingUser(record);
    setModalVisible(true);
  };

  const handleDelete = (record: User) => {
    Modal.confirm({
      title: t.deleteConfirmTitle,
      content: `确定要删除用户 ${record.username} 吗？`,
      okText: t.confirm,
      cancelText: t.cancel,
      onOk: () => {
        setUsers(users.filter(u => u.id !== record.id));
        message.success('删除成功');
      },
    });
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const now = new Date().toLocaleString();
      if (editingUser) {
        // 只更新提供的字段，不覆盖密码（如果没有提供）
        const updatedUser = { ...editingUser, ...values };
        setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u));
        message.success('修改成功');
      } else {
        const newUser: User = {
          ...values,
          id: Date.now().toString(),
          createTime: now,
        };
        setUsers([...users, newUser]);
        message.success('添加成功');
      }
      setModalVisible(false);
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>{t.accountManagement}</h2>
        <Button type="primary" onClick={handleAdd}>{t.addUser}</Button>
      </div>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total) => `共 ${total} 条`,
        }}
        size="small"
      />
      <Modal
        title={editingUser ? t.editUser : t.addUser}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        okText={t.save}
        cancelText={t.cancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label={t.username}
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder={t.username} />
          </Form.Item>
          <Form.Item
            name="email"
            label={t.email}
            rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '请输入有效的邮箱地址' }]}
          >
            <Input placeholder={t.email} />
          </Form.Item>
          <Form.Item
            name="phone"
            label={t.phone}
            rules={[{ required: true, message: '请输入电话' }]}
          >
            <Input placeholder={t.phone} />
          </Form.Item>
          <Form.Item
            name="department"
            label={t.department}
            rules={[{ required: true, message: '请选择部门' }]}
          >
            <Select
              options={[
                { value: '技术部', label: '技术部' },
                { value: '催收部', label: '催收部' },
                { value: '运营部', label: '运营部' },
                { value: '财务部', label: '财务部' },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="position"
            label={t.position}
            rules={[{ required: true, message: '请输入职位' }]}
          >
            <Input placeholder={t.position} />
          </Form.Item>
          <Form.Item
            name="role"
            label={t.role}
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select
              options={[
                { value: '系统管理员', label: '系统管理员' },
                { value: '部门主管', label: '部门主管' },
                { value: '催收人员', label: '催收人员' },
                { value: '运营人员', label: '运营人员' },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[editingUser ? {} : { required: true, message: '请输入密码' }, { min: 6, message: '密码长度不能少于6位' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item
            name="status"
            label={t.status}
            initialValue={true}
          >
            <Select
              options={[
                { value: true, label: t.enabled },
                { value: false, label: t.disabled },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AccountManagement;