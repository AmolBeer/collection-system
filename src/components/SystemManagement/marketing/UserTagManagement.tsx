import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Tag, message, Space, Popconfirm, Tooltip, Row, Col, Statistic, Divider, Menu, Dropdown } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, EditOutlined, DeleteOutlined, TagOutlined, UserOutlined, CheckCircleOutlined, CloseCircleOutlined, DatabaseOutlined, ClockCircleOutlined, FolderOpenOutlined, FolderOutlined, MinusCircleOutlined, DownOutlined } from '@ant-design/icons';
import { useLanguage } from '../../../i18n/LanguageContext';

interface ConditionNode {
  id: string;
  type: 'condition' | 'group';
  field?: string;
  operator?: string;
  value?: string | number | boolean;
  description?: string;
  logicOperator: 'and' | 'or';
  children?: ConditionNode[];
}

interface UserTag {
  id: string;
  tagName: string;
  tagType: 'newCustomer' | 'oldCustomer' | 'behavior' | 'risk' | 'custom';
  tagCategory: string;
  tagColor: string;
  description: string;
  conditionRoot: ConditionNode;
  userCount: number;
  enabled: boolean;
  createTime: string;
  createBy: string;
}

const tagTypes = [
  { value: 'newCustomer', label: { zh: '新客标签', en: 'New Customer', id: 'Pelanggan Baru' }, color: 'blue' },
  { value: 'oldCustomer', label: { zh: '老客标签', en: 'Existing Customer', id: 'Pelanggan Lama' }, color: 'green' },
  { value: 'behavior', label: { zh: '行为标签', en: 'Behavior', id: 'Perilaku' }, color: 'orange' },
  { value: 'risk', label: { zh: '风险标签', en: 'Risk', id: 'Risiko' }, color: 'red' },
  { value: 'custom', label: { zh: '自定义标签', en: 'Custom', id: 'Kustom' }, color: 'purple' },
];

const tagCategories = [
  { value: 'acquisition', label: { zh: '获客类', en: 'Acquisition', id: 'Pendaftaran' } },
  { value: 'activation', label: { zh: '激活类', en: 'Activation', id: 'Aktivasi' } },
  { value: 'promotion', label: { zh: '提额类', en: 'Promotion', id: 'Promosi' } },
  { value: 'retention', label: { zh: '留存类', en: 'Retention', id: 'Retensi' } },
  { value: 'recovery', label: { zh: '回款类', en: 'Recovery', id: 'Pemulihan' } },
];

const tagColors = [
  { value: 'blue', label: { zh: '蓝色', en: 'Blue', id: 'Biru' }, color: '#1890ff' },
  { value: 'green', label: { zh: '绿色', en: 'Green', id: 'Hijau' }, color: '#52c41a' },
  { value: 'orange', label: { zh: '橙色', en: 'Orange', id: 'Oranye' }, color: '#fa8c16' },
  { value: 'red', label: { zh: '红色', en: 'Red', id: 'Merah' }, color: '#ff4d4f' },
  { value: 'purple', label: { zh: '紫色', en: 'Purple', id: 'Ungu' }, color: '#722ed1' },
  { value: 'cyan', label: { zh: '青色', en: 'Cyan', id: 'Cyan' }, color: '#13c2c2' },
  { value: 'magenta', label: { zh: '洋红', en: 'Magenta', id: 'Magenta' }, color: '#eb2f96' },
  { value: 'gold', label: { zh: '金色', en: 'Gold', id: 'Emas' }, color: '#faad14' },
];

const conditionFields = [
  { value: 'registerSuccess', label: { zh: '注册成功', en: 'Registered', id: 'Terdaftar' }, type: 'boolean' },
  { value: 'creditSuccess', label: { zh: '授信成功', en: 'Credit Approved', id: 'Kredit Disetujui' }, type: 'boolean' },
  { value: 'withdrawCount', label: { zh: '申请提现次数', en: 'Withdraw Count', id: 'Jumlah Penarikan' }, type: 'number' },
  { value: 'loanCount', label: { zh: '放款次数', en: 'Loan Count', id: 'Jumlah Pinjaman' }, type: 'number' },
  { value: 'registerDays', label: { zh: '注册天数', en: 'Register Days', id: 'Hari Pendaftaran' }, type: 'number' },
  { value: 'creditDays', label: { zh: '授信天数', en: 'Credit Days', id: 'Hari Kredit' }, type: 'number' },
  { value: 'clearDays', label: { zh: '结清天数', en: 'Clear Days', id: 'Hari Pelunasan' }, type: 'number' },
  { value: 'blacklist', label: { zh: '黑名单', en: 'Blacklist', id: 'Daftar Hitam' }, type: 'boolean' },
  { value: 'overdueOrders', label: { zh: '逾期在贷订单', en: 'Overdue Orders', id: 'Pesanan Tertunda' }, type: 'boolean' },
  { value: 'availableLimit', label: { zh: '剩余可用额度', en: 'Available Limit', id: 'Limit Tersedia' }, type: 'number' },
  { value: 'installSuccess', label: { zh: '安装成功', en: 'Installed', id: 'Terpasang' }, type: 'boolean' },
  { value: 'applySuccess', label: { zh: '申请成功', en: 'Applied', id: 'Diajukan' }, type: 'boolean' },
];

