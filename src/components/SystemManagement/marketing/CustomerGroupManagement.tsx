import React, { useState } from 'react';
import { Table, Button, Upload, message, Space, Card, Modal, Tag, Popconfirm, Select, Row, Col, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile, UploadProps } from 'antd';
import { DownloadOutlined, UploadOutlined, DeleteOutlined, EyeOutlined, FilterOutlined } from '@ant-design/icons';
import { useLanguage } from '../../../i18n/LanguageContext';
import * as XLSX from 'xlsx';

interface Customer {
  id: string;
  name: string;
  phone: string;
  amount?: string;
  dueDate?: string;
  status: 'pending' | 'sent' | 'failed';
  tags: string[];
}

interface UserTag {
  id: string;
  tagName: string;
  tagType: string;
  tagColor: string;
  enabled: boolean;
}

interface CustomerGroup {
  id: string;
  groupName: string;
  uploadTime: string;
  customerCount: number;
  status: 'pending' | 'processing' | 'completed';
  customers: Customer[];
}

const defaultTags: UserTag[] = [
  { id: '1', tagName: '新客户', tagType: 'newCustomer', tagColor: 'blue', enabled: true },
  { id: '2', tagName: '活跃用户', tagType: 'behavior', tagColor: 'green', enabled: true },
  { id: '3', tagName: '高风险', tagType: 'risk', tagColor: 'red', enabled: true },
  { id: '4', tagName: 'VIP客户', tagType: 'custom', tagColor: 'purple', enabled: true },
  { id: '5', tagName: '沉睡用户', tagType: 'behavior', tagColor: 'orange', enabled: false },
];

const defaultGroups: CustomerGroup[] = [
  {
    id: '1',
    groupName: '逾期客户群A',
    uploadTime: '2024-04-01 10:00:00',
    customerCount: 5,
    status: 'completed',
    customers: [
      { id: '1', name: '张三', phone: '13800138001', amount: '5000', dueDate: '2024-04-15', status: 'pending', tags: ['1', '3'] },
      { id: '2', name: '李四', phone: '13800138002', amount: '3000', dueDate: '2024-04-16', status: 'pending', tags: ['1', '2'] },
      { id: '3', name: '王五', phone: '13800138003', amount: '8000', dueDate: '2024-04-17', status: 'pending', tags: ['4'] },
      { id: '4', name: '赵六', phone: '13800138004', amount: '2000', dueDate: '2024-04-18', status: 'pending', tags: ['2', '4'] },
      { id: '5', name: '孙七', phone: '13800138005', amount: '6000', dueDate: '2024-04-19', status: 'pending', tags: ['1', '2', '3'] },
    ],
  },
];

