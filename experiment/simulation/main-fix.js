// This script adds a direct fix to the main.js file
// It will be loaded after all other scripts

console.log("Loading main-fix.js...");

// Wait for the page to fully load
document.addEventListener('DOMContentLoaded', function() {
  // Wait a bit to ensure all other scripts have initialized
  setTimeout(function() {
    console.log("Applying main.js fix...");
    
    // Find the start tapping button
    const startTappingBtn = document.getElementById('startTappingBtn');
    if (startTappingBtn) {
      console.log("Found start tapping button, adding completion listener");
      
      // Store the original onclick handler
      const originalOnClick = startTappingBtn.onclick;
      
      // Replace the onclick handler with our own
      startTappingBtn.onclick = function(event) {
        console.log("Start tapping button clicked, will check for results later");
        
        // Call the original onclick handler if it exists
        if (originalOnClick) {
          originalOnClick.call(this, event);
        }
        
        // Check for results after the tapping animation completes
        // The animation takes about 5-10 seconds, so we'll check multiple times
        setTimeout(checkForResults, 5000);  // Check after 5 seconds
        setTimeout(checkForResults, 8000);  // Check after 8 seconds
        setTimeout(checkForResults, 12000); // Check after 12 seconds
      };
      
      console.log("Successfully replaced start tapping button onclick handler");
    }
  }, 1000);
});

// Function to check if results are displayed and fix volume values if needed
function checkForResults() {
  console.log("Checking for results...");
  
  // Get the density fields
  const bulkDensityField = document.getElementById('bulkDensity');
  const tappedDensityField = document.getElementById('tappedDensity');
  
  // Get the volume fields
  const bulkVolumeField = document.getElementById('bulkVolume');
  const tappedVolumeField = document.getElementById('tappedVolume');
  
  // Check if the density fields have values but the volume fields don't
  if (bulkDensityField && tappedDensityField && 
      bulkDensityField.value && tappedDensityField.value &&
      bulkVolumeField && tappedVolumeField &&
      (!bulkVolumeField.value || !tappedVolumeField.value)) {
    
    console.log("Density fields have values but volume fields don't, fixing...");
    
    // Get the density values
    const bulkDensityText = bulkDensityField.value;
    const tappedDensityText = tappedDensityField.value;
    
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
  } else {
    console.log("No need to fix volume fields:", {
      bulkDensityHasValue: bulkDensityField && bulkDensityField.value ? "Yes" : "No",
      tappedDensityHasValue: tappedDensityField && tappedDensityField.value ? "Yes" : "No",
      bulkVolumeHasValue: bulkVolumeField && bulkVolumeField.value ? "Yes" : "No",
      tappedVolumeHasValue: tappedVolumeField && tappedVolumeField.value ? "Yes" : "No"
    });
  }
}
