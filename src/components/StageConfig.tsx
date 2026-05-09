import { useState, useMemo } from 'react';
import { Table, Button, Tag, Space, Modal, message, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { OverdueStage } from '../types';
import { defaultStages, products } from '../data/defaultStages';
import StageModal from './StageModal';
import { useLanguage } from '../i18n/LanguageContext';

function StageConfig() {
  const [stages, setStages] = useState<OverdueStage[]>(defaultStages);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStage, setEditingStage] = useState<OverdueStage | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [stageToDelete, setStageToDelete] = useState<OverdueStage | null>(null);
  const { t } = useLanguage();

  const filteredStages = useMemo(() => {
    let result = selectedProduct === 'all'
      ? stages
      : stages.filter(s => s.productId === selectedProduct);

    result.sort((a, b) => {
      if (b.updateTime !== a.updateTime) {
        return b.updateTime.localeCompare(a.updateTime);
      }
      if (a.productId !== b.productId) {
        return a.productId.localeCompare(b.productId);
      }
      return a.minDays - b.minDays;
    });

    return result;
  }, [stages, selectedProduct]);

  const getProductName = (productId: string) => {
    return products.find(p => p.id === productId)?.name || productId;
  };

  const handleAdd = () => {
    setEditingStage(null);
    setModalVisible(true);
  };

  const handleEdit = (record: OverdueStage) => {
    setEditingStage(record);
    setModalVisible(true);
  };

  const handleDelete = (record: OverdueStage) => {
    setStageToDelete(record);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (stageToDelete) {
      setStages(stages.filter(s => s.id !== stageToDelete.id));
      message.success('删除成功');
      setDeleteModalVisible(false);
      setStageToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setStageToDelete(null);
  };

  const handleSave = (stage: OverdueStage) => {
    const now = new Date().toLocaleString();
    if (editingStage) {
      const updatedStage = { ...stage, updateTime: now, updateBy: '当前用户' };
      setStages(stages.map(s => s.id === stage.id ? updatedStage : s));
      message.success('修改成功');
    } else {
      const productPrefix = stage.productId === '1' ? 'P1' : 'P2';
      const stageCode = `${productPrefix}_${stage.name}`;
      const newStage = {
        ...stage,
        stageCode,
        id: Date.now().toString(),
        createTime: now,
        createBy: '当前用户',
        updateTime: now,
        updateBy: '当前用户',
      };
      setStages([...stages, newStage]);
      message.success('新增成功');
    }
    setModalVisible(false);
  };

  const columns: ColumnsType<OverdueStage> = [
    {
      title: t.updateTime,
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 150,
      sorter: (a, b) => b.updateTime.localeCompare(a.updateTime),
      defaultSortOrder: 'descend' as const,
    },
    {
      title: t.product,
      dataIndex: 'productId',
      key: 'productId',
      width: 100,
      render: (productId) => getProductName(productId),
      sorter: (a, b) => a.productId.localeCompare(b.productId),
    },
    {
      title: t.stageName,
      dataIndex: 'name',
      key: 'name',
      width: 80,
      render: (name) => <Tag color="blue">{name}</Tag>,
    },
    {
      title: t.stageCode,
      dataIndex: 'stageCode',
      key: 'stageCode',
      width: 100,
    },
    {
      title: t.startDays,
      dataIndex: 'minDays',
      key: 'minDays',
      width: 100,
      sorter: (a, b) => a.minDays - b.minDays,
    },
    {
      title: t.endDays,
      dataIndex: 'maxDays',
      key: 'maxDays',
      width: 100,
      render: (maxDays) => maxDays === null ? t.infinite : maxDays,
      sorter: (a, b) => {
        if (a.maxDays === null && b.maxDays === null) return 0;
        if (a.maxDays === null) return 1;
        if (b.maxDays === null) return -1;
        return a.maxDays - b.maxDays;
      },
    },
    {
      title: t.status,
      dataIndex: 'enabled',
      key: 'enabled',
      width: 80,
      render: (enabled) => (
        <Tag color={enabled ? 'green' : 'red'}>
          {enabled ? t.enabled : t.disabled}
        </Tag>
      ),
    },
    {
      title: t.creator,
      dataIndex: 'createBy',
      key: 'createBy',
      width: 80,
    },
    {
      title: t.createTime,
      dataIndex: 'createTime',
      key: 'createTime',
      width: 140,
    },
    {
      title: t.updater,
      dataIndex: 'updateBy',
      key: 'updateBy',
      width: 80,
    },
    {
      title: t.action,
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>{t.edit}</Button>
          <Button type="link" size="small" danger onClick={() => handleDelete(record)}>{t.delete}</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ margin: 0 }}>{t.stageConfig}</h2>
        <Space>
          <Select
            value={selectedProduct}
            onChange={setSelectedProduct}
            style={{ width: 140 }}
            options={[
              { value: 'all', label: t.allProducts },
              ...products.map(p => ({ value: p.id, label: p.name }))
            ]}
          />
          <Button type="primary" onClick={handleAdd}>{t.addStage}</Button>
        </Space>
      </div>
      <div style={{ background: 'white', padding: 16, borderRadius: 8 }}>
        <Table
          columns={columns}
          dataSource={filteredStages}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `共 ${total} 条`
          }}
          scroll={{ x: 1200 }}
          size="small"
        />
      </div>
      <StageModal
        visible={modalVisible}
        stage={editingStage}
        stages={stages}
        selectedProductId={selectedProduct === 'all' ? null : selectedProduct}
        onSave={handleSave}
        onCancel={() => setModalVisible(false)}
      />
      <Modal
        title={t.deleteConfirmTitle}
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText={t.confirm || '确认'}
        cancelText={t.cancel}
      >
        <p>该阶段已被自动分案任务【任务A】使用，修改状态可能影响分案结果。请先停用或调整该任务后再操作。</p>
      </Modal>
    </div>
  );
}

export default StageConfig;