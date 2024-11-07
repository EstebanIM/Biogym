// src/components/ui/label.js
import React from 'react';

export const Label = ({ children, ...props }) => (
  <label
    className="block text-sm font-medium text-black"
    {...props}
  >
    {children}
  </label>
);
