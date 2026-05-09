import React, { useState, useEffect } from 'react';
import { Card, Form, Select, Button, message, Modal, Alert, Space, Progress, Input, DatePicker } from 'antd';
import { SendOutlined, CheckCircleOutlined } from '@ant-design/icons';
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
  schemaUrl?: string;
  h5Url?: string;
}

const MAX_SEND_COUNT = 10000;

const SendManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [sending, setSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);
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
    { value: 'schema', label: '指定页面（需配置schema）' },
    { value: 'h5', label: 'H5链接' },
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
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>发送管理</h3>
      </div>
      
      <Card bordered={false}>
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
            name="sendType"
            label="发送类型"
            initialValue="immediate"
            rules={[{ required: true, message: '请选择发送类型' }]}
          >
            <Select
              placeholder="请选择发送类型"
              options={sendTypes}
            />
          </Form.Item>
          
          <Form.Item
            name="scheduledTime"
            label="定时时间"
            rules={[{ 
              required: ({ getFieldValue }) => getFieldValue('sendType') === 'scheduled', 
              message: '请选择定时时间' 
            }]}
          >
            <DatePicker
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              placeholder="请选择定时发送时间"
              disabledDate={(current) => current && current < dayjs().subtract(1, 'minute')}
              style={{ width: '100%' }}
            />
          </Form.Item>
          
          <Form.Item
            name="groupId"
            label="选择客群"
            rules={[{ required: true, message: '请选择客群' }]}
          >
            <Select
              placeholder="请选择客群"
              options={customerGroups.map(group => ({
                label: `${group.name} (${group.count} 人)`,
                value: group.id,
              }))}
  
            />
          </Form.Item>
          
          {sendChannel === 'SMS' && (
            <Form.Item
              name="templateId"
              label="选择短信模板"
              rules={[{ required: true, message: '请选择短信模板' }]}
            >
              <Select
                placeholder="请选择短信模板"
                options={smsTemplates.map(template => ({
                  label: template.name,
                  value: template.id,
                }))}
              />
            </Form.Item>
          )}
          
          {sendChannel === 'Push' && (
            <>
              <h4 style={{ marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #f0f0f0' }}>推送配置</h4>
              
              <Form.Item
                name="pushName"
                label="推送名称（内部使用）"
                rules={[{ required: true, message: '请输入推送名称' }]}
              >
                <Input placeholder="请输入推送名称" />
              </Form.Item>
              
              <Form.Item
                name="pushTitle"
                label="标题（title）"
                rules={[{ required: true, message: '请输入推送标题' }]}
              >
                <Input placeholder="请输入推送标题" />
              </Form.Item>
              
              <Form.Item
                name="pushBody"
                label="内容（Body）"
                rules={[{ required: true, message: '请输入推送内容' }]}
              >
                <Input.TextArea
                  placeholder="请输入推送内容"
                  rows={4}
                />
              </Form.Item>
              
              <Form.Item
                name="jumpType"
                label="跳转方式"
                rules={[{ required: true, message: '请选择跳转方式' }]}
              >
                <Select
                  placeholder="请选择跳转方式"
                  options={jumpTypes}
                  onChange={(value) => setJumpType(value)}
                />
              </Form.Item>
              
              {jumpType === 'schema' && (
                <Form.Item
                  name="schemaUrl"
                  label="Schema URL"
                  rules={[{ required: true, message: '请输入Schema URL' }]}
                >
                  <Input placeholder="请输入Schema URL，如：myapp://page/detail?id=1" />
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
          )}
          
          {sending && (
            <Form.Item label="发送进度">
              <Progress percent={Math.round(sendProgress)} status="active" />
            </Form.Item>
          )}
          
          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                icon={<SendOutlined />}
                onClick={handlePreviewSend}
                loading={sending}
              >
                确认发送
              </Button>
              <Button onClick={() => form.resetFields()}>
                重置
              </Button>
            </Space>
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
              <li>发送类型：{sendTypes.find(t => t.value === sendConfig?.sendType)?.label}</li>
              {sendConfig?.sendType === 'scheduled' && (
                <li>定时时间：{sendConfig.scheduledTime}</li>
              )}
              <li>发送渠道：{sendChannels.find(c => c.value === sendConfig?.sendChannel)?.label}</li>
              <li>客群：{customerGroups.find(g => g.id === sendConfig?.groupId)?.name}</li>
              {sendChannel === 'SMS' && (
                <li>模板：{smsTemplates.find(t => t.id === sendConfig?.templateId)?.name}</li>
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