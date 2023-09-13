import 'reflect-metadata';

import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Typography } from 'antd';
import { NextPage } from 'next';
import { SessionProvider } from 'next-auth/react';
import { ReactElement, ReactNode } from 'react';

import { ThemeProvider } from '@/app/contexts/ThemeProvider';
import GlobalStyle from '@/app/GlobalStyle';

type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
  getNestedLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient();

const ALLOWED_DATA_PROBLEMS = [
  'ecg_classification',
  'midi_review',
  'ecg_segmentation',
] as const;
export type AllowedDataProblem = (typeof ALLOWED_DATA_PROBLEMS)[number];
const verifyDataProblem = (dataProblem: string | undefined) => {
  if (!dataProblem) {
    return false;
  }
  return ALLOWED_DATA_PROBLEMS.includes(
    dataProblem as (typeof ALLOWED_DATA_PROBLEMS)[number],
  );
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getNestedLayout ?? ((page) => page);

  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <GlobalStyle />
        <ThemeProvider clearTransition>
          {getLayout(
            verifyDataProblem(process.env.NEXT_PUBLIC_DATA_PROBLEM) ? (
              <Component {...pageProps} />
            ) : (
              <Typography.Title type="danger">
                The value provided for DATA_PROBLEM is not recognized.
                Application functionality is unavailable with the current
                setting
              </Typography.Title>
            ),
          )}
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default App;
