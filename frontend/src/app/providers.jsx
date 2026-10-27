import React from 'react';
import SmoothScrollProvider from '../lib/scrollProvider';

export const AppProviders = ({ children }) => {
  return (
    <SmoothScrollProvider>
      <div className="relative min-h-screen bg-black flex flex-col justify-between selection:bg-gold-500 selection:text-black">
        {children}
      </div>
    </SmoothScrollProvider>
  );
};

export default AppProviders;
