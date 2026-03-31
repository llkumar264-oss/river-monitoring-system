/* =============================================
   live.js — Live Monitoring sensor grid
   ============================================= */

const LIVE_SENSORS = [
  { id: 1, location: "Sector 12 - Point A",   ph: 7.2, turbidity: 12, do: 8.5, temperature: 24, status: "Online" },
  { id: 2, location: "Sector 8 - Bridge",      ph: 7.8, turbidity: 28, do: 6.2, temperature: 26, status: "Online" },
  { id: 3, location: "Sector 15 - Industrial", ph: 9.2, turbidity: 45, do: 3.1, temperature: 28, status: "Warning" },
  { id: 4, location: "Sector 3 - Residential", ph: 7.1, turbidity: 15, do: 8.2, temperature: 23, status: "Online" },
  { id: 5, location: "Sector 20 - Downstream", ph: 7.6, turbidity: 32, do: 5.8, temperature: 25, status: "Warning" },
  { id: 6, location: "Sector 5 - Park Area",   ph: 7.3, turbidity: 18, do: 8.0, temperature: 24, status: "Online" },
];

function phClass(ph) {
  if (ph > 8.5 || ph < 6.0) return "critical";
  if (ph > 7.5 || ph < 6.5) return "warning";
  return "safe";
}
function turbClass(t) { return t > 40 ? "critical" : t > 25 ? "warning" : "safe"; }
function doClass(d)   { return d < 4  ? "critical" : d < 6  ? "warning" : "safe"; }
function statusClass(s) { return s === "Online" ? "online" : s === "Warning" ? "warning" : "critical"; }

function renderSensors(sensors) {
  const grid = document.getElementById("sensorsGrid");
  grid.innerHTML = "";

  sensors.forEach((s, idx) => {
    const card  = document.createElement("div");
    card.className = "sensor-card";
    card.id = `sensor-card-${s.id || idx}`;

    card.innerHTML = `
      <div class="sensor-card-header">
        <div class="sensor-name">${s.location}</div>
        <div class="sensor-icon">〜</div>
      </div>
      <div class="status-dot ${statusClass(s.status)}">${s.status}</div>
      <div class="sensor-sparkline">
        <canvas id="spark-${s.id || idx}" height="36"></canvas>
      </div>
      <div class="sensor-metrics">
        <div class="metric-box">
          <div class="metric-label">pH Level</div>
          <div class="metric-value ${phClass(s.ph)}">${s.ph}<span class="unit"></span></div>
        </div>
        <div class="metric-box">
          <div class="metric-label">Turbidity</div>
          <div class="metric-value ${turbClass(s.turbidity)}">${s.turbidity}<span class="unit">NTU</span></div>
        </div>
        <div class="metric-box">
          <div class="metric-label">DO</div>
          <div class="metric-value ${doClass(s.do)}">${s.do}<span class="unit">mg/L</span></div>
        </div>
        <div class="metric-box">
          <div class="metric-label">Temp</div>
          <div class="metric-value neutral">${s.temperature}<span class="unit">°C</span></div>
        </div>
      </div>
    `;
    grid.appendChild(card);

    // Sparkline chart
    setTimeout(() => {
      const ctx = document.getElementById(`spark-${s.id || idx}`);
      if (!ctx) return;
      const sparkData = Array.from({ length: 10 }, () =>
        parseFloat((s.ph + (Math.random() * 0.4 - 0.2)).toFixed(2))
      );
      new Chart(ctx, {
        type: "line",
        data: {
          labels: Array(10).fill(""),
          datasets: [{
            data: sparkData,
            borderColor: s.status === "Online" ? "#3b82f6" : s.status === "Warning" ? "#f59e0b" : "#ef4444",
            borderWidth: 1.8,
            fill: false,
            pointRadius: 0,
            tension: 0.4,
          }]
        },
        options: {
          responsive: true,
          animation: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: { x: { display: false }, y: { display: false } }
        }
      });
    }, 50);
  });
}

async function loadLiveSensors() {
  let sensors = LIVE_SENSORS;
  try {
    const res = await fetch(`${API}/sensors/`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) sensors = data;
  } catch (_) {}
  renderSensors(sensors);
}

// Live update every 10 seconds
loadLiveSensors();
setInterval(loadLiveSensors, 10000);
