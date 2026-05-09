import React, { useState, useMemo, useRef } from 'react';
import { Tree, Button, Modal, Form, Input, Select, message, Space, Card, Table, Tag, Avatar, Badge, Divider } from 'antd';
import type { DataNode } from 'antd/es/tree';
import type { ColumnsType } from 'antd/es/table';
import { UserOutlined, TeamOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, SearchOutlined as SearchIcon } from '@ant-design/icons';
import { useLanguage } from '../../i18n/LanguageContext';

interface Department {
  id: string;
  name: string;
  parentId: string | null;
  leader?: string;
  description?: string;
  status: 'active' | 'inactive';
  memberCount: number;
  children?: Department[];
}

interface DepartmentMember {
  id: string;
  name: string;
  position: string;
  departmentId: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

const defaultDepartments: Department[] = [
  { id: '1', name: '总公司', parentId: null, leader: '张三', description: '公司总部', status: 'active', memberCount: 10, children: [
    { id: '2', name: '技术部', parentId: '1', leader: '李四', description: '负责系统开发和维护', status: 'active', memberCount: 5 },
    { id: '3', name: '催收部', parentId: '1', leader: '王五', description: '负责逾期案件催收', status: 'active', memberCount: 15, children: [
      { id: '4', name: '催收一组', parentId: '3', leader: '赵六', description: '负责M1阶段案件', status: 'active', memberCount: 5 },
      { id: '5', name: '催收二组', parentId: '3', leader: '孙七', description: '负责M2阶段案件', status: 'active', memberCount: 5 },
      { id: '6', name: '催收三组', parentId: '3', leader: '周八', description: '负责M3+阶段案件', status: 'active', memberCount: 5 },
    ]},
    { id: '7', name: '运营部', parentId: '1', leader: '吴九', description: '负责业务运营', status: 'active', memberCount: 3 },
    { id: '8', name: '财务部', parentId: '1', leader: '郑十', description: '负责财务核算', status: 'active', memberCount: 2 },
  ]},
];

const defaultMembers: DepartmentMember[] = [
  { id: '1', name: '张三', position: '总经理', departmentId: '1', joinDate: '2020-01-01', status: 'active' },
  { id: '2', name: '李四', position: '技术总监', departmentId: '2', joinDate: '2020-02-01', status: 'active' },
  { id: '3', name: '王五', position: '催收总监', departmentId: '3', joinDate: '2020-03-01', status: 'active' },
  { id: '4', name: '赵六', position: '组长', departmentId: '4', joinDate: '2020-04-01', status: 'active' },
  { id: '5', name: '孙七', position: '组长', departmentId: '5', joinDate: '2020-05-01', status: 'active' },
  { id: '6', name: '周八', position: '组长', departmentId: '6', joinDate: '2020-06-01', status: 'active' },
  { id: '7', name: '吴九', position: '运营总监', departmentId: '7', joinDate: '2020-07-01', status: 'active' },
  { id: '8', name: '郑十', position: '财务总监', departmentId: '8', joinDate: '2020-08-01', status: 'active' },
];

// 扁平化默认部门数据
const flattenDepartments = (departments: Department[]): Department[] => {
  let result: Department[] = [];
  departments.forEach(dept => {
    const { children, ...deptWithoutChildren } = dept;
    result.push(deptWithoutChildren);
    if (children) {
      result = [...result, ...flattenDepartments(children)];
    }
  });
  return result;
};

const defaultDepartmentsFlat = flattenDepartments(defaultDepartments);

const OrganizationStructure: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>(defaultDepartmentsFlat);
  const [members, setMembers] = useState<DepartmentMember[]>(defaultMembers);
  const [modalVisible, setModalVisible] = useState(false);
  const [memberModalVisible, setMemberModalVisible] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [editingMember, setEditingMember] = useState<DepartmentMember | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [form] = Form.useForm();
  const [memberForm] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const { t } = useLanguage();
  const treeRef = useRef<any>(null);

