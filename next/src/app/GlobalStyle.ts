import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html,
  body {
    /* overflow-x: hidden; */
    
    .dark-theme {
      background-color: #141414;
    }

    // RESET default style settings for Table
    .ant-table-wrapper .ant-table.ant-table-middle .ant-table-tbody .ant-table-wrapper:only-child .ant-table {
      margin-inline: 0;
    }
  }
`;

export default GlobalStyle;
