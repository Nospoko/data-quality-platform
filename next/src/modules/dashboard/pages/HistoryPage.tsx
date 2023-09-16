import { Button, Modal, Spin, Typography } from 'antd';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import MidiChart from '../components/midi/MidiChart';
import { ChartRanges } from '../models';

import { Choice } from '@/lib/orm/entity/DataCheck';
import { Record } from '@/lib/orm/entity/Record';
import SearchingForm from '@/modules/dashboard/components/common/SearchForm';
import MainChart from '@/modules/dashboard/components/ecg/MainChart';
import ZoomView from '@/modules/dashboard/components/ecg/ZoomView';
import { AllowedDataProblem } from '@/pages/_app';
import dataCheck from '@/pages/api/data-check';
import {
  changeFeedbackECG,
  changeMidiFeedback,
  fetchUserRecords,
  MetadataField,
  MidiFeedback,
} from '@/services/reactQueryFn';
import {
  EcgMetadata,
  Filter,
  HistoryData,
  SelectedHistoryChartData,
} from '@/types/common';

const DATA_PROBLEM = process.env.NEXT_PUBLIC_DATA_PROBLEM as AllowedDataProblem;

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
    filterValues: [],
  });

  const [segmentationRanges, setSegmentationRanges] = useState<{
    [recordId: string]: ChartRanges;
  }>({});
  const getRangesForRecord = (recordId: Record['id']) => {
    if (DATA_PROBLEM === 'ecg_segmentation') {
      if (!segmentationRanges[recordId]) {
        const { segments } = recordsToDisplay.find(({ id }) => id === recordId)
          ?.metadata as EcgMetadata;
        setSegmentationRanges((ranges) => ({
          ...ranges,
          [recordId]: segments ?? {},
        }));
        return segments ?? {};
      } else {
        return segmentationRanges[recordId];
      }
    }
  };
  const getRangesUpdaterFn = (recordId: Record['id']) => {
    return (newRanges: ChartRanges) =>
      setSegmentationRanges((ranges) => ({ ...ranges, [recordId]: newRanges }));
  };

  const { status } = useSession();
  const loading = status === 'loading';

  const fetchAndUpdateHistoryData = async (skip: number) => {
    let metadataFieldToFilter: MetadataField | undefined;
    if (
      DATA_PROBLEM === 'ecg_classification' ||
      DATA_PROBLEM === 'ecg_segmentation'
    ) {
      metadataFieldToFilter = 'exam_uid';
    }
    if (DATA_PROBLEM === 'midi_review') {
      metadataFieldToFilter = 'midi_filename';
    }

    try {
      const { data: newRecords, total } = await fetchUserRecords(
        datasetName,
        skip,
        filters,
        metadataFieldToFilter,
      );

      setRecordsToDisplay((prev) => [...prev, ...newRecords]);
      if (total > recordsToDisplay.length + 5) {
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
    let metadataFieldToFilter: MetadataField | undefined;
    if (
      DATA_PROBLEM === 'ecg_classification' ||
      DATA_PROBLEM === 'ecg_segmentation'
    ) {
      metadataFieldToFilter = 'exam_uid';
    }
    if (DATA_PROBLEM === 'midi_review') {
      metadataFieldToFilter = 'midi_filename';
    }

    try {
      const response = await fetchUserRecords(
        datasetName,
        0,
        paramFilters ?? filters,
        metadataFieldToFilter,
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

  const changeFeedback = async (
    dataCheckId: string,
    choice: Choice,
    segments?: ChartRanges,
  ) => {
    if (DATA_PROBLEM === 'ecg_classification') {
      setSelectedDataCheck({ dataCheckId, choice });
      setIsConfirmModal(true);
    }
    if (DATA_PROBLEM === 'ecg_segmentation') {
      await changeFeedbackECG({ dataCheckId, choice, segments });
    }
  };

  const changeFeedbackForMidi = async (
    midiFeedback: MidiFeedback & { id: string },
  ) => {
    const { id, comment, quality, rhythm } = midiFeedback;
    await changeMidiFeedback({
      dataCheckId: id,
      comment: comment as string,
      quality: quality as number,
      rhythm: rhythm as number,
    });
    await refetchAndReplaceHistoryData(recordsToDisplay.length);
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
    await changeFeedbackECG({ dataCheckId, choice });
    await refetchAndReplaceHistoryData(recordsToDisplay.length);
  };

  const handleConfirm = async () => {
    if (selectedDataCheck) {
      const { dataCheckId, choice } = selectedDataCheck;
      await changeFeedbackECG({ dataCheckId, choice });
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

      {(DATA_PROBLEM === 'ecg_classification' ||
        DATA_PROBLEM === 'ecg_segmentation') && (
        <SearchingFormWrapper>
          <SearchingForm
            filterValue="exam_uid"
            onChangeFilter={addNewFilters}
          />
        </SearchingFormWrapper>
      )}
      {DATA_PROBLEM === 'midi_review' && (
        <SearchingFormWrapper>
          <SearchingForm
            filterValue="midi_filename"
            onChangeFilter={addNewFilters}
          />
        </SearchingFormWrapper>
      )}

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

      {(DATA_PROBLEM === 'ecg_classification' ||
        DATA_PROBLEM === 'ecg_segmentation') &&
      recordsToDisplay
        ? recordsToDisplay.map((history) => (
            <MainChart
              datasetName={datasetName as string}
              key={history.record.id}
              record={history.record}
              isFirst={false}
              addFeedback={changeFeedback}
              onClickChart={handleOpenModal}
              historyData={history}
              isZoomView={false}
              isFetching={false}
              ranges={getRangesForRecord(history.id)}
              updateRanges={getRangesUpdaterFn(history.id)}
            />
          ))
        : null}
      {DATA_PROBLEM === 'midi_review' &&
        recordsToDisplay &&
        recordsToDisplay.map((history) => (
          <MidiChart
            key={history.record.id}
            record={history.record}
            addFeedbackMidi={changeFeedbackForMidi}
            historyData={history}
          />
        ))}
      <Button
        style={{ marginBottom: 40 }}
        disabled={!hasNextPage}
        onClick={fetchNextPage}
      >
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
