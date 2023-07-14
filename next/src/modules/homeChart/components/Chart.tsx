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
import { memo } from 'react';
import { Line } from 'react-chartjs-2';
import { styled } from 'styled-components';

import { chartSettings } from '../models';
import { getLimits } from '../utils/getRange';

import { ChartData } from '@/types/common';

interface Props {
  data: ChartData;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const Chart: React.FC<Props> = ({ data }) => {
  const { borderColor, label, data: signal } = data.datasets[0];
  const limits = getLimits(signal);

  return (
    <>
      <Wrapper>
        <Line
          data={data}
          options={{
            ...chartSettings,
            scales: {
              ...chartSettings.scales,
              y: {
                ...chartSettings.scales.y,
                min: limits[0],
                max: limits[1],
              },
            },
          }}
        />
        <LegendContainer>
          <CustomLegend>
            <LegendRow>
              <LineColor color={borderColor?.toString()} />
              <LegendValue>{label}</LegendValue>
            </LegendRow>
          </CustomLegend>
        </LegendContainer>
      </Wrapper>
    </>
  );
};

export default memo(Chart);

const Wrapper = styled.div`
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const CustomLegend = styled.div`
  display: flex;
  padding: 5px 8px;
  position: absolute;
  justify-content: center;
  align-items: center;
  top: -70px;
  left: 40px;
  border: 1px solid;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.8);
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
