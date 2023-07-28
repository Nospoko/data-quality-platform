import { notification } from 'antd';

import ApproveIcon from '@/components/icons/ApproveIcon';
import ErrorIcon from '@/components/icons/ErrorIcon';

const showNotification = (type, duration = 1) => {
  const icon = type === 'error' ? <ErrorIcon /> : <ApproveIcon />;
  notification['open']({
    message: null,
    placement: 'bottomRight',
    duration,
    style: { width: '100%', height: '60px' },
    closeIcon: icon,
  });
};

export default showNotification;
