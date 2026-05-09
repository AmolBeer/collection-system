import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, DatePicker, message, Space, Tag, Calendar, Badge } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined, CalendarOutlined, UserOutlined, TeamOutlined, SearchOutlined } from '@ant-design/icons';
import { useLanguage } from '../../i18n/LanguageContext';

interface Schedule {
  id: string;
  collectorId: string;
  collectorName: string;
  department: string;
  date: string;
  shift: 'morning' | 'afternoon' | 'evening';
  status: 'scheduled' | 'completed' | 'absent';
  createTime: string;
  createBy: string;
}

const defaultSchedules: Schedule[] = [
  {
    id: '1',
    collectorId: '1',
    collectorName: '催收员A',
    department: '催收一组',
    date: '2024-04-01',
    shift: 'morning',
    status: 'completed',
    createTime: '2024-03-31 10:00:00',
    createBy: '管理员',
  },
  {
    id: '2',
    collectorId: '2',
    collectorName: '催收员B',
    department: '催收一组',
    date: '2024-04-01',
    shift: 'afternoon',
    status: 'completed',
    createTime: '2024-03-31 10:00:00',
    createBy: '管理员',
  },
  {
    id: '3',
    collectorId: '3',
    collectorName: '催收员C',
    department: '催收二组',
    date: '2024-04-01',
    shift: 'evening',
    status: 'completed',
    createTime: '2024-03-31 10:00:00',
    createBy: '管理员',
  },
  {
    id: '4',
    collectorId: '1',
    collectorName: '催收员A',
    department: '催收一组',
    date: '2024-04-02',
    shift: 'afternoon',
    status: 'scheduled',
    createTime: '2024-03-31 10:00:00',
    createBy: '管理员',
  },
  {
    id: '5',
    collectorId: '2',
    collectorName: '催收员B',
    department: '催收一组',
    date: '2024-04-02',
    shift: 'evening',
    status: 'scheduled',
    createTime: '2024-03-31 10:00:00',
    createBy: '管理员',
  },
  {
    id: '6',
    collectorId: '3',
    collectorName: '催收员C',
    department: '催收二组',
    date: '2024-04-02',
    shift: 'morning',
    status: 'scheduled',
    createTime: '2024-03-31 10:00:00',
    createBy: '管理员',
  },
];

const collectors = [
  { value: '1', label: '催收员A', department: '催收一组' },
  { value: '2', label: '催收员B', department: '催收一组' },
  { value: '3', label: '催收员C', department: '催收二组' },
  { value: '4', label: '催收员D', department: '催收二组' },
  { value: '5', label: '催收员E', department: '催收三组' },
];

const departments = ['催收一组', '催收二组', '催收三组'];

const shifts = [
  { value: 'morning', label: '早班 (9:00-12:00)' },
  { value: 'afternoon', label: '中班 (13:00-18:00)' },
  { value: 'evening', label: '晚班 (19:00-22:00)' },
];

