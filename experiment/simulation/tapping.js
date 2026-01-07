// tapping.js - Tapping functionality

// Access variables from main.js
let currentStep = window.currentStep || 0;
let isTapping = window.isTapping || false;

// Step 7: Tapping functionality implementation

// Function to start the tapping process
function startTapping() {
    // Get the latest currentStep from main.js
    currentStep = window.currentStep || 0;
    isTapping = window.isTapping || false;

    console.log('Start tapping button clicked, currentStep:', currentStep);

    // Step 8: Start the tapping machine
    if (currentStep !== 8 || isTapping) {
        console.log('Cannot start tapping at this step or already tapping');
        return;
    }

    // Update both local and global variables
    isTapping = true;
    window.isTapping = true;
    let currentTapCount = 0;
    let totalTapCount = parseInt(document.getElementById('tapCount').value) || 100;

    // Limit the number of taps for performance reasons
    if (totalTapCount > 1500) totalTapCount = 1500;

    // Disable the start button during tapping
    const startButton = document.getElementById('startTappingBtn');
    startButton.disabled = true;
    // startButton.textContent = 'TAPPING...';

    const tappingEquipment1 = document.querySelector('.tapping-equipment');
    const tappingEquipment2 = document.getElementById('tapping-equipment2');
    const testTube1 = document.querySelector('.test-tube');
    const testTube2 = document.getElementById('test-tube2');
    const chemicalPowder1 = document.querySelector('.chemical-powder1');
    const chemicalPowder2 = document.querySelector('.chemical-powder2');
    const display = document.getElementById('bulkMachineDisplay');

    // Make sure chemical powders are visible before tapping
    if (chemicalPowder1 && chemicalPowder2) {
        chemicalPowder1.style.display = 'block';
        chemicalPowder2.style.display = 'block';
    }

    // Create a master timeline
    const masterTimeline = gsap.timeline({
        onComplete: () => {
            // Re-enable the start button when done
            startButton.disabled = false;
            startButton.textContent = 'START';

            // Update both local and global variables
            isTapping = false;
            window.isTapping = false;

            // Move to next step if needed
            if (currentStep === 8) {
                // Update both local and global variables
                currentStep = 9;
                window.currentStep = 9;

                // Update UI
                if (typeof window.updateInstructionText === 'function') {
                    window.updateInstructionText();
                }
                if (typeof window.playInstructionAudio === 'function') {
                    window.playInstructionAudio();
                }

                // Calculate and show results
                showResults();
            }
        }
    });

    // For better performance, we'll do batches of taps
    // This is more efficient than recursively adding taps
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
            currentTapCount = tapNumber;
            display.textContent = currentTapCount;

            // Update the instruction text to show progress
            document.getElementById('instructionText').innerText =
                `Tapping in progress: ${currentTapCount} of ${totalTapCount} taps completed`;
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

        // Chemical powders react with a completely new animation pattern for realistic powder behavior
        if (chemicalPowder1 && chemicalPowder2) {
            // Get current height of powders
            const currentHeight1 = parseFloat(getComputedStyle(chemicalPowder1).height);

            // PHASE 1: Initial compression - powder compresses slightly as equipment moves up
            detailedTapTimeline.to([chemicalPowder1, chemicalPowder2], {
                height: `-=${currentHeight1 * 0.03}px`, // Compress slightly
                bottom: `-=${currentHeight1 * 0.03}px`, // Move down slightly to maintain position
                duration: 0.05,
                ease: "power2.in"
            }, "-=0.06");

            // PHASE 2: Expansion - powder expands upward when tapped (like particles jumping)
            detailedTapTimeline.to([chemicalPowder1, chemicalPowder2], {
                height: `+=${currentHeight1 * 0.15}px`, // Significant expansion for visibility
                bottom: `+=${currentHeight1 * 0.05}px`, // Move up slightly
                duration: 0.08,
                ease: "power3.out"
            }, "-=0.02");

            // PHASE 3: Primary settling - powder settles down with realistic physics
            detailedTapTimeline.to([chemicalPowder1, chemicalPowder2], {
                height: `-=${currentHeight1 * 0.1}px`, // Partial settling
                bottom: `-=${currentHeight1 * 0.03}px`, // Move down slightly
                duration: 0.15,
                ease: "bounce.out(2, 0.4)" // Bouncy settling effect
            });

            // PHASE 4: Final settling - powder continues to settle with a slight jiggle
            detailedTapTimeline.to([chemicalPowder1, chemicalPowder2], {
                height: `-=${currentHeight1 * 0.02}px`, // Final settling
                bottom: `-=${currentHeight1 * 0.02}px`, // Final position adjustment
                duration: 0.2,
                ease: "elastic.out(1.2, 0.3)" // Elastic settling for powder-like behavior
            });
        }

        // Test tubes bounce back with realistic physics
        detailedTapTimeline.to([testTube1, testTube2], {
            bottom: '-=5',
            duration: 0.12,
            ease: "bounce.out(1, 0.3)" // More realistic bounce
        });

        // Gradually decrease the height of chemical powders (1% total reduction spread across all taps)
        if (i === 0) {
            // Store the current heights at the start of tapping
            window.startingHeight1 = chemicalPowder1 ? parseFloat(getComputedStyle(chemicalPowder1).height) : 0;
            window.startingHeight2 = chemicalPowder2 ? parseFloat(getComputedStyle(chemicalPowder2).height) : 0;
        }

        // Calculate the height reduction for this tap (total 3% reduction distributed across all taps for better visibility)
        const reductionPerTap = (window.startingHeight1 * 0.03) / totalTapCount;

        // Apply the height reduction
        if (chemicalPowder1 && chemicalPowder2) {
            detailedTapTimeline.to([chemicalPowder1, chemicalPowder2], {
                height: `-=${reductionPerTap}px`,
                duration: 0.15,
                ease: "power1.inOut"
            });
        }

        // Add a small pause between taps
        detailedTapTimeline.to({}, {duration: 0.1});

        // Add the detailed tap to the master timeline
        masterTimeline.add(detailedTapTimeline);
    }
    // If we have more taps, fast-forward through them
    if (fastForwardTaps > 0) {
        // Show fast-forward message
        // startButton.textContent = 'FAST TAPPING...';

        // Create a combined timeline for synchronized animations
        const fastForwardTimeline = gsap.timeline();

        // 1. Create the tapping animation
        // Create a repeating timeline for synchronized tapping
        // Use a higher repeat count for smoother animation during the entire fast-forward period
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
            duration: 0.03,
            ease: "power2.out"
        });

        // Test tubes movement (with slight delay for realism)
        singleTapTimeline.to([testTube1, testTube2], {
            bottom: '+=3',
            duration: 0.04,
            ease: "power1.in"
        }, "-=0.02");

        // Chemical powders movement with enhanced animation for fast-forward
        if (chemicalPowder1 && chemicalPowder2) {
            // Get current height of powders
            const ffCurrentHeight1 = parseFloat(getComputedStyle(chemicalPowder1).height);

            // PHASE 1: Quick compression
            singleTapTimeline.to([chemicalPowder1, chemicalPowder2], {
                height: `-=${ffCurrentHeight1 * 0.02}px`, // Slight compression
                bottom: `-=${ffCurrentHeight1 * 0.02}px`, // Maintain position
                duration: 0.03,
                ease: "power2.in"
            }, "-=0.03");

            // PHASE 2: Rapid expansion
            singleTapTimeline.to([chemicalPowder1, chemicalPowder2], {
                height: `+=${ffCurrentHeight1 * 0.12}px`, // Significant expansion
                bottom: `+=${ffCurrentHeight1 * 0.04}px`, // Move up
                duration: 0.04,
                ease: "power3.out"
            }, "-=0.01");

            // PHASE 3: Quick settling
            singleTapTimeline.to([chemicalPowder1, chemicalPowder2], {
                height: `-=${ffCurrentHeight1 * 0.1}px`, // Settle down
                bottom: `-=${ffCurrentHeight1 * 0.04}px`, // Return to position
                duration: 0.08,
                ease: "bounce.out(1.5, 0.3)" // Bouncy settling
            });
        }

        // Test tubes bounce
        singleTapTimeline.to([testTube1, testTube2], {
            bottom: '-=3',
            duration: 0.05,
            ease: "bounce.out(1, 0.3)"
        });

        // Gradually decrease the height of chemical powders during fast-forward
        if (chemicalPowder1 && chemicalPowder2 && window.startingHeight1 > 0) {
            // Calculate the remaining height reduction (3% of original height for better visibility)
            const remainingReduction = window.startingHeight1 * 0.03 * (fastForwardTaps / totalTapCount);

            // Apply the height reduction over the fast-forward period
            // We keep this separate from the up/down movement to maintain both effects
            singleTapTimeline.to([chemicalPowder1, chemicalPowder2], {
                height: `-=${remainingReduction}px`,
                duration: 2.5,
                ease: "linear"
            }, 0);

            // Add a continuous combined height and position pulsing effect during fast-forward
            // This creates a more visible vibration effect that looks like the powder is being tapped
            const vibrationTimeline = gsap.timeline({repeat: 40});

            // First part of vibration - up movement
            vibrationTimeline.to([chemicalPowder1, chemicalPowder2], {
                height: `+=${ffCurrentHeight1 * 0.06}px`, // Larger pulse
                bottom: `+=${ffCurrentHeight1 * 0.03}px`, // Add position change
                duration: 0.04,
                ease: "sine.in"
            });

            // Second part of vibration - down movement
            vibrationTimeline.to([chemicalPowder1, chemicalPowder2], {
                height: `-=${ffCurrentHeight1 * 0.06}px`, // Return to original
                bottom: `-=${ffCurrentHeight1 * 0.03}px`, // Return to original
                duration: 0.04,
                ease: "sine.out"
            });

            // Add the vibration timeline to the single tap timeline
            singleTapTimeline.add(vibrationTimeline, 0);
        }

        // 2. Add the counter animation that runs simultaneously
        const startCount = currentTapCount;
        const endCount = totalTapCount;

        // Update instruction text to show fast-forwarding
        // document.getElementById('instructionText').innerText =
        //     `Fast forwarding: ${startCount} of ${totalTapCount} taps completed`;

        // Add both animations to the fast-forward timeline
        fastForwardTimeline.add(singleTapTimeline, 0); // Start at time 0

        // Add the counter animation that runs simultaneously with the tapping
        fastForwardTimeline.to({count: startCount}, {
            count: endCount,
            duration: 2.5, // Slightly longer duration for smoother counting
            ease: "linear", // Linear for consistent counting speed
            onUpdate: function() {
                // Update the display with the current count (rounded to integer)
                const currentCount = Math.round(this.targets()[0].count);

                // Only update if the count has changed (prevents flickering)
                if (currentCount !== currentTapCount) {
                    display.textContent = currentCount;
                    currentTapCount = currentCount;

                    // Update instruction text every 10 counts to avoid performance issues
                    if (currentCount % 10 === 0 || currentCount === endCount) {
                        // document.getElementById('instructionText').innerText =
                        //     `Fast forwarding: ${currentCount} of ${totalTapCount} taps completed`;
                    }
                }
            },
            onComplete: function() {
                // Ensure we end at exactly the total count
                display.textContent = endCount;
                currentTapCount = endCount;
                // startButton.textContent = 'COMPLETED';

                // Stop the tapping animation when counter completes
                singleTapTimeline.pause();

                // Update instruction text to show completion
                // document.getElementById('instructionText').innerText =
                //     `Tapping completed! ${totalTapCount} taps performed.`;
            }
        }, 0); // Start at time 0 to run simultaneously

        // Add the fast-forward timeline to the master timeline
        masterTimeline.add(fastForwardTimeline);
    }

    // Start the animation
    masterTimeline.play();
}

