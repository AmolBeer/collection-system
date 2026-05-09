import React, { useState } from 'react';
import { Layout, Menu, Button, Space } from 'antd';
import { HomeOutlined, SettingOutlined, GlobalOutlined, MessageOutlined } from '@ant-design/icons';
import SystemManagement from './components/SystemManagement';
import MarketingModule from './components/SystemManagement/MarketingModule';
import { LanguageProvider } from './i18n/LanguageContext';
import { Language } from './types';

const { Header, Content, Footer } = Layout;

type MenuItem = 'home' | 'system' | 'marketing';

const App: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<MenuItem>('home');
  const [language, setLanguage] = useState<Language>('zh');

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'id' : 'zh');
  };

  const renderContent = () => {
    switch (selectedKey) {
      case 'home':
        return (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <h1>催收系统</h1>
            <p style={{ fontSize: 16, color: '#666', margin: '20px 0' }}>欢迎使用催收系统管理平台</p>
            <Button type="primary" onClick={() => setSelectedKey('system')}>
              进入系统管理
            </Button>
          </div>
        );
      case 'system':
        return <SystemManagement />;
      case 'marketing':
        return <MarketingModule />;
      default:
        return null;
    }
  };

  return (
    <LanguageProvider language={language} setLanguage={setLanguage}>
      <Layout className="layout">
        <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="logo" style={{ width: 120, height: 31, marginRight: 24, background: 'rgba(255, 255, 255, 0.3)' }} />
            <Menu
              theme="dark"
              mode="horizontal"
              selectedKeys={[selectedKey]}
              onSelect={({ key }) => setSelectedKey(key as MenuItem)}
              style={{ flex: 1, minWidth: 0 }}
            >
              <Menu.Item key="home" icon={<HomeOutlined />}>
                首页
              </Menu.Item>
              <Menu.Item key="system" icon={<SettingOutlined />}>
                系统管理
              </Menu.Item>
              <Menu.Item key="marketing" icon={<MessageOutlined />}>
                营销管理
              </Menu.Item>
            </Menu>
          </div>
          <Space>
            <Button
              icon={<GlobalOutlined />}
              onClick={toggleLanguage}
            >
              {language === 'zh' ? '切换到印尼语' : 'Switch to Chinese'}
            </Button>
          </Space>
        </Header>
        <Content style={{ padding: '0 50px', margin: '24px 0' }}>
          <div style={{ background: 'white', padding: 24, borderRadius: 8, minHeight: 600 }}>
            {renderContent()}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          催收系统管理平台 ©{new Date().getFullYear()} Created by System Admin
        </Footer>
      </Layout>
    </LanguageProvider>
  );
};

export default App;