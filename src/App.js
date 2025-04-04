import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomeDoop from "./components/HomeDoop";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Error from "./components/Error";
import Otp from "./components/Otp";
import Dash from "./components/Dash";
import ForgetPassward from "./components/ForgetPassward";
import ResetPassword from "./components/ResetPassword";
import ResetOtp from "./components/ResetOtp";

// 1. Create a Protected Route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token"); // Check if user has token

  if (!isAuthenticated) {
    // If not authenticated, redirect to signin page
    return <Navigate to="/signup" replace />;
  }

  // If authenticated, render the child components
  return children;
};

// 2. Create a Public Route component (for already authenticated users)
const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");

  if (isAuthenticated) {
    // If authenticated, redirect to dashboard
    return <Navigate to="/Dash" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes accessible to all */}
        <Route path="/" element={<HomeDoop />} />
        
        {/* Authentication routes - only accessible when not logged in */}
        <Route path="/signin" element={
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        } />
        <Route path="/otp" element={
          <PublicRoute>
            <Otp />
          </PublicRoute>
        } />
        <Route path="/ForgetPassward" element={
          <PublicRoute>
            <ForgetPassward />
          </PublicRoute>
        } />
        <Route path="/ResetPassword" element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        } />
        <Route path="/ResetOtp" element={
          <PublicRoute>
            <ResetOtp />
          </PublicRoute>
        } />

        {/* Protected routes - only accessible when logged in */}
        <Route path="/Dash" element={
          <ProtectedRoute>
            <Dash />
          </ProtectedRoute>
        } />

        {/* Catch-all route */}
        <Route path="/*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;