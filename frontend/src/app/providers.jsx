import React from 'react';

export const AppProviders = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-black flex flex-col justify-between selection:bg-gold-500 selection:text-black">
      {children}
    </div>
  );
};

export default AppProviders;
