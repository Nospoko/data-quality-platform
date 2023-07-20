import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { Button, Modal, Spin } from 'antd';
import { useSession } from 'next-auth/react';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import MainChart from '../components/MainChart';
import ModalCharts from '../components/ZoomView';

import { Choice } from '@/lib/orm/entity/DataCheck';
import { changeChoice, fetchUserRecords } from '@/services/reactQueryFn';
import { SelectedHistoryChartData } from '@/types/common';

const History = () => {
  const [selectedChartData, setSelectedChartData] =
    useState<SelectedHistoryChartData | null>(null);
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [selectedDataCheck, setSelectedDataCheck] = useState<{
    dataCheckId: string;
    choice: Choice;
  } | null>(null);

  const [isZoomModal, setIsZoomModal] = useState(false);

  const { status } = useSession();
  const loading = status === 'loading';

  const {
    fetchNextPage,
    hasNextPage,
    data: historyData,
  } = useInfiniteQuery({
    queryKey: ['history-data'],
    queryFn: ({ pageParam = 1 }) => fetchUserRecords(pageParam, 5),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      const totalPages = Math.ceil(lastPage.total / 5);

      return nextPage <= totalPages ? nextPage : undefined;
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation(changeChoice, {
    onSuccess: () => {
      queryClient.invalidateQueries(['history-data']);
    },
  });

  const changeFeedback = (dataCheckId: string, choice: Choice) => {
    setSelectedDataCheck({ dataCheckId, choice });
    setIsConfirmModal(true);
  };

  const changeFeedbackOnZoomView = (dataCheckId: string, choice: Choice) => {
    mutation.mutate({ dataCheckId, choice });
  };

  const handleConfirm = () => {
    if (selectedDataCheck) {
      const { dataCheckId, choice } = selectedDataCheck;
      mutation.mutate({ dataCheckId, choice });
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

      {selectedChartData && (
        <ModalCharts
          chartData={selectedChartData}
          isOpen={isZoomModal}
          onClose={handleCloseModal}
          addFeedback={changeFeedbackOnZoomView}
        />
      )}

      {loading && (
        <StateWrapper>
          <Spin size="large" />
        </StateWrapper>
      )}

      {historyData
        ? historyData.pages.map((page) =>
            page.data.map((history) => (
              <MainChart
                key={history.record.index}
                id={history.record.index}
                addFeedback={changeFeedback}
                onClickChart={handleOpenModal}
                historyData={history}
              />
            )),
          )
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
