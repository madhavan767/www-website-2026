import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastProvider } from './components/common/Toast';
import { SeoHead } from './components/common/SeoHead';
import { getCurrentSubdomain } from './utils/subdomains';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProductsPage } from './pages/ProductsPage';
import { WebServicesPage } from './pages/services/WebServicesPage';
import { AppDevelopmentPage } from './pages/services/AppDevelopmentPage';
import { MaintenancePage } from './pages/services/MaintenancePage';
import { SocialSpherePage } from './pages/services/SocialSpherePage';
import { BlogsPage } from './pages/BlogsPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { CareersPage } from './pages/CareersPage';
import { JobDetailPage } from './pages/JobDetailPage';
import { CareerApplyPage } from './pages/CareerApplyPage';
import { ContactPage } from './pages/ContactPage';
import { EventsPage } from './pages/EventsPage';
import { SupportPage } from './pages/SupportPage';
import { CommunityPage } from './pages/CommunityPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { UnknownSubdomainPage } from './pages/UnknownSubdomainPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

// Scroll to top automatically when location changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function App() {
  // If running inside an iframe (e.g. storage bridge or embed), prevent recursive app rendering
  if (typeof window !== 'undefined' && window.self !== window.top) {
    return null;
  }

  const currentSubdomain = getCurrentSubdomain();
  const location = useLocation();

  // Admin routes take top priority across all host contexts and subdomains
  if (location.pathname.startsWith('/admin')) {
    return (
      <ToastProvider>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          <ScrollToTop />
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/login" element={<AdminDashboardPage />} />
              <Route path="/admin/*" element={<AdminDashboardPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ToastProvider>
    );
  }

  // Subdomain-Specific Routing
  const renderSubdomainRoutes = () => {
    switch (currentSubdomain) {
      case 'web':
        return (
          <Routes>
            <Route path="/" element={<WebServicesPage />} />
            <Route path="/services/web" element={<Navigate to="/" replace />} />
            <Route path="*" element={<WebServicesPage />} />
          </Routes>
        );

      case 'android':
        return (
          <Routes>
            <Route path="/" element={<AppDevelopmentPage />} />
            <Route path="/services/app" element={<Navigate to="/" replace />} />
            <Route path="*" element={<AppDevelopmentPage />} />
          </Routes>
        );

      case 'maintenance':
        return (
          <Routes>
            <Route path="/" element={<MaintenancePage />} />
            <Route path="/services/maintenance" element={<Navigate to="/" replace />} />
            <Route path="*" element={<MaintenancePage />} />
          </Routes>
        );

      case 'socialsphere':
        return (
          <Routes>
            <Route path="/" element={<SocialSpherePage />} />
            <Route path="/services/social-sphere" element={<Navigate to="/" replace />} />
            <Route path="*" element={<SocialSpherePage />} />
          </Routes>
        );

      case 'careers':
        return (
          <Routes>
            <Route path="/" element={<CareersPage />} />
            <Route path="/apply" element={<CareerApplyPage />} />
            <Route path="/:jobId" element={<JobDetailPage />} />
            <Route path="/:jobId/apply" element={<CareerApplyPage />} />

            {/* Aliases for legacy path compatibility */}
            <Route path="/careers" element={<Navigate to="/" replace />} />
            <Route path="/careers/apply" element={<Navigate to="/apply" replace />} />
            <Route path="/careers/:jobId" element={<JobDetailPage />} />
            <Route path="/careers/:jobId/apply" element={<CareerApplyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        );

      case 'contact':
        return (
          <Routes>
            <Route path="/" element={<ContactPage />} />
            <Route path="/contact" element={<Navigate to="/" replace />} />
            <Route path="*" element={<ContactPage />} />
          </Routes>
        );

      case 'support':
        return (
          <Routes>
            <Route path="/" element={<SupportPage />} />
            <Route path="/support" element={<Navigate to="/" replace />} />
            <Route path="*" element={<SupportPage />} />
          </Routes>
        );

      case 'events':
        return (
          <Routes>
            <Route path="/" element={<EventsPage />} />
            <Route path="/events" element={<Navigate to="/" replace />} />
            <Route path="*" element={<EventsPage />} />
          </Routes>
        );

      case 'community':
        return (
          <Routes>
            <Route path="/" element={<CommunityPage />} />
            <Route path="/community" element={<Navigate to="/" replace />} />
            <Route path="*" element={<CommunityPage />} />
          </Routes>
        );

      case 'blog':
        return (
          <Routes>
            <Route path="/" element={<BlogsPage />} />
            <Route path="/:slug" element={<BlogDetailPage />} />

            {/* Aliases for legacy path compatibility */}
            <Route path="/blogs" element={<Navigate to="/" replace />} />
            <Route path="/blogs/:slug" element={<BlogDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        );

      case 'aboutus':
        return (
          <Routes>
            <Route path="/" element={<AboutPage />} />
            <Route path="/about" element={<Navigate to="/" replace />} />
            <Route path="/aboutus" element={<Navigate to="/" replace />} />
            <Route path="*" element={<AboutPage />} />
          </Routes>
        );

      case 'unknown':
        return (
          <Routes>
            <Route path="*" element={<UnknownSubdomainPage />} />
          </Routes>
        );

      case 'main':
      default:
        // Full Primary Domain Routes (wwi.org.in / localhost)
        return (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/aboutus" element={<Navigate to="/about" replace />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/products" element={<ProductsPage />} />

            {/* Services Routes & Aliases */}
            <Route path="/services" element={<Navigate to="/services/web" replace />} />
            <Route path="/services/web" element={<WebServicesPage />} />
            <Route path="/services/web-services" element={<Navigate to="/services/web" replace />} />
            <Route path="/services/app" element={<AppDevelopmentPage />} />
            <Route path="/services/app-development" element={<Navigate to="/services/app" replace />} />
            <Route path="/services/maintenance" element={<MaintenancePage />} />
            <Route path="/services/maintenance-support" element={<Navigate to="/services/maintenance" replace />} />
            <Route path="/services/social-sphere" element={<SocialSpherePage />} />

            {/* Community & Support */}
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/support" element={<SupportPage />} />

            {/* Blogs */}
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blogs/:slug" element={<BlogDetailPage />} />

            {/* Careers */}
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/careers/apply" element={<CareerApplyPage />} />
            <Route path="/careers/:jobId" element={<JobDetailPage />} />
            <Route path="/careers/:jobId/apply" element={<CareerApplyPage />} />

            {/* Contact */}
            <Route path="/contact" element={<ContactPage />} />

            {/* Legal Pages & Aliases */}
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/privacy-policy" element={<Navigate to="/privacy" replace />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/terms-of-service" element={<Navigate to="/terms" replace />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/login" element={<AdminDashboardPage />} />

            {/* Splat 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        );
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <ScrollToTop />
        <SeoHead />
        <Navbar />
        <main className="flex-1">
          {renderSubdomainRoutes()}
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
}

export default App;
