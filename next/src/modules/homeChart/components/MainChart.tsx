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
import { memo, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { styled } from 'styled-components';

import { chartSettings } from '../models';
import { processSignal } from '../utils/processSignal';
import Feedback from './Feedback';

import { Choice } from '@/lib/orm/entity/DataCheck';
import { getFragment } from '@/services/reactQueryFn';
import { Dataset, EcgFragment, SelectedChartData } from '@/types/common';

interface Props {
  id: number;
  addFeedback: (index: number, choice: Choice) => void;
  onClickChart: (data: SelectedChartData) => void;
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

const MainChart: React.FC<Props> = ({ id, addFeedback, onClickChart }) => {
  const [chartData, setChartData] = useState<SelectedChartData | null>(null);

  const {
    isLoading,
    error,
    data: fragment,
  } = useQuery<EcgFragment, Error>(['record', id], () => getFragment(id));

  const handleSelect = (choice: Choice) => {
    addFeedback(id, choice);
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

    const labels = fragment.signal.map((_, index) => index);
    const processedSignal = processSignal(fragment);
    const datasets = processedSignal.signal[0].map((_, index) => ({
      label: `lead ${index + 1}`,
      data: processedSignal.signal.map((signal) => signal[index]),
      fill: false,
      borderColor: LEGEND_DATA[index].color,
      tension: 0,
      pointRadius: 0,
      borderWidth: 1,
    }));

    setChartData({
      id,
      data: { labels, datasets },
    });
  }, [fragment]);

  return (
    <>
      <Wrapper>
        <ChartWrapper>
          {isLoading || !chartData?.data ? (
            <Loader>
              <Spin size="large" />
            </Loader>
          ) : (
            <LineWrapper onClick={handleClickChart}>
              <Line data={chartData.data} options={chartSettings} />
            </LineWrapper>
          )}
          <ButtonWrapper>
            <Feedback
              onOpenZoomView={handleClickChart}
              handleSelect={handleSelect}
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
    </>
  );
};

export default memo(MainChart);

const Wrapper = styled.div`
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 300px;
`;

const LineWrapper = styled.div`
  width: 100%;
  height: 300px;
  cursor: pointer;
`;

const ChartWrapper = styled.div`
  display: flex;
  gap: 12px;
`;

const ButtonWrapper = styled.div`
  padding: 12px 0;
  height: 100%;
  width: 40px;
`;

const CustomLegend = styled.div`
  position: absolute;
  top: -105px;
  left: 40px;
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
