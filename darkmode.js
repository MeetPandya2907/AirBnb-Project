// Dark Mode Functionality

// Create toggle button element
function createDarkModeToggle() {
  const toggleButton = document.createElement('button');
  toggleButton.className = 'dark-mode-toggle';
  toggleButton.id = 'darkModeToggle';
  toggleButton.setAttribute('aria-label', 'Toggle dark mode');
  toggleButton.innerHTML = `
    <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/>
    </svg>
    <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 9c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0 -1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06z"/>
    </svg>
  `;
  document.body.appendChild(toggleButton);
  return toggleButton;
}

// Apply dark mode based on saved preference or system preference
function applyDarkMode() {
  // Check for saved preference
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Apply dark mode if saved preference is dark or if system prefers dark and no preference is saved
  if (isDarkMode || (prefersDarkMode && localStorage.getItem('darkMode') === null)) {
    document.body.classList.add('dark-mode');
    updateGoogleMapStyle(true);
  } else {
    document.body.classList.remove('dark-mode');
    updateGoogleMapStyle(false);
  }
}

// Toggle dark mode
function toggleDarkMode() {
  if (document.body.classList.contains('dark-mode')) {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'false');
    updateGoogleMapStyle(false);
  } else {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'true');
    updateGoogleMapStyle(true);
  }
}

// Update Google Maps style for dark mode
function updateGoogleMapStyle(isDark) {
  // Check if map exists
  const map = window.googleMap;
  if (!map) return;
  
  if (isDark) {
    // Dark mode style for Google Maps
    const darkMapStyle = [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
    ];
    map.setOptions({ styles: darkMapStyle });
  } else {
    // Reset to default style
    map.setOptions({ styles: [] });
  }
}

// Initialize dark mode
function initDarkMode() {
  // Apply initial theme
  applyDarkMode();
  
  // Create the toggle button
  const toggleButton = createDarkModeToggle();
  
  // Add event listener to toggle button
  toggleButton.addEventListener('click', toggleDarkMode);
  
  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only apply system preference if no user preference is saved
    if (localStorage.getItem('darkMode') === null) {
      if (e.matches) {
        document.body.classList.add('dark-mode');
        updateGoogleMapStyle(true);
      } else {
        document.body.classList.remove('dark-mode');
        updateGoogleMapStyle(false);
      }
    }
  });
  
  // Make global map initialization hook available
  window.initializeGoogleMap = function() {
    // Store map reference for later dark mode toggling
    window.googleMap = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 28.6139, lng: 77.2090 }, // Default to Delhi
      zoom: 12,
      mapTypeControl: false,
    });
    
    // Apply dark mode style to map if needed
    updateGoogleMapStyle(document.body.classList.contains('dark-mode'));
    
    // Add property markers
    if (window.propertyLocations) {
      addPropertyMarkers(window.propertyLocations);
    } else {
      // Default locations if none provided
      const defaultLocations = [
        { lat: 28.6139, lng: 77.2090, title: "Delhi, NCR", price: "₹1,19,139" },
        { lat: 19.0760, lng: 72.8777, title: "Mumbai, Maharashtra", price: "₹82,918" },
        { lat: 12.9716, lng: 77.5946, title: "Bangalore, Karnataka", price: "₹1,10,527" },
        { lat: 17.3850, lng: 78.4867, title: "Hyderabad, Telangana", price: "₹1,88,227" },
        { lat: 13.0827, lng: 80.2707, title: "Chennai, Tamil Nadu", price: "₹1,06,649" }
      ];
      addPropertyMarkers(defaultLocations);
    }
  };
  
  // Add markers to the map
  function addPropertyMarkers(locations) {
    locations.forEach(location => {
      const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: window.googleMap,
        title: location.title
      });
      
      // Create info window content
      const contentString = `
        <div style="padding: 10px; max-width: 200px;">
          <h3 style="margin: 0 0 8px; font-size: 16px;">${location.title}</h3>
          <p style="margin: 0; font-size: 14px;">${location.price}</p>
        </div>
      `;
      
      const infowindow = new google.maps.InfoWindow({
        content: contentString,
      });
      
      marker.addListener("click", () => {
        infowindow.open({
          anchor: marker,
          map: window.googleMap,
        });
      });
    });
  }
}

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDarkMode);
} else {
  initDarkMode();
} 