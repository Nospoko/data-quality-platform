import { Button, Spin, Switch } from 'antd';
import { useSession } from 'next-auth/react';
import QueueAnim from 'rc-queue-anim';
import { useCallback, useEffect, useState } from 'react';
import { styled } from 'styled-components';

import MainChart from '../components/MainChart';
import SearchingForm from '../components/SearchForm';
import ModalCharts from '../components/ZoomView';
import { getChartData } from '../utils/getChartData';

import { Choice } from '@/lib/orm/entity/DataCheck';
import { Record } from '@/lib/orm/entity/Record';
import {
  fetchRecords,
  getFragment,
  sendFeedback,
} from '@/services/reactQueryFn';
import { Filter, SelectedChartData } from '@/types/common';

const HomePage = () => {
  const [recordsToDisplay, setRecordsToDisplay] = useState<Record[]>([]);
  const [selectedChartData, setSelectedChartData] =
    useState<SelectedChartData | null>(null);
  const [isZoomModal, setIsZoomModal] = useState(false);
  const [zoomMode, setZoomMode] = useState(false);
  // filtering settings object
  const [filters, setFilters] = useState<Filter>({
    exams: [],
  });
  const [hasNextPage, setHasNextPage] = useState(false);
  // To avoid don't necessarily click by the user,
  // when data is not updated
  const [isFetching, setIsFetching] = useState(false);

  // animation
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);

  const { status } = useSession();
  const loading = status === 'loading';

  const fetchAndUpdateHistoryData = async (skip: number) => {
    try {
      const response = await fetchRecords(skip, filters);

      // that logic remove all duplicates
      setRecordsToDisplay((prev) => {
        const uniqIds = new Set<string>();
        const newData: Record[] = [...prev, ...response.data];

        return newData.flatMap((element) => {
          if (uniqIds.has(element.id)) {
            return [];
          }

          uniqIds.add(element.id);
          return [element];
        });
      });

      if (response.total > recordsToDisplay.length + 5) {
        return setHasNextPage(true);
      }

      setHasNextPage(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
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
    } finally {
      setIsFetching(false);
    }
  };

  const fetchNextPage = () => {
    fetchAndUpdateHistoryData(recordsToDisplay.length);
  };

  const handleOpenModal = useCallback((chartData: SelectedChartData) => {
    setSelectedChartData(chartData);
    setIsZoomModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsZoomModal(false);
    setSelectedChartData(null);
    setZoomMode(false);
  }, []);

  const handleChangeNextChartData = async (record?: Record) => {
    if (!record) {
      handleCloseModal();
      return;
    }

    const { id, exam_uid, position } = record;
    // This part of the code getting ChartData for the n+1 record
    //We can avoid the secondary processing process if we could
    // use Context as a State manager
    try {
      const fragment = await getFragment(exam_uid, position);
      const nextChartData = getChartData(id, fragment);

      setSelectedChartData(nextChartData);
    } catch (error) {
      console.error(error);
    }
  };

  const addFeedback = useCallback(
    async (id: string, choice: Choice) => {
      await sendFeedback({ id, choice });

      setSelectedChoice(choice);

      const nextIndex = recordsToDisplay.findIndex((r) => r.id === id);
      const newRecords = recordsToDisplay.filter((r) => r.id !== id);

      setRecordsToDisplay(newRecords);

      if (isZoomModal && !zoomMode) {
        handleCloseModal();
      }

      if (zoomMode) {
        handleChangeNextChartData(newRecords[nextIndex]);
      }
    },
    [
      setRecordsToDisplay,
      handleChangeNextChartData,
      recordsToDisplay,
      zoomMode,
    ],
  );

  const addNewFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    refetchAndReplaceHistoryData(0, newFilters);
  };

  //fetch new records if records < 5
  useEffect(() => {
    if (
      !recordsToDisplay.length ||
      recordsToDisplay.length >= 5 ||
      // this prevent infinite fetching effect
      !hasNextPage
    ) {
      return;
    }

    // Add a timeout of 500ms before calling fetchNextPage()
    // for waiting animation duration
    setIsFetching(true);

    const timeoutId = setTimeout(() => {
      fetchNextPage();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [recordsToDisplay.length, fetchNextPage, hasNextPage]);

  // initial fetch
  useEffect(() => {
    refetchAndReplaceHistoryData(5);
  }, []);

  let selectedChoiceTimerId;

  useEffect(() => {
    if (selectedChoice !== null) {
      clearTimeout(selectedChoiceTimerId);
      return;
    }

    selectedChoiceTimerId = setTimeout(() => {
      setSelectedChoice(null);
    }, 300);
  }, [selectedChoice]);

  const handleClickZoomMode = async (state: boolean) => {
    if (!state) {
      return;
    }

    setZoomMode(true);

    const { id, exam_uid, position } = recordsToDisplay[0];

    try {
      const fragment = await getFragment(exam_uid, position);
      const nextChartData = getChartData(id, fragment);

      handleOpenModal(nextChartData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <SearchingFormWrapper>
        <SearchingForm onChangeFilter={addNewFilters} />
      </SearchingFormWrapper>

      <SwitchWrapper>
        <Switch
          checkedChildren="Zoom Mode ON"
          unCheckedChildren="Zoom Mode OFF"
          checked={zoomMode}
          onChange={handleClickZoomMode}
        />
      </SwitchWrapper>

      {selectedChartData && (
        <ModalCharts
          zoomMode={zoomMode}
          chartData={selectedChartData}
          isOpen={isZoomModal}
          isFetching={isFetching}
          onClose={handleCloseModal}
          addFeedback={addFeedback}
        />
      )}

      {loading && (
        <StateWrapper>
          <Spin size="large" />
        </StateWrapper>
      )}
      <QueueAnim
        style={{ width: '100%' }}
        type={['right', 'left']}
        component="div"
        appear
        animConfig={[
          { opacity: [1, 0], translateX: [0, 100] },
          {
            opacity: [1, 0],
            translateX: [0, 100],
            backgroundColor: [
              'black',
              selectedChoice === Choice.APPROVED ? 'green' : 'red',
            ],
          },
        ]}
      >
        {recordsToDisplay
          ? recordsToDisplay.map((record, i) => (
              <MainChart
                key={record.index}
                isFirst={i === 0}
                isZoomView={isZoomModal}
                isFetching={isFetching}
                record={record}
                addFeedback={addFeedback}
                onClickChart={handleOpenModal}
              />
            ))
          : null}
      </QueueAnim>
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

const SwitchWrapper = styled.div`
  margin-bottom: 40px;
`;

export default HomePage;
