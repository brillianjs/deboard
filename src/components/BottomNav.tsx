import {
  Activity,
  Globe,
  Command,
  Link as LinkIcon,
  Settings,
  FileText,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const icons = {
  activity: Activity,
  globe: Globe,
  command: Command,
  file: FileText,
  settings: Settings,
  link: LinkIcon,
};

const pages: Array<{
  to: string;
  iconId: keyof typeof icons;
  labelText: string;
}> = [
  { to: "/", iconId: "activity", labelText: "Overview" },
  { to: "/proxies", iconId: "globe", labelText: "Proxies" },
  { to: "/rules", iconId: "command", labelText: "Rules" },
  { to: "/connections", iconId: "link", labelText: "Conns" },
  { to: "/configs", iconId: "settings", labelText: "Config" },
  { to: "/logs", iconId: "file", labelText: "Logs" },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card/95 backdrop-blur-sm border-t border-border">
      <div className="grid grid-cols-6 gap-1 px-2 py-2">
        {pages.map(({ to, iconId, labelText }) => {
          const Icon = icons[iconId];
          const isActive = location.pathname === to;

          return (
            <Link
              key={to}
              to={to}
              className={`
                flex flex-col items-center justify-center py-2 px-1 rounded-lg
                transition-colors duration-200
                ${
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }
              `}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} />
              <span className="text-[10px] mt-1 font-medium truncate w-full text-center">
                {labelText}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
