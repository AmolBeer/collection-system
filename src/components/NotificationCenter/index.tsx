import React, { useState } from 'react';
import { Badge, Dropdown, Tag, Button, Space, Typography } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface FollowUp {
  id: string;
  caseId: string;
  customerName: string;
  followUpDate: string;
  daysRemaining: number;
  priority: 'high' | 'medium' | 'low';
}

const NotificationCenter: React.FC = () => {
  const [followUps, setFollowUps] = useState<FollowUp[]>([
    { id: '1', caseId: 'KREDITOK008946', customerName: 'EZI SADRAKH SAPUTRA', followUpDate: '2024-05-22', daysRemaining: 1, priority: 'high' },
    { id: '2', caseId: 'KREDITOK008947', customerName: 'JOHN DOE', followUpDate: '2024-05-23', daysRemaining: 2, priority: 'medium' },
    { id: '3', caseId: 'KREDITOK008948', customerName: 'JANE SMITH', followUpDate: '2024-05-25', daysRemaining: 4, priority: 'low' },
  ]);

  const [open, setOpen] = useState(false);

  const handleMarkAsDone = (id: string) => {
    setFollowUps(followUps.filter(f => f.id !== id));
  };

  const createMenuItems = () => {
    const items: any[] = [
      {
        key: 'header',
        label: (
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
            <Text strong style={{ fontSize: '14px' }}>Follow-up Reminders</Text>
          </div>
        ),
        disabled: true,
      },
    ];

    if (followUps.length === 0) {
      items.push({
        key: 'empty',
        label: (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <Text type="secondary">No pending follow-ups</Text>
          </div>
        ),
        disabled: true,
      });
    } else {
      followUps.forEach(item => {
        items.push({
          key: item.id,
          label: (
            <div style={{ 
              padding: '12px 16px',
              borderBottom: '1px solid #f0f0f0',
              backgroundColor: item.daysRemaining <= 1 ? '#fef2f2' : 'transparent'
            }}>
              <Space style={{ width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Space>
                    <Text strong style={{ fontSize: '13px' }}>{item.customerName}</Text>
                    <Tag 
                      color={item.priority === 'high' ? 'red' : item.priority === 'medium' ? 'orange' : 'blue'}
                      style={{ fontSize: '11px', margin: 0 }}
                    >
                      {item.priority}
                    </Tag>
                  </Space>
                  <div style={{ marginTop: 4 }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>Case: {item.caseId}</Text>
                    <br />
                    <Text 
                      type={item.daysRemaining <= 1 ? 'danger' : 'secondary'} 
                      style={{ fontSize: '12px' }}
                    >
                      Due: {item.followUpDate} ({item.daysRemaining} day{item.daysRemaining > 1 ? 's' : ''} remaining)
                    </Text>
                  </div>
                </div>
                <Button 
                  type="text" 
                  icon={<CheckOutlined />} 
                  size="small"
                  onClick={() => handleMarkAsDone(item.id)}
                  style={{ color: '#22c55e' }}
                >
                  Done
                </Button>
              </Space>
            </div>
          ),
        });
      });
    }

    return items;
  };

  return (
    <Dropdown 
      menu={{ items: createMenuItems() }}
      open={open}
      onOpenChange={setOpen}
      trigger={['click']}
      placement="bottomRight"
    >
      <Badge count={followUps.length} overflowCount={99} style={{ backgroundColor: '#ef4444' }}>
        <BellOutlined 
          style={{ 
            fontSize: '18px', 
            color: '#6b7280', 
            cursor: 'pointer' 
          }} 
        />
      </Badge>
    </Dropdown>
  );
};

export default NotificationCenter;
