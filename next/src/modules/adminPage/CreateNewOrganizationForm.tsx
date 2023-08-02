import {
  Button,
  Cascader,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Layout,
  message,
  Modal,
  Radio,
  Select,
  Space,
  Switch,
  TreeSelect,
} from 'antd';
import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  // isFetching?: boolean;
  onClose: () => void;
  onCreate: ({ name }: { name: string }) => void;
}

const CreateNewOrganizationForm: React.FC<Props> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [form] = Form.useForm<{ name: string }>();
  const nameValue = Form.useWatch('name', form);

  // form Test
  console.log('form:', nameValue);

  return (
    <Layout>
      <Modal
        open={isOpen}
        centered
        title="Create a new organization"
        okText="Create"
        cancelText="Cancel"
        onCancel={onClose}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onCreate(values);
              message.success('Submit success!');
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
              message.error('Submit failed!');
            });
        }}
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
                message: 'Please input the title of collection!',
              },
              { type: 'string', min: 3 },
            ]}
          >
            <Input placeholder="Write name of organization" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default CreateNewOrganizationForm;
