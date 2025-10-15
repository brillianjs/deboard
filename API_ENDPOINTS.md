# API Endpoints - Box for Magisk/Root

Dokumentasi lengkap tentang RESTful API endpoints yang tersedia dari Box for Root service.

## 📋 Daftar Isi

- [Informasi Umum](#informasi-umum)
- [Clash/Mihomo API](#clashmihomo-api)
- [Sing-box API](#sing-box-api)
- [Xray/V2fly](#xrayv2fly)
- [Command Line Tools](#command-line-tools)

---

## Informasi Umum

### Base URL

```
http://127.0.0.1:9090
```

atau

```
http://0.0.0.0:9090
```

### Kernel yang Mendukung API

- ✅ **Clash/Mihomo**: Full RESTful API support
- ✅ **Sing-box**: Limited API support
- ❌ **Xray**: Tidak ada web API
- ❌ **V2fly**: Tidak ada web API
- ❌ **Hysteria**: Tidak ada web API

### Authentication

Beberapa endpoint memerlukan authentication token (Bearer token) yang didefinisikan di file konfigurasi:

**Clash:**

```yaml
secret: "your-secret-token"
```

**Sing-box:**

```json
{
  "experimental": {
    "clash_api": {
      "secret": "your-secret-token"
    }
  }
}
```

### Headers

```http
Authorization: Bearer your-secret-token
Content-Type: application/json
```

---

## Clash/Mihomo API

### 🌐 Dashboard & UI

#### GET `/ui/`

Akses dashboard web UI (Zashboard).

**Request:**

```bash
curl http://127.0.0.1:9090/ui/
```

**Response:**

```html
<!DOCTYPE html>
<html>
  <!-- Dashboard UI -->
</html>
```

---

### ⚙️ Configuration Management

#### GET `/configs`

Mendapatkan konfigurasi Clash saat ini.

**Request:**

```bash
curl -X GET http://127.0.0.1:9090/configs \
  -H "Authorization: Bearer your-secret-token"
```

**Response:**

```json
{
  "port": 7890,
  "socks-port": 7891,
  "redir-port": 7892,
  "tproxy-port": 7893,
  "mixed-port": 7890,
  "allow-lan": false,
  "mode": "rule",
  "log-level": "info"
}
```

#### PUT `/configs`

Reload/update konfigurasi Clash tanpa restart service.

**Request:**

```bash
curl -X PUT http://127.0.0.1:9090/configs \
  -H "Authorization: Bearer your-secret-token" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "",
    "payload": ""
  }'
```

**Atau menggunakan sbfr:**

```bash
sbfr r  # reload configuration
```

**Response:**

```json
{
  "status": "ok"
}
```

#### PUT `/configs?force=true`

Force reload konfigurasi (khusus Mihomo).

**Request:**

```bash
curl -X PUT "http://127.0.0.1:9090/configs?force=true" \
  -H "Authorization: Bearer your-secret-token" \
  -d '{"path": "", "payload": ""}'
```

---

### 🔄 Restart & Upgrade

#### POST `/restart`

Restart Clash core tanpa mematikan service.

**Request:**

```bash
curl -X POST http://127.0.0.1:9090/restart \
  -H "Authorization: Bearer your-secret-token"
```

**Atau menggunakan sbfr:**

```bash
sbfr r
```

**Response:**

```json
{
  "status": "restarted"
}
```

#### POST `/upgrade`

Upgrade Clash/Mihomo core ke versi terbaru.

**Request:**

```bash
curl -X POST http://127.0.0.1:9090/upgrade \
  -H "Authorization: Bearer your-secret-token"
```

**Atau menggunakan sbfr:**

```bash
sbfr u
```

**Response:**

```json
{
  "status": "upgrading"
}
```

#### POST `/upgrade/ui`

Upgrade Dashboard UI ke versi terbaru.

**Request:**

```bash
curl -X POST http://127.0.0.1:9090/upgrade/ui \
  -H "Authorization: Bearer your-secret-token"
```

**Atau menggunakan sbfr:**

```bash
sbfr x
```

**Response:**

```json
{
  "status": "ui-upgraded"
}
```

---

### 🔌 Proxies Management

#### GET `/proxies`

Mendapatkan daftar semua proxy yang tersedia.

**Request:**

```bash
curl -X GET http://127.0.0.1:9090/proxies \
  -H "Authorization: Bearer your-secret-token"
```

**Response:**

```json
{
  "proxies": {
    "GLOBAL": {
      "type": "Selector",
      "now": "Auto",
      "all": ["Auto", "Proxy1", "Proxy2"]
    },
    "Proxy1": {
      "type": "Shadowsocks",
      "history": []
    }
  }
}
```

#### GET `/proxies/{name}`

Mendapatkan informasi proxy spesifik.

**Request:**

```bash
curl -X GET http://127.0.0.1:9090/proxies/GLOBAL \
  -H "Authorization: Bearer your-secret-token"
```

**Response:**

```json
{
  "type": "Selector",
  "now": "Auto",
  "all": ["Auto", "Proxy1", "Proxy2"]
}
```

#### PUT `/proxies/{name}`

Memilih proxy untuk selector group.

**Request:**

```bash
curl -X PUT http://127.0.0.1:9090/proxies/GLOBAL \
  -H "Authorization: Bearer your-secret-token" \
  -H "Content-Type: application/json" \
  -d '{"name": "Proxy1"}'
```

**Response:**

```json
{
  "status": "ok"
}
```

#### GET `/proxies/{name}/delay`

Tes delay/latency proxy.

**Request:**

```bash
curl -X GET "http://127.0.0.1:9090/proxies/Proxy1/delay?timeout=5000&url=http://www.gstatic.com/generate_204" \
  -H "Authorization: Bearer your-secret-token"
```

**Response:**

```json
{
  "delay": 123
}
```

---

### 📊 Traffic & Logs

#### GET `/traffic`

Mendapatkan statistik traffic real-time (WebSocket).

**Request:**

```javascript
const ws = new WebSocket("ws://127.0.0.1:9090/traffic");
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
};
```

**Response Stream:**

```json
{
  "up": 12345,
  "down": 67890
}
```

#### GET `/logs`

Stream logs real-time (WebSocket).

**Request:**

```javascript
const ws = new WebSocket("ws://127.0.0.1:9090/logs");
ws.onmessage = (event) => {
  const log = JSON.parse(event.data);
  console.log(log);
};
```

**Response Stream:**

```json
{
  "type": "info",
  "payload": "Log message here"
}
```

---

### 🌍 Providers Management

#### GET `/providers/proxies`

Mendapatkan daftar proxy providers.

**Request:**

```bash
curl -X GET http://127.0.0.1:9090/providers/proxies \
  -H "Authorization: Bearer your-secret-token"
```

**Response:**

```json
{
  "providers": {
    "default": {
      "name": "default",
      "type": "HTTP",
      "vehicleType": "HTTP",
      "updatedAt": "2025-10-14T10:00:00Z"
    }
  }
}
```

#### PUT `/providers/proxies/{name}`

Update proxy provider.

**Request:**

```bash
curl -X PUT http://127.0.0.1:9090/providers/proxies/default \
  -H "Authorization: Bearer your-secret-token"
```

**Response:**

```json
{
  "status": "updated"
}
```

#### GET `/providers/rules`

Mendapatkan daftar rule providers.

**Request:**

```bash
curl -X GET http://127.0.0.1:9090/providers/rules \
  -H "Authorization: Bearer your-secret-token"
```

---

### 🔒 Rules Management

#### GET `/rules`

Mendapatkan semua rules yang aktif.

**Request:**

```bash
curl -X GET http://127.0.0.1:9090/rules \
  -H "Authorization: Bearer your-secret-token"
```

**Response:**

```json
{
  "rules": [
    {
      "type": "DOMAIN-SUFFIX",
      "payload": "google.com",
      "proxy": "DIRECT"
    }
  ]
}
```

---

### 🔍 Connections Management

#### GET `/connections`

Mendapatkan daftar koneksi aktif.

**Request:**

```bash
curl -X GET http://127.0.0.1:9090/connections \
  -H "Authorization: Bearer your-secret-token"
```

**Response:**

```json
{
  "connections": [
    {
      "id": "1234",
      "metadata": {
        "network": "tcp",
        "type": "HTTP",
        "sourceIP": "192.168.1.2",
        "destinationIP": "1.1.1.1",
        "host": "example.com"
      },
      "upload": 1024,
      "download": 2048,
      "start": "2025-10-14T10:00:00Z",
      "chains": ["GLOBAL", "Proxy1"]
    }
  ]
}
```

#### DELETE `/connections`

Menutup semua koneksi aktif.

**Request:**

```bash
curl -X DELETE http://127.0.0.1:9090/connections \
  -H "Authorization: Bearer your-secret-token"
```

#### DELETE `/connections/{id}`

Menutup koneksi spesifik berdasarkan ID.

**Request:**

```bash
curl -X DELETE http://127.0.0.1:9090/connections/1234 \
  -H "Authorization: Bearer your-secret-token"
```

---

### 🧪 Version & Debug

#### GET `/version`

Mendapatkan versi Clash core.

**Request:**

```bash
curl -X GET http://127.0.0.1:9090/version
```

**Response:**

```json
{
  "version": "v1.18.0",
  "premium": true,
  "meta": true
}
```

---

### 🔌 WebSocket Endpoints

Clash/Mihomo dan Sing-box menyediakan **WebSocket** untuk monitoring real-time. WebSocket memungkinkan komunikasi dua arah yang efisien untuk streaming data.

#### Ketersediaan WebSocket

| Kernel           | WebSocket Support  | Endpoints                           |
| ---------------- | ------------------ | ----------------------------------- |
| **Clash/Mihomo** | ✅ Full support    | `/traffic`, `/logs`, `/connections` |
| **Sing-box**     | ✅ Limited support | `/traffic`, `/logs`                 |
| **Xray**         | ❌ Tidak ada       | -                                   |
| **V2fly**        | ❌ Tidak ada       | -                                   |
| **Hysteria**     | ❌ Tidak ada       | -                                   |

---

#### WebSocket `/traffic`

**Deskripsi:** Stream statistik traffic upload/download secara real-time.

**Protocol:** WebSocket (ws://)

**Endpoint:** `ws://127.0.0.1:9090/traffic`

**Authentication:** Tidak diperlukan

**Response Format:** JSON stream

**Response Example:**

```json
{
  "up": 12345,
  "down": 67890
}
```

**Fields:**

- `up` (integer): Upload speed dalam bytes per detik
- `down` (integer): Download speed dalam bytes per detik

**JavaScript Example:**

```javascript
const trafficWs = new WebSocket("ws://127.0.0.1:9090/traffic");

trafficWs.onopen = () => {
  console.log("Connected to traffic stream");
};

trafficWs.onmessage = (event) => {
  const data = JSON.parse(event.data);
  const uploadKB = (data.up / 1024).toFixed(2);
  const downloadKB = (data.down / 1024).toFixed(2);
  console.log(`⬆️ ${uploadKB} KB/s | ⬇️ ${downloadKB} KB/s`);
};

trafficWs.onerror = (error) => {
  console.error("Traffic WS Error:", error);
};

trafficWs.onclose = () => {
  console.log("Traffic stream closed");
};
```

**Python Example (using websocket-client):**

```python
import websocket
import json

def on_message(ws, message):
    data = json.loads(message)
    upload_kb = data['up'] / 1024
    download_kb = data['down'] / 1024
    print(f"⬆️ {upload_kb:.2f} KB/s | ⬇️ {download_kb:.2f} KB/s")

def on_error(ws, error):
    print(f"Error: {error}")

def on_close(ws, close_status_code, close_msg):
    print("Connection closed")

def on_open(ws):
    print("Connected to traffic stream")

ws = websocket.WebSocketApp(
    "ws://127.0.0.1:9090/traffic",
    on_open=on_open,
    on_message=on_message,
    on_error=on_error,
    on_close=on_close
)

ws.run_forever()
```

---

#### WebSocket `/logs`

**Deskripsi:** Stream logs dari proxy core secara real-time.

**Protocol:** WebSocket (ws://)

**Endpoint:** `ws://127.0.0.1:9090/logs`

**Authentication:** Tidak diperlukan

**Response Format:** JSON stream

**Response Example:**

```json
{
  "type": "info",
  "payload": "[TCP] 192.168.1.10:54321 --> example.com:443 match RuleSet(geosite:category-ads-all) using REJECT"
}
```

**Log Types:**

- `info` - Informasi umum
- `warning` - Peringatan
- `error` - Error/kesalahan
- `debug` - Debug information (jika log-level: debug)

**JavaScript Example:**

```javascript
const logsWs = new WebSocket("ws://127.0.0.1:9090/logs");

logsWs.onopen = () => {
  console.log("Connected to log stream");
};

logsWs.onmessage = (event) => {
  const log = JSON.parse(event.data);
  const timestamp = new Date().toLocaleTimeString();

  // Color coding based on log type
  const colors = {
    info: "\x1b[32m", // Green
    warning: "\x1b[33m", // Yellow
    error: "\x1b[31m", // Red
    debug: "\x1b[36m", // Cyan
  };

  const color = colors[log.type] || "\x1b[0m";
  const reset = "\x1b[0m";

  console.log(
    `${color}[${timestamp}] [${log.type.toUpperCase()}] ${log.payload}${reset}`
  );
};

logsWs.onerror = (error) => {
  console.error("Logs WS Error:", error);
};

logsWs.onclose = () => {
  console.log("Log stream closed");
};
```

**Python Example:**

```python
import websocket
import json
from datetime import datetime

def on_message(ws, message):
    log = json.loads(message)
    timestamp = datetime.now().strftime('%H:%M:%S')
    log_type = log['type'].upper()
    payload = log['payload']

    # ANSI color codes
    colors = {
        'INFO': '\033[32m',    # Green
        'WARNING': '\033[33m', # Yellow
        'ERROR': '\033[31m',   # Red
        'DEBUG': '\033[36m'    # Cyan
    }

    color = colors.get(log_type, '\033[0m')
    reset = '\033[0m'

    print(f"{color}[{timestamp}] [{log_type}] {payload}{reset}")

def on_error(ws, error):
    print(f"Error: {error}")

def on_close(ws, close_status_code, close_msg):
    print("Connection closed")

def on_open(ws):
    print("Connected to log stream")

ws = websocket.WebSocketApp(
    "ws://127.0.0.1:9090/logs",
    on_open=on_open,
    on_message=on_message,
    on_error=on_error,
    on_close=on_close
)

ws.run_forever()
```

---

#### WebSocket `/connections` (Stream)

**Deskripsi:** Stream koneksi aktif secara real-time (khusus Clash/Mihomo).

**Protocol:** WebSocket (ws://)

**Endpoint:** `ws://127.0.0.1:9090/connections`

**Authentication:** Tidak diperlukan

**Response Format:** JSON stream

**Response Example:**

```json
{
  "downloadTotal": 1024000,
  "uploadTotal": 512000,
  "connections": [
    {
      "id": "e1b2c3d4-5678-90ab-cdef-1234567890ab",
      "metadata": {
        "network": "tcp",
        "type": "HTTP",
        "sourceIP": "192.168.1.10",
        "destinationIP": "1.1.1.1",
        "sourcePort": "54321",
        "destinationPort": "443",
        "host": "example.com",
        "dnsMode": "normal",
        "processPath": "/system/bin/curl"
      },
      "upload": 2048,
      "download": 8192,
      "start": "2025-10-14T10:30:00.000Z",
      "chains": ["GLOBAL", "Proxy-HK"],
      "rule": "DOMAIN-SUFFIX",
      "rulePayload": "example.com"
    }
  ]
}
```

**JavaScript Example:**

```javascript
const connectionsWs = new WebSocket("ws://127.0.0.1:9090/connections");

connectionsWs.onopen = () => {
  console.log("Connected to connections stream");
};

connectionsWs.onmessage = (event) => {
  const data = JSON.parse(event.data);

  console.log(`Total Upload: ${(data.uploadTotal / 1024).toFixed(2)} KB`);
  console.log(`Total Download: ${(data.downloadTotal / 1024).toFixed(2)} KB`);
  console.log(`Active Connections: ${data.connections.length}`);

  data.connections.forEach((conn) => {
    console.log(
      `  [${conn.metadata.network}] ${conn.metadata.sourceIP}:${
        conn.metadata.sourcePort
      } -> ${conn.metadata.host || conn.metadata.destinationIP}`
    );
  });
};

connectionsWs.onerror = (error) => {
  console.error("Connections WS Error:", error);
};

connectionsWs.onclose = () => {
  console.log("Connections stream closed");
};
```

---

#### 📱 Complete Dashboard Example

Contoh lengkap HTML dashboard dengan semua WebSocket endpoints:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Box for Magisk - Live Monitor</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        min-height: 100vh;
        padding: 20px;
      }

      .container {
        max-width: 1200px;
        margin: 0 auto;
      }

      h1 {
        text-align: center;
        margin-bottom: 30px;
        font-size: 2.5em;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      }

      .card {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 15px;
        padding: 25px;
        margin-bottom: 20px;
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        border: 1px solid rgba(255, 255, 255, 0.18);
      }

      .card h2 {
        margin-bottom: 20px;
        font-size: 1.5em;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .status {
        display: inline-block;
        padding: 5px 15px;
        border-radius: 20px;
        font-size: 0.9em;
        font-weight: bold;
        margin-left: auto;
      }

      .status.connected {
        background: #4caf50;
      }

      .status.disconnected {
        background: #f44336;
      }

      .status.connecting {
        background: #ff9800;
      }

      .traffic-display {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-top: 15px;
      }

      .traffic-item {
        background: rgba(0, 0, 0, 0.3);
        padding: 20px;
        border-radius: 10px;
        text-align: center;
      }

      .traffic-item .label {
        font-size: 0.9em;
        opacity: 0.8;
        margin-bottom: 10px;
      }

      .traffic-item .value {
        font-size: 2em;
        font-weight: bold;
      }

      .log-container {
        background: rgba(0, 0, 0, 0.5);
        border-radius: 10px;
        padding: 15px;
        max-height: 400px;
        overflow-y: auto;
        font-family: "Courier New", monospace;
        font-size: 0.85em;
      }

      .log-entry {
        padding: 5px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .log-entry:last-child {
        border-bottom: none;
      }

      .log-entry .timestamp {
        color: #9e9e9e;
        margin-right: 10px;
      }

      .log-entry.info {
        color: #4caf50;
      }
      .log-entry.warning {
        color: #ff9800;
      }
      .log-entry.error {
        color: #f44336;
      }
      .log-entry.debug {
        color: #00bcd4;
      }

      .connections-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 15px;
      }

      .connections-table th,
      .connections-table td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .connections-table th {
        background: rgba(0, 0, 0, 0.3);
        font-weight: bold;
      }

      .btn {
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: #fff;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1em;
        transition: all 0.3s;
      }

      .btn:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: translateY(-2px);
      }

      .controls {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
      }

      @media (max-width: 768px) {
        .traffic-display {
          grid-template-columns: 1fr;
        }
      }

      /* Scrollbar styling */
      .log-container::-webkit-scrollbar {
        width: 8px;
      }

      .log-container::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 10px;
      }

      .log-container::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 10px;
      }

      .log-container::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.5);
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>📊 Box for Magisk - Live Monitor</h1>

      <!-- Traffic Monitor -->
      <div class="card">
        <h2>
          🚀 Traffic Monitor
          <span class="status connecting" id="traffic-status"
            >Connecting...</span
          >
        </h2>
        <div class="traffic-display">
          <div class="traffic-item">
            <div class="label">⬆️ Upload</div>
            <div class="value" id="upload">0.00</div>
            <div class="label">KB/s</div>
          </div>
          <div class="traffic-item">
            <div class="label">⬇️ Download</div>
            <div class="value" id="download">0.00</div>
            <div class="label">KB/s</div>
          </div>
        </div>
      </div>

      <!-- Log Monitor -->
      <div class="card">
        <h2>
          📝 Live Logs
          <span class="status connecting" id="log-status">Connecting...</span>
        </h2>
        <div class="controls">
          <button class="btn" onclick="clearLogs()">🗑️ Clear Logs</button>
          <button class="btn" onclick="toggleAutoScroll()">
            <span id="autoscroll-text">🔽 Auto-scroll: ON</span>
          </button>
        </div>
        <div class="log-container" id="logs"></div>
      </div>

      <!-- Connections Monitor -->
      <div class="card">
        <h2>
          🔗 Active Connections
          <span class="status connecting" id="conn-status">Connecting...</span>
        </h2>
        <div style="margin-bottom: 10px;">
          <strong>Total Upload:</strong> <span id="total-upload">0 KB</span> |
          <strong>Total Download:</strong>
          <span id="total-download">0 KB</span> | <strong>Active:</strong>
          <span id="conn-count">0</span>
        </div>
        <div style="overflow-x: auto;">
          <table class="connections-table">
            <thead>
              <tr>
                <th>Source</th>
                <th>Destination</th>
                <th>Type</th>
                <th>Chain</th>
                <th>Upload</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody id="connections-body">
              <tr>
                <td colspan="6" style="text-align: center; opacity: 0.5;">
                  Waiting for connections...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <script>
      // Configuration
      const WS_BASE = "ws://127.0.0.1:9090";
      let autoScroll = true;
      let logCount = 0;
      const MAX_LOGS = 100;

      // Traffic WebSocket
      const trafficWs = new WebSocket(`${WS_BASE}/traffic`);

      trafficWs.onopen = () => {
        updateStatus("traffic-status", "Connected", "connected");
      };

      trafficWs.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const uploadKB = (data.up / 1024).toFixed(2);
        const downloadKB = (data.down / 1024).toFixed(2);

        document.getElementById("upload").textContent = uploadKB;
        document.getElementById("download").textContent = downloadKB;
      };

      trafficWs.onerror = (error) => {
        console.error("Traffic WS Error:", error);
        updateStatus("traffic-status", "Error", "disconnected");
      };

      trafficWs.onclose = () => {
        updateStatus("traffic-status", "Disconnected", "disconnected");
      };

      // Logs WebSocket
      const logsWs = new WebSocket(`${WS_BASE}/logs`);
      const logsContainer = document.getElementById("logs");

      logsWs.onopen = () => {
        updateStatus("log-status", "Connected", "connected");
      };

      logsWs.onmessage = (event) => {
        const log = JSON.parse(event.data);
        addLog(log);
      };

      logsWs.onerror = (error) => {
        console.error("Logs WS Error:", error);
        updateStatus("log-status", "Error", "disconnected");
      };

      logsWs.onclose = () => {
        updateStatus("log-status", "Disconnected", "disconnected");
      };

      // Connections WebSocket
      const connectionsWs = new WebSocket(`${WS_BASE}/connections`);
      const connectionsBody = document.getElementById("connections-body");

      connectionsWs.onopen = () => {
        updateStatus("conn-status", "Connected", "connected");
      };

      connectionsWs.onmessage = (event) => {
        const data = JSON.parse(event.data);
        updateConnections(data);
      };

      connectionsWs.onerror = (error) => {
        console.error("Connections WS Error:", error);
        updateStatus("conn-status", "Error", "disconnected");
      };

      connectionsWs.onclose = () => {
        updateStatus("conn-status", "Disconnected", "disconnected");
      };

      // Helper Functions
      function updateStatus(elementId, text, statusClass) {
        const element = document.getElementById(elementId);
        element.textContent = text;
        element.className = `status ${statusClass}`;
      }

      function addLog(log) {
        const timestamp = new Date().toLocaleTimeString();
        const logClass = log.type || "info";

        const logEntry = document.createElement("div");
        logEntry.className = `log-entry ${logClass}`;
        logEntry.innerHTML = `<span class="timestamp">[${timestamp}]</span><strong>[${log.type.toUpperCase()}]</strong> ${escapeHtml(
          log.payload
        )}`;

        logsContainer.insertBefore(logEntry, logsContainer.firstChild);

        logCount++;
        if (logCount > MAX_LOGS) {
          logsContainer.removeChild(logsContainer.lastChild);
          logCount--;
        }

        if (autoScroll) {
          logsContainer.scrollTop = 0;
        }
      }

      function updateConnections(data) {
        document.getElementById("total-upload").textContent =
          (data.uploadTotal / 1024).toFixed(2) + " KB";
        document.getElementById("total-download").textContent =
          (data.downloadTotal / 1024).toFixed(2) + " KB";
        document.getElementById("conn-count").textContent =
          data.connections.length;

        if (data.connections.length === 0) {
          connectionsBody.innerHTML = `
                    <tr>
                        <td colspan="6" style="text-align: center; opacity: 0.5;">
                            No active connections
                        </td>
                    </tr>
                `;
          return;
        }

        connectionsBody.innerHTML = data.connections
          .map(
            (conn) => `
                <tr>
                    <td>${conn.metadata.sourceIP}:${
              conn.metadata.sourcePort
            }</td>
                    <td>${conn.metadata.host || conn.metadata.destinationIP}:${
              conn.metadata.destinationPort
            }</td>
                    <td>${conn.metadata.type}</td>
                    <td>${conn.chains.join(" → ")}</td>
                    <td>${(conn.upload / 1024).toFixed(2)} KB</td>
                    <td>${(conn.download / 1024).toFixed(2)} KB</td>
                </tr>
            `
          )
          .join("");
      }

      function clearLogs() {
        logsContainer.innerHTML = "";
        logCount = 0;
      }

      function toggleAutoScroll() {
        autoScroll = !autoScroll;
        document.getElementById(
          "autoscroll-text"
        ).textContent = `🔽 Auto-scroll: ${autoScroll ? "ON" : "OFF"}`;
      }

      function escapeHtml(text) {
        const map = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#039;",
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
      }

      // Cleanup on page unload
      window.addEventListener("beforeunload", () => {
        trafficWs.close();
        logsWs.close();
        connectionsWs.close();
      });
    </script>
  </body>
</html>
```

Simpan file HTML di atas sebagai `monitor.html` dan buka di browser untuk melihat dashboard monitoring lengkap dengan semua WebSocket endpoints!

---

#### ⚠️ WebSocket Best Practices

1. **Reconnection Logic**: Implement auto-reconnect jika koneksi terputus

   ```javascript
   function connectWebSocket(url, onMessage) {
     let ws;

     function connect() {
       ws = new WebSocket(url);

       ws.onopen = () => console.log("Connected");
       ws.onmessage = onMessage;
       ws.onerror = (error) => console.error("Error:", error);
       ws.onclose = () => {
         console.log("Disconnected, reconnecting in 3s...");
         setTimeout(connect, 3000);
       };
     }

     connect();
     return ws;
   }
   ```

2. **Error Handling**: Selalu tangani error dan close events
3. **Memory Management**: Batasi jumlah data yang disimpan (max logs, max connections)
4. **Connection Cleanup**: Tutup WebSocket saat tidak digunakan
5. **Mobile Considerations**: WebSocket mungkin terputus saat app di background

---

## Sing-box API

Sing-box memiliki limited API support melalui Clash API compatibility mode.

### Configuration

**File:** `/data/adb/box/sing-box/config.json`

```json
{
  "experimental": {
    "clash_api": {
      "external_controller": "0.0.0.0:9090",
      "external_ui": "dashboard",
      "secret": "your-secret-token",
      "default_mode": "rule"
    }
  }
}
```

### Supported Endpoints

Sing-box mendukung subset dari Clash API:

- ✅ `GET /` - Dashboard UI
- ✅ `GET /traffic` - Traffic statistics
- ✅ `GET /logs` - Log stream
- ✅ `GET /proxies` - Proxy list
- ✅ `PUT /proxies/{name}` - Select proxy
- ✅ `GET /rules` - Rules list
- ⚠️ `GET /connections` - Limited support
- ❌ `/upgrade` - Not supported
- ❌ `/restart` - Not supported

---

## Xray/V2fly

Xray dan V2fly **TIDAK** memiliki web API atau dashboard built-in.

### Alternatif Monitoring

Gunakan command line tools untuk monitoring:

```bash
# Check status
su -c /data/adb/box/scripts/box.service status

# View logs
tail -f /data/adb/box/run/xray.log

# View process info
ps -ef | grep xray
```

---

## Command Line Tools

### Script: `sbfr`

Shortcut untuk mengakses API endpoints.

**Location:** `/system/bin/sbfr` atau project root

#### Commands

```bash
# Start service
sbfr start

# Stop service
sbfr stop

# Upgrade core (POST /upgrade)
sbfr u

# Upgrade UI (POST /upgrade/ui)
sbfr x

# Restart (POST /restart)
sbfr r

# Execute box.service commands
sbfr s <args>

# Execute box.iptables commands
sbfr i <args>

# Execute box.tool commands
sbfr t <args>

# Show help
sbfr help
```

### Script: `box.service`

**Location:** `/data/adb/box/scripts/box.service`

```bash
# Start service
su -c /data/adb/box/scripts/box.service start

# Stop service
su -c /data/adb/box/scripts/box.service stop

# Restart service
su -c /data/adb/box/scripts/box.service restart

# Check status
su -c /data/adb/box/scripts/box.service status

# Enable crontab
su -c /data/adb/box/scripts/box.service cron

# Disable crontab
su -c /data/adb/box/scripts/box.service kcron
```

### Script: `box.tool`

**Location:** `/data/adb/box/scripts/box.tool`

```bash
# Check configuration
su -c /data/adb/box/scripts/box.tool check

# Update GeoX and Subscription
su -c /data/adb/box/scripts/box.tool geosub

# Update GeoX only
su -c /data/adb/box/scripts/box.tool geox

# Update Subscription only
su -c /data/adb/box/scripts/box.tool subs

# Update kernel
su -c /data/adb/box/scripts/box.tool upkernel

# Update dashboard UI
su -c /data/adb/box/scripts/box.tool upxui

# Update yq binary
su -c /data/adb/box/scripts/box.tool upyq

# Update curl binary
su -c /data/adb/box/scripts/box.tool upcurl

# Reload configuration
su -c /data/adb/box/scripts/box.tool reload

# Update webroot
su -c /data/adb/box/scripts/box.tool webroot

# Cgroup management
su -c /data/adb/box/scripts/box.tool memcg
su -c /data/adb/box/scripts/box.tool cpuset
su -c /data/adb/box/scripts/box.tool blkio
```

### Script: `box.iptables`

**Location:** `/data/adb/box/scripts/box.iptables`

```bash
# Enable iptables rules
su -c /data/adb/box/scripts/box.iptables enable

# Disable iptables rules
su -c /data/adb/box/scripts/box.iptables disable

# Renew iptables rules
su -c /data/adb/box/scripts/box.iptables renew
```

---

## 📝 Contoh Penggunaan

### Contoh 1: Monitor Traffic Real-time

**HTML + JavaScript:**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Traffic Monitor</title>
  </head>
  <body>
    <h1>Traffic Monitor</h1>
    <p>Upload: <span id="up">0</span> KB/s</p>
    <p>Download: <span id="down">0</span> KB/s</p>

    <script>
      const ws = new WebSocket("ws://127.0.0.1:9090/traffic");

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        document.getElementById("up").textContent = (data.up / 1024).toFixed(2);
        document.getElementById("down").textContent = (
          data.down / 1024
        ).toFixed(2);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    </script>
  </body>
</html>
```

### Contoh 2: Automation Script

**Bash Script:**

```bash
#!/system/bin/sh

# Auto-update script
TOKEN="your-secret-token"
API="http://127.0.0.1:9090"

# Function to call API
call_api() {
    curl -s -X POST "$API$1" \
        -H "Authorization: Bearer $TOKEN"
}

# Update GeoX
su -c /data/adb/box/scripts/box.tool geox

# Reload configuration
call_api "/configs"

# Check if service is running
if su -c /data/adb/box/scripts/box.service status | grep -q "running"; then
    echo "Service is running"
else
    echo "Service stopped, starting..."
    su -c /data/adb/box/scripts/box.service start
fi
```

### Contoh 3: Python Client

```python
import requests
import json

class ClashClient:
    def __init__(self, base_url="http://127.0.0.1:9090", secret=""):
        self.base_url = base_url
        self.headers = {
            "Authorization": f"Bearer {secret}",
            "Content-Type": "application/json"
        }

    def get_proxies(self):
        """Get all proxies"""
        response = requests.get(
            f"{self.base_url}/proxies",
            headers=self.headers
        )
        return response.json()

    def select_proxy(self, group, proxy_name):
        """Select proxy for a group"""
        response = requests.put(
            f"{self.base_url}/proxies/{group}",
            headers=self.headers,
            json={"name": proxy_name}
        )
        return response.json()

    def reload_config(self):
        """Reload configuration"""
        response = requests.put(
            f"{self.base_url}/configs",
            headers=self.headers,
            json={"path": "", "payload": ""}
        )
        return response.json()

# Usage
client = ClashClient(secret="your-secret-token")
proxies = client.get_proxies()
print(json.dumps(proxies, indent=2))
```

---

## ⚠️ Catatan Penting

1. **Security**: Pastikan menggunakan `secret` token untuk melindungi API dari akses tidak sah
2. **Binding**: Default binding `0.0.0.0:9090` memungkinkan akses dari jaringan lokal. Gunakan `127.0.0.1:9090` untuk akses lokal saja
3. **Firewall**: Pastikan port 9090 tidak exposed ke internet
4. **CORS**: Clash mendukung CORS, konfigurasi ada di file config
5. **WebSocket**: Endpoint `/traffic` dan `/logs` menggunakan WebSocket protocol
6. **Authentication**: Bearer token wajib untuk endpoint yang sensitif

---

## 📚 Referensi

- [Clash API Documentation](https://clash.gitbook.io/doc/restful-api)
- [Mihomo Documentation](https://wiki.metacubex.one/)
- [Sing-box Documentation](https://sing-box.sagernet.org/)
- [Box for Magisk Repository](https://github.com/taamarin/box_for_magisk)

---

## 🤝 Kontribusi

Jika menemukan endpoint yang tidak terdokumentasi atau ada kesalahan, silakan buat issue atau pull request di repository.

---

**Dibuat pada:** 14 Oktober 2025  
**Versi:** 1.0  
**Author:** Box for Magisk Team
