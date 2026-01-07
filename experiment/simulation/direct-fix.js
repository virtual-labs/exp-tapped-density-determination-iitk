// This is a direct fix that will be loaded last to ensure it runs
console.log("Loading direct-fix.js...");

// Function to fix volume display
function directFixVolumeDisplay() {
  console.log("Direct fix for volume display running...");

  // Get the volume fields
  const bulkVolumeField = document.getElementById('bulkVolume');
  const tappedVolumeField = document.getElementById('tappedVolume');

  if (!bulkVolumeField || !tappedVolumeField) {
    console.log("Volume fields not found, will try again later");
    setTimeout(directFixVolumeDisplay, 1000);
    return;
  }

  // Check if the volume fields already have meaningful values
  if (bulkVolumeField.value && bulkVolumeField.value.trim() !== '' &&
      tappedVolumeField.value && tappedVolumeField.value.trim() !== '') {
    console.log("Volume fields already populated with values:",
               bulkVolumeField.value, tappedVolumeField.value);
    return;
  }

  console.log("Volume fields empty or incomplete, applying direct fix...");

  // Get the density values
  const bulkDensityField = document.getElementById('bulkDensity');
  const tappedDensityField = document.getElementById('tappedDensity');

  if (!bulkDensityField || !tappedDensityField) {
    console.log("Density fields not found, will try again later");
    setTimeout(directFixVolumeDisplay, 1000);
    return;
  }

  const bulkDensityText = bulkDensityField.value;
  const tappedDensityText = tappedDensityField.value;

  console.log("Current density values:", bulkDensityText, tappedDensityText);

  // Extract the numeric values
  // Use regex to extract the number from the text (e.g., "0.89 g/cm³" -> 0.89)
  let bulkDensity = parseFloat(bulkDensityText.replace(/[^\d.]/g, ''));
  let tappedDensity = parseFloat(tappedDensityText.replace(/[^\d.]/g, ''));

  // Get the sample weight
  const sampleWeightField = document.getElementById('sampleWeight');
  if (!sampleWeightField) {
    console.log("Sample weight field not found, will try again later");
    setTimeout(directFixVolumeDisplay, 1000);
    return;
  }

  const sampleWeight = parseInt(sampleWeightField.value);
  console.log("Sample weight:", sampleWeight);

  // If we couldn't parse the density values, use fallback calculation
  if (isNaN(bulkDensity) || bulkDensity <= 0) {
    console.log("Invalid bulk density value, using fallback calculation");
    bulkDensity = sampleWeight / 100; // Simple approximation
  }

  if (isNaN(tappedDensity) || tappedDensity <= 0) {
    console.log("Invalid tapped density value, using fallback calculation");
    // Get the tap count
    const tapCountField = document.getElementById('tapCount');
    const tapCount = tapCountField ? parseInt(tapCountField.value) : 100;
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

  console.log("Volume fields updated by direct fix");
}

// Do NOT run the direct fix when the page loads
// Only run it after tapping is complete

// Only run after tapping is complete
document.addEventListener('DOMContentLoaded', function() {
  // Wait for the page to fully load
  setTimeout(function() {
    console.log("Setting up direct fix for tapping completion...");

    // Find the original showResults function and override it
    const originalShowResults = window.showResults;
    if (originalShowResults) {
      window.showResults = function() {
        console.log("Overridden showResults called in direct-fix.js");

        // Call the original function first
        originalShowResults();

        // Then run our fix after a delay
        console.log("Scheduling direct fix after showResults...");
        setTimeout(directFixVolumeDisplay, 2000);
      };
      console.log("Successfully overridden showResults in direct-fix.js");
    } else {
      console.warn("Could not find showResults function to override");
    }
  }, 1000);
});
