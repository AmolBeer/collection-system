import React, { useState } from 'react';
import { Card, Form, Select, Button, message, Modal, Alert, Space, InputNumber, DatePicker, Checkbox, Input } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface RecoveryConfig {
  sendChannel: string;
  templateId: string;
  sendType: string;
  scheduledTime?: string;
  pushName?: string;
  pushTitle?: string;
  pushBody?: string;
  overdueDaysFrom: number;
  overdueDaysTo: number;
  productIds: string[];
}

const RecoveryManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [sendConfig, setSendConfig] = useState<RecoveryConfig | null>(null);
  const [sendChannel, setSendChannel] = useState('SMS');

  const smsTemplates = [
    { id: '1', name: '还款提醒模板', content: '尊敬的{name}，您的还款金额为{totalAmount}元，还款日期为{billDueDate}，请及时还款。' },
    { id: '2', name: '逾期提醒模板', content: '尊敬的{name}，您的贷款已逾期{overdueDays}天，请尽快处理以免影响您的信用记录。' },
    { id: '3', name: '催收模板A', content: '{name}您好，您在{productName}的贷款已逾期{overdueDays}天，应还总额{totalAmount}元，请尽快还款。' },
  ];

  const sendChannels = [
    { value: 'SMS', label: '短信' },
    { value: 'Push', label: 'APP Push' },
  ];

  const sendTypes = [
    { value: 'immediate', label: '立即发送' },
    { value: 'scheduled', label: '定时发送' },
  ];

  const products = [
    { id: 'P001', name: '信用贷A' },
    { id: 'P002', name: '消费贷B' },
    { id: 'P003', name: '分期贷C' },
    { id: 'P004', name: '应急贷D' },
  ];

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      setSendConfig(values as RecoveryConfig);
      setConfirmModalVisible(true);
    });
  };

  const handleConfirmSend = () => {
    if (!sendConfig) return;

    setConfirmModalVisible(false);
    
    const productNames = sendConfig.productIds.map(id => products.find(p => p.id === id)?.name).filter(Boolean).join(', ');
    
    if (sendConfig.sendType === 'scheduled') {
      message.success(`定时催收任务已预约，将在 ${sendConfig.scheduledTime} 通过 ${sendConfig.sendChannel === 'SMS' ? '短信' : 'APP Push'} 发送，逾期区间：${sendConfig.overdueDaysFrom}~${sendConfig.overdueDaysTo}天，产品：${productNames}`);
    } else {
      message.success(`催收任务已提交！将通过 ${sendConfig.sendChannel === 'SMS' ? '短信' : 'APP Push'} 发送，逾期区间：${sendConfig.overdueDaysFrom}~${sendConfig.overdueDaysTo}天，产品：${productNames}`);
    }
    
    form.resetFields();
  };

  return (
    <div>
      <Card variant="borderless">
        <Form form={form} layout="vertical">
          <Form.Item
            name="sendChannel"
            label="发送方式"
            rules={[{ required: true, message: '请选择发送方式' }]}
          >
            <Select
              placeholder="请选择发送方式"
              options={sendChannels}
              onChange={(value) => {
                setSendChannel(value);
                form.resetFields(['templateId', 'pushName', 'pushTitle', 'pushBody']);
              }}
            />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.sendChannel !== curr.sendChannel}
          >
            {() => (
              sendChannel === 'SMS' ? (
                <Form.Item
                  name="templateId"
                  label="短信模板"
                  rules={[{ required: true, message: '请选择短信模板' }]}
                >
                  <Select
                    placeholder="请选择短信模板"
                    options={smsTemplates.map(t => ({ value: t.id, label: t.name }))}
                  />
                </Form.Item>
              ) : (
                <>
                  <Form.Item
                    name="pushName"
                    label="推送名称"
                    rules={[{ required: true, message: '请输入推送名称' }]}
                  >
                    <Input placeholder="请输入推送名称" />
                  </Form.Item>
                  <Form.Item
                    name="pushTitle"
                    label="推送标题"
                    rules={[{ required: true, message: '请输入推送标题' }]}
                  >
                    <Input placeholder="请输入推送标题" />
                  </Form.Item>
                  <Form.Item
                    name="pushBody"
                    label="推送内容"
                    rules={[{ required: true, message: '请输入推送内容' }]}
                  >
                    <Input.TextArea rows={3} placeholder="请输入推送内容" />
                  </Form.Item>
                </>
              )
            )}
          </Form.Item>

          <Form.Item label="逾期天数区间">
            <Space.Compact style={{ width: '100%' }}>
              <Form.Item
                name="overdueDaysFrom"
                rules={[{ required: true, message: '请输入起始天数' }]}
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="从"
                  min={-30}
                  max={999}
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <span style={{ padding: '0 8px', color: '#999' }}>天</span>
              <span style={{ padding: '0 8px', color: '#999' }}>至</span>
              <Form.Item
                name="overdueDaysTo"
                rules={[{ required: true, message: '请输入结束天数' }]}
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  placeholder="到"
                  min={-30}
                  max={999}
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <span style={{ padding: '0 8px', color: '#999' }}>天</span>
            </Space.Compact>
            <p style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
              负数表示提前提醒（如-7表示到期前7天），正数表示逾期天数
            </p>
          </Form.Item>

          <Form.Item
            name="productIds"
            label="选择产品"
            rules={[{ required: true, message: '请至少选择一个产品' }]}
          >
            <Checkbox.Group
              options={products.map(p => ({ label: p.name, value: p.id }))}
            />
          </Form.Item>

          <Form.Item
            name="sendType"
            label="发送类型"
            rules={[{ required: true, message: '请选择发送类型' }]}
          >
            <Select
              placeholder="请选择发送类型"
              options={sendTypes}
              onChange={(value) => {
                if (value === 'immediate') {
                  form.resetFields(['scheduledTime']);
                }
              }}
            />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.sendType !== curr.sendType}
          >
            {() => {
              const sendType = form.getFieldValue('sendType');
              if (sendType === 'scheduled') {
                return (
                  <Form.Item
                    name="scheduledTime"
                    label="定时时间"
                    rules={[{ required: true, message: '请选择定时时间' }]}
                  >
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      disabledDate={(current) => current && current < dayjs().startOf('day')}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                );
              }
              return null;
            }}
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              icon={<SendOutlined />} 
              onClick={handleSubmit}
              style={{ marginTop: 16 }}
            >
              提交
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Modal
        title="确认发送"
        open={confirmModalVisible}
        onOk={handleConfirmSend}
        onCancel={() => setConfirmModalVisible(false)}
        okText="确认发送"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            message="重要提示"
            description="确认创建催收发送任务？发送后不可撤回。"
            type="error"
            showIcon
          />
          
          <div>
            <strong>发送信息：</strong>
            <ul style={{ marginTop: 8, paddingLeft: 20 }}>
              <li>发送渠道：{sendChannels.find(c => c.value === sendConfig?.sendChannel)?.label}</li>
              {sendChannel === 'SMS' && (
                <li>模板：{smsTemplates.find(s => s.id === sendConfig?.templateId)?.name}</li>
              )}
              <li>逾期天数区间：{sendConfig?.overdueDaysFrom} ~ {sendConfig?.overdueDaysTo} 天</li>
              <li>产品：{sendConfig?.productIds.map(id => products.find(p => p.id === id)?.name).filter(Boolean).join(', ')}</li>
              <li>发送类型：{sendTypes.find(s => s.value === sendConfig?.sendType)?.label}</li>
              {sendConfig?.sendType === 'scheduled' && (
                <li>定时时间：{sendConfig.scheduledTime}</li>
              )}
            </ul>
          </div>
        </Space>
      </Modal>
    </div>
  );
};

export default RecoveryManagement;