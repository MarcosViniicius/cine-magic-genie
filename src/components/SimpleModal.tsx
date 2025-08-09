import React from 'react';

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SimpleModal: React.FC<SimpleModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      id="simple-modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div 
        id="simple-modal-content"
        style={{
          backgroundColor: '#ffffff',
          padding: '30px',
          borderRadius: '10px',
          maxWidth: '500px',
          width: '90%',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}
      >
        <h1 style={{ color: '#333', fontSize: '24px', marginBottom: '20px' }}>
          🎉 Modal Funcionando!
        </h1>
        <p style={{ color: '#666', fontSize: '16px', marginBottom: '30px' }}>
          Se você está vendo esta mensagem, o modal está funcionando perfeitamente!
        </p>
        <button 
          onClick={onClose}
          style={{
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Fechar Modal
        </button>
      </div>
    </div>
  );
};

export default SimpleModal; 