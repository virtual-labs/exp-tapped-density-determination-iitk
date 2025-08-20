// This is a direct fix for the volume display issue
// It will be called after the tapping is complete

function fixVolumeDisplay() {
  console.log("Fixing volume display...");

  // Get the volume fields
  const bulkVolumeField = document.getElementById('bulkVolume');
  const tappedVolumeField = document.getElementById('tappedVolume');

  // Check if the volume fields already have meaningful values
  if (bulkVolumeField.value && bulkVolumeField.value.trim() !== '' &&
      tappedVolumeField.value && tappedVolumeField.value.trim() !== '') {
    console.log("Volume fields already populated with values:",
               bulkVolumeField.value, tappedVolumeField.value);
    return;
  }

  console.log("Volume fields empty or incomplete, applying fix...");

  // Get the current density values
  const bulkDensityText = document.getElementById('bulkDensity').value;
  const tappedDensityText = document.getElementById('tappedDensity').value;

  console.log("Current density values:", bulkDensityText, tappedDensityText);

  // Extract the numeric values
  // Use regex to extract the number from the text (e.g., "0.89 g/cm³" -> 0.89)
  let bulkDensity = parseFloat(bulkDensityText.replace(/[^\d.]/g, ''));
  let tappedDensity = parseFloat(tappedDensityText.replace(/[^\d.]/g, ''));

  // Get the sample weight
  const sampleWeight = parseInt(document.getElementById('sampleWeight').value);
  console.log("Sample weight:", sampleWeight);

  // If we couldn't parse the density values, use fallback calculation
  if (isNaN(bulkDensity) || bulkDensity <= 0) {
    console.log("Invalid bulk density value, using fallback calculation");
    bulkDensity = sampleWeight / 100; // Simple approximation
  }

  if (isNaN(tappedDensity) || tappedDensity <= 0) {
    console.log("Invalid tapped density value, using fallback calculation");
    // Get the tap count
    const tapCount = parseInt(document.getElementById('tapCount').value) || 100;
    const tapFactor = Math.min(1.0 + (tapCount / 500) * 0.2, 1.2); // Max 20% increase
    tappedDensity = bulkDensity * tapFactor;
  }

  console.log("Using density values:", { bulkDensity, tappedDensity });

  // Calculate volumes
  const bulkVolume = (sampleWeight / bulkDensity).toFixed(2);
  const tappedVolume = (sampleWeight / tappedDensity).toFixed(2);

  console.log("Calculated volumes:", bulkVolume, tappedVolume);

  // Update the volume fields
  bulkVolumeField.value = bulkVolume + " cm³";
  tappedVolumeField.value = tappedVolume + " cm³";

  console.log("Volume fields updated");
}

// Make sure our override happens after all scripts are loaded
document.addEventListener('DOMContentLoaded', function() {
  // Wait a bit to ensure all other scripts have initialized
  setTimeout(function() {
    console.log("Applying showResults override...");

    // Store the original function
    const originalShowResults = window.showResults;

    // Override the showResults function
    window.showResults = function() {
      console.log("Overridden showResults called");

      // Call the original function
      if (originalShowResults) {
        originalShowResults();
      }

      // Fix the volume display
      setTimeout(fixVolumeDisplay, 1000); // Wait longer to ensure the density values are fully updated
    };

    console.log("showResults successfully overridden");

    // Also add a direct call to the tapping completion handler
    const startTappingBtn = document.getElementById('startTappingBtn');
    if (startTappingBtn) {
      // Add our listener without affecting any existing ones
      startTappingBtn.addEventListener('click', function() {
        // This will run after the tapping is complete
        setTimeout(function() {
          console.log("Checking if volumes need to be fixed after tapping...");
          fixVolumeDisplay();
        }, 5000); // Wait 5 seconds after clicking the start button
      });
    }
  }, 500); // Wait 500ms after DOM is loaded
});
