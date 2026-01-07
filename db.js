/* ============================
   قاعدة البيانات (نقاط موحّدة)
   ============================ */

let pointsDB = JSON.parse(localStorage.getItem("pointsDB") || "[]");

/* حفظ القاعدة */
function saveDB() {
  localStorage.setItem("pointsDB", JSON.stringify(pointsDB));
}

/* إضافة نقطة إلى القاعدة */
function addPointToDB_all() {
  const type = document.getElementById("point_type").value;
  const name = document.getElementById("point_name").value.trim();
  const x = parseFloat(document.getElementById("point_x").value);
  const y = parseFloat(document.getElementById("point_y").value);

  if (!name || isNaN(x) || isNaN(y)) {
    alert("الرجاء إدخال اسم وإحداثيات صحيحة");
    return;
  }

  pointsDB.push({ type, name, x, y });
  saveDB();
  renderDBTable();
  clearPointInputs();
}

/* مسح مدخلات إضافة نقطة */
function clearPointInputs() {
  document.getElementById("point_name").value = "";
  document.getElementById("point_x").value = "";
  document.getElementById("point_y").value = "";
}

/* حذف نقطة من القاعدة */
function deletePointFromDB(index) {
  pointsDB.splice(index, 1);
  saveDB();
  renderDBTable();
}

/* عرض جدول القاعدة */
function renderDBTable() {
  const tbody = document.querySelector("#table_db tbody");
  tbody.innerHTML = "";

  pointsDB.forEach((p, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${p.type}</td>
      <td>${p.name}</td>
      <td>${p.x}</td>
      <td>${p.y}</td>
      <td>
        <button class="btn danger" onclick="deletePointFromDB(${i})">🗑</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/* حفظ نقطة من مدخلات الوقفة/الزيرو */
function savePointFromInputs(nameId, xId, yId, type) {
  const name = document.getElementById(nameId).value.trim();
  const x = parseFloat(document.getElementById(xId).value);
  const y = parseFloat(document.getElementById(yId).value);

  if (!name || isNaN(x) || isNaN(y)) {
    alert("الرجاء إدخال اسم وإحداثيات صحيحة");
    return;
  }

  pointsDB.push({ type, name, x, y });
  saveDB();
  renderDBTable();
}