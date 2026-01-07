// البحث العام مع فلترة حسب الاسم أو X أو Y
function searchPoint() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const searchType = document.getElementById("searchType").value;
  const resultsDiv = document.getElementById("searchResults");

  if (!query) {
    resultsDiv.innerHTML = "<p>أدخل قيمة للبحث...</p>";
    return;
  }

  let matches = [];

  if (searchType === "name") {
    matches = pointsDB.filter(p => p.name.toLowerCase().includes(query));
  } else if (searchType === "x") {
    matches = pointsDB.filter(p => String(p.x).toLowerCase().includes(query));
  } else if (searchType === "y") {
    matches = pointsDB.filter(p => String(p.y).toLowerCase().includes(query));
  }

  if (matches.length === 0) {
    resultsDiv.innerHTML = "<p>🚫 لا توجد نتائج</p>";
    return;
  }

  // إظهار عدد النتائج
  let html = `<p>✅ تم العثور على ${matches.length} نتيجة</p>`;
  html += "<table><tr><th>اسم</th><th>X</th><th>Y</th><th>البرنامج</th></tr>";

  matches.forEach(p => {
    html += `<tr>
               <td>${p.name}</td>
               <td>${p.x}</td>
               <td>${p.y}</td>
               <td>${p.program || "-"}</td>
             </tr>`;
  });

  html += "</table>";
  resultsDiv.innerHTML = html;
}

// 🔄 إعادة تعيين البحث
function resetSearch() {
  document.getElementById("searchInput").value = "";
  document.getElementById("searchResults").innerHTML = "";
}