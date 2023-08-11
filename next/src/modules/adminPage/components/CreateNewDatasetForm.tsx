import { Form, Input, Layout, message, Modal } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import { Dataset } from '@/lib/orm/entity/Dataset';

interface Props {
  datasets: Dataset[];
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

// This component is a form used to create a new dataset.
const CreateNewDatasetForm: React.FC<Props> = ({
  datasets,
  isOpen,
  onClose,
  onCreate,
}) => {
  const [isExist, setIsExist] = useState(false);
  const [form] = Form.useForm<string>();
  const name = Form.useWatch('name', form);

  const datasetNames = datasets.map((dataset) => dataset.name);

  // This normalization process is performed to ensure consistent comparisons and checks when validating the input name against existing dataset names.
  const normalizedDatasetNames = datasetNames.map((orgName) =>
    orgName.trim().toLowerCase(),
  );

  useEffect(() => {
    const normalizedName = name?.trim().toLowerCase();

    if (normalizedDatasetNames.includes(normalizedName)) {
      setIsExist(true);

      return;
    }

    setIsExist(false);
  }, [name, normalizedDatasetNames, isExist]);

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
        title="Create a new dataset"
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
            tooltip="Name of dataset is required."
            rules={[
              {
                required: true,
                message: 'Please input the name of Dataset!',
              },
              { type: 'string', min: 3 },
              () => ({
                validator(_, value) {
                  if (
                    normalizedDatasetNames.includes(value?.trim().toLowerCase())
                  ) {
                    return Promise.reject(
                      new Error('The Dataset with the same name is exist!'),
                    );
                  }

                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input placeholder="Write name of Dataset" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default CreateNewDatasetForm;
