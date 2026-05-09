import React, { useState } from 'react';
import { Card, Tabs, Divider, Space, Button } from 'antd';
import { UserOutlined, TeamOutlined, BarChartOutlined, LineChartOutlined } from '@ant-design/icons';
import AdminDashboard from './AdminDashboard';
import CollectorDashboard from './CollectorDashboard';
import { useLanguage } from '../../i18n/LanguageContext';

const { TabPane } = Tabs;

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('admin');
  const { t } = useLanguage();

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>{t.dashboard}</h2>
        <Space>
          <Button 
            type={activeTab === 'admin' ? 'primary' : 'default'}
            icon={<TeamOutlined />}
            onClick={() => setActiveTab('admin')}
          >
            {t.adminDashboard}
          </Button>
          <Button 
            type={activeTab === 'collector' ? 'primary' : 'default'}
            icon={<UserOutlined />}
            onClick={() => setActiveTab('collector')}
          >
            {t.collectorDashboard}
          </Button>
        </Space>
      </div>
      <Divider />
      
      {activeTab === 'admin' ? <AdminDashboard /> : <CollectorDashboard />}
    </div>
  );
};

export default Dashboard;