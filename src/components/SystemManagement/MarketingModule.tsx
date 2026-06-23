import React, { useState } from 'react';
import { Tabs } from 'antd';
import { UserOutlined, SendOutlined, FileTextOutlined, DollarOutlined } from '@ant-design/icons';
import TemplateManagement from './marketing/TemplateManagement';
import CustomerGroupManagement from './marketing/CustomerGroupManagement';
import SendManagement from './marketing/SendManagement';
import SendRecords from './marketing/SendRecords';
import UserTagManagement from './marketing/UserTagManagement';
import RecoveryManagement from './marketing/RecoveryManagement';

interface MarketingModuleProps {
  view?: string;
}

const MarketingModule: React.FC<MarketingModuleProps> = ({ view }) => {
  const [activeTab, setActiveTab] = useState<string>(view || 'marketingTemplate');
  const [activeModule, setActiveModule] = useState<'marketing' | 'recovery'>('marketing');

  const marketingTabs = [
    { key: 'marketingCustomer', label: 'Audience', icon: <UserOutlined /> },
    { key: 'marketingSend', label: 'Send Tasks', icon: <SendOutlined /> },
    { key: 'marketingRecords', label: 'Send Records', icon: <FileTextOutlined /> },
  ];

  const recoveryTabs = [
    { key: 'marketingRecovery', label: 'Recovery Tasks', icon: <DollarOutlined /> },
    { key: 'marketingRecords', label: 'Recovery Records', icon: <FileTextOutlined /> },
  ];

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleModuleChange = (module: 'marketing' | 'recovery') => {
    setActiveModule(module);
    if (module === 'marketing') {
      setActiveTab('marketingCustomer');
    } else {
      setActiveTab('marketingRecovery');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'marketingCustomer':
        return <CustomerGroupManagement />;
      case 'marketingUserTag':
        return <UserTagManagement />;
      case 'marketingSend':
        return <SendManagement />;
      case 'marketingRecords':
        return <SendRecords />;
      case 'marketingRecovery':
        return <RecoveryManagement />;
      case 'marketing':
      case 'marketingTemplate':
      default:
        return <TemplateManagement />;
    }
  };

  const renderModuleTabs = () => {
    return (
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={() => handleModuleChange('marketing')}
          style={{
            padding: '8px 24px',
            fontSize: '14px',
            fontWeight: activeModule === 'marketing' ? '600' : '400',
            border: 'none',
            backgroundColor: activeModule === 'marketing' ? '#1890ff' : 'transparent',
            color: activeModule === 'marketing' ? '#fff' : '#666',
            borderRadius: '4px 4px 0 0',
            cursor: 'pointer',
            marginRight: '8px',
          }}
        >
          市场营销
        </button>
        <button
          onClick={() => handleModuleChange('recovery')}
          style={{
            padding: '8px 24px',
            fontSize: '14px',
            fontWeight: activeModule === 'recovery' ? '600' : '400',
            border: 'none',
            backgroundColor: activeModule === 'recovery' ? '#1890ff' : 'transparent',
            color: activeModule === 'recovery' ? '#fff' : '#666',
            borderRadius: '4px 4px 0 0',
            cursor: 'pointer',
          }}
        >
          催收
        </button>
      </div>
    );
  };

  const tabsToShow = activeModule === 'marketing' ? marketingTabs : recoveryTabs;

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>
        {activeTab === 'marketingTemplate' ? '短信模板管理' : 
         activeModule === 'marketing' ? '市场营销' : '催收'}
      </h2>

      {activeTab !== 'marketingTemplate' && renderModuleTabs()}

      {activeTab !== 'marketingTemplate' && (
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabsToShow.map(tab => ({
            key: tab.key,
            label: <span><span>{tab.icon}</span> <span>{tab.label}</span></span>,
          }))}
          style={{ marginBottom: 16 }}
        />
      )}

      {renderContent()}
    </div>
  );
};

export default MarketingModule;