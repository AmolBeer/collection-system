import React, { useState } from 'react';
import { Card, Space, Button } from 'antd';
import { TeamOutlined, UserOutlined } from '@ant-design/icons';
import AdminDashboard from './AdminDashboard';
import CollectorDashboard from './CollectorDashboard';
import { useLanguage } from '../../i18n/LanguageContext';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('admin');
  const { t } = useLanguage();

  return (
    <div style={{ minWidth: '1200px' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>仪表盘</h2>
          <p style={{ margin: '0', fontSize: '13px', color: '#6b7280' }}>
            {activeTab === 'admin' ? '管理员视图' : '催收员视图'}
          </p>
        </div>
        <Space>
          <Button 
            type={activeTab === 'admin' ? 'primary' : 'default'}
            icon={<TeamOutlined />}
            onClick={() => setActiveTab('admin')}
            style={{ borderRadius: '8px' }}
          >
            {t.adminDashboard}
          </Button>
          <Button 
            type={activeTab === 'collector' ? 'primary' : 'default'}
            icon={<UserOutlined />}
            onClick={() => setActiveTab('collector')}
            style={{ borderRadius: '8px' }}
          >
            {t.collectorDashboard}
          </Button>
        </Space>
      </div>
      
      {activeTab === 'admin' ? <AdminDashboard /> : <CollectorDashboard />}
    </div>
  );
};

export default Dashboard;
