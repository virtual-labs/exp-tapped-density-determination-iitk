// json-results-handler.js - Direct JSON data fetcher for tapping results

// Global variable to store the raw JSON data
let rawJsonData = null;

// Load the JSON data when the page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('Loading JSON data for tapping results...');

  // Fetch the JSON data
  fetch('tapped_density_sample_data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('JSON data loaded successfully');
      rawJsonData = data;
      console.log('Sample data entry:', data[0]);
    })
    .catch(error => {
      console.error('Error loading JSON data:', error);
    });
});

// Override the showResults function in tapping.js
// This will be called when the tapping is complete
const originalShowResults = window.showResults;
window.showResults = function() {
  console.log('Overridden showResults called from json-results-handler.js');

  // Get the selected values
  const chemicalNameField = document.getElementById('chemicalName');
  const sampleWeightField = document.getElementById('sampleWeight');
  const tapCountField = document.getElementById('tapCount');

  if (!chemicalNameField || !sampleWeightField || !tapCountField) {
    console.error('Required fields not found:', {
      chemicalNameField: !!chemicalNameField,
      sampleWeightField: !!sampleWeightField,
      tapCountField: !!tapCountField
    });
    return;
  }

  const chemicalName = chemicalNameField.value;
  const sampleWeight = parseInt(sampleWeightField.value);
  const tapCount = parseInt(tapCountField.value);

  console.log('Selected values:', {
    chemicalName,
    sampleWeight,
    tapCount,
    chemicalNameType: typeof chemicalName,
    sampleWeightType: typeof sampleWeight,
    tapCountType: typeof tapCount
  });

  // Check if the values are valid
  if (!chemicalName || isNaN(sampleWeight) || isNaN(tapCount)) {
    console.error('Invalid values:', { chemicalName, sampleWeight, tapCount });

    // Call the original showResults function as fallback
    if (originalShowResults && typeof originalShowResults === 'function') {
      console.log('Using original showResults as fallback due to invalid values...');
      originalShowResults();
    }
    return;
  }

  // Find the exact matching entry in the JSON data
  if (rawJsonData) {
    console.log('Searching for matching entry in JSON data...');
    console.log('Raw JSON data sample:', rawJsonData.slice(0, 2));

    // Find the exact match
    const exactMatch = findExactMatch(chemicalName, sampleWeight, tapCount);

    if (exactMatch) {
      console.log('Found exact match in JSON data:', exactMatch);

      // Update the measurement panel with the exact values from the JSON
      updateMeasurementPanel(exactMatch);
    } else {
      console.log('No exact match found, trying to find closest match...');

      // Find the closest match
      const closestMatch = findClosestMatch(chemicalName, sampleWeight, tapCount);

      if (closestMatch) {
        console.log('Found closest match in JSON data:', closestMatch);

        // Update the measurement panel with the values from the closest match
        updateMeasurementPanel(closestMatch);
      } else {
        console.error('No match found in JSON data');

        // Call the original showResults function as fallback
        if (originalShowResults && typeof originalShowResults === 'function') {
          console.log('Using original showResults as fallback...');
          originalShowResults();
        }
      }
    }
  } else {
    console.error('JSON data not loaded yet');

    // Call the original showResults function as fallback
    if (originalShowResults && typeof originalShowResults === 'function') {
      console.log('Using original showResults as fallback...');
      originalShowResults();
    }
  }

  // Don't call the original showResults function if we've already updated the panel
  // This prevents the original function from overwriting our values
};

// Function to find an exact match in the JSON data
function findExactMatch(chemicalName, sampleWeight, tapCount) {
  if (!rawJsonData) {
    console.error('Raw JSON data not loaded');
    return null;
  }

  console.log('Finding exact match for:', { chemicalName, sampleWeight, tapCount });
  console.log('Raw JSON data length:', rawJsonData.length);
  console.log('First entry in raw JSON data:', rawJsonData[0]);

  // Clean up the chemical name for comparison
  const cleanChemicalName = cleanupChemicalName(chemicalName);
  console.log('Cleaned chemical name:', cleanChemicalName);

  // Find an exact match
  const exactMatch = rawJsonData.find(entry => {
    const entryChemicalName = cleanupChemicalName(entry['Sample']);
    const weightMatches = entry['Weight (g)'] === sampleWeight;
    const tapsMatch = entry['Taps'] === tapCount;

    // Check if the chemical names match (either exact match or one contains the other)
    const nameMatches = entryChemicalName === cleanChemicalName ||
                       entryChemicalName.includes(cleanChemicalName) ||
                       cleanChemicalName.includes(entryChemicalName);

    console.log('Comparing with entry:', {
      sample: entry['Sample'],
      cleanedSample: entryChemicalName,
      weight: entry['Weight (g)'],
      taps: entry['Taps'],
      nameMatches: nameMatches,
      weightMatches: weightMatches,
      tapsMatch: tapsMatch
    });

    return (
      nameMatches &&
      weightMatches &&
      tapsMatch
    );
  });

  if (exactMatch) {
    console.log('Found exact match:', exactMatch);
  } else {
    console.log('No exact match found');
  }

  return exactMatch;
}

