import { notification } from 'antd';

import ApproveIcon from '@/components/icons/ApproveIcon';
import ErrorIcon from '@/components/icons/ErrorIcon';
import QuestionIcon from '@/components/icons/QuestionIcon';

const showNotification = (type, duration = 1) => {
  const icon =
    type === 'error' ? (
      <ErrorIcon />
    ) : type == 'success' ? (
      <ApproveIcon />
    ) : (
      <QuestionIcon />
    );
  notification['open']({
    message: null,
    placement: 'bottomRight',
    duration,
    style: { width: '100%', height: '60px' },
    closeIcon: icon,
  });
};

export default showNotification;
