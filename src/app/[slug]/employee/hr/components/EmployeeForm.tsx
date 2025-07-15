"use client";

import EmployeeFormRefactored from './EmployeeForm/EmployeeFormRefactored';
import type { EmployeeFormProps } from './EmployeeForm/types';

const EmployeeForm: React.FC<EmployeeFormProps> = (props) => {
    return <EmployeeFormRefactored {...props} />;
};

export default EmployeeForm;