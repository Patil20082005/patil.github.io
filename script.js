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

  // >>> NEW: send to backend <<<
  const formData = new FormData();
  formData.append('village', village);
  formData.append('source', source);
  formData.append('ph', pick.quality);        // example field, adjust as needed
  formData.append('latitude', lat);
  formData.append('longitude', lon);
  // if you have an image input: formData.append('image', document.getElementById('yourImageInput').files[0]);

  fetch('https://patil-backend.onrender.com/reports', {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(data => console.log('Saved to backend:', data))
  .catch(err => console.error('Backend error', err));
  // >>> END new code <<<

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

