import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

// Layouts
import PublicLayout from '@/components/layout/PublicLayout';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Public Pages
import Home from '@/pages/Home';
import HowItWorks from '@/pages/HowItWorks';
import Plans from '@/pages/Plans';
import Partners from '@/pages/Partners';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Release from '@/pages/Release';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

// Dashboard Pages
import DashboardHome from '@/pages/dashboard/DashboardHome';
import MyLetters from '@/pages/dashboard/MyLetters';
import MyVault from '@/pages/dashboard/MyVault';
import MyRecipients from '@/pages/dashboard/MyRecipients';
import MyTribes from '@/pages/dashboard/MyTribes';
import MyCard from '@/pages/dashboard/MyCard';
import MyPoints from '@/pages/dashboard/MyPoints';
import MyAccount from '@/pages/dashboard/MyAccount';

// Admin Pages
import AdminLayout from '@/components/layout/AdminLayout';
import AdminOverview from '@/pages/admin/AdminOverview';
import AdminQueue from '@/pages/admin/AdminQueue';
import AdminMembers from '@/pages/admin/AdminMembers';
import AdminReleases from '@/pages/admin/AdminReleases';
import AdminRevenue from '@/pages/admin/AdminRevenue';
import AdminTribes from '@/pages/admin/AdminTribes';
import AdminPartners from '@/pages/admin/AdminPartners';

// Legal Pages
import Privacy from '@/pages/legal/Privacy';
import Terms from '@/pages/legal/Terms';
import CCPA from '@/pages/legal/CCPA';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-inkwell">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border border-gold/20 rotate-45 flex items-center justify-center animate-spin">
            <div className="w-2 h-2 bg-gold/60 rotate-45" />
          </div>
          <p className="font-body text-vellum/30 text-xs tracking-widest uppercase">Loading</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      {/* Public layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/release" element={<Release />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/ccpa" element={<CCPA />} />
      </Route>

      {/* Auth pages (no layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="vault" element={<MyVault />} />
        <Route path="letters" element={<MyLetters />} />
        <Route path="recipients" element={<MyRecipients />} />
        <Route path="tribes" element={<MyTribes />} />
        <Route path="card" element={<MyCard />} />
        <Route path="points" element={<MyPoints />} />
        <Route path="account" element={<MyAccount />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminOverview />} />
        <Route path="queue" element={<AdminQueue />} />
        <Route path="members" element={<AdminMembers />} />
        <Route path="releases" element={<AdminReleases />} />
        <Route path="revenue" element={<AdminRevenue />} />
        <Route path="tribes" element={<AdminTribes />} />
        <Route path="partners" element={<AdminPartners />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;