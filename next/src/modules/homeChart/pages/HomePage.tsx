import { Button, Spin } from 'antd';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import FlipMove from 'react-flip-move';
import { styled } from 'styled-components';

import MainChart from '../components/MainChart';
import SearchingForm from '../components/SearchForm';
import ModalCharts from '../components/ZoomView';

import { Choice } from '@/lib/orm/entity/DataCheck';
import { Record } from '@/lib/orm/entity/Record';
import { fetchRecords, sendFeedback } from '@/services/reactQueryFn';
import { Filter, SelectedChartData } from '@/types/common';

const HomePage = () => {
  const [recordsToDisplay, setRecordsToDisplay] = useState<Record[]>([]);
  const [selectedChartData, setSelectedChartData] =
    useState<SelectedChartData | null>(null);
  const [isZoomModal, setIsZoomModal] = useState(false);
  // filtering settings object
  const [filters, setFilters] = useState<Filter>({
    exams: [],
  });
  const [hasNextPage, setHasNextPage] = useState(false);

  const { status } = useSession();
  const loading = status === 'loading';

  const fetchAndUpdateHistoryData = async (skip: number) => {
    try {
      const response = await fetchRecords(skip, filters);
      const existedRecordsId = recordsToDisplay.reduce((acc, d) => {
        acc[d.index] = true;
        return acc;
      }, {});
      const newRecords = response.data.filter(
        (record) => !existedRecordsId[record.index],
      );

      setRecordsToDisplay((prev) => [...prev, ...newRecords]);
      if (response.total > recordsToDisplay.length + 5) {
        return setHasNextPage(true);
      }
      setHasNextPage(false);
    } catch (error) {
      console.error(error);
    }
  };

  const refetchAndReplaceHistoryData = async (
    limit: number,
    paramFilters?: Filter,
  ) => {
    try {
      const response = await fetchRecords(0, paramFilters ?? filters, limit);

      setRecordsToDisplay(response.data);
      if (response.total > recordsToDisplay.length + 5) {
        return setHasNextPage(true);
      }
      setHasNextPage(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNextPage = () => {
    fetchAndUpdateHistoryData(recordsToDisplay.length);
  };

  const addFeedback = useCallback(
    async (id: string, choice: Choice) => {
      await sendFeedback({ id, choice });
      setRecordsToDisplay((prev) => {
        return prev.filter((r) => r.id !== id);
      });
    },
    [setRecordsToDisplay],
  );

  const handleOpenModal = useCallback((chartData: SelectedChartData) => {
    setSelectedChartData(chartData);
    setIsZoomModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsZoomModal(false);
    setSelectedChartData(null);
  }, []);

  const addNewFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    refetchAndReplaceHistoryData(0, newFilters);
  };

  //fetch new records if records < 5
  useEffect(() => {
    if (!recordsToDisplay.length || recordsToDisplay.length >= 5) {
      return;
    }
    fetchNextPage();
  }, [recordsToDisplay.length, fetchNextPage]);

  // initial fetch
  useEffect(() => {
    refetchAndReplaceHistoryData(5);
  }, []);

  return (
    <>
      <SearchingFormWrapper>
        <SearchingForm onChangeFilter={addNewFilters} />
      </SearchingFormWrapper>

      {selectedChartData && (
        <ModalCharts
          chartData={selectedChartData}
          isOpen={isZoomModal}
          onClose={handleCloseModal}
          addFeedback={addFeedback}
        />
      )}

      {loading && (
        <StateWrapper>
          <Spin size="large" />
        </StateWrapper>
      )}
      <FlipMove>
        {recordsToDisplay
          ? recordsToDisplay.map((record, i) => (
              <MainChart
                key={record.index}
                isFirst={i === 0}
                record={record}
                addFeedback={addFeedback}
                onClickChart={handleOpenModal}
              />
            ))
          : null}
      </FlipMove>
      <Button disabled={!hasNextPage} onClick={fetchNextPage}>
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

const SearchingFormWrapper = styled.div`
  margin-bottom: 40px;
`;

export default HomePage;