// Event listener is now handled in main.js

// Expose functions to the window object so they can be called from other scripts
window.startTapping = startTapping;
window.showResults = showResults;

// Function to calculate and show results
function showResults() {
    console.log('Showing results from tapping.js');

    // Get the tap count from the input
    const totalTapCount = parseInt(document.getElementById('tapCount').value) || 100;
    // Get the chemical name and sample weight
    const chemicalName = document.getElementById('chemicalName').value;
    const sampleWeight = parseInt(document.getElementById('sampleWeight').value);

    // Use the results handler to display results from the JSON data
    if (typeof displayResults === 'function') {
        console.log('Using displayResults function to show results from JSON data');
        try {
            // Call the async displayResults function
            displayResults().catch(error => {
                console.error('Error in async displayResults:', error);
                useFallbackCalculation(chemicalName, sampleWeight, totalTapCount);
            });
        } catch (error) {
            console.error('Error calling displayResults:', error);
            useFallbackCalculation(chemicalName, sampleWeight, totalTapCount);
        }
    } else {
        console.warn('displayResults function not found, using fallback calculation');
        useFallbackCalculation(chemicalName, sampleWeight, totalTapCount);
    }
}

// Fallback calculation if the results handler is not available or fails
function useFallbackCalculation(_, sampleWeight, totalTapCount) {
    console.log('Using fallback calculation in tapping.js');

    // Fallback calculation if the results handler is not available
    const bulkDensity = sampleWeight / 100; // Simple approximation

    // Calculate tapped density with a simple formula
    const tapFactor = Math.min(1.0 + (totalTapCount / 500) * 0.2, 1.2); // Max 20% increase
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

    // Update the input fields in the measurement panel
    document.getElementById('bulkDensity').value = bulkDensity.toFixed(2) + ' g/cm³';
    document.getElementById('tappedDensity').value = tappedDensity.toFixed(2) + ' g/cm³';

    // Check if the volume elements exist
    const bulkVolumeElement = document.getElementById('bulkVolume');
    const tappedVolumeElement = document.getElementById('tappedVolume');

    console.log('Volume elements found:', {
        bulkVolume: bulkVolumeElement ? 'Yes' : 'No',
        tappedVolume: tappedVolumeElement ? 'Yes' : 'No'
    });

    // Update volume values if the elements exist
    if (bulkVolumeElement) {
        bulkVolumeElement.value = bulkVolume + ' cm³';
        console.log('Bulk volume updated to:', bulkVolumeElement.value);
    } else {
        console.error('Bulk volume element not found');
    }

    if (tappedVolumeElement) {
        tappedVolumeElement.value = tappedVolume + ' cm³';
        console.log('Tapped volume updated to:', tappedVolumeElement.value);
    } else {
        console.error('Tapped volume element not found');
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


