import React, { useState } from 'react';
import { Layout, Menu, Button, Space, Avatar, Badge, Tooltip, Dropdown } from 'antd';
import { 
  HomeOutlined, 
  FileTextOutlined, 
  TeamOutlined, 
  PhoneOutlined, 
  CreditCardOutlined, 
  FileSearchOutlined, 
  BarChartOutlined, 
  SettingOutlined, 
  QuestionCircleOutlined,
  DownOutlined,
  UserOutlined
} from '@ant-design/icons';
import SystemManagement from './components/SystemManagement';
import MarketingModule from './components/SystemManagement/MarketingModule';
import CaseList from './components/CaseList';
import CaseDetail from './components/CaseDetail';
import Dashboard from './components/Dashboard';
import ContactList from './components/ContactList';
import NotificationCenter from './components/NotificationCenter';
import { LanguageProvider } from './i18n/LanguageContext';
import { Language } from './types';

const { Header, Content, Sider, Footer } = Layout;

type MenuItem = 'dashboard' | 'customers' | 'callCenter' | 'payments' | 'documents' | 'reports' | 'system' | 'marketing';

type ViewMode = 'dashboard' | 'caseList' | 'caseDetail' | 'system' | 'marketing' | 'contactList';

const App: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<MenuItem>('cases');
  const [language, setLanguage] = useState<Language>('zh');
  const [viewMode, setViewMode] = useState<ViewMode>('caseList');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'id' : 'zh');
  };

  const handleViewDetail = (caseId: string) => {
    setSelectedCaseId(caseId);
    setViewMode('caseDetail');
  };

  const handleBackToList = () => {
    setViewMode('caseList');
    setSelectedCaseId('');
  };

  const handleSuspend = (caseIds: string[]) => {
    console.log('Suspended cases:', caseIds);
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'dashboard':
        return <Dashboard />;
      case 'caseList':
        return (
          <CaseList 
            onViewDetail={handleViewDetail} 
            onSuspend={handleSuspend}
          />
        );
      case 'caseDetail':
        return (
          <CaseDetail 
            caseId={selectedCaseId} 
            onBack={handleBackToList}
          />
        );
      case 'contactList':
        return <ContactList />;
      case 'system':
        return <SystemManagement />;
      case 'marketing':
        return <MarketingModule />;
      default:
        return <CaseList onViewDetail={handleViewDetail} onSuspend={handleSuspend} />;
    }
  };

  const handleMenuClick = (key: MenuItem) => {
    setSelectedKey(key);
    switch (key) {
      case 'dashboard':
        setViewMode('dashboard');
        break;
      case 'customers':
        setViewMode('contactList');
        break;
      case 'system':
        setViewMode('system');
        break;
      case 'marketing':
        setViewMode('marketing');
        break;
      default:
        setViewMode('caseList');
    }
  };

  const userMenuItems = [
    { key: 'profile', label: '个人资料' },
    { key: 'settings', label: '账户设置' },
    { key: 'logout', label: '退出登录' },
  ];

  return (
    <LanguageProvider language={language} setLanguage={setLanguage}>
      <Layout style={{ minHeight: '100vh', backgroundColor: '#f3f6f9' }}>
        {/* 左侧导航栏 */}
        <Sider 
          width={200} 
          style={{ 
            background: 'linear-gradient(180deg, #0d4f3c 0%, #1a6b56 100%)',
            boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Logo */}
          <div className="logo" style={{ 
            margin: '16px', 
            padding: '8px 16px',
            fontSize: '16px',
            fontWeight: '700',
            letterSpacing: '1px'
          }}>
            FinCollect
          </div>
          
          {/* 导航菜单 */}
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            onSelect={({ key }) => handleMenuClick(key as MenuItem)}
            style={{ 
              background: 'transparent', 
              borderRight: 'none',
              color: 'rgba(255, 255, 255, 0.85)',
              marginTop: '16px'
            }}
            items={[
              {
                key: 'dashboard',
                icon: <HomeOutlined style={{ color: 'rgba(255, 255, 255, 0.85)' }} />,
                label: <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>仪表盘</span>,
              },
              {
                key: 'customers',
                icon: <TeamOutlined style={{ color: 'rgba(255, 255, 255, 0.85)' }} />,
                label: <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>客户</span>,
              },
              {
                key: 'callCenter',
                icon: <PhoneOutlined style={{ color: 'rgba(255, 255, 255, 0.85)' }} />,
                label: <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>呼叫中心</span>,
              },
              {
                key: 'payments',
                icon: <FileSearchOutlined style={{ color: 'rgba(255, 255, 255, 0.85)' }} />,
                label: <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>支付</span>,
              },
              {
                key: 'documents',
                icon: <FileTextOutlined style={{ color: 'rgba(255, 255, 255, 0.85)' }} />,
                label: <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>文档</span>,
              },
              {
                key: 'reports',
                icon: <BarChartOutlined style={{ color: 'rgba(255, 255, 255, 0.85)' }} />,
                label: <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>报表</span>,
              },
              {
                type: 'divider' as const,
                style: { borderColor: 'rgba(255, 255, 255, 0.2)' },
              },
              {
                key: 'marketing',
                icon: <SettingOutlined style={{ color: 'rgba(255, 255, 255, 0.85)' }} />,
                label: <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>营销管理</span>,
              },
              {
                key: 'system',
                icon: <CreditCardOutlined style={{ color: 'rgba(255, 255, 255, 0.85)' }} />,
                label: <span style={{ color: 'rgba(255, 255, 255, 0.85)' }}>催收系统</span>,
              },
            ]}
          />
        </Sider>

        {/* 主内容区 */}
        <Layout>
          {/* 顶部Header */}
          <div 
            style={{ 
              background: '#ffffff', 
              padding: '0 24px', 
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              height: '64px',
              width: '100%'
            }}
          >
            {/* 左侧面包屑区域 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {viewMode === 'caseDetail' && (
                <>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>Cases</span>
                  <span style={{ color: '#d1d5db' }}>/</span>
                  <span style={{ color: '#0d4f3c', fontWeight: '500', fontSize: '14px' }}>{selectedCaseId}</span>
                </>
              )}
              {viewMode === 'caseList' && (
                <span style={{ color: '#1f2937', fontWeight: '500', fontSize: '14px' }}>Cases</span>
              )}
              {viewMode === 'dashboard' && (
                <span style={{ color: '#1f2937', fontWeight: '500', fontSize: '14px' }}>Dashboard</span>
              )}
              {viewMode === 'system' && (
                <span style={{ color: '#1f2937', fontWeight: '500', fontSize: '14px' }}>系统管理</span>
              )}
              {viewMode === 'marketing' && (
                <span style={{ color: '#1f2937', fontWeight: '500', fontSize: '14px' }}>营销管理</span>
              )}
            </div>

            {/* 中间功能区 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'absolute', right: '260px' }}>
              {/* 搜索框 */}
              <div style={{ 
                position: 'relative',
                width: '220px'
              }}>
                <input
                  type="text"
                  placeholder="Search case, customer, phone..."
                  style={{
                    width: '100%',
                    padding: '8px 32px 8px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '13px',
                    backgroundColor: '#f9fafb',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0d4f3c';
                    e.target.style.backgroundColor = '#ffffff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.backgroundColor = '#f9fafb';
                  }}
                />
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#9ca3af" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>

              {/* 通知中心 */}
              <div style={{ padding: '6px' }}>
                <NotificationCenter />
              </div>

              {/* 帮助 */}
              <Tooltip title="帮助">
                <Button 
                  type="text" 
                  icon={<QuestionCircleOutlined />}
                  style={{ fontSize: '18px', color: '#6b7280' }}
                />
              </Tooltip>
            </div>

            {/* 用户头像 - 绝对定位在右侧 */}
            <div style={{ position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)' }}>
              <Dropdown menu={{ items: userMenuItems }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  width: '220px'
                }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <Avatar 
                    size={32} 
                    icon={<UserOutlined />}
                    style={{ backgroundColor: '#0d4f3c' }}
                  />
                  <div style={{ width: '150px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#1f2937', textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Dewi Anggraini</div>
                    <div style={{ fontSize: '11px', color: '#6b7280', textAlign: 'right', whiteSpace: 'nowrap', marginTop: '2px' }}>Collector</div>
                  </div>
                  <DownOutlined style={{ fontSize: '14px', color: '#9ca3af' }} />
                </div>
              </Dropdown>
            </div>
          </div>

          {/* 主要内容区域 */}
          <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
            {renderContent()}
          </Content>

          {/* 底部Footer */}
          <Footer style={{ 
            textAlign: 'center', 
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e5e7eb',
            color: '#6b7280',
            fontSize: '12px'
          }}>
            FinCollect Collection System ©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>
    </LanguageProvider>
  );
};

export default App;
