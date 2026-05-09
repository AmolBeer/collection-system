import React, { useState } from 'react';
import { Tabs, Card } from 'antd';
import { MessageOutlined, UserOutlined, FileTextOutlined, SendOutlined } from '@ant-design/icons';
import TemplateManagement from './marketing/TemplateManagement';
import CustomerGroupManagement from './marketing/CustomerGroupManagement';
import SendManagement from './marketing/SendManagement';
import SendRecords from './marketing/SendRecords';

const MarketingModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('template');

  const tabItems = [
    {
      key: 'template',
      label: (
        <span>
          <MessageOutlined />
          短信模板管理
        </span>
      ),
      children: <TemplateManagement />,
    },
    {
      key: 'customer',
      label: (
        <span>
          <UserOutlined />
          客群管理
        </span>
      ),
      children: <CustomerGroupManagement />,
    },
    {
      key: 'send',
      label: (
        <span>
          <SendOutlined />
          发送管理
        </span>
      ),
      children: <SendManagement />,
    },
    {
      key: 'records',
      label: (
        <span>
          <FileTextOutlined />
          发送记录
        </span>
      ),
      children: <SendRecords />,
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>营销管理</h2>
      <Card bordered={false}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
      </Card>
    </div>
  );
};

export default MarketingModule;