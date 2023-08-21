import { Descriptions } from 'antd';
import React from 'react';

import { Record } from '@/lib/orm/entity/Record';

interface Props {
  record: Record;
}

const RecordInfo: React.FC<Props> = ({ record }) => {
  const { index, exam_uid, position, time, label } = record;

  return (
    <>
      <Descriptions
        size="small"
        labelStyle={{
          border: '1px solid #1677ff',
          fontWeight: 'bold',
        }}
        contentStyle={{
          border: '1px solid #1677ff',
        }}
        bordered
        column={{ xxl: 5, xl: 5, lg: 5, md: 3, sm: 2, xs: 1 }}
      >
        <Descriptions.Item label="Index">{index}</Descriptions.Item>
        <Descriptions.Item label="Exam UID">{exam_uid}</Descriptions.Item>
        <Descriptions.Item label="Position">{position}</Descriptions.Item>
        <Descriptions.Item label="Time">{time as any}</Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default RecordInfo;
