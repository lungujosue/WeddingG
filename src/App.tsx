import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { StorySection } from './components/StorySection';
import { DetailsSection } from './components/DetailsSection';
import { InvitationSection } from './components/InvitationSection';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('eg_wedding_admin_token');
  });

  // Check URL query or hash for /admin
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname;
      const search = window.location.search;
      const hash = window.location.hash;
      if (path.includes('admin') || search.includes('admin') || hash.includes('admin')) {
        setIsAdminOpen(true);
      }
    };
    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    return () => window.removeEventListener('popstate', checkAdminRoute);
  }, []);

  const handleAdminLogin = (token: string) => {
    setAdminToken(token);
    localStorage.setItem('eg_wedding_admin_token', token);
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('eg_wedding_admin_token');
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#1a1a1a] font-sans selection:bg-[#d4a373]/30 selection:text-[#1a1a1a] paper-texture flex flex-col">
      {/* Top Navigation */}
      <Header 
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminLoggedIn={!!adminToken}
      />

      {/* Main Public Page Sections */}
      <main className="flex-grow">
        {/* Section 1: Hero Principal */}
        <Hero />

        {/* Section 2: Notre Histoire */}
        <StorySection />

        {/* Section 3: Le Rendez-vous */}
        <DetailsSection />

        {/* Section 4: Votre Invitation & RSVP */}
        <InvitationSection />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Admin Dashboard Dialog */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          // If URL had #admin, clean it up gracefully
          if (window.location.hash.includes('admin')) {
            history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }}
        adminToken={adminToken}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
      />
    </div>
  );
}
