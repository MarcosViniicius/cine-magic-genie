import React from 'react';

interface UltraSimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UltraSimpleModal: React.FC<UltraSimpleModalProps> = ({ isOpen, onClose }) => {
  console.log('UltraSimpleModal render - isOpen:', isOpen);

  if (!isOpen) {
    console.log('UltraSimpleModal: not open, returning null');
    return null;
  }

  console.log('UltraSimpleModal: rendering modal content');

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div 
        style={{
          backgroundColor: '#ffffff',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '300px',
          width: '90%',
          textAlign: 'center'
        }}
      >
        <h2 style={{ color: '#333', marginBottom: '10px' }}>🎉 ULTRA SIMPLES!</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Se você está vendo isso, o React está funcionando!
        </p>
        <button 
          onClick={onClose}
          style={{
            backgroundColor: '#ff4444',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default UltraSimpleModal; 