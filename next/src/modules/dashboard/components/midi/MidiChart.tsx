import dynamic from 'next/dynamic';
import React from 'react';
import { styled } from 'styled-components';

import Feedback from './Feedback';

import { useTheme } from '@/app/contexts/ThemeProvider';
import { Record } from '@/lib/orm/entity/Record';
import { MidiFeedback } from '@/services/reactQueryFn';
import { HistoryData, ThemeType } from '@/types/common';

const DynamicMidiPlayer = dynamic(() => import('./MidiPlayer'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

type Props = {
  record: Record;
  addFeedbackMidi: (midiFeedback: MidiFeedback & { id: string }) => void;
  historyData?: HistoryData;
};

export default function MidiChart({
  record,
  addFeedbackMidi,
  historyData,
}: Props) {
  const { theme } = useTheme();

  const handleFeedback = (midiFeedback: MidiFeedback) => {
    if (historyData) {
      addFeedbackMidi({
        ...midiFeedback,
        id: historyData.id,
      });

      return;
    }
    addFeedbackMidi({ id: record.id, ...midiFeedback });
  };

  return (
    <Wrapper color={theme}>
      <DynamicMidiPlayer />
      <Feedback historyData={historyData} handleFeedback={handleFeedback} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  border: 1px solid
    ${(props) => (props.color === ThemeType.DARK ? '#fff' : '#000')};
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 40px;
`;
