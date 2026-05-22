import React, { useState } from 'react';
import { Layout, Menu, Dropdown } from 'antd';
import { UserOutlined, TeamOutlined, CalendarOutlined, SettingOutlined, DashboardOutlined, FileSearchOutlined, DownOutlined, KeyOutlined, DollarOutlined, FileTextOutlined, PartitionOutlined, ScheduleOutlined, SplitCellsOutlined, PauseCircleOutlined } from '@ant-design/icons';
import AccountManagement from './AccountManagement';
import OrganizationStructure from './OrganizationStructure';
import StageConfig from '../StageConfig';
import Dashboard from '../Dashboard';
import CaseList from '../CaseList';
import CaseDetail from '../CaseDetail';
import RoleManagement from './RoleManagement';
import RecoveryList from '../RecoveryList';
import ReductionRuleConfig from './ReductionRuleConfig';
import ScheduleManagement from './ScheduleManagement';
import AutoAllocationManagement from './AutoAllocationManagement';
import SuspendedCases, { SuspendedCase } from './SuspendedCases';
import { useLanguage } from '../../i18n/LanguageContext';

const { Content, Sider } = Layout;

type MenuItem = 'dashboard' | 'caseList' | 'suspendedCases' | 'recovery' | 'account' | 'organization' | 'stage' | 'role' | 'reduction' | 'schedule' | 'autoAllocation';

const SystemManagement: React.FC = () => {
  const [current, setCurrent] = useState<MenuItem>('dashboard');
  const [suspendedCases, setSuspendedCases] = useState<SuspendedCase[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  useLanguage();

  const handleClick = (e: any) => {
    setCurrent(e.key);
    setSelectedCaseId('');
  };

  const handleViewDetail = (caseId: string) => {
    setSelectedCaseId(caseId);
  };

  const handleBackToList = () => {
    setSelectedCaseId('');
  };

  const handleSuspend = (caseIds: string[]) => {
    const newSuspendedCases: SuspendedCase[] = caseIds.map((caseId, index) => ({
      id: `SUSP-${Date.now()}-${index}`,
      caseId,
      borrowerName: `借款人${index + 1}`,
      phone: '未知',
      reason: '投诉',
      operator: '当前用户',
      endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
      forbiddenFeatures: ['禁止分案', '禁止发送短信'],
      createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    }));
    setSuspendedCases([...suspendedCases, ...newSuspendedCases]);
  };

  const handleResume = (caseIds: string[]) => {
    setSuspendedCases(suspendedCases.filter(sc => !caseIds.includes(sc.caseId)));
  };

  const renderContent = () => {
    if (selectedCaseId) {
      return <CaseDetail caseId={selectedCaseId} onBack={handleBackToList} />;
    }
    
    switch (current) {
      case 'dashboard':
        return <Dashboard />;
      case 'caseList':
        return <CaseList onViewDetail={handleViewDetail} onSuspend={handleSuspend} />;
      case 'suspendedCases':
        return <SuspendedCases onResume={handleResume} />;
      case 'recovery':
        return <RecoveryList />;
      case 'account':
        return <AccountManagement />;
      case 'organization':
        return <OrganizationStructure />;
      case 'stage':
        return <StageConfig />;
      case 'role':
        return <RoleManagement />;
      case 'reduction':
        return <ReductionRuleConfig />;
      case 'schedule':
        return <ScheduleManagement />;
      case 'autoAllocation':
        return <AutoAllocationManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} style={{ background: '#fff' }}>
        <div style={{ height: 32, background: 'rgba(255, 255, 255, 0.3)', margin: 16 }} />
        <Menu
          mode="inline"
          selectedKeys={[current]}
          style={{ height: '100%', borderRight: 0 }}
          onClick={handleClick}
          items={[
            {
              key: 'dashboard',
              icon: <DashboardOutlined />,
              label: '仪表盘',
            },
            {
              key: 'caseList',
              icon: <FileSearchOutlined />,
              label: '案件列表',
            },
            {
              key: 'suspendedCases',
              icon: <PauseCircleOutlined />,
              label: '停催列表',
            },
            {
              key: 'recovery',
              icon: <DollarOutlined />,
              label: '还款记录',
            },
            {
              key: 'admin',
              icon: <SettingOutlined />,
              label: '系统设置',
              children: [
                {
                  key: 'account',
                  icon: <UserOutlined />,
                  label: '账号管理',
                },
                {
                  key: 'organization',
                  icon: <TeamOutlined />,
                  label: '组织架构',
                },
                {
                  key: 'role',
                  icon: <KeyOutlined />,
                  label: '角色管理',
                },
              ],
            },
            {
              key: 'config',
              icon: <FileTextOutlined />,
              label: '业务配置',
              children: [
                {
                  key: 'stage',
                  icon: <PartitionOutlined />,
                  label: '阶段配置',
                },
                {
                  key: 'autoAllocation',
                  icon: <SplitCellsOutlined />,
                  label: '自动分案',
                },
                {
                  key: 'reduction',
                  icon: <DollarOutlined />,
                  label: '减免规则',
                },
              ],
            },
            {
              key: 'workforce',
              icon: <TeamOutlined />,
              label: '人员管理',
              children: [
                {
                  key: 'schedule',
                  icon: <ScheduleOutlined />,
                  label: '催员排班',
                },
              ],
            },
          ]}
        />
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Content
          style={{
            background: '#fff',
            padding: 24,
            minHeight: 280,
            overflow: 'auto',
          }}
        >
          <div style={{ minWidth: '1200px' }}>
            {renderContent()}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default SystemManagement;