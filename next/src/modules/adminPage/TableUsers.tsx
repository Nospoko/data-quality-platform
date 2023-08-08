import { Badge, Table, Tag } from 'antd';
import React from 'react';
import styled from 'styled-components';

import { Accordion } from './Accordion';

import { Organization } from '@/lib/orm/entity/Organization';
import { User } from '@/lib/orm/entity/User';
import { SubTableTypes } from '@/types/common';

interface Props {
  users: User[];
  allOrganizations: Organization[];
  onAddOrganizations: (userId: string, organizationIds: string[]) => void;
  onDeleteMembership: (userId: string, organizationId: string) => void;
}

const TableUsers: React.FC<Props> = ({
  users,
  allOrganizations,
  onAddOrganizations,
  onDeleteMembership,
}) => {
  const columns = [
    {
      title: 'First name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
      render: (text: number) => <Tag>{text}</Tag>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text: number) => <Tag>{text}</Tag>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (text: number) => <Tag>{text}</Tag>,
    },
    {
      title: 'Time of addition',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: 'Organizations',
      dataIndex: SubTableTypes.ORGANIZATIONS,
      key: SubTableTypes.ORGANIZATIONS,
      render: (text: string, record: any) => (
        <Badge count={record.totalMembershipsLeft}>
          <Tag color="default">
            {record.firstOrganizationName || 'No organizations'}
          </Tag>
        </Badge>
      ),
    },
  ];

  const data = users.map((user: User) => {
    const {
      id,
      firstName,
      lastName,
      email,
      createdAt,
      role,
      organizationMemberships,
    } = user;

    const formattedCreatedAt = createdAt
      ? new Date(createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'Invalid Date';

    return {
      key: id,
      firstName,
      lastName,
      role,
      email,
      createdAt: formattedCreatedAt,
      firstOrganizationName: organizationMemberships[0]?.organization.name,
      totalMembershipsLeft:
        organizationMemberships.length && organizationMemberships.length - 1,
      organizationMemberships,
    };
  });

  return (
    <Table
      size="middle"
      pagination={false}
      dataSource={data}
      columns={columns}
      expandRowByClick
      expandable={{
        expandedRowRender: ({ key: userId, organizationMemberships }) => {
          return organizationMemberships ? (
            <Accordion
              typeTab={SubTableTypes.USERS}
              data={organizationMemberships}
              allOrganizations={allOrganizations}
              userId={userId}
              onDeleteMembership={onDeleteMembership}
              onAddData={onAddOrganizations}
            />
          ) : null;
        },
        showExpandColumn: false,
      }}
      rowClassName="row-table"
    />
  );
};

export default TableUsers;

export const AccordionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 350px;

  @media (min-width: 744px) {
    max-width: 700px;
  }

  @media (min-width: 1000px) {
    max-width: 880px;
  }

  @media (min-width: 1200px) {
    max-width: 1080px;
  }

  @media (min-width: 1400px) {
    max-width: 100%;
  }
`;
