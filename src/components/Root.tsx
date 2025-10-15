import * as React from "react";
import { HashRouter as Router, useRoutes } from "react-router-dom";
import SideBar from "./SideBar";
import BottomNav from "./BottomNav";
import { FloatingThemeToggle } from "./FloatingThemeToggle";
import { Toaster } from "@/components/ui/toaster";
import Home from "./Home";
import { ThemeProvider } from "./theme-provider";

const { lazy, Suspense } = React;

const Proxies = lazy(() => import("./Proxies"));
const Rules = lazy(() => import("./Rules"));
const Connections = lazy(() => import("./Connections"));
const Config = lazy(() => import("./Config"));
const Logs = lazy(() => import("./Logs"));

const routes = [
  { path: "/", element: <Home /> },
  { path: "/proxies", element: <Proxies /> },
  { path: "/rules", element: <Rules /> },
  { path: "/connections", element: <Connections /> },
  { path: "/configs", element: <Config /> },
  { path: "/logs", element: <Logs /> },
];

function RouteInnerApp() {
  return useRoutes(routes);
}

function SideBarApp() {
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
          <RouteInnerApp />
        </Suspense>
      </div>
      <BottomNav />
      <FloatingThemeToggle />
    </div>
  );
}

function App() {
  return useRoutes([{ path: "*", element: <SideBarApp /> }]);
}

const Root = () => (
  <Router>
    <ThemeProvider defaultTheme="system" storageKey="deboard-ui-theme">
      <App />
      <Toaster />
    </ThemeProvider>
  </Router>
);

export default Root;
