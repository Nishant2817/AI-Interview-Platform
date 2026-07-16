import { lazy, Suspense } from "react";
import { Routes, Route,  } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import ResetPassword from "../pages/ResetPassword";
import QuestionBank from "../pages/QuestionBank";
import Bookmarks from "../pages/Bookmarks";
import AdminDashboard from "../pages/AdminDashboard";
import AdminRoute from "./AdminRoute";
import ResumeUpload from "../pages/ResumeUpload";
import Progress from "../pages/Progress";
import CompanyProfile from "../pages/CompanyProfile";
import InterviewHistory from "../pages/InterviewHistory";
import CompanyQuestions from "../pages/CompanyQuestion";
import AIInterview from "../pages/AIInterview";
import AIInterviewProcessing from "../pages/AIInterviewProcessing";
import AIInterviewReport from "../pages/AIInterviewReport";
// Lazy Loaded Pages
const Login = lazy(() => import("../pages/Login"));
const Profile = lazy(() => import("../pages/Profile"));
const Register = lazy(() => import("../pages/Register"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const GoogleSuccess = lazy(() => import("../pages/GoogleSuccess"));
const Landing = lazy(() => import("../pages/Landing"));


export default function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#050816] text-white text-xl">
          Loading...
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Register />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/google-success" element={<GoogleSuccess />} />
        <Route path="/questions" element={<QuestionBank />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route path="/resume-upload" element={<ResumeUpload />} />

        <Route path="/progress" element={<Progress />} />
        <Route path="/company/:id" element={<CompanyProfile />} />
        <Route path="/interview-history" element={<InterviewHistory />} />
        <Route path="/ai-interview-report/:sessionId" element={<AIInterviewReport />} />
        <Route path="/ai-interview-processing/:sessionId" element={<AIInterviewProcessing />} />
        <Route path="/company/:companyId/questions/:questionTypeId" element={<CompanyQuestions />} />
        <Route
          path="/ai-interview"
          element={
            <ProtectedRoute>
              <AIInterview />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}
