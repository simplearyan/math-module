// components/Callout.tsx
import React from 'react';

interface CalloutProps {
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'error';
}

const colorMap = {
  info: 'bg-blue-100 border-blue-500 text-blue-700',
  warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
  error: 'bg-red-100 border-red-500 text-red-700',
};

const Callout: React.FC<CalloutProps> = ({ children, type = 'info' }) => {
  return (
    <div className={`p-4 my-4 border-l-4 rounded-lg ${colorMap[type]}`}>
      {children}
    </div>
  );
};

export default Callout;