import { notification } from 'antd';

const showNotification = (type, shortcut, duration = 2) => {
  let message = '';
  let description = '';

  switch (shortcut) {
    case 'n':
      message = 'You have approved the card!';
      description = 'Keyboard shortcut: "n"';
      break;

    case 'x':
      message = 'You have marked the card as rejected!';
      description = 'Keyboard shortcut: "x"';
      break;

    case 'y':
      if (type === 'info') {
        message = 'You have opened the zoom view!';
      } else {
        message = 'You have marked the card as unknown!';
      }
      description = 'Keyboard shortcut: "y"';
      break;

    default:
      break;
  }

  notification[type]({
    message,
    description,
    duration,
  });
};

export default showNotification;
