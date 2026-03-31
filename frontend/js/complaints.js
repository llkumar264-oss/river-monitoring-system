/* =============================================
   complaints.js — Admin complaints view
   ============================================= */

const DEMO_COMPLAINTS_DATA = [
  { id: "RMS-2026-1234", name: "Rajesh Kumar",  severity: "high",   status: "Pending",  location: "Sector 12, River Point A",   phone: "+91 98765 43210", description: "Industrial waste being dumped directly into the river. Strong chemical smell and discoloration of water observed.", media: "2 media file(s)", timestamp: "2026-04-01 08:24" },
  { id: "RMS-2026-1235", name: "Priya Sharma",  severity: "medium", status: "Verified", location: "Sector 8, Bridge Area",        phone: "+91 87654 32109", description: "Plastic waste and sewage overflow near residential area. Foul odor affecting nearby homes.", media: "1 media file(s)", timestamp: "2026-03-31 15:40" },
  { id: "RMS-2026-1236", name: "Amit Patel",    severity: "high",   status: "Resolved", location: "Sector 15, Industrial Zone",  phone: "+91 76543 21098", description: "Foam and chemical effluents visible on river surface near the industrial outlet. Already informed local authorities.", media: "3 media file(s)", timestamp: "2026-03-30 09:12" },
  { id: "RMS-2026-1237", name: "Sunita Devi",   severity: "low",    status: "Pending",  location: "Sector 3, Residential Area",  phone: "+91 65432 10987", description: "Garbage dumping on the riverbank affecting water quality during monsoon season.", media: "1 media file(s)", timestamp: "2026-03-29 11:55" },
  { id: "RMS-2026-1238", name: "Vikram Singh",  severity: "medium", status: "Rejected", location: "Sector 20, Downstream",       phone: "+91 54321 09876", description: "Unusual color change noticed in river water after heavy rains. Possible contamination from upstream.", media: "0 media file(s)", timestamp: "2026-03-28 17:30" },
  { id: "RMS-2026-1239", name: "Meena Gupta",   severity: "low",    status: "Verified", location: "Sector 5, Park Area",         phone: "+91 43210 98765", description: "Dead fish spotted floating near the park area. Suspected pesticide runoff from agricultural fields.", media: "2 media file(s)", timestamp: "2026-03-27 14:20" },
];

let allComplaints = [];
let currentFilter = "all";

async function loadComplaints() {
  try {
    const res = await fetch(`${API}/complaints/`);
    const data = await res.json();
    allComplaints = Array.isArray(data) && data.length > 0 ? data : DEMO_COMPLAINTS_DATA;
  } catch (_) {
    allComplaints = DEMO_COMPLAINTS_DATA;
  }
  renderComplaints();
}

function setFilter(status, btn) {
  currentFilter = status;
  document.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
  btn.classList.add("active");
  renderComplaints();
}

function filterComplaints() { renderComplaints(); }

function renderComplaints() {
  const query = (document.getElementById("searchInput")?.value || "").toLowerCase();
  const list  = document.getElementById("complaintsList");
  const filtered = allComplaints.filter(c => {
    const matchStatus = currentFilter === "all" || c.status?.toLowerCase() === currentFilter.toLowerCase();
    const matchSearch = !query || (c.name || "").toLowerCase().includes(query) ||
      (c.location || "").toLowerCase().includes(query) || (c.id || "").toLowerCase().includes(query);
    return matchStatus && matchSearch;
  });

  list.innerHTML = "";
  if (filtered.length === 0) {
    list.innerHTML = `<div style="text-align:center;color:var(--text-muted);padding:40px 0;font-size:14px;">No complaints found</div>`;
    return;
  }

  filtered.forEach((c, idx) => {
    const card = document.createElement("div");
    card.className = "complaint-card";
    card.innerHTML = `
      <div class="complaint-card-header">
        <div>
          <div class="complainant-name">${c.name || "Unknown"} <span class="badge ${(c.severity || 'low').toLowerCase()}">${c.severity || 'low'}</span></div>
          <div class="complaint-location">${c.location || ""}</div>
          <div class="complaint-id">${c.id || ""}</div>
        </div>
        <span class="badge ${(c.status || 'pending').toLowerCase()}">⏳ ${c.status || "Pending"}</span>
      </div>
      <div class="complaint-desc">${c.description || ""}</div>
      <div class="complaint-meta">${c.media ? `📎 ${c.media}` : ""}</div>
    `;
    card.onclick = () => showDetail(c, card);
    list.appendChild(card);
  });
}

function showDetail(c, card) {
  document.querySelectorAll(".complaint-card").forEach(el => el.classList.remove("selected"));
  card.classList.add("selected");

  const panel = document.getElementById("detailPanel");
  panel.className = "detail-panel has-content";
  panel.innerHTML = `
    <div class="detail-header">
      <div class="detail-name">${c.name}</div>
      <div style="display:flex;gap:6px;margin-top:6px;">
        <span class="badge ${c.severity?.toLowerCase()}">${c.severity}</span>
        <span class="badge ${c.status?.toLowerCase()}">${c.status}</span>
      </div>
    </div>
    <div class="detail-section"><div class="ds-label">Complaint ID</div><div class="ds-value">${c.id || "—"}</div></div>
    <div class="detail-section"><div class="ds-label">Location</div><div class="ds-value">📍 ${c.location}</div></div>
    <div class="detail-section"><div class="ds-label">Phone</div><div class="ds-value">${c.phone || "—"}</div></div>
    <div class="detail-section"><div class="ds-label">Submitted</div><div class="ds-value">${c.timestamp || "—"}</div></div>
    <div class="detail-section"><div class="ds-label">Description</div><div class="ds-value" style="line-height:1.6;">${c.description}</div></div>
    <div class="detail-section"><div class="ds-label">Evidence</div><div class="ds-value">📎 ${c.media || "No files"}</div></div>
    <div class="detail-actions">
      <button class="btn btn-success" onclick="updateStatus('${c.id}', 'Verified')">✔ Verify</button>
      <button class="btn btn-primary" onclick="updateStatus('${c.id}', 'Resolved')">✅ Resolve</button>
      <button class="btn btn-danger"  onclick="updateStatus('${c.id}', 'Rejected')">✖ Reject</button>
    </div>
  `;
}

async function updateStatus(id, newStatus) {
  try {
    await fetch(`${API}/complaints/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });
  } catch (_) {}

  // Update local data
  const c = allComplaints.find(x => x.id === id);
  if (c) c.status = newStatus;

  showToast(`Status updated to ${newStatus}`);
  renderComplaints();

  // Clear detail panel
  const panel = document.getElementById("detailPanel");
  panel.className = "detail-panel";
  panel.innerHTML = `<div class="detail-empty"><div class="detail-icon">👁️</div><p>Select a complaint to view details</p></div>`;
}

loadComplaints();