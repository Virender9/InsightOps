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

### **Local Development**
- Can use local JSON server on `http://localhost:4000`
- Falls back to embedded demo data if APIs are unavailable

## 🎯 Key Components

### **Dashboard Views**
- **HomeView** - Command center with comprehensive analytics
- **HealthView** - System performance monitoring with gauges and charts
- **IncidentsView** - Advanced incident management and analytics
- **ReportsView** - Detailed reporting capabilities

### **Reusable Components**
- **PerformanceGauge** - Circular progress indicators with thresholds
- **TimeSeriesChart** - Interactive historical trend charts
- **IncidentDetailsModal** - Detailed incident information display
- **Advanced search and filtering components**

## 📊 Data Models

### **Incidents**
```json
{
  "id": "string",
  "title": "string",
  "category": "Network|Database|API|Security",
  "priority": "Critical|High|Medium|Low",
  "resolutionTime": "number (hours)",
  "description": "string",
  "createdAt": "ISO 8601 timestamp"
}
```

### **System Metrics**
```json
{
  "id": "string",
  "cpuUsage": "number (percentage)",
  "memoryUsage": "number (percentage)", 
  "diskIO": "number (MB/s)",
  "latency": "number (milliseconds)",
  "timestamp": "ISO 8601 timestamp"
}
```

## 🎨 Design System

### **Color Palette**
- **Primary**: Blue gradients (#3b82f6 to #1d4ed8)
- **Success**: Green gradients (#10b981 to #059669)
- **Warning**: Orange gradients (#f59e0b to #d97706)
- **Danger**: Red gradients (#ef4444 to #dc2626)
- **Neutral**: Gray scales for text and backgrounds

### **Typography**
- **Primary Font**: System fonts optimized for readability
- **Headings**: Bold weights with appropriate sizing scale
- **Body Text**: Optimized line heights and letter spacing

## 🔮 Future Enhancements

- **Real-time WebSocket integration** for live data updates
- **Advanced AI-powered root cause analysis**
- **Custom dashboard layouts** with drag-and-drop widgets
- **Multi-tenant support** with role-based access control
- **Mobile application** for on-the-go monitoring
- **Integration with popular monitoring tools** (Grafana, Prometheus, etc.)

## 📱 Screenshots

*Dashboard will be live at deployment URL*

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Virender Singh**
- GitHub: [@Virender9](https://github.com/Virender9)
- LinkedIn: [Connect with me](https://linkedin.com/in/virender-singh)

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Tailwind CSS for the utility-first approach
- Chart.js for powerful data visualizations
- Mockfast.io for reliable mock API services

---

<div align="center">
  <strong>⭐ Star this repository if you found it useful! ⭐</strong>
</div>
