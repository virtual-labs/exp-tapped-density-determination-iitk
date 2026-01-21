// results-handler.js - Handles fetching and displaying results from the JSON data file

// Global variable to store the loaded data
let tappedDensityData = null;

// Function to load the JSON data
async function loadTappedDensityData() {
    try {
        // First try to load the test data for debugging
        try {
            const testResponse = await fetch('test_data.json');
            if (testResponse.ok) {
                const testData = await testResponse.json();
                console.log('Test data loaded successfully:', testData);
                // Process the test data
                tappedDensityData = processRawData(testData);
                console.log('Test data processed successfully');
                return; // Exit early if test data is loaded
            }
        } catch (testError) {
            console.warn('Test data not found, using main data file');
        }

        // Load the main data file
        const response = await fetch('tapped_density_sample_data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const rawData = await response.json();
        console.log('Tapped density data loaded successfully');

        // Process the raw data into a more usable format
        tappedDensityData = processRawData(rawData);
        console.log('Tapped density data processed successfully');
    } catch (error) {
        console.error('Error loading tapped density data:', error);
    }
}

// Function to process the raw JSON data into a more usable format
function processRawData(rawData) {
    const processedData = {};

    // Process each entry in the raw data
    for (let i = 0; i < rawData.length; i++) {
        const entry = rawData[i];

        // Debug: Log the raw entry to see what we're working with
        console.log('Processing entry:', entry);
        console.log('Entry keys:', Object.keys(entry));

        // Extract the key data
        const chemicalName = entry['Sample'];
        const weight = entry['Weight (g)'];
        const taps = entry['Taps'];

        console.log('Extracted data:', { chemicalName, weight, taps });

        // Create the chemical entry if it doesn't exist
        if (!processedData[chemicalName]) {
            processedData[chemicalName] = {};
        }

        // Create the weight entry if it doesn't exist
        if (!processedData[chemicalName][weight]) {
            processedData[chemicalName][weight] = {};
        }

        // Get all keys from the entry to find the correct ones
        const keys = Object.keys(entry);
        console.log('All keys in entry:', keys);

        // Find the keys for bulk density, tapped density, bulk volume, and tapped volume
        const bulkDensityKey = keys.find(key => key.includes('Bulk') && key.includes('Density'));
        const tappedDensityKey = keys.find(key => key.includes('Tapped') && key.includes('Density'));
        const bulkVolumeKey = keys.find(key => key.includes('Bulk') && key.includes('Volume'));
        const tappedVolumeKey = keys.find(key => key.includes('Tapped') && key.includes('Volume'));

        console.log('Found keys:', { bulkDensityKey, tappedDensityKey, bulkVolumeKey, tappedVolumeKey });

        // Extract all the values using the found keys
        const bulkDensity = entry[bulkDensityKey];
        const tappedDensity = entry[tappedDensityKey];
        const bulkVolume = entry[bulkVolumeKey];
        const tappedVolume = entry[tappedVolumeKey];

        console.log('Extracted values:', { bulkDensity, tappedDensity, bulkVolume, tappedVolume });

        // Create the result object
        const result = {
            bulk_density: bulkDensity,
            tapped_density: tappedDensity,
            bulk_volume: bulkVolume,
            tapped_volume: tappedVolume
        };

        console.log('Created result object:', result);

        // Add the result to the processed data
        processedData[chemicalName][weight][taps] = result;
    }

    // Debug: Log a sample of the processed data
    if (Object.keys(processedData).length > 0) {
        const sampleChemical = Object.keys(processedData)[0];
        const sampleWeight = Object.keys(processedData[sampleChemical])[0];
        const sampleTaps = Object.keys(processedData[sampleChemical][sampleWeight])[0];
        console.log('Sample processed data:', processedData[sampleChemical][sampleWeight][sampleTaps]);
    }

    return processedData;
}

// Function to find the closest tap count in the data
function findClosestTapCount(data, targetTapCount) {
    // Get all available tap counts
    const tapCounts = Object.keys(data).map(Number);

    // Find the closest tap count
    let closestTapCount = tapCounts.reduce((prev, curr) => {
        return (Math.abs(curr - targetTapCount) < Math.abs(prev - targetTapCount) ? curr : prev);
    });

    return closestTapCount.toString();
}

// Function to find the closest weight in the data
function findClosestWeight(data, targetWeight) {
    // Get all available weights
    const weights = Object.keys(data).map(Number);

    // Find the closest weight
    let closestWeight = weights.reduce((prev, curr) => {
        return (Math.abs(curr - targetWeight) < Math.abs(prev - targetWeight) ? curr : prev);
    });

    return closestWeight.toString();
}

// Function to get results based on chemical name, sample weight, and tap count
function getResults(chemicalName, sampleWeight, tapCount) {
    if (!tappedDensityData) {
        console.error('Data not loaded');
        return null;
    }

    console.log('Getting results for:', { chemicalName, sampleWeight, tapCount });
    console.log('Available chemicals:', Object.keys(tappedDensityData));

    // Find the chemical in the data
    // Try to find an exact match first
    let foundChemical = null;
    for (const chemical in tappedDensityData) {
        if (chemical.toLowerCase() === chemicalName.toLowerCase()) {
            foundChemical = chemical;
            console.log('Found exact match for chemical:', chemical);
            break;
        }
    }

    // If no exact match, try to find a partial match
    if (!foundChemical) {
        for (const chemical in tappedDensityData) {
            if (chemical.toLowerCase().includes(chemicalName.toLowerCase()) ||
                chemicalName.toLowerCase().includes(chemical.toLowerCase())) {
                foundChemical = chemical;
                console.log('Found partial match for chemical:', chemical);
                break;
            }
        }
    }

    if (!foundChemical) {
        console.error('Chemical not found:', chemicalName);
        return null;
    }

    // Find the closest weight in the data
    const availableWeights = Object.keys(tappedDensityData[foundChemical]).map(Number);
    console.log('Available weights for', foundChemical, ':', availableWeights);
    const closestWeight = findClosestWeight(tappedDensityData[foundChemical], sampleWeight);
    console.log('Closest weight found:', closestWeight);

    // Find the closest tap count in the data
    const tapData = tappedDensityData[foundChemical][closestWeight];
    console.log('Tap data for weight', closestWeight, ':', tapData);
    const availableTapCounts = Object.keys(tapData).map(Number);
    console.log('Available tap counts:', availableTapCounts);
    const closestTapCount = findClosestTapCount(tapData, tapCount);
    console.log('Closest tap count found:', closestTapCount);

    // Get the results
    const results = tapData[closestTapCount];

    console.log(`Found results for ${foundChemical}, weight: ${closestWeight}g, taps: ${closestTapCount}`);
    console.log('Results object:', results);
    console.log('Results keys:', results ? Object.keys(results) : 'No results');
    console.log('Bulk volume:', results ? results.bulk_volume : 'N/A');
    console.log('Tapped volume:', results ? results.tapped_volume : 'N/A');
    return results;
}

// Function to update the measurement panel with results
function updateResultsDisplay(results) {
    if (!results) {
        console.error('No results to display');
        return;
    }

    console.log('Updating display with results:', results);
    console.log('Bulk density:', results.bulk_density);
    console.log('Tapped density:', results.tapped_density);
    console.log('Bulk volume:', results.bulk_volume);
    console.log('Tapped volume:', results.tapped_volume);

    // Check if the elements exist
    const bulkDensityElement = document.getElementById('bulkDensity');
    const tappedDensityElement = document.getElementById('tappedDensity');
    const bulkVolumeElement = document.getElementById('bulkVolume');
    const tappedVolumeElement = document.getElementById('tappedVolume');

    console.log('Elements found:', {
        bulkDensity: bulkDensityElement ? 'Yes' : 'No',
        tappedDensity: tappedDensityElement ? 'Yes' : 'No',
        bulkVolume: bulkVolumeElement ? 'Yes' : 'No',
        tappedVolume: tappedVolumeElement ? 'Yes' : 'No'
    });

    // Update the measurement panel
    try {
        // Update density values
        if (bulkDensityElement) {
            bulkDensityElement.value = results.bulk_density + ' g/cm³';
            console.log('Bulk density updated to:', bulkDensityElement.value);
        } else {
            console.error('Bulk density element not found');
        }

        if (tappedDensityElement) {
            tappedDensityElement.value = results.tapped_density + ' g/cm³';
            console.log('Tapped density updated to:', tappedDensityElement.value);
        } else {
            console.error('Tapped density element not found');
        }

        // Update volume values
        if (bulkVolumeElement) {
            bulkVolumeElement.value = results.bulk_volume + ' cm³';
            console.log('Bulk volume updated to:', bulkVolumeElement.value);
        } else {
            console.error('Bulk volume element not found');
        }

        if (tappedVolumeElement) {
            tappedVolumeElement.value = results.tapped_volume + ' cm³';
            console.log('Tapped volume updated to:', tappedVolumeElement.value);
        } else {
            console.error('Tapped volume element not found');
        }

        console.log('Results displayed in measurement panel successfully');
    } catch (error) {
        console.error('Error updating measurement panel:', error);
    }

    // Show a success message in the instruction box using the current language
    const dict = languageMap[currentLanguage] || languageMap['en'];
    document.getElementById('instructionText').innerText = dict.completed;

    // Add a restart button to the bottom panel with text in the current language
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
}

// Function to display results based on selected values
function displayResults() {
    // Get the selected values
    const chemicalName = document.getElementById('chemicalName').value;
    const sampleWeight = parseInt(document.getElementById('sampleWeight').value);
    const tapCount = parseInt(document.getElementById('tapCount').value);

    console.log(`Displaying results for ${chemicalName}, weight: ${sampleWeight}g, taps: ${tapCount}`);

    // Get the results
    const results = getResults(chemicalName, sampleWeight, tapCount);

    // Update the display
    if (results) {
        updateResultsDisplay(results);
    } else {
        console.warn('No results found, using fallback calculation');

        // Fallback calculation if no results are found
        const bulkDensity = sampleWeight / 100; // Simple approximation
        const tapFactor = Math.min(1.0 + (tapCount / 500) * 0.2, 1.2); // Max 20% increase
        const tappedDensity = bulkDensity * tapFactor;

        // Calculate volumes (weight / density)
        const bulkVolume = (sampleWeight / bulkDensity).toFixed(2);
        const tappedVolume = (sampleWeight / tappedDensity).toFixed(2);

        console.log('Fallback calculation results:', {
            bulkDensity: bulkDensity.toFixed(2),
            tappedDensity: tappedDensity.toFixed(2),
            bulkVolume,
            tappedVolume
        });

        // Create a fallback results object
        const fallbackResults = {
            bulk_density: bulkDensity.toFixed(2),
            tapped_density: tappedDensity.toFixed(2),
            bulk_volume: bulkVolume,
            tapped_volume: tappedVolume
        };

        // Update the display with the fallback results
        updateResultsDisplay(fallbackResults);
    }
}

// Load the data when the page loads
document.addEventListener('DOMContentLoaded', function() {
    loadTappedDensityData();
});

// Expose functions to the window object so they can be called from other scripts
window.displayResults = displayResults;
window.getResults = getResults;
window.updateResultsDisplay = updateResultsDisplay;
