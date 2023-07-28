import { notification } from 'antd';

const showNotification = (type, duration = 1) => {
  notification[type]({
    message: undefined,
    placement: 'bottomRight',
    duration,
    style: { width: '100%', height: '60px' },
    maxCount: 1,
  });
};

export default showNotification;
