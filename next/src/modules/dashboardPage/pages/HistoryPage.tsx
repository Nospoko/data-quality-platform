import { Button, Modal, Spin, Typography } from 'antd';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Choice } from '@/lib/orm/entity/DataCheck';
import MainChart from '@/modules/dashboardPage/components/MainChart';
import SearchingForm from '@/modules/dashboardPage/components/SearchForm';
import ZoomView from '@/modules/dashboardPage/components/ZoomView';
import { changeChoice, fetchUserRecords } from '@/services/reactQueryFn';
import { Filter, HistoryData, SelectedHistoryChartData } from '@/types/common';

const History = () => {
  const router = useRouter();
  const { datasetName } = router.query as { datasetName: string };

  const [recordsToDisplay, setRecordsToDisplay] = useState<HistoryData[]>([]);
  const [selectedChartData, setSelectedChartData] =
    useState<SelectedHistoryChartData | null>(null);
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [selectedDataCheck, setSelectedDataCheck] = useState<{
    dataCheckId: string;
    choice: Choice;
  } | null>(null);

  const [isZoomModal, setIsZoomModal] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [filters, setFilters] = useState<Filter>({
    exams: [],
  });

  const { status } = useSession();
  const loading = status === 'loading';

  const fetchAndUpdateHistoryData = async (skip: number) => {
    try {
      const response = await fetchUserRecords(datasetName, skip, filters);
      const existedRecordsId = recordsToDisplay.reduce((acc, d) => {
        acc[d.record.index] = true;
        return acc;
      }, {});

      const newRecords = response.data?.filter(
        (record) => !existedRecordsId[record.record.index],
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
      const response = await fetchUserRecords(
        datasetName,
        0,
        paramFilters ?? filters,
        limit,
      );

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

  const changeFeedback = (dataCheckId: string, choice: Choice) => {
    setSelectedDataCheck({ dataCheckId, choice });
    setIsConfirmModal(true);
  };

  const changeFeedbackOnZoomView = async (
    dataCheckId: string,
    choice: Choice,
  ) => {
    setSelectedChartData(
      (prev) =>
        ({
          ...prev,
          decision: { ...prev?.decision, choice },
        } as SelectedHistoryChartData),
    );
    await changeChoice({ dataCheckId, choice });
    await refetchAndReplaceHistoryData(recordsToDisplay.length);
  };

  const handleConfirm = async () => {
    if (selectedDataCheck) {
      const { dataCheckId, choice } = selectedDataCheck;
      await changeChoice({ dataCheckId, choice });
      await refetchAndReplaceHistoryData(recordsToDisplay.length);
    }

    setIsConfirmModal(false);
  };

  const handleCancel = () => {
    setIsConfirmModal(false);
  };

  const handleOpenModal = useCallback((chartData: SelectedHistoryChartData) => {
    setSelectedChartData(chartData);
    setIsZoomModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedChartData(null);
    setIsZoomModal(false);
  }, []);

  const addNewFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    refetchAndReplaceHistoryData(0, newFilters);
  };

  useEffect(() => {
    refetchAndReplaceHistoryData(5);
  }, []);

  return (
    <>
      <Modal
        title="Confirmation"
        centered
        open={isConfirmModal}
        onOk={handleConfirm}
        onCancel={handleCancel}
      >
        <p>Are you sure you want to change the feedback?</p>
      </Modal>

      <Typography.Title style={{ margin: 0 }}>History</Typography.Title>
      <Typography.Title style={{ marginBottom: '16px' }} level={5}>
        Dataset Name: {datasetName}
      </Typography.Title>

      <SearchingFormWrapper>
        <SearchingForm onChangeFilter={addNewFilters} />
      </SearchingFormWrapper>

      {selectedChartData && (
        <ZoomView
          chartData={selectedChartData}
          isOpen={isZoomModal}
          onClose={handleCloseModal}
          addFeedback={changeFeedbackOnZoomView}
          zoomMode={false}
          isFetching={false}
        />
      )}

      {loading && (
        <StateWrapper>
          <Spin size="large" />
        </StateWrapper>
      )}

      {recordsToDisplay && !!recordsToDisplay.length ? (
        <>
          {recordsToDisplay.map((history) => (
            <MainChart
              datasetName={datasetName as string}
              key={history.record.index}
              record={history.record}
              isFirst={false}
              addFeedback={changeFeedback}
              onClickChart={handleOpenModal}
              historyData={history}
              isZoomView={false}
              isFetching={false}
            />
          ))}
          <Button disabled={!hasNextPage} onClick={fetchNextPage}>
            Load More
          </Button>
        </>
      ) : (
        <Typography.Text type="secondary">
          No history data found.
        </Typography.Text>
      )}
    </>
  );
};

export default History;

const StateWrapper = styled.div`
  display: flex;
  justify-content: center;
  font-size: 24px;
`;

const SearchingFormWrapper = styled.div`
  margin-bottom: 40px;
`;
