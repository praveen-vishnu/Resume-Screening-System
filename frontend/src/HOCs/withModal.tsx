import React, { useState, ComponentType } from 'react';
import Modal from '../components/ModalComponents/Modal';

const withModal = <P extends object>(WrappedComponent: ComponentType<P>) => {
  return (props: P) => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
      <>
        <WrappedComponent {...props} openModal={openModal} />
        <Modal isOpen={isOpen} onClose={closeModal}>
          <h3>Modal Content</h3>
          <p>This is additional information displayed in a modal.</p>
        </Modal>
      </>
    );
  };
};

export default withModal;
