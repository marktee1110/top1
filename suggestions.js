/* ============================
   نظام الاقتراحات (بحث موحّد)
   ============================ */

/* إظهار الاقتراحات لأي حقل اسم */
function showSuggestionsUniversal(nameId, xId, yId, boxId) {
  const nameInput = document.getElementById(nameId);
  const box = document.getElementById(boxId);
  const text = nameInput.value.trim();

  if (!text) {
    box.innerHTML = "";
    box.style.display = "none";
    return;
  }

  const matches = pointsDB.filter(p => p.name.includes(text));

  if (matches.length === 0) {
    box.innerHTML = "";
    box.style.display = "none";
    return;
  }

  box.innerHTML = "";
  matches.forEach(p => {
    const div = document.createElement("div");
    div.textContent = `${p.name} (X=${p.x}, Y=${p.y})`;
    div.onclick = () => {
      document.getElementById(nameId).value = p.name;
      document.getElementById(xId).value = p.x;
      document.getElementById(yId).value = p.y;
      box.innerHTML = "";
      box.style.display = "none";
    };
    box.appendChild(div);
  });

  box.style.display = "block";
}

/* إخفاء الاقتراحات عند الضغط خارجها */
document.addEventListener("click", function (e) {
  if (!e.target.classList.contains("input")) {
    document.querySelectorAll(".suggestions").forEach(box => {
      box.innerHTML = "";
      box.style.display = "none";
    });
  }
});