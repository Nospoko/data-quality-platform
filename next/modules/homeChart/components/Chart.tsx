import { useQuery } from '@tanstack/react-query';
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
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { styled } from 'styled-components';

import { getFragment } from '@/services/reactQueryFn';
import { EcgFragment } from '@/types/common';

interface ChartProps {
  id: number;
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

const MainChart: React.FC<ChartProps> = ({ id }) => {
  const [chartData, setChartData] = useState<any>();

  const { isLoading, error, data } = useQuery<EcgFragment, Error>(
    ['record', id],
    () => getFragment(id),
  );

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
      pointRadius: 1,
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
          <ChartDetails>
            {`target: 0.0, prediction: 0.83, source: lead1, exam:${data?.exam_uid}`}
          </ChartDetails>
          <ChartWrapper>
            <Line
              data={chartData}
              options={{
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
              }}
            />
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

export default MainChart;

const Wrapper = styled.div`
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ChartWrapper = styled.div`
  height: 280px; */
`;

const ChartDetails = styled.div`
  text-align: center;
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
