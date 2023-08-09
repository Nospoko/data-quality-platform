import { Button, Modal, Tag } from 'antd';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';

import { UserRole } from '@/types/common';

interface Props {
  text: string;
  record: {
    key: string;
  };
  handleRoleChange: (key: string, newRole: string) => void;
}

const UserRoleRenderer: React.FC<Props> = ({
  text,
  record,
  handleRoleChange,
}) => {
  const [isRoleAdmin, setIsRoleAdmin] = useState(text === UserRole.ADMIN);
  const { data: session } = useSession();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const isNotCurrentUser = session?.user.id !== record.key;

  const toggleRole = () => {
    if (isNotCurrentUser) {
      setIsModalVisible(true);
    }
  };

  const handleConfirmRoleChange = () => {
    const newRole = isRoleAdmin ? '' : UserRole.ADMIN;
    setIsRoleAdmin(!isRoleAdmin);
    handleRoleChange(record.key, newRole);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const modalTitle = isRoleAdmin ? 'Confirm Role Change' : 'Confirm Demotion';
  const modalContent = isRoleAdmin
    ? 'Are you sure you want to make this user an admin?'
    : 'Are you sure you want to demote this user from admin role?';

  return (
    <>
      <Tag>{text}</Tag>
      {isNotCurrentUser ? (
        <Button
          type="primary"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            toggleRole();
          }}
        >
          {isRoleAdmin ? 'Demote' : 'Make Admin'}
        </Button>
      ) : null}

      <Modal
        centered
        title={modalTitle}
        visible={isModalVisible}
        onOk={(e) => {
          e.stopPropagation();
          handleConfirmRoleChange();
        }}
        onCancel={handleCancel}
      >
        <p>{modalContent}</p>
      </Modal>
    </>
  );
};

export default UserRoleRenderer;
