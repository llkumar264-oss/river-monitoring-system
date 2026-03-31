/* =============================================
   alertspage.js — Alerts page listing
   ============================================= */

const DEMO_ALERTS_DATA = [
  { zone: "Sector 15 - Industrial Zone", status: "Critical", type: "critical", icon: "⚠️", detail: "pH Level critically high: 9.2 — Immediate action required", time: "2 min ago" },
  { zone: "Sector 20 - Downstream",      status: "Warning",  type: "warning",  icon: "🔔", detail: "Turbidity elevated: 32 NTU — Monitor closely",          time: "14 min ago" },
  { zone: "Sector 8 - Bridge Area",      status: "Warning",  type: "warning",  icon: "🔔", detail: "Dissolved Oxygen dropping: 6.2 mg/L (threshold: 6.0)",  time: "31 min ago" },
  { zone: "Sector 12 - Point A",         status: "Info",     type: "info",     icon: "ℹ️", detail: "Sensor reading variance detected — Under investigation", time: "1 hr ago" },
  { zone: "Sector 3 - Residential",      status: "Info",     type: "info",     icon: "ℹ️", detail: "Scheduled maintenance cycle completed successfully",      time: "2 hr ago" },
  { zone: "Sector 5 - Park Area",        status: "Info",     type: "info",     icon: "ℹ️", detail: "Data sync completed — All readings up to date",          time: "3 hr ago" },
];

async function loadAlerts() {
  let alerts = DEMO_ALERTS_DATA;

  try {
    const res = await fetch(`${API}/alerts/`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      alerts = data.map(a => ({
        zone: a.zone || a.location || "Unknown Zone",
        status: a.status || "Info",
        type: (a.status || "info").toLowerCase(),
        icon: a.status === "Critical" ? "⚠️" : a.status === "Warning" ? "🔔" : "ℹ️",
        detail: a.detail || `pH: ${a.ph || "—"} | Turbidity: ${a.turbidity || "—"}`,
        time: a.time || "Recently"
      }));
    }
  } catch (_) {}

  renderAlerts(alerts);
}

function renderAlerts(alerts) {
  const container = document.getElementById("alertsList");
  container.innerHTML = "";

  alerts.forEach(a => {
    const card = document.createElement("div");
    card.className = "alert-card";
    card.innerHTML = `
      <div class="alert-icon-wrap ${a.type}">${a.icon}</div>
      <div class="alert-info">
        <div class="alert-zone">${a.zone}</div>
        <div class="alert-detail">${a.detail}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">
        <span class="badge ${a.type === 'critical' ? 'high' : a.type === 'warning' ? 'medium' : 'verified'}">${a.status}</span>
        <div class="alert-time">${a.time}</div>
      </div>
    `;
    container.appendChild(card);
  });
}

loadAlerts();
