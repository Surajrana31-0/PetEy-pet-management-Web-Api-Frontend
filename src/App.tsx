import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import { ProtectedRoute, AdminRoute } from '@/components/ProtectedRoute';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import BrowsePetsPage from '@/pages/BrowsePetsPage';
import PetDetailPage from '@/pages/PetDetailPage';
import FavoritesPage from '@/pages/FavoritesPage';
import ProfilePage from '@/pages/ProfilePage';
import MyApplicationsPage from '@/pages/MyApplicationsPage';
import AIChatPage from '@/pages/AIChatPage';
import AIMatchingPage from '@/pages/AIMatchingPage';
import AdminDashboard from '@/pages/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/pets" element={<BrowsePetsPage />} />
            <Route path="/pets/:id" element={<PetDetailPage />} />
            <Route path="/ai-chat" element={<AIChatPage />} />
            <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/my-applications" element={<ProtectedRoute><MyApplicationsPage /></ProtectedRoute>} />
            <Route path="/ai-matching" element={<ProtectedRoute><AIMatchingPage /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