const operators = {
  boolean: [
    { value: 'true', label: { zh: '是', en: 'Yes', id: 'Ya' } },
    { value: 'false', label: { zh: '否', en: 'No', id: 'Tidak' } },
  ],
  number: [
    { value: '=', label: { zh: '等于', en: '=', id: 'Sama dengan' } },
    { value: '!=', label: { zh: '不等于', en: '!=', id: 'Tidak sama dengan' } },
    { value: '>', label: { zh: '大于', en: '>', id: 'Lebih besar' } },
    { value: '>=', label: { zh: '大于等于', en: '>=', id: 'Lebih besar sama dengan' } },
    { value: '<', label: { zh: '小于', en: '<', id: 'Kurang dari' } },
    { value: '<=', label: { zh: '小于等于', en: '<=', id: 'Kurang dari sama dengan' } },
  ],
};

const generateMockTags = (): UserTag[] => {
  return [
    {
      id: 'TAG-NEW-001',
      tagName: '新客-注册成功T1',
      tagType: 'newCustomer',
      tagCategory: 'activation',
      tagColor: 'blue',
      description: '注册成功后第一天，且未申请提现、未放款的新客户',
      conditionRoot: {
        id: 'root-1',
        type: 'group',
        logicOperator: 'and',
        children: [
          { id: 'c1', type: 'condition', field: 'registerSuccess', operator: 'true', value: true, description: '注册成功', logicOperator: 'and' },
          { id: 'c2', type: 'condition', field: 'withdrawCount', operator: '=', value: 0, description: '申请提现次数=0', logicOperator: 'and' },
          { id: 'c3', type: 'condition', field: 'loanCount', operator: '=', value: 0, description: '放款次数=0', logicOperator: 'and' },
          { id: 'c4', type: 'condition', field: 'registerDays', operator: '=', value: 1, description: '注册成功T1', logicOperator: 'and' },
          { id: 'c5', type: 'condition', field: 'blacklist', operator: 'false', value: false, description: '黑名单=0', logicOperator: 'and' },
        ],
      },
      userCount: 1250,
      enabled: true,
      createTime: '2026-01-15 10:30:00',
      createBy: '管理员',
    },
    {
      id: 'TAG-NEW-002',
      tagName: '新客-授信成功T1',
      tagType: 'newCustomer',
      tagCategory: 'promotion',
      tagColor: 'green',
      description: '授信成功后第一天，且未申请提现、未放款的新客户',
      conditionRoot: {
        id: 'root-2',
        type: 'group',
        logicOperator: 'and',
        children: [
          { id: 'c1', type: 'condition', field: 'creditSuccess', operator: 'true', value: true, description: '授信成功', logicOperator: 'and' },
          { id: 'c2', type: 'condition', field: 'withdrawCount', operator: '=', value: 0, description: '申请提现次数=0', logicOperator: 'and' },
          { id: 'c3', type: 'condition', field: 'loanCount', operator: '=', value: 0, description: '放款次数=0', logicOperator: 'and' },
          { id: 'c4', type: 'condition', field: 'creditDays', operator: '=', value: 1, description: '授信成功T1', logicOperator: 'and' },
          { id: 'c5', type: 'condition', field: 'blacklist', operator: 'false', value: false, description: '黑名单=0', logicOperator: 'and' },
        ],
      },
      userCount: 856,
      enabled: true,
      createTime: '2026-01-16 14:20:00',
      createBy: '管理员',
    },
    {
      id: 'TAG-NEW-003',
      tagName: '新客提额（授信成功未提现）',
      tagType: 'newCustomer',
      tagCategory: 'promotion',
      tagColor: 'gold',
      description: '授信成功但未提现的新客户，用于提额营销',
      conditionRoot: {
        id: 'root-3',
        type: 'group',
        logicOperator: 'and',
        children: [
          { id: 'c1', type: 'condition', field: 'creditSuccess', operator: 'true', value: true, description: '授信成功', logicOperator: 'and' },
          { id: 'c2', type: 'condition', field: 'withdrawCount', operator: '=', value: 0, description: '申请提现次数=0', logicOperator: 'and' },
          { id: 'c3', type: 'condition', field: 'blacklist', operator: 'false', value: false, description: '黑名单=0', logicOperator: 'and' },
        ],
      },
      userCount: 2340,
      enabled: true,
      createTime: '2026-01-17 09:15:00',
      createBy: '管理员',
    },
    {
      id: 'TAG-NEW-004',
      tagName: '安装未注册T1',
      tagType: 'newCustomer',
      tagCategory: 'acquisition',
      tagColor: 'orange',
      description: '安装成功后第一天，尚未注册的用户',
      conditionRoot: {
        id: 'root-4',
        type: 'group',
        logicOperator: 'and',
        children: [
          { id: 'c1', type: 'condition', field: 'installSuccess', operator: 'true', value: true, description: '安装成功T1', logicOperator: 'and' },
          { id: 'c2', type: 'condition', field: 'applySuccess', operator: 'false', value: false, description: '未申未注册成功', logicOperator: 'and' },
        ],
      },
      userCount: 1890,
      enabled: true,
      createTime: '2026-01-18 11:45:00',
      createBy: '管理员',
    },
    {
      id: 'TAG-OLD-001',
      tagName: '老客-结清T1',
      tagType: 'oldCustomer',
      tagCategory: 'retention',
      tagColor: 'purple',
      description: '结清后第一天，有多次放款记录，且可用额度充足的老客户',
      conditionRoot: {
        id: 'root-5',
        type: 'group',
        logicOperator: 'and',
        children: [
          { id: 'c1', type: 'condition', field: 'loanCount', operator: '>', value: 1, description: '放款次数>1', logicOperator: 'and' },
          { id: 'c2', type: 'condition', field: 'clearDays', operator: '=', value: 1, description: '结清T1', logicOperator: 'and' },
          { id: 'c3', type: 'condition', field: 'overdueOrders', operator: 'false', value: false, description: '无逾期订单', logicOperator: 'and' },
          { id: 'c4', type: 'condition', field: 'availableLimit', operator: '>=', value: 300000, description: '可用额度>=300000', logicOperator: 'and' },
          { id: 'c5', type: 'condition', field: 'blacklist', operator: 'false', value: false, description: '黑名单=0', logicOperator: 'and' },
        ],
      },
      userCount: 320,
      enabled: true,
      createTime: '2026-01-19 16:30:00',
      createBy: '管理员',
    },
    {
      id: 'TAG-RISK-001',
      tagName: '高风险客户',
      tagType: 'risk',
      tagCategory: 'recovery',
      tagColor: 'red',
      description: '黑名单客户或逾期严重客户',
      conditionRoot: {
        id: 'root-6',
        type: 'group',
        logicOperator: 'or',
        children: [
          { id: 'c1', type: 'condition', field: 'blacklist', operator: 'true', value: true, description: '黑名单客户', logicOperator: 'or' },
          {
            id: 'g1',
            type: 'group',
            logicOperator: 'and',
            children: [
              { id: 'c2', type: 'condition', field: 'overdueOrders', operator: 'true', value: true, description: '有逾期订单', logicOperator: 'and' },
              { id: 'c3', type: 'condition', field: 'creditDays', operator: '>=', value: 90, description: '逾期天数>=90', logicOperator: 'and' },
            ],
          },
        ],
      },
      userCount: 567,
      enabled: true,
      createTime: '2026-01-20 13:20:00',
      createBy: '管理员',
    },
    {
      id: 'TAG-RISK-002',
      tagName: '新客风险关注',
      tagType: 'risk',
      tagCategory: 'acquisition',
      tagColor: 'orange',
      description: '注册成功且(有逾期或黑名单)且授信成功T1',
      conditionRoot: {
        id: 'root-7',
        type: 'group',
        logicOperator: 'and',
        children: [
          { id: 'c1', type: 'condition', field: 'registerSuccess', operator: 'true', value: true, description: '注册成功', logicOperator: 'and' },
          {
            id: 'g1',
            type: 'group',
            logicOperator: 'or',
            children: [
              { id: 'c2', type: 'condition', field: 'overdueOrders', operator: 'true', value: true, description: '有逾期订单', logicOperator: 'or' },
              { id: 'c3', type: 'condition', field: 'blacklist', operator: 'true', value: true, description: '黑名单客户', logicOperator: 'or' },
            ],
          },
          { id: 'c4', type: 'condition', field: 'creditDays', operator: '=', value: 1, description: '授信成功T1', logicOperator: 'and' },
        ],
      },
      userCount: 123,
      enabled: true,
      createTime: '2026-05-29 10:00:00',
      createBy: '管理员',
    },
  ];
};

