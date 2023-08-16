import { useQuery } from '@tanstack/react-query';
import { Card, Layout, List, Tag, Typography } from 'antd';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import React from 'react';

import { getDatasetsInfo } from '../utils/helpers/getDatasetsInfo';

import { User } from '@/lib/orm/entity/User';
import { fetchUserById } from '@/services/reactQueryFn';

const DashboardDatasetSelect = () => {
  const { data: session } = useSession();
  const userId = session?.user.id;

  if (!userId) {
    return null;
  }

  const router = useRouter();

  const { data: userData } = useQuery<User, Error>(['user'], () =>
    fetchUserById(userId),
  );

  const datasetsInfo = userData && getDatasetsInfo(userData);

  const data = datasetsInfo?.map((datasetInfo) => {
    const { name, organizations, isActive } = datasetInfo;

    return {
      key: name,
      title: name,
      isActive: isActive,
      body: (
        <div>
          <List
            grid={{ gutter: 16 }}
            style={{ display: 'flex', justifyContent: 'center' }}
            dataSource={organizations}
            renderItem={(organization) => (
              <List.Item
                key={organization.id}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <Tag style={{ margin: 0 }}>{organization.name}</Tag>
              </List.Item>
            )}
          />
          {!datasetInfo.isActive && (
            <Tag style={{ margin: 0, color: 'red' }}>
              {'Dataset inactive, concat admin to activate'}
            </Tag>
          )}
        </div>
      ),
    };
  });

  const handleOnClickCard = (datasetName: string, isActive: boolean) => {
    if (!datasetName || !isActive) {
      return;
    }

    router.push(`/dashboard/${datasetName}`);
  };

  return (
    <Layout>
      <Typography.Title style={{ textAlign: 'center', marginBottom: '16px' }}>
        Welcome to the Dashboard
      </Typography.Title>

      <Typography.Title
        level={4}
        style={{ textAlign: 'center', margin: '0 0 30px 0' }}
      >
        Select a dataset to view a collection.
      </Typography.Title>

      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item key={item.key}>
            <Card
              bodyStyle={{
                minHeight: '100px',
                padding: '12px',
                display: 'flex',
                justifyContent: 'center',
                cursor: item.isActive ? 'pointer' : 'not-allowed',
              }}
              headStyle={{
                cursor: item.isActive ? 'pointer' : 'not-allowed',
              }}
              style={{ textAlign: 'center' }}
              title={item.title}
              hoverable
              onClick={() => handleOnClickCard(item.key, item.isActive)}
            >
              {item.body}
            </Card>
          </List.Item>
        )}
      />
    </Layout>
  );
};

export default DashboardDatasetSelect;
