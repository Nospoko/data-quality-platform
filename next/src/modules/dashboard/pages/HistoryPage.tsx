import { Button, Modal, Spin } from 'antd';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Choice } from '@/lib/orm/entity/DataCheck';
import SearchingForm from '@/modules/dashboard/components/common/SearchForm';
import MainChart from '@/modules/dashboard/components/ecg/MainChart';
import ZoomView from '@/modules/dashboard/components/ecg/ZoomView';
import { changeChoice, fetchUserRecords } from '@/services/reactQueryFn';
import { Filter, HistoryData, SelectedHistoryChartData } from '@/types/common';

const History = () => {
  const router = useRouter();
  const { datasetName } = router.query;

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
      const response = await fetchUserRecords(skip, filters);
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

      {recordsToDisplay
        ? recordsToDisplay.map((history) => (
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
          ))
        : null}
      <Button disabled={!hasNextPage} onClick={fetchNextPage}>
        Load More
      </Button>
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
