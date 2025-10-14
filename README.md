# Deboard# React + TypeScript + Vite

A modern, responsive network management dashboard built with React, TypeScript, and Tailwind CSS. Inspired by yacd (Yet Another Clash Dashboard) with a beautiful teal and pink color scheme.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## 🎨 FeaturesCurrently, two official plugins are available:

- **Modern UI/UX**: Clean interface with smooth animations and transitions- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- **Fully Responsive**: - [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

  - Desktop (≥1024px): Traditional sidebar navigation

  - Mobile/Tablet (<1024px): Bottom navigation bar for better thumb accessibility## React Compiler

- **Dark/Light Mode**: Theme toggle with system preference support

- **Real-time Traffic Monitoring**: The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

  - Live upload/download speed display

  - Traffic statistics cards## Expanding the ESLint configuration

  - Interactive Chart.js powered traffic chart

- **Network Management**:If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

  - Overview dashboard

  - Proxies management```js

  - Rules configurationexport default defineConfig([

  - Active connections monitoring globalIgnores(['dist']),

  - Configuration settings {

  - Logs viewer files: ['**/*.{ts,tsx}'],

    extends: [

## 🛠️ Tech Stack // Other configs...

- **Framework**: React 19.1.1 // Remove tseslint.configs.recommended and replace with this

- **Language**: TypeScript tseslint.configs.recommendedTypeChecked,

- **Build Tool**: Vite 7.1.9 // Alternatively, use this for stricter rules

- **Styling**: tseslint.configs.strictTypeChecked,

  - Tailwind CSS 3.4.17 // Optionally, add this for stylistic rules

  - shadcn/ui components tseslint.configs.stylisticTypeChecked,

- **Routing**: React Router DOM 7.9.4

- **Charts**: Chart.js + react-chartjs-2 // Other configs...

- **Icons**: Lucide React ],

- **State Management**: React Context API languageOptions: {

      parserOptions: {

## 🚀 Getting Started project: ['./tsconfig.node.json', './tsconfig.app.json'],

        tsconfigRootDir: import.meta.dirname,

### Prerequisites },

      // other options...

- Node.js 24.6.0 or higher },

- pnpm (recommended) or npm },

])

### Installation```

````bashYou can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

# Clone the repository

git clone <repository-url>```js

// eslint.config.js

# Navigate to project directoryimport reactX from 'eslint-plugin-react-x'

cd deboardimport reactDom from 'eslint-plugin-react-dom'



# Install dependenciesexport default defineConfig([

pnpm install  globalIgnores(['dist']),

  {

# Start development server    files: ['**/*.{ts,tsx}'],

pnpm dev    extends: [

```      // Other configs...

      // Enable lint rules for React

The application will be available at `http://localhost:5173`      reactX.configs['recommended-typescript'],

      // Enable lint rules for React DOM

### Build for Production      reactDom.configs.recommended,

    ],

```bash    languageOptions: {

pnpm build      parserOptions: {

```        project: ['./tsconfig.node.json', './tsconfig.app.json'],

        tsconfigRootDir: import.meta.dirname,

## 📱 Responsive Design      },

      // other options...

### Desktop View (≥1024px)    },

- Fixed sidebar navigation on the left  },

- Theme toggle integrated in sidebar])

- Spacious layout with optimal spacing```


### Mobile/Tablet View (<1024px)
- Bottom navigation bar with 6 menu items
- Floating theme toggle button (bottom-right)
- Compact layout optimized for touch
- Grid-based traffic stats (2-3-5 columns adaptive)

## 🎨 Color Theme

- **Primary**: Teal (`hsl(175 60% 50%)` / `rgb(94, 234, 212)`)
- **Secondary**: Pink/Rose (`hsl(340 82% 67%)` / `rgb(251, 113, 133)`)
- **No Gradients**: Clean solid colors throughout
- **Dark Mode**: Deep dark background with teal undertones
- **Light Mode**: Warm backgrounds with subtle peach tint

## 📂 Project Structure

````

deboard/
├── src/
│ ├── components/
│ │ ├── Root.tsx # Main router & layout
│ │ ├── SideBar.tsx # Desktop sidebar navigation
│ │ ├── BottomNav.tsx # Mobile bottom navigation
│ │ ├── FloatingThemeToggle.tsx # Mobile theme toggle
│ │ ├── Home.tsx # Overview page
│ │ ├── TrafficNow.tsx # Traffic stats cards
│ │ ├── TrafficChart.tsx # Chart.js traffic chart
│ │ ├── theme-provider.tsx # Theme context provider
│ │ ├── theme-toggle.tsx # Theme toggle component
│ │ └── ui/ # shadcn/ui components
│ │ ├── card.tsx
│ │ └── button.tsx
│ ├── hooks/
│ │ └── use-theme.ts # Theme hook
│ ├── lib/
│ │ └── utils.ts # Utility functions
│ ├── App.tsx
│ ├── main.tsx
│ └── index.css
├── public/
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md

```

## 🔧 Configuration

### Tailwind Config
Custom color system using HSL variables for easy theme customization.

### Vite Config
Path alias configured: `@/` points to `./src/`

### TypeScript
Strict mode enabled with React 19 types.

## 📊 Components Overview

### TrafficNow
Displays 5 real-time metrics:
- Upload Speed
- Download Speed
- Upload Total
- Download Total
- Active Connections

### TrafficChart
Professional line chart with:
- Dual datasets (Upload/Download)
- Smooth curves with fill
- Responsive aspect ratio
- Formatted tooltips
- Y-axis with byte formatting

### SideBar (Desktop)
- Logo with brand identity
- 6 navigation items
- Theme toggle
- Version display

### BottomNav (Mobile)
- 6 icon+label navigation items
- Active state indicators
- Touch-optimized spacing
- Fixed bottom positioning

## 🎯 Roadmap

- [ ] Connect to real Clash/Mihomo API
- [ ] Implement WebSocket for real-time updates
- [ ] Add Proxies page with proxy list and selection
- [ ] Build Rules page with routing rules table
- [ ] Create Connections page with active connection list
- [ ] Complete Config page with settings forms
- [ ] Finish Logs page with log viewer
- [ ] Add authentication support
- [ ] Implement data persistence
- [ ] Add export/import configuration

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built with ❤️ using modern web technologies

---

**Note**: This is a frontend-only dashboard. Backend integration with Clash/Mihomo API is required for full functionality.
```
