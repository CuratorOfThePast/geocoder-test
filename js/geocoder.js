console.log("Geocoder gestartet!");

async function searchOHM(street, housenumber, year) {
  const query = `
  [out:json];
  node
    ["addr:street"="${street}"]
    ["addr:housenumber"="${housenumber}"];
  out body;
  `;
  const url = "https://overpass-api.openhistoricalmap.org/api/interpreter";
  const resp = await fetch(url + "?data=" + encodeURIComponent(query));
  const data = await resp.json();
  const results = data.elements.map(el => ({
    street: el.tags["addr:street"],
    housenumber: el.tags["addr:housenumber"],
    city: el.tags["addr:city"],
    start_date: el.tags["start_date"],
    end_date: el.tags["end_date"],
    lat: el.lat,
    lon: el.lon
  }));
  showResults(results);
}

document.getElementById("search").addEventListener("click", () => {
  const street = document.getElementById("street").value;
  const housenumber = document.getElementById("housenumber").value;
  const year = document.getElementById("year").value;
  searchOHM(street, housenumber, year);
});

function showResults(results) {
  const div = document.getElementById("results");
  div.innerHTML = results.map(r => `
    <p>
      <strong>${r.street} ${r.housenumber}</strong><br>
      Koordinaten: ${r.lat.toFixed(5)}, ${r.lon.toFixed(5)}<br>
      Zeitraum: ${r.start_date || "?"} – ${r.end_date || "?"}
    </p>`).join("");
}
