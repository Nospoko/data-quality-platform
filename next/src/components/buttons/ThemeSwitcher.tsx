import { Switch } from 'antd';
import React from 'react';
import { BsMoon, BsSun } from 'react-icons/bs';

import { useTheme } from '@/app/contexts/ThemeProvider';

const ThemeSwitcher = () => {
  const { isDarkMode, handleChangeTheme } = useTheme();

  return (
    <Switch
      defaultChecked={isDarkMode}
      style={{ paddingTop: '1px' }}
      checkedChildren={<BsSun />}
      unCheckedChildren={<BsMoon />}
      onChange={handleChangeTheme}
    />
  );
};

export default ThemeSwitcher;