  const convertToTreeData = (departments: Department[], parentId: string | null = null): DataNode[] => {
    // 递归函数，用于构建树结构
    const buildTree = (items: Department[], parentId: string | null): DataNode[] => {
      return items
        .filter(dept => dept.parentId === parentId)
        .map(dept => {
          const children = buildTree(items, dept.id);
          return {
            title: (
              <Space size="middle">
                <span>{dept.name}</span>
                <Badge count={dept.memberCount} size="small" style={{ backgroundColor: '#52c41a' }} />
                <Tag color={dept.status === 'active' ? 'green' : 'red'}>
                  {dept.status === 'active' ? '活跃' : '停用'}
                </Tag>
              </Space>
            ),
            key: dept.id,
            children: children.length > 0 ? children : undefined,
          };
        });
    };
    
    return buildTree(departments, parentId);
  };

  const treeData = convertToTreeData(departments);

  const handleExpand = (keys: string[]) => {
    setExpandedKeys(keys);
  };

  const handleAdd = () => {
    form.resetFields();
    // 如果有选中的部门，默认将其设为父部门
    if (selectedDepartment) {
      form.setFieldsValue({ parentId: selectedDepartment.id });
    }
    setEditingDepartment(null);
    setModalVisible(true);
  };

  const handleEdit = (node: DataNode) => {
    const department = findDepartmentById(departments, node.key);
    if (department) {
      form.setFieldsValue(department);
      setEditingDepartment(department);
      setModalVisible(true);
    }
  };

  const findDepartmentById = (departments: Department[], id: string): Department | undefined => {
    return departments.find(dept => dept.id === id);
  };

