"use client";

import React from "react";
import { RequiredLabelProps } from "./types";

const RequiredLabel: React.FC<RequiredLabelProps> = ({ children, ...props }) => (
    <label {...props}>
        {children} <span style={{ color: '#333' }}>*</span>
    </label>
);

export default RequiredLabel; 