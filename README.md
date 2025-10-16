# Deboard

<div align="center">
  <img src="public/logo.png" alt="Deboard Logo" width="200"/>
  
  <p><strong>A modern, full-featured Clash dashboard built with React, TypeScript, and Tailwind CSS.</strong></p>
  <p>Inspired by yacd with enhanced UX, real-time monitoring, and multi-language support.</p>
  
  ![Deboard Dashboard](https://img.shields.io/badge/React-19.1.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue) ![Vite](https://img.shields.io/badge/Vite-7.1-purple) ![License](https://img.shields.io/badge/License-MIT-green)
</div>

## ✨ Features

### 🔐 Authentication System

- **Login Page**: yacd-style login with hostname, port, and secret configuration
- **Test Connection**: Validate server connection before saving
- **Persistent Config**: Secure localStorage-based configuration storage
- **Session Management**: Logout functionality with automatic route protection

### 🌐 Multi-Language Support

- **English** (EN) 🇬🇧
- **Indonesian** (ID) 🇮🇩
- **Chinese** (ZH) 🇨🇳
- Simple language switcher with cycling button

### 📊 Real-time Monitoring

- **Live Traffic Charts**: Chart.js powered visualization with smooth scrolling
- **WebSocket Connections**: Real-time data streaming for traffic, memory, and connections
- **6 Key Metrics**:
  - Upload/Download Speed
  - Total Upload/Download
  - Active Connections
  - Memory Usage (with chart)

### 🎨 Modern UI/UX

- **Fully Responsive**:
  - Desktop (≥1024px): Sidebar navigation
  - Mobile/Tablet (<1024px): Bottom navigation bar
- **Dark/Light Mode**: Harmonized blue-purple color palette
- **Toast Notifications**: Sonner for user feedback across all actions
- **Modern SVG Logo**: Custom network topology design

### 🔧 Complete Management

- **Overview**: Dashboard with traffic and system metrics
- **Proxies**: Proxy groups management with delay testing
- **Rules**: Routing rules and rule providers
- **Connections**: Active connections with pagination (20 per page)
- **Config**: Version info, restart, and upgrade controls
- **Logs**: Real-time log viewer with filtering

## 🛠️ Tech Stack

- **Framework**: React 19.1.1
- **Language**: TypeScript 5.7
- **Build Tool**: Vite 7.1.9
- **Styling**:
  - Tailwind CSS 3.4.17
  - Radix UI Components (Tabs, Popover, Switch, Label)
  - shadcn/ui
- **Routing**: React Router 7.9.4
- **Charts**: Chart.js 4.5.1 + react-chartjs-2
- **Icons**: Lucide React
- **i18n**: i18next 25.6.0 + react-i18next 16.0.1
- **Notifications**: Sonner 2.0.7
- **State Management**: React Context API

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or higher
- pnpm (recommended) or npm
- Running Clash/Mihomo server

### Installation

`````bash
# Clone the repository
git clone https://github.com/brillianjs/deboard.git

# Navigate to project directory
cd deboard

# Install dependencies
pnpm install```

````bashYou can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

# Clone the repository

git clone <repository-url>```js

// eslint.config.js

# Navigate to project directoryimport reactX from 'eslint-plugin-react-x'

cd deboardimport reactDom from 'eslint-plugin-react-dom'



# Install dependenciesexport default defineConfig([

pnpm install  globalIgnores(['dist']),

  {
# Start development server
pnpm dev
`````

The application will be available at `http://localhost:5173`

### First Time Setup

1. **Start the development server**
2. **Open the application** in your browser
3. **Login page** will appear automatically
4. **Enter your Clash server details**:
   - Hostname: e.g., `127.0.0.1` or `192.168.1.100`
   - Port: e.g., `9090`
   - Secret: (optional) Your API secret if configured
5. **Test Connection** to verify settings
6. **Connect** to save and access the dashboard

### Common Server Configurations

```bash
# Local Clash
Hostname: 127.0.0.1
Port: 9090
Secret: (leave empty if not set)

# Remote Clash
Hostname: 192.168.1.100
Port: 9090
Secret: your-secret-key
```

### Build for Production

```bash
pnpm build
```

The built files will be in the `dist/` directory.

### Deploy to GitHub Pages

#### Automatic Deployment (Recommended)

The project is configured with GitHub Actions for automatic deployment:

1. **Enable GitHub Pages**:
   - Go to your repository Settings → Pages
   - Source: Select "GitHub Actions"
2. **Push to main branch**:

   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **Access your site**:
   - Your dashboard will be available at: `https://brillianjs.github.io/deboard/`
   - Wait for the GitHub Action to complete (check Actions tab)

#### Manual Deployment

```bash
# Install gh-pages package
pnpm install -D gh-pages

# Build and deploy
pnpm deploy
```

**Note**: Update `base: "/deboard/"` in `vite.config.ts` if your repository name is different.

## 📱 Responsive Design

### Desktop View (≥1024px)

- Fixed sidebar navigation on the left
- Logout button at sidebar bottom
- Theme & language toggles integrated
- Spacious layout with optimal spacing

### Mobile/Tablet View (<1024px)

- Bottom navigation bar with 6 menu items
- Floating theme toggle button (bottom-right)
- Compact layout optimized for touch
- Grid-based traffic stats

## 🎨 Color Scheme

### Harmonized Blue-Purple Palette

- **Primary**: Blue (`hsl(220 91% 60%)`)
- **Secondary**: Purple (`hsl(262 83% 70%)`)
- **Accent**: Sky Blue (`hsl(199 89% 62%)`)
- **No Gradients**: Clean, solid colors throughout
- **Dark Mode**: Deep dark background with blue undertones
- **Light Mode**: Warm, harmonized with dark mode palette

## 📂 Project Structure

```
deboard/
├── src/
│   ├── api/
│   │   ├── config.ts              # Dynamic API configuration
│   │   ├── proxies.ts             # Proxies API
│   │   ├── traffic.ts             # Traffic WebSocket
│   │   ├── memory.ts              # Memory WebSocket
│   │   ├── connections.ts         # Connections WebSocket
│   │   ├── rules.ts               # Rules API
│   │   └── logs.ts                # Logs WebSocket
│   ├── components/
│   │   ├── Root.tsx               # Main router with route protection
│   │   ├── Login.tsx              # Login page (yacd-style)
│   │   ├── SideBar.tsx            # Desktop sidebar with logout
│   │   ├── BottomNav.tsx          # Mobile bottom navigation
│   │   ├── FloatingThemeToggle.tsx
│   │   ├── Home.tsx               # Overview dashboard
│   │   ├── Proxies.tsx            # Proxy management
│   │   ├── Rules.tsx              # Rules with tabs
│   │   ├── Connections.tsx        # Connections with pagination
│   │   ├── Config.tsx             # System config
│   │   ├── Logs.tsx               # Log viewer
│   │   ├── TrafficNow.tsx         # Traffic stats cards
│   │   ├── TrafficChart.tsx       # Chart.js traffic chart
│   │   ├── theme-provider.tsx     # Theme context
│   │   ├── theme-toggle.tsx       # Theme switch
│   │   ├── language-switcher.tsx  # Language cycling button
│   │   └── ui/                    # shadcn/ui components
│   ├── contexts/
│   │   ├── ApiConfigContext.tsx       # API config provider
│   │   └── ApiConfigContext.types.ts  # Context types
│   ├── hooks/
│   │   ├── use-theme.ts           # Theme hook
│   │   └── useApiConfig.ts        # API config hook
│   ├── i18n/
│   │   ├── config.ts              # i18next setup
│   │   └── locales/
│   │       ├── en.json            # English translations
│   │       ├── id.json            # Indonesian translations
│   │       └── zh.json            # Chinese translations
│   ├── lib/
│   │   └── utils.ts               # Utility functions
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   ├── logo.svg                   # Custom network topology logo
│   └── favicon.svg
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🔧 Configuration

### API Configuration

No hardcoded server addresses! Configure via login page:

- Supports any Clash/Mihomo server
- Stored securely in localStorage
- Easy logout and server switching

### Environment Variables

Optional `.env` file support:

```env
VITE_DEFAULT_API_URL=http://127.0.0.1:9090
```

### Tailwind Config

Custom HSL color system for easy theming.

### Vite Config

- Path alias: `@/` → `./src/`
- Optimized build with code splitting

## 📊 API Endpoints Used

Based on Clash/Mihomo REST API:

| Endpoint               | Method    | Description                            |
| ---------------------- | --------- | -------------------------------------- |
| `/version`             | GET       | Get version info (used for login test) |
| `/configs`             | GET/PATCH | Get/Update configuration               |
| `/proxies`             | GET       | List all proxy groups                  |
| `/proxies/:name`       | GET       | Get proxy group details                |
| `/proxies/:name`       | PUT       | Select proxy in group                  |
| `/proxies/:name/delay` | GET       | Test proxy delay                       |
| `/rules`               | GET       | List routing rules                     |
| `/providers/rules`     | GET       | List rule providers                    |
| `/connections`         | GET       | Get active connections                 |
| `/traffic`             | WebSocket | Real-time traffic stream               |
| `/memory`              | WebSocket | Real-time memory usage                 |
| `/logs`                | WebSocket | Real-time log stream                   |
| `/restart`             | POST      | Restart Clash core                     |
| `/upgrade`             | POST      | Upgrade Clash core                     |

## 🌍 Multi-Language

Supports 3 languages out of the box:

| Language   | Code | Status      |
| ---------- | ---- | ----------- |
| English    | en   | ✅ Complete |
| Indonesian | id   | ✅ Complete |
| Chinese    | zh   | ✅ Complete |

Add more languages by creating translation files in `src/i18n/locales/`.

## 🎯 Features Checklist

- [x] Login/Authentication system
- [x] Dynamic API configuration
- [x] Route protection
- [x] Multi-language support (EN, ID, ZH)
- [x] Real-time WebSocket connections
- [x] Dark/Light theme with harmonized colors
- [x] Overview dashboard with 6 metrics
- [x] Traffic & Memory charts
- [x] Proxies management with groups
- [x] Rules page with tabs (Rules & Providers)
- [x] Connections with pagination
- [x] Config page (version, restart, upgrade)
- [x] Real-time logs viewer
- [x] Toast notifications system-wide
- [x] Responsive design (mobile & desktop)
- [x] Logout functionality
- [x] Custom SVG logo
- [ ] Settings page for editing server config
- [ ] Multiple server profiles
- [ ] Connection status indicator
- [ ] Export/Import configuration

## 🐛 Troubleshooting

### Cannot Connect to Server

1. Verify Clash/Mihomo is running
2. Check external controller is enabled in Clash config
3. Verify hostname and port are correct
4. If using secret, ensure it matches your Clash config

### WebSocket Connection Issues

- Ensure your Clash version supports WebSocket endpoints
- Check firewall settings
- Verify CORS is properly configured on server

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Clear Vite cache
rm -rf .vite
pnpm dev
```

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

**Brilliant**

- GitHub: [@brillianjs](https://github.com/brillianjs)

Built with ❤️ using modern web technologies

## 🙏 Acknowledgments

- Inspired by [yacd](https://github.com/haishanh/yacd)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

---

**Note**: This dashboard is designed to work with Clash/Mihomo API. Ensure you have a running instance before using the application.
