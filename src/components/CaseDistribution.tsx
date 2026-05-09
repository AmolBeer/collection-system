import { useState } from 'react';
import { Table, Button, Tag, Card, Checkbox, Select, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { CaseItem, OverdueStage } from '../types';
import { defaultStages, products } from '../data/defaultStages';
import { useLanguage } from '../i18n/LanguageContext';

const mockCases: CaseItem[] = [
  { id: '1', borrowerName: '张三', overdueDays: 5, amount: 10000, stageCode: 'M1', productId: '1' },
  { id: '2', borrowerName: '李四', overdueDays: 15, amount: 25000, stageCode: 'M1', productId: '1' },
  { id: '3', borrowerName: '王五', overdueDays: 35, amount: 15000, stageCode: 'M2', productId: '1' },
  { id: '4', borrowerName: '赵六', overdueDays: 55, amount: 30000, stageCode: 'M2', productId: '1' },
  { id: '5', borrowerName: '钱七', overdueDays: 75, amount: 20000, stageCode: 'M3', productId: '1' },
  { id: '6', borrowerName: '孙八', overdueDays: 95, amount: 50000, stageCode: 'M4+', productId: '1' },
  { id: '7', borrowerName: '周九', overdueDays: 0, amount: 8000, stageCode: 'M0', productId: '1' },
  { id: '8', borrowerName: '吴十', overdueDays: 10, amount: 12000, stageCode: 'M1', productId: '1' },
  { id: '9', borrowerName: '甲某', overdueDays: 5, amount: 15000, stageCode: 'M1', productId: '2' },
  { id: '10', borrowerName: '乙某', overdueDays: 35, amount: 20000, stageCode: 'M2', productId: '2' },
];

const collectorGroups = [
  { id: '1', name: '初级催收组' },
  { id: '2', name: '中级催收组' },
  { id: '3', name: '高级催收组' },
];

function CaseDistribution() {
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [assignGroup, setAssignGroup] = useState<string>('');
  const { t } = useLanguage();

  const getStageByCode = (code: string, productId: string): OverdueStage | undefined => {
    return defaultStages.find(s => s.name === code && s.productId === productId);
  };

  const getProductName = (productId: string) => {
    return products.find(p => p.id === productId)?.name || productId;
  };

  const filteredCases = mockCases.filter(c => {
    const productMatch = selectedProduct === 'all' || c.productId === selectedProduct;
    const stageMatch = selectedStages.length === 0 || selectedStages.includes(c.stageCode);
    return productMatch && stageMatch;
  });

  const handleStageChange = (checkedValues: string[]) => {
    setSelectedStages(checkedValues);
  };

  const handleAssign = () => {
    if (selectedRows.length === 0) {
      message.warning('请先选择要分配的案件');
      return;
    }
    if (!assignGroup) {
      message.warning('请选择催收组');
      return;
    }
    const groupName = collectorGroups.find(g => g.id === assignGroup)?.name;
    message.success(`已将 ${selectedRows.length} 件案件分配给 ${groupName}`);
    setSelectedRows([]);
    setAssignGroup('');
  };

  const columns: ColumnsType<CaseItem> = [
    {
      title: t.product,
      dataIndex: 'productId',
      key: 'productId',
      width: 100,
      render: (productId) => getProductName(productId),
    },
    {
      title: t.borrowerName,
      dataIndex: 'borrowerName',
      key: 'borrowerName',
      width: 100,
    },
    {
      title: t.overdueDays,
      dataIndex: 'overdueDays',
      key: 'overdueDays',
      width: 100,
      sorter: (a, b) => a.overdueDays - b.overdueDays,
    },
    {
      title: t.overdueAmount,
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount) => `¥${amount.toLocaleString()}`,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: t.stageName,
      dataIndex: 'stageCode',
      key: 'stageCode',
      width: 100,
      render: (code, record) => {
        const stage = getStageByCode(code, record.productId);
        return stage ? (
          <Tag color={stage.enabled ? 'blue' : 'gray'}>{stage.name}</Tag>
        ) : code;
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedRows,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRows(selectedRowKeys as string[]);
    },
  };

  return (
    <div>
      <h2 style={{ margin: '0 0 16px 0' }}>{t.caseDistribution}</h2>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 500 }}>{t.product}:</span>
            <Select
              value={selectedProduct}
              onChange={(v) => { setSelectedProduct(v); setSelectedStages([]); }}
              style={{ width: 120 }}
              options={[
                { value: 'all', label: t.allProducts },
                ...products.map(p => ({ value: p.id, label: p.name }))
              ]}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 500 }}>{t.filterByStage}:</span>
            <Checkbox.Group
              value={selectedStages}
              onChange={(values) => handleStageChange(values as string[])}
            >
              {defaultStages
                .filter(s => s.enabled && (selectedProduct === 'all' || s.productId === selectedProduct))
                .map(stage => (
                  <Checkbox key={stage.id} value={stage.name} style={{ marginRight: 12 }}>
                    {stage.name}
                  </Checkbox>
                ))}
            </Checkbox.Group>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 16, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 500 }}>{t.assignTo}:</span>
          <Select
            placeholder="选择催收组"
            value={assignGroup || undefined}
            onChange={setAssignGroup}
            style={{ width: 140 }}
            options={collectorGroups.map(g => ({ value: g.id, label: g.name }))}
          />
          <Button type="primary" onClick={handleAssign}>{t.confirmAssign}</Button>
          <span style={{ color: '#888' }}>
            {t.selectedCount} <strong>{selectedRows.length}</strong> {t.件案件}
          </span>
        </div>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredCases}
          rowKey="id"
          rowSelection={rowSelection}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `共 ${total} 条`
          }}
          size="small"
        />
      </Card>
    </div>
  );
}

export default CaseDistribution;