const ScheduleManagement: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>(defaultSchedules);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [form] = Form.useForm();
  const [searchDate, setSearchDate] = useState<string>('');
  const [searchCollector, setSearchCollector] = useState<string>('');
  const [searchDepartment, setSearchDepartment] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const { t } = useLanguage();

  const handleAdd = () => {
    form.resetFields();
    setEditingSchedule(null);
    setModalVisible(true);
  };

  const handleEdit = (record: Schedule) => {
    form.setFieldsValue(record);
    setEditingSchedule(record);
    setModalVisible(true);
  };

  const handleDelete = (record: Schedule) => {
    Modal.confirm({
      title: '删除排班',
      content: `确定要删除 ${record.collectorName} 在 ${record.date} 的排班吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        setSchedules(schedules.filter(s => s.id !== record.id));
        message.success('删除成功');
      },
    });
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (editingSchedule) {
        const updatedSchedule = { ...editingSchedule, ...values };
        setSchedules(schedules.map(s => s.id === editingSchedule.id ? updatedSchedule : s));
        message.success('修改成功');
      } else {
        const collector = collectors.find(c => c.value === values.collectorId);
        const newSchedule: Schedule = {
          ...values,
          id: Date.now().toString(),
          collectorName: collector ? collector.label : '',
          department: collector ? collector.department : '',
          status: 'scheduled',
          createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
          createBy: '当前用户',
        };
        setSchedules([...schedules, newSchedule]);
        message.success('添加成功');
      }
      setModalVisible(false);
    });
  };

  const filteredSchedules = useMemo(() => {
    return schedules.filter(schedule => {
      const matchesDate = !searchDate || schedule.date === searchDate;
      const matchesCollector = !searchCollector || schedule.collectorId === searchCollector;
      const matchesDepartment = !searchDepartment || schedule.department === searchDepartment;
      return matchesDate && matchesCollector && matchesDepartment;
    });
  }, [schedules, searchDate, searchCollector, searchDepartment]);

  const columns: ColumnsType<Schedule> = [
    {
      title: '催收员',
      dataIndex: 'collectorName',
      key: 'collectorName',
      width: 120,
      render: (name: string) => (
        <Space align="center">
          <UserOutlined />
          <span>{name}</span>
        </Space>
      ),
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 100,
      render: (dept: string) => (
        <Tag color="blue">{dept}</Tag>
      ),
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 100,
      render: (date: string) => (
        <Space align="center">
          <CalendarOutlined />
          <span>{date}</span>
        </Space>
      ),
    },
    {
      title: '班次',
      dataIndex: 'shift',
      key: 'shift',
      width: 120,
      render: (shift: string) => {
        const shiftMap: Record<string, string> = {
          'morning': '早班',
          'afternoon': '中班',
          'evening': '晚班',
        };
        return (
          <Tag color={shift === 'morning' ? 'green' : shift === 'afternoon' ? 'blue' : 'purple'}>
            {shiftMap[shift]}
          </Tag>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap: Record<string, { text: string, color: string }> = {
          'scheduled': { text: '已排班', color: 'blue' },
          'completed': { text: '已完成', color: 'green' },
          'absent': { text: '缺勤', color: 'red' },
        };
        return (
          <Tag color={statusMap[status].color}>
            {statusMap[status].text}
          </Tag>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const getDateSchedules = (date: string) => {
    return schedules.filter(schedule => schedule.date === date);
  };

  const dateCellRender = (date: any) => {
    const dateString = date.format('YYYY-MM-DD');
    const dateSchedules = getDateSchedules(dateString);
    if (dateSchedules.length > 0) {
      return (
        <Badge 
          count={dateSchedules.length} 
          style={{ backgroundColor: '#52c41a' }} 
          offset={[4, 0]}
        />
      );
    }
    return null;
  };

  const onDateSelect = (date: any) => {
    const dateString = date.format('YYYY-MM-DD');
    setSelectedDate(dateString);
    setSearchDate(dateString);
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>催员排班管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加排班
        </Button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, minHeight: 600 }}>
        {/* 日历视图 */}
        <Card title="排班日历" bordered={false} style={{ height: '100%' }}>
          <Calendar
            onSelect={onDateSelect}
            cellRender={dateCellRender}
            value={selectedDate ? new Date(selectedDate) : undefined}
          />
          <div style={{ marginTop: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
            <h4 style={{ margin: '0 0 8px 0' }}>当日排班 ({selectedDate})</h4>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {getDateSchedules(selectedDate).map(schedule => (
                <li key={schedule.id} style={{ marginBottom: 4 }}>
                  <span>{schedule.collectorName} - {shifts.find(s => s.value === schedule.shift)?.label}</span>
                  <Tag style={{ marginLeft: 8 }} color={schedule.status === 'scheduled' ? 'blue' : schedule.status === 'completed' ? 'green' : 'red'}>
                    {schedule.status === 'scheduled' ? '已排班' : schedule.status === 'completed' ? '已完成' : '缺勤'}
                  </Tag>
                </li>
              ))}
              {getDateSchedules(selectedDate).length === 0 && (
                <li style={{ color: '#999' }}>当日无排班</li>
              )}
            </ul>
          </div>
        </Card>
        
        {/* 排班列表 */}
        <Card title="排班列表" bordered={false} style={{ height: '100%' }}>
          <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <DatePicker
              placeholder="选择日期"
              value={searchDate ? new Date(searchDate) : null}
              onChange={(date) => setSearchDate(date ? date.format('YYYY-MM-DD') : '')}
            />
            <Select
              placeholder="选择催收员"
              value={searchCollector}
              onChange={setSearchCollector}
              style={{ width: 150 }}
              options={[
                { value: '', label: '全部' },
                ...collectors.map(collector => ({ value: collector.value, label: collector.label })),
              ]}
            />
            <Select
              placeholder="选择部门"
              value={searchDepartment}
              onChange={setSearchDepartment}
              style={{ width: 120 }}
              options={[
                { value: '', label: '全部' },
                ...departments.map(dept => ({ value: dept, label: dept })),
              ]}
            />
          </div>
          <Table
            columns={columns}
            dataSource={filteredSchedules}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              showTotal: (total) => `共 ${total} 条`,
            }}
            size="small"
          />
        </Card>
      </div>
      
      {/* 排班编辑模态框 */}
      <Modal
        title={editingSchedule ? '编辑排班' : '添加排班'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="collectorId"
            label="催收员"
            rules={[{ required: true, message: '请选择催收员' }]}
          >
            <Select
              placeholder="选择催收员"
              options={collectors.map(collector => ({
                value: collector.value,
                label: `${collector.label} (${collector.department})`,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="date"
            label="日期"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="shift"
            label="班次"
            rules={[{ required: true, message: '请选择班次' }]}
          >
            <Select
              placeholder="选择班次"
              options={shifts}
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            initialValue="scheduled"
          >
            <Select
              options={[
                { value: 'scheduled', label: '已排班' },
                { value: 'completed', label: '已完成' },
                { value: 'absent', label: '缺勤' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ScheduleManagement;