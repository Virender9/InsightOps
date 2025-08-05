# 🚀 InsightOps Analytics Dashboard

A **high-grade, industry-standard** operational intelligence and system monitoring dashboard built with modern web technologies. This enterprise-level application provides real-time analytics, advanced visualizations, and comprehensive incident management capabilities.

![InsightOps Dashboard](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-FFC107?style=for-the-badge&logo=vue.js&logoColor=black)

## ✨ Features

### 🎯 **Command Center Dashboard**
- **Real-time System Health Score** with live performance indicators
- **Advanced KPI Cards** with gradient backgrounds and hover animations
- **Live Status Indicators** showing system status and data points
- **Performance Gauges** with color-coded thresholds (CPU, Memory, Disk I/O, Latency)
- **Historical Trend Analysis** with interactive time-series charts

### 📊 **Advanced Analytics**
- **Interactive Time-Series Charts** for CPU, Memory, and Latency trends
- **Performance Trend Analysis** (Optimal/Stable/Degrading detection)
- **Auto-refresh capabilities** (30-second intervals) with visual indicators
- **Historical data visualization** with Chart.js integration
- **System performance insights** with statistical analysis

### 🔧 **Incident Management**
- **Advanced Search & Filtering** with real-time search capabilities
- **Multi-criteria filtering** (Priority, Category, Date range)
- **Incident Analytics** with priority distribution and category breakdown
- **Resolution time tracking** and trend analysis
- **Interactive incident details** with modal views
- **Priority-based visual indicators** (Critical, High, Medium, Low)

### 🎨 **Modern UI/UX**
- **Glassmorphism design** with blur effects and modern gradients
- **Responsive design** optimized for all screen sizes
- **Smooth animations** and micro-interactions
- **Professional color schemes** with industry-standard styling
- **Hover effects** and interactive elements throughout
- **Loading states** and error handling with user-friendly messages

## 🛠️ Technology Stack

### **Frontend**
- **Vue 3** - Progressive JavaScript framework with Composition API
- **Vite** - Next-generation frontend build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Pinia** - State management for Vue.js
- **Chart.js & vue-chartjs** - Interactive data visualizations
- **Lucide Vue** - Beautiful SVG icons
- **Axios** - HTTP client for API communication

### **Data & APIs**
- **Mockfast.io APIs** - External mock APIs for production deployment
- **JSON Server** - Local development API server
- **Embedded fallback data** - Reliable demo data for deployment

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Virender9/InsightOps.git
   cd InsightOps
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **For local development with mock API (optional)**
   ```bash
   # In a separate terminal
   npm run mock-api
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

### 🏗️ Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## 📡 API Configuration

The application is configured to work in multiple environments:

### **Production (Deployed)**
- Uses Mockfast.io APIs for reliable external data
- Incidents API: `https://mockfast.io/backend/apitemplate/get/KV4AYFMWAF`
- Metrics API: `https://mockfast.io/backend/apitemplate/get/8BE4BTI4RW`

## Key Components

### InsightOps Enhanced Dashboard 

