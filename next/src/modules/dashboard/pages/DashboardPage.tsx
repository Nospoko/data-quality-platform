import { Button, Layout, Spin, Switch, Typography } from 'antd';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import QueueAnim from 'rc-queue-anim';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import SearchingForm from '../components/common/SearchForm';
import MidiChart from '../components/midi/MidiChart';

import { useTheme } from '@/app/contexts/ThemeProvider';
import { Choice } from '@/lib/orm/entity/DataCheck';
import { Record } from '@/lib/orm/entity/Record';
import MainChart from '@/modules/dashboard/components/ecg/MainChart';
import ZoomView from '@/modules/dashboard/components/ecg/ZoomView';
import { getChartData } from '@/modules/dashboard/utils/getChartData';
import {
  fetchRecords,
  getFragment,
  MidiFeedback,
  sendFeedback,
} from '@/services/reactQueryFn';
import { Filter, SelectedChartData } from '@/types/common';

const DATA_PROBLEM = process.env.NEXT_PUBLIC_DATA_PROBLEM as
  | 'ecg_classification'
  | 'midi_review';

const DashboardPage = () => {
  const router = useRouter();
  const { datasetName } = router.query;

  const { isDarkMode } = useTheme();
  const [recordsToDisplay, setRecordsToDisplay] = useState<Record[]>([]);
  const [selectedChartData, setSelectedChartData] =
    useState<SelectedChartData | null>(null);
  const [isZoomModal, setIsZoomModal] = useState(false);
  const [zoomMode, setZoomMode] = useState(false);
  const [filters, setFilters] = useState<Filter>({
    exams: [],
  });
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);

  const { status } = useSession();
  const loading = status === 'loading';

  const fetchAndUpdateHistoryData = async () => {
    try {
      const response = await fetchRecords(filters);

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
      const response = await fetchRecords(paramFilters ?? filters, limit);

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
    fetchAndUpdateHistoryData();
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
    try {
      const fragment = await getFragment(
        exam_uid,
        position,
        datasetName as string,
      );
      const nextChartData = getChartData(id, fragment, isDarkMode);

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

  const addFeedbackMidi = useCallback(
    async (midiFeedback: MidiFeedback & { id: string }) => {
      await sendFeedback(midiFeedback);

      const nextIndex = recordsToDisplay.findIndex(
        (r) => r.id === midiFeedback.id,
      );
      const newRecords = recordsToDisplay.filter(
        (r) => r.id !== midiFeedback.id,
      );

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

  useEffect(() => {
    if (
      !recordsToDisplay.length ||
      recordsToDisplay.length >= 5 ||
      !hasNextPage
    ) {
      return;
    }

    setIsFetching(true);

    const timeoutId = setTimeout(() => {
      fetchNextPage();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [recordsToDisplay.length, fetchNextPage, hasNextPage]);

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
      const fragment = await getFragment(
        exam_uid,
        position,
        datasetName as string,
      );
      const nextChartData = getChartData(id, fragment, isDarkMode);

      handleOpenModal(nextChartData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <Typography.Title style={{ margin: 0 }}>Dashboard</Typography.Title>
      <Typography.Title style={{ marginBottom: '16px' }} level={5}>
        Dataset Name: {datasetName}
      </Typography.Title>

      <SearchingFormWrapper>
        <SearchingForm onChangeFilter={addNewFilters} />
      </SearchingFormWrapper>

      {DATA_PROBLEM === 'ecg_classification' && (
        <SwitchWrapper>
          <Switch
            checkedChildren="Zoom Mode ON"
            unCheckedChildren="Zoom Mode OFF"
            checked={zoomMode}
            onChange={handleClickZoomMode}
          />
        </SwitchWrapper>
      )}

      {selectedChartData && (
        <ZoomView
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
              selectedChoice === Choice.APPROVED
                ? 'green'
                : selectedChoice === Choice.REJECTED
                ? 'red'
                : '#1677ff',
            ],
          },
        ]}
      >
        {DATA_PROBLEM === 'ecg_classification' && recordsToDisplay
          ? recordsToDisplay.map((record, i) => (
              <MainChart
                key={record.index}
                isFirst={i === 0}
                isZoomView={isZoomModal}
                isFetching={isFetching}
                record={record}
                datasetName={datasetName as string}
                addFeedback={addFeedback}
                onClickChart={handleOpenModal}
              />
            ))
          : null}
      </QueueAnim>
      {DATA_PROBLEM === 'midi_review' &&
        recordsToDisplay &&
        recordsToDisplay.map((record) => (
          <MidiChart
            key={record.index}
            record={record}
            addFeedbackMidi={addFeedbackMidi}
          />
        ))}
      <Button disabled={!hasNextPage} onClick={fetchNextPage}>
        Load More
      </Button>
    </Layout>
  );
};

export default DashboardPage;

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
