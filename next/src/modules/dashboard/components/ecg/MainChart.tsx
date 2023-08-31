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
import React, { forwardRef, memo, useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { styled } from 'styled-components';

import {
  darkTheme,
  getChartSettings,
  LEGEND_DATA_DARK,
  LEGEND_DATA_LIGHT,
  lightTheme,
} from '../../models';
import { mockEcgRanges } from '../../models';
import { getChartData } from '../../utils/getChartData';
import showNotification from '../../utils/helpers/showNotification';
import RecordInfo from '../common/RecordInfo';
import Feedback from './Feedback';

import { useTheme } from '@/app/contexts/ThemeProvider';
import { Choice } from '@/lib/orm/entity/DataCheck';
import { Record } from '@/lib/orm/entity/Record';
import { getFragment } from '@/services/reactQueryFn';
import {
  EcgFragment,
  HistoryData,
  SelectedChartData,
  SelectedHistoryChartData,
  ThemeType,
} from '@/types/common';

const DATA_PROBLEM = process.env.NEXT_PUBLIC_DATA_PROBLEM as
  | 'ecg_classification'
  | 'midi_review';

interface Props {
  record: Record;
  datasetName: string;
  isFirst: boolean;
  isZoomView: boolean;
  isFetching?: boolean;
  addFeedback: (index: number | string, choice: Choice) => void;
  onClickChart: (data: SelectedChartData | SelectedHistoryChartData) => void;
  historyData?: HistoryData;
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

const MainChart: React.ForwardRefRenderFunction<HTMLDivElement, Props> = (
  {
    record,
    datasetName,
    historyData,
    addFeedback,
    onClickChart,
    isFirst,
    isZoomView,
    isFetching = false,
  },
  ref,
) => {
  const [chartData, setChartData] = useState<SelectedChartData | null>(null);

  const { theme, isDarkMode } = useTheme();
  const LEGEND_DATA = isDarkMode ? LEGEND_DATA_DARK : LEGEND_DATA_LIGHT;

  const chartSettings = useMemo(
    () =>
      DATA_PROBLEM === 'ecg_classification'
        ? getChartSettings(theme, mockEcgRanges, chartData?.data?.labels)
        : getChartSettings(theme),
    [theme, chartData],
  );

  const { isLoading, data: fragment } = useQuery<EcgFragment, Error>(
    ['record', record.id],
    () => getFragment(record.exam_uid, record.position, datasetName),
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

    const processedChartData = getChartData(record.id, fragment, isDarkMode);

    setChartData({ ...processedChartData, decision: historyData });
  }, [fragment, historyData, isDarkMode]);

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
      <ChartWrapper color={theme}>
        {isLoading || !chartData?.data ? (
          <Loader>
            <Spin size="large" />
          </Loader>
        ) : (
          <>
            <LineDescriptionWrapper>
              <DescriptionWrapper>
                <RecordInfo record={record} />
              </DescriptionWrapper>

              <LineWrapper>
                <Line data={chartData.data} options={chartSettings} />
              </LineWrapper>
            </LineDescriptionWrapper>
            {DATA_PROBLEM === 'ecg_classification' && (
              <ButtonWrapper>
                <Feedback
                  handleSelect={handleSelect}
                  onOpenZoomView={handleClickChart}
                  decision={historyData?.choice}
                  isFetching={isFetching}
                  isZoomView={isZoomView}
                />
              </ButtonWrapper>
            )}
          </>
        )}
      </ChartWrapper>
      {!isLoading && chartData?.data && (
        <>
          <LegendContainer>
            <CustomLegend color={theme}>
              {LEGEND_DATA.map((d) => (
                <LegendRow key={d.label}>
                  <LineColor color={d.color} />
                  <LegendValue>{d.label}</LegendValue>
                </LegendRow>
              ))}
            </CustomLegend>
          </LegendContainer>
        </>
      )}
    </Wrapper>
  );
};

export default memo(forwardRef(MainChart));

const Wrapper = styled.div`
  margin-bottom: 40px;
  height: 100%;
`;

const DescriptionWrapper = styled.div`
  margin-bottom: 4px;
`;

const LineWrapper = styled.div`
  width: 100%;
  height: 300px;
`;

const LineDescriptionWrapper = styled.div`
  height: 100%;
  grid-area: 1 / 1 / 1 / 2;

  @media (min-width: 744px) {
    grid-area: 1 / 1 / 2 / 10;
  }

  @media (min-width: 1024px) {
    grid-area: 1 / 1 / 2 / 18;
  }
`;

const ChartWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 300px;

  padding: 10px;

  border: 1px solid
    ${(props) => (props.color === ThemeType.DARK ? '#fff' : '#000')};
  border-radius: 8px;

  background-color: ${(props) =>
    props.color === ThemeType.DARK
      ? darkTheme.backgroundColorMain
      : lightTheme.backgroundColorMain};

  @media (min-width: 744px) {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: 1fr;
    grid-column-gap: 20px;
    grid-row-gap: 0px;

    align-items: center;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(18, 1fr);
    grid-column-gap: 16px;
  }
`;

const ButtonWrapper = styled.div`
  height: 90%;
  grid-area: 1 / 2 / 2 / 2;

  @media (min-width: 744px) {
    grid-area: 1 / 10 / 2 / 11;
  }

  @media (min-width: 1024px) {
    grid-area: 1 / 18 / 2 / 19;
  }
`;

const CustomLegend = styled.div`
  position: absolute;
  top: -265px;
  left: 50px;
  height: 65px;
  width: 100px;
  border: 1px solid;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.8);
  padding: 5px 8px;

  @media (min-width: 744px) {
    top: -130px;
    left: 60px;
  }
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
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  /* border: solid 1px; */
`;
