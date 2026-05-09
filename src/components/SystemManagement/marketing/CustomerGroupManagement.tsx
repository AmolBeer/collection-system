import React, { useState, useRef } from 'react';
import { Table, Button, Upload, message, Space, Card, Modal, Tag, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile, UploadProps } from 'antd';
import { DownloadOutlined, UploadOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

interface Customer {
  id: string;
  name: string;
  phone: string;
  amount?: string;
  dueDate?: string;
  status: 'pending' | 'sent' | 'failed';
}

interface CustomerGroup {
  id: string;
  groupName: string;
  uploadTime: string;
  customerCount: number;
  status: 'pending' | 'processing' | 'completed';
  customers: Customer[];
}

const defaultGroups: CustomerGroup[] = [
  {
    id: '1',
    groupName: '逾期客户群A',
    uploadTime: '2024-04-01 10:00:00',
    customerCount: 5,
    status: 'completed',
    customers: [
      { id: '1', name: '张三', phone: '13800138001', amount: '5000', dueDate: '2024-04-15', status: 'pending' },
      { id: '2', name: '李四', phone: '13800138002', amount: '3000', dueDate: '2024-04-16', status: 'pending' },
      { id: '3', name: '王五', phone: '13800138003', amount: '8000', dueDate: '2024-04-17', status: 'pending' },
      { id: '4', name: '赵六', phone: '13800138004', amount: '2000', dueDate: '2024-04-18', status: 'pending' },
      { id: '5', name: '孙七', phone: '13800138005', amount: '6000', dueDate: '2024-04-19', status: 'pending' },
    ],
  },
];

const CustomerGroupManagement: React.FC = () => {
  const [groups, setGroups] = useState<CustomerGroup[]>(defaultGroups);
  const [selectedGroup, setSelectedGroup] = useState<CustomerGroup | null>(null);
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        onSuccess?.(response);
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

  const groupColumns: ColumnsType<CustomerGroup> = [
    {
      title: '客群名称',
      dataIndex: 'groupName',
      key: 'groupName',
    },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
      width: 180,
    },
    {
      title: '客户数量',
      dataIndex: 'customerCount',
      key: 'customerCount',
      width: 100,
      render: (count: number) => `${count} 人`,
    },
    {
      title: '操作',
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
      title: '用户ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>客群管理</h3>
        <Space>
          <Button icon={<DownloadOutlined />} onClick={handleDownloadTemplate}>
            下载模板
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
      
      <Card bordered={false}>
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
    </div>
  );
};

export default CustomerGroupManagement;