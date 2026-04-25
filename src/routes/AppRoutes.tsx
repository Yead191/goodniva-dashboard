import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ProtectedRoute from './ProtectedRoute'

// Auth pages
import LoginPage from '@/pages/auth/LoginPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import VerifyOtpPage from '@/pages/auth/VerifyOtpPage'
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage'

// Dashboard pages
import DashboardPage from '@/pages/dashboard/DashboardPage'
import UsersPage from '@/pages/users/UsersPage'
import PlansPage from '@/pages/plans/PlansPage'
import CommunityPage from '@/pages/community/CommunityPage'
import InterestPage from '@/pages/interest/InterestPage'
import SubscriptionsPage from '@/pages/subscriptions/SubscriptionsPage'
import RevenuePage from '@/pages/revenue/RevenuePage'
import SafetyTriagePage from '@/pages/safety/SafetyTriagePage'
import ActionCentrePage from '@/pages/actionCentre/ActionCentrePage'
import CityOperationsPage from '@/pages/cityOps/CityOperationsPage'
import BroadcastPage from '@/pages/broadcast/BroadcastPage'
import SupportPage from '@/pages/support/SupportPage'
import SettingsPage from '@/pages/settings/SettingsPage'
import NotificationsPage from '@/pages/notifications/NotificationsPage'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected routes - nested under DashboardLayout */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/interest" element={<InterestPage />} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
        <Route path="/revenue" element={<RevenuePage />} />
        <Route path="/safety" element={<SafetyTriagePage />} />
        <Route path="/action-centre" element={<ActionCentrePage />} />
        <Route path="/city-operations" element={<CityOperationsPage />} />
        <Route path="/broadcast" element={<BroadcastPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      {/* Defaults */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default AppRoutes
