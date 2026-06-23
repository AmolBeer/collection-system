import React, { useState, useEffect } from 'react';
import { Card, Form, Select, Button, message, Modal, Alert, Space, Input, DatePicker } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface SendConfig {
  groupId: string;
  templateId: string;
  sendChannel: string;
  sendType: string;
  scheduledTime?: string;
  pushName?: string;
  pushTitle?: string;
  pushBody?: string;
  jumpType?: string;
  page?: string;
  h5Url?: string;
  sendCount?: number;
}

const MAX_SEND_COUNT = 10000;

const SendManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [_sending, setSending] = useState(false);
  const [_sendProgress, setSendProgress] = useState(0);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [sendConfig, setSendConfig] = useState<SendConfig | null>(null);
  const [sendChannel, setSendChannel] = useState('SMS');
  const [jumpType, setJumpType] = useState<string>('');

  const customerGroups = [
    { id: '1', name: '逾期客户群A', count: 5 },
    { id: '2', name: '逾期客户群B', count: 8 },
  ];

  const smsTemplates = [
    { id: '1', name: '还款提醒模板', content: '尊敬的{name}，您的还款金额为{amount}元，还款日期为{date}，请及时还款。' },
    { id: '2', name: '逾期提醒模板', content: '尊敬的{name}，您的贷款已逾期{days}天，请尽快处理以免影响您的信用记录。' },
  ];

  const sendChannels = [
    { value: 'SMS', label: '短信' },
    { value: 'Push', label: 'APP Push' },
  ];

  const sendTypes = [
    { value: 'immediate', label: '立即发送' },
    { value: 'scheduled', label: '定时发送' },
  ];

  const jumpTypes = [
    { value: 'home', label: 'APP 首页' },
    { value: 'page', label: '指定页面' },
    { value: 'h5', label: 'H5链接' },
  ];

  const pageOptions = [
    { value: 'home', label: '首页' },
    { value: 'credit', label: '授信资料提交' },
    { value: 'loan', label: '申请放款' },
    { value: 'repayment', label: '还款页面' },
  ];

  useEffect(() => {
    form.setFieldsValue({ sendChannel: 'SMS' });
  }, []);

  const handlePreviewSend = () => {
    form.validateFields().then((values) => {
      const selectedGroup = customerGroups.find(g => g.id === values.groupId);
      const count = selectedGroup?.count || 0;
      
      if (count > MAX_SEND_COUNT) {
        message.error(`单次最大发送量为 ${MAX_SEND_COUNT} 条，请选择人数较少的客群`);
        return;
      }
      
      setSendConfig({ ...values, sendCount: count });
      setConfirmModalVisible(true);
    });
  };

  const handleConfirmSend = async () => {
    if (!sendConfig) return;
    
    setSending(true);
    setConfirmModalVisible(false);
    setSendProgress(0);

    try {
      const totalSend = sendConfig.sendCount || 0;
      
      if (sendConfig.sendType === 'scheduled') {
        message.success(`定时发送已预约，将在 ${sendConfig.scheduledTime} 通过 ${sendConfig.sendChannel === 'SMS' ? '短信' : 'APP Push'} 发送 ${totalSend} 条消息`);
        form.resetFields();
      } else {
        const batchSize = Math.ceil(totalSend / 10);
        
        for (let i = 0; i < 10; i++) {
          await new Promise(resolve => setTimeout(resolve, 500));
          const progress = Math.min(((i + 1) * batchSize) / totalSend * 100, 100);
          setSendProgress(progress);
        }
        
        message.success(`成功通过 ${sendConfig.sendChannel === 'SMS' ? '短信' : 'APP Push'} 发送 ${totalSend} 条消息`);
        form.resetFields();
        setSendProgress(0);
      }
    } catch (error) {
      message.error('发送失败，请重试');
    } finally {
      setSending(false);
    }
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
                form.resetFields(['templateId', 'pushName', 'pushTitle', 'pushBody', 'jumpType', 'schemaUrl', 'h5Url']);
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
                  <Form.Item
                    name="jumpType"
                    label="跳转类型"
                    rules={[{ required: true, message: '请选择跳转类型' }]}
                  >
                    <Select
                      placeholder="请选择跳转类型"
                      options={jumpTypes}
                      onChange={(value) => {
                        setJumpType(value);
                        form.resetFields(['page', 'h5Url']);
                      }}
                    />
                  </Form.Item>
                  {jumpType === 'page' && (
                    <Form.Item
                      name="page"
                      label="选择页面"
                      rules={[{ required: true, message: '请选择页面' }]}
                    >
                      <Select
                        placeholder="请选择页面"
                        options={pageOptions}
                      />
                    </Form.Item>
                  )}
                  {jumpType === 'h5' && (
                    <Form.Item
                      name="h5Url"
                      label="H5链接"
                      rules={[{ required: true, message: '请输入H5链接' }]}
                    >
                      <Input placeholder="请输入H5链接" />
                    </Form.Item>
                  )}
                </>
              )
            )}
          </Form.Item>

          <Form.Item
            name="groupId"
            label="目标客群"
            rules={[{ required: true, message: '请选择目标客群' }]}
          >
            <Select
              placeholder="请选择目标客群"
              options={customerGroups.map(g => ({ value: g.id, label: `${g.name} (${g.count}人)` }))}
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
              onClick={handlePreviewSend}
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
            description={`确认向 ${sendConfig?.sendCount} 条用户进行${sendConfig?.sendChannel === 'SMS' ? '短信' : '推送'}营销？发送后不可撤回。`}
            type="error"
            showIcon
          />
          
          <div>
            <strong>发送信息：</strong>
            <ul style={{ marginTop: 8, paddingLeft: 20 }}>
              <li>发送类型：{sendTypes.find(s => s.value === sendConfig?.sendType)?.label}</li>
              {sendConfig?.sendType === 'scheduled' && (
                <li>定时时间：{sendConfig.scheduledTime}</li>
              )}
              <li>发送渠道：{sendChannels.find(c => c.value === sendConfig?.sendChannel)?.label}</li>
              <li>客群：{customerGroups.find(g => g.id === sendConfig?.groupId)?.name}</li>
              {sendChannel === 'SMS' && (
                <li>模板：{smsTemplates.find(s => s.id === sendConfig?.templateId)?.name}</li>
              )}
              {sendChannel === 'Push' && sendConfig?.pushName && (
                <li>推送名称：{sendConfig.pushName}</li>
              )}
              {sendChannel === 'Push' && sendConfig?.pushTitle && (
                <li>标题：{sendConfig.pushTitle}</li>
              )}
              <li>发送数量：{sendConfig?.sendCount} 条</li>
            </ul>
          </div>
        </Space>
      </Modal>
    </div>
  );
};

export default SendManagement;