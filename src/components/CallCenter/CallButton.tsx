import React from 'react';
import { Button, Tooltip, message } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';

interface CallButtonProps {
  phone: string;
  contactName?: string;
  relationship?: string;
}

const CallButton: React.FC<CallButtonProps> = ({ phone, contactName, relationship }) => {
  const handleCall = () => {
    // 模拟拨打电话功能
    // 实际项目中可以集成第三方通话API
    message.info(`正在拨打 ${contactName || '用户'} 的电话: ${phone}`);
    // 这里可以添加实际的通话逻辑
  };

  const getTooltipTitle = () => {
    if (contactName && relationship) {
      return `${contactName} (${relationship}): ${phone}`;
    }
    return phone;
  };

  return (
    <Tooltip title={getTooltipTitle()}>
      <Button
        type="primary"
        icon={<PhoneOutlined />}
        onClick={handleCall}
        size="small"
        style={{ marginRight: 8 }}
      >
        拨打
      </Button>
    </Tooltip>
  );
};

export default CallButton;