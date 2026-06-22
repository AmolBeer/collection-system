import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, DatePicker, message, Space, Tag, Calendar, Badge, Statistic, Row, Col, Tooltip, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined, CalendarOutlined, UserOutlined, TeamOutlined, DownloadOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { useLanguage } from '../../i18n/LanguageContext';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);

interface Schedule {
  id: string;
  collectorId: string;
  collectorName: string;
  department: string;
  date: string;
  status: 'working' | 'completed' | 'onLeave' | 'holiday';
  leaveReason?: string;
  createTime: string;
  createBy: string;
}

const collectors = [
  { value: '1', label: '催收员A', department: '催收一组' },
  { value: '2', label: '催收员B', department: '催收一组' },
  { value: '3', label: '催收员C', department: '催收二组' },
  { value: '4', label: '催收员D', department: '催收二组' },
  { value: '5', label: '催收员E', department: '催收三组' },
  { value: '6', label: '催收员F', department: '催收三组' },
];

const departments = ['催收一组', '催收二组', '催收三组'];

interface TranslationKeys {
  working: string;
  statusCompleted: string;
  onLeave: string;
  holiday: string;
}

const getStatusLabel = (status: string, t: TranslationKeys) => {
  const map: Record<string, keyof TranslationKeys> = {
    'working': 'working',
    'completed': 'statusCompleted',
    'onLeave': 'onLeave',
    'holiday': 'holiday',
  };
  return t[map[status]] || status;
};

const statusColorMap: Record<string, string> = {
  'working': 'blue',
  'completed': 'green',
  'onLeave': 'orange',
  'holiday': 'purple',
};

const generateMockSchedules = (): Schedule[] => {
  const schedules: Schedule[] = [];
  const today = new Date();
  
  // 定义节假日（示例数据）
  const holidays: Record<string, boolean> = {};
  
  // 生成最近14天的排班数据
  for (let i = -7; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    collectors.forEach((collector, index) => {
      let status: Schedule['status'] = isWeekend ? 'holiday' : 'working';
      let leaveReason = undefined;
      
      // 随机生成一些请假记录
      if (!isWeekend && i >= 0 && Math.random() > 0.85) {
        status = 'onLeave';
        const reasons = ['病假', '事假', '年假', '调休'];
        leaveReason = reasons[Math.floor(Math.random() * reasons.length)];
      }
      
      // 过去的日期标记为已完成
      if (i < 0 && status === 'working') {
        status = 'completed';
      }
      
      schedules.push({
        id: `SCH-${dateStr}-${collector.value}`,
        collectorId: collector.value,
        collectorName: collector.label,
        department: collector.department,
        date: dateStr,
        status,
        leaveReason,
        createTime: new Date(date.getTime() - 86400000).toISOString().slice(0, 19).replace('T', ' '),
        createBy: '管理员',
      });
    });
  }
  
  return schedules;
};

