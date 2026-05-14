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
  const { language } = useLanguage();

  const handleClick = (e: any) => {
    setCurrent(e.key);
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
    switch (current) {
      case 'dashboard':
        return <Dashboard />;
      case 'caseList':
        return <CaseList onSuspend={handleSuspend} />;
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
        >
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            仪表盘
          </Menu.Item>
          <Menu.Item key="caseList" icon={<FileSearchOutlined />}>
            案件列表
          </Menu.Item>
          <Menu.Item key="suspendedCases" icon={<PauseCircleOutlined />}>
            停催列表
          </Menu.Item>
          <Menu.Item key="recovery" icon={<DollarOutlined />}>
            还款记录
          </Menu.Item>
          <Menu.SubMenu key="admin" icon={<SettingOutlined />} title="系统设置">
            <Menu.Item key="account" icon={<UserOutlined />}>
              账号管理
            </Menu.Item>
            <Menu.Item key="organization" icon={<TeamOutlined />}>
              组织架构
            </Menu.Item>
            <Menu.Item key="role" icon={<KeyOutlined />}>
              角色管理
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="config" icon={<FileTextOutlined />} title="业务配置">
            <Menu.Item key="stage" icon={<PartitionOutlined />}>
              阶段配置
            </Menu.Item>
            <Menu.Item key="autoAllocation" icon={<SplitCellsOutlined />}>
              自动分案
            </Menu.Item>
            <Menu.Item key="reduction" icon={<DollarOutlined />}>
              减免规则
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu key="workforce" icon={<TeamOutlined />} title="人员管理">
            <Menu.Item key="schedule" icon={<ScheduleOutlined />}>
              催员排班
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Content
          style={{
            background: '#fff',
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default SystemManagement;