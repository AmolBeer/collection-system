import React, { useState, useMemo } from 'react';
import { Tree, Button, Modal, Form, Input, Select, message, Space, Card, Table, Tag, Avatar, Badge, Divider } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons';
import type { DataNode } from 'rc-tree/lib/interface';
import { useLanguage } from '../../i18n/LanguageContext';

interface Department {
  id: string;
  name: string;
  parentId?: string;
  memberCount?: number;
}

interface DepartmentMember {
  id: string;
  name: string;
  position: string;
  departmentId: string;
  joinDate: string;
  status: 'active' | 'resigned';
}

const defaultDepartments: Department[] = [
  { id: '1', name: '总经理室', memberCount: 3 },
  { id: '2', name: '销售部', parentId: '1', memberCount: 15 },
  { id: '3', name: '市场部', parentId: '1', memberCount: 8 },
  { id: '4', name: '技术部', parentId: '1', memberCount: 20 },
  { id: '5', name: '财务部', parentId: '1', memberCount: 5 },
  { id: '6', name: '人力资源部', parentId: '1', memberCount: 4 },
];

const defaultMembers: DepartmentMember[] = [
  { id: '1', name: '张三', position: '总经理', departmentId: '1', joinDate: '2018-01-15', status: 'active' },
  { id: '2', name: '李四', position: '销售总监', departmentId: '2', joinDate: '2019-03-20', status: 'active' },
  { id: '3', name: '王五', position: '市场总监', departmentId: '3', joinDate: '2019-05-10', status: 'active' },
  { id: '4', name: '赵六', position: '技术总监', departmentId: '4', joinDate: '2018-11-01', status: 'active' },
  { id: '5', name: '钱七', position: '财务经理', departmentId: '5', joinDate: '2020-01-08', status: 'active' },
  { id: '6', name: '孙九', position: 'HR经理', departmentId: '6', joinDate: '2020-06-15', status: 'active' },
  { id: '7', name: '周十', position: '销售经理', departmentId: '2', joinDate: '2021-02-01', status: 'active' },
  { id: '8', name: '吴一', position: '销售代表', departmentId: '2', joinDate: '2022-03-10', status: 'active' },
];

