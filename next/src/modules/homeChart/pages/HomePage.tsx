import { useQuery } from '@tanstack/react-query';
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

  const { data, refetch } = useQuery({
    queryKey: ['records'],
    queryFn: () => fetchRecords(recordsToDisplay.length),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // add new records to display list
  // I added this complicated logic to avoid charts rerenders
  // It allow memorize all rendered chart
  // and improve performance
  useEffect(() => {
    if (!data) {
      return;
    }
    const existedRecordsId = recordsToDisplay.reduce((acc, d) => {
      acc[d.index] = true;
      return acc;
    }, {});
    const newRecords = data.data.filter(
      (record) => !existedRecordsId[record.index],
    );
    setRecordsToDisplay((prev) => [...prev, ...newRecords]);
  }, [data]);

  const fetchNextPage = () => {
    refetch();
  };

  const hasNextPage = data && data.total > recordsToDisplay.length;

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
