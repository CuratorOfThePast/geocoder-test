// Benutzeroberfläche: Eingaben, Ausgabe, Verbindung zu geocoder + map
document.addEventListener("DOMContentLoaded", () => {
  initMap();

  const searchButton = document.getElementById("search");
  const resultsDiv = document.getElementById("results");

  searchButton.addEventListener("click", async () => {
    const street = document.getElementById("street").value.trim();
    const housenumber = document.getElementById("housenumber").value.trim();
    const year = document.getElementById("year").value.trim();

    if (!street || !housenumber) {
      alert("Bitte Straße und Hausnummer eingeben!");
      return;
    }

    resultsDiv.innerHTML = "<p>Suche läuft …</p>";
    try {
      const results = await searchOHM(street, housenumber, year);

// Jahr filtern, falls angegeben
let filteredResults = results;
if (year) {
  const y = parseInt(year);
  filteredResults = results.filter(r => {
    // Jahr aus start_date und end_date extrahieren
    const start = r.start_date ? parseInt(r.start_date.match(/\d{4}/)?.[0]) : -Infinity;
    const end = r.end_date ? parseInt(r.end_date.match(/\d{4}/)?.[0]) : Infinity;

    // NaN abfangen
    if (isNaN(start) && isNaN(end)) return true;      // keine Daten → anzeigen
    if (isNaN(start)) return y <= end;
    if (isNaN(end)) return y >= start;

    return y >= start && y <= end;
  });
}


if (!filteredResults.length) {
  resultsDiv.innerHTML = "<p>Keine Ergebnisse für dieses Jahr gefunden.</p>";
  showOnMap([]);
  return;
}

resultsDiv.innerHTML = filteredResults.map(r => `
  <div class="result">
    <strong>${r.street} ${r.housenumber}</strong><br>
    ${r.city || ""}<br>
    Koordinaten: ${r.lat.toFixed(5)}, ${r.lon.toFixed(5)}<br>
    Zeitraum: ${r.start_date || "?"} – ${r.end_date || "?"}
  </div>
`).join("");

showOnMap(filteredResults);

    } catch (err) {
      console.error(err);
      resultsDiv.innerHTML = "<p>Fehler beim Abrufen der Daten.</p>";
    }
  });
});
