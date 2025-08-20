// start-popup.js - Handles the starting popup functionality

// Define the chemical density data
const chemicalDensityData = {
    "calcium-carbonate": {
        name: "Calcium Carbonate (CaCO₃)",
        bulkDensity: { min: 0.85, max: 1.00 },
        tappedDensity: { min: 1.35, max: 1.50 }
    },
    "talc": {
        name: "Talc",
        bulkDensity: { min: 0.30, max: 0.50 },
        tappedDensity: { min: 0.60, max: 0.90 }
    },
    "lactose-monohydrate": {
        name: "Lactose Monohydrate",
        bulkDensity: { min: 0.55, max: 0.75 },
        tappedDensity: { min: 0.85, max: 0.95 }
    },
    "magnesium-stearate": {
        name: "Magnesium Stearate",
        bulkDensity: { min: 0.15, max: 0.30 },
        tappedDensity: { min: 0.35, max: 0.50 }
    },
    "microcrystalline-cellulose": {
        name: "Microcrystalline Cellulose (MCC)",
        bulkDensity: { min: 0.25, max: 0.35 },
        tappedDensity: { min: 0.40, max: 0.60 }
    },
    "starch": {
        name: "Starch (maize/corn)",
        bulkDensity: { min: 0.50, max: 0.60 },
        tappedDensity: { min: 0.65, max: 0.85 }
    },
    "dicalcium-phosphate": {
        name: "Dicalcium Phosphate",
        bulkDensity: { min: 0.70, max: 0.85 },
        tappedDensity: { min: 1.00, max: 1.20 }
    },
    "citric-acid": {
        name: "Citric Acid (powdered)",
        bulkDensity: { min: 0.75, max: 0.85 },
        tappedDensity: { min: 1.00, max: 1.15 }
    },
    "mannitol": {
        name: "Mannitol (crystalline)",
        bulkDensity: { min: 0.40, max: 0.55 },
        tappedDensity: { min: 0.65, max: 0.80 }
    },
    "silica": {
        name: "Silica (colloidal)",
        bulkDensity: { min: 0.05, max: 0.10 },
        tappedDensity: { min: 0.15, max: 0.20 }
    }
};

// Global variable to store the selected chemical data
let selectedChemicalData = null;

// Initialize the start popup when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing start popup');

    // Make sure the start popup is visible
    const startPopup = document.getElementById('startPopup');
    if (startPopup) {
        // Update the popup title to match requirements
        const popupTitle = startPopup.querySelector('h2');
        if (popupTitle) {
            popupTitle.textContent = 'Select the values and click OK to perform the experiment.';
        }

        startPopup.style.display = 'flex';

        // Start1 audio removed as requested
    }
});

// Function to handle the OK button click
document.getElementById('startOkBtn').addEventListener('click', function() {
    console.log('Start OK button clicked');

    // Get the selected values
    const chemicalSelect = document.getElementById('chemicalSelect');
    const chemicalValue = chemicalSelect.value;
    const chemicalName = chemicalSelect.options[chemicalSelect.selectedIndex].text;

    const sampleWeight = document.getElementById('popupSampleWeight').value;
    const tapCount = document.getElementById('popupTapCount').value;

    console.log('Selected values:', { chemicalName, sampleWeight, tapCount });

    // Store the selected chemical data
    selectedChemicalData = chemicalDensityData[chemicalValue];

    // Update the measurement section
    document.getElementById('chemicalName').value = selectedChemicalData.name; // Use the full name from our data
    document.getElementById('sampleWeight').value = sampleWeight;
    document.getElementById('tapCount').value = tapCount;

    // Store the chemical value as a data attribute for mapping in results handler
    document.getElementById('chemicalName').setAttribute('data-value', chemicalValue);

    // Update the sample name in the h1 element
    const sampleNameH1 = document.querySelector('.sample-name h1');
    if (sampleNameH1) {
        sampleNameH1.innerText = chemicalName;
        console.log('Updated sample name h1 to:', chemicalName);
    }

    // Hide the popup
    document.getElementById('startPopup').style.display = 'none';
    console.log('Popup hidden successfully');

    // Set the current step to 1 to start the simulation
    if (typeof currentStep !== 'undefined') {
        currentStep = 1;
        window.currentStep = 1; // Make sure the global variable is updated

        // Update the instruction text
        if (typeof updateInstructionText === 'function') {
            updateInstructionText();
        }

        // Play the startSimulation2 audio for step 1
        console.log('Playing startSimulation2 audio for step 1');
        const audio = document.getElementById('instructionAudio');
        if (audio) {
            audio.src = 'audio/startSimulation2.mp3';
            audio.play().catch(error => {
                console.error('Audio playback error:', error);
            });
        }
    }
});

// Function to calculate density based on the selected chemical
function calculateDensity(weight, taps) {
    if (!selectedChemicalData) return { bulk: weight, tapped: weight };

    // Calculate bulk density based on the selected chemical's properties
    // For simulation purposes, we'll use the average of min and max
    const avgBulkDensity = (selectedChemicalData.bulkDensity.min + selectedChemicalData.bulkDensity.max) / 2;

    // Calculate tapped density based on the number of taps
    // The more taps, the closer to the max tapped density
    const tapFactor = Math.min(taps / 500, 1); // Normalize taps (0-1)
    const tappedDensityRange = selectedChemicalData.tappedDensity.max - selectedChemicalData.tappedDensity.min;
    const tappedDensity = selectedChemicalData.tappedDensity.min + (tappedDensityRange * tapFactor);

    return {
        bulk: avgBulkDensity,
        tapped: tappedDensity
    };
}

// Function to reset the simulation to its initial state (simplified version)
function resetSimulation() {
    // This is a placeholder function that will be defined in reset.js
    console.log('Reset function called');
}

// Set up event listeners for buttons
document.addEventListener('DOMContentLoaded', function() {
    // Note: We're not defining showResults here anymore
    // It's now defined in results-handler-fixed.js
    console.log('Setting up button event listeners');

    // Set up event listener for the finish button
    const finishBtn = document.getElementById('finishBtn');
    if (finishBtn) {
        finishBtn.addEventListener('click', function() {
            console.log('Finish button clicked');

            // Hide the results popup
            const resultsPopup = document.getElementById('resultsPopup');
            resultsPopup.style.display = 'none';

            // Show the start popup again
            const startPopup = document.getElementById('startPopup');
            startPopup.style.display = 'flex';

            // Reset the sample ID and spatula trips flag
            window.currentSampleId = 1;
            window.spatulaTripsStarted = false;
        });
    }

    // Set up event listener for the restart button
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
        restartBtn.addEventListener('click', function() {
            console.log('Restart button clicked');

            // Hide the results popup
            const resultsPopup = document.getElementById('resultsPopup');
            resultsPopup.style.display = 'none';

            // Reset the sample ID and spatula trips flag
            window.currentSampleId = 1;
            window.spatulaTripsStarted = false;
        });
    }
});
