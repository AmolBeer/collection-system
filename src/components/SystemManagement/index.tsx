import React from 'react';
import AccountManagement from './AccountManagement';
import OrganizationStructure from './OrganizationStructure';
import StageConfig from '../StageConfig';
import Dashboard from '../Dashboard';
import CaseList from '../CaseList';
import CaseDetail from '../CaseDetail';
import RoleManagement from './RoleManagement';
import RecoveryList from '../RecoveryList';
import ReductionRuleConfig from './ReductionRuleConfig';
import WorkOrderReview from '../WorkOrderReview';
import ScheduleManagement from './ScheduleManagement';
import AutoAllocationManagement from './AutoAllocationManagement';
import SuspendedCases from './SuspendedCases';
import OutsourcingConfig from './OutsourcingConfig';
import { useLanguage } from '../../i18n/LanguageContext';

interface SystemManagementProps {
  view: string;
}

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div style={{ padding: '24px', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#999' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
        <div style={{ fontSize: '18px', fontWeight: '500' }}>{title}</div>
        <div style={{ fontSize: '14px', marginTop: '8px' }}>功能开发中...</div>
      </div>
    </div>
  );
};

const SystemManagement: React.FC<SystemManagementProps> = ({ view }) => {
  useLanguage();

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard />;
      case 'caseList':
        return <CaseList onViewDetail={() => {}} onSuspend={() => {}} />;
      case 'recovery':
        return <RecoveryList />;
      case 'reductionReview':
        return <WorkOrderReview />;
      case 'suspendedCases':
        return <SuspendedCases onResume={() => {}} />;
      case 'organization':
        return <OrganizationStructure />;
      case 'stage':
        return <StageConfig />;
      case 'autoAllocation':
        return <AutoAllocationManagement />;
      case 'outsourcing':
        return <OutsourcingConfig />;
      case 'reduction':
        return <ReductionRuleConfig />;
      case 'schedule':
        return <ScheduleManagement />;
      case 'account':
        return <AccountManagement />;
      case 'role':
        return <RoleManagement />;
      case 'menuManagement':
        return <PlaceholderPage title="菜单管理" />;
      case 'dictManagement':
        return <PlaceholderPage title="字典管理" />;
      case 'logManagement':
        return <PlaceholderPage title="操作日志" />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={{ minWidth: '1200px' }}>
      {renderContent()}
    </div>
  );
};

export default SystemManagement;
