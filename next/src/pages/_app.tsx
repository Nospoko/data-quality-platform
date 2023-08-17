import 'reflect-metadata';

import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getNestedLayout ?? ((page) => page);
  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <GlobalStyle />
        <ThemeProvider clearTransition>
          {getLayout(<Component {...pageProps} />)}
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default App;
