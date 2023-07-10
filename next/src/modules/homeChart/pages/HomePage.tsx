import { useInfiniteQuery } from '@tanstack/react-query';
import { Button, Spin } from 'antd';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { styled } from 'styled-components';

import MainChart from '../components/MainChart';

import { Record } from '@/lib/orm/entity/Record';
import { fetchRecords } from '@/services/reactQueryFn';
const HomePage = () => {
  const { status } = useSession();
  const loading = status === 'loading';

  const [recordsToDisplay, setRecordsToDisplay] = useState<Record[]>([]);

  const { fetchNextPage, hasNextPage, isFetchingNextPage, data } =
    useInfiniteQuery({
      queryKey: ['records'],
      queryFn: ({ pageParam = 1 }) => fetchRecords(pageParam, 5),
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        const totalPages = Math.ceil(lastPage.total / 5);
        return nextPage <= totalPages ? nextPage : undefined;
      },
    });

  // add new rerocds to display list
  useEffect(() => {
    if (!data) {
      return;
    }
    const latestPage = data.pages.length - 1;
    setRecordsToDisplay((prev) => [...prev, ...data.pages[latestPage].data]);
  }, [data]);

  //fetch new records if records <  5
  useEffect(() => {
    if (recordsToDisplay.length >= 5) {
      return;
    }
    fetchNextPage();
  }, [recordsToDisplay.length, fetchNextPage]);

  const addFeedback = useCallback(
    (index: number) => {
      setRecordsToDisplay((prev) => {
        return prev.filter((r) => r.index !== index);
      });
    },
    [setRecordsToDisplay],
  );

  if (status === 'unauthenticated') {
    return <h1>Please sign in</h1>;
  }
  return (
    <div>
      {loading && (
        <StateWrapper>
          <Spin size="large" />
        </StateWrapper>
      )}
      {recordsToDisplay
        ? recordsToDisplay.map((record) => (
            <MainChart
              key={record.index}
              id={record.index}
              addFeedback={addFeedback}
            />
          ))
        : null}
      <Button disabled={!hasNextPage} onClick={fetchNextPage}>
        Load More
      </Button>
    </div>
  );
};

const StateWrapper = styled.div`
  display: flex;
  justify-content: center;
  font-size: 24px;
`;

export default HomePage;
