// تعريف أنظمة الإحداثيات
const deirEzzorProj = "+proj=utm +zone=37 +datum=WGS84 +units=m +no_defs";
const wgs84Proj = "+proj=longlat +datum=WGS84 +no_defs";

// تحويل النقاط إلى WGS84
function convertPointsToWGS84(points) {
  return points.map(p => {
    const [lon, lat] = proj4(deirEzzorProj, wgs84Proj, [p.x, p.y]);
    return { id: p.name, lon, lat };
  });
}

// توليد اسم ملف تلقائي
function generateFileName(programName, ext) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${programName}_session_${year}-${month}-${day}_${hours}-${minutes}.${ext}`;
}

// حفظ ملف
function saveFile(content, fileName) {
  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}

// تصدير PTS
function exportPTS(points, programName="session") {
  const globalPoints = convertPointsToWGS84(points);
  const content = globalPoints.map(p =>
    `${p.id}, ${p.lon.toFixed(8)}, ${p.lat.toFixed(8)}, 0.00, -26.5`
  ).join("\n");
  saveFile(content, generateFileName(programName,"pts"));
}

// تصدير CSV
function exportCSV(points, programName="session") {
  const globalPoints = convertPointsToWGS84(points);
  const content = "id,lon,lat\n" + globalPoints.map(p =>
    `${p.id},${p.lon.toFixed(8)},${p.lat.toFixed(8)}`
  ).join("\n");
  saveFile(content, generateFileName(programName,"csv"));
}

// تصدير KML
function exportKML(points, programName="session") {
  const globalPoints = convertPointsToWGS84(points);
  const placemarks = globalPoints.map(p =>
    `<Placemark><name>${p.id}</name><Point><coordinates>${p.lon},${p.lat},0</coordinates></Point></Placemark>`
  ).join("\n");
  const content = `<?xml version="1.0" encoding="UTF-8"?>
  <kml xmlns="http://www.opengis.net/kml/2.2">
    <Document>${placemarks}</Document>
  </kml>`;
  saveFile(content, generateFileName(programName,"kml"));
}

// تصدير GPX
function exportGPX(points, programName="session") {
  const globalPoints = convertPointsToWGS84(points);
  const wpts = globalPoints.map(p =>
    `<wpt lon="${p.lon}" lat="${p.lat}"><name>${p.id}</name></wpt>`
  ).join("\n");
  const content = `<?xml version="1.0" encoding="UTF-8"?>
  <gpx version="1.1" creator="GeoApp">${wpts}</gpx>`;
  saveFile(content, generateFileName(programName,"gpx"));
}

// تصدير DXF (نقاط فقط)
function exportDXF(points, programName="session") {
  const globalPoints = convertPointsToWGS84(points);
  const entities = globalPoints.map(p =>
    `0\nPOINT\n8\n0\n10\n${p.lon}\n20\n${p.lat}\n30\n0.0\n`
  ).join("\n");
  const content = `0\nSECTION\n2\nENTITIES\n${entities}\n0\nENDSEC\n0\nEOF`;
  saveFile(content, generateFileName(programName,"dxf"));
}

// دالة عامة للتصدير حسب النوع
function exportOther(points, programName, type) {
  if (!points || points.length === 0) {
    alert("🚫 لا يوجد نقاط للتصدير");
    return;
  }
  switch(type) {
    case "pts": exportPTS(points, programName); break;
    case "csv": exportCSV(points, programName); break;
    case "kml": exportKML(points, programName); break;
    case "gpx": exportGPX(points, programName); break;
    case "dxf": exportDXF(points, programName); break;
    default: alert("⚠️ نوع غير مدعوم"); break;
  }
}

// دالة خاصة للتحويل والتصدير إلى العالمية (🌐)
function exportGlobal(points, programName="session") {
  if (!points || points.length === 0) {
    alert("🚫 لا يوجد نقاط للتحويل والتصدير");
    return;
  }
  const globalPoints = convertPointsToWGS84(points);
  const content = globalPoints.map(p =>
    `${p.id}, ${p.lon.toFixed(8)}, ${p.lat.toFixed(8)}, 0.00, -26.5`
  ).join("\n");
  saveFile(content, generateFileName(programName,"global.pts"));
}