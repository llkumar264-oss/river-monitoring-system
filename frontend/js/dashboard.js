/* =============================================
   dashboard.js — Dashboard data, charts, live update
   ============================================= */

const DEMO_SENSORS = [
  { location: "Sector 12 - Point A", ph: 7.2, turbidity: 12, do: 8.5, temperature: 24, status: "Online" },
  { location: "Sector 8 - Bridge",   ph: 7.8, turbidity: 28, do: 6.2, temperature: 26, status: "Online" },
  { location: "Sector 15 - Industrial", ph: 9.2, turbidity: 45, do: 3.1, temperature: 28, status: "Warning" },
  { location: "Sector 3 - Residential", ph: 7.1, turbidity: 15, do: 8.2, temperature: 23, status: "Online" },
  { location: "Sector 20 - Downstream",  ph: 7.6, turbidity: 32, do: 5.8, temperature: 25, status: "Warning" },
  { location: "Sector 5 - Park Area",    ph: 7.3, turbidity: 18, do: 8.0, temperature: 24, status: "Online" },
];

const DEMO_COMPLAINTS = [
  { id: "RMS-2026-1234", name: "Rajesh Kumar",  severity: "high",   status: "Pending",  location: "Sector 12, River Point A",   description: "Industrial waste being dumped directly into the river. Strong chemical smell and discoloration of water observed.", media: "2 media file(s)" },
  { id: "RMS-2026-1235", name: "Priya Sharma",  severity: "medium", status: "Verified", location: "Sector 8, Bridge Area",       description: "Plastic waste and sewage overflow near residential area. Foul odor affecting nearby homes.", media: "1 media file(s)" },
  { id: "RMS-2026-1236", name: "Amit Patel",    severity: "high",   status: "Resolved", location: "Sector 15, Industrial Zone",  description: "Foam and chemical effluents visible on river surface near the industrial outlet.", media: "3 media file(s)" },
  { id: "RMS-2026-1237", name: "Sunita Devi",   severity: "low",    status: "Pending",  location: "Sector 3, Residential Area", description: "Garbage dumping on the riverbank affects the water quality during monsoon season.", media: "1 media file(s)" },
  { id: "RMS-2026-1238", name: "Vikram Singh",  severity: "medium", status: "Rejected", location: "Sector 20, Downstream",      description: "Unusual color change noticed in river water after heavy rains. Possible contamination from upstream.", media: "0 media file(s)" },
];

const DEMO_ALERTS = [
  { zone: "Sector 15 - Industrial", status: "Critical", ph: 9.2, turbidity: 45, detail: "pH critically high — immediate action required", time: "2 min ago" },
  { zone: "Sector 20 - Downstream", status: "Warning",  ph: 7.6, turbidity: 32, detail: "Turbidity above safe threshold — monitor closely", time: "14 min ago" },
  { zone: "Sector 8 - Bridge Area", status: "Warning",  ph: 7.8, turbidity: 28, detail: "Dissolved oxygen dropping below 6 mg/L",          time: "31 min ago" },
];

// ---- Load Dashboard Stats ----
async function loadStats() {
  let sensors = DEMO_SENSORS;
  let alerts  = DEMO_ALERTS;
  let complaints = DEMO_COMPLAINTS;

  // Try backend, fall back to demo data
  try {
    const [sr, ar, cr] = await Promise.allSettled([
      fetch(`${API}/sensors/`).then(r => r.json()),
      fetch(`${API}/alerts/`).then(r => r.json()),
      fetch(`${API}/complaints/`).then(r => r.json()),
    ]);
    if (sr.status === "fulfilled" && Array.isArray(sr.value) && sr.value.length > 0) sensors = sr.value;
    if (ar.status === "fulfilled" && Array.isArray(ar.value)) alerts = ar.value;
    if (cr.status === "fulfilled" && Array.isArray(cr.value)) complaints = cr.value;
  } catch(_) {}

  const criticalCount = alerts.filter(a => a.status === "Critical").length;

  countUp(document.getElementById("sensorCount"),    sensors.length || 248);
  countUp(document.getElementById("alertCount"),     alerts.length  || 34);
  countUp(document.getElementById("complaintCount"), complaints.length || 127);
  countUp(document.getElementById("criticalCount"),  criticalCount  || 8);
}

// ---- pH Chart ----
function buildPhChart() {
  const labels = ["00:00","04:00","08:00","12:00","16:00","20:00","24:00"];
  const data   = [7.2, 7.5, 6.9, 7.4, 7.3, 7.1, 7.3];

  new Chart(document.getElementById("phChart"), {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "pH Level",
        data,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.08)",
        borderWidth: 2.5,
        pointBackgroundColor: "#3b82f6",
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
      }]
    },
    options: {
      ...chartDefaults(),
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: "rgba(148,163,184,0.12)" }, ticks: { color: "#94a3b8", font: { family: "Inter", size: 11 } } },
        y: { min: 6, max: 8.5, grid: { color: "rgba(148,163,184,0.12)" }, ticks: { color: "#94a3b8", font: { family: "Inter", size: 11 } } }
      }
    }
  });
}

// ---- Turbidity Chart ----
function buildTurbidityChart() {
  const labels = ["00:00","04:00","08:00","12:00","16:00","20:00","24:00"];
  const data   = [14, 12, 28, 22, 18, 15, 13];

  new Chart(document.getElementById("turbidityChart"), {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Turbidity (NTU)",
        data,
        borderColor: "#2dd4bf",
        backgroundColor: "rgba(45,212,191,0.10)",
        borderWidth: 2.5,
        pointBackgroundColor: "#2dd4bf",
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
      }]
    },
    options: {
      ...chartDefaults(),
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: "rgba(148,163,184,0.12)" }, ticks: { color: "#94a3b8", font: { family: "Inter", size: 11 } } },
        y: { min: 0, grid: { color: "rgba(148,163,184,0.12)" }, ticks: { color: "#94a3b8", font: { family: "Inter", size: 11 } } }
      }
    }
  });
}

// INIT
loadStats();
buildPhChart();
buildTurbidityChart();
