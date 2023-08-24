import { Button, Input, Rate, Typography } from 'antd';
import React from 'react';
import { styled } from 'styled-components';

import { MidiFeedback } from '@/services/reactQueryFn';
import { HistoryData } from '@/types/common';

const desc = ['Terrible', 'Bad', 'Average', 'Good', 'Wonderful'];

type Props = {
  handleFeedback: (midiFeedback: MidiFeedback) => void;
  historyData?: HistoryData;
};

export default function Feedback({ handleFeedback, historyData }: Props) {
  const [rate, setRate] = React.useState<{ rhythm: number; quality: number }>({
    rhythm: historyData ? historyData.score1 : 0,
    quality: historyData ? historyData.score2 : 0,
  });
  const [commentValue, setCommentValue] = React.useState(
    historyData ? historyData.comment : '',
  );

  return (
    <RateContainer>
      <label style={{ flexGrow: 1 }}>
        <Typography.Text>Comment</Typography.Text>
        <Input
          style={{ width: 'full' }}
          placeholder="Enter your comment here..."
          value={commentValue}
          onChange={(e) => setCommentValue(e.target.value)}
        />
      </label>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Typography.Text>Rhythm</Typography.Text>
        <Rate
          tooltips={desc}
          onChange={(n) => setRate({ ...rate, rhythm: n })}
          value={rate?.rhythm}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Typography.Text>Quality</Typography.Text>
        <Rate
          tooltips={desc}
          onChange={(n) => setRate({ ...rate, quality: n })}
          value={rate?.quality}
        />
      </div>
      <Button
        onClick={() => {
          const midiFeedback: MidiFeedback = {
            comment: commentValue ? commentValue : undefined,
            rhythm: rate?.rhythm,
            quality: rate?.quality,
          };
          handleFeedback(midiFeedback);
        }}
        disabled={!rate?.quality || !rate?.rhythm}
        type="primary"
      >
        {historyData ? 'Update' : 'Submit'}
      </Button>
    </RateContainer>
  );
}

const RateContainer = styled.div`
  display: flex;
  margin-top: 4px;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
`;
