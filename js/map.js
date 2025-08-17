function initFreedomMap() {
    // Initialize the map with better view
    const map = L.map('freedomMap', {
        zoomControl: false,
        scrollWheelZoom: true, // Ensure this is true
        tap: false, // Add this to prevent touch conflicts
        dragging: true,
        doubleClickZoom: true,
        touchZoom: true,
        boxZoom: true
    }).setView([20.5937, 78.9629], 5);
    
    // Add this to ensure scroll works after interactions
    map.on('click', function() {
        if (map.scrollWheelZoom.enabled()) {
            map.scrollWheelZoom.disable();
        } else {
            map.scrollWheelZoom.enable();
        }
    });

    // Add tile layer with better contrast
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        className: 'map-tiles'
    }).addTo(map);

    // Custom zoom control with better styling
    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    // Load freedom movement locations with enhanced markers
    fetch('data/freedom-map.json')
        .then(response => response.json())
        .then(locations => {
            locations.forEach(location => {
                // Create custom icon with optional charkha for ashram
                const icon = L.divIcon({
                    html: `<div class="custom-marker" style="background-image: url('assets/images/map-markers/${location.type}.png')">
                        ${location.type === 'ashram' ? '<div class="charkha-icon"></div>' : ''}
                    </div>`,
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32],
                    className: `marker-${location.type}`
                });

                const marker = L.marker([location.lat, location.lng], {
                    icon: icon,
                    riseOnHover: true
                }).addTo(map);

                // Enhanced popup content
                const imageSrc = location.image
                    ? (location.image.startsWith('http') ? location.image : `assets/images/map-markers/${location.image}`)
                    : '';

                const popupContent = `
                    <div class="map-popup">
                        <h3>${location.title}</h3>
                        <p>${location.description}</p>
                        ${imageSrc ? `
                        <div class="popup-image" style="background-image: url('${imageSrc}'); background-size: cover; background-position: center; border-radius:8px; padding:10px;">
                            <img src="${imageSrc}" alt="${location.title}" style="width:100%; height:auto; border-radius:6px; display:block; box-shadow: 0 6px 18px rgba(0,0,0,0.18);">
                        </div>` : ''}
                        <div class="popup-footer">
                            <small>Click outside to close</small>
                        </div>
                    </div>
                `;

                marker.bindPopup(popupContent, {
                    maxWidth: 300,
                    minWidth: 200,
                    className: `popup-${location.type}`
                });

                // Add animation on click
                marker.on('click', function() {
                    this.setZIndexOffset(1000);
                    this._icon.classList.add('bounce-marker');
                    setTimeout(() => {
                        this._icon.classList.remove('bounce-marker');
                    }, 1000);
                });
            });
        });

    // Add scale control
    L.control.scale({
        position: 'bottomleft',
        imperial: false
    }).addTo(map);
}

function createPopupContent(location) {
    let content = `<strong style="font-family: 'Patriot One', cursive; font-size: 1.2em;">${location.title}</strong><br>
        <span>${location.description}</span>`;
    if (location.image) {
        content += `<br><img src="${location.image}" alt="${location.title}" style="max-width:200px; margin-top:8px; border-radius:8px;">`;
    }
    return content;
}