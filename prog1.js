/* ============================
   برنامج 1 — حساب الإحداثيات
   من زاوية + مسافة
   ============================ */

/* إضافة هدف */
function addTargetProg1() {
  const standX = parseFloat(document.getElementById("stand_x_1").value);
  const standY = parseFloat(document.getElementById("stand_y_1").value);
  const zeroX = parseFloat(document.getElementById("zero_x_1").value);
  const zeroY = parseFloat(document.getElementById("zero_y_1").value);

  const name = document.getElementById("target_name_1").value.trim();
  const angle = parseFloat(document.getElementById("target_angle_1").value);
  const dist = parseFloat(document.getElementById("target_dist_1").value);

  if (isNaN(standX) || isNaN(standY) || isNaN(zeroX) || isNaN(zeroY)) {
    alert("الرجاء إدخال الوقفة والزيرو بشكل صحيح");
    return;
  }

  if (isNaN(angle) || isNaN(dist)) {
    alert("الرجاء إدخال زاوية ومسافة صحيحة");
    return;
  }

  const dx = zeroX - standX;
  const dy = zeroY - standY;
  const baseAngle = Math.atan2(dy, dx) * 200 / Math.PI;

  const finalAngle = baseAngle + angle;
  const rad = finalAngle * Math.PI / 200;

  const x = standX + dist * Math.cos(rad);
  const y = standY + dist * Math.sin(rad);

  const tbody = document.querySelector("#table_prog1 tbody");
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${tbody.children.length + 1}</td>
    <td>${name || "-"}</td>
    <td>${x.toFixed(3)}</td>
    <td>${y.toFixed(3)}</td>
    <td>${dist}</td>
    <td>${angle}</td>
    <td><button class="btn danger" onclick="removeTarget(1,${tbody.children.length})">🗑</button></td>
  `;

  tbody.appendChild(tr);

  /* -----------------------------------------
     🔥 إضافة الهدف إلى الجلسة فقط
     بدون حفظه في قاعدة البيانات
  ----------------------------------------- */
  if (!session.targets) session.targets = [];
  session.targets.push({
    name: name || "-",
    x: parseFloat(x.toFixed(3)),
    y: parseFloat(y.toFixed(3)),
    dist: dist,
    angle: angle
  });
  saveSession(); // حفظ الجلسة فقط

  /* -----------------------------------------
     ✅ إضافة الهدف إلى مصفوفة عامة (points)
     حتى تشتغل أزرار التصدير
  ----------------------------------------- */
  if (!window.points) window.points = [];
  window.points.push({
    name: name || "-",
    x: parseFloat(x.toFixed(3)),
    y: parseFloat(y.toFixed(3))
  });

  clearTargetInputs(1);
}

/* إزالة هدف */
function removeTarget(prog, index) {
  const tbody = document.querySelector(`#table_prog${prog} tbody`);
  tbody.removeChild(tbody.children[index]);

  Array.from(tbody.children).forEach((row, i) => {
    row.children[0].textContent = i + 1;
    row.children[6].innerHTML = `<button class="btn danger" onclick="removeTarget(${prog},${i})">🗑</button>`;
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