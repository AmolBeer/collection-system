import React, { useState, useMemo } from 'react';
import { Tree, Button, Modal, Form, Input, Select, message, Space, Card, Table, Tag, Avatar, Badge, Tabs } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined, ApartmentOutlined, UserOutlined } from '@ant-design/icons';
import { useLanguage } from '../../i18n/LanguageContext';

// 机构
interface Organization {
  id: string;
  name: string;
  type: 'internal' | 'external'; // 内催机构/外催机构
  description?: string;
}

// 部门
interface Department {
  id: string;
  name: string;
  organizationId: string;
  parentId?: string; // 支持无限级部门
  leaderId?: string; // 部门负责人
  leaderName?: string;
}

// 小组
interface Group {
  id: string;
  name: string;
  departmentId: string;
  leaderId?: string; // 小组负责人
  leaderName?: string;
}

// 催收员
interface Collector {
  id: string;
  name: string;
  groupId: string; // 催收员属于小组
  position: string;
  joinDate: string;
  status: 'active' | 'resigned';
}

// 默认数据
const defaultOrganizations: Organization[] = [
  { id: 'org1', name: '内催机构', type: 'internal', description: '公司内部催收团队' },
  { id: 'org2', name: '外催机构A', type: 'external', description: '外部催收合作伙伴' },
  { id: 'org3', name: '外催机构B', type: 'external', description: '外部催收合作伙伴' },
];

const defaultDepartments: Department[] = [
  { id: 'dept1', name: '总经理室', organizationId: 'org1', leaderName: '张三' },
  { id: 'dept2', name: '销售部', organizationId: 'org1', parentId: 'dept1', leaderName: '李四' },
  { id: 'dept3', name: '市场部', organizationId: 'org1', parentId: 'dept1', leaderName: '王五' },
  { id: 'dept4', name: '技术部', organizationId: 'org1', parentId: 'dept1', leaderName: '赵六' },
  { id: 'dept5', name: '财务部', organizationId: 'org1', parentId: 'dept1', leaderName: '钱七' },
  { id: 'dept6', name: '人力资源部', organizationId: 'org1', parentId: 'dept1', leaderName: '孙九' },
  { id: 'dept7', name: '催收一部', organizationId: 'org1', parentId: 'dept1', leaderName: '周十' },
  { id: 'dept8', name: '催收二部', organizationId: 'org1', parentId: 'dept1', leaderName: '吴一' },
  { id: 'dept9', name: '外催业务部', organizationId: 'org2', leaderName: '郑二' },
  { id: 'dept10', name: '外催业务部', organizationId: 'org3', leaderName: '冯三' },
];

const defaultGroups: Group[] = [
  { id: 'group1', name: '电话催收组', departmentId: 'dept7', leaderName: '陈四' },
  { id: 'group2', name: '上门催收组', departmentId: 'dept7', leaderName: '褚五' },
  { id: 'group3', name: '法务催收组', departmentId: 'dept7', leaderName: '卫六' },
  { id: 'group4', name: '电话催收组', departmentId: 'dept8', leaderName: '蒋七' },
  { id: 'group5', name: '上门催收组', departmentId: 'dept8', leaderName: '沈八' },
  { id: 'group6', name: '外催一组', departmentId: 'dept9', leaderName: '韩九' },
  { id: 'group7', name: '外催二组', departmentId: 'dept9', leaderName: '杨十' },
];

const defaultCollectors: Collector[] = [
  { id: 'col1', name: '催收员1', groupId: 'group1', position: '初级催收员', joinDate: '2023-01-15', status: 'active' },
  { id: 'col2', name: '催收员2', groupId: 'group1', position: '高级催收员', joinDate: '2022-03-20', status: 'active' },
  { id: 'col3', name: '催收员3', groupId: 'group2', position: '上门专员', joinDate: '2023-05-10', status: 'active' },
  { id: 'col4', name: '催收员4', groupId: 'group2', position: '上门专员', joinDate: '2023-06-01', status: 'active' },
  { id: 'col5', name: '催收员5', groupId: 'group3', position: '法务专员', joinDate: '2022-11-01', status: 'active' },
  { id: 'col6', name: '催收员6', groupId: 'group4', position: '初级催收员', joinDate: '2023-02-08', status: 'active' },
  { id: 'col7', name: '催收员7', groupId: 'group5', position: '上门专员', joinDate: '2023-04-15', status: 'active' },
  { id: 'col8', name: '催收员8', groupId: 'group6', position: '外催专员', joinDate: '2023-01-20', status: 'active' },
];

type NodeType = 'organization' | 'department' | 'group';

interface TreeNode {
  key: string;
  title: React.ReactNode;
  type: NodeType;
  data: Organization | Department | Group;
  children?: TreeNode[];
  isLeaf: boolean;
}

