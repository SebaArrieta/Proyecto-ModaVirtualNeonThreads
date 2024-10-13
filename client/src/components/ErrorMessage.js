import React from 'react';

const ErrorMessage = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '5px',
            padding: '10px',
            margin: '10px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <span>{message}</span>
        </div>
    );
};

export default ErrorMessage;