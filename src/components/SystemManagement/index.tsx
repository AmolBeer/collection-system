import React from 'react';
import AccountManagement from './AccountManagement';
import OrganizationStructure from './OrganizationStructure';
import StageConfig from '../StageConfig';
import Dashboard from '../Dashboard';
import CaseList from '../CaseList';
import RoleManagement from './RoleManagement';
import RecoveryList from '../RecoveryList';
import ReductionRuleConfig from './ReductionRuleConfig';
import WorkOrderReview from '../WorkOrderReview';
import ScheduleManagement from './ScheduleManagement';
import AutoAllocationManagement from './AutoAllocationManagement';
import SuspendedCases from './SuspendedCases';
import OutsourcingConfig from './OutsourcingConfig';
import ServiceProviderManagement from './marketing/ServiceProviderManagement';
import TemplateList from './marketing/TemplateList';
import SendTaskList from './marketing/SendTaskList';
import SendRecords from './marketing/SendRecords';
import { useLanguage } from '../../i18n/LanguageContext';

interface SystemManagementProps {
  view: string;
  onViewDetail?: (caseId: string) => void;
}

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div style={{ padding: '24px', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#999' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
        <div style={{ fontSize: '18px', fontWeight: 500 }}>{title}</div>
        <div style={{ fontSize: '14px', marginTop: '8px' }}>功能开发中...</div>
      </div>
    </div>
  );
};

const SystemManagement: React.FC<SystemManagementProps> = ({ view, onViewDetail }) => {
  useLanguage();

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard />;
      case 'caseList':
        return <CaseList onViewDetail={() => {}} onSuspend={() => {}} />;
      case 'recovery':
        return <RecoveryList onViewDetail={onViewDetail} />;
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
      // 消息中心
      case 'msgProvider':
        return <ServiceProviderManagement />;
      case 'msgTemplateSMS':
        return <TemplateList method="SMS" />;
      case 'msgTemplateEmail':
        return <TemplateList method="Email" />;
      case 'msgTemplateRCS':
        return <TemplateList method="RCS" />;
      case 'msgTemplateIVR':
        return <TemplateList method="IVR" />;
      case 'msgTemplateAI':
        return <TemplateList method="AI" />;
      case 'msgTemplateWABA':
        return <TemplateList method="WABA" />;
      case 'msgTemplateAPP':
        return <TemplateList method="APP Push" />;
      case 'msgSendSMS':
        return <SendTaskList method="SMS" />;
      case 'msgSendEmail':
        return <SendTaskList method="Email" />;
      case 'msgSendRCS':
        return <SendTaskList method="RCS" />;
      case 'msgSendIVR':
        return <SendTaskList method="IVR" />;
      case 'msgSendAI':
        return <SendTaskList method="AI" />;
      case 'msgSendWABA':
        return <SendTaskList method="WABA" />;
      case 'msgSendAPP':
        return <SendTaskList method="APP Push" />;
      case 'msgRecords':
        return <SendRecords />;
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
