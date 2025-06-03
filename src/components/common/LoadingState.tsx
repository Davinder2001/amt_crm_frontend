import React from 'react'

function LoadingState() {
    return (
        <div className="data-loading-state">
            <div className="data-spinner" />
            <style jsx>{`
                .data-loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px;
  margin-top: 32px;
  color: #6c757d;
  font-size: 16px;

  .data-spinner {
    width: 24px;
    height: 24px;
    border: 3px solid #dee2e6;
    border-top: 3px solid #6c757d;
    border-radius: 50%;
    animation: spinDataLoader 1s linear infinite;
    margin-right: 12px;
  }

  @keyframes spinDataLoader {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}

                `}</style>
        </div>
    )
}

export default LoadingState