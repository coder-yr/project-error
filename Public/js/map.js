// Initialize the map (set to a default location, here Mumbai)
var map = L.map('map').setView([19.0760, 72.8777], 13);  // Default to Mumbai

// Add OpenStreetMap tiles to the map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Handle search button click
document.getElementById('search-btn').addEventListener('click', function() {
    var searchInput = document.getElementById('search-location').value;  // Get the search input value

    if (searchInput) {
        const apiKey = '7e9d2709356a488198093e474522a9a2';  // Replace with your OpenCage API Key

        // Fetch geocoding data from OpenCage API
        fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(searchInput)}&key=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                if (data.results.length > 0) {
                    const { lat, lng } = data.results[0].geometry;  // Get the latitude and longitude
                    const { formatted } = data.results[0];         // Get the formatted address

                    // Update the map view and zoom to the new location
                    map.setView([lat, lng], 13);

                    // Add a marker on the map for the location
                    L.marker([lat, lng])
                        .addTo(map)
                        .bindPopup(`<b>${formatted}</b>`)  // Show the formatted address in the popup
                        .openPopup();
                } else {
                    alert('Location not found. Please try again.');
                }
            })
            .catch(error => {
                console.error('Geocoding error:', error);
                alert('There was an error fetching the location. Please try again later.');
            });
    } else {
        alert('Please enter a location to search.');
    }
});
