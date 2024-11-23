// Initialize the map
var map = L.map('map').setView([19.0760, 72.8777], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Add a geocoder control
L.Control.geocoder({
    defaultMarkGeocode: false
})
.on('markgeocode', function(e) {
    var bbox = e.geocode.bbox;
    var poly = L.polygon([
        [bbox.getSouthEast().lat, bbox.getSouthEast().lng],
        [bbox.getNorthEast().lat, bbox.getNorthEast().lng],
        [bbox.getNorthWest().lat, bbox.getNorthWest().lng],
        [bbox.getSouthWest().lat, bbox.getSouthWest().lng]
    ]).addTo(map);
    map.fitBounds(poly.getBounds());
    L.marker(e.geocode.center).addTo(map)
        .bindPopup(e.geocode.name)
        .openPopup();
})
.addTo(map);


document.getElementById('search-btn').addEventListener('click', function() {
    var searchInput = document.getElementById('search-location').value;

    // Use Geocoder to find the location
    L.Control.Geocoder.nominatim().geocode(searchInput, function(results) {
        if (results.length > 0) {
            var result = results[0];
            map.setView(result.center, 13);

            L.marker(result.center).addTo(map)
                .bindPopup(result.name)
                .openPopup();
        } else {
            alert('Location not found');
        }
    });
});

