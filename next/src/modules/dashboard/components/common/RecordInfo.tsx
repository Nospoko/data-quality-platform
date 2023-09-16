import { Descriptions } from 'antd';
import { format, parseISO } from 'date-fns';
import React from 'react';

import { Record } from '@/lib/orm/entity/Record';
import { EcgMetadata } from '@/types/common';

interface Props {
  record: Record;
}

const RecordInfo: React.FC<Props> = ({ record }) => {
  const { label, exam_uid, position, time } = record.metadata as EcgMetadata;

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
        <Descriptions.Item label="Label">{label}</Descriptions.Item>
        <Descriptions.Item label="Exam UID">{exam_uid}</Descriptions.Item>
        <Descriptions.Item label="Position">{position}</Descriptions.Item>
        <Descriptions.Item label="Time">
          {format(parseISO(time), 'yyyy-MMM-dd HH:mm:ss')}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default RecordInfo;
