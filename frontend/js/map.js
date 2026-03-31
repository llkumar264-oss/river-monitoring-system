/* =============================================
   map.js — Hotspots Map with Leaflet
   ============================================= */

const MAP_SENSORS = [
  { location: "Sector 12 - Point A",   lat: 29.955, lng: 78.170, ph: 7.2, turbidity: 12, status: "Safe" },
  { location: "Sector 8 - Bridge",     lat: 29.948, lng: 78.162, ph: 7.8, turbidity: 28, status: "Moderate" },
  { location: "Sector 15 - Industrial",lat: 29.940, lng: 78.180, ph: 9.2, turbidity: 45, status: "Critical" },
  { location: "Sector 3 - Residential",lat: 29.960, lng: 78.155, ph: 7.1, turbidity: 15, status: "Safe" },
  { location: "Sector 20 - Downstream",lat: 29.935, lng: 78.168, ph: 7.6, turbidity: 32, status: "Moderate" },
  { location: "Sector 5 - Park Area",  lat: 29.965, lng: 78.174, ph: 7.3, turbidity: 18, status: "Safe" },
  { location: "Sector 9 - North Zone", lat: 29.970, lng: 78.160, ph: 6.8, turbidity: 10, status: "Safe" },
  { location: "Sector 11 - West Bank", lat: 29.942, lng: 78.150, ph: 8.0, turbidity: 36, status: "Moderate" },
];

function statusToColor(status) {
  if (status === "Critical") return "#ef4444";
  if (status === "Moderate") return "#f59e0b";
  return "#22c55e";
}

function initMap() {
  const map = L.map("map").setView([29.952, 78.166], 13);

  // Light tile layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
    maxZoom: 18,
  }).addTo(map);

  const heatPoints = [];

  MAP_SENSORS.forEach(s => {
    const color = statusToColor(s.status);

    const marker = L.circleMarker([s.lat, s.lng], {
      radius: 10,
      fillColor: color,
      color: "white",
      weight: 2.5,
      opacity: 1,
      fillOpacity: 0.9,
    }).addTo(map);

    marker.bindPopup(`
      <div style="font-family:Inter,sans-serif;min-width:180px;">
        <div style="font-weight:700;font-size:14px;margin-bottom:6px;">${s.location}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <div style="background:#f1f5f9;border-radius:6px;padding:6px 10px;">
            <div style="font-size:10px;color:#64748b;margin-bottom:2px;">pH Level</div>
            <div style="font-size:16px;font-weight:700;color:${color};">${s.ph}</div>
          </div>
          <div style="background:#f1f5f9;border-radius:6px;padding:6px 10px;">
            <div style="font-size:10px;color:#64748b;margin-bottom:2px;">Turbidity</div>
            <div style="font-size:16px;font-weight:700;">${s.turbidity} NTU</div>
          </div>
        </div>
        <div style="margin-top:8px;font-size:12px;padding:4px 8px;border-radius:4px;background:${color}22;color:${color};font-weight:600;display:inline-block;">
          ${s.status}
        </div>
      </div>
    `, { maxWidth: 260 });

    marker.on("click", () => {
      const panel = document.getElementById("mapDetailPanel");
      panel.innerHTML = `
        <h4>📍 ${s.location}</h4>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;">
          <div class="detail-section" style="flex:1;min-width:100px;">
            <div class="ds-label">pH Level</div>
            <div class="ds-value" style="font-size:22px;font-weight:800;color:${color};">${s.ph}</div>
          </div>
          <div class="detail-section" style="flex:1;min-width:100px;">
            <div class="ds-label">Turbidity</div>
            <div class="ds-value" style="font-size:22px;font-weight:800;">${s.turbidity} <span style="font-size:12px;font-weight:500;color:var(--text-muted)">NTU</span></div>
          </div>
        </div>
        <div class="detail-section">
          <div class="ds-label">Status</div>
          <div class="ds-value"><span class="badge ${s.status.toLowerCase()}" style="font-size:13px;">${s.status}</span></div>
        </div>
      `;
    });

    heatPoints.push([s.lat, s.lng, s.status === "Critical" ? 1.0 : s.status === "Moderate" ? 0.6 : 0.3]);
  });

  // Heatmap overlay
  if (typeof L.heatLayer !== "undefined") {
    L.heatLayer(heatPoints, { radius: 30, blur: 20, maxZoom: 17, gradient: { 0.3: "#22c55e", 0.6: "#f59e0b", 1.0: "#ef4444" } }).addTo(map);
  }
}

initMap();
