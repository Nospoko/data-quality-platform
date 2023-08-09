import { Form, Input, Layout, message, Modal, Select } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import { Dataset } from '@/lib/orm/entity/Dataset';
import { User } from '@/lib/orm/entity/User';
import { AddingFormTypes } from '@/types/common';

interface Props {
  isOpen: boolean;
  organizationNames: string[];
  allUsers: User[];
  allDatasets: Dataset[];
  onClose: () => void;
  onCreate: ({
    name,
  }: {
    name: string;
    selectedUsers: string[];
    selectedDatasets: string[];
  }) => void;
}

const CreateNewOrganizationForm: React.FC<Props> = ({
  isOpen,
  organizationNames,
  allUsers,
  allDatasets,
  onClose,
  onCreate,
}) => {
  const [isExist, setIsExist] = useState(false);
  const [form] = Form.useForm<{
    name: string;
    selectedUsers: string[];
    selectedDatasets: string[];
  }>();
  const name = Form.useWatch('name', form);
  const normalizedOrganizationNames = organizationNames.map((orgName) =>
    orgName.trim().toLowerCase(),
  );

  useEffect(() => {
    const normalizedName = name?.trim().toLowerCase();

    if (normalizedOrganizationNames.includes(normalizedName)) {
      setIsExist(true);

      return;
    }

    setIsExist(false);
  }, [name, normalizedOrganizationNames, isExist]);

  const handleClose = useCallback(() => {
    form.resetFields();
    onClose();
  }, [form, onClose]);

  const handleSubmit = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        onCreate(values);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
        message.error('Submit failed!');
      })
      .finally(() => {
        onClose();
      });
  }, [form]);

  const isNameFilled = useCallback(() => {
    return name && name.trim().length > 2;
  }, [name]);

  return (
    <Layout>
      <Modal
        open={isOpen}
        centered
        title="Create a new organization"
        okText="Create"
        cancelText="Cancel"
        onCancel={handleClose}
        onOk={handleSubmit}
        okButtonProps={{ disabled: !isNameFilled() || isExist }}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{ modifier: 'public' }}
        >
          <Form.Item
            name="name"
            label="Name"
            tooltip="Name of organization is required."
            rules={[
              {
                required: true,
                message: 'Please input the name of Organization!',
              },
              { type: 'string', min: 3 },
              () => ({
                validator(_, value) {
                  if (
                    normalizedOrganizationNames.includes(
                      value?.trim().toLowerCase(),
                    )
                  ) {
                    return Promise.reject(
                      new Error(
                        'The Organization with the same name is exist!',
                      ),
                    );
                  }

                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input placeholder="Write name of organization" />
          </Form.Item>

          <Form.Item
            name={AddingFormTypes.USERS}
            label="Users"
            tooltip="Select users for the organization."
          >
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Please select users..."
              maxTagCount={2}
              onChange={(selected: string[]) => {
                form.setFieldsValue({
                  selectedUsers: selected,
                });
              }}
            >
              {allUsers.map((user) => (
                <Select.Option key={user.id} value={user.id}>
                  {`${user.firstName} | ${user.lastName} | ${user.email}`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

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
              maxTagCount={2}
              onChange={(selected: string[]) => {
                form.setFieldsValue({
                  selectedDatasets: selected,
                });
              }}
            >
              {allDatasets.map((dataset) => (
                <Select.Option key={dataset.id} value={dataset.id}>
                  {dataset.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default CreateNewOrganizationForm;
