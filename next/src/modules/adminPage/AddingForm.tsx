import { Form, Layout, message, Modal, Select } from 'antd';
import React, { useCallback } from 'react';

import { Dataset } from '@/lib/orm/entity/Dataset';
import { User } from '@/lib/orm/entity/User';
import { OnAddParams } from '@/types/common';

interface Props {
  type: 'memberships' | 'datasetAccess';
  isOpen: boolean;
  allData: (User | Dataset)[];
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

  return (
    <Layout>
      <Modal
        open={isOpen}
        centered
        title="Add a new members"
        okText="Add"
        cancelText="Cancel"
        onCancel={handleClose}
        onOk={handleSubmit}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_adding"
          initialValues={{ modifier: 'public' }}
        >
          {type === 'memberships' ? (
            <Form.Item
              style={{ marginBottom: '150px' }}
              name="selectedUsers"
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
          ) : (
            <Form.Item
              style={{ marginBottom: '150px' }}
              name="selectedDatasets"
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
          )}
        </Form>
      </Modal>
    </Layout>
  );
};

export default AddingForm;
