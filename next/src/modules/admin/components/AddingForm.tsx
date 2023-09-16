import { Form, Layout, message, Modal, Select } from 'antd';
import React, { useCallback } from 'react';

import { Dataset } from '@/lib/orm/entity/Dataset';
import { Organization } from '@/lib/orm/entity/Organization';
import { User } from '@/lib/orm/entity/User';
import { AddingFormTypes, OnAddParams, SubTableTypes } from '@/types/common';

interface Props {
  type: SubTableTypes;
  isOpen: boolean;
  allData: (User | Dataset | Organization)[];
  onClose: () => void;
  onAdd: (params: OnAddParams) => void;
}

const AddingForm: React.FC<Props> = ({
  type,
  isOpen,
  allData,
  onClose,
  onAdd,
}) => {
  const [form] = Form.useForm<OnAddParams>();
  const isMembershipType = type === SubTableTypes.MEMBERSHIPS;
  const isDatasetAccessType = type === SubTableTypes.DATASETACCESS;

  const handleClose = useCallback(() => {
    form.resetFields();
    onClose();
  }, [form, onClose]);

  const handleSubmit = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        onAdd(values);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
        message.error('Submit failed!');
      })
      .finally(() => {
        onClose();
      });
  }, [form]);

  const isFieldEmpty = useCallback(() => {
    const nameField = isMembershipType
      ? AddingFormTypes.USERS
      : isDatasetAccessType
      ? AddingFormTypes.DATASETS
      : AddingFormTypes.ORGANIZATIONS;

    const value = Form.useWatch(nameField, form);

    return value;
  }, [form]);

  return (
    <Layout>
      <Modal
        open={isOpen}
        centered
        title={
          isMembershipType
            ? 'Add a new members'
            : isDatasetAccessType
            ? 'Add a Dataset access'
            : 'Add an organizations'
        }
        okText="Add"
        cancelText="Cancel"
        onCancel={handleClose}
        onOk={handleSubmit}
        okButtonProps={{ disabled: !isFieldEmpty() }}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_adding"
          initialValues={{ modifier: 'public' }}
        >
          {isMembershipType ? (
            <Form.Item
              style={{ marginBottom: '150px' }}
              name={AddingFormTypes.USERS}
              label="Users"
              tooltip="Select users for the organization."
            >
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Please select users..."
                onChange={(selected: string[]) => {
                  form.setFieldsValue({
                    selectedUsers: selected,
                  });
                }}
              >
                {allData.map((user: User) => (
                  <Select.Option key={user.id} value={user.id}>
                    {`${user.firstName} | ${user.lastName} | ${user.email}`}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          ) : isDatasetAccessType ? (
            <Form.Item
              style={{ marginBottom: '150px' }}
              name={AddingFormTypes.DATASETS}
              label="Dataset Access"
              tooltip="Select Datasets for the organization."
            >
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Please select datasets..."
                onChange={(selected: string[]) => {
                  form.setFieldsValue({
                    selectedDatasets: selected,
                  });
                }}
              >
                {allData.map((dataset: Dataset) => (
                  <Select.Option key={dataset.id} value={dataset.id}>
                    {dataset.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          ) : (
            <Form.Item
              style={{ marginBottom: '150px' }}
              name={AddingFormTypes.ORGANIZATIONS}
              label="Organizations"
              tooltip="Select organizations"
            >
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Please select organizations..."
                onChange={(selected: string[]) => {
                  form.setFieldsValue({
                    selectedOrganizations: selected,
                  });
                }}
              >
                {allData.map((dataset: Dataset) => (
                  <Select.Option key={dataset.id} value={dataset.id}>
                    {dataset.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </Layout>
  );
};

export default AddingForm;
