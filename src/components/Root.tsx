import * as React from "react";
import { HashRouter as Router, useRoutes, Navigate } from "react-router-dom";
import SideBar from "./SideBar";
import BottomNav from "./BottomNav";
import { FloatingThemeToggle } from "./FloatingThemeToggle";
import { Toaster } from "@/components/ui/toaster";
import Home from "./Home";
import { ThemeProvider } from "./theme-provider";
import { ApiConfigProvider } from "@/contexts/ApiConfigContext";
import { useApiConfig } from "@/hooks/useApiConfig";

const { lazy, Suspense } = React;

const Login = lazy(() => import("./Login"));
const Proxies = lazy(() => import("./Proxies"));
const Rules = lazy(() => import("./Rules"));
const Connections = lazy(() => import("./Connections"));
const Config = lazy(() => import("./Config"));
const Logs = lazy(() => import("./Logs"));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isConfigured } = useApiConfig();

  if (!isConfigured) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

const protectedRoutes = [
  { path: "/", element: <Home /> },
  { path: "/proxies", element: <Proxies /> },
  { path: "/rules", element: <Rules /> },
  { path: "/connections", element: <Connections /> },
  { path: "/configs", element: <Config /> },
  { path: "/logs", element: <Logs /> },
];

function RouteInnerApp() {
  const { isConfigured } = useApiConfig();
  const routes = [
    { path: "/login", element: <Login /> },
    ...protectedRoutes.map((route) => ({
      ...route,
      element: <ProtectedRoute>{route.element}</ProtectedRoute>,
    })),
  ];

  const element = useRoutes(routes);

  // Don't show sidebar/bottom nav on login page
  if (!isConfigured) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        {element}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <SideBar />
      <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 lg:pb-8">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center">
              <div className="text-muted-foreground">Loading...</div>
            </div>
          }
        >
          {element}
        </Suspense>
      </div>
      <BottomNav />
      <FloatingThemeToggle />
    </div>
  );
}

function App() {
  return <RouteInnerApp />;
}

const Root = () => (
  <Router>
    <ThemeProvider defaultTheme="system" storageKey="deboard-ui-theme">
      <ApiConfigProvider>
        <App />
        <Toaster />
      </ApiConfigProvider>
    </ThemeProvider>
  </Router>
);

export default Root;
