# River Monitoring System

A Smart City Environmental Monitoring Platform designed to monitor river pollution in real-time using sensors, citizen reports, and AI-based analysis.

This system provides a government dashboard, citizen complaint system, live analytics, and heatmap visualization, making it suitable for smart city deployments and environmental governance.

---

## Features

### Government Dashboard

* Real-time monitoring of river conditions
* Sensor data tracking (pH, turbidity, dissolved oxygen)
* Pollution alerts with severity levels
* Live charts for environmental analysis

### Interactive Map

* Built using Leaflet.js (OpenStreetMap)
* Pollution markers (Critical / Warning / Safe)
* Heatmap visualization for pollution hotspots

### Citizen Complaint System

* Submit complaints with:

  * Name and phone number
  * Description of issue
  * Location
  * Image or video upload
* Complaint status tracking (Pending / Verified / Resolved)

### Real-Time Analytics

* Dynamic charts using Chart.js
* Live updating environmental data
* Pollution trend visualization

### AI Prediction

* Rule-based classification of pollution risk:

  * High Risk
  * Moderate
  * Safe

---

## Tech Stack

### Frontend

* HTML, CSS, JavaScript
* Chart.js for data visualization
* Leaflet.js for maps and heatmaps

### Backend

* FastAPI (Python)
* SQLAlchemy (ORM)
* SQLite database

### Deployment

* Backend: Render
* Frontend: Static hosting (Vercel or browser)

---

## Project Structure

```
river-monitoring-system/
│
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── schemas.py
│   ├── routes/
│   │     ├── sensors.py
│   │     ├── complaints.py
│   │     ├── alerts.py
│   │     └── analytics.py
│   └── uploads/
│
├── frontend/
│   ├── index.html
│   ├── complaints.html
│   ├── css/
│   └── js/
│
└── requirements.txt
```

---

## Installation and Setup

### 1. Clone Repository

```
git clone https://github.com/YOUR_USERNAME/river-monitoring-system.git
cd river-monitoring-system
```

---

### 2. Backend Setup

```
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

Backend will run at:

```
http://127.0.0.1:8000
```

API documentation:

```
http://127.0.0.1:8000/docs
```

---

### 3. Frontend Setup

Open:

```
frontend/index.html
```

Or use a local server (recommended).

---

## Deployment (Render)

Backend configuration:

* Root Directory: backend
* Build Command: pip install -r requirements.txt
* Start Command: python -m uvicorn main:app --host 0.0.0.0 --port $PORT

---

## Use Cases

* Smart city environmental monitoring
* Government pollution control systems
* Citizen reporting platforms
* Water quality management systems

---

## Future Enhancements

* Integration with IoT sensors for real-time data
* Machine learning-based prediction models
* Role-based authentication system
* Notification system (SMS or email alerts)
* Cloud database (PostgreSQL)

---

## Authors

* Lalit Kumar
* Devraj Singh

---

## License

This project is open-source and available under the MIT License.