const ScheduleManagement: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>(generateMockSchedules());
  const [modalVisible, setModalVisible] = useState(false);
  const [batchModalVisible, setBatchModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [form] = Form.useForm();
  const [batchForm] = Form.useForm();
  const [searchDate, setSearchDate] = useState<string>('');
  const [searchCollector, setSearchCollector] = useState<string>('');
  const [searchDepartment, setSearchDepartment] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [currentMonth, setCurrentMonth] = useState<string>(dayjs().format('YYYY-MM'));
  const { t } = useLanguage();

  const statistics = useMemo(() => {
    const monthSchedules = schedules.filter(s => s.date.startsWith(currentMonth));
    const completed = monthSchedules.filter(s => s.status === 'completed').length;
    const working = monthSchedules.filter(s => s.status === 'working').length;
    const onLeave = monthSchedules.filter(s => s.status === 'onLeave').length;
    const holiday = monthSchedules.filter(s => s.status === 'holiday').length;
    
    return { completed, working, onLeave, holiday, total: monthSchedules.length };
  }, [schedules, currentMonth]);

  const handleAdd = () => {
    form.resetFields();
    form.setFieldsValue({ date: dayjs(), status: 'working' });
    setEditingSchedule(null);
    setModalVisible(true);
  };

  const handleBatchAdd = () => {
    batchForm.resetFields();
    setBatchModalVisible(true);
  };

  const handleEdit = (record: Schedule) => {
    form.setFieldsValue({
      ...record,
      date: dayjs(record.date),
    });
    setEditingSchedule(record);
    setModalVisible(true);
  };

  const handleDelete = (record: Schedule) => {
    setSchedules(schedules.filter(s => s.id !== record.id));
    message.success(t.deleteSuccess);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const collector = collectors.find(c => c.value === values.collectorId);
      
      if (editingSchedule) {
        const updatedSchedule = { 
          ...editingSchedule, 
          ...values,
          date: values.date.format('YYYY-MM-DD'),
          collectorName: collector ? collector.label : editingSchedule.collectorName,
          department: collector ? collector.department : editingSchedule.department,
        };
        setSchedules(schedules.map(s => s.id === editingSchedule.id ? updatedSchedule : s));
        message.success(t.modifySuccess);
      } else {
        const newSchedule: Schedule = {
          ...values,
          id: `SCH-${values.date.format('YYYY-MM-DD')}-${values.collectorId}`,
          date: values.date.format('YYYY-MM-DD'),
          collectorName: collector ? collector.label : '',
          department: collector ? collector.department : '',
          status: values.status || 'working',
          createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
          createBy: '当前用户',
        };
        
        const exists = schedules.find(s => s.id === newSchedule.id);
        if (exists) {
          message.error(t.alreadyExists);
          return;
        }
        
        setSchedules([...schedules, newSchedule]);
        message.success(t.addSuccess);
      }
      setModalVisible(false);
    });
  };

  const handleBatchSave = () => {
    batchForm.validateFields().then((values) => {
      const { collectorIds, dateRange, status, leaveReason } = values;
      
      if (!collectorIds || collectorIds.length === 0) {
        message.error(t.pleaseSelectCollector);
        return;
      }

      if (!dateRange || dateRange.length !== 2) {
        message.error(t.pleaseSelectDateRange);
        return;
      }

      const [startDate, endDate] = dateRange;
      const start = dayjs(startDate);
      const end = dayjs(endDate);
      
      if (end.isBefore(start)) {
        message.error(t.endDateBeforeStartDate);
        return;
      }

      const newSchedules: Schedule[] = [];
      let currentDate = start;
      
      while (currentDate.isSameOrBefore(end, 'day')) {
        collectorIds.forEach((collectorId: string) => {
          const collector = collectors.find(c => c.value === collectorId);
          if (!collector) return;
          
          const id = `SCH-${currentDate.format('YYYY-MM-DD')}-${collectorId}`;
          
          if (!schedules.find(s => s.id === id) && !newSchedules.find(s => s.id === id)) {
            newSchedules.push({
              id,
              collectorId,
              collectorName: collector.label,
              department: collector.department,
              date: currentDate.format('YYYY-MM-DD'),
              status: status as Schedule['status'],
              leaveReason: status === 'onLeave' ? leaveReason : undefined,
              createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
              createBy: '当前用户',
            });
          }
        });
        currentDate = currentDate.add(1, 'day');
      }

      if (newSchedules.length > 0) {
        setSchedules([...schedules, ...newSchedules]);
        message.success(`${t.addSuccess} ${newSchedules.length} ${t.items}`);
      } else {
        message.warning(t.noNewRecords);
      }
      
      setBatchModalVisible(false);
    });
  };

  const handleExport = () => {
    const dataToExport = filteredSchedules.map(s => ({
      '催收员': s.collectorName,
      '部门': s.department,
      '日期': s.date,
      '状态': s.status === 'working' ? '工作中' : s.status === 'completed' ? '已完成' : s.status === 'onLeave' ? '请假' : '节假日',
      '请假原因': s.leaveReason || '',
    }));

    const headers = ['催收员', '部门', '日期', '状态', '请假原因'];
    const csvContent = [
      headers.join(','),
      ...dataToExport.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `排班记录_${dayjs().format('YYYYMMDD')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    message.success('导出成功');
  };

  const handleMarkCompleted = (record: Schedule) => {
    if (record.status === 'working') {
      setSchedules(schedules.map(s => 
        s.id === record.id ? { ...s, status: 'completed' } : s
      ));
      message.success('已标记为已完成');
    }
  };

  const handleMarkOnLeave = (record: Schedule) => {
    setSchedules(schedules.map(s => 
      s.id === record.id ? { ...s, status: 'onLeave', leaveReason: '事假' } : s
    ));
    message.success('已标记为请假');
  };

  const filteredSchedules = useMemo(() => {
    return schedules.filter(schedule => {
      const matchesDate = !searchDate || schedule.date === searchDate;
      const matchesCollector = !searchCollector || schedule.collectorId === searchCollector;
      const matchesDepartment = !searchDepartment || schedule.department === searchDepartment;
      return matchesDate && matchesCollector && matchesDepartment;
    }).sort((a, b) => {
      return a.date.localeCompare(b.date);
    });
  }, [schedules, searchDate, searchCollector, searchDepartment]);

  const columns: ColumnsType<Schedule> = [
    {
      title: t.collectorName,
      dataIndex: 'collectorName',
      key: 'collectorName',
      width: 120,
      fixed: 'left',
      render: (name: string, record: Schedule) => (
        <Space align="center">
          <UserOutlined />
          <span>{name}</span>
        </Space>
      ),
    },
    {
      title: t.department,
      dataIndex: 'department',
      key: 'department',
      width: 100,
      render: (dept: string) => (
        <Tag color="blue">{dept}</Tag>
      ),
    },
    {
      title: t.date,
      dataIndex: 'date',
      key: 'date',
      width: 100,
      sorter: (a, b) => a.date.localeCompare(b.date),
      render: (date: string) => {
        const today = new Date().toISOString().split('T')[0];
        const isToday = date === today;
        return (
          <Space align="center">
            <CalendarOutlined style={{ color: isToday ? '#1890ff' : undefined }} />
            <span style={{ color: isToday ? '#1890ff' : undefined, fontWeight: isToday ? 'bold' : undefined }}>
              {date}
            </span>
          </Space>
        );
      },
    },
    {
      title: t.status,
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string, record: Schedule) => (
        <Space direction="vertical" size={0}>
          <Tag color={statusColorMap[status]}>
            {getStatusLabel(status, t)}
          </Tag>
          {record.leaveReason && (
            <span style={{ fontSize: 11, color: '#999', display: 'flex', alignItems: 'center' }}>
              <FileTextOutlined style={{ fontSize: 10, marginRight: 4 }} />
              {record.leaveReason}
            </span>
          )}
        </Space>
      ),
    },
    {
      title: t.action,
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          {record.status === 'working' && (
            <>
              <Tooltip title={t.markCompleted}>
                <Button 
                  type="link" 
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleMarkCompleted(record)}
                  style={{ color: '#52c41a' }}
                />
              </Tooltip>
              <Tooltip title={t.markOnLeave}>
                <Button 
                  type="link" 
                  icon={<CloseCircleOutlined />}
                  onClick={() => handleMarkOnLeave(record)}
                  style={{ color: '#faad14' }}
                />
              </Tooltip>
            </>
          )}
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            {t.edit}
          </Button>
          <Popconfirm
            title={t.deleteConfirmContent}
            onConfirm={() => handleDelete(record)}
            okText={t.confirm}
            cancelText={t.cancel}
          >
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const getDateSchedules = (date: string) => {
    return schedules.filter(schedule => schedule.date === date);
  };

  const dateCellRender = (date: dayjs.Dayjs) => {
    const dateString = date.format('YYYY-MM-DD');
    const dateSchedules = getDateSchedules(dateString);
    
    if (dateSchedules.length > 0) {
      const workingCount = dateSchedules.filter(s => s.status === 'working' || s.status === 'completed').length;
      const leaveCount = dateSchedules.filter(s => s.status === 'onLeave').length;
      const holidayCount = dateSchedules.filter(s => s.status === 'holiday').length;
      const totalCount = dateSchedules.length;
      
      let badgeColor = '#1890ff';
      if (holidayCount === totalCount) {
        badgeColor = '#722ed1';
      } else if (leaveCount === totalCount) {
        badgeColor = '#fa8c16';
      } else if (workingCount === totalCount) {
        badgeColor = '#52c41a';
      }
      
      return (
        <Tooltip title={`${dateString}: ${workingCount}人上班, ${leaveCount}人请假`}>
          <Badge 
            count={totalCount} 
            style={{ backgroundColor: badgeColor }}
            offset={[4, 0]}
          />
        </Tooltip>
      );
    }
    return null;
  };

  const onDateSelect = (date: dayjs.Dayjs) => {
    const dateString = date.format('YYYY-MM-DD');
    setSelectedDate(dateString);
    setSearchDate(dateString);
  };

  const onPanelChange = (date: dayjs.Dayjs) => {
    setCurrentMonth(date.format('YYYY-MM'));
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>{t.scheduleManagementTitle}</h2>
        <Space>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>
            {t.export}
          </Button>
          <Button icon={<CalendarOutlined />} onClick={handleBatchAdd}>
            {t.batchSchedule}
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            {t.addSchedule}
          </Button>
        </Space>
      </div>
      
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card variant="borderless">
            <Statistic
              title={t.scheduled}
              value={statistics.total - statistics.holiday}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless">
            <Statistic
              title={t.statusCompleted}
              value={statistics.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless">
            <Statistic
              title={t.onLeave}
              value={statistics.onLeave}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless">
            <Statistic
              title={t.pending}
              value={statistics.working}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>
      
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, minHeight: 550 }}>
        <Card title={t.scheduleCalendar} variant="borderless" style={{ height: '100%' }}>
          <Calendar
            onSelect={onDateSelect}
            cellRender={dateCellRender}
            value={dayjs(selectedDate)}
            onPanelChange={onPanelChange}
          />
          <div style={{ marginTop: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
            <h4 style={{ margin: '0 0 8px 0' }}>{t.todaySchedule} ({selectedDate})</h4>
            <ul style={{ margin: 0, paddingLeft: 20, maxHeight: 200, overflowY: 'auto' }}>
              {getDateSchedules(selectedDate).map(schedule => (
                <li key={schedule.id} style={{ marginBottom: 8, padding: '4px 0', borderBottom: '1px dashed #ddd' }}>
                  <Space>
                    <UserOutlined />
                    <span style={{ fontWeight: 500 }}>{schedule.collectorName}</span>
                    <Tag color={statusColorMap[schedule.status]}>
                      {getStatusLabel(schedule.status, t)}
                    </Tag>
                    {schedule.leaveReason && (
                      <span style={{ fontSize: 11, color: '#999' }}>({schedule.leaveReason})</span>
                    )}
                  </Space>
                </li>
              ))}
              {getDateSchedules(selectedDate).length === 0 && (
                <li style={{ color: '#999' }}>{t.noScheduleToday}</li>
              )}
            </ul>
          </div>
        </Card>
        
        <Card title={t.scheduleList} variant="borderless" style={{ height: '100%' }}>
          <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <DatePicker
              placeholder={t.selectDate}
              value={searchDate ? dayjs(searchDate) : null}
              onChange={(date) => setSearchDate(date ? date.format('YYYY-MM-DD') : '')}
              allowClear
            />
            <Select
              placeholder={t.selectCollector}
              value={searchCollector || undefined}
              onChange={(value) => setSearchCollector(value || '')}
              style={{ width: 150 }}
              allowClear
              options={[
                { value: '', label: t.allCollectors || t.all },
                ...collectors.map(collector => ({ value: collector.value, label: collector.label })),
              ]}
            />
            <Select
              placeholder={t.selectDepartment}
              value={searchDepartment || undefined}
              onChange={(value) => setSearchDepartment(value || '')}
              style={{ width: 130 }}
              allowClear
              options={[
                { value: '', label: t.allDepartments || t.all },
                ...departments.map(dept => ({ value: dept, label: dept })),
              ]}
            />
            {(searchDate || searchCollector || searchDepartment) && (
              <Button onClick={() => {
                setSearchDate('');
                setSearchCollector('');
                setSearchDepartment('');
              }}>
                {t.resetFilter}
              </Button>
            )}
          </div>
          <Table
            columns={columns}
            dataSource={filteredSchedules}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              showTotal: (total) => `共 ${total} 条`,
              showQuickJumper: true,
            }}
            size="small"
            scroll={{ x: 800 }}
          />
        </Card>
      </div>
      
      <Modal
        title={editingSchedule ? t.editSchedule : t.addSchedule}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="collectorId"
            label={t.collectorName}
            rules={[{ required: true, message: t.pleaseSelect + t.collectorName }]}
          >
            <Select
              placeholder={t.pleaseSelect + t.collectorName}
              disabled={!!editingSchedule}
              options={collectors.map(collector => ({
                value: collector.value,
                label: `${collector.label} (${collector.department})`,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="date"
            label={t.date}
            rules={[{ required: true, message: t.pleaseSelect + t.date }]}
          >
            <DatePicker style={{ width: '100%' }} disabled={!!editingSchedule} />
          </Form.Item>
          <Form.Item
            name="status"
            label={t.status}
            rules={[{ required: true, message: t.pleaseSelect + t.status }]}
          >
            <Select
              placeholder={t.pleaseSelect + t.status}
              options={[
                { value: 'working', label: t.working },
                { value: 'completed', label: t.statusCompleted },
                { value: 'onLeave', label: t.onLeave },
                { value: 'holiday', label: t.holiday },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="leaveReason"
            label={t.leaveReason}
            dependencies={['status']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (getFieldValue('status') === 'onLeave' && !value) {
                    return Promise.reject(new Error(t.pleaseSelect + t.leaveReason));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Select
              placeholder={t.pleaseSelect + t.leaveReason}
              disabled={form.getFieldValue('status') !== 'onLeave'}
              options={[
                { value: '病假', label: t.sickLeave },
                { value: '事假', label: t.personalLeave },
                { value: '年假', label: t.annualLeave },
                { value: '调休', label: t.compensatoryLeave },
                { value: '其他', label: t.otherLeave },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
      
      <Modal
        title={t.batchSchedule}
        open={batchModalVisible}
        onOk={handleBatchSave}
        onCancel={() => setBatchModalVisible(false)}
        width={500}
      >
        <Form form={batchForm} layout="vertical">
          <Form.Item
            name="collectorIds"
            label={t.collectorName}
            rules={[{ required: true, message: t.pleaseSelect + t.collectorName }]}
          >
            <Select
              mode="multiple"
              placeholder={t.pleaseSelect + t.collectorName}
              options={collectors.map(collector => ({
                value: collector.value,
                label: `${collector.label} (${collector.department})`,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="dateRange"
            label={t.dateRange}
            rules={[{ required: true, message: t.pleaseSelectDateRange || t.pleaseSelect + t.date }]}
          >
            <DatePicker.RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="status"
            label={t.status}
            rules={[{ required: true, message: t.pleaseSelect + t.status }]}
          >
            <Select
              placeholder={t.pleaseSelect + t.status}
              options={[
                { value: 'working', label: t.working },
                { value: 'onLeave', label: t.onLeave },
                { value: 'holiday', label: t.holiday },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="leaveReason"
            label={t.leaveReason}
            dependencies={['status']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (getFieldValue('status') === 'onLeave' && !value) {
                    return Promise.reject(new Error(t.pleaseSelect + t.leaveReason));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Select
              placeholder={t.pleaseSelect + t.leaveReason}
              disabled={batchForm.getFieldValue('status') !== 'onLeave'}
              options={[
                { value: '病假', label: t.sickLeave },
                { value: '事假', label: t.personalLeave },
                { value: '年假', label: t.annualLeave },
                { value: '调休', label: t.compensatoryLeave },
                { value: '其他', label: t.otherLeave },
              ]}
            />
          </Form.Item>
        </Form>
        <div style={{ marginTop: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#666' }}>{t.tips || 'Tips'}</h4>
          <ul style={{ margin: 0, paddingLeft: 20, color: '#999', fontSize: 12 }}>
            <li>{t.batchScheduleSkipExisting || 'Batch scheduling will skip existing records'}</li>
            <li>{t.ensureDateRangeCorrect || 'Please ensure date range is correct'}</li>
            <li>{t.suggestMax30Days || 'Suggest max 30 days per batch'}</li>
          </ul>
        </div>
      </Modal>
    </div>
  );
};

export default ScheduleManagement;