import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';
import 'reflect-metadata';

type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
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
        {getLayout(<Component {...pageProps} />)}
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default App;
