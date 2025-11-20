// language.js - English language text for the simulation

// Global variable to store current language (always English now)
let currentLanguage = 'en';

// Language dictionary - English only
const languageMap = {
    'en': {
        // Instruction text for each step
        step0: 'Welcome to the Bulk Density Simulation!',
        step1: 'Click on the \'Start Simulation\' button to begin.',
        step2: 'Click the button to turn ON the weighing scale.',
        step3: 'Click on the Petri dish to place it on the weighing scale.',
        step4: 'Click the \'Tare\' button to tare the weight.',
        step5: 'Click the powder box cap to open it.',
        step6: 'Click on the spatula to collect the sample.',
        step7: 'Click on the Petri dish to transfer the sample to the test tubes.',
        step8: 'Click the \'Start\' button to start tapping.',
        step9: 'Tapping completed. Results are displayed below.',
        completed: 'Simulation completed! Results are displayed in the measurement panel.',

        // UI elements
        step: 'Step',
        startBtn: 'Start Simulation',
        restartBtn: 'Restart Simulation',

        // Measurement panel
        measure: 'Measurements',
        chemical: 'Chemical Name',
        sample: 'Sample Weight (g)',
        bulk: 'Bulk Density',
        tapped: 'Tapped Density',
        bulkVolume: 'Bulk Volume (cm³)',
        tappedVolume: 'Tapped Volume (cm³)',
        tapCount: 'Number of Taps',

        // Popup
        settings: 'Simulation Settings',
        chemicalSelect: 'Chemical / Powder Selection:',
        weightSelect: 'Sample Weight (gm):',
        tapSelect: 'Number of Taps:',
        okBtn: 'OK'
    }
};


// Simplified function - language is always English now
function changeLanguage(lang) {
    // Language is always English, but keep function for compatibility
    currentLanguage = 'en';
    const dict = languageMap['en'];

    // Update UI elements
    try {
        // Update measurement panel
        document.getElementById('measurementTitle').innerText = dict.measure;
        document.getElementById('chemicalNameLabel').innerText = dict.chemical;
        document.getElementById('sampleWeightLabel').innerText = dict.sample;
        document.getElementById('bulkLabel').innerText = dict.bulk;
        document.getElementById('tappedLabel').innerText = dict.tapped;
        document.getElementById('bulkVolumeLabel').innerText = dict.bulkVolume;
        document.getElementById('tappedVolumeLabel').innerText = dict.tappedVolume;
        document.getElementById('tapCountLabel').innerText = dict.tapCount;
        document.getElementById('startSimulationBtn').innerText = dict.startBtn;

        // Update instruction text based on current step
        const instructionText = document.getElementById('instructionText');
        if (instructionText) {
            const currentStep = window.currentStep || 0;
            const stepKey = `step${currentStep}`;
            if (dict[stepKey]) {
                instructionText.innerText = dict[stepKey];
            }
        }
    } catch (error) {
        console.error('Error updating UI elements:', error);
    }
}

// Function to update instruction text based on current step
function updateInstructionText() {
    const currentStep = window.currentStep || 0;
    const dict = languageMap['en'];

    const instructionText = document.getElementById('instructionText');
    if (!instructionText) {
        console.error('Instruction text element not found');
        return;
    }

    try {
        // Update instruction text based on current step
        const stepKey = `step${currentStep}`;
        if (dict[stepKey]) {
            instructionText.innerText = dict[stepKey];
            console.log('Updated instruction text to:', dict[stepKey]);
        } else {
            // Fallback to step0 if the step key doesn't exist
            instructionText.innerText = dict.step0;
            console.log('Fallback to step0 instruction text:', dict.step0);
        }
    } catch (error) {
        console.error('Error updating instruction text:', error);
    }
}