A comprehensive, AI-powered operational intelligence platform for real-time monitoring, anomaly detection, and automated root cause analysis.

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-green?style=for-the-badge)
![Vue.js](https://img.shields.io/badge/Vue.js-3.4-4FC08D?style=for-the-badge&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss)

## Project Overview
### Real-Time API Integration (Ready for Activation)
- **Helix Console API** integration for temperature and server alerts
- **Swift Console API** integration for network monitoring
- Seamless fallback to mock data during development
- Environment-based configuration switching

### Mock Data Infrastructure
- Comprehensive mock datasets for all dashboard components
- Realistic alert patterns and metric simulations
- RCA flow mockups with timeline data
- Temperature monitoring simulations

### ML-Based Anomaly Detection
- **Isolation Forest** algorithm for outlier detection
- **LSTM Autoencoder** for time-series anomaly detection
- **Statistical Z-Score** analysis for threshold violations
- Real-time anomaly correlation and clustering

### AI-Generated RCA Summaries
- **Azure OpenAI GPT-4** integration (ready for API key)
- Automated incident analysis and root cause identification
- Natural language summaries of complex technical issues
- Confidence scoring and recommendation generation

### Modular Vue Components
- `<AlertPanel />` - Categorized real-time alerts with filtering
- `<MetricsPanel />` - System performance visualization
- `<RCASummary />` - AI-powered root cause analysis flows
- `<FridgeMonitor />` - Temperature monitoring with trend analysis

### Production-Ready Deployment
- Docker containerization with multi-stage builds
- Nginx reverse proxy configuration
- Environment variable injection
- Health checks and monitoring setup

## Tech Stack

### Core Framework
- **Vue 3** with Composition API
- **Pinia** for state management
- **Vue Router** for navigation
- **Tailwind CSS** for styling

### Data Visualization
- **Chart.js** with **vue-chartjs**
- **Lucide Vue Next** icons
- Real-time data streaming

### API & Backend Integration
- **Axios** for HTTP requests
- **JSON Server** for mock API
- **WebSocket** support (ready)
- API service abstraction layer

### AI & ML Integration
- **Azure OpenAI** API integration
- **Python ML Backend** support (FastAPI/Flask)
- **WebAssembly** ML models (planned)

### DevOps & Deployment
- **Docker** & **Docker Compose**
- **Nginx** reverse proxy
- **Multi-stage builds** for optimization
- **Environment configuration** management

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Docker (optional, for containerized deployment)
- npm or yarn

### Development Setup

1. **Clone and Install**:
```bash
git clone <repository-url>
cd insightops
npm install
```

2. **Start Enhanced Development Environment**:
```bash
npm run dev:enhanced
```
This starts both the mock API server and Vue development server.

3. **Access the Enhanced Dashboard**:
- Main Dashboard: `http://localhost:5173`
- Enhanced Dashboard: `http://localhost:5173/enhanced`
- Mock API: `http://localhost:4000`

### Docker Deployment

1. **Build and Start**:
```bash
npm run start:docker
```

2. **Access Services**:
- Dashboard: `http://localhost:3000`
- Enhanced Dashboard: `http://localhost:3000/enhanced`
- Mock API: `http://localhost:4000`

3. **View Logs**:
```bash
npm run logs:docker
```

## Project Structure

```
insightops/
├── src/
│   ├── components/          # Enhanced Vue components
│   │   ├── AlertPanel.vue   # Real-time alert management
│   │   ├── MetricsPanel.vue # System metrics visualization
│   │   ├── RCASummary.vue   # AI-powered RCA flows
│   │   └── FridgeMonitor.vue # Temperature monitoring
│   ├── stores/              # Pinia state management
│   │   ├── alerts.js        # Alert management store
│   │   ├── metrics.js       # Metrics data store
│   │   ├── rca.js           # RCA workflow store
│   │   ├── temperature.js   # Temperature monitoring store
│   │   ├── anomaly.js       # ML anomaly detection store
│   │   └── ai.js            # AI/LLM integration store
│   ├── services/            # API integration layer
│   │   └── apiService.js    # Unified API service
│   └── views/
│       └── EnhancedDashboard.vue # Main enhanced dashboard
├── docker-compose.yml       # Multi-service deployment
├── Dockerfile              # Production-ready container
├── nginx.conf              # Nginx reverse proxy config
└── .env.example            # Environment configuration template
```

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# API Configuration
VUE_APP_USE_MOCK_DATA=true

# Real API Integration (Uncomment when ready)
# VUE_APP_HELIX_API_URL=https://helix-console-api.example.com
# VUE_APP_HELIX_API_KEY=your_api_key_here
# VUE_APP_SWIFT_API_URL=https://swift-console-api.example.com
# VUE_APP_SWIFT_API_KEY=your_api_key_here

# AI Integration
# VUE_APP_AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
# VUE_APP_AZURE_OPENAI_KEY=your_azure_openai_key_here

# ML Backend
# VUE_APP_ML_BACKEND_URL=http://localhost:8000
# VUE_APP_ML_API_KEY=your_ml_api_key_here
```

### Feature Toggles

```env
# Enable/Disable Features
VUE_APP_ENABLE_AI_FEATURES=true
VUE_APP_ENABLE_ML_DETECTION=true
VUE_APP_ENABLE_REAL_TIME_UPDATES=true
VUE_APP_ENABLE_TEMPERATURE_MONITORING=true
```

## API Integration Guide

### Switching from Mock to Real APIs

1. **Configure Environment Variables**:
   - Set `VUE_APP_USE_MOCK_DATA=false`
   - Add real API endpoints and keys

2. **Uncomment API Integration Code**:
   - In `src/services/apiService.js`
   - In respective Pinia stores

3. **Update Data Normalization**:
   - Implement `normalizeHelixAlerts()` and `normalizeSwiftAlerts()`
   - Adjust data mapping for your API response formats

### ML Backend Integration

1. **Python Backend Setup** (separate repository):
```python
# Example FastAPI structure
from fastapi import FastAPI
from sklearn.ensemble import IsolationForest

app = FastAPI()

@app.post("/api/v1/detect")
async def detect_anomalies(metrics_data):
    # Your ML anomaly detection logic
    pass
```

2. **Enable ML Features**:
   - Uncomment ML API calls in `anomaly.js`
   - Configure ML backend URL

### Azure OpenAI Integration

1. **Get Azure OpenAI Credentials**:
   - Create Azure OpenAI resource
   - Deploy GPT-4 model
   - Get endpoint and API key

2. **Enable AI Features**:
   - Configure environment variables
   - Uncomment AI API calls in `ai.js`

## Dashboard Features

### Enhanced Overview Tab
- **Quick Stats Bar**: Critical metrics at a glance
- **Real-time Alerts**: Categorized with severity indicators
- **System Metrics**: Live performance charts
- **Health Indicators**: Overall system status

### Alert Management
- **Multi-source Integration**: Helix + Swift Console APIs
- **Smart Filtering**: By type, severity, status, source
- **Real-time Updates**: WebSocket-based notifications
- **Correlation Analysis**: Related alert detection

### AI Analytics
- **Automated RCA**: GPT-4 powered root cause analysis
- **Predictive Insights**: Trend-based failure prediction
- **Natural Language Summaries**: Technical issue explanations
- **Confidence Scoring**: AI reliability indicators

### ML Anomaly Detection
- **Multiple Algorithms**: Isolation Forest, LSTM, Z-Score
- **Real-time Processing**: Continuous monitoring
- **Anomaly Correlation**: Pattern recognition across metrics
- **Performance Tuning**: Model accuracy optimization

### Temperature Monitoring
- **Multi-unit Tracking**: Comprehensive fridge monitoring
- **Trend Analysis**: Historical temperature patterns
- **Alert Thresholds**: Configurable warning/critical levels
- **Predictive Maintenance**: Anomaly-based scheduling

## Available Scripts

```bash
# Development
npm run dev                 # Start Vue dev server
npm run dev:enhanced        # Start Vue + Mock API
npm run mock-api           # Start JSON server only

# Production Build
npm run build              # Standard build
npm run build:production   # Optimized production build
npm run preview            # Preview production build

# Docker Operations
npm run build:docker       # Build Docker image
npm run start:docker       # Start with docker-compose
npm run stop:docker        # Stop docker services
npm run logs:docker        # View container logs

# Quality Assurance
npm run lint               # ESLint with auto-fix
npm run format             # Prettier formatting
npm run test:api           # Test mock API health
```

## Docker Deployment

### Single Command Deployment
```bash
docker-compose up -d
```

### Services Included
- **InsightOps Dashboard**: Main application (port 3000)
- **Mock API Server**: JSON Server for development (port 4000)
- **Redis**: Caching and session management (port 6379)

### Production Considerations
- Multi-stage Docker builds for optimization
- Nginx reverse proxy with security headers
- Health checks and restart policies
- Volume persistence for data

## Roadmap & TODOs

### Phase 1: API Integration 
- [x] Mock data infrastructure
- [x] API service abstraction
- [x] Environment configuration
- [ ] Real API endpoint integration

### Phase 2: AI Enhancement 
- [x] Azure OpenAI integration setup
- [x] RCA summary generation
- [ ] Fine-tuned models for IT operations
- [ ] Multi-language LLM support

### Phase 3: ML Implementation 
- [x] Anomaly detection algorithms
- [x] Pattern recognition setup
- [ ] Python ML backend deployment
- [ ] WebAssembly ML models

### Phase 4: Advanced Features 
- [ ] Real-time WebSocket integration
- [ ] Advanced correlation analysis
- [ ] Predictive maintenance scheduling
- [ ] Mobile app development

## Contributing

1. **Fork** the repository
2. **Create** feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines
- Follow Vue 3 Composition API patterns
- Use TypeScript for new components (when applicable)
- Maintain test coverage above 80%
- Document all public APIs
- Follow conventional commit messages

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, questions, or feature requests:
- Email: support@insightops.dev
- Issues: [GitHub Issues](https://github.com/your-repo/insightops/issues)
- Discussions: [GitHub Discussions](https://github.com/your-repo/insightops/discussions)
- Documentation: [Wiki](https://github.com/your-repo/insightops/wiki)
- Chart.js for powerful data visualizations
- Mockfast.io for reliable mock API services

---

<div align="center">
  <strong>⭐ Star this repository if you found it useful! ⭐</strong>
</div>