const OrganizationStructure: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>(defaultOrganizations);
  const [departments, setDepartments] = useState<Department[]>(defaultDepartments);
  const [groups, setGroups] = useState<Group[]>(defaultGroups);
  const [collectors, setCollectors] = useState<Collector[]>(defaultCollectors);
  
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<NodeType>('organization');
  const [editingData, setEditingData] = useState<any>(null);
  
  const [activeTab, setActiveTab] = useState('structure');
  const [searchText, setSearchText] = useState('');
  
  const [form] = Form.useForm();
  const { t } = useLanguage();

  // 构建组织架构树
  const buildTreeData = (): TreeNode[] => {
    const tree: TreeNode[] = [];

    organizations.forEach(org => {
      const orgNode: TreeNode = {
        key: `org_${org.id}`,
        title: (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ApartmentOutlined style={{ color: org.type === 'internal' ? '#1890ff' : '#52c41a' }} />
            <span>{org.name}</span>
            <Tag color={org.type === 'internal' ? 'blue' : 'green'}>
              {org.type === 'internal' ? '内催' : '外催'}
            </Tag>
          </div>
        ),
        type: 'organization',
        data: org,
        isLeaf: false,
        children: [],
      };

      // 获取该机构下的顶级部门
      const topLevelDepts = departments.filter(d => d.organizationId === org.id && !d.parentId);
      orgNode.children = buildDepartmentTree(topLevelDepts);
      
      tree.push(orgNode);
    });

    return tree;
  };

  // 递归构建部门树
  const buildDepartmentTree = (depts: Department[]): TreeNode[] => {
    return depts.map(dept => {
      const childDepts = departments.filter(d => d.parentId === dept.id);
      const deptGroups = groups.filter(g => g.departmentId === dept.id);

      const node: TreeNode = {
        key: `dept_${dept.id}`,
        title: (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TeamOutlined style={{ color: '#722ed1' }} />
            <span>{dept.name}</span>
            {dept.leaderName && (
              <Tag color="purple" style={{ fontSize: 11 }}>
                {dept.leaderName}
              </Tag>
            )}
            <Badge count={deptGroups.length} style={{ backgroundColor: '#faad14' }} />
          </div>
        ),
        type: 'department',
        data: dept,
        isLeaf: false,
        children: [],
      };

      // 先添加子部门
      node.children = buildDepartmentTree(childDepts);
      
      // 再添加小组
      deptGroups.forEach(group => {
        const groupNode: TreeNode = {
          key: `group_${group.id}`,
          title: (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <UserOutlined style={{ color: '#fa8c16' }} />
              <span>{group.name}</span>
              {group.leaderName && (
                <Tag color="orange" style={{ fontSize: 11 }}>
                  {group.leaderName}
                </Tag>
              )}
              <Badge count={collectors.filter(c => c.groupId === group.id).length} style={{ backgroundColor: '#52c41a' }} />
            </div>
          ),
          type: 'group',
          data: group,
          isLeaf: true,
        };
        if (node.children) {
          node.children.push(groupNode);
        }
      });

      return node;
    });
  };

  const treeData = useMemo(() => buildTreeData(), [organizations, departments, groups, collectors]);

  const handleSelect = (keys: React.Key[]) => {
    setSelectedKeys(keys as string[]);
    if (keys.length > 0) {
      const key = keys[0] as string;
      const node = findNodeByKey(treeData, key);
      setSelectedNode(node);
    } else {
      setSelectedNode(null);
    }
  };

  const findNodeByKey = (nodes: TreeNode[], key: string): TreeNode | null => {
    for (const node of nodes) {
      if (node.key === key) return node;
      if (node.children) {
        const found = findNodeByKey(node.children, key);
        if (found) return found;
      }
    }
    return null;
  };

  const handleAdd = (type: NodeType) => {
    setModalType(type);
    setEditingData(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (node: TreeNode) => {
    setModalType(node.type);
    setEditingData(node.data);
    form.setFieldsValue(node.data);
    setModalVisible(true);
  };

  const handleDelete = (node: TreeNode) => {
    const nodeName = typeof node.title === 'string' ? node.title : '未知';
    
    Modal.confirm({
      title: `${t.delete} ${getNodeTypeName(node.type)}`,
      content: `${t.confirmDelete} ${nodeName}${t.questionMark}`,
      okText: t.yes,
      cancelText: t.no,
      onOk: () => {
        deleteNode(node);
        message.success(t.deleteSuccess);
        if (selectedNode && selectedNode.key === node.key) {
          setSelectedNode(null);
          setSelectedKeys([]);
        }
      },
    });
  };

  const deleteNode = (node: TreeNode) => {
    switch (node.type) {
      case 'organization':
        const orgId = (node.data as Organization).id;
        setOrganizations(organizations.filter(o => o.id !== orgId));
        // 删除该机构下的所有部门、小组和催收员
        const orgDepts = departments.filter(d => d.organizationId === orgId);
        const orgDeptIds = orgDepts.map(d => d.id);
        const orgGroups = groups.filter(g => orgDeptIds.includes(g.departmentId));
        const orgGroupIds = orgGroups.map(g => g.id);
        setDepartments(departments.filter(d => d.organizationId !== orgId));
        setGroups(groups.filter(g => !orgDeptIds.includes(g.departmentId)));
        setCollectors(collectors.filter(c => !orgGroupIds.includes(c.groupId)));
        break;
      case 'department':
        const deptId = (node.data as Department).id;
        // 递归删除子部门
        const deleteDeptRecursive = (id: string) => {
          const childDepts = departments.filter(d => d.parentId === id);
          childDepts.forEach(child => deleteDeptRecursive(child.id));
          const deptGroups = groups.filter(g => g.departmentId === id);
          const groupIds = deptGroups.map(g => g.id);
          setGroups(groups.filter(g => g.departmentId !== id));
          setCollectors(collectors.filter(c => !groupIds.includes(c.groupId)));
        };
        deleteDeptRecursive(deptId);
        setDepartments(departments.filter(d => d.id !== deptId));
        break;
      case 'group':
        const groupId = (node.data as Group).id;
        setGroups(groups.filter(g => g.id !== groupId));
        setCollectors(collectors.filter(c => c.groupId !== groupId));
        break;
    }
  };

  const getNodeTypeName = (type: NodeType): string => {
    switch (type) {
      case 'organization': return '机构';
      case 'department': return '部门';
      case 'group': return '小组';
    }
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      switch (modalType) {
        case 'organization':
          if (editingData) {
            setOrganizations(organizations.map(o => o.id === editingData.id ? { ...o, ...values } : o));
            message.success('机构修改成功');
          } else {
            const newOrg: Organization = {
              id: Date.now().toString(),
              ...values,
            };
            setOrganizations([...organizations, newOrg]);
            message.success('机构添加成功');
          }
          break;
        case 'department':
          if (editingData) {
            setDepartments(departments.map(d => d.id === editingData.id ? { ...d, ...values } : d));
            message.success('部门修改成功');
          } else {
            const newDept: Department = {
              id: Date.now().toString(),
              ...values,
            };
            setDepartments([...departments, newDept]);
            message.success('部门添加成功');
          }
          break;
        case 'group':
          if (editingData) {
            setGroups(groups.map(g => g.id === editingData.id ? { ...g, ...values } : g));
            message.success('小组修改成功');
          } else {
            const newGroup: Group = {
              id: Date.now().toString(),
              ...values,
            };
            setGroups([...groups, newGroup]);
            message.success('小组添加成功');
          }
          break;
      }
      setModalVisible(false);
    });
  };

  // 催收员表格列
  const collectorColumns: ColumnsType<Collector> = [
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
      title: t.action,
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEditCollector(record)}>
            {t.edit}
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDeleteCollector(record.id)}>
            {t.delete}
          </Button>
        </Space>
      ),
    },
  ];

  const filteredCollectors = useMemo(() => 
    collectors.filter(collector => {
      const group = groups.find(g => g.id === collector.groupId);
      const dept = group ? departments.find(d => d.id === group.departmentId) : null;
      const org = dept ? organizations.find(o => o.id === dept.organizationId) : null;
      
      const matchNode = !selectedNode || (
        selectedNode.type === 'organization' && org?.id === (selectedNode.data as Organization).id ||
        selectedNode.type === 'department' && dept?.id === (selectedNode.data as Department).id ||
        selectedNode.type === 'group' && group?.id === (selectedNode.data as Group).id
      );
      
      const matchSearch = collector.name.toLowerCase().includes(searchText.toLowerCase());
      
      return matchNode && matchSearch;
    }), [selectedNode, collectors, groups, departments, organizations, searchText]);

  const handleEditCollector = (collector: Collector) => {
    message.info(`编辑催收员: ${collector.name}`);
  };

  const handleDeleteCollector = (collectorId: string) => {
    setCollectors(collectors.filter(c => c.id !== collectorId));
    message.success(t.deleteSuccess);
  };

  const handleAddCollector = () => {
    message.info('添加催收员功能');
  };

  // 机构表格列
  const orgColumns: ColumnsType<Organization> = [
    {
      title: '机构名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'internal' ? 'blue' : 'green'}>
          {type === 'internal' ? '内催机构' : '外催机构'}
        </Tag>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: t.action,
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit({ key: `org_${record.id}`, type: 'organization', data: record, isLeaf: false } as TreeNode)}>
            {t.edit}
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete({ key: `org_${record.id}`, type: 'organization', data: record, isLeaf: false } as TreeNode)}>
            {t.delete}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>{t.organizationStructure}</h2>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleAdd('organization')}>
            添加机构
          </Button>
        </Space>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="组织架构" key="structure">
          <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: 20, minHeight: 600 }}>
            <Card title="架构树" variant="borderless" style={{ height: '100%' }}>
              <Tree
                treeData={treeData}
                selectedKeys={selectedKeys}
                onSelect={handleSelect}
                showLine={{ showLeafIcon: false }}
                style={{ padding: '8px 0' }}
              />
            </Card>

            <Card variant="borderless" style={{ height: '100%' }}>
              {selectedNode ? (
                <>
                  <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: 0 }}>{getNodeTypeName(selectedNode.type)}详情</h3>
                      <span style={{ color: '#666', fontSize: 13 }}>
                        {selectedNode.type === 'organization' && `类型: ${(selectedNode.data as Organization).type === 'internal' ? '内催机构' : '外催机构'}`}
                        {selectedNode.type === 'department' && `部门负责人: ${(selectedNode.data as Department).leaderName || '未设置'}`}
                        {selectedNode.type === 'group' && `小组负责人: ${(selectedNode.data as Group).leaderName || '未设置'}`}
                      </span>
                    </div>
                    <Space>
                      {selectedNode.type !== 'organization' && (
                        <Button icon={<PlusOutlined />} onClick={() => handleAdd(selectedNode.type === 'department' ? 'group' : 'department')}>
                          添加{selectedNode.type === 'department' ? '小组' : '子部门'}
                        </Button>
                      )}
                      <Button icon={<EditOutlined />} onClick={() => handleEdit(selectedNode)}>
                        {t.edit}
                      </Button>
                      <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(selectedNode)}>
                        {t.delete}
                      </Button>
                    </Space>
                  </div>

                  {selectedNode.type === 'group' && (
                    <>
                      <div style={{ marginBottom: 16 }}>
                        <Input
                          placeholder="搜索催收员..."
                          value={searchText}
                          onChange={e => setSearchText(e.target.value)}
                          style={{ maxWidth: 300 }}
                        />
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCollector}>
                          添加催收员
                        </Button>
                      </div>
                      <Table
                        columns={collectorColumns}
                        dataSource={filteredCollectors}
                        rowKey="id"
                        pagination={false}
                        size="small"
                      />
                    </>
                  )}
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>
                  <Space direction="vertical" align="center">
                    <ApartmentOutlined style={{ fontSize: 48, color: '#ddd' }} />
                    <span>请选择节点查看详情</span>
                  </Space>
                </div>
              )}
            </Card>
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane tab="机构管理" key="organizations">
          <Card variant="borderless">
            <Table
              columns={orgColumns}
              dataSource={organizations}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </Tabs.TabPane>
      </Tabs>

      <Modal
        title={`${editingData ? '编辑' : '添加'}${getNodeTypeName(modalType)}`}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText={t.confirm}
        cancelText={t.cancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label={`${getNodeTypeName(modalType)}名称`}
            rules={[{ required: true, message: '请输入名称' }]}
          >
            <Input placeholder="请输入名称" />
          </Form.Item>

          {modalType === 'organization' && (
            <>
              <Form.Item
                name="type"
                label="机构类型"
                rules={[{ required: true, message: '请选择机构类型' }]}
              >
                <Select placeholder="请选择机构类型">
                  <Select.Option value="internal">内催机构</Select.Option>
                  <Select.Option value="external">外催机构</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="description"
                label="描述"
              >
                <Input.TextArea placeholder="请输入描述" rows={3} />
              </Form.Item>
            </>
          )}

          {modalType === 'department' && (
            <>
              <Form.Item
                name="organizationId"
                label="所属机构"
                rules={[{ required: true, message: '请选择所属机构' }]}
              >
                <Select placeholder="请选择所属机构">
                  {organizations.map(org => (
                    <Select.Option key={org.id} value={org.id}>{org.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="parentId"
                label="上级部门"
              >
                <Select placeholder="请选择上级部门（可选）" allowClear>
                  {departments.map(dept => (
                    <Select.Option key={dept.id} value={dept.id}>{dept.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="leaderName"
                label="部门负责人"
              >
                <Input placeholder="请输入部门负责人姓名" />
              </Form.Item>
            </>
          )}

          {modalType === 'group' && (
            <>
              <Form.Item
                name="departmentId"
                label="所属部门"
                rules={[{ required: true, message: '请选择所属部门' }]}
              >
                <Select placeholder="请选择所属部门">
                  {departments.map(dept => (
                    <Select.Option key={dept.id} value={dept.id}>{dept.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="leaderName"
                label="小组负责人"
              >
                <Input placeholder="请输入小组负责人姓名" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default OrganizationStructure;