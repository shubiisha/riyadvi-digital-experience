import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AppRouter from './router';
import AppProviders from './providers';

export const App = () => {
  return (
    <AppProviders>
      <Navbar />
      <main className="flex-grow">
        <AppRouter />
      </main>
      <Footer />
    </AppProviders>
  );
};

export default App;
