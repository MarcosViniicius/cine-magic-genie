import React from 'react';
import SupportModal from './SupportModal';
import TestModal from './TestModal';
import SimpleModal from './SimpleModal';

interface AllModalsProps {
  showSupportModal: boolean;
  showSimpleModal: boolean;
  onCloseSupport: () => void;
  onCloseSimple: () => void;
}

const AllModals: React.FC<AllModalsProps> = ({
  showSupportModal,
  showSimpleModal,
  onCloseSupport,
  onCloseSimple
}) => {
  return (
    <>
      <SupportModal 
        isOpen={showSupportModal} 
        onClose={onCloseSupport} 
      />
      <TestModal 
        isOpen={showSupportModal} 
        onClose={onCloseSupport} 
      />
      <SimpleModal 
        isOpen={showSimpleModal} 
        onClose={onCloseSimple} 
      />
    </>
  );
};

export default AllModals; 