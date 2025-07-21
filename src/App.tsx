import { SignedIn, SignedOut } from '@clerk/clerk-react';
import React, { Suspense, lazy, useState } from 'react';
import FirebaseStorageTest from './components/FirebaseStorageTest';
import Header from './components/Header';
import { AllSubmissions } from "./components/AllSubmissions";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import projectArchitectureUrl from './assets/project_architecture.svg';
const queryClient = new QueryClient();
const BasicDetailsForm = React.lazy(() => import('./components/BasicDetailsForm'));

export default function App() {
  const [isStorageTestOpen, setIsStorageTestOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showSvgModal, setShowSvgModal] = useState(false);
  const [svgLoaded, setSvgLoaded] = useState(false);

  const handleStorageTestOpen = () => {
    setIsFormOpen(false);
    setIsStorageTestOpen(true);
  };

  const handleFormOpen = () => {
    setIsStorageTestOpen(false);
    setIsFormOpen(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header 
        onStorageTestOpen={handleStorageTestOpen}
        onFormOpen={handleFormOpen}
      />
      {!isFormOpen && (
        <Suspense fallback={<div>Loading submissions...</div>}>
          <AllSubmissions />
        </Suspense>
      )}
      
      <main className="flex-1 flex flex-col items-center justify-center">
        <SignedOut>
          <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
            <h1 className="text-4xl font-extrabold text-slate-800 mb-2 text-center">Welcome!</h1>
            <p className="text-lg text-slate-600 mb-6 text-center max-w-md">Thank you for visiting. Please sign in to experience the full power of our dynamic, multi-step form builder and more.</p>
            <div className="w-full max-w-3xl mt-4 flex flex-col items-center">
              <div
                className="bg-white border border-slate-200 rounded-xl shadow-lg p-4 transition-transform hover:scale-105 hover:shadow-2xl duration-200 flex flex-col items-center cursor-pointer"
                onClick={() => setShowSvgModal(true)}
                title="Click to view fullscreen"
              >
                <img src={projectArchitectureUrl} alt="Project Architecture" className="w-full h-auto max-h-[60vh] object-contain" loading="lazy" />
                <span className="block text-center text-slate-500 text-sm mt-2">Project Workflow Diagram</span>
              </div>
            </div>
            {showSvgModal && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-neutral-50" onClick={() => setShowSvgModal(false)} tabIndex={0} onKeyDown={e => {
                if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
                  setShowSvgModal(false);
                }
              }} aria-label="Close fullscreen diagram">
                <button
                  className="absolute top-6 right-6 bg-white/80 hover:bg-white text-slate-700 rounded-full p-2 shadow-lg z-[10000]"
                  onClick={e => { e.stopPropagation(); setShowSvgModal(false); }}
                  aria-label="Close fullscreen diagram"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="flex items-center justify-center w-full h-full" onClick={e => e.stopPropagation()}>
                  {!svgLoaded && (
                    <div className="absolute flex items-center justify-center w-full h-full z-[9999]">
                      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
                    </div>
                  )}
                  <img
                    src={projectArchitectureUrl}
                    alt="Project Architecture Fullscreen"
                    className="max-w-5xl w-full h-auto max-h-[90vh] object-contain rounded-xl border-4 border-white shadow-2xl"
                    loading="lazy"
                    style={{ visibility: svgLoaded ? 'visible' : 'hidden' }}
                    onLoad={() => setSvgLoaded(true)}
                  />
                </div>
              </div>
            )}
          </div>
        </SignedOut>
        <SignedIn>
          {isFormOpen && (
            <Suspense fallback={<div>Loading form...</div>}>
              <BasicDetailsForm
                isOpen={true}
                onClose={() => setIsFormOpen(false)}
              />
            </Suspense>
          )}
        </SignedIn>
      </main>

      <footer className="w-full bg-white/90 text-slate-500 py-4 px-4 flex flex-col md:flex-row items-center justify-between gap-2 border-t border-slate-200">
        <span className="font-semibold tracking-wide">&copy; {new Date().getFullYear()} Dynamic Form Manager</span>
        <span className="text-sm">Crafted for beautiful and accessible forms</span>
      </footer>

      <FirebaseStorageTest 
        isOpen={isStorageTestOpen} 
        onClose={() => setIsStorageTestOpen(false)} 
      />
    </div>
    </QueryClientProvider>
  );
}