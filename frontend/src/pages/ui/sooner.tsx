import React from 'react';

// Simple toast notification component
interface ToasterProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const Toaster = ({ position = 'top-right' }: ToasterProps) => {
  return (
    <div 
      id="toaster-container" 
      className={`fixed z-50 pointer-events-none ${
        position === 'top-right' ? 'top-4 right-4' :
        position === 'top-left' ? 'top-4 left-4' :
        position === 'bottom-right' ? 'bottom-4 right-4' :
        'bottom-4 left-4'
      }`}
    >
      {/* Simple toast container - notifications would be injected here */}
    </div>
  );
};

export { Toaster };
