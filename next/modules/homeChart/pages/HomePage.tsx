import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import { useSession } from 'next-auth/react';
import { styled } from 'styled-components';

import MainChart from '../components/Chart';

import { fetchRecords, getFragment } from '@/services/reactQueryFn';
import { EcgFragment } from '@/types/common';

const HomePage = () => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage } =
    useInfiniteQuery(
      ['records'],
      ({ pageParam = 1 }) => fetchRecords(pageParam, 10),
      {
        getNextPageParam: (lastPage, allPages) => {
          const nextPage = allPages.length + 1;
          const totalPages = Math.ceil(lastPage.total / 10);
          return nextPage <= totalPages ? nextPage : undefined;
        },
      },
    );

  return (
    <div>
      {/* {loading && (
        <StateWrapper>
          <Spin size="large" />
        </StateWrapper>
      )} */}

      {data
        ? data.pages[0].data.map((record, index) => (
            <MainChart key={record.exam_uid} id={index} />
          ))
        : null}
    </div>
  );
};

// const StateWrapper = styled.div`
//   display: flex;
//   justify-content: center;
//   font-size: 24px;
// `;

export default HomePage;
