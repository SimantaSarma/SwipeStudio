// src/App.tsx
import React, { useState, useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { ThankYouPage } from './pages/ThankYouPage';
import { ToastProvider } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#/thank-you' || window.location.pathname === '/thank-you') {
        return '/thank-you';
      }
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash === '#/thank-you' || window.location.pathname === '/thank-you') {
        setCurrentPath('/thank-you');
      } else {
        setCurrentPath('/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    if (path === '/thank-you') {
      window.history.pushState({}, '', '/thank-you');
    } else {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ErrorBoundary>
      <ToastProvider>
        {currentPath === '/thank-you' ? (
          <ThankYouPage />
        ) : (
          <LandingPage onNavigateThankYou={() => navigateTo('/thank-you')} />
        )}
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
