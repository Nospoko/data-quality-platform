import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Spin } from 'antd';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { styled } from 'styled-components';

import MainChart from '../components/MainChart';
import ModalCharts from '../components/ZoomView';

import { Choice } from '@/lib/orm/entity/DataCheck';
import { Record } from '@/lib/orm/entity/Record';
import { fetchRecords, sendFeedback } from '@/services/reactQueryFn';
import { SelectedChartData } from '@/types/common';

const HomePage = () => {
  const [recordsToDisplay, setRecordsToDisplay] = useState<Record[]>([]);
  const [selectedChartData, setSelectedChartData] =
    useState<SelectedChartData | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const { status } = useSession();
  const loading = status === 'loading';

  const { data: records, refetch } = useQuery({
    queryKey: ['records'],
    queryFn: () => fetchRecords(recordsToDisplay.length),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  const queryClient = useQueryClient();

  const mutation = useMutation(sendFeedback, {
    onSuccess: () => {
      queryClient.invalidateQueries(['dataCheck']);
    },
  });

  const addFeedback = (index: number, choice: Choice) => {
    mutation.mutate({ index, choice });
    setRecordsToDisplay((prev) => {
      return prev.filter((r) => r.index !== index);
    });
  };

  // add new records to display list
  // I added this complicated logic to avoid charts rerenders
  // It allow memorize all rendered chart
  // and improve performance
  useEffect(() => {
    if (!records) {
      return;
    }
    const existedRecordsId = recordsToDisplay.reduce((acc, d) => {
      acc[d.index] = true;
      return acc;
    }, {});
    const newRecords = records.data.filter(
      (record) => !existedRecordsId[record.index],
    );
    setRecordsToDisplay((prev) => [...prev, ...newRecords]);
  }, [records]);

  const fetchNextPage = () => {
    refetch();
  };

  const hasNextPage = records && records.total > recordsToDisplay.length;

  //fetch new records if records <  5
  useEffect(() => {
    if (recordsToDisplay.length >= 5) {
      return;
    }
    fetchNextPage();
  }, [recordsToDisplay.length, fetchNextPage]);

  if (status === 'unauthenticated') {
    return <h1>Please sign in</h1>;
  }

  const handleOpenModal = useCallback((chartData: SelectedChartData) => {
    setSelectedChartData(chartData);
    setOpenModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
    setSelectedChartData(null);
  }, []);

  const handleFetchNextPage = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  return (
    <>
      {selectedChartData && (
        <ModalCharts
          chartData={selectedChartData}
          isOpen={openModal}
          onClose={handleCloseModal}
          addFeedback={addFeedback}
        />
      )}

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
              onClickChart={handleOpenModal}
            />
          ))
        : null}
      <Button disabled={!hasNextPage} onClick={handleFetchNextPage}>
        Load More
      </Button>
    </>
  );
};

const StateWrapper = styled.div`
  display: flex;
  justify-content: center;
  font-size: 24px;
`;

export default HomePage;
