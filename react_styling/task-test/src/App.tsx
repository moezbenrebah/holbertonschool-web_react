// src/App.tsx - With protected routes
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import StressTracker from "./pages/StressTracker";
import StressEducation from '@/pages/StressEducation';
import BreathingExercises from './pages/BreathingExercises';
import Meditation from './pages/Meditation';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './components/context/AuthContext';
import RelaxationMusic from './pages/RelaxationMusic';
import Profile from './pages/Profile';

// Create a client
const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Protected Dashboard Routes */}
                <Route path="/app" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Dashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                 {/* Profile Route */}
                <Route 
                  path="/app/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />

                <Route path="/app/stress" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <StressTracker />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/app/stress-education" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <StressEducation />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/app/breathing" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <BreathingExercises />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/app/meditation" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Meditation />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                {/* Updated Route for Relaxation Music */}
                <Route 
                  path="/app/music" 
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <RelaxationMusic />
                      </DashboardLayout>
                    </ProtectedRoute>
                  } 
                />
                
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;