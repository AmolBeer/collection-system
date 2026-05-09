import React from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface AddContactModalProps {
  visible: boolean;
  onCancel: () => void;
  onAdd: (contact: Contact) => void;
  caseId: string;
}

export interface Contact {
  id: string;
  caseId: string;
  name: string;
  phone: string;
  relationship: string;
  source: string;
  addedBy: string;
  addedAt: string;
}

const AddContactModal: React.FC<AddContactModalProps> = ({ visible, onCancel, onAdd, caseId }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const newContact: Contact = {
        id: `contact_${Date.now()}`,
        caseId,
        ...values,
        addedBy: '当前用户', // 实际项目中应该从登录信息获取
        addedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
      };
      onAdd(newContact);
      form.resetFields();
      message.success('联系号码添加成功');
    });
  };

  return (
    <Modal
      title="添加联系号码"
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      width={500}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="联系人姓名"
          rules={[{ required: true, message: '请输入联系人姓名' }]}
        >
          <Input placeholder="请输入联系人姓名" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="联系电话"
          rules={[
            { required: true, message: '请输入联系电话' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
          ]}
        >
          <Input placeholder="请输入联系电话" />
        </Form.Item>
        <Form.Item
          name="relationship"
          label="与被催人的关系"
          rules={[{ required: true, message: '请选择与被催人的关系' }]}
        >
          <Select placeholder="请选择与被催人的关系">
            <Select.Option value="本人">本人</Select.Option>
            <Select.Option value="配偶">配偶</Select.Option>
            <Select.Option value="父母">父母</Select.Option>
            <Select.Option value="子女">子女</Select.Option>
            <Select.Option value="朋友">朋友</Select.Option>
            <Select.Option value="同事">同事</Select.Option>
            <Select.Option value="其他">其他</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="source"
          label="获取方式"
          rules={[{ required: true, message: '请选择获取方式' }]}
        >
          <Select placeholder="请选择获取方式">
            <Select.Option value="系统自带">系统自带</Select.Option>
            <Select.Option value="借款人提供">借款人提供</Select.Option>
            <Select.Option value="紧急联系人提供">紧急联系人提供</Select.Option>
            <Select.Option value="其他渠道">其他渠道</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddContactModal;