/* إدارة الجلسات - sessions.js */

let sessionsDB = [];
let currentSessionId = null;

// ➕ إنشاء جلسة جديدة
function newSession(programId = null) {
  const session = {
    id: Date.now(),
    name: "جلسة جديدة",
    program: programId || "عام",
    date: new Date().toLocaleString(),
    points: [],
    notes: ""
  };
  sessionsDB.push(session);
  renderSessionsTable();
}

// 🗑 حذف جلسة
function deleteSession(sessionId) {
  sessionsDB = sessionsDB.filter(s => s.id !== sessionId);
  renderSessionsTable();
  document.getElementById("sessionDetails").style.display = "none";
}

// 🔍 فلترة الجلسات
function filterSessions() {
  const search = document.getElementById("searchSession").value.toLowerCase();
  const program = document.getElementById("filterProgram").value;
  const dateFilter = document.getElementById("filterDate").value;

  let filtered = sessionsDB.filter(s => 
    s.name.toLowerCase().includes(search) &&
    (program === "" || s.program === program)
  );

  if (dateFilter === "today") {
    const today = new Date().toLocaleDateString();
    filtered = filtered.filter(s => s.date.includes(today));
  }

  renderSessionsTable(filtered);
}

// ⬇️ تصدير كل الجلسات إلى Excel
function exportAllSessions() {
  if (sessionsDB.length === 0) {
    alert("لا توجد جلسات للتصدير");
    return;
  }

  const data = sessionsDB.map(s => ({
    "اسم الجلسة": s.name,
    "البرنامج": s.program,
    "التاريخ": s.date,
    "عدد النقاط": s.points.length,
    "ملاحظات": s.notes
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "الجلسات");

  XLSX.writeFile(workbook, "الجلسات.xlsx");
}

// ⬇️ تصدير جلسة واحدة إلى Excel
function exportSession(sessionId) {
  const session = sessionsDB.find(s => s.id === sessionId);
  if (!session) {
    alert("الجلسة غير موجودة");
    return;
  }

  const data = session.points.map(p => ({
    "اسم الهدف": p.name,
    "X": p.x,
    "Y": p.y,
    "زاوية": p.angle || "-",
    "مسافة": p.dist || "-"
  }));

  data.unshift({
    "اسم الهدف": "اسم الجلسة: " + session.name,
    "X": "البرنامج: " + session.program,
    "Y": "التاريخ: " + session.date,
    "زاوية": "ملاحظات: " + session.notes,
    "مسافة": ""
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, session.name);

  XLSX.writeFile(workbook, session.name + ".xlsx");
}

// 📝 تعديل جلسة (بـ prompt بسيط)
function editSessionPrompt() {
  const session = sessionsDB.find(s => s.id === currentSessionId);
  if (!session) return;

  const newName = prompt("اسم جديد للجلسة:", session.name);
  const newNotes = prompt("ملاحظات:", session.notes);

  if (newName !== null) session.name = newName;
  if (newNotes !== null) session.notes = newNotes;

  renderSessionsTable();
  showSessionDetails(currentSessionId);
}

// 📑 عرض تفاصيل جلسة
function showSessionDetails(sessionId) {
  const session = sessionsDB.find(s => s.id === sessionId);
  if (!session) return;

  currentSessionId = sessionId;
  document.getElementById("sessionDetails").style.display = "block";
  document.getElementById("sessionInfo").innerText =
    `اسم: ${session.name}\nبرنامج: ${session.program}\nتاريخ: ${session.date}\nملاحظات: ${session.notes}`;

  let html = "<table><tr><th>اسم</th><th>X</th><th>Y</th><th>زاوية</th><th>مسافة</th></tr>";
  session.points.forEach(p => {
    html += `<tr><td>${p.name}</td><td>${p.x}</td><td>${p.y}</td><td>${p.angle || "-"}</td><td>${p.dist || "-"}</td></tr>`;
  });
  html += "</table>";
  document.getElementById("sessionPoints").innerHTML = html;
}

// 🖼️ إعادة رسم جدول الجلسات
function renderSessionsTable(list = sessionsDB) {
  const tbody = document.querySelector("#table_sessions tbody");
  tbody.innerHTML = "";
  list.forEach((s, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i+1}</td>
      <td>${s.name}</td>
      <td>${s.program}</td>
      <td>${s.date}</td>
      <td>${s.points.length}</td>
      <td>
        <button class="btn ghost" onclick="showSessionDetails(${s.id})">👁 عرض</button>
        <button class="btn ghost" onclick="exportSession(${s.id})">⬇️ تصدير</button>
        <button class="btn ghost" onclick="deleteSession(${s.id})">🗑 حذف</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}