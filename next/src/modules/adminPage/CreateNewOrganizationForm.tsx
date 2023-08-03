import { Form, Input, Layout, message, Modal } from 'antd';
import React, { useCallback } from 'react';

interface Props {
  isOpen: boolean;
  organizationNames: string[];
  onClose: () => void;
  onCreate: ({ name }: { name: string }) => void;
}

const CreateNewOrganizationForm: React.FC<Props> = ({
  isOpen,
  organizationNames,
  onClose,
  onCreate,
}) => {
  const [form] = Form.useForm<{ name: string }>();

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
                  if (organizationNames.includes(value)) {
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
        </Form>
      </Modal>
    </Layout>
  );
};

export default CreateNewOrganizationForm;
