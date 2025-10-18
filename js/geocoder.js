// OHM Overpass-Geocoder – Abfragefunktionen
async function searchOHM(street, housenumber, year) {
  console.log("Abfrage gestartet:", street, housenumber, year);

  const query = `
  [out:json];
  node["addr:street"="${street}"]["addr:housenumber"="${housenumber}"];
  out body;
  `;

  const url = "https://overpass-api.openhistoricalmap.org/api/interpreter";
  const resp = await fetch(url + "?data=" + encodeURIComponent(query));

  if (!resp.ok) throw new Error("Fehler bei Overpass: " + resp.statusText);

  const data = await resp.json();
  if (!data.elements || data.elements.length === 0) return [];

  return data.elements.map(el => ({
    street: el.tags["addr:street"],
    housenumber: el.tags["addr:housenumber"],
    city: el.tags["addr:city"],
    start_date: el.tags["start_date"],
    end_date: el.tags["end_date"],
    lat: el.lat,
    lon: el.lon
  }));
}
