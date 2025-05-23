import React from 'react';

interface FormStepperProps {
    steps: string[];
    currentStep: number;
}

const FormStepper: React.FC<FormStepperProps> = ({ steps, currentStep }) => {
    return (
        <div className="stepper-container">
            {steps.map((label, index) => (
                <div key={label} className={`stepper-item ${index <= currentStep ? 'active' : ''}`}>
                    <div className="stepper-number">{index + 1}</div>
                    <div className="stepper-label">{label}</div>
                    {index < steps.length - 1 && <div className="stepper-line" />}
                </div>
            ))}
        </div>
    );
};

export default FormStepper;