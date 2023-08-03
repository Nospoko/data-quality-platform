import { DeleteOutlined } from '@ant-design/icons';
import { Badge, Button, Collapse, Space, Table, Tag } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';

import { OrganizationDataResponse, OrganizationType } from '@/types/common';

interface Props {
  organizationsData: OrganizationDataResponse;
}

const TableOrganizations: React.FC<Props> = ({ organizationsData }) => {
  const [selectedRowKey, setSelectedRowKey] = useState(null);
  const { data: organizations } = organizationsData;

  const handleDelete = (id: string) => {
    //
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          {name}
          <Button
            type="link"
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}
            className="delete-button"
          />
        </Space>
      ),
    },
    {
      title: 'Total Memberships',
      dataIndex: 'totalMemberships',
      key: 'totalMemberships',
      render: (text: number) => <Tag>{text}</Tag>,
    },
    {
      title: 'Datasets',
      dataIndex: 'datasets',
      key: 'datasets',
      render: (text: string, record: any) => (
        // That element open a little window where we can open a modal window
        // <Popover
        //   content={<Button type="primary">Datasets</Button>}
        //   trigger="hover"
        // >

        <Badge count={record.datasetCount}>
          <Tag style={{ cursor: 'pointer' }} color="default">
            {record.datasetFirstName || 'No dataset access'}
          </Tag>
        </Badge>
      ),
    },
  ];

  const getOrganizationMembershipsAndDatasetAccess = (
    organization: OrganizationType,
  ) => {
    return (
      <AccordionWrapper>
        {getOrganizationMemberships(organization)}
        {getDatasetAccess(organization)}
      </AccordionWrapper>
    );
  };

  const getOrganizationMemberships = (organization: OrganizationType) => {
    const { organizationMemberships: memberships } = organization;

    if (memberships.length === 0) {
      return <Tag color="default">No memberships</Tag>;
    }

    return (
      <Collapse>
        <Collapse.Panel header="Organization Memberships" key="1">
          {memberships.map((membership) => (
            <div key={membership.id}>{JSON.stringify(membership.user)}</div>
          ))}
        </Collapse.Panel>
      </Collapse>
    );
  };

  const getDatasetAccess = (organization: OrganizationType) => {
    const { datasetAccess } = organization;

    if (datasetAccess.length === 0) {
      return <Tag color="default">No dataset access</Tag>;
    }

    return (
      <Collapse>
        <Collapse.Panel header="Dataset Access" key="1">
          {organization.datasetAccess.map((access) => (
            <div key={access.id}>{JSON.stringify(access)}</div>
          ))}
        </Collapse.Panel>
      </Collapse>
    );
  };

  const data = organizations.map((organization) => {
    const { id, name, organizationMemberships, datasetAccess } = organization;

    return {
      key: id,
      name: name,
      totalMemberships: organizationMemberships.length,
      datasetFirstName: datasetAccess[0]?.dataset.name,
      datasetCount: datasetAccess.length && datasetAccess.length - 1,
      organization,
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
        expandedRowRender: (record) => {
          const organization = organizations.find(
            (org) => org.id === record.key,
          );
          return organization
            ? getOrganizationMembershipsAndDatasetAccess(organization)
            : null;
        },
        showExpandColumn: false,
      }}
      rowClassName={(record, index) =>
        record.key === selectedRowKey ? 'selected-row' : ''
      }
      onRow={(record) => {
        return {
          onClick: () => setSelectedRowKey(record.key),
        };
      }}
      components={{
        body: {
          row: StyledTableRow,
        },
      }}
    />
  );
};

export default TableOrganizations;

const AccordionWrapper = styled.div`
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

const StyledTableRow = styled.tr`
  .delete-button {
    color: transparent;
  }

  &:hover .delete-button {
    color: red;
  }
`;

// Stop here

// const StyledDeleteButton = styled.button`
//   color: red; // Set the default color for the delete button
//   border: none;
//   background: none;
//   cursor: pointer;

//   &:hover {
//     color: lightcoral; // Set the color for the delete button on hover
//   }
// `;
