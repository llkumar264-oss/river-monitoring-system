/* =============================================
   analytics.js — Analytics charts
   ============================================= */

function initAnalytics() {
  const sectors = ["Sec 3", "Sec 5", "Sec 8", "Sec 12", "Sec 15", "Sec 20"];

  // Weekly pH Trend
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  new Chart(document.getElementById("weeklyPhChart"), {
    type: "line",
    data: {
      labels: days,
      datasets: [
        { label: "Sector 12", data: [7.1, 7.3, 7.2, 7.5, 7.2, 7.3, 7.2], borderColor: "#3b82f6", backgroundColor: "rgba(59,130,246,0.05)", borderWidth: 2, tension: 0.4, fill: true, pointRadius: 3 },
        { label: "Sector 15", data: [8.8, 9.0, 9.2, 9.0, 9.3, 9.1, 9.2], borderColor: "#ef4444", backgroundColor: "rgba(239,68,68,0.05)", borderWidth: 2, tension: 0.4, fill: true, pointRadius: 3 },
        { label: "Sector 8",  data: [7.6, 7.7, 7.8, 7.6, 7.9, 7.7, 7.8], borderColor: "#f59e0b", backgroundColor: "rgba(245,158,11,0.05)", borderWidth: 2, tension: 0.4, fill: true, pointRadius: 3 },
      ]
    },
    options: {
      ...chartDefaults(),
      scales: {
        x: { grid: { color: "rgba(148,163,184,0.12)" }, ticks: { color: "#94a3b8", font: { family: "Inter", size: 11 } } },
        y: { min: 6, max: 10, grid: { color: "rgba(148,163,184,0.12)" }, ticks: { color: "#94a3b8", font: { family: "Inter", size: 11 } } }
      }
    }
  });

  // Alert Distribution Doughnut
  new Chart(document.getElementById("alertDistChart"), {
    type: "doughnut",
    data: {
      labels: ["Critical", "Warning", "Info"],
      datasets: [{ data: [8, 14, 12], backgroundColor: ["#ef4444", "#f59e0b", "#3b82f6"], borderWidth: 0, hoverOffset: 6 }]
    },
    options: {
      responsive: true,
      cutout: "65%",
      plugins: {
        legend: { position: "bottom", labels: { color: "#64748b", font: { family: "Inter", size: 12 }, padding: 16 } }
      }
    }
  });

  // Turbidity Comparison Bar
  new Chart(document.getElementById("turbComparChart"), {
    type: "bar",
    data: {
      labels: sectors,
      datasets: [{
        label: "Turbidity (NTU)",
        data: [15, 18, 28, 12, 45, 32],
        backgroundColor: ["#22c55e","#22c55e","#f59e0b","#22c55e","#ef4444","#f59e0b"],
        borderRadius: 8,
        borderSkipped: false,
      }]
    },
    options: {
      ...chartDefaults(),
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: "#94a3b8", font: { family: "Inter", size: 11 } } },
        y: { grid: { color: "rgba(148,163,184,0.12)" }, ticks: { color: "#94a3b8", font: { family: "Inter", size: 11 } } }
      }
    }
  });

  // DO Levels
  new Chart(document.getElementById("doChart"), {
    type: "bar",
    data: {
      labels: sectors,
      datasets: [{
        label: "DO (mg/L)",
        data: [8.2, 8.0, 6.2, 8.5, 3.1, 5.8],
        backgroundColor: ["#22c55e","#22c55e","#f59e0b","#22c55e","#ef4444","#f59e0b"],
        borderRadius: 8,
        borderSkipped: false,
      }]
    },
    options: {
      ...chartDefaults(),
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: "#94a3b8", font: { family: "Inter", size: 11 } } },
        y: { min: 0, max: 12, grid: { color: "rgba(148,163,184,0.12)" }, ticks: { color: "#94a3b8", font: { family: "Inter", size: 11 } } }
      }
    }
  });
}

initAnalytics();
