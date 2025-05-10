# 🛋️ Desk Sarthi - Smart Home & Desk Automation System [![Live Demo](https://img.shields.io/badge/demo-live-green?style=for-the-badge)](https://home.ramankumar.me)

**Desk Sarthi** is a smart IoT + AI-based automation system built using **ESP32**, **MERN stack**, and **LLMs**. It brings intelligent control to your home or workspace with features like real-time device switching, weather monitoring, music playback, RGB control, analytics, and AI assistant support.

---

## 🚀 Features

- **🔌 Switch Control with Real-time Sync**  
  Control appliances using ESP32 relays with real-time state updates across all devices using **Socket.io**.

- **🌦️ Weather Monitoring**  
  - **Outdoor**: Fetched from **OpenWeather API**  
  - **Indoor**: Real-time readings from **DHT11 sensor** (temperature & humidity)

- **🎵 Spotify Integration**  
  Play and control music using **Spotify Web Playback SDK** right from your smart desk.

- **🌈 RGB Light Control**  
  Full color control of connected RGB lights via the dashboard.

- **📊 Temperature & Humidity Analytics**  
  View indoor environment data over:
  - Last 1 Hour
  - Last 1 Day
  - Last 7 Days  
  Displayed using charts.

- **🧠 AI Assistant**  
  Use natural language commands to:
  - Control switches
  - Get weather details  
  Powered by **MCP server** + LLM integration.

---

## 🛠️ Technologies Used

### Frontend
- React (TypeScript)
- Tailwind CSS
- ShadCN UI
- Framer Motion
- Socket.io Client
- Vite + PWA
- Spotify Web Playback SDK

### Backend
- Node.js + Express
- PostgreSQL (Supabase)
- Drizzle ORM
- Zod for validation
- Socket.io Server
- Spotify Web API SDK
- MQTT Protocol

### Hardware
- ESP32 (Arduino IDE 2)
- DHT11 Sensor (Temperature + Humidity)
- 4-Channel Relay Module
- MQTT via HiveMQ

### Deployment
- **Client**: Vercel  
- **Server**: AWS EC2  
- **MQTT Broker**: HiveMQ

---

