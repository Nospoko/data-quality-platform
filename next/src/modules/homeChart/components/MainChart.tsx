import { useQuery } from '@tanstack/react-query';
import { Spin } from 'antd';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { forwardRef, memo, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { styled } from 'styled-components';

import { chartSettings } from '../models';
import { getChartData } from '../utils/getChartData';
import showNotification from '../utils/helpers/showNotification';
import Feedback from './Feedback';
import RecordInfo from './RecordInfo';

import { Choice } from '@/lib/orm/entity/DataCheck';
import { Record } from '@/lib/orm/entity/Record';
import { getFragment } from '@/services/reactQueryFn';
import {
  EcgFragment,
  HistoryData,
  SelectedChartData,
  SelectedHistoryChartData,
} from '@/types/common';

interface Props {
  record: Record;
  isFirst: boolean;
  isZoomView: boolean;
  isFetching: boolean;
  addFeedback: (index: number | string, choice: Choice) => void;
  onClickChart: (data: SelectedChartData | SelectedHistoryChartData) => void;
  historyData?: HistoryData;
}

const LEGEND_DATA = [
  { color: 'blue', label: 'lead 1' },
  { color: 'orange', label: 'lead 2' },
  { color: 'green', label: 'lead 3' },
];

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const MainChart: React.ForwardRefRenderFunction<HTMLDivElement, Props> = (
  {
    record,
    historyData,
    addFeedback,
    onClickChart,
    isFirst,
    isZoomView,
    isFetching,
  },
  ref,
) => {
  const [chartData, setChartData] = useState<SelectedChartData | null>(null);

  const { isLoading, data: fragment } = useQuery<EcgFragment, Error>(
    ['record', record.id],
    () => getFragment(record.exam_uid, record.position),
  );

  const handleSelect = (choice: Choice) => {
    if (!chartData || choice === chartData.decision?.choice) {
      return;
    }

    if (historyData) {
      addFeedback(historyData.id, choice);

      return;
    }

    addFeedback(record.id, choice);
  };

  const handleClickChart = () => {
    if (!chartData) {
      return;
    }

    onClickChart(chartData);
  };

  useEffect(() => {
    if (!fragment) {
      return;
    }

    const processedChartData = getChartData(record.id, fragment);

    setChartData(processedChartData);
  }, [fragment, historyData]);

  useEffect(() => {
    if (!chartData || !isFirst || isFetching || isZoomView) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'n':
          addFeedback(record.id, Choice.APPROVED);
          showNotification('success');
          break;

        case 'x':
          addFeedback(record.id, Choice.REJECTED);
          showNotification('error');

          break;

        case 'y':
          if (isZoomView) {
            addFeedback(record.id, Choice.UNKNOWN);
            showNotification('error');

            break;
          }

          onClickChart(chartData);
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    record.id,
    addFeedback,
    onClickChart,
    chartData,
    isFirst,
    isZoomView,
    isFetching,
  ]);

  return (
    <Wrapper ref={ref}>
      <ChartWrapper>
        {isLoading || !chartData?.data ? (
          <Loader>
            <Spin size="large" />
          </Loader>
        ) : (
          <LineDescriptionWrapper>
            <DescriptionWrapper>
              <RecordInfo record={record} />
            </DescriptionWrapper>

            <LineWrapper>
              <Line data={chartData.data} options={chartSettings} />
            </LineWrapper>
          </LineDescriptionWrapper>
        )}
        <ButtonWrapper>
          <Feedback
            handleSelect={handleSelect}
            onOpenZoomView={handleClickChart}
            decision={historyData?.choice}
            isFetching={isFetching}
          />
        </ButtonWrapper>
      </ChartWrapper>
      <LegendContainer>
        <CustomLegend>
          {LEGEND_DATA.map((d) => (
            <LegendRow key={d.label}>
              <LineColor color={d.color} />
              <LegendValue>{d.label}</LegendValue>
            </LegendRow>
          ))}
        </CustomLegend>
      </LegendContainer>
    </Wrapper>
  );
};

export default memo(forwardRef(MainChart));

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* height: 100%; */
`;

const DescriptionWrapper = styled.div`
  margin-bottom: 4px;
`;

const LineWrapper = styled.div`
  width: 100%;
  height: 300px;
`;

const LineDescriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const ChartWrapper = styled.div`
  display: flex;
  gap: 12px;
  min-height: 300px;

  padding: 10px;
  margin-bottom: 16px;

  border: 1px solid #000;
  border-radius: 8px;
`;

const ButtonWrapper = styled.div`
  padding: 12px 0;
  min-height: 100%;
  width: 40px;
`;

const CustomLegend = styled.div`
  position: absolute;
  top: -130px;
  left: 60px;
  height: 65px;
  width: 100px;
  border: 1px solid;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.8);
  padding: 5px 8px;
`;

const LegendContainer = styled.div`
  position: relative;
`;

const LineColor = styled.div`
  width: 20px;
  height: 0;
  border: 1px solid ${(props) => props.color};
`;

const LegendRow = styled.div`
  display: flex;
  align-items: center;
`;

const LegendValue = styled.div`
  padding-left: 10px;
`;

const Loader = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: solid 1px;
`;