// Function to play audio for instructions with a specified delay
function playInstructionAudio(delay = 0) {
    console.log('playInstructionAudio called, currentStep:', window.currentStep, 'with delay:', delay);

    const audio = document.getElementById('instructionAudio');
    if (!audio) {
        console.error('Audio element not found!');
        return;
    }

    // Set the audio source based on the current language and step
    const currentStep = window.currentStep || 0;
    console.log('Current step for audio:', currentStep, 'Current language:', currentLanguage);

    // Only play audio for English language
    // For other languages, we'll skip audio playback until those files are provided
    if (currentLanguage !== 'en' && currentLanguage !== undefined) {
        console.log('Skipping audio playback for non-English language:', currentLanguage);
        return;
    }

    // Map step numbers to the corresponding audio file names
    // Currently only implemented for English (default)
    let audioFile = '';

    // Use the numbered filenames for English
    switch(currentStep) {
        case 1:
            audioFile = 'start1.mp3';
            break;
        case 2:
            audioFile = 'startSimulation2.mp3';
            break;
        case 3:
            audioFile = 'ON3.mp3';
            break;
        case 4:
            audioFile = 'petri4.mp3';
            break;
        case 5:
            audioFile = 'tare5.mp3';
            break;
        case 6:
            audioFile = 'cap6.mp3';
            break;
        case 7:
            audioFile = 'spatula7.mp3';
            break;
        case 8:
            audioFile = 'transfer8.mp3';
            break;
        case 9:
            audioFile = 'starttapping9.mp3';
            break;
        case 10:
            audioFile = 'completed10.mp3';
            break;
        default:
            // No audio for step 0 or invalid steps
            console.log('No audio file for step:', currentStep);
            return;
    }

    // Set the audio source to the root audio directory for English
    const audioPath = `audio/${audioFile}`;
    console.log('Setting audio source to:', audioPath);
    audio.src = audioPath;

    // Make sure the audio is not muted and volume is up
    audio.muted = false;
    audio.volume = 1.0;

    // Create a user interaction event handler to enable audio playback
    // This helps with browsers that require user interaction before playing audio
    const enableAudio = () => {
        // Remove the event listeners after first interaction
        document.removeEventListener('click', enableAudio);
        document.removeEventListener('keydown', enableAudio);

        // Resume the audio context if it exists and is suspended
        if (window.audioContext && window.audioContext.state === 'suspended') {
            window.audioContext.resume();
        }
    };

    // Add event listeners for user interaction
    document.addEventListener('click', enableAudio);
    document.addEventListener('keydown', enableAudio);

    // Play the audio with the specified delay
    setTimeout(() => {
        console.log('Playing audio after delay:', audio.src);
        audio.play().then(() => {
            console.log('Audio playback started successfully');
        }).catch(error => {
            console.error('Audio playback error:', error);

            // If there's an error, try playing again after user interaction
            const retryPlay = () => {
                document.removeEventListener('click', retryPlay);
                audio.play().catch(e => console.error('Retry audio playback failed:', e));
            };
            document.addEventListener('click', retryPlay);
        });
    }, delay);
}

// Function to play audio for a specific step with a delay
window.playAudioForStep = function(step, delay = 0) {
    console.log(`Playing audio for step ${step} with delay ${delay}ms`);

    // Store the original step
    const originalStep = window.currentStep;

    // Temporarily set the current step to the specified step
    window.currentStep = step;

    // Play the audio with the specified delay
    playInstructionAudio(delay);

    // Restore the original step
    window.currentStep = originalStep;
}

// Function to play the error message audio
window.playErrorAudio = function() {
    console.log('Playing error message audio');

    // Only play for English language
    if (currentLanguage !== 'en' && currentLanguage !== undefined) {
        console.log('Skipping error audio for non-English language:', currentLanguage);
        return;
    }

    const audio = document.getElementById('instructionAudio');
    if (audio) {
        // Set the source to followCurrent.mp3
        audio.src = 'audio/followCurrent.mp3';

        // Make sure audio is not muted and volume is up
        audio.muted = false;
        audio.volume = 1.0;

        // Play the audio
        audio.play().then(() => {
            console.log('Error audio playback started successfully');
        }).catch(error => {
            console.error('Error audio playback failed:', error);
        });
    }
}

// Store the original functions from main.js
window.mainJsUpdateInstructionText = window.updateInstructionText;
window.mainJsPlayInstructionAudio = window.playInstructionAudio;

// Override with our language-aware functions
console.log('Setting language-aware functions');
window.updateInstructionText = updateInstructionText;
window.playInstructionAudio = playInstructionAudio;

// Initialize language on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set default language to English
    changeLanguage('en');

    // We'll play start1.mp3 when the start popup appears
    // This is now handled in the start-popup.js file
});
