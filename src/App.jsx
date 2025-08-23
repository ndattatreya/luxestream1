import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './authContext.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import UserLogin from './components/userLogin.jsx';
import AdminLogin from './components/AdminLogin.jsx';
import SignUp from './components/SignUp.jsx';
import MovieDetails from './components/MovieDetails.jsx';
import Homepage from './components/Homepage.jsx';
import Footer from './components/Footer.jsx';
import ContactUs from './components/ContactUs.jsx';
import AboutUs from './components/AboutUs.jsx';
import Careers from './components/Careers.jsx';
import Press from './components/Press.jsx';
import HelpCenter from './components/HelpCenter.jsx';
import PrivacyPolicy from './components/PrivacyPolicy.jsx';
import TermsOfUse from './components/TermsOfUse.jsx';
import CookiePreferences from './components/CookiePrefernces.jsx';
import CorporateInformation from './components/CorporateInformation.jsx';
import SubscriptionPage from './components/SubscriptionPage.jsx';
import PaymentSuccess from './components/PaymentSuccess';
import VideoPlayer from './components/VideoPlayer';
import Video from './components/Video';
import UserProfile from './components/UserProfile.jsx';
import Recommended from './components/Recommended.jsx';
import { ThemeProvider } from './components/ThemeContext.jsx';
import ForgotPassword from './components/ForgotPassword';
import OAuthSuccess from './components/OAuthSuccess';
import SetPassword from './components/SetPassword';

const AppRoutes = () => {
  const { user } = useAuth();
  const userId = user?._id || user?.id || 1;

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />

      {/* Auth routes */}
      <Route path="/userlogin" element={<UserLogin />} />
      <Route path="/adminlogin" element={<AdminLogin />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Protected user routes */}
      <Route
        path="/userdashboard"
        element={
          <ProtectedRoute isUserRoute={true}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/userprofile"
        element={
          <ProtectedRoute isUserRoute={true}>
            <UserProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admindashboard"
        element={
          <ProtectedRoute isAdminRoute={true} >
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Public routes */}
      <Route path="/moviedetails/:id" element={<MovieDetails />} />
      <Route path="/contactus" element={<ContactUs />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/press" element={<Press />} />
      <Route path="/helpcenter" element={<HelpCenter />} />
      <Route path="/privacypolicy" element={<PrivacyPolicy />} />
      <Route path="/termsofuse" element={<TermsOfUse />} />
      <Route path="/cookiepreferences" element={<CookiePreferences />} />
      <Route path="/corporateinformation" element={<CorporateInformation />} />
      <Route path="/subscription" element={<SubscriptionPage />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/video-player" element={<VideoPlayer />} />
      <Route path="/video" element={<Video />} />
      <Route path="/recommended" element={<Recommended userId={userId} />} />
      <Route path="/recommended/:id" element={<Recommended userId={userId} />} />
      <Route path="/footer" element={<Footer />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route path="/set-password" element={<SetPassword />} />

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => (
  <AuthProvider>
    <ThemeProvider>
      <Router>
        <AppRoutes />
      </Router>
    </ThemeProvider>
  </AuthProvider>
);

export default App;
