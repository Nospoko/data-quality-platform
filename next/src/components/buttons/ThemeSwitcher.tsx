import { Switch } from 'antd';
import { getCookie } from 'cookies-next';
import React from 'react';
import { BsMoon, BsSun } from 'react-icons/bs';

import { useTheme } from '@/app/contexts/ThemeProvider';
import { ThemeType } from '@/types/common';

const ThemeSwitcher = () => {
  const theme = getCookie('theme');
  const { handleChangeTheme } = useTheme();

  return (
    <Switch
      defaultChecked={theme === ThemeType.DARK}
      checkedChildren={<BsSun />}
      unCheckedChildren={<BsMoon />}
      onChange={handleChangeTheme}
    />
  );
};

export default ThemeSwitcher;
