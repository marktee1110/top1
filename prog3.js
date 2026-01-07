/* ============================
   برنامج 3 — التحقيق
   حساب الزاوية فقط من إحداثيات
   ============================ */

/* التحقق من وجود نقطة في قاعدة البيانات */
function findPointInDB(name) {
  return pointsDB.find(p => p.name === name) || null;
}

/* عند كتابة اسم نقطة التحقيق */
function onCheckNameInput() {
  const name = document.getElementById("target_name_3").value.trim();
  if (!name) return;

  const p = findPointInDB(name);

  if (p) {
    // موجودة → نملأ الإحداثيات فقط
    document.getElementById("target_x_3").value = p.x;
    document.getElementById("target_y_3").value = p.y;
    return;
  }

  // غير موجودة → نسأل المستخدم
  if (confirm("النقطة غير موجودة، هل تريد حفظها؟")) {
    // موافق → تُنشأ كنقطة جديدة وتُحفظ في DB + session
    const newPoint = { name: name, x: "", y: "" };
    pointsDB.push(newPoint);
    saveDB();

    if (!session.targets) session.targets = [];
    session.targets.push(newPoint);
    saveSession();

    // تبقى X و Y فارغين ليملأهم المستخدم
    document.getElementById("target_x_3").value = "";
    document.getElementById("target_y_3").value = "";
  } else {
    // رفض → تُنشأ كنقطة مؤقتة للجلسة فقط
    const tempPoint = { name: name, x: "", y: "" };

    if (!session.targets) session.targets = [];
    session.targets.push(tempPoint);
    saveSession();

    // تبقى فارغة
    document.getElementById("target_x_3").value = "";
    document.getElementById("target_y_3").value = "";
  }
}

/* إضافة هدف (نقطة تحقيق) */
function addTargetProg3() {
  const standX = parseFloat(document.getElementById("stand_x_3").value);
  const standY = parseFloat(document.getElementById("stand_y_3").value);
  const zeroX = parseFloat(document.getElementById("zero_x_3").value);
  const zeroY = parseFloat(document.getElementById("zero_y_3").value);

  const name = document.getElementById("target_name_3").value.trim();
  const x = parseFloat(document.getElementById("target_x_3").value);
  const y = parseFloat(document.getElementById("target_y_3").value);

  if (isNaN(standX) || isNaN(standY) || isNaN(zeroX) || isNaN(zeroY)) {
    alert("الرجاء إدخال الوقفة والزيرو بشكل صحيح");
    return;
  }

  if (!name) {
    alert("الرجاء إدخال اسم نقطة التحقيق");
    return;
  }

  if (isNaN(x) || isNaN(y)) {
    alert("الرجاء إدخال إحداثيات نقطة التحقيق بشكل صحيح");
    return;
  }

  const dx0 = zeroX - standX;
  const dy0 = zeroY - standY;
  const baseAngle = Math.atan2(dy0, dx0) * 200 / Math.PI;

  const dx = x - standX;
  const dy = y - standY;
  const angle = Math.atan2(dy, dx) * 200 / Math.PI - baseAngle;

  const tbody = document.querySelector("#table_prog3 tbody");
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${tbody.children.length + 1}</td>
    <td>${name}</td>
    <td>${x.toFixed(3)}</td>
    <td>${y.toFixed(3)}</td>
    <td>${angle.toFixed(4)}</td>
    <td><button class="btn danger" onclick="removeTarget(3,${tbody.children.length})">🗑</button></td>
  `;

  tbody.appendChild(tr);

  /* حفظ نقطة التحقيق داخل الجلسة */
  if (!session.targets) session.targets = [];
  session.targets.push({
    name: name,
    x: parseFloat(x.toFixed(3)),
    y: parseFloat(y.toFixed(3)),
    angle: parseFloat(angle.toFixed(4))
  });
  saveSession();

  clearTargetInputs(3);
}

/* إزالة هدف */
function removeTarget(prog, index) {
  const tbody = document.querySelector(`#table_prog${prog} tbody`);
  tbody.removeChild(tbody.children[index]);

  Array.from(tbody.children).forEach((row, i) => {
    row.children[0].textContent = i + 1;
    row.children[5].innerHTML = `<button class="btn danger" onclick="removeTarget(${prog},${i})">🗑</button>`;
  });

  /* إزالة من الجلسة */
  if (session.targets && session.targets[index]) {
    session.targets.splice(index, 1);
    saveSession();
  }
}