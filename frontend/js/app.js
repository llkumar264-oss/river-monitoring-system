/* =============================================
   app.js — Shared utilities, dark mode, toast
   ============================================= */

const API = "https://river-monitoring-system.onrender.com";

// Dark mode
function toggleDark() {
  document.body.classList.toggle("dark");
  localStorage.setItem("dark", document.body.classList.contains("dark") ? "1" : "0");
  const btn = document.querySelector(".dark-toggle");
  if (btn) btn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
}

// Init dark mode from storage
(function () {
  if (localStorage.getItem("dark") === "1") {
    document.body.classList.add("dark");
    const btn = document.querySelector(".dark-toggle");
    if (btn) btn.textContent = "☀️";
  }
})();

// Toast
function showToast(msg, type = "success") {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = (type === "success" ? "✅ " : "❌ ") + msg;
  t.className = "show " + type;
  setTimeout(() => { t.className = ""; }, 3200);
}

// Shared Chart defaults
function chartDefaults() {
  return {
    responsive: true,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        labels: { color: getComputedStyle(document.body).getPropertyValue("--text-secondary").trim() || "#64748b", font: { family: "Inter", size: 12 } }
      }
    },
    scales: {
      x: {
        grid: { color: "rgba(148,163,184,0.12)" },
        ticks: { color: getComputedStyle(document.body).getPropertyValue("--text-muted").trim() || "#94a3b8", font: { family: "Inter", size: 11 } }
      },
      y: {
        grid: { color: "rgba(148,163,184,0.12)" },
        ticks: { color: getComputedStyle(document.body).getPropertyValue("--text-muted").trim() || "#94a3b8", font: { family: "Inter", size: 11 } }
      }
    }
  };
}

// Animate number count-up
function countUp(el, target, duration = 900) {
  if (!el) return;
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.round(current);
  }, 16);
}