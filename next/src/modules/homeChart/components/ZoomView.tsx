import { useQuery } from '@tanstack/react-query';
import { Modal } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';

import Chart from './Chart';
import Feedback from './Feedback';

import { Choice } from '@/lib/orm/entity/DataCheck';
import { getFragment } from '@/services/reactQueryFn';
import {
  EcgFragment,
  SelectedChartData,
  SelectedHistoryChartData,
} from '@/types/common';

interface Props {
  chartData: SelectedChartData | SelectedHistoryChartData;
  isOpen: boolean;
  onClose: () => void;
  addFeedback: (index: number | string, choice: Choice) => void;
}

const ZoomView: React.FC<Props> = ({
  chartData,
  isOpen,
  onClose,
  addFeedback,
}) => {
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<Choice | null>(null);

  const { id, data, decision } = chartData;

  const {
    isLoading,
    error,
    data: fragment,
  } = useQuery<EcgFragment, Error>(['record', id], () => getFragment(id));

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
    onClose();
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

  return (
    <>
      <Modal
        title="Confirmation"
        centered
        visible={isConfirmModal}
        onOk={handleConfirm}
        onCancel={handleCancel}
      >
        <p>Are you sure you want to change the feedback?</p>
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
                  return <Chart key={dataset.label} data={lineProps} />;
                })}
            </ChartsWrapper>

            <ButtonWrapper>
              <Feedback
                isZoomView={true}
                handleSelect={handleDecision}
                decision={decision?.choice}
              />
            </ButtonWrapper>
          </Wrapper>

          <AdditionalWrapper>
            <FragmentTitle>
              Label: <FragmentInfo>{fragment?.label}</FragmentInfo>
            </FragmentTitle>
            <FragmentTitle>
              Position: <FragmentInfo>{fragment?.position}</FragmentInfo>
            </FragmentTitle>
            <FragmentTitle>
              Exam UID: <FragmentInfo>{fragment?.exam_uid}</FragmentInfo>
            </FragmentTitle>
          </AdditionalWrapper>
        </ModalBody>
      </Modal>
    </>
  );
};

export default ZoomView;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

const ChartsWrapper = styled.div`
  width: 100%;
`;

const ButtonWrapper = styled.div`
  height: 450px;
  width: 60px;
`;

const AdditionalWrapper = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: space-between;
  gap: 20px;
  border: 2px solid black;
  border-radius: 8px;
`;

const FragmentTitle = styled.b`
  font-size: 20px;
`;

const FragmentInfo = styled.span`
  font-weight: normal;
`;
