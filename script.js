function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// Capture GPS
document.getElementById('getLocation').addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude.toFixed(5);
      const lon = pos.coords.longitude.toFixed(5);
      document.getElementById('locationDisplay').textContent = `Lat: ${lat}, Lon: ${lon}`;
      document.getElementById('locationDisplay').dataset.lat = lat;
      document.getElementById('locationDisplay').dataset.lon = lon;
    }, () => alert("Unable to retrieve location"));
  } else {
    alert("Geolocation not supported");
  }
});

// Handle form submission
document.getElementById('uploadForm').addEventListener('submit', e => {
  e.preventDefault();

  const village = document.getElementById('village').value.trim();
  const source  = document.getElementById('source').value;
  const lat = document.getElementById('locationDisplay').dataset.lat || "N/A";
  const lon = document.getElementById('locationDisplay').dataset.lon || "N/A";

  // Mock reference-card analysis
  const outcomes = [
    {quality: "Good", diseases: "None"},
    {quality: "Moderate", diseases: "Mild stomach issues"},
    {quality: "Contaminated", diseases: "Cholera, Typhoid risk"}
  ];
  const pick = outcomes[Math.floor(Math.random() * outcomes.length)];

  // Save to localStorage
  const record = { village, source, lat, lon, result: pick.quality, diseases: pick.diseases, date: new Date().toLocaleString() };
  const all = JSON.parse(localStorage.getItem('waterTests') || '[]');
  all.unshift(record);
  localStorage.setItem('waterTests', JSON.stringify(all));

  // Show report
  document.getElementById('reportContent').innerHTML = `
    <p><strong>Village:</strong> ${village}</p>
    <p><strong>Source:</strong> ${source}</p>
    <p><strong>GPS:</strong> ${lat}, ${lon}</p>
    <p><strong>Water Quality:</strong> ${pick.quality}</p>
    <p><strong>Possible Diseases:</strong> ${pick.diseases}</p>
  `;
  showScreen('report');
});

// Populate records page when opened
function loadRecords() {
  const tbody = document.querySelector('#recordsTable tbody');
  tbody.innerHTML = '';
  const data = JSON.parse(localStorage.getItem('waterTests') || '[]');
  data.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.village}</td>
      <td>${r.source}</td>
      <td>${r.lat}, ${r.lon}</td>
      <td>${r.result}</td>
      <td>${r.diseases}</td>
    `;
    tbody.appendChild(tr);
  });
}
document.querySelector('button[onclick="showScreen(\'records\')"]').addEventListener('click', loadRecords);
