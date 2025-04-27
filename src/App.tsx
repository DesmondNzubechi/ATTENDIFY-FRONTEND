
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { StoreInitializer } from "./providers/StoreInitializer";
import Index from "./pages/Index";
import Overview from "./pages/Overview";
import Lecturers from "./pages/Lecturers";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import Attendance from "./pages/Attendance";
import AcademicSessions from "./pages/AcademicSessions";
import Performance from "./pages/Performance";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import UserProfile from "./pages/auth/UserProfile";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import NotFound from "./pages/NotFound";
import { PrivateRoute } from "./components/auth/PrivateRoute";
import Activities from "./pages/Activities";
import { ScrollToTop } from "./components/ScrollTop/ScrollTop";
import QuickGuide from "./pages/QuickGuide";
import ViewAttendance from "./pages/ViewAttendance";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <StoreInitializer />
          <BrowserRouter>
          <ScrollToTop/>
            <Routes>
              <Route path="/login" element={<Login />} />
              {/* //<Route path="/register" element={<Register />} /> */}
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              
              <Route path="/" element={<Overview />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/lecturers" element={<Lecturers />} />
              <Route path="/students" element={<Students />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/academic-sessions" element={<AcademicSessions />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/quick-guide" element={<QuickGuide />} />
              <Route path="/view-attendance" element={<ViewAttendance />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
