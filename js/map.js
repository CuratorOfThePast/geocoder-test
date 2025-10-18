// Leaflet-Karte für Anzeige der Suchergebnisse
let map;
let markerLayer;

function initMap() {
  map = L.map("map").setView([52.52, 13.405], 12); // Berlin als Start
  L.tileLayer("https://tile.openhistoricalmap.org/ohm/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openhistoricalmap.org/">OpenHistoricalMap</a>'
  }).addTo(map);
  markerLayer = L.layerGroup().addTo(map);
}

function showOnMap(results) {
  markerLayer.clearLayers();
  if (!results.length) return;
  results.forEach(r => {
    const marker = L.marker([r.lat, r.lon])
      .bindPopup(`<b>${r.street} ${r.housenumber}</b><br>
                  ${r.city || ""}<br>
                  Zeitraum: ${r.start_date || "?"}–${r.end_date || "?"}`);
    markerLayer.addLayer(marker);
  });
  const bounds = L.latLngBounds(results.map(r => [r.lat, r.lon]));
  map.fitBounds(bounds);
}
