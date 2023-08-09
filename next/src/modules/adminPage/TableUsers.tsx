import { Badge, Table, Tag } from 'antd';
import { useSession } from 'next-auth/react';
import React from 'react';
import styled from 'styled-components';

import { Accordion } from './Accordion';
import UserRoleRenderer from './UserRoleRenderer';

import { Organization } from '@/lib/orm/entity/Organization';
import { User } from '@/lib/orm/entity/User';
import { SubTableTypes } from '@/types/common';

interface Props {
  users: User[];
  allOrganizations: Organization[];
  onAddOrganizations: (userId: string, organizationIds: string[]) => void;
  onDeleteMembership: (userId: string, organizationId: string) => void;
  onChangeRole: (userId: string, role: string) => void;
}

const TableUsers: React.FC<Props> = ({
  users,
  allOrganizations,
  onAddOrganizations,
  onDeleteMembership,
  onChangeRole,
}) => {
  const { data: session } = useSession();
  const currentUserId = session?.user.id;

  const handleRoleChange = (userId: string, name: string) => {
    onChangeRole(userId, name);
  };

  const columns = [
    {
      title: 'First name',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (text: number, record) =>
        currentUserId === record.key ? (
          <Badge count="Me">
            <Tag>{text}</Tag>
          </Badge>
        ) : (
          <Tag>{text}</Tag>
        ),
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
      render: (text: number) => <Tag>{text}</Tag>,
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text: number) => <Tag>{text}</Tag>,
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (text, record) => (
        <UserRoleRenderer
          text={text}
          record={record}
          handleRoleChange={handleRoleChange}
        />
      ),
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      title: 'Time of addition',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => <Tag>{text}</Tag>,
      sorter: (a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        return dateA - dateB;
      },
    },
    {
      title: 'Organizations',
      dataIndex: SubTableTypes.ORGANIZATIONS,
      key: SubTableTypes.ORGANIZATIONS,
      render: (text: string, record: any) => (
        <Badge
          count={
            record.totalMembershipsLeft ? `+${record.totalMembershipsLeft}` : ''
          }
        >
          <Tag color="default">
            {record.firstOrganizationName || 'No organizations'}
          </Tag>
        </Badge>
      ),
      sorter: (a, b) => a.totalMembershipsLeft - b.totalMembershipsLeft,
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