const OrganizationStructure: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>(defaultDepartments);
  const [members, setMembers] = useState<DepartmentMember[]>(defaultMembers);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const { t } = useLanguage();

  const buildTreeData = (depts: Department[], parentId?: string): DataNode[] => {
    return depts
      .filter(d => d.parentId === parentId)
      .map(dept => ({
        key: dept.id,
        title: (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TeamOutlined style={{ color: '#1890ff' }} />
            <span>{dept.name}</span>
            <Badge count={dept.memberCount} style={{ backgroundColor: '#52c41a' }} />
          </div>
        ),
        children: buildTreeData(depts, dept.id),
        isLeaf: !depts.some(d => d.parentId === dept.id),
      }));
  };

  const treeData = useMemo(() => buildTreeData(departments), [departments]);

  const handleSelect = (keys: React.Key[], info: { node: DataNode }) => {
    setSelectedKeys(keys as string[]);
    if (info.node.isLeaf) {
      const dept = departments.find(d => d.id === info.node.key);
      setSelectedDepartment(dept || null);
    } else {
      setSelectedDepartment(null);
    }
  };

  const findDepartmentById = (id: string): Department | undefined => {
    return departments.find(dept => dept.id === id);
  };

  const handleDelete = (node: DataNode) => {
    console.log('Delete button clicked', node);
    const departmentName = typeof node.title === 'string' ? node.title : '未知部门';
    
    Modal.confirm({
      title: `${t.delete} ${t.department}`,
      content: `${t.confirmDelete} ${departmentName} ${t.department}${t.questionMark}`,
      okText: t.yes,
      cancelText: t.no,
      onOk: () => {
        console.log('Confirm delete', node.key);
        const departmentId = String(node.key);
        const newDepartments = removeDepartmentById(departments, departmentId);
        setDepartments(newDepartments);
        message.success(t.deleteSuccess);
        if (selectedDepartment && selectedDepartment.id === departmentId) {
          setSelectedDepartment(null);
          setSelectedKeys([]);
        }
      },
    });
  };

  const removeDepartmentById = (depts: Department[], id: string): Department[] => {
    return depts.filter(dept => dept.id !== id);
  };

  const handleAdd = () => {
    setEditingDepartment(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (dept: Department) => {
    setEditingDepartment(dept);
    form.setFieldsValue(dept);
    setModalVisible(true);
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingDepartment) {
        const updatedDepartments = departments.map(d => 
          d.id === editingDepartment.id ? { ...d, ...values } : d
        );
        setDepartments(updatedDepartments);
        message.success(t.departmentEditSuccess);
      } else {
        const newDepartment: Department = {
          id: Date.now().toString(),
          ...values,
        };
        setDepartments([...departments, newDepartment]);
        message.success(t.departmentAddSuccess);
      }
      setModalVisible(false);
    });
  };

  const filteredMembers = useMemo(() => 
    members.filter(member => 
      member.departmentId === selectedDepartment?.id &&
      member.name.toLowerCase().includes(searchText.toLowerCase())
    ), [selectedDepartment, members, searchText]);

  const memberColumns: ColumnsType<DepartmentMember> = [
    {
      title: t.customerName,
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
      title: t.position,
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: t.joinDate,
      dataIndex: 'joinDate',
      key: 'joinDate',
    },
    {
      title: t.status,
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? t.onJob : t.resigned}
        </Tag>
      ),
    },
    {
      title: t.action,
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEditMember(record)}
          >
            {t.edit}
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
            {t.delete}
          </Button>
        </Space>
      ),
    },
  ];

  const handleEditMember = (member: DepartmentMember) => {
    console.log('Edit member:', member);
    message.info(`${t.edit} ${member.name}`);
  };

  const handleDeleteMember = (memberId: string) => {
    setMembers(members.filter(m => m.id !== memberId));
    message.success(t.deleteSuccess);
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>{t.organizationStructure}</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {t.addDepartment}
        </Button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, minHeight: 600 }}>
        <Card title={t.departmentStructure} variant="borderless" style={{ height: '100%' }}>
          <Tree
            treeData={treeData}
            selectedKeys={selectedKeys}
            onSelect={(keys, info) => handleSelect(keys, info as { node: DataNode })}
            showLine={{ showLeafIcon: false }}
            style={{ padding: '8px 0' }}
          />
        </Card>

        <Card variant="borderless" style={{ height: '100%' }}>
          {selectedDepartment ? (
            <>
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0 }}>{selectedDepartment.name}</h3>
                  <span style={{ color: '#666', fontSize: 13 }}>
                    {t.member}: {selectedDepartment.memberCount} {t.people}
                  </span>
                </div>
                <Space>
                  <Button icon={<EditOutlined />} onClick={() => handleEdit(selectedDepartment)}>
                    {t.edit}
                  </Button>
                  <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete({ key: selectedDepartment.id, title: selectedDepartment.name } as DataNode)}>
                    {t.delete}
                  </Button>
                </Space>
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <Input
                  placeholder={`${t.search}...`}
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  style={{ maxWidth: 300 }}
                />
              </div>

              <Table
                columns={memberColumns}
                dataSource={filteredMembers}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>
              <Space direction="vertical" align="center">
                <TeamOutlined style={{ fontSize: 48, color: '#ddd' }} />
                <span>{t.pleaseSelectDepartment}</span>
              </Space>
            </div>
          )}
        </Card>
      </div>

      <Modal
        title={editingDepartment ? t.editDepartment : t.addDepartment}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText={t.confirm}
        cancelText={t.cancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label={t.departmentName}
            rules={[{ required: true, message: t.pleaseInputDepartmentName }]}
          >
            <Input placeholder={t.pleaseInputDepartmentName} />
          </Form.Item>
          <Form.Item
            name="parentId"
            label={t.parentDepartment}
          >
            <Select
              placeholder={t.pleaseSelect}
              allowClear
              options={departments.map(d => ({ value: d.id, label: d.name }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrganizationStructure;