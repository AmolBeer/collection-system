import React, { useState } from 'react';
import { Modal, Tabs, Card, Descriptions, Table, Button, Form, Input, InputNumber, Select, DatePicker, Tag, Space, message, List, Avatar, Badge } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, PhoneOutlined, UserOutlined, HomeOutlined, CreditCardOutlined, FileTextOutlined, HistoryOutlined } from '@ant-design/icons';
import { useLanguage } from '../../i18n/LanguageContext';

interface Case {
  id: string;
  borrowerName: string;
  phone: string;
  overdueDays: number;
  amount: number;
  stage: string;
  status: string;
  assignedTo: string;
  createTime: string;
  lastUpdateTime: string;
}

interface BasicInfo {
  id: string;
  name: string;
  gender: string;
  age: number;
  idCard: string;
  phone: string;
  email: string;
  address: string;
}

interface WorkInfo {
  company: string;
  position: string;
  workPhone: string;
  workAddress: string;
  monthlyIncome: number;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  address: string;
}

interface OrderInfo {
  orderId: string;
  product: string;
  amount: number;
  loanDate: string;
  dueDate: string;
  status: string;
}

interface BillInfo {
  billId: string;
  orderId: string;
  amount: number;
  dueDate: string;
  paidAmount: number;
  status: string;
}

interface VAInfo {
  vaId: string;
  bank: string;
  vaNumber: string;
  amount: number;
  createTime: string;
  expireTime: string;
  status: string;
}

interface CollectionRecord {
  id: string;
  collector: string;
  type: string;
  content: string;
  result: string;
  createTime: string;
}

interface CaseDetailProps {
  visible: boolean;
  caseData: Case;
  onClose: () => void;
}

const CaseDetail: React.FC<CaseDetailProps> = ({ visible, caseData, onClose }) => {
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [newRecord, setNewRecord] = useState('');
  const [recordType, setRecordType] = useState('电话');
  const [recordResult, setRecordResult] = useState('未联系上');
  const [newVARequest, setNewVARequest] = useState(false);
  const [vaAmount, setVaAmount] = useState(caseData.amount);
  const [reductionRequest, setReductionRequest] = useState(false);
  const [reductionAmount, setReductionAmount] = useState(0);
  const [stopCollectionRequest, setStopCollectionRequest] = useState(false);
  const [stopReason, setStopReason] = useState('');
  const { t } = useLanguage();

  // 模拟数据
  const basicInfo: BasicInfo = {
    id: '1001',
    name: caseData.borrowerName,
    gender: '男',
    age: 30,
    idCard: '110101199001011234',
    phone: caseData.phone,
    email: 'zhangsan@example.com',
    address: '北京市朝阳区某某街道123号',
  };

  const workInfo: WorkInfo = {
    company: 'ABC科技有限公司',
    position: '软件工程师',
    workPhone: '010-12345678',
    workAddress: '北京市海淀区中关村科技园区',
    monthlyIncome: 20000,
  };

  const emergencyContacts: EmergencyContact[] = [
    { name: '李四', relationship: '配偶', phone: '13800138002', address: '北京市朝阳区某某街道123号' },
    { name: '王五', relationship: '父亲', phone: '13800138003', address: '河北省石家庄市某某县' },
  ];

  const orderInfo: OrderInfo = {
    orderId: 'ORDER-001',
    product: '消费贷',
    amount: caseData.amount,
    loanDate: '2024-01-01',
    dueDate: '2024-02-01',
    status: '逾期',
  };

  const billInfo: BillInfo[] = [
    { billId: 'BILL-001', orderId: 'ORDER-001', amount: 5000, dueDate: '2024-02-01', paidAmount: 0, status: '逾期' },
    { billId: 'BILL-002', orderId: 'ORDER-001', amount: 5000, dueDate: '2024-03-01', paidAmount: 0, status: '逾期' },
  ];

  const vaInfo: VAInfo[] = [
    { vaId: 'VA-001', bank: '中国银行', vaNumber: '6228481234567890123', amount: caseData.amount, createTime: '2024-03-15', expireTime: '2024-04-15', status: '有效' },
  ];

  const collectionRecords: CollectionRecord[] = [
    { id: 'REC-001', collector: '催收员A', type: '电话', content: '联系借款人，承诺3天内还款', result: '已承诺还款', createTime: '2024-03-30 14:30:00' },
    { id: 'REC-002', collector: '催收员A', type: '短信', content: '发送还款提醒短信', result: '已读未回复', createTime: '2024-03-29 09:45:00' },
    { id: 'REC-003', collector: '催收员A', type: '电话', content: '联系借款人，无人接听', result: '未联系上', createTime: '2024-03-28 11:30:00' },
  ];

  const handleAddRecord = () => {
    if (!newRecord) {
      message.error('请输入催收记录');
      return;
    }
    // 这里可以添加新记录的逻辑
    message.success('催收记录添加成功');
    setNewRecord('');
  };

  const handleCreateVA = () => {
    // 这里可以添加创建VA码的逻辑
    message.success('VA码创建成功');
    setNewVARequest(false);
  };

  const handleSubmitReduction = () => {
    // 这里可以添加减免申请的逻辑
    message.success('减免申请提交成功');
    setReductionRequest(false);
  };

  const handleSubmitStopCollection = () => {
    if (!stopReason) {
      message.error('请输入停催原因');
      return;
    }
    // 这里可以添加停催申请的逻辑
    message.success('停催申请提交成功');
    setStopCollectionRequest(false);
  };

  return (
    <Modal
      title={`案件详情 - ${caseData.id}`}
      open={visible}
      onCancel={onClose}
      width={1000}
      footer={null}
    >
      <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            items={[
              {
                key: 'basic',
                label: '基本信息',
                children: (
                  <>
                    <Card style={{ marginBottom: 16 }}>
                      <Descriptions title="个人基本信息" column={2}>
                        <Descriptions.Item label="姓名">{basicInfo.name}</Descriptions.Item>
                        <Descriptions.Item label="性别">{basicInfo.gender}</Descriptions.Item>
                        <Descriptions.Item label="年龄">{basicInfo.age}岁</Descriptions.Item>
                        <Descriptions.Item label="身份证号">{basicInfo.idCard}</Descriptions.Item>
                        <Descriptions.Item label="电话">{basicInfo.phone}</Descriptions.Item>
                        <Descriptions.Item label="邮箱">{basicInfo.email}</Descriptions.Item>
                        <Descriptions.Item label="地址" span={2}>{basicInfo.address}</Descriptions.Item>
                      </Descriptions>
                    </Card>
                    <Card style={{ marginBottom: 16 }}>
                      <Descriptions title="工作信息" column={2}>
                        <Descriptions.Item label="公司名称">{workInfo.company}</Descriptions.Item>
                        <Descriptions.Item label="职位">{workInfo.position}</Descriptions.Item>
                        <Descriptions.Item label="工作电话">{workInfo.workPhone}</Descriptions.Item>
                        <Descriptions.Item label="月收入">¥{workInfo.monthlyIncome.toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="工作地址" span={2}>{workInfo.workAddress}</Descriptions.Item>
                      </Descriptions>
                    </Card>
                    <Card>
                      <Descriptions title="紧急联系人" column={1}>
                        {emergencyContacts.map((contact, index) => (
                          <Descriptions.Item key={index} label={`联系人 ${index + 1}`}>
                            <div>
                              <p>姓名：{contact.name}</p>
                              <p>关系：{contact.relationship}</p>
                              <p>电话：{contact.phone}</p>
                              <p>地址：{contact.address}</p>
                            </div>
                          </Descriptions.Item>
                        ))}
                      </Descriptions>
                    </Card>
                  </>
                ),
              },
              {
                key: 'order',
                label: '订单信息',
                children: (
                  <>
                    <Card style={{ marginBottom: 16 }}>
                      <Descriptions title="订单信息" column={2}>
                        <Descriptions.Item label="订单ID">{orderInfo.orderId}</Descriptions.Item>
                        <Descriptions.Item label="产品">{orderInfo.product}</Descriptions.Item>
                        <Descriptions.Item label="借款金额">¥{orderInfo.amount.toLocaleString()}</Descriptions.Item>
                        <Descriptions.Item label="借款日期">{orderInfo.loanDate}</Descriptions.Item>
                        <Descriptions.Item label="到期日期">{orderInfo.dueDate}</Descriptions.Item>
                        <Descriptions.Item label="状态">
                          <Tag color="red">{orderInfo.status}</Tag>
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                    <Card>
                      <h3>账单信息</h3>
                      <Table
                        dataSource={billInfo}
                        columns={[
                          { title: '账单ID', dataIndex: 'billId', key: 'billId' },
                          { title: '订单ID', dataIndex: 'orderId', key: 'orderId' },
                          { title: '账单金额', dataIndex: 'amount', key: 'amount', render: (amount: number) => `¥${amount.toLocaleString()}` },
                          { title: '到期日期', dataIndex: 'dueDate', key: 'dueDate' },
                          { title: '已还金额', dataIndex: 'paidAmount', key: 'paidAmount', render: (amount: number) => `¥${amount.toLocaleString()}` },
                          { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color="red">{status}</Tag> },
                        ]}
                        rowKey="billId"
                        size="small"
                        pagination={false}
                      />
                    </Card>
                  </>
                ),
              },
              {
                key: 'va',
                label: 'VA码管理',
                children: (
                  <>
                    <Card style={{ marginBottom: 16 }}>
                      <h3>当前有效VA码</h3>
                      <Table
                        dataSource={vaInfo.filter(va => va.status === '有效')}
                        columns={[
                          { title: 'VA ID', dataIndex: 'vaId', key: 'vaId' },
                          { title: '银行', dataIndex: 'bank', key: 'bank' },
                          { title: 'VA号码', dataIndex: 'vaNumber', key: 'vaNumber' },
                          { title: '金额', dataIndex: 'amount', key: 'amount', render: (amount: number) => `¥${amount.toLocaleString()}` },
                          { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
                          { title: '过期时间', dataIndex: 'expireTime', key: 'expireTime' },
                          { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color="green">{status}</Tag> },
                        ]}
                        rowKey="vaId"
                        size="small"
                        pagination={false}
                      />
                    </Card>
                    <Card>
                      <h3>操作</h3>
                      {newVARequest ? (
                        <Form layout="vertical" onFinish={handleCreateVA}>
                          <Form.Item
                            label="VA金额"
                            name="amount"
                            rules={[{ required: true, message: '请输入VA金额' }]}
                          >
                            <InputNumber
                              min={0}
                              max={caseData.amount}
                              value={vaAmount}
                              onChange={setVaAmount}
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                          <Form.Item
                            label="银行"
                            name="bank"
                            rules={[{ required: true, message: '请选择银行' }]}
                          >
                            <Select
                              options={[
                                { value: '中国银行', label: '中国银行' },
                                { value: '工商银行', label: '工商银行' },
                                { value: '建设银行', label: '建设银行' },
                                { value: '农业银行', label: '农业银行' },
                              ]}
                            />
                          </Form.Item>
                          <Space>
                            <Button type="primary" htmlType="submit">创建VA码</Button>
                            <Button onClick={() => setNewVARequest(false)}>取消</Button>
                          </Space>
                        </Form>
                      ) : (
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => setNewVARequest(true)}>
                          创建新VA码
                        </Button>
                      )}
                    </Card>
                  </>
                ),
              },
              {
                key: 'apply',
                label: '申请管理',
                children: (
                  <>
                    <Card style={{ marginBottom: 16 }}>
                      <h3>减免申请</h3>
                      {reductionRequest ? (
                        <Form layout="vertical" onFinish={handleSubmitReduction}>
                          <Form.Item
                            label="减免金额"
                            name="amount"
                            rules={[{ required: true, message: '请输入减免金额' }]}
                          >
                            <InputNumber
                              min={0}
                              max={caseData.amount}
                              value={reductionAmount}
                              onChange={setReductionAmount}
                              style={{ width: '100%' }}
                            />
                          </Form.Item>
                          <Form.Item
                            label="减免原因"
                            name="reason"
                            rules={[{ required: true, message: '请输入减免原因' }]}
                          >
                            <Input.TextArea rows={4} placeholder="请输入减免原因" />
                          </Form.Item>
                          <Space>
                            <Button type="primary" htmlType="submit">提交申请</Button>
                            <Button onClick={() => setReductionRequest(false)}>取消</Button>
                          </Space>
                        </Form>
                      ) : (
                        <Button type="primary" onClick={() => setReductionRequest(true)}>
                          申请减免
                        </Button>
                      )}
                    </Card>
                    <Card>
                      <h3>停催申请</h3>
                      {stopCollectionRequest ? (
                        <Form layout="vertical" onFinish={handleSubmitStopCollection}>
                          <Form.Item
                            label="停催原因"
                            name="reason"
                            rules={[{ required: true, message: '请输入停催原因' }]}
                          >
                            <Input.TextArea
                              rows={4}
                              placeholder="请输入停催原因"
                              value={stopReason}
                              onChange={(e) => setStopReason(e.target.value)}
                            />
                          </Form.Item>
                          <Form.Item
                            label="停催期限"
                            name="duration"
                            rules={[{ required: true, message: '请选择停催期限' }]}
                          >
                            <Select
                              options={[
                                { value: '7', label: '7天' },
                                { value: '15', label: '15天' },
                                { value: '30', label: '30天' },
                              ]}
                            />
                          </Form.Item>
                          <Space>
                            <Button type="primary" htmlType="submit">提交申请</Button>
                            <Button onClick={() => setStopCollectionRequest(false)}>取消</Button>
                          </Space>
                        </Form>
                      ) : (
                        <Button type="primary" onClick={() => setStopCollectionRequest(true)}>
                          申请停催
                        </Button>
                      )}
                    </Card>
                  </>
                ),
              },
              {
                key: 'records',
                label: '催收记录',
                children: (
                  <>
                    <Card style={{ marginBottom: 16 }}>
                      <Form layout="vertical" onFinish={handleAddRecord}>
                        <Form.Item
                          label="催收方式"
                          name="type"
                          rules={[{ required: true, message: '请选择催收方式' }]}
                        >
                          <Select
                            value={recordType}
                            onChange={setRecordType}
                            options={[
                              { value: '电话', label: '电话' },
                              { value: '短信', label: '短信' },
                              { value: '上门', label: '上门' },
                              { value: '邮件', label: '邮件' },
                            ]}
                          />
                        </Form.Item>
                        <Form.Item
                          label="催收内容"
                          name="content"
                          rules={[{ required: true, message: '请输入催收内容' }]}
                        >
                          <Input.TextArea
                            rows={4}
                            placeholder="请输入催收内容"
                            value={newRecord}
                            onChange={(e) => setNewRecord(e.target.value)}
                          />
                        </Form.Item>
                        <Form.Item
                          label="催收结果"
                          name="result"
                          rules={[{ required: true, message: '请选择催收结果' }]}
                        >
                          <Select
                            value={recordResult}
                            onChange={setRecordResult}
                            options={[
                              { value: '未联系上', label: '未联系上' },
                              { value: '已承诺还款', label: '已承诺还款' },
                              { value: '已还款', label: '已还款' },
                              { value: '拒绝还款', label: '拒绝还款' },
                            ]}
                          />
                        </Form.Item>
                        <Button type="primary" htmlType="submit">添加催收记录</Button>
                      </Form>
                    </Card>
                    <Card>
                      <h3>历史催收记录</h3>
                      <List
                        dataSource={collectionRecords}
                        rowKey="id"
                        renderItem={(record) => (
                          <List.Item>
                            <List.Item.Meta
                              avatar={<Avatar>{record.collector.charAt(0)}</Avatar>}
                              title={
                                <div>
                                  <span>{record.collector} - {record.type}</span>
                                  <Badge style={{ marginLeft: 8 }} status={record.result === '已还款' ? 'success' : record.result === '已承诺还款' ? 'processing' : 'default'} text={record.result} />
                                </div>
                              }
                              description={
                                <div>
                                  <p>{record.content}</p>
                                  <p style={{ color: '#999', fontSize: 12 }}>{record.createTime}</p>
                                </div>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </Card>
                  </>
                ),
              },
            ]}
          />
    </Modal>
  );
};

export default CaseDetail;