import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  fetchConfigs,
  updateConfigs,
  getVersion,
  restartCore,
  upgradeCore,
  upgradeUI,
  reloadConfigs,
  type ClashConfig,
} from "@/api/configs";
import {
  Save,
  RefreshCw,
  RotateCcw,
  Download,
  Paintbrush,
  AlertCircle,
} from "lucide-react";

export default function Config() {
  const [config, setConfig] = useState<ClashConfig | null>(null);
  const [version, setVersion] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [restarting, setRestarting] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [upgradingUI, setUpgradingUI] = useState(false);

  useEffect(() => {
    loadConfig();
    loadVersion();
  }, []);

  const loadVersion = async () => {
    try {
      const versionData = await getVersion();
      setVersion(versionData.version);
    } catch (error) {
      console.error("Failed to load version:", error);
    }
  };

  const loadConfig = async () => {
    try {
      setLoading(true);
      const data = await fetchConfigs();
      setConfig(data);
      toast.success("Configuration loaded");
    } catch (error) {
      console.error("Failed to load config:", error);
      toast.error("Failed to load configuration");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;

    try {
      setSaving(true);
      await updateConfigs({
        port: config.port,
        "socks-port": config["socks-port"],
        "redir-port": config["redir-port"],
        "mixed-port": config["mixed-port"],
        "allow-lan": config["allow-lan"],
        mode: config.mode,
        "log-level": config["log-level"],
        ipv6: config.ipv6,
      });
      await loadConfig();
      toast.success("Configuration saved successfully");
    } catch (error) {
      console.error("Failed to save config:", error);
      toast.error("Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  const handleReload = async () => {
    try {
      setLoading(true);
      await reloadConfigs("");
      await loadConfig();
      toast.success("Configuration reloaded");
    } catch (error) {
      console.error("Failed to reload config:", error);
      toast.error("Failed to reload configuration");
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = async () => {
    try {
      setRestarting(true);
      await restartCore();
      toast.success("Core restarted successfully");
      setTimeout(() => loadConfig(), 2000);
    } catch (error) {
      console.error("Failed to restart core:", error);
      toast.error("Failed to restart core");
    } finally {
      setRestarting(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      setUpgrading(true);
      toast.info("Upgrading core...");
      await upgradeCore();
      toast.success("Core upgraded successfully");
      setTimeout(() => {
        loadVersion();
        loadConfig();
      }, 2000);
    } catch (error) {
      console.error("Failed to upgrade core:", error);
      toast.error("Failed to upgrade core");
    } finally {
      setUpgrading(false);
    }
  };

  const handleUpgradeUI = async () => {
    try {
      setUpgradingUI(true);
      toast.info("Upgrading UI...");
      await upgradeUI();
      toast.success("UI upgraded successfully");
    } catch (error) {
      console.error("Failed to upgrade UI:", error);
      toast.error("Failed to upgrade UI");
    } finally {
      setUpgradingUI(false);
    }
  };

  if (loading || !config) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Configuration
          </h1>
          <p className="text-muted-foreground">
            Manage Clash system settings and preferences
            {version && (
              <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                v{version}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleReload}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reload Config
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRestart}
            disabled={restarting}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {restarting ? "Restarting..." : "Restart Core"}
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* System Actions */}
      <Card className="border-yellow-500/20 bg-yellow-500/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <CardTitle>System Actions</CardTitle>
          </div>
          <CardDescription>
            Manage core and UI upgrades (use with caution)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="default"
              size="sm"
              onClick={handleUpgrade}
              disabled={upgrading}
            >
              <Download className="h-4 w-4 mr-2" />
              {upgrading ? "Upgrading..." : "Upgrade Core"}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleUpgradeUI}
              disabled={upgradingUI}
            >
              <Paintbrush className="h-4 w-4 mr-2" />
              {upgradingUI ? "Upgrading..." : "Upgrade UI"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Proxy Mode</CardTitle>
          <CardDescription>
            Choose how Clash handles network traffic
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {(["Rule", "Global", "Direct"] as const).map((mode) => (
              <Button
                key={mode}
                variant={config.mode === mode ? "default" : "outline"}
                onClick={() => setConfig({ ...config, mode })}
              >
                {mode}
              </Button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            {config.mode === "Rule" && "Traffic is routed based on rules"}
            {config.mode === "Global" && "All traffic goes through proxy"}
            {config.mode === "Direct" && "All traffic goes direct"}
          </p>
        </CardContent>
      </Card>

      {/* Proxy Ports */}
      <Card>
        <CardHeader>
          <CardTitle>Proxy Ports</CardTitle>
          <CardDescription>
            Configure ports for different proxy protocols
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="port">HTTP Proxy Port</Label>
              <Input
                id="port"
                type="number"
                value={config.port}
                onChange={(e) =>
                  setConfig({ ...config, port: parseInt(e.target.value) })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="socks-port">SOCKS5 Proxy Port</Label>
              <Input
                id="socks-port"
                type="number"
                value={config["socks-port"]}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    "socks-port": parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mixed-port">Mixed Port</Label>
              <Input
                id="mixed-port"
                type="number"
                value={config["mixed-port"]}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    "mixed-port": parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="redir-port">Redir Port</Label>
              <Input
                id="redir-port"
                type="number"
                value={config["redir-port"]}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    "redir-port": parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Network Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Network Settings</CardTitle>
          <CardDescription>Configure network behavior</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow LAN</Label>
              <p className="text-sm text-muted-foreground">
                Allow connections from LAN
              </p>
            </div>
            <Switch
              checked={config["allow-lan"]}
              onCheckedChange={(checked) =>
                setConfig({ ...config, "allow-lan": checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>IPv6</Label>
              <p className="text-sm text-muted-foreground">
                Enable IPv6 support
              </p>
            </div>
            <Switch
              checked={config.ipv6}
              onCheckedChange={(checked) =>
                setConfig({ ...config, ipv6: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Log Level */}
      <Card>
        <CardHeader>
          <CardTitle>Log Level</CardTitle>
          <CardDescription>Set the verbosity of logs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {(["debug", "info", "warning", "error", "silent"] as const).map(
              (level) => (
                <Button
                  key={level}
                  variant={
                    config["log-level"] === level ? "default" : "outline"
                  }
                  onClick={() => setConfig({ ...config, "log-level": level })}
                  size="sm"
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Button>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">External Controller:</span>
            <span className="font-mono">{config["external-controller"]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Bind Address:</span>
            <span className="font-mono">{config["bind-address"]}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
