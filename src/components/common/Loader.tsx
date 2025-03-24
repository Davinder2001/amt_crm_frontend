import React from 'react';

function Loader() {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',

            }}
        >
            <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                border: '5px solid #f3f3f3', // Light grey circle
                borderTop: '5px solid #009693', // Blue color for the top border
                animation: 'spin 1s linear infinite', // Spinning animation
            }} />
            {/* Add the keyframe animation for spinning */}
            <style>
                {`
                    @keyframes spin {
                        0% {
                            transform: rotate(0deg);
                        }
                        100% {
                            transform: rotate(360deg);
                        }
                    }
                `}
            </style>
        </div>
    );
}

export default Loader;
