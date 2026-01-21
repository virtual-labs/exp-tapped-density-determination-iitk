// rotate-screen.js - Handles screen rotation for mobile and tablet devices

document.addEventListener('DOMContentLoaded', function() {
  // Get the rotate button
  const rotateButton = document.getElementById('rotateButton');
  const rotateContainer = document.querySelector('.rotate-container');
  
  // Check if we're on a mobile or tablet device
  const isMobileOrTablet = window.matchMedia('(max-width: 1023px)').matches;
  
  // Check if we're in portrait mode
  const isPortrait = window.matchMedia('(orientation: portrait)').matches;
  
  // Only show the rotate container on mobile/tablet in portrait mode
  if (isMobileOrTablet && isPortrait) {
    rotateContainer.style.display = 'flex';
  } else {
    rotateContainer.style.display = 'none';
  }
  
  // Add click event to the rotate button
  if (rotateButton) {
    rotateButton.addEventListener('click', function() {
      // Try to request full screen and then rotate
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen()
          .then(() => {
            // Try to rotate the screen to landscape
            if (screen.orientation && screen.orientation.lock) {
              screen.orientation.lock('landscape')
                .then(() => {
                  // Hide the rotate container after successful rotation
                  rotateContainer.style.display = 'none';
                })
                .catch(err => {
                  console.error('Screen orientation lock failed:', err);
                  // Show manual rotation instructions
                  alert('Please rotate your device manually to landscape mode');
                });
            } else {
              // If orientation API is not supported
              alert('Please rotate your device manually to landscape mode');
            }
          })
          .catch(err => {
            console.error('Fullscreen request failed:', err);
            // Try to rotate without fullscreen
            if (screen.orientation && screen.orientation.lock) {
              screen.orientation.lock('landscape')
                .catch(err => {
                  console.error('Screen orientation lock failed:', err);
                  alert('Please rotate your device manually to landscape mode');
                });
            } else {
              alert('Please rotate your device manually to landscape mode');
            }
          });
      } else {
        // If fullscreen API is not supported
        alert('Please rotate your device manually to landscape mode');
      }
    });
  }
  
  // Listen for orientation changes
  window.addEventListener('orientationchange', function() {
    // Check if we're in landscape mode after orientation change
    setTimeout(function() {
      const isLandscape = window.matchMedia('(orientation: landscape)').matches;
      if (isLandscape) {
        rotateContainer.style.display = 'none';
      } else {
        if (isMobileOrTablet) {
          rotateContainer.style.display = 'flex';
        }
      }
    }, 300); // Small delay to ensure orientation has changed
  });
  
  // Also listen for resize events (for when user rotates without orientation API)
  window.addEventListener('resize', function() {
    const isLandscape = window.matchMedia('(orientation: landscape)').matches;
    if (isLandscape) {
      rotateContainer.style.display = 'none';
    } else {
      if (isMobileOrTablet) {
        rotateContainer.style.display = 'flex';
      }
    }
  });
});
