import React, { useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, Tree, message, Space, Tag, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined, KeyOutlined } from '@ant-design/icons';
import { useLanguage } from '../../i18n/LanguageContext';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createTime: string;
}

interface Permission {
  key: string;
  title: string;
  children?: Permission[];
}

const permissions: Permission[] = [
  {
    key: 'dashboard',
    title: '数据面板',
  },
  {
    key: 'caseList',
    title: '案件列表',
    children: [
      { key: 'caseList:view', title: '查看' },
      { key: 'caseList:assign', title: '指派' },
      { key: 'caseList:detail', title: '详情' },
    ],
  },
  {
    key: 'account',
    title: '账户管理',
    children: [
      { key: 'account:view', title: '查看' },
      { key: 'account:create', title: '创建' },
      { key: 'account:edit', title: '编辑' },
      { key: 'account:delete', title: '删除' },
    ],
  },
  {
    key: 'organization',
    title: '组织架构',
    children: [
      { key: 'organization:view', title: '查看' },
      { key: 'organization:edit', title: '编辑' },
    ],
  },
  {
    key: 'stage',
    title: '逾期阶段配置',
    children: [
      { key: 'stage:view', title: '查看' },
      { key: 'stage:create', title: '创建' },
      { key: 'stage:edit', title: '编辑' },
      { key: 'stage:delete', title: '删除' },
    ],
  },
  {
    key: 'autoAssignment',
    title: '自动分案配置',
    children: [
      { key: 'autoAssignment:view', title: '查看' },
      { key: 'autoAssignment:create', title: '创建' },
      { key: 'autoAssignment:edit', title: '编辑' },
      { key: 'autoAssignment:delete', title: '删除' },
      { key: 'autoAssignment:run', title: '执行' },
    ],
  },
  {
    key: 'recovery',
    title: '催回列表',
    children: [
      { key: 'recovery:view', title: '查看' },
    ],
  },
  {
    key: 'reduction',
    title: '减免规则配置',
    children: [
      { key: 'reduction:view', title: '查看' },
      { key: 'reduction:create', title: '创建' },
      { key: 'reduction:edit', title: '编辑' },
      { key: 'reduction:delete', title: '删除' },
    ],
  },
  {
    key: 'role',
    title: '角色管理',
    children: [
      { key: 'role:view', title: '查看' },
      { key: 'role:create', title: '创建' },
      { key: 'role:edit', title: '编辑' },
      { key: 'role:delete', title: '删除' },
    ],
  },
];

const defaultRoles: Role[] = [
  {
    id: '1',
    name: '管理员',
    description: '系统管理员，拥有所有权限',
    permissions: ['dashboard', 'caseList', 'caseList:view', 'caseList:assign', 'caseList:detail', 'recovery', 'recovery:view', 'account', 'account:view', 'account:create', 'account:edit', 'account:delete', 'organization', 'organization:view', 'organization:edit', 'stage', 'stage:view', 'stage:create', 'stage:edit', 'stage:delete', 'autoAssignment', 'autoAssignment:view', 'autoAssignment:create', 'autoAssignment:edit', 'autoAssignment:delete', 'autoAssignment:run', 'reduction', 'reduction:view', 'reduction:create', 'reduction:edit', 'reduction:delete', 'role', 'role:view', 'role:create', 'role:edit', 'role:delete'],
    createTime: '2024-03-01 10:00:00',
  },
  {
    id: '2',
    name: '催收主管',
    description: '催收团队主管，管理催收员',
    permissions: ['dashboard', 'caseList', 'caseList:view', 'caseList:assign', 'caseList:detail', 'recovery', 'recovery:view', 'account', 'account:view', 'organization', 'organization:view', 'autoAssignment', 'autoAssignment:view', 'autoAssignment:run', 'reduction', 'reduction:view'],
    createTime: '2024-03-01 10:00:00',
  },
  {
    id: '3',
    name: '催收员',
    description: '普通催收员，处理分配的案件',
    permissions: ['dashboard', 'caseList', 'caseList:view', 'caseList:detail', 'recovery', 'recovery:view'],
    createTime: '2024-03-01 10:00:00',
  },
];

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>(defaultRoles);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [form] = Form.useForm();
  const { t } = useLanguage();

  const handleAdd = () => {
    setEditingRole(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    form.setFieldsValue({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    });
    setModalVisible(true);
  };

  const handleDelete = (roleId: string) => {
    setRoles(roles.filter(role => role.id !== roleId));
    message.success('角色删除成功');
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingRole) {
        const updatedRoles = roles.map(role => 
          role.id === editingRole.id 
            ? { ...role, ...values, id: role.id, createTime: role.createTime }
            : role
        );
        setRoles(updatedRoles);
        message.success('角色编辑成功');
      } else {
        const newRole: Role = {
          id: (roles.length + 1).toString(),
          ...values,
          createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        };
        setRoles([...roles, newRole]);
        message.success('角色创建成功');
      }
      setModalVisible(false);
    });
  };

  const columns: ColumnsType<Role> = [
    {
      title: t.roleName,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t.description,
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: t.permissionCount,
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: string[]) => permissions.length,
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
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个角色吗？"
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
        </Space>
      ),
    },
  ];

  const renderPermissionTree = () => {
    const renderTreeNode = (permission: Permission) => {
      return (
        <Tree.TreeNode
          key={permission.key}
          title={permission.title}
          disableCheckbox={!permission.children}
        >
          {permission.children?.map(child => renderTreeNode(child))}
        </Tree.TreeNode>
      );
    };

    return (
      <Tree
        checkable
        treeData={permissions.map(permission => renderTreeNode(permission))}
        fieldNames={{
          title: 'title',
          key: 'key',
          children: 'children',
        }}
        onChange={(checkedKeys) => {
          form.setFieldsValue({ permissions: checkedKeys as string[] });
        }}
      />
    );
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>角色管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加角色
        </Button>
      </div>
      <Card>
        <Table
          columns={columns}
          dataSource={roles}
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

      {/* 角色编辑模态框 */}
      <Modal
        title={editingRole ? '编辑角色' : '添加角色'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            name="description"
            label="角色描述"
            rules={[{ required: true, message: '请输入角色描述' }]}
          >
            <Input.TextArea rows={3} placeholder="请输入角色描述" />
          </Form.Item>
          <Form.Item
            name="permissions"
            label="权限设置"
            rules={[{ required: true, message: '请选择权限' }]}
          >
            <div style={{ maxHeight: 400, overflow: 'auto' }}>
              {renderPermissionTree()}
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoleManagement;