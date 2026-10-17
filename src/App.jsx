import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SiteLayout from "./components/SiteLayout";
import ScrollManager from "./components/ScrollManager";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Modules from "./pages/Modules";
import Savings from "./pages/Savings";
import Budget from "./pages/Budget";
import FinLit101 from "./pages/FinLit101";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetail from "./pages/ArticleDetail";
import AboutPage from "./pages/AboutPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ContactUs from "./pages/ContactUs";
import NotFound from "./pages/NotFound";

// Admin screens are only needed by admins — load them on demand
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AddArticle = lazy(() => import("./pages/AddArticle"));

// Learner area (logged-in users)
const AccountLayout = lazy(() => import("./pages/account/AccountLayout"));
const Overview = lazy(() => import("./pages/account/Overview"));
const MyModules = lazy(() => import("./pages/account/MyModules"));
const BudgetPlanner = lazy(() => import("./pages/account/BudgetPlanner"));
const SavedArticles = lazy(() => import("./pages/account/SavedArticles"));
const Settings = lazy(() => import("./pages/account/Settings"));
const Learn = lazy(() => import("./pages/Learn"));

function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <Suspense fallback={<div className="page-loader" aria-label="Loading" />}>
        <Routes>
          {/* Public pages — share the navigation bar and footer */}
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/modules" element={<Modules />} />
            <Route path="/savings" element={<Savings />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/finlit" element={<FinLit101 />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/contactUs" element={<ContactUs />} />

            {/* Any logged-in user */}
            <Route element={<PrivateRoute />}>
              <Route path="/account" element={<AccountLayout />}>
                <Route index element={<Overview />} />
                <Route path="modules" element={<MyModules />} />
                <Route path="budget" element={<BudgetPlanner />} />
                <Route path="saved" element={<SavedArticles />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="/learn/:moduleId" element={<Learn />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin only */}
          <Route element={<PrivateRoute requiredRole="admin" />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/addarticle" element={<AddArticle />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
