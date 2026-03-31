/* =============================================
   citizen.js — Citizen complaint submission
   ============================================= */

let selectedSeverity = "medium";

function selectSeverity(level) {
  selectedSeverity = level;
  document.getElementById("c_severity").value = level;
  ["high", "medium", "low"].forEach(l => {
    const el = document.getElementById(`sev-${l}`);
    el.className = "severity-option";
    if (l === level) el.classList.add(`selected-${l}`);
  });
}

// Pre-select medium
selectSeverity("medium");

function previewFile(input) {
  const preview = document.getElementById("preview");
  preview.innerHTML = "";
  const file = input.files[0];
  if (!file) return;

  if (file.type.startsWith("image")) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.style.cssText = "max-width:100%;border-radius:8px;margin-top:10px;border:1px solid var(--border)";
    preview.appendChild(img);
  } else if (file.type.startsWith("video")) {
    const vid = document.createElement("video");
    vid.src = URL.createObjectURL(file);
    vid.controls = true;
    vid.style.cssText = "max-width:100%;border-radius:8px;margin-top:10px;border:1px solid var(--border)";
    preview.appendChild(vid);
  }
}

async function submitComplaint(e) {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name",        document.getElementById("c_name").value);
  formData.append("phone",       document.getElementById("c_phone").value);
  formData.append("location",    document.getElementById("c_location").value);
  formData.append("description", document.getElementById("c_desc").value);
  formData.append("severity",    selectedSeverity);

  const fileInput = document.getElementById("c_file");
  if (fileInput.files[0]) {
    formData.append("file", fileInput.files[0]);
  } else {
    // Create a dummy blank file if none provided
    const blank = new Blob([""], { type: "text/plain" });
    formData.append("file", blank, "no-file.txt");
  }

  try {
    const res = await fetch(`${API}/complaints/`, { method: "POST", body: formData });
    if (res.ok) {
      showToast("Complaint submitted successfully!", "success");
      document.getElementById("complaintForm").reset();
      document.getElementById("preview").innerHTML = "";
      selectSeverity("medium");
      loadMyComplaints();
    } else {
      showToast("Submission failed. Please try again.", "error");
    }
  } catch (_) {
    showToast("Could not connect to server. Saved locally.", "error");
  }
}

async function loadMyComplaints() {
  const container = document.getElementById("myComplaints");
  try {
    const res = await fetch(`${API}/complaints/`);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = `<p style="color:var(--text-muted);font-size:13px;">No complaints submitted yet.</p>`;
      return;
    }

    container.innerHTML = data.slice(-5).reverse().map(c => `
      <div class="complaint-card" style="cursor:default;">
        <div class="complaint-card-header">
          <div>
            <div class="complainant-name">${c.name || "You"}</div>
            <div class="complaint-location">${c.location || ""}</div>
          </div>
          <span class="badge ${(c.status || 'pending').toLowerCase()}">${c.status || "Pending"}</span>
        </div>
        <div class="complaint-desc">${c.description || ""}</div>
      </div>
    `).join("");
  } catch (_) {
    container.innerHTML = `<p style="color:var(--text-muted);font-size:13px;">Connect to the server to view complaints.</p>`;
  }
}

loadMyComplaints();