// Function to find the closest match in the JSON data
function findClosestMatch(chemicalName, sampleWeight, tapCount) {
  if (!rawJsonData) {
    console.error('Raw JSON data not loaded');
    return null;
  }

  console.log('Finding closest match for:', { chemicalName, sampleWeight, tapCount });

  // Clean up the chemical name for comparison
  const cleanChemicalName = cleanupChemicalName(chemicalName);
  console.log('Cleaned chemical name for closest match:', cleanChemicalName);

  // First, filter by chemical name
  const chemicalMatches = rawJsonData.filter(entry => {
    const entryChemicalName = cleanupChemicalName(entry['Sample']);
    const nameMatches = entryChemicalName === cleanChemicalName ||
                       entryChemicalName.includes(cleanChemicalName) ||
                       cleanChemicalName.includes(entryChemicalName);
    return nameMatches;
  });

  console.log(`Found ${chemicalMatches.length} chemical matches`);

  if (chemicalMatches.length === 0) {
    console.error('No chemical matches found');
    return null;
  }

  // Then find the closest match by weight and tap count
  let closestMatch = chemicalMatches[0];
  let minDifference = Infinity;

  for (const entry of chemicalMatches) {
    const weightDiff = Math.abs(entry['Weight (g)'] - sampleWeight);
    const tapDiff = Math.abs(entry['Taps'] - tapCount);
    const totalDiff = weightDiff + tapDiff;

    console.log('Comparing entry:', {
      sample: entry['Sample'],
      weight: entry['Weight (g)'],
      taps: entry['Taps'],
      weightDiff,
      tapDiff,
      totalDiff
    });

    if (totalDiff < minDifference) {
      minDifference = totalDiff;
      closestMatch = entry;
    }
  }

  console.log('Closest match found:', closestMatch);

  return closestMatch;
}

// Function to clean up chemical name for comparison
function cleanupChemicalName(name) {
  if (!name) return '';

  // Convert to lowercase and remove special characters
  let cleanName = name.toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ')    // Replace multiple spaces with a single space
    .trim();                 // Remove leading/trailing spaces

  // Map common chemical names to their JSON format
  const chemicalNameMap = {
    'calcium carbonate caco3': 'calcium carbonate',
    'calcium carbonate': 'calcium carbonate',
    'talc': 'talc',
    'lactose monohydrate': 'lactose monohydrate',
    'magnesium stearate': 'magnesium stearate',
    'microcrystalline cellulose mcc': 'microcrystalline cellulose',
    'microcrystalline cellulose': 'microcrystalline cellulose',
    'starch maizecorn': 'starch',
    'starch': 'starch',
    'dicalcium phosphate': 'dicalcium phosphate',
    'citric acid powdered': 'citric acid',
    'citric acid': 'citric acid',
    'mannitol crystalline': 'mannitol',
    'mannitol': 'mannitol',
    'silica colloidal': 'silica',
    'silica': 'silica'
  };

  // Return the mapped name if it exists, otherwise return the cleaned name
  return chemicalNameMap[cleanName] || cleanName;
}

// Function to update the measurement panel with values from the JSON
function updateMeasurementPanel(data) {
  if (!data) {
    console.error('No data provided to update measurement panel');
    return;
  }

  console.log('Updating measurement panel with data:', JSON.stringify(data, null, 2));

  // Get all keys from the data object
  const keys = Object.keys(data);
  console.log('Available keys in data:', keys);

  // Log the raw values for each key
  keys.forEach(key => {
    console.log(`Key: "${key}", Value: ${data[key]}, Type: ${typeof data[key]}`);
  });

  // Find the keys for bulk density, tapped density, bulk volume, and tapped volume
  const bulkDensityKey = keys.find(key => key.includes('Bulk') && key.includes('Density'));
  const tappedDensityKey = keys.find(key => key.includes('Tapped') && key.includes('Density'));
  const bulkVolumeKey = keys.find(key => key.includes('Bulk') && key.includes('Volume'));
  const tappedVolumeKey = keys.find(key => key.includes('Tapped') && key.includes('Volume'));

  console.log('Found keys:', { bulkDensityKey, tappedDensityKey, bulkVolumeKey, tappedVolumeKey });

  // Log the raw values for the found keys
  if (bulkDensityKey) console.log(`Raw bulk density value: ${data[bulkDensityKey]}, Type: ${typeof data[bulkDensityKey]}`);
  if (tappedDensityKey) console.log(`Raw tapped density value: ${data[tappedDensityKey]}, Type: ${typeof data[tappedDensityKey]}`);
  if (bulkVolumeKey) console.log(`Raw bulk volume value: ${data[bulkVolumeKey]}, Type: ${typeof data[bulkVolumeKey]}`);
  if (tappedVolumeKey) console.log(`Raw tapped volume value: ${data[tappedVolumeKey]}, Type: ${typeof data[tappedVolumeKey]}`);

  // Update bulk density
  const bulkDensityField = document.getElementById('bulkDensity');
  if (bulkDensityField && bulkDensityKey) {
    // Convert to string explicitly to ensure proper display
    const bulkDensityValue = String(data[bulkDensityKey]);
    bulkDensityField.value = bulkDensityValue + ' g/cm³';
    console.log('Bulk density updated to:', bulkDensityField.value);
  } else {
    console.error('Could not update bulk density:', {
      fieldExists: !!bulkDensityField,
      keyExists: !!bulkDensityKey,
      keyValue: bulkDensityKey ? data[bulkDensityKey] : 'N/A'
    });
  }

  // Update tapped density
  const tappedDensityField = document.getElementById('tappedDensity');
  if (tappedDensityField && tappedDensityKey) {
    // Convert to string explicitly to ensure proper display
    const tappedDensityValue = String(data[tappedDensityKey]);
    tappedDensityField.value = tappedDensityValue + ' g/cm³';
    console.log('Tapped density updated to:', tappedDensityField.value);
  } else {
    console.error('Could not update tapped density:', {
      fieldExists: !!tappedDensityField,
      keyExists: !!tappedDensityKey,
      keyValue: tappedDensityKey ? data[tappedDensityKey] : 'N/A'
    });
  }

  // Update bulk volume
  const bulkVolumeField = document.getElementById('bulkVolume');
  if (bulkVolumeField && bulkVolumeKey) {
    // Convert to string explicitly to ensure proper display
    const bulkVolumeValue = String(data[bulkVolumeKey]);
    bulkVolumeField.value = bulkVolumeValue + ' cm³';
    console.log('Bulk volume updated to:', bulkVolumeField.value);
  } else {
    console.error('Could not update bulk volume:', {
      fieldExists: !!bulkVolumeField,
      keyExists: !!bulkVolumeKey,
      keyValue: bulkVolumeKey ? data[bulkVolumeKey] : 'N/A'
    });
  }

  // Update tapped volume
  const tappedVolumeField = document.getElementById('tappedVolume');
  if (tappedVolumeField && tappedVolumeKey) {
    // Convert to string explicitly to ensure proper display
    const tappedVolumeValue = String(data[tappedVolumeKey]);
    tappedVolumeField.value = tappedVolumeValue + ' cm³';
    console.log('Tapped volume updated to:', tappedVolumeField.value);
  } else {
    console.error('Could not update tapped volume:', {
      fieldExists: !!tappedVolumeField,
      keyExists: !!tappedVolumeKey,
      keyValue: tappedVolumeKey ? data[tappedVolumeKey] : 'N/A'
    });
  }

  // Show a success message in the instruction box
  document.getElementById('instructionText').innerText = 'Simulation completed! Results are displayed in the measurement panel.';
}

// Function to find and display results
function findAndDisplayResults() {
  // Get the selected values
  const chemicalName = document.getElementById('chemicalName').value;
  const sampleWeight = parseInt(document.getElementById('sampleWeight').value);
  const tapCount = parseInt(document.getElementById('tapCount').value);

  console.log('Finding and displaying results for:', { chemicalName, sampleWeight, tapCount });

  // Find the exact match
  const exactMatch = findExactMatch(chemicalName, sampleWeight, tapCount);

  if (exactMatch) {
    console.log('Found exact match in JSON data:', exactMatch);
    updateMeasurementPanel(exactMatch);
  } else {
    console.log('No exact match found, trying to find closest match...');

    // Find the closest match
    const closestMatch = findClosestMatch(chemicalName, sampleWeight, tapCount);

    if (closestMatch) {
      console.log('Found closest match in JSON data:', closestMatch);
      updateMeasurementPanel(closestMatch);
    } else {
      console.error('No match found in JSON data');
    }
  }
}
