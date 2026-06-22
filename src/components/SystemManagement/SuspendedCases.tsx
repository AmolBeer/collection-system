import React, { useState } from 'react';
import { Table, Button, Space, Input, Tag, message, Modal } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useLanguage } from '../../i18n/LanguageContext';

export interface SuspendedCase {
  id: string;
  caseId: string;
  borrowerName: string;
  phone: string;
  reason: string;
  operator: string;
  endTime: string;
  forbiddenFeatures: string[];
  createTime: string;
}

const defaultSuspendedCases: SuspendedCase[] = [
  { 
    id: 'SUSP-001', 
    caseId: 'CASE-003', 
    borrowerName: '王五', 
    phone: '13800138003',
    reason: '投诉', 
    operator: '管理员', 
    endTime: '2024-04-15 23:59:59', 
    forbiddenFeatures: ['禁止分案', '禁止发送短信'],
    createTime: '2024-03-31 10:00:00'
  },
  { 
    id: 'SUSP-002', 
    caseId: 'CASE-005', 
    borrowerName: '钱七', 
    phone: '13800138005',
    reason: '住院', 
    operator: '催收员A', 
    endTime: '2024-04-30 23:59:59', 
    forbiddenFeatures: ['禁止分案', '禁止发送短信', '禁止电话外呼', '禁止WA发送', '禁止Email发送'],
    createTime: '2024-03-30 15:30:00'
  },
];

const SuspendedCases: React.FC<{ onResume: (caseIds: string[]) => void }> = ({ onResume }) => {
  const [cases, setCases] = useState<SuspendedCase[]>(defaultSuspendedCases);
  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const { t } = useLanguage();

  const filteredCases = cases.filter(caseItem => 
    caseItem.caseId.includes(searchText) || 
    caseItem.borrowerName.includes(searchText) || 
    caseItem.phone.includes(searchText)
  );

  const handleResume = () => {
    if (selectedCases.length === 0) {
      message.error(t.pleaseSelectCasesToAssign);
      return;
    }
    setConfirmModalVisible(true);
  };

  const handleConfirmResume = () => {
    const caseIdsToResume = selectedCases.map(id => {
      const suspendedCase = cases.find(c => c.id === id);
      return suspendedCase?.caseId || '';
    }).filter(Boolean);
    
    setCases(cases.filter(c => !selectedCases.includes(c.id)));
    setConfirmModalVisible(false);
    setSelectedCases([]);
    message.success(t.successfullyAssigned.replace('{count}', selectedCases.length.toString()));
    onResume(caseIdsToResume);
  };

  const columns: ColumnsType<SuspendedCase> = [
    {
      title: t.caseId,
      dataIndex: 'caseId',
      key: 'caseId',
      width: 120,
    },
    {
      title: t.borrowerName,
      dataIndex: 'borrowerName',
      key: 'borrowerName',
      width: 100,
    },
    {
      title: t.phone,
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
    },
    {
      title: t.suspensionReason,
      dataIndex: 'reason',
      key: 'reason',
      width: 100,
      render: (reason: string) => (
        <Tag color={getReasonColor(reason)}>
          {reason}
        </Tag>
      ),
    },
    {
      title: t.operator,
      dataIndex: 'operator',
      key: 'operator',
      width: 100,
    },
    {
      title: t.endTime,
      dataIndex: 'endTime',
      key: 'endTime',
      width: 160,
    },
    {
      title: t.forbiddenFeatures,
      dataIndex: 'forbiddenFeatures',
      key: 'forbiddenFeatures',
      width: 200,
      render: (features: string[]) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {features.map((feature, index) => (
            <Tag key={index} color="red">
              {feature}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: t.suspensionTime,
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
    },
  ];

  function getReasonColor(reason: string): string {
    const colorMap: Record<string, string> = {
      '投诉': 'red',
      '死亡': 'gray',
      '住院': 'orange',
      '起诉': 'purple',
      '其他': 'blue',
    };
    return colorMap[reason] || 'blue';
  }

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0 }}>停催列表</h2>
        <Space size="middle">
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            disabled={selectedCases.length === 0}
            onClick={handleResume}
          >
            恢复案件
          </Button>
          <Input
            placeholder="搜索案件号、借款人或电话"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={filteredCases}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total) => `共 ${total} 条`,
        }}
        size="small"
        rowSelection={{
          selectedRowKeys: selectedCases,
          onChange: (selectedRowKeys) => setSelectedCases(selectedRowKeys as string[]),
        }}
      />

      <Modal
        title={t.confirm}
        open={confirmModalVisible}
        onOk={handleConfirmResume}
        onCancel={() => setConfirmModalVisible(false)}
      >
        <p>{t.confirmRestoreCases.replace('{count}', selectedCases.length.toString())}</p>
        <p>{t.restoreTip}</p>
      </Modal>
    </div>
  );
};

export default SuspendedCases;