const generateId = () => `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const ConditionItem: React.FC<{
  node: ConditionNode;
  parentId: string;
  depth: number;
  onUpdate: (id: string, updates: Partial<ConditionNode>) => void;
  onDelete: (id: string, parentId: string) => void;
  onAddCondition: (parentId: string) => void;
  onAddGroup: (parentId: string) => void;
}> = ({ node, parentId, depth, onUpdate, onDelete, onAddCondition, onAddGroup }) => {
  const { t, language } = useLanguage();
  const fieldInfo = conditionFields.find(f => f.value === node.field);

  const translatedOperators = useMemo(() => {
    const result = ({
      boolean: operators.boolean.map(op => ({ ...op, label: op.label[language] })),
      number: operators.number.map(op => ({ ...op, label: op.label[language] })),
    });
    console.log('translatedOperators:', result);
    return result;
  }, [language]);

  const handleFieldChange = (value: string) => {
    const info = conditionFields.find(f => f.value === value);
    onUpdate(node.id, {
      field: value,
      operator: '',
      value: '',
      description: info?.label[language] || ''
    });
  };

  const handleOperatorChange = (value: string) => {
    const info = conditionFields.find(f => f.value === node.field);
    const opInfo = (info?.type === 'boolean' ? operators.boolean : operators.number).find(o => o.value === value);
    onUpdate(node.id, {
      operator: value,
      description: `${info?.label[language] || ''} ${opInfo?.label || value} ${node.value || ''}`
    });
  };

  const handleValueChange = (value: string) => {
    const info = conditionFields.find(f => f.value === node.field);
    const val = info?.type === 'number' ? Number(value) : value;
    onUpdate(node.id, {
      value: val,
      description: `${info?.label[language] || ''} ${node.operator} ${value}`
    });
  };

  const addMenu = (
    <Menu>
      <Menu.Item 
        key="condition" 
        icon={<PlusOutlined />}
        onClick={() => onAddCondition(parentId)}
      >
        {t.addCondition}
      </Menu.Item>
      <Menu.Item 
        key="group" 
        icon={<FolderOutlined />}
        onClick={() => onAddGroup(parentId)}
      >
        {t.addConditionGroup}
      </Menu.Item>
    </Menu>
  );

  const indentStyle = {
    paddingLeft: depth * 32 + 24,
    position: 'relative',
  };

  return (
    <div style={{ 
      ...indentStyle,
      position: 'relative',
    }}>
      <div 
        style={{
          position: 'absolute',
          left: depth * 32 + 8,
          top: 0,
          bottom: 0,
          width: 2,
          backgroundColor: '#d9d9d9',
        }} 
      />
      <div 
        style={{
          position: 'absolute',
          left: depth * 32 + 4,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 10,
          height: 10,
          backgroundColor: '#1890ff',
          borderRadius: '50%',
          border: '2px solid #fff',
          boxShadow: '0 0 0 2px #1890ff',
        }} 
      />
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 8, 
        marginBottom: 8,
        padding: '8px 12px',
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: 4,
        marginLeft: 12,
      }}>
        <Select
          value={node.field}
          onChange={handleFieldChange}
          placeholder="选择字段"
          options={conditionFields.map(f => ({ value: f.value, label: f.label[language] }))}
          style={{ width: 130 }}
        />
        <Select
          value={node.operator}
          onChange={handleOperatorChange}
          placeholder="操作符"
          options={translatedOperators[fieldInfo?.type === 'boolean' ? 'boolean' : 'number']}
          style={{ width: 100 }}
          disabled={!node.field}
        />
        <Input
          value={node.value !== undefined && node.value !== null ? String(node.value) : ''}
          onChange={(e) => handleValueChange(e.target.value)}
          placeholder="值"
          style={{ width: 100 }}
          disabled={!node.field || !node.operator}
        />
        <Tag color="blue" style={{ flexShrink: 0, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {node.description || '条件'}
        </Tag>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          <Dropdown overlay={addMenu} trigger={['click']}>
            <Button 
              type="text" 
              size="small" 
              icon={<PlusOutlined />} 
              style={{ color: '#1890ff' }}
            />
          </Dropdown>
          <Button 
            type="text" 
            size="small" 
            danger 
            icon={<MinusCircleOutlined />} 
            onClick={() => onDelete(node.id, parentId)}
          />
        </div>
      </div>
    </div>
  );
};

const ConditionGroup: React.FC<{
  node: ConditionNode;
  depth: number;
  parentId: string;
  onUpdate: (id: string, updates: Partial<ConditionNode>) => void;
  onDelete: (id: string, parentId: string) => void;
  onAddCondition: (parentId: string) => void;
  onAddGroup: (parentId: string) => void;
}> = ({ node, depth, parentId, onUpdate, onDelete, onAddCondition, onAddGroup }) => {
  const { t } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  
  const indentStyle = {
    paddingLeft: depth * 32,
    position: 'relative',
  };

  const addMenu = (
    <Menu>
      <Menu.Item 
        key="condition" 
        icon={<PlusOutlined />}
        onClick={() => onAddCondition(node.id)}
      >
        {t.addCondition}
      </Menu.Item>
      <Menu.Item 
        key="group" 
        icon={<FolderOutlined />}
        onClick={() => onAddGroup(node.id)}
      >
        {t.addConditionGroup}
      </Menu.Item>
    </Menu>
  );

  return (
    <div style={{ 
      ...indentStyle,
      position: 'relative',
    }}>
      {depth > 0 && (
        <>
          <div 
            style={{
              position: 'absolute',
              left: 8,
              top: 0,
              bottom: 0,
              width: 2,
              backgroundColor: '#d9d9d9',
            }} 
          />
          <div 
            style={{
              position: 'absolute',
              left: 4,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 10,
              height: 10,
              backgroundColor: '#722ed1',
              borderRadius: '50%',
              border: '2px solid #fff',
              boxShadow: '0 0 0 2px #722ed1',
            }} 
          />
        </>
      )}
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 8,
        padding: '8px 12px',
        backgroundColor: '#f0f5ff',
        border: '1px solid #adc6ff',
        borderRadius: 4,
        marginLeft: depth > 0 ? 12 : 0,
        marginTop: 8,
      }}>
        <Button 
          type="text" 
          size="small" 
          icon={<DownOutlined style={{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />} 
          onClick={() => setCollapsed(!collapsed)}
          style={{ padding: 0, width: 20, height: 20 }}
        />
        <FolderOpenOutlined style={{ color: '#1890ff' }} />
        <span style={{ fontWeight: 500, color: '#1890ff' }}>条件组</span>
        <span style={{ color: '#666', fontSize: 12 }}>
          {node.children?.length || 0} 项
        </span>
        <span style={{ color: '#999', fontSize: 11, marginLeft: 'auto' }}>
          层级 {depth + 1}
        </span>
        {depth > 0 && (
          <Button 
            type="text" 
            size="small" 
            danger 
            icon={<MinusCircleOutlined />} 
            onClick={() => onDelete(node.id, parentId)}
          />
        )}
      </div>
      
      {!collapsed && node.children && node.children.length > 0 && (
        <div style={{ marginTop: 4 }}>
          {node.children.map((child, index) => (
            <div key={child.id}>
              {index > 0 && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  margin: '4px 0',
                  paddingLeft: depth * 32 + (depth > 0 ? 12 : 0) + 24,
                }}>
                  <Select
                    value={child.logicOperator}
                    onChange={(value) => onUpdate(child.id, { logicOperator: value as 'and' | 'or' })}
                    options={[
                      { value: 'and', label: '且' },
                      { value: 'or', label: '或' },
                    ]}
                    style={{ width: 70 }}
                    size="small"
                  />
                </div>
              )}
              {child.type === 'condition' ? (
                <ConditionItem
                  node={child}
                  parentId={node.id}
                  depth={depth}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onAddCondition={onAddCondition}
                  onAddGroup={onAddGroup}
                />
              ) : (
                <ConditionGroup
                  node={child}
                  depth={depth + 1}
                  parentId={node.id}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onAddCondition={onAddCondition}
                  onAddGroup={onAddGroup}
                />
              )}
            </div>
          ))}
        </div>
      )}
      
      {!collapsed && (!node.children || node.children.length === 0) && (
        <div style={{ 
          marginLeft: depth * 32 + (depth > 0 ? 12 : 0) + 24,
          marginTop: 8,
          textAlign: 'center', 
          padding: 16, 
          border: '1px dashed #d9d9d9', 
          borderRadius: 4, 
          backgroundColor: '#fff' 
        }}>
          <p style={{ color: '#999', fontSize: 12 }}>暂无条件</p>
          <Dropdown overlay={addMenu} trigger={['click']}>
            <Button type="dashed" size="small" icon={<PlusOutlined />}>
              {t.addCondition} {t.or} {t.addConditionGroup}
            </Button>
          </Dropdown>
        </div>
      )}
    </div>
  );
};

const UserTagManagement: React.FC = () => {
  const { t, language } = useLanguage();
  const [tags, setTags] = useState<UserTag[]>(generateMockTags());
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<UserTag | null>(null);
  const [form] = Form.useForm();
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [conditionRoot, setConditionRoot] = useState<ConditionNode>({
    id: 'root',
    type: 'group',
    logicOperator: 'and',
    children: [],
  });

  const statistics = useMemo(() => {
    const totalTags = tags.length;
    const enabledTags = tags.filter(t => t.enabled).length;
    const totalUsers = tags.reduce((sum, tag) => sum + tag.userCount, 0);
    const newCustomerTags = tags.filter(t => t.tagType === 'newCustomer').length;
    const oldCustomerTags = tags.filter(t => t.tagType === 'oldCustomer').length;
    
    return { totalTags, enabledTags, totalUsers, newCustomerTags, oldCustomerTags };
  }, [tags]);

  const countConditions = (node: ConditionNode): number => {
    if (node.type === 'condition') return 1;
    return node.children?.reduce((sum, child) => sum + countConditions(child), 0) || 0;
  };

  const buildConditionText = (node: ConditionNode, isRoot = true): string => {
    if (node.type === 'condition') {
      return node.description || '';
    }
    if (!node.children || node.children.length === 0) {
      return '';
    }
    const childTexts = node.children.map((child, index) => {
      const childText = buildConditionText(child, false);
      if (index === 0) return childText;
      return ` ${child.logicOperator === 'and' ? '且' : '或'} ${childText}`;
    });
    const result = childTexts.join('');
    return isRoot ? result : `(${result})`;
  };

  const updateNode = (id: string, updates: Partial<ConditionNode>) => {
    const updateRecursively = (n: ConditionNode): ConditionNode => {
      if (n.id === id) {
        return { ...n, ...updates };
      }
      if (n.type === 'group' && n.children) {
        return {
          ...n,
          children: n.children.map(updateRecursively),
        };
      }
      return n;
    };
    setConditionRoot(updateRecursively(conditionRoot));
  };

  const deleteNode = (_id: string, _parentId: string) => {
    const deleteRecursively = (n: ConditionNode): ConditionNode | null => {
      if (n.id === _id) {
        return null;
      }
      if (n.type === 'group' && n.children) {
        return {
          ...n,
          children: n.children.map(deleteRecursively).filter((c): c is ConditionNode => c !== null),
        };
      }
      return n;
    };
    
    const newRoot = deleteRecursively(conditionRoot);
    if (newRoot === null || (newRoot.type === 'group' && (!newRoot.children || newRoot.children.length === 0))) {
      setConditionRoot({
        id: 'root',
        type: 'group',
        logicOperator: 'and',
        children: [],
      });
    } else {
      setConditionRoot(newRoot);
    }
  };

  const addCondition = (parentId: string) => {
    const addRecursively = (n: ConditionNode): ConditionNode => {
      if (n.id === parentId && n.type === 'group') {
        const newCondition: ConditionNode = {
          id: generateId(),
          type: 'condition',
          field: '',
          operator: '',
          value: '',
          description: '',
          logicOperator: n.children && n.children.length > 0 ? 'and' : 'and',
        };
        return {
          ...n,
          children: [...(n.children || []), newCondition],
        };
      }
      if (n.type === 'group' && n.children) {
        return {
          ...n,
          children: n.children.map(addRecursively),
        };
      }
      return n;
    };
    setConditionRoot(addRecursively(conditionRoot));
  };

  const addGroup = (parentId: string) => {
    const addRecursively = (n: ConditionNode): ConditionNode => {
      if (n.id === parentId && n.type === 'group') {
        const newGroup: ConditionNode = {
          id: generateId(),
          type: 'group',
          logicOperator: n.children && n.children.length > 0 ? 'and' : 'and',
          children: [],
        };
        return {
          ...n,
          children: [...(n.children || []), newGroup],
        };
      }
      if (n.type === 'group' && n.children) {
        return {
          ...n,
          children: n.children.map(addRecursively),
        };
      }
      return n;
    };
    setConditionRoot(addRecursively(conditionRoot));
  };

  const handleAdd = () => {
    form.resetFields();
    form.setFieldsValue({ tagColor: 'blue', enabled: true });
    setConditionRoot({
      id: 'root',
      type: 'group',
      logicOperator: 'and',
      children: [],
    });
    setEditingTag(null);
    setModalVisible(true);
  };

  const handleEdit = (record: UserTag) => {
    form.setFieldsValue({
      ...record,
    });
    setConditionRoot(JSON.parse(JSON.stringify(record.conditionRoot)));
    setEditingTag(record);
    setModalVisible(true);
  };

  const handleDelete = (record: UserTag) => {
    setTags(tags.filter(t => t.id !== record.id));
    message.success(t.deleteSuccess);
  };

  const handleToggleStatus = (record: UserTag) => {
    setTags(tags.map(t =>
      t.id === record.id ? { ...t, enabled: !t.enabled } : t
    ));
    message.success(record.enabled ? t.disabled : t.enabled);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const conditionCount = countConditions(conditionRoot);

      if (conditionCount === 0) {
        message.error(t.pleaseAddValidCondition);
        return;
      }

      if (editingTag) {
        const updatedTag = {
          ...editingTag,
          ...values,
          conditionRoot: conditionRoot,
        };
        setTags(tags.map(t => t.id === editingTag.id ? updatedTag : t));
        message.success(t.modifySuccess);
      } else {
        const newTag: UserTag = {
          ...values,
          id: `TAG-${Date.now()}`,
          conditionRoot: conditionRoot,
          userCount: 0,
          enabled: values.enabled !== false,
          createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
          createBy: '当前用户',
        };
        setTags([...tags, newTag]);
        message.success(t.addSuccess);
      }
      setModalVisible(false);
    });
  };

  const filteredTags = useMemo(() => {
    return tags.filter(tag => {
      const matchesKeyword = !searchKeyword || 
        tag.tagName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        tag.description.toLowerCase().includes(searchKeyword.toLowerCase());
      const matchesType = !filterType || tag.tagType === filterType;
      const matchesCategory = !filterCategory || tag.tagCategory === filterCategory;
      const matchesStatus = !filterStatus || 
        (filterStatus === 'enabled' && tag.enabled) ||
        (filterStatus === 'disabled' && !tag.enabled);
      return matchesKeyword && matchesType && matchesCategory && matchesStatus;
    });
  }, [tags, searchKeyword, filterType, filterCategory, filterStatus]);

  const tagColumns: ColumnsType<UserTag> = [
    {
      title: t.tagName,
      dataIndex: 'tagName',
      key: 'tagName',
      width: 180,
      render: (name: string, record: UserTag) => (
        <Space>
          <TagOutlined style={{ color: tagColors.find(c => c.value === record.tagColor)?.color }} />
          <span style={{ fontWeight: 500 }}>{name}</span>
        </Space>
      ),
    },
    {
      title: t.tagType,
      dataIndex: 'tagType',
      key: 'tagType',
      width: 120,
      render: (type: string) => {
        const typeInfo = tagTypes.find(item => item.value === type);
        return <Tag color={typeInfo?.color}>{typeInfo?.label[language]}</Tag>;
      },
    },
    {
      title: t.businessCategory,
      dataIndex: 'tagCategory',
      key: 'tagCategory',
      width: 100,
      render: (category: string) => {
        const categoryInfo = tagCategories.find(item => item.value === category);
        return <span>{categoryInfo?.label[language]}</span>;
      },
    },
    {
      title: t.description,
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: t.conditionCount,
      dataIndex: 'conditionRoot',
      key: 'conditions',
      width: 80,
      render: (root: ConditionNode) => (
        <Space>
          <DatabaseOutlined />
          <span>{countConditions(root)}</span>
        </Space>
      ),
    },
    {
      title: t.userCount,
      dataIndex: 'userCount',
      key: 'userCount',
      width: 120,
      sorter: (a, b) => a.userCount - b.userCount,
      render: (count: number) => (
        <Space>
          <UserOutlined />
          <span style={{ fontWeight: 500 }}>{count.toLocaleString()}</span>
        </Space>
      ),
    },
    {
      title: t.status,
      dataIndex: 'enabled',
      key: 'enabled',
      width: 100,
      render: (enabled: boolean) => (
        <Tag color={enabled ? 'success' : 'default'}>
          {enabled ? t.enabled : t.disabled}
        </Tag>
      ),
    },
    {
      title: t.action,
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={record.enabled ? t.disabled : t.enabled}>
            <Button 
              type="link" 
              icon={record.enabled ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
              onClick={() => handleToggleStatus(record)}
              style={{ color: record.enabled ? '#faad14' : '#52c41a' }}
            />
          </Tooltip>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            {t.edit}
          </Button>
          <Popconfirm
            title={t.confirmDeleteTag}
            onConfirm={() => handleDelete(record)}
            okText={t.confirm}
            cancelText={t.cancel}
          >
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const addMenu = (
    <Menu>
      <Menu.Item
        key="condition"
        icon={<PlusOutlined />}
        onClick={() => addCondition('root')}
      >
        {t.addCondition}
      </Menu.Item>
      <Menu.Item
        key="group"
        icon={<FolderOutlined />}
        onClick={() => addGroup('root')}
      >
        {t.addConditionGroup}
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {t.addCondition}
        </Button>
      </div>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card variant="borderless">
            <Statistic
              title={t.totalTags}
              value={statistics.totalTags}
              prefix={<TagOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless">
            <Statistic
              title={t.enabled}
              value={statistics.enabledTags}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless">
            <Statistic
              title="新客标签"
              value={statistics.newCustomerTags}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless">
            <Statistic
              title="老客标签"
              value={statistics.oldCustomerTags}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="标签列表" variant="borderless">
        <div style={{ marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Input
            placeholder="搜索标签名称或描述"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          <Select
            placeholder="标签类型"
            value={filterType || undefined}
            onChange={(value) => setFilterType(value || '')}
            style={{ width: 150 }}
            allowClear
            options={[
              { value: '', label: '全部类型' },
              ...tagTypes.map(type => ({ value: type.value, label: type.label[language] })),
            ]}
          />
          <Select
            placeholder="业务分类"
            value={filterCategory || undefined}
            onChange={(value) => setFilterCategory(value || '')}
            style={{ width: 130 }}
            allowClear
            options={[
              { value: '', label: '全部分类' },
              ...tagCategories.map(cat => ({ value: cat.value, label: cat.label[language] })),
            ]}
          />
          <Select
            placeholder="状态"
            value={filterStatus || undefined}
            onChange={(value) => setFilterStatus(value || '')}
            style={{ width: 120 }}
            allowClear
            options={[
              { value: '', label: '全部状态' },
              { value: 'enabled', label: '启用' },
              { value: 'disabled', label: '禁用' },
            ]}
          />
          {(searchKeyword || filterType || filterCategory || filterStatus) && (
            <Button onClick={() => {
              setSearchKeyword('');
              setFilterType('');
              setFilterCategory('');
              setFilterStatus('');
            }}>
              重置筛选
            </Button>
          )}
        </div>
        <Table
          columns={tagColumns}
          dataSource={filteredTags}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total) => `共 ${total} 条`,
            showQuickJumper: true,
          }}
          size="small"
          scroll={{ x: 1200 }}
          expandedRowRender={(record) => (
            <div style={{ padding: 16, backgroundColor: '#fafafa' }}>
              <h4 style={{ marginBottom: 12 }}>匹配条件</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
                <Tag color="blue" style={{ padding: '4px 12px', fontSize: 12 }}>
                  {buildConditionText(record.conditionRoot)}
                </Tag>
              </div>
            </div>
          )}
        />
      </Card>

      <Modal
        title={editingTag ? t.editStage : t.addCondition}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={900}
        okText={t.save}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="tagName"
                label={t.tagName}
                rules={[{ required: true, message: t.pleaseInput }]}
              >
                <Input placeholder={t.tagName} maxLength={50} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tagType"
                label={t.tagType}
                rules={[{ required: true, message: t.pleaseSelect }]}
              >
                <Select
                  placeholder={t.tagType}
                  options={tagTypes.map(type => ({ value: type.value, label: type.label[language] }))}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="tagCategory"
                label={t.tagCategory}
                rules={[{ required: true, message: t.pleaseSelect }]}
              >
                <Select
                  placeholder={t.tagCategory}
                  options={tagCategories.map(cat => ({ value: cat.value, label: cat.label[language] }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tagColor"
                label={t.tagColor}
                rules={[{ required: true, message: t.pleaseSelect }]}
              >
                <Select
                  placeholder={t.tagColor}
                  options={tagColors.map(color => ({ 
                    value: color.value, 
                    label: (
                      <Space>
                        <div style={{ 
                          width: 16, 
                          height: 16, 
                          backgroundColor: color.color, 
                          borderRadius: 4 
                        }} />
                        {color.label[language]}
                      </Space>
                    )
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label={t.description}
            rules={[{ required: true, message: t.pleaseInputDescription }]}
          >
            <Input.TextArea 
              placeholder={t.pleaseInputDescription} 
              rows={3}
              maxLength={200}
              showCount
            />
          </Form.Item>
          
          <Divider />
          
          <Form.Item label={t.condition}>
            <div style={{ 
              marginBottom: 16, 
              padding: '12px 16px',
              backgroundColor: '#fafafa',
              border: '1px solid #d9d9d9',
              borderRadius: 4,
              minHeight: 200,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <FolderOpenOutlined style={{ color: '#1890ff', fontSize: 18 }} />
                <span style={{ fontWeight: 600, fontSize: 14 }}>匹配条件</span>
                <span style={{ color: '#999', fontSize: 12 }}>
                  {conditionRoot.children?.length || 0} 项
                </span>
                <span style={{ color: '#999', fontSize: 11, marginLeft: 'auto' }}>
                  层级 1
                </span>
              </div>
              
              {conditionRoot.children && conditionRoot.children.length > 0 ? (
                conditionRoot.children.map((child, index) => (
                  <div key={child.id}>
                    {index > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0', paddingLeft: 24 }}>
                        <Select
                          value={child.logicOperator}
                          onChange={(value) => updateNode(child.id, { logicOperator: value as 'and' | 'or' })}
                          options={[
                            { value: 'and', label: '且' },
                            { value: 'or', label: '或' },
                          ]}
                          style={{ width: 70 }}
                          size="small"
                        />
                      </div>
                    )}
                    {child.type === 'condition' ? (
                      <ConditionItem
                        node={child}
                        parentId="root"
                        depth={0}
                        onUpdate={updateNode}
                        onDelete={deleteNode}
                        onAddCondition={addCondition}
                        onAddGroup={addGroup}
                      />
                    ) : (
                      <ConditionGroup
                        node={child}
                        depth={1}
                        parentId="root"
                        onUpdate={updateNode}
                        onDelete={deleteNode}
                        onAddCondition={addCondition}
                        onAddGroup={addGroup}
                      />
                    )}
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: 32, border: '1px dashed #d9d9d9', borderRadius: 4, backgroundColor: '#fff', marginTop: 12 }}>
                  <p style={{ color: '#999', marginBottom: 12 }}>暂无条件</p>
                  <Dropdown overlay={addMenu} trigger={['click']}>
                    <Button type="dashed" icon={<PlusOutlined />}>
                      添加条件或条件组
                    </Button>
                  </Dropdown>
                </div>
              )}
            </div>
            <div style={{ color: '#999', fontSize: 12, marginTop: 8 }}>
              <p>💡 视觉提示：</p>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>蓝色圆点标记为条件节点</li>
                <li>紫色圆点标记为条件组节点</li>
                <li>连接线表示层级从属关系</li>
                <li>缩进表示嵌套深度</li>
              </ul>
            </div>
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="enabled"
                label="状态"
                initialValue={true}
              >
                <Select
                  options={[
                    { value: true, label: '启用' },
                    { value: false, label: '禁用' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default UserTagManagement;