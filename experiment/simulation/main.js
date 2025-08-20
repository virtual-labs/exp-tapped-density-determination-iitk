// main.js - Main script for bulk density simulation

// Global variables
let currentStep = 0; // Start at step 0 (before simulation begins)
let isWeighingMachineOn = false;
let isPetridishOnScale = false;
let isPowderCapOpen = false;
let currentWeight = 0;
let tareWeight = 50;
let totalWeight = 0;
let isTapping = false;
let isSimulationStarted = false;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing simulation');

    // Initialize the simulation
    updateInstructionText();

    // Set currentStep to 0 initially
    window.currentStep = 0;

    // Set up event listeners
    setupEventListeners();

    // Set up audio context to enable audio playback
    // This helps with browsers that require user interaction before playing audio
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
        window.audioContext = new AudioContext();
    }
});

// Set up all event listeners
function setupEventListeners() {
    // Start Simulation button
    const startSimulationBtn = document.getElementById('startSimulationBtn');
    if (startSimulationBtn) {
        startSimulationBtn.addEventListener('click', function() {
            if (currentStep === 1) {
                console.log('Starting simulation');
                isSimulationStarted = true;

                // Move to next step
                currentStep = 2;
                updateInstructionText();

                // Play ON3 audio for step 2
                console.log('Playing ON3 audio for step 2');
                const audio = document.getElementById('instructionAudio');
                if (audio) {
                    audio.src = 'audio/ON3.mp3';
                    audio.play().catch(error => {
                        console.error('Audio playback error:', error);
                    });
                }
            }
        });
    }

    // Weighing machine power button
    const onButton = document.getElementById('onButton');
    if (onButton) {
        onButton.addEventListener('click', function() {
            if (currentStep === 2) {
                console.log('Turning on weighing machine');
                isWeighingMachineOn = true;

                // Add button press effect
                gsap.to(onButton, {
                    scale: 0.9,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: "power1.in",
                    onComplete: () => {
                        // Add a subtle glow to the button to indicate it's on
                        onButton.style.boxShadow = '0 0 5px rgba(0, 255, 0, 0.5)';
                        onButton.style.backgroundColor = '#2a8c82';
                    }
                });

                // Show weight display with simple blinking digits
                const weightDisplay = document.querySelector('.weight-display');
                if (weightDisplay) {
                    // Make the display visible immediately
                    weightDisplay.style.display = 'block';
                    weightDisplay.style.opacity = '1';

                    // Create a simple blinking sequence with just 0.00
                    const blinkTimeline = gsap.timeline();

                    // First show 0.00
                    blinkTimeline.add(() => {
                        weightDisplay.innerText = '0.00';
                    })
                    .to({}, {duration: 0.3}) // Hold for 0.3 seconds

                    // First blink - hide
                    .add(() => {
                        weightDisplay.innerText = '';
                    })
                    .to({}, {duration: 0.2}) // Hold for 0.2 seconds

                    // Show again
                    .add(() => {
                        weightDisplay.innerText = '0.00';
                    })
                    .to({}, {duration: 0.3}) // Hold for 0.3 seconds

                    // Second blink - hide
                    .add(() => {
                        weightDisplay.innerText = '';
                    })
                    .to({}, {duration: 0.2}) // Hold for 0.2 seconds

                    // Final display
                    .add(() => {
                        weightDisplay.innerText = '0.00';
                    });
                }

                // Move to next step
                currentStep = 3;
                updateInstructionText();

                // Play the petri4 audio for step 3
                console.log('Playing petri4 audio for step 3');
                const audio = document.getElementById('instructionAudio');
                if (audio) {
                    audio.src = 'audio/petri4.mp3';
                    audio.play().catch(error => {
                        console.error('Audio playback error:', error);
                    });
                }
            }
        });
    }

    // Petri dish
    const petridish = document.querySelector('.petridish');
    if (petridish) {
        petridish.addEventListener('click', function() {
            console.log('Petri dish clicked, currentStep:', currentStep);

            // Step 3: Place petri dish on scale
            if (currentStep === 3 && !isPetridishOnScale) {
                if (!isWeighingMachineOn) {
                    console.log('Weighing machine is not on');
                    return;
                }

                console.log('Placing petri dish on scale');
                isPetridishOnScale = true;

                // Set petri dish properties
                petridish.style.opacity = '1';
                petridish.style.display = 'block';
                petridish.style.zIndex = '30';

                // Animate movement to scale - smooth animation
                gsap.to(petridish, {
                    left: '33%',
                    bottom: '10%',
                    duration: 1.0, 
                     // Slower for more realistic movement
                    ease: "power2.inOut",
                    onComplete: () => {
                        // Animate weight display
                        animateWeight(0, 50, 1000, () => {
                            currentWeight = 50;
                            currentStep = 4;
                            updateInstructionText();

                            // Play the tare5 audio for step 4
                            console.log('Playing tare5 audio for step 4');
                            const audio = document.getElementById('instructionAudio');
                            if (audio) {
                                audio.src = 'audio/tare5.mp3';
                                audio.play().catch(error => {
                                    console.error('Audio playback error:', error);
                                });
                            }
                        });
                    }
                });
                return;
            }

            // Step 7: Transfer sample to test tubes
            if (currentStep === 7 && isPetridishOnScale) {
                console.log('Removing petri dish from scale to transfer sample');
                isPetridishOnScale = false;

                // Show negative weight because of tare
                animateWeight(currentWeight, -tareWeight, 500, () => {
                    currentWeight = -tareWeight;

                    // Call the transferSamplesToTestTubes function
                    transferSamplesToTestTubes(petridish);
                });
                return;
            }

            // If petri dish is clicked at any other step, show a message
            if (currentStep !== 3 && currentStep !== 7) {
                console.log('Petri dish cannot be interacted with at this step');
                // Show a message to the user
                const instructionText = document.getElementById('instructionText');
                if (instructionText) {
                    const originalText = instructionText.innerText;
                    instructionText.innerText = 'Please follow the current step instruction.';

                    // Play the error message audio
                    if (typeof window.playErrorAudio === 'function') {
                        window.playErrorAudio();
                    }

                    setTimeout(() => {
                        instructionText.innerText = originalText;
                    }, 2000);
                }
            }

            // Step 6: Transfer samples to test tubes (only when petri dish is NOT on scale)
            if (currentStep === 6 && !isPetridishOnScale) {
                console.log('Starting transfer to test tubes');
                // Call the transferSamplesToTestTubes function directly
                transferSamplesToTestTubes(petridish);
            }
        });
    }

    // Chemical powder cap
    const powderCap = document.querySelector('.chemical-powder-cap');
    if (powderCap) {
        powderCap.addEventListener('click', function() {
            console.log('Powder cap clicked, currentStep:', currentStep);

            // Step 5: Open the powder cap
            if (currentStep === 5 && !isPowderCapOpen) {
                console.log('Opening powder cap');
                isPowderCapOpen = true;

                // Animate the cap opening - more realistic movement
                const capTimeline = gsap.timeline();

                // First move up
                capTimeline.to(powderCap, {
                    bottom: '42%', // Move up to exactly 42%
                    duration: 0.8,
                    ease: "power2.out"
                })

                // Then move left
                .to(powderCap, {
                    left: '8%', // Then move left to exactly 8%
                    duration: 0.8,
                    ease: "power2.inOut"
                })

                // Then move down to simulate settling - slower for smoother animation
                .to(powderCap, {
                    bottom: '33%', // Move down to exactly 35%
                    duration: 0.8, // Increased from 0.4 to 0.8 seconds for smoother movement
                    ease: "power2.inOut" // Changed from bounce.out to power2.inOut for smoother settling
                })

                // Make cap slightly smaller to show perspective - slower for smoother scaling
                .to(powderCap, {
                    scale: 0.85, // Make it a bit smaller than before
                    duration: 0.6, // Increased from 0.3 to 0.6 seconds for smoother scaling
                    ease: "power1.inOut", // Changed to inOut for smoother transition
                    onComplete: () => {
                        // Move to next step
                        currentStep = 6;
                        updateInstructionText();

                        // Play the spatula7 audio for step 6
                        console.log('Playing spatula7 audio for step 6');
                        const audio = document.getElementById('instructionAudio');
                        if (audio) {
                            audio.src = 'audio/spatula7.mp3';
                            audio.play().catch(error => {
                                console.error('Audio playback error:', error);
                            });
                        }
                    }
                });
            } else if (currentStep !== 5) {
                // If cap is clicked at any other step, show a message
                console.log('Powder cap cannot be interacted with at this step');
                // Show a message to the user
                const instructionText = document.getElementById('instructionText');
                if (instructionText) {
                    const originalText = instructionText.innerText;
                    instructionText.innerText = 'Please follow the current step instruction.';

                    // Play the error message audio
                    if (typeof window.playErrorAudio === 'function') {
                        window.playErrorAudio();
                    }

                    setTimeout(() => {
                        instructionText.innerText = originalText;
                    }, 2000);
                }
            }
        });
    }

    // Spatula
    const spatula = document.querySelector('.spatchula');
    if (spatula) {
        spatula.addEventListener('click', function() {
            console.log('Spatula clicked, currentStep:', currentStep);

            // Step 6: Collect sample with spatula
            if (currentStep === 6 && isPowderCapOpen) {
                console.log('Collecting sample with spatula');

                // Initialize sample ID for the first trip if not already set
                if (!window.spatulaTripsStarted) {
                    window.currentSampleId = 1;
                    window.spatulaTripsStarted = true;
                }

                // Animate spatula to collect sample - following exact path
                const timeline = gsap.timeline();

                // Set initial position
                const initialLeft = 43; // Fixed initial left position at 43%
                const initialBottom = 5; // Fixed initial bottom position at 5%

                // First move up about 33%
                timeline.to(spatula, {
                    bottom: '33%', // Move up to exactly 33%
                    duration: 0.8,
                    ease: "power2.out"
                })

                // Then move left about 20%
                .to(spatula, {
                    left: '20%', // Move left to exactly 20%
                    duration: 0.8,
                    ease: "power2.inOut"
                })

                // Then move down about 25% with rotation
                .to(spatula, {
                    bottom: '25%', // Move down to exactly 25%
                    rotation: -45, // Rotate when going downward
                    duration: 0.8,
                    ease: "power2.inOut",
                    onComplete: () => {
                        // Get the current sample ID based on the trip number
                        const sampleId = window.currentSampleId || 1;
                        // Create a reference to the sample but don't show it yet
                        const sample = document.getElementById('sample' + sampleId);
                        // Store the current sample ID for the next trip
                        window.currentSampleId = sampleId;

                        // Return along the same path but in reverse
                        const returnPath = gsap.timeline();

                        // First move back up - show sample at the start of this movement
                        returnPath.add(() => {
                            // Show sample on spatula as it starts to move up
                            if (sample) {
                                sample.style.display = 'block';
                                sample.style.opacity = '1';
                                sample.style.zIndex = '60'; // Higher than spatula and petri dish
                                sample.style.left = spatula.style.left;
                                sample.style.bottom = spatula.style.bottom;
                            }
                        })
                        .to([spatula, sample], {
                            bottom: '33%', // Back to 33%
                            rotation: 0,
                            duration: 0.8,
                            ease: "power2.out",
                            onComplete: () => {
                                // Set spatula z-index higher than petri dish AFTER completing the upward movement
                                spatula.style.zIndex = '40'; // Higher than petri dish (z-index 30)
                            }
                        })

                        // Then move right to the petri dish on the weighing scale
                        .to([spatula, sample], {
                            left: '36%', // Move to petri dish position on the weighing scale
                            duration: 0.8,
                            ease: "power2.inOut"
                        })

                        // Then move down to petri dish on the weighing scale
                        .to([spatula, sample], {
                            bottom: '13%', // Move down to petri dish on the weighing scale
                            duration: 0.8,
                            ease: "power2.inOut",
                            onComplete: () => {
                                // Keep sample visible on petri dish
                                if (sample) {
                                    // Position sample exactly at the center of the petri dish on the weighing scale
                                    // Based on exact specifications
                                    sample.style.left = '36%'; // Center on the petri dish on the weighing scale
                                    sample.style.bottom = '13%'; // Position on top of the petri dish on the weighing scale
                                }

                                                // Get total sample weight and calculate number of trips needed
                                const totalSampleWeight = parseInt(document.getElementById('sampleWeight').value) || 50;
                                const weightPerTrip = 25; // Each trip adds 25g
                                const totalTrips = Math.ceil(totalSampleWeight / weightPerTrip);
                                let currentTrip = 1;

                                // Function to handle a single trip
                                const performTrip = () => {
                                    // Update weight for this trip
                                    const weightToAdd = (currentTrip < totalTrips) ? weightPerTrip : (totalSampleWeight - (currentTrip - 1) * weightPerTrip);

                                    // Calculate what the new weight will be
                                    const newWeight = currentWeight + weightToAdd;

                                    // First move spatula back to original position
                                    gsap.to(spatula, {
                                        left: initialLeft + '%',
                                        bottom: initialBottom + '%',
                                        rotation: 0,
                                        duration: 0.8,
                                        ease: "power2.inOut",
                                        onComplete: () => {
                                            // Reset spatula z-index to original value
                                            spatula.style.zIndex = '6'; // Original z-index from CSS

                                            // ONLY NOW update the display with the current weight
                                            // after spatula has moved away
                                            animateWeight(currentWeight, newWeight, 1000, () => {
                                                currentWeight = newWeight;
                                                totalWeight = currentWeight; // Since we tared, totalWeight = currentWeight

                                                // Check if we've reached the exact selected weight
                                                if (currentWeight < totalSampleWeight) {
                                                    // We need more trips
                                                    currentTrip++;
                                                    // Increment the sample ID for the next trip
                                                    window.currentSampleId = (window.currentSampleId || 1) + 1;

                                                    // Start the next trip after a short delay
                                                    setTimeout(() => {
                                                        // Trigger the spatula click event programmatically
                                                        spatula.click();
                                                    }, 500);
                                                } else {
                                                    // We've reached the exact selected weight, move to next step
                                                    currentStep = 7;
                                                    updateInstructionText();

                                                    // Play the transfer8 audio for step 7
                                                    console.log('Playing transfer8 audio for step 7');
                                                    const audio = document.getElementById('instructionAudio');
                                                    if (audio) {
                                                        audio.src = 'audio/transfer8.mp3';
                                                        audio.play().catch(error => {
                                                            console.error('Audio playback error:', error);
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    });
                                };

                                // Start the first trip
                                performTrip();
                            }
                        });
                    }
                });
            } else if (currentStep !== 6) {
                // If spatula is clicked at any other step, show a message
                console.log('Spatula cannot be used at this step');
                // Show a message to the user
                const instructionText = document.getElementById('instructionText');
                if (instructionText) {
                    const originalText = instructionText.innerText;
                    instructionText.innerText = 'Please follow the current step instruction.';

                    // Play the error message audio
                    if (typeof window.playErrorAudio === 'function') {
                        window.playErrorAudio();
                    }

                    setTimeout(() => {
                        instructionText.innerText = originalText;
                    }, 2000);
                }
            }
        });
    }

    // Tare button
    const tareButton = document.getElementById('tareButton');
    if (tareButton) {
        tareButton.addEventListener('click', function() {
            console.log('Tare button clicked, currentStep:', currentStep);

            // Step 4: Tare the scale
            if (currentStep === 4) {
                console.log('Taring the scale');

                // Add button press effect for tare button
                gsap.to(tareButton, {
                    scale: 0.9,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1,
                    ease: "power1.in"
                });

                // Animate weight display
                animateWeight(currentWeight, 0, 800, () => {
                    tareWeight = currentWeight;
                    currentWeight = 0;

                    // Move to next step
                    currentStep = 5;
                    updateInstructionText();

                    // Play the cap6 audio for step 5
                    console.log('Playing cap6 audio for step 5');
                    const audio = document.getElementById('instructionAudio');
                    if (audio) {
                        audio.src = 'audio/cap6.mp3';
                        audio.play().catch(error => {
                            console.error('Audio playback error:', error);
                        });
                    }
                });
            } else {
                // If tare button is clicked at any other step, show a message
                console.log('Tare button cannot be used at this step');
                // Show a message to the user
                const instructionText = document.getElementById('instructionText');
                if (instructionText) {
                    const originalText = instructionText.innerText;
                    instructionText.innerText = 'Please follow the current step instruction.';

                    // Play the error message audio
                    if (typeof window.playErrorAudio === 'function') {
                        window.playErrorAudio();
                    }

                    setTimeout(() => {
                        instructionText.innerText = originalText;
                    }, 2000);
                }
            }
        });
    }

    // Start button for tapping
    const startTappingBtn = document.getElementById('startTappingBtn');
    if (startTappingBtn) {
        startTappingBtn.addEventListener('click', function() {
            console.log('Start tapping button clicked, currentStep:', currentStep);

            // Step 8: Start the tapping machine
            if (currentStep === 8 && !isTapping) {
                console.log('Starting the tapping machine');
                isTapping = true;

                // Get number of taps from the input
                const tapCount = parseInt(document.getElementById('tapCount').value) || 100;
                console.log('Number of taps:', tapCount);

                // Limit the number of taps for performance reasons
                const totalTapCount = tapCount > 1500 ? 1500 : tapCount;

                // Disable the start button during tapping
                startTappingBtn.disabled = true;

                const tappingEquipment1 = document.querySelector('.tapping-equipment');
                const tappingEquipment2 = document.getElementById('tapping-equipment2');
                const testTube1 = document.querySelector('.test-tube');
                const testTube2 = document.getElementById('test-tube2');
                const display = document.getElementById('bulkMachineDisplay');

                // Show tapping animation
                let tapsCompleted = 0;

                // Create a master timeline
                const masterTimeline = gsap.timeline({
                    onComplete: () => {
                        // Re-enable the start button when done
                        startTappingBtn.disabled = false;
                        startTappingBtn.textContent = 'START';
                        isTapping = false;

                        // Move to next step
                        currentStep = 9;
                        updateInstructionText();

                        // Show results
                        showResults();

                        // Play the completed10 audio for step 9
                        console.log('Playing completed10 audio for step 9');
                        const audio = document.getElementById('instructionAudio');
                        if (audio) {
                            audio.src = 'audio/completed10.mp3';
                            audio.play().catch(error => {
                                console.error('Audio playback error:', error);
                            });
                        }
                    }
                });

                // For better performance, we'll do batches of taps
                const batchSize = 10; // Number of taps to show in detail
                const fastForwardTaps = totalTapCount - batchSize;

                // Update the instruction to show the tapping process has started
                document.getElementById('instructionText').innerText =
                    `Tapping process started: 0 of ${totalTapCount} taps completed`;

                // First do a few detailed taps
                for (let i = 0; i < Math.min(batchSize, totalTapCount); i++) {
                    // Create a timeline for a single detailed tap
                    const detailedTapTimeline = gsap.timeline();

                    // Create a variable to track this tap's number
                    const tapNumber = i + 1;

                    // Update counter at the start of each tap
                    detailedTapTimeline.add(() => {
                        // Update the counter display
                        tapsCompleted = tapNumber;
                        display.textContent = tapsCompleted;

                        // Update the instruction text to show progress
                        document.getElementById('instructionText').innerText =
                            `Tapping in progress: ${tapsCompleted} of ${totalTapCount} taps completed`;
                    });

                    // Equipment preparation (slight tension before movement)
                    detailedTapTimeline.to([tappingEquipment1, tappingEquipment2], {
                        bottom: '+=2',
                        duration: 0.05,
                        ease: "power1.in"
                    });

                    // Rapid upward movement of equipment
                    detailedTapTimeline.to([tappingEquipment1, tappingEquipment2], {
                        bottom: '+=13',
                        duration: 0.08,
                        ease: "power2.in"
                    });

                    // Rapid downward movement of equipment (the tap)
                    detailedTapTimeline.to([tappingEquipment1, tappingEquipment2], {
                        bottom: '-=15',
                        duration: 0.06,
                        ease: "power3.out"
                    });

                    // Test tubes react with a slight delay (impact response)
                    detailedTapTimeline.to([testTube1, testTube2], {
                        bottom: '+=5',
                        duration: 0.06,
                        ease: "power2.in"
                    }, "-=0.03"); // Slight overlap for better timing

                    // Test tubes bounce back with realistic physics
                    detailedTapTimeline.to([testTube1, testTube2], {
                        bottom: '-=5',
                        duration: 0.12,
                        ease: "bounce.out(1, 0.3)" // More realistic bounce
                    });

                    // Add a small pause between taps
                    detailedTapTimeline.to({}, {duration: 0.1});

                    // Add the detailed tap to the master timeline
                    masterTimeline.add(detailedTapTimeline);
                }

                // If we have more taps, fast-forward through them
                if (fastForwardTaps > 0) {
                    // Create a combined timeline for synchronized animations
                    const fastForwardTimeline = gsap.timeline();

                    // Create a repeating timeline for synchronized tapping
                    const singleTapTimeline = gsap.timeline({repeat: 40, repeatRefresh: true});

                    // Equipment movement up
                    singleTapTimeline.to([tappingEquipment1, tappingEquipment2], {
                        bottom: '+=10',
                        duration: 0.04,
                        ease: "power2.in"
                    });

                    // Equipment movement down
                    singleTapTimeline.to([tappingEquipment1, tappingEquipment2], {
                        bottom: '-=10',
                        duration: 0.04,
                        ease: "power2.out"
                    });

                    // Test tubes movement (with slight delay for realism)
                    singleTapTimeline.to([testTube1, testTube2], {
                        bottom: '+=3',
                        duration: 0.04,
                        ease: "power1.in"
                    }, "-=0.02");

                    // Test tubes bounce
                    singleTapTimeline.to([testTube1, testTube2], {
                        bottom: '-=3',
                        duration: 0.04,
                        ease: "bounce.out(1, 0.3)"
                    });

                    // Add the counter animation that runs simultaneously with the tapping
                    fastForwardTimeline.add(singleTapTimeline, 0); // Start at time 0

                    // Add the counter animation - start from batchSize (10) instead of tapsCompleted
                    fastForwardTimeline.to({count: batchSize}, {
                        count: totalTapCount,
                        duration: 2.5, // Slightly longer duration for smoother counting
                        ease: "linear", // Linear for consistent counting speed
                        onUpdate: function() {
                            // Update the display with the current count (rounded to integer)
                            const currentCount = Math.round(this.targets()[0].count);

                            // Only update if the count has changed (prevents flickering)
                            if (currentCount !== tapsCompleted) {
                                display.textContent = currentCount;
                                tapsCompleted = currentCount;

                                // Update instruction text every 10 counts
                                if (currentCount % 10 === 0 || currentCount === totalTapCount) {
                                    document.getElementById('instructionText').innerText =
                                        `Tapping in progress: ${currentCount} of ${totalTapCount} taps completed`;
                                }
                            }
                        },
                        onComplete: function() {
                            // Ensure we end at exactly the total count
                            display.textContent = totalTapCount;
                            tapsCompleted = totalTapCount;

                            // Stop the tapping animation when counter completes
                            singleTapTimeline.pause();
                        }
                    }, 0); // Start at time 0 to run simultaneously

                    // Add the fast-forward timeline to the master timeline
                    masterTimeline.add(fastForwardTimeline);
                }

                // Start the animation
                masterTimeline.play();
            } else if (currentStep !== 8) {
                // If start button is clicked at any other step, show a message
                console.log('Start button cannot be used at this step');
                // Show a message to the user
                const instructionText = document.getElementById('instructionText');
                if (instructionText) {
                    const originalText = instructionText.innerText;
                    instructionText.innerText = 'Please follow the current step instruction.';

                    // Play the error message audio
                    if (typeof window.playErrorAudio === 'function') {
                        window.playErrorAudio();
                    }

                    setTimeout(() => {
                        instructionText.innerText = originalText;
                    }, 2000);
                }
            }
        });
    }
}

// Function to transfer samples to test tubes
function transferSamplesToTestTubes(petridish) {
    console.log('Transferring samples to test tubes');

    // Set petri dish z-index
    petridish.style.zIndex = '30';

    // Get all samples
    const samples = [];

    // First, collect all samples and position them at the same spot
    for (let i = 1; i <= 12; i++) {
        const sample = document.getElementById(`sample${i}`);
        if (sample) {
            // Make samples visible and position them all at the same spot
            sample.style.display = 'block';
            sample.style.opacity = '1';
            sample.style.zIndex = '60'; // Higher than petri dish

            // Set all samples to the same position (on the petri dish)
            sample.style.left = '36%';  // 1% more from the left
            sample.style.bottom = '12.5%';  // 1.5% more to the top

            samples.push(sample);
        }
    }
    // No need to fix sample positions - they're already positioned correctly


    // Split samples into two groups for the two test tubes
    const firstHalfSamples = samples.slice(0, Math.ceil(samples.length / 2));
    const secondHalfSamples = samples.slice(Math.ceil(samples.length / 2));

    // Define test tube positions
    const testTube1Position = { left: '58%', bottom: '40%' };
    const testTube2Position = { left: '66.5%', bottom: '40%' };

    // Show transfer message
    document.getElementById('instructionText').innerText =
        `Transferring ${totalWeight || 100}g sample to test tubes...`;

    // Store the initial position values for reference
    const initialPetriLeft = parseFloat(petridish.style.left) || 33;
    const initialPetriBottom = parseFloat(petridish.style.bottom) || 10;

    // Create timeline for animation
    const timeline = gsap.timeline();

    // Store initial positions of all samples relative to petri dish
    // Since all samples are at the same position, we can use the same offset for all
    const petriLeft = parseFloat(petridish.style.left || '0');
    const petriBottom = parseFloat(petridish.style.bottom || '0');

    const sampleOffsets = samples.map(() => ({
        left: 36 - petriLeft,
        bottom: 12.5 - petriBottom
    }));

    // 1. MOVE UP - Petri dish and samples move up together
    timeline.to(petridish, {
        bottom: '53%',
        duration: 1.5,
        ease: "power2.out",
        onUpdate: function() {
            // Update ALL samples to move with petri dish
            const petriBottom = parseFloat(petridish.style.bottom || '0');
            const petriLeft = parseFloat(petridish.style.left || '0');

            // Move all samples together
            samples.forEach(sample => {
                if (sample.style.display !== 'none') {
                    // Keep the same relative position for all samples
                    const offset = sampleOffsets[samples.indexOf(sample)];
                    sample.style.bottom = `${petriBottom + offset.bottom}%`;
                    sample.style.left = `${petriLeft + offset.left}%`;
                }
            });
        }
    });

    // 2. MOVE RIGHT TO FIRST TEST TUBE - Petri dish and samples move right together
    timeline.to(petridish, {
        left: testTube1Position.left,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: function() {
            // Update ALL samples to move with petri dish
            const petriBottom = parseFloat(petridish.style.bottom || '0');
            const petriLeft = parseFloat(petridish.style.left || '0');

            // Move all samples together
            samples.forEach(sample => {
                if (sample.style.display !== 'none') {
                    // Keep the same relative position for all samples
                    const offset = sampleOffsets[samples.indexOf(sample)];
                    sample.style.bottom = `${petriBottom + offset.bottom}%`;
                    sample.style.left = `${petriLeft + offset.left}%`;
                }
            });
        }
    });

    // 3. ROTATE TO POUR INTO FIRST TEST TUBE
    timeline.to(petridish, {
        rotation: 45,
        duration: 1.2,
        ease: "power1.inOut",
        onUpdate: function() {
            // Update ALL samples to rotate with petri dish
            const petriRotation = petridish.style.transform ?
                parseFloat(petridish.style.transform.replace('rotate(', '').replace('deg)', '')) : 0;
            const petriBottom = parseFloat(petridish.style.bottom || '0');
            const petriLeft = parseFloat(petridish.style.left || '0');

            // Rotate and position all samples together
            samples.forEach(sample => {
                if (sample.style.display !== 'none') {
                    // Update rotation
                    sample.style.transform = `rotate(${petriRotation}deg)`;

                    // Keep the same relative position
                    const offset = sampleOffsets[samples.indexOf(sample)];
                    sample.style.bottom = `${petriBottom + offset.bottom}%`;
                    sample.style.left = `${petriLeft + offset.left}%`;
                }
            });
        }
    });

    // 4. POUR FIRST HALF OF SAMPLES
    timeline.add(() => {
        // Hide second half samples temporarily
        secondHalfSamples.forEach(sample => {
            sample.style.opacity = '0.3';
        });

        // Pour animation for first half samples
        if (firstHalfSamples.length > 0) {
            // Use first sample as representative
            const representativeSample = firstHalfSamples[0];

            // Hide other samples
            for (let i = 1; i < firstHalfSamples.length; i++) {
                firstHalfSamples[i].style.display = 'none';
            }

            // Position for test tube target
            const testTube1Left = 61.0;
            const testTube1Bottom = 25.0; // Drop to bottom of test tube

            // Create pouring animation
            gsap.to(representativeSample, {
                left: testTube1Left + '%',
                bottom: testTube1Bottom + '%',
                duration: 0.8,
                ease: "power3.in",
                onComplete: () => {
                    // Hide the sample when it reaches the bottom
                    representativeSample.style.display = 'none';

                    // Animate chemical powder height in test tube 1 AFTER the sample is poured
                    const chemicalPowder1 = document.querySelector('.chemical-powder1');
                    if (chemicalPowder1) {
                        const sampleWeight = parseInt(document.getElementById('sampleWeight').value) || 50;
                        const halfWeight = sampleWeight / 2;
                        const newHeight = (halfWeight / 50) * 3;

                        gsap.fromTo(chemicalPowder1,
                            { height: '0em', display: 'block', opacity: 1 },
                            {
                                height: `${newHeight}em`,
                                duration: 0.8,
                                ease: "power1.out"
                            }
                        );
                    }
                }
            });
        }
    });

    // Make second half samples fully visible again
    timeline.add(() => {
        // Just make second half samples fully visible again
        secondHalfSamples.forEach(sample => {
            sample.style.opacity = '1';
        });
    });

    // 5. ROTATE BACK
    timeline.to(petridish, {
        rotation: 0,
        duration: 1.2,
        ease: "power1.out",
        onUpdate: function() {
            // Update ALL samples to rotate with petri dish
            const petriRotation = petridish.style.transform ?
                parseFloat(petridish.style.transform.replace('rotate(', '').replace('deg)', '')) : 0;
            const petriBottom = parseFloat(petridish.style.bottom || '0');
            const petriLeft = parseFloat(petridish.style.left || '0');

            // Rotate and position all samples together
            samples.forEach(sample => {
                if (sample.style.display !== 'none') {
                    // Update rotation
                    sample.style.transform = `rotate(${petriRotation}deg)`;

                    // Keep the same relative position
                    const offset = sampleOffsets[samples.indexOf(sample)];
                    sample.style.bottom = `${petriBottom + offset.bottom}%`;
                    sample.style.left = `${petriLeft + offset.left}%`;
                }
            });
        }
    });

    // 6. MOVE TO SECOND TEST TUBE
    timeline.to(petridish, {
        left: testTube2Position.left,
        duration: 1.2,
        ease: "power2.inOut",
        onUpdate: function() {
            // Update sample positions to maintain relative position to petri dish
            secondHalfSamples.forEach(sample => {
                if (sample.style.display !== 'none' && sample.style.opacity !== '0') {
                    const offset = sampleOffsets[samples.indexOf(sample)];
                    const petriLeft = parseFloat(petridish.style.left || '0');
                    const petriBottom = parseFloat(petridish.style.bottom || '0');

                    // Update both left and bottom position
                    sample.style.left = `${petriLeft + offset.left}%`;
                    sample.style.bottom = `${petriBottom + offset.bottom}%`;
                }
            });
        }
    });

    // 7. ROTATE TO POUR INTO SECOND TEST TUBE
    timeline.to(petridish, {
        rotation: 45,
        duration: 1.2,
        ease: "power1.inOut",
        onUpdate: function() {
            // Update sample rotations to match petri dish
            const petriRotation = petridish.style.transform ?
                parseFloat(petridish.style.transform.replace('rotate(', '').replace('deg)', '')) : 0;

            secondHalfSamples.forEach(sample => {
                if (sample.style.display !== 'none' && sample.style.opacity !== '0') {
                    // Update rotation
                    sample.style.transform = `rotate(${petriRotation}deg)`;

                    // Also ensure position is maintained
                    const offset = sampleOffsets[samples.indexOf(sample)];
                    const petriLeft = parseFloat(petridish.style.left || '0');
                    const petriBottom = parseFloat(petridish.style.bottom || '0');

                    // Update position
                    sample.style.left = `${petriLeft + offset.left}%`;
                    sample.style.bottom = `${petriBottom + offset.bottom}%`;
                }
            });
        }
    });

    // 8. POUR SECOND HALF OF SAMPLES
    timeline.add(() => {
        // Pour animation for second half samples
        if (secondHalfSamples.length > 0) {
            // Use first sample as representative
            const representativeSample = secondHalfSamples[0];

            // Hide other samples
            for (let i = 1; i < secondHalfSamples.length; i++) {
                secondHalfSamples[i].style.display = 'none';
            }

            // Position for test tube target
            const testTube2Left = 69.5;
            const testTube2Bottom = 29.0; // Drop to bottom of test tube

            // Create pouring animation
            gsap.to(representativeSample, {
                left: testTube2Left + '%',
                bottom: testTube2Bottom + '%',
                duration: 0.8,
                ease: "power3.in",
                onComplete: () => {
                    // Hide the sample when it reaches the bottom
                    representativeSample.style.display = 'none';

                    // Animate chemical powder height in test tube 2 AFTER the sample is poured
                    const chemicalPowder2 = document.querySelector('.chemical-powder2');
                    if (chemicalPowder2) {
                        const sampleWeight = parseInt(document.getElementById('sampleWeight').value) || 50;
                        const halfWeight = sampleWeight / 2;
                        const newHeight = (halfWeight / 50) * 3;

                        gsap.fromTo(chemicalPowder2,
                            { height: '0em', display: 'block', opacity: 1 },
                            {
                                height: `${newHeight}em`,
                                duration: 0.8,
                                ease: "power1.out"
                            }
                        );
                    }
                }
            });
        }
    });

    // 9. ROTATE BACK
    timeline.to(petridish, {
        rotation: 0,
        duration: 1.2,
        ease: "power1.out",
        onUpdate: function() {
            // Update sample rotations to match petri dish
            const petriRotation = petridish.style.transform ?
                parseFloat(petridish.style.transform.replace('rotate(', '').replace('deg)', '')) : 0;

            secondHalfSamples.forEach(sample => {
                if (sample.style.display !== 'none') {
                    sample.style.transform = `rotate(${petriRotation}deg)`;
                }
            });
        }
    });

    // 10. RETURN TO INITIAL POSITION - MOVE LEFT
    timeline.to(petridish, {
        left: initialPetriLeft + '%',
        duration: 1.5,
        ease: "power2.inOut"
    });

    // 11. MOVE DOWN TO WEIGHING SCALE
    timeline.to(petridish, {
        bottom: initialPetriBottom + '%',
        duration: 1.5,
        ease: "power2.in"
    });

    // 12. FINAL CLEANUP
    timeline.add(() => {
        // Reset z-index
        petridish.style.zIndex = '8';

        // Update weight
        animateWeight(currentWeight, 0, 1000, () => {
            currentWeight = 0;

            // Update instruction
            document.getElementById('instructionText').innerText =
                `Successfully transferred samples to both test tubes!`;

            // Move to next step
            currentStep = 8;
            updateInstructionText();

            // Play the starttapping9 audio for step 8
            console.log('Playing starttapping9 audio for step 8');
            const audio = document.getElementById('instructionAudio');
            if (audio) {
                audio.src = 'audio/starttapping9.mp3';
                audio.play().catch(error => {
                    console.error('Audio playback error:', error);
                });
            }
        });
    });
}

// Update instruction text based on current step
function updateInstructionText() {
    // Make currentStep available to other scripts
    window.currentStep = currentStep;
    console.log('Original updateInstructionText in main.js called');

    const instructionText = document.getElementById('instructionText');
    if (!instructionText) return;

    // Also update the step counter
    const stepCounter = document.getElementById('stepCounter');
    if (stepCounter && currentStep > 0) {
        stepCounter.innerText = `Step ${currentStep}`;
    }

    switch (currentStep) {
        case 0:
            instructionText.innerText = 'Welcome to the Bulk Density Simulation!';
            break;
        case 1:
            instructionText.innerText = 'Click on the \'Start Simulation\' button to begin.';
            break;
        case 2:
            instructionText.innerText = 'Click the button to turn ON the weighing scale.';
            break;
        case 3:
            instructionText.innerText = 'Click on the Petri dish to place it on the weighing scale.';
            break;
        case 4:
            instructionText.innerText = 'Click the \'Tare\' button to tare the weight.';
            break;
        case 5:
            instructionText.innerText = 'Click the powder box cap to open it.';
            break;
        case 6:
            instructionText.innerText = 'Click on the spatula to collect the sample.';
            break;
        case 7:
            instructionText.innerText = 'Click on the Petri dish to transfer the sample to the test tubes.';
            break;
        case 8:
            instructionText.innerText = 'Click the \'Start\' button to start tapping.';
            break;
        case 9:
            instructionText.innerText = 'Tapping completed. Results are displayed below.';
            break;
        default:
            instructionText.innerText = 'Welcome to the Bulk Density Simulation!';
    }
}

// Play audio for instructions
function playInstructionAudio() {
    console.log('Original playInstructionAudio in main.js called');

    const audio = document.getElementById('instructionAudio');
    if (audio) {
        // Set the audio source based on the current step
        audio.src = `audio/step${currentStep}.mp3`;

        // Play the audio
        audio.play().catch(error => {
            console.error('Audio playback error:', error);
        });
    }
}

// Function to calculate and show results
function showResults() {
    console.log('Showing results from main.js');

    // Get the tap count from the input
    const totalTapCount = parseInt(document.getElementById('tapCount').value) || 100;

    // Calculate bulk density (weight / volume)
    // Use the actual sample weight from the input
    const sampleWeight = parseInt(document.getElementById('sampleWeight').value);
    const bulkWeight = sampleWeight; // Use the selected sample weight directly
    const bulkDensity = bulkWeight; // Directly use the weight as density (g/mL)

    // Calculate tapped density
    // In a real scenario, this would be the final weight after tapping / volume
    // For simulation, we'll make it slightly higher than bulk density
    // The more taps, the higher the tapped density (up to a limit)
    const tapFactor = Math.min(1.0 + (totalTapCount / 500) * 0.2, 1.2); // Max 20% increase
    const tappedDensity = Math.round(bulkDensity * tapFactor); // Round to nearest integer

    // Update the input fields in the measurement panel
    document.getElementById('bulkDensity').value = bulkDensity.toFixed(2) + ' g/mL';
    document.getElementById('tappedDensity').value = tappedDensity.toFixed(2) + ' g/mL';

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

// Expose functions to window object for use in other scripts
// These will be overridden by language.js later
console.log('Setting initial updateInstructionText and playInstructionAudio functions');
window.mainJsUpdateInstructionText = updateInstructionText;
window.mainJsPlayInstructionAudio = playInstructionAudio;

// Animate weight display
function animateWeight(startWeight, endWeight, duration, callback) {
    const weightDisplay = document.querySelector('.weight-display');
    if (!weightDisplay) {
        if (callback) callback();
        return;
    }

    const startTime = Date.now();
    const weightDiff = endWeight - startWeight;

    function updateWeight() {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1);

        // Use easeOutQuad for smoother animation
        const easeProgress = 1 - (1 - progress) * (1 - progress);

        const currentValue = startWeight + weightDiff * easeProgress;
        weightDisplay.innerText = currentValue.toFixed(2);

        if (progress < 1) {
            requestAnimationFrame(updateWeight);
        } else {
            weightDisplay.innerText = endWeight.toFixed(2);
            if (callback) callback();
        }
    }

    updateWeight();
}

