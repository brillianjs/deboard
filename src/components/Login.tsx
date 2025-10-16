import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApiConfig } from "@/hooks/useApiConfig";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { setConfig, testConnection } = useApiConfig();
  const [formData, setFormData] = useState({
    hostname: "127.0.0.1",
    port: "9090",
    secret: "",
  });
  const [testing, setTesting] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const buildBaseURL = () => {
    const protocol = window.location.protocol === "https:" ? "https:" : "http:";
    return `${protocol}//${formData.hostname}:${formData.port}`;
  };

  const handleTest = async () => {
    if (!formData.hostname || !formData.port) {
      toast.error("Please enter hostname and port");
      return;
    }

    setTesting(true);
    const config = {
      baseURL: buildBaseURL(),
      secret: formData.secret,
    };

    try {
      const success = await testConnection(config);
      if (success) {
        toast.success("Connection successful!");
      } else {
        toast.error("Connection failed. Please check your settings.");
      }
    } finally {
      setTesting(false);
    }
  };

  const handleConnect = async () => {
    if (!formData.hostname || !formData.port) {
      toast.error("Please enter hostname and port");
      return;
    }

    setConnecting(true);
    const config = {
      baseURL: buildBaseURL(),
      secret: formData.secret,
    };

    try {
      const success = await testConnection(config);
      if (success) {
        setConfig(config);
        toast.success("Connected successfully!");
        navigate("/");
      } else {
        toast.error("Connection failed. Please check your settings.");
      }
    } finally {
      setConnecting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleConnect();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="Logo" className="h-20 w-20" />
          </div>
          <CardTitle className="text-2xl font-bold">Deboard</CardTitle>
          <CardDescription>Connect to your Clash API server</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hostname">Hostname / IP Address</Label>
              <Input
                id="hostname"
                type="text"
                placeholder="127.0.0.1"
                value={formData.hostname}
                onChange={(e) =>
                  setFormData({ ...formData, hostname: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                type="text"
                placeholder="9090"
                value={formData.port}
                onChange={(e) =>
                  setFormData({ ...formData, port: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secret">Secret (Optional)</Label>
              <Input
                id="secret"
                type="password"
                placeholder="Enter API secret if required"
                value={formData.secret}
                onChange={(e) =>
                  setFormData({ ...formData, secret: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Leave empty if your Clash server doesn't require authentication
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleTest}
                disabled={testing || connecting}
                className="flex-1"
              >
                {testing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Test
              </Button>
              <Button
                type="submit"
                disabled={testing || connecting}
                className="flex-1"
              >
                {connecting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Connect
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Common configurations:</p>
            <div className="mt-2 space-y-1 text-xs">
              <p>• Local: 127.0.0.1:9090</p>
              <p>• LAN: 192.168.x.x:9090</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
