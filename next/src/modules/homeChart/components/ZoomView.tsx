import { Modal } from 'antd';
import React from 'react';
import styled from 'styled-components';

import Chart from './Chart';
import Feedback from './Feedback';

import { Choice } from '@/lib/orm/entity/DataCheck';
import { SelectedChartData } from '@/types/common';

interface Props {
  chartData: SelectedChartData;
  isOpen: boolean;
  onClose: () => void;
  addFeedback: (index: number, choice: Choice) => void;
}

const ZoomView: React.FC<Props> = ({
  chartData,
  isOpen,
  onClose,
  addFeedback,
}) => {
  const { id, data } = chartData;

  const handleDecision = (choice: Choice) => {
    addFeedback(id, choice);
    onClose();
  };

  return (
    <>
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

            <Feedback isZoomView={true} handleSelect={handleDecision} />
          </Wrapper>

          <AdditionalWrapper>Additional info</AdditionalWrapper>
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
`;

const ChartsWrapper = styled.div`
  width: 100%;
`;

const AdditionalWrapper = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  border: 2px solid black;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
`;