const CustomerGroupManagement: React.FC = () => {
  const { t } = useLanguage();
  const [groups, setGroups] = useState<CustomerGroup[]>(defaultGroups);
  const [selectedGroup, setSelectedGroup] = useState<CustomerGroup | null>(null);
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [totalFilteredCount, setTotalFilteredCount] = useState(0);
  const [fullFilteredCustomers, setFullFilteredCustomers] = useState<Customer[]>([]);
  const [newGroupName, setNewGroupName] = useState('');

  const enabledTags = defaultTags.filter(tag => tag.enabled);

  const handleDownloadTemplate = () => {
    const templateData = [
      { 姓名: '张三', 手机号: '13800138001', 金额: '5000', 到期日期: '2024-04-15' },
      { 姓名: '李四', 手机号: '13800138002', 金额: '3000', 到期日期: '2024-04-16' },
    ];
    
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '客群模板');
    XLSX.writeFile(wb, '客群导入模板.xlsx');
    message.success('模板下载成功');
  };

  const handleFileUpload: UploadProps['customRequest'] = (options) => {
    const { file, onSuccess, onError } = options;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        
        const customers: Customer[] = jsonData.map((item: any, index: number) => ({
          id: Date.now().toString() + index,
          name: item['姓名'] || '',
          phone: item['手机号'] || '',
          amount: item['金额'] || '',
          dueDate: item['到期日期'] || '',
          status: 'pending' as const,
          tags: [],
        }));
        
        const newGroup: CustomerGroup = {
          id: Date.now().toString(),
          groupName: `客群_${new Date().toLocaleDateString('zh-CN')}_${groups.length + 1}`,
          uploadTime: new Date().toLocaleString('zh-CN'),
          customerCount: customers.length,
          status: 'completed',
          customers,
        };
        
        setGroups([...groups, newGroup]);
        onSuccess?.({});
        message.success(`成功导入 ${customers.length} 条客户数据`);
      } catch (error) {
        onError?.(error as Error);
        message.error('文件解析失败，请检查文件格式');
      }
    };
    
    reader.readAsBinaryString(file as File);
  };

  const handleDeleteGroup = (id: string) => {
    setGroups(groups.filter(g => g.id !== id));
    message.success('删除成功');
  };

  const handleViewCustomers = (group: CustomerGroup) => {
    setSelectedGroup(group);
    setCustomerModalVisible(true);
  };

  const handleOpenFilterModal = () => {
    setFilterModalVisible(true);
    setSelectedTags([]);
    setFilteredCustomers([]);
    setNewGroupName('');
  };

  const handleApplyFilter = () => {
    if (selectedTags.length === 0) {
      message.warning('请至少选择一个标签');
      return;
    }

    const allCustomers: Customer[] = [];
    groups.forEach(group => {
      allCustomers.push(...group.customers);
    });

    const filtered = allCustomers.filter(customer => 
      selectedTags.some(tagId => customer.tags.includes(tagId))
    );

    const PREVIEW_LIMIT = 20;
    const previewCustomers = filtered.slice(0, PREVIEW_LIMIT);
    
    setFilteredCustomers(previewCustomers);
    setTotalFilteredCount(filtered.length);
    setFullFilteredCustomers(filtered);
    message.success(`筛选出 ${filtered.length} 位客户`);
  };

  const handleSaveAsGroup = () => {
    if (totalFilteredCount === 0) {
      message.warning('没有可保存的客户');
      return;
    }
    if (!newGroupName.trim()) {
      message.warning('请输入客群名称');
      return;
    }

    const newGroup: CustomerGroup = {
      id: Date.now().toString(),
      groupName: newGroupName.trim(),
      uploadTime: new Date().toLocaleString('zh-CN'),
      customerCount: totalFilteredCount,
      status: 'completed',
      customers: fullFilteredCustomers,
    };

    setGroups([...groups, newGroup]);
    message.success(`成功创建客群「${newGroupName}」，包含 ${totalFilteredCount} 位客户`);
    
    setFilterModalVisible(false);
    setSelectedTags([]);
    setFilteredCustomers([]);
    setTotalFilteredCount(0);
    setFullFilteredCustomers([]);
    setNewGroupName('');
  };

  const getTagInfo = (tagId: string) => {
    return defaultTags.find(tag => tag.id === tagId);
  };

  const getTagColor = (tagType: string) => {
    const colorMap: Record<string, string> = {
      newCustomer: '#1890ff',
      oldCustomer: '#52c41a',
      behavior: '#fa8c16',
      risk: '#f5222d',
      custom: '#722ed1',
    };
    return colorMap[tagType] || '#1890ff';
  };

  const groupColumns: ColumnsType<CustomerGroup> = [
    {
      title: t.groupName,
      dataIndex: 'groupName',
      key: 'groupName',
    },
    {
      title: t.uploadTime,
      dataIndex: 'uploadTime',
      key: 'uploadTime',
      width: 180,
    },
    {
      title: t.customerCount,
      dataIndex: 'customerCount',
      key: 'customerCount',
      width: 100,
      render: (count: number) => `${count}`,
    },
    {
      title: t.action,
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleViewCustomers(record)}
          >
            查看详情
          </Button>
          <Popconfirm
            title="确定要删除该客群吗？"
            onConfirm={() => handleDeleteGroup(record.id)}
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

  const customerColumns: ColumnsType<Customer> = [
    {
      title: t.userId,
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t.phone,
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: t.userTag,
      key: 'tags',
      render: (_, record) => (
        <Space>
          {record.tags.map(tagId => {
            const tagInfo = getTagInfo(tagId);
            return tagInfo ? (
              <Tag key={tagId} color={getTagColor(tagInfo.tagType)}>
                {tagInfo.tagName}
              </Tag>
            ) : null;
          })}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Space>
          <Button icon={<DownloadOutlined />} onClick={handleDownloadTemplate}>
            {t.downloadTemplate}
          </Button>
          <Button icon={<FilterOutlined />} onClick={handleOpenFilterModal}>
            {t.filterByTag}
          </Button>
          <Upload
            customRequest={handleFileUpload}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            accept=".xlsx,.xls,.csv"
            showUploadList={false}
          >
            <Button type="primary" icon={<UploadOutlined />}>
              上传客群
            </Button>
          </Upload>
        </Space>
      </div>
      
      <Card variant="borderless">
        <Table
          columns={groupColumns}
          dataSource={groups}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
          }}
        />
      </Card>
      
      <Modal
        title={selectedGroup ? `${selectedGroup.groupName} - 客户详情` : '客户详情'}
        open={customerModalVisible}
        onCancel={() => setCustomerModalVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          columns={customerColumns}
          dataSource={selectedGroup?.customers || []}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
          }}
          size="small"
        />
      </Modal>

      <Modal
        title={t.filterByTag}
        open={filterModalVisible}
        onCancel={() => setFilterModalVisible(false)}
        footer={null}
        width={600}
      >
        <div style={{ padding: 20 }}>
          <Row gutter={16}>
            <Col span={24}>
              <Select
                mode="multiple"
                placeholder={t.selectTag}
                value={selectedTags}
                onChange={setSelectedTags}
                style={{ width: '100%' }}
                maxTagCount="responsive"
              >
                {enabledTags.map(tag => (
                  <Select.Option key={tag.id} value={tag.id}>
                    <Tag color={getTagColor(tag.tagType)} style={{ marginRight: 8 }}>
                      {tag.tagName}
                    </Tag>
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>

          <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
            <div style={{ marginBottom: 12 }}>
              <h4>{t.filterCustomers} ({totalFilteredCount} 位客户)</h4>
              {totalFilteredCount > 20 && (
                <p style={{ fontSize: 12, color: '#999', margin: '4px 0 0 0' }}>
                  仅显示前20条预览，实际筛选结果为 {totalFilteredCount} 条
                </p>
              )}
            </div>
            {filteredCustomers.length > 0 ? (
              <Table
                columns={customerColumns}
                dataSource={filteredCustomers}
                rowKey="id"
                pagination={{
                  pageSize: 5,
                  showSizeChanger: false,
                }}
                size="small"
              />
            ) : (
              <div style={{ textAlign: 'center', padding: 20, color: '#999' }}>
                {selectedTags.length > 0 ? '暂无匹配的客户' : '请选择标签进行筛选'}
              </div>
            )}
          </div>

          <div style={{ marginTop: 16 }}>
            <Input
              placeholder="输入新客群名称"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              style={{ marginBottom: 16 }}
            />
            <div style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={() => {
                  setSelectedTags([]);
                  setFilteredCustomers([]);
                  setTotalFilteredCount(0);
                  setFullFilteredCustomers([]);
                  setNewGroupName('');
                }}>
                  重置
                </Button>
                <Button type="primary" onClick={handleApplyFilter}>
                  {t.filterCustomers}
                </Button>
                <Button 
                  type="primary" 
                  onClick={handleSaveAsGroup}
                  disabled={totalFilteredCount === 0 || !newGroupName.trim()}
                >
                  保存为客群
                </Button>
              </Space>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CustomerGroupManagement;
