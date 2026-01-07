/* ============================
   برنامج 2 — حساب الزاوية والمسافة
   من إحداثيات نقطتين
   ============================ */

/* إضافة هدف */
function addTargetProg2() {
  const name = document.getElementById("target_name_2").value.trim();
  const x1 = parseFloat(document.getElementById("x1_2").value);
  const y1 = parseFloat(document.getElementById("y1_2").value);
  const x2 = parseFloat(document.getElementById("x2_2").value);
  const y2 = parseFloat(document.getElementById("y2_2").value);

  if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
    alert("الرجاء إدخال الإحداثيات بشكل صحيح");
    return;
  }

  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * 200 / Math.PI;

  const tbody = document.querySelector("#table_prog2 tbody");
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${tbody.children.length + 1}</td>
    <td>${name || "-"}</td>
    <td>${x1.toFixed(3)}</td>
    <td>${y1.toFixed(3)}</td>
    <td>${x2.toFixed(3)}</td>
    <td>${y2.toFixed(3)}</td>
    <td>${dist.toFixed(3)}</td>
    <td>${angle.toFixed(3)}</td>
    <td><button class="btn danger" onclick="removeTarget(2,${tbody.children.length})">🗑</button></td>
  `;

  tbody.appendChild(tr);

  /* -----------------------------------------
     🔥 إضافة الهدف إلى الجلسة فقط
     بدون حفظه في قاعدة البيانات
  ----------------------------------------- */
  if (!session.targets) session.targets = [];
  session.targets.push({
    name: name || "-",
    x: parseFloat(x2.toFixed(3)),
    y: parseFloat(y2.toFixed(3)),
    dist: parseFloat(dist.toFixed(3)),
    angle: parseFloat(angle.toFixed(3))
  });
  saveSession(); // حفظ الجلسة فقط

  /* -----------------------------------------
     ✅ إضافة الهدف إلى مصفوفة عامة (points)
     حتى تشتغل أزرار التصدير
  ----------------------------------------- */
  if (!window.points) window.points = [];
  window.points.push({
    name: name || "-",
    x: parseFloat(x2.toFixed(3)),
    y: parseFloat(y2.toFixed(3))
  });

  clearTargetInputs(2);
}

/* إزالة هدف */
function removeTarget(prog, index) {
  const tbody = document.querySelector(`#table_prog${prog} tbody`);
  tbody.removeChild(tbody.children[index]);

  Array.from(tbody.children).forEach((row, i) => {
    row.children[0].textContent = i + 1;
    row.children[8].innerHTML = `<button class="btn danger" onclick="removeTarget(${prog},${i})">🗑</button>`;
  });

  /* -----------------------------------------
     🔥 إزالة الهدف من الجلسة أيضاً
  ----------------------------------------- */
  if (session.targets && session.targets[index]) {
    session.targets.splice(index, 1);
    saveSession();
  }

  /* -----------------------------------------
     ✅ إزالة الهدف من مصفوفة points أيضاً
  ----------------------------------------- */
  if (window.points && window.points[index]) {
    window.points.splice(index, 1);
  }
}