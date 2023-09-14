import { CheckOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { ChartRanges } from '../../models';
import Chart from './Chart';
import Feedback from './Feedback';

import { useTheme } from '@/app/contexts/ThemeProvider';
import { Choice } from '@/lib/orm/entity/DataCheck';
import showNotification from '@/modules/dashboard/utils/helpers/showNotification';
import { AllowedDataProblem } from '@/pages/_app';
import {
  SelectedChartData,
  SelectedHistoryChartData,
  ThemeType,
} from '@/types/common';

const DATA_PROBLEM = process.env.NEXT_PUBLIC_DATA_PROBLEM as AllowedDataProblem;

interface Props {
  zoomMode: boolean;
  chartData: SelectedChartData | SelectedHistoryChartData;
  isOpen: boolean;
  isFetching?: boolean;
  onClose: () => void;
  addFeedback: (index: number | string, choice: Choice) => void;
  ranges?: ChartRanges;
  updateRanges?: (newRanges: ChartRanges) => void;
}

const ZoomView: React.FC<Props> = ({
  zoomMode,
  chartData,
  isOpen,
  isFetching = false,
  onClose,
  addFeedback,
  ranges,
  updateRanges,
}) => {
  const { theme } = useTheme();

  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<Choice | null>(null);

  const { id, fragment, data, decision } = chartData;
  const { position, exam_uid } = fragment;

  const handleDecision = (choice: Choice) => {
    if (decision?.choice === choice) {
      return;
    }

    if (decision) {
      setSelectedDecision(choice);
      setIsConfirmModal(true);

      return;
    }

    if (!id) {
      return;
    }

    addFeedback(id, choice);
  };

  const handleConfirm = () => {
    if (!decision || !selectedDecision) {
      return;
    }

    if (!decision.id) {
      return;
    }

    addFeedback(decision.id, selectedDecision);
    setIsConfirmModal(false);
  };

  const handleCancel = () => {
    setIsConfirmModal(false);
  };

  useEffect(() => {
    if (!chartData || isFetching || !isOpen) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'n':
          addFeedback(id, Choice.APPROVED);
          showNotification('success');

          if (!zoomMode) {
            onClose();
          }

          break;
        case 'x':
          addFeedback(id, Choice.REJECTED);
          showNotification('error');

          if (!zoomMode) {
            onClose();
          }

          break;
        case 'y':
          addFeedback(id, Choice.UNKNOWN);
          showNotification(Choice.UNKNOWN);

          if (!zoomMode) {
            onClose();
          }

          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [id, addFeedback, chartData, zoomMode, isFetching, isOpen]);

  return (
    <>
      <Modal
        title="Confirmation"
        centered
        open={isConfirmModal}
        onOk={handleConfirm}
        onCancel={handleCancel}
      >
        <p>Are you sure you want to change the label?</p>
      </Modal>

      <Modal
        centered
        open={isOpen}
        onCancel={onClose}
        width={1000}
        footer={null}
      >
        <ModalBody>
          <Wrapper>
            <ChartsWrapper>
              {data &&
                data.datasets.map((dataset) => {
                  const lineProps = {
                    labels: data.labels,
                    datasets: [{ ...dataset }],
                  };
                  return (
                    <ChartContainer key={dataset.label}>
                      <Chart
                        data={lineProps}
                        ranges={ranges}
                        updateRanges={updateRanges}
                      />
                    </ChartContainer>
                  );
                })}
            </ChartsWrapper>

            <ButtonWrapper>
              <Feedback
                isFetching={isFetching}
                isZoomView={true}
                handleSelect={handleDecision}
                decision={decision?.choice}
              >
                {DATA_PROBLEM === 'ecg_segmentation' && (
                  <Button
                    style={{
                      height: '30%',
                      width: '100%',
                      color: 'green',
                      backgroundColor: 'transparent',
                      border: '1px solid green',
                    }}
                    type="primary"
                    size="large"
                    icon={<CheckOutlined />}
                    onClick={() => addFeedback(id, Choice.APPROVED)}
                    disabled={
                      isFetching ||
                      Object.keys(ranges as ChartRanges).length === 0
                    }
                  />
                )}
              </Feedback>
            </ButtonWrapper>
          </Wrapper>

          <AdditionalWrapper color={theme}>
            <FragmentTitle>
              Position: <FragmentInfo>{position}</FragmentInfo>
            </FragmentTitle>
            <FragmentTitle>
              Exam UID: <FragmentInfo>{exam_uid}</FragmentInfo>
            </FragmentTitle>
          </AdditionalWrapper>
        </ModalBody>
      </Modal>
    </>
  );
};

export default ZoomView;

const ModalBody = styled.div`
  width: 100%;
  height: 100%;
  padding: 26px 0 26px 0;

  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  @media (min-width: 744px) {
    flex-direction: row;
  }
`;

const ChartsWrapper = styled.div`
  width: 100%;
`;

const ChartContainer = styled.div`
  margin-bottom: 2px;
`;

const ButtonWrapper = styled.div`
  height: 100%;
  min-width: 300px;

  @media (min-width: 744px) {
    min-width: 60px;
    height: 450px;
  }
`;

const AdditionalWrapper = styled.div`
  margin-top: 20px;
  padding: 20px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;

  border: 2px solid
    ${(props) => (props.color === ThemeType.DARK ? '#fff' : '#000')};
  border-radius: 8px;

  @media (min-width: 744px) {
    flex-direction: row;
  }
`;

const FragmentTitle = styled.b`
  font-size: 14px;

  @media (min-width: 744px) {
    font-size: 20px;
  }
`;

const FragmentInfo = styled.span`
  font-weight: normal;
`;
