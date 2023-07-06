import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

import Feedback from './Feedback';

import { Choice } from '@/lib/orm/entity/DataCheck';
import { getFragment, sendFeedback } from '@/services/reactQueryFn';
import { EcgFragment } from '@/types/common';

interface ChartProps {
  id: number;
  addFeedback: (index: number) => void;
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

const MainChart: React.FC<ChartProps> = ({ id, addFeedback }) => {
  const [chartData, setChartData] = useState<any>();

  const { isLoading, error, data } = useQuery<EcgFragment, Error>(
    ['record', id],
    () => getFragment(id),
  );

  const queryClient = useQueryClient();
  const mutation = useMutation(sendFeedback, {
    onSuccess: () => {
      queryClient.invalidateQueries(['dataCheck']);
    },
  });

  const handleSelect = (choice: Choice) => {
    mutation.mutate({ index: id, choice });
    addFeedback(id);
  };

  useEffect(() => {
    if (!data) {
      return;
    }
    const labels = data.signal.map((_, index) => index);
    const datasets = data.signal[0].map((_, index) => ({
      label: `lead ${index + 1}`,
      data: data.signal.map((signal) => signal[index]),
      fill: false,
      borderColor: LEGEND_DATA[index].color,
      tension: 0,
      pointRadius: 0,
      borderWidth: 1,
    }));

    setChartData({
      labels,
      datasets,
    });
  }, [data]);

  return (
    <>
      {chartData && (
        <Wrapper>
          <ChartWrapper>
            <Line
              data={chartData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
              }}
            />
            <Feedback handleSelect={handleSelect} />
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
      )}
    </>
  );
};

export default memo(MainChart);

const Wrapper = styled.div`
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ChartWrapper = styled.div`
  display: flex;
`;

const CustomLegend = styled.div`
  position: absolute;
  top: -115px;
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
