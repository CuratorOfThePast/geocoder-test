// MapLibre GL JS Karte
let map;
let markers = [];

function initMap() {
  map = new maplibregl.Map({
    container: 'map',
    style: 'https://www.openhistoricalmap.org/map-styles/main/main.json',
    center: [13.405, 52.52], // Berlin
    zoom: 12,
    attributionControl: true
  });

  map.addControl(new maplibregl.NavigationControl());
}

  // Jahresfilter, falls angegeben
if (year && map.filterByDate) { 
    map.once('styledata', () => {
      map.filterByDate(year + "-01-01"); // filtert Tiles nach Jahr
    });
  }
}

function showOnMap(results) {
  // alte Marker entfernen
  markers.forEach(m => m.remove());
  markers = [];

  if (!results.length) return;

  results.forEach(r => {
    const popup = new maplibregl.Popup({ offset: 25 })
      .setHTML(`<b>${r.street} ${r.housenumber}</b><br>
                ${r.city || ""}<br>
                Zeitraum: ${r.start_date || "?"} – ${r.end_date || "?"}`);

    const marker = new maplibregl.Marker()
      .setLngLat([r.lon, r.lat])
      .setPopup(popup)
      .addTo(map);

    markers.push(marker);
  });

  const bounds = new maplibregl.LngLatBounds();
  results.forEach(r => bounds.extend([r.lon, r.lat]));
  map.fitBounds(bounds, { padding: 50 });
}
