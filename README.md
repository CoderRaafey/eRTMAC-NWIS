# 🛢️ eRTMAC-NWIS (Nearby Wells Intelligence System)
**Smart India Hackathon 2026 | Problem Statement 121 (Oil India Limited)**  
**Team:** Craft Coders (#150072)

## 📌 The Problem: "Blind Drilling"
When drilling new offshore or onshore wells, encountering sudden high-pressure zones or unstable rock causes severe equipment damage and millions in Non-Productive Time (NPT). Historical hazard data exists in neighboring offset wells, but it is buried inside unstructured PDF reports (WCRs, DDRs).

## 🚀 Our Solution
eRTMAC-NWIS is a proactive intelligence platform that acts as a real-time GPS hazard warning system for drilling operations. 

### Core Features:
- **Live Depth Telemetry Simulator:** Tracks the active drill bit and issues proximity warnings based on historical offset disasters.
- **RAG-Powered Drill-Site Copilot:** An AI chatbot that instantly retrieves mitigation strategies from historical unstructured drilling reports.
- **3D Subsurface Trajectories:** Visualizes underground well paths and Anti-Collision clearance using `react-plotly.js`.
- **Financial NPT Quantification:** Translates abstract risk percentages into hard financial exposure metrics (₹).
- **Automated Pre-Spud Reports:** Instantly generates and exports PDF hazard assessments.

## 🛠️ Tech Stack
- **Frontend:** React + Vite, Tailwind CSS, Recharts, Leaflet/Mapbox, Lucide-React.
- **Backend:** Python, FastAPI, SQLAlchemy.
- **Database:** PostgreSQL + PostGIS (Geospatial querying).
- **AI/NLP:** Tesseract OCR, spaCy, Retrieval-Augmented Generation (RAG).

## 💻 How to Run Locally
1. Clone the repo: `git clone https://github.com/YOUR_USERNAME/eRTMAC-NWIS.git`
2. Start Backend: `cd backend` -> `python -m uvicorn app.main:app --reload`
3. Start Frontend: `cd frontend` -> `npm install` -> `npm run dev`