  const handleDelete = (node: DataNode) => {
    console.log('Delete button clicked', node);
    // 从节点中提取部门名称
    const departmentName = node.title instanceof React.ReactElement ? 
      (node.title.props.children[0] || '未知部门') : 
      node.title;
    
    Modal.confirm({
      title: '删除部门',
      content: `确定要删除部门 ${departmentName} 吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        console.log('Confirm delete', node.key);
        const departmentId = String(node.key);
        const newDepartments = removeDepartmentById(departments, departmentId);
        setDepartments(newDepartments);
        message.success('删除成功');
        // 如果删除的是当前选中的部门，清空选中状态
        if (selectedDepartment && selectedDepartment.id === departmentId) {
          setSelectedDepartment(null);
          setSelectedKeys([]);
        }
      },
    });
  };

  const removeDepartmentById = (departments: Department[], id: string): Department[] => {
    return departments.filter(dept => dept.id !== id);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (editingDepartment) {
        const updatedDepartments = updateDepartmentById(departments, editingDepartment.id, values);
        setDepartments(updatedDepartments);
        message.success('修改成功');
      } else {
        const newDepartment: Department = {
          ...values,
          id: Date.now().toString(),
          memberCount: 0,
          status: 'active',
        };
        // 修复添加部门时的替换问题，确保是在原数组基础上添加
        const updatedDepartments = [...departments, newDepartment];
        setDepartments(updatedDepartments);
        message.success('添加成功');
        
        // 自动展开新部门的父部门
        if (newDepartment.parentId) {
          setExpandedKeys(prev => [...prev, newDepartment.parentId]);
        }
        
        // 自动选择新部门
        setSelectedDepartment(newDepartment);
        setSelectedKeys([newDepartment.id]);
      }
      setModalVisible(false);
    });
  };

  const updateDepartmentById = (departments: Department[], id: string, values: Partial<Department>): Department[] => {
    return departments.map(dept => {
      if (dept.id === id) {
        return { ...dept, ...values };
      }
      return dept;
    });
  };

  const getAllDepartments = (departments: Department[]): Department[] => {
    return departments;
  };

  const allDepartments = departments;

  const handleDepartmentSelect = (node: DataNode) => {
    const department = findDepartmentById(departments, node.key);
    if (department) {
      setSelectedDepartment(department);
      setSelectedKeys([node.key]);
    }
  };

  const handleAddMember = () => {
    memberForm.resetFields();
    setEditingMember(null);
    setMemberModalVisible(true);
  };

  const handleEditMember = (member: DepartmentMember) => {
    memberForm.setFieldsValue(member);
    setEditingMember(member);
    setMemberModalVisible(true);
  };

  const handleDeleteMember = (memberId: string) => {
    console.log('handleDeleteMember called with id:', memberId);
    Modal.confirm({
      title: '删除成员',
      content: '确定要删除该成员吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        console.log('Confirm delete member', memberId);
        const newMembers = members.filter(member => member.id !== memberId);
        setMembers(newMembers);
        // 更新部门成员数
        const updatedDepartments = updateMemberCount(departments, newMembers);
        setDepartments(updatedDepartments);
        message.success('删除成功');
      },
    });
  };

  const handleSaveMember = () => {
    memberForm.validateFields().then((values) => {
      console.log('Saving member with values:', values);
      let updatedMembers = [...members];
      
      if (editingMember) {
        updatedMembers = members.map(member => 
          member.id === editingMember.id ? { ...member, ...values } : member
        );
        setMembers(updatedMembers);
        message.success('修改成功');
      } else {
        const newMember: DepartmentMember = {
          ...values,
          id: Date.now().toString(),
          status: 'active',
        };
        updatedMembers = [...members, newMember];
        setMembers(updatedMembers);
        message.success('添加成功');
      }
      
      // 更新部门成员数，使用更新后的成员数组
      console.log('Updating member count with updatedMembers:', updatedMembers);
      const updatedDepartments = updateMemberCount(departments, updatedMembers);
      console.log('Updated departments:', updatedDepartments);
      setDepartments(updatedDepartments);
      setMemberModalVisible(false);
    });
  };

  const updateMemberCount = (departments: Department[], members: DepartmentMember[]): Department[] => {
    console.log('updateMemberCount called with departments:', departments);
    console.log('updateMemberCount called with members:', members);
    return departments.map(dept => {
      const deptMemberCount = members.filter(member => member.departmentId === dept.id).length;
      console.log(`Department ${dept.name} has ${deptMemberCount} members`);
      return {
        ...dept,
        memberCount: deptMemberCount,
      };
    });
  };

  const filteredMembers = useMemo(() => {
    if (!selectedDepartment) return [];
    return members.filter(member => 
      member.departmentId === selectedDepartment.id &&
      member.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [selectedDepartment, members, searchText]);

  const memberColumns: ColumnsType<DepartmentMember> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <Space align="center">
          <Avatar size="small">{name.charAt(0)}</Avatar>
          <span>{name}</span>
        </Space>
      ),
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: '入职日期',
      dataIndex: 'joinDate',
      key: 'joinDate',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '在职' : '离职'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEditMember(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              console.log('Delete member button clicked', record.id);
              handleDeleteMember(record.id);
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>组织架构管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加部门
        </Button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, minHeight: 600 }}>
        {/* 组织树 */}
        <Card title="部门结构" bordered={false} style={{ height: '100%' }}>
          <Tree
            ref={treeRef}
            treeData={treeData}
            defaultExpandAll
            expandedKeys={expandedKeys}
            selectedKeys={selectedKeys}
            onSelect={(_, info) => {
              if (info.node.isSelected) {
                handleDepartmentSelect(info.node);
              }
            }}
            onExpand={(_, info) => {
              handleExpand(info.expandedKeys);
            }}
            titleRender={(node) => (
              <Space size="small" style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ flex: 1, minWidth: 80, marginRight: 8 }}>{node.title}</span>
                <Space size="small">
                  <Button 
                    type="link" 
                    size="small" 
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(node)}
                  >
                    编辑
                  </Button>
                  <Button 
                    type="link" 
                    size="small" 
                    danger 
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(node);
                    }}
                  >
                    删除
                  </Button>
                </Space>
              </Space>
            )}
            style={{ width: '100%' }}
          />
        </Card>
        
        {/* 部门详情 */}
        <Card 
          title={selectedDepartment ? `${selectedDepartment.name} - 部门详情` : '选择部门查看详情'} 
          bordered={false} 
          style={{ height: '100%' }}
          extra={selectedDepartment ? (
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={handleAddMember}
            >
              添加成员
            </Button>
          ) : null}
        >
          {selectedDepartment ? (
            <div>
              {/* 部门基本信息 */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ marginBottom: 16 }}>基本信息</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <strong>部门名称：</strong>{selectedDepartment.name}
                  </div>
                  <div>
                    <strong>部门负责人：</strong>{selectedDepartment.leader || '未设置'}
                  </div>
                  <div>
                    <strong>部门状态：</strong>
                    <Tag color={selectedDepartment.status === 'active' ? 'green' : 'red'}>
                      {selectedDepartment.status === 'active' ? '活跃' : '停用'}
                    </Tag>
                  </div>
                  <div>
                    <strong>成员数量：</strong>{selectedDepartment.memberCount}人
                  </div>
                  <div colSpan={2}>
                    <strong>部门描述：</strong>{selectedDepartment.description || '无'}
                  </div>
                </div>
              </div>
              
              <Divider />
              
              {/* 部门成员 */}
              <div>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0 }}>部门成员</h3>
                  <Input
                    placeholder="搜索成员"
                    prefix={<SearchIcon />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 200 }}
                  />
                </div>
                <Table
                  columns={memberColumns}
                  dataSource={filteredMembers}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50'],
                  }}
                  size="small"
                  locale={{ emptyText: '暂无成员' }}
                />
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
              <TeamOutlined style={{ fontSize: 48, marginBottom: 16 }} />
              <p>请从左侧选择一个部门查看详情</p>
            </div>
          )}
        </Card>
      </div>
      
      {/* 部门编辑模态框 */}
      <Modal
        title={editingDepartment ? '编辑部门' : '添加部门'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="部门名称"
            rules={[{ required: true, message: '请输入部门名称' }]}
          >
            <Input placeholder="请输入部门名称" />
          </Form.Item>
          <Form.Item
            name="parentId"
            label="上级部门"
            initialValue={null}
          >
            <Select
              placeholder="选择上级部门"
              allowClear
              options={[
                { value: null, label: '无（根部门）' },
                ...allDepartments.map(dept => ({ value: dept.id, label: dept.name })),
              ]}
            />
          </Form.Item>
          <Form.Item
            name="leader"
            label="部门负责人"
          >
            <Input placeholder="请输入部门负责人" />
          </Form.Item>
          <Form.Item
            name="description"
            label="部门描述"
          >
            <Input.TextArea rows={3} placeholder="请输入部门描述" />
          </Form.Item>
          <Form.Item
            name="status"
            label="部门状态"
            initialValue="active"
          >
            <Select
              options={[
                { value: 'active', label: '活跃' },
                { value: 'inactive', label: '停用' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 成员编辑模态框 */}
      <Modal
        title={editingMember ? '编辑成员' : '添加成员'}
        open={memberModalVisible}
        onOk={handleSaveMember}
        onCancel={() => setMemberModalVisible(false)}
        width={500}
      >
        <Form form={memberForm} layout="vertical">
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            name="position"
            label="职位"
            rules={[{ required: true, message: '请选择职位' }]}
          >
            <Select
              placeholder="选择职位"
              options={[
                { value: '催收经理', label: '催收经理' },
                { value: '催收主管', label: '催收主管' },
                { value: '催收组长', label: '催收组长' },
                { value: '催员', label: '催员' },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="departmentId"
            label="所属部门"
            rules={[{ required: true, message: '请选择所属部门' }]}
            initialValue={selectedDepartment?.id}
          >
            <Select
              placeholder="选择所属部门"
              options={allDepartments.map(dept => ({ value: dept.id, label: dept.name }))}
            />
          </Form.Item>
          <Form.Item
            name="joinDate"
            label="入职日期"
            initialValue={new Date().toISOString().split('T')[0]}
          >
            <Input type="date" disabled />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            initialValue="active"
          >
            <Select
              options={[
                { value: 'active', label: '在职' },
                { value: 'inactive', label: '离职' },
              ]}
              disabled
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrganizationStructure;