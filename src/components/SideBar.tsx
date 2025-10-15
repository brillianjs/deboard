import * as React from "react";
import {
  Activity,
  Globe,
  Command,
  FileText,
  Settings,
  Link as LinkIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";

const icons = {
  activity: Activity,
  globe: Globe,
  command: Command,
  file: FileText,
  settings: Settings,
  link: LinkIcon,
};

const SideBarRow = React.memo(function SideBarRow({
  isActive,
  to,
  iconId,
  labelText,
}: SideBarRowProps) {
  const Icon = icons[iconId];
  return (
    <Link
      to={to}
      className={
        isActive
          ? "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 bg-primary/10 text-primary shadow-sm border border-primary/20"
          : "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-sm hover:translate-x-1"
      }
    >
      <Icon className={isActive ? "h-5 w-5 text-primary" : "h-5 w-5"} />
      <span>{labelText}</span>
    </Link>
  );
});

interface SideBarRowProps {
  isActive: boolean;
  to: string;
  iconId: keyof typeof icons;
  labelText: string;
}

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

export default function SideBar() {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <div className="hidden lg:flex w-64 flex-col border-r bg-card/50 backdrop-blur-sm p-4">
      {/* Logo */}
      <div className="mb-8 px-4">
        <div className="flex items-center justify-center gap-3 py-4 px-4 rounded-xl bg-primary/5 border border-primary/10">
          <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
          <span className="text-2xl font-bold text-primary">Deboard</span>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-2">
        {pages.map(({ to, iconId, labelText }) => (
          <SideBarRow
            key={to}
            to={to}
            isActive={location.pathname === to}
            iconId={iconId}
            labelText={t(`nav.${labelText.toLowerCase()}`)}
          />
        ))}
      </nav>

      {/* Theme & Language Toggle */}
      <div className="mt-auto space-y-2 px-4 pb-6">
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>

      <div className="pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground text-center font-medium">
          Deboard v1.0.0
        </p>
      </div>
    </div>
  );
}
