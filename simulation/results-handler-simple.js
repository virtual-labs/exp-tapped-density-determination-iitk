// Simple results handler for bulk density simulation
// This file handles loading data from JSON and displaying results

// Sample data for testing (will be used if JSON file can't be loaded)
const sampleData = [
  {
    "chemical": "Calcium Carbonate",
    "weight": 50,
    "taps": 10,
    "bulk_density": 0.889,
    "tapped_density": 1.489,
    "bulk_volume": 56.24,
    "tapped_volume": 33.58
  },
  {
    "chemical": "Calcium Carbonate",
    "weight": 100,
    "taps": 100,
    "bulk_density": 0.92,
    "tapped_density": 1.53,
    "bulk_volume": 108.7,
    "tapped_volume": 65.36
  }
];

// Function to calculate and display results
function displayResults() {
  console.log("Displaying results...");
  
  // Get the selected values from the UI
  const chemicalName = document.getElementById('chemicalName').value;
  const sampleWeight = parseInt(document.getElementById('sampleWeight').value);
  const tapCount = parseInt(document.getElementById('tapCount').value);
  
  console.log(`Values from UI: chemical=${chemicalName}, weight=${sampleWeight}, taps=${tapCount}`);
  
  // Calculate results using simple formulas
  const bulkDensity = sampleWeight / 100; // Simple approximation
  const tapFactor = Math.min(1.0 + (tapCount / 500) * 0.2, 1.2); // Max 20% increase
  const tappedDensity = bulkDensity * tapFactor;
  
  // Calculate volumes (weight / density)
  const bulkVolume = (sampleWeight / bulkDensity).toFixed(2);
  const tappedVolume = (sampleWeight / tappedDensity).toFixed(2);
  
  // Create results object
  const results = {
    bulk_density: bulkDensity.toFixed(2),
    tapped_density: tappedDensity.toFixed(2),
    bulk_volume: bulkVolume,
    tapped_volume: tappedVolume
  };
  
  console.log("Calculated results:", results);
  
  // Update the UI with the results
  updateUI(results);
}

// Function to update the UI with results
function updateUI(results) {
  console.log("Updating UI with results:", results);
  
  // Update density values
  document.getElementById('bulkDensity').value = results.bulk_density + " g/cm³";
  document.getElementById('tappedDensity').value = results.tapped_density + " g/cm³";
  
  // Update volume values
  document.getElementById('bulkVolume').value = results.bulk_volume + " cm³";
  document.getElementById('tappedVolume').value = results.tapped_volume + " cm³";
  
  // Show completion message
  const dict = languageMap[currentLanguage] || languageMap['en'];
  document.getElementById('instructionText').innerText = dict.completed;
  
  // Update restart button
  const startBtn = document.getElementById('startSimulationBtn');
  startBtn.textContent = dict.restartBtn;
  startBtn.style.display = 'block';
  startBtn.onclick = function() {
    // Show the start popup again to restart
    document.getElementById('startPopup').style.display = 'flex';
    // Reset the simulation
    if (typeof resetSimulation === 'function') {
      resetSimulation();
    }
  };
  
  console.log("UI updated successfully");
}

// Make the function available globally
window.displayResults = displayResults;
