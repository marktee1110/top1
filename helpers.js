/* ============================
   وظائف عامة + التهيئة
   ============================ */

/* مسح مدخلات الأهداف */
function clearTargetInputs(prog) {
  document.getElementById(`target_name_${prog}`).value = "";
  const angle = document.getElementById(`target_angle_${prog}`);
  const dist = document.getElementById(`target_dist_${prog}`);
  const x = document.getElementById(`target_x_${prog}`);
  const y = document.getElementById(`target_y_${prog}`);

  if (angle) angle.value = "";
  if (dist) dist.value = "";
  if (x) x.value = "";
  if (y) y.value = "";
}

/* إزالة هدف (مشترك بين البرامج) */
function removeTarget(prog, index) {
  const tbody = document.querySelector(`#table_prog${prog} tbody`);
  tbody.removeChild(tbody.children[index]);

  Array.from(tbody.children).forEach((row, i) => {
    row.children[0].textContent = i + 1;
    row.children[row.children.length - 1].innerHTML =
      `<button class="btn danger" onclick="removeTarget(${prog},${i})">🗑</button>`;
  });
}

/* تحديث جدول برنامج معين */
function renderTable(prog) {
  const dropdown = document.getElementById(`sessionsDropdown${prog}`);
  const name = dropdown.value;

  if (!name || !sessions[prog] || !sessions[prog][name]) return;

  const data = sessions[prog][name];
  const tbody = document.querySelector(`#table_prog${prog} tbody`);
  tbody.innerHTML = "";

  data.targets.forEach((t, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${t.name}</td>
      <td>${t.x}</td>
      <td>${t.y}</td>
      <td>${t.dist}</td>
      <td>${t.angle}</td>
      <td><button class="btn danger" onclick="removeTarget(${prog},${i})">🗑</button></td>
    `;
    tbody.appendChild(tr);
  });
}

/* عرض صفحة */
function showPage(event, id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  document.querySelectorAll("nav button").forEach(b => b.classList.remove("active"));
  if (event && event.target) event.target.classList.add("active");

  renderDBTable();
  updateSessionsDropdown(1);
  updateSessionsDropdown(2);
  updateSessionsDropdown(3);
}

/* التهيئة عند التشغيل */
window.onload = function () {
  renderDBTable();
  updateSessionsDropdown(1);
  updateSessionsDropdown(2);
  updateSessionsDropdown(3);
};