import React from 'react';

const Loading = ({ message }) => {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh'}}>
            <div className="spinner-border" role="status" style={{ width: '4rem', height: '4rem' }}>
                <span className="sr-only"></span>
            </div>
            <p className="mt-3" style={{ fontSize: '1.2rem', color: '#343a40' }}> 
                {message || 'Loading...'}
            </p>
        </div>
        );
    };

export default Loading;