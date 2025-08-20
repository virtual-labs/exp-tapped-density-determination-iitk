// reset.js - Reset and restart functionality

// Function to finish the simulation
function finishSimulation() {

    // Reset all elements to their initial positions
    resetElementPositions();

    // Reset all variables and UI elements
    currentStep = 0;
    isWeighingMachineOn = false;
    currentWeight = 0;
    tareWeight = 0;
    currentTapCount = 0;
    totalTapCount = 0;
    remainingTrips = 0;
    totalWeight = 0;

    // Reset UI elements
    document.getElementById('weightDisplay').style.display = 'none';
    document.getElementById('bulkMachineDisplay').textContent = '0';
    document.getElementById('onButton').style.background = 'red';
    document.getElementById('startSimulationBtn').style.display = 'block';
    document.getElementById('sampleWeight').value = '50'; // Reset to default weight
    document.getElementById('bulkDensity').value = ''; // Clear bulk density
    document.getElementById('tappedDensity').value = ''; // Clear tapped density

    // Reset all powder samples
    document.querySelectorAll('.powder-sample').forEach(sample => {
        sample.style.display = 'none';
        sample.style.opacity = '0';
        sample.style.scale = '1';
        sample.style.zIndex = '5'; // Reset to original z-index
    });

    // Reset all collected samples
    document.querySelectorAll('.collected-sample').forEach(sample => {
        sample.style.display = 'none';
        sample.style.opacity = '0';
        sample.style.scale = '1';
        sample.style.zIndex = '9'; // Reset to original z-index
        sample.style.left = '';
        sample.style.bottom = '';
    });

    // Update instruction text
    updateInstructionText();

    // Show the start popup again
    document.getElementById('startPopup').style.display = 'flex';
}

// Function to reset all elements to their initial positions
function resetElementPositions() {
    // Reset any moved elements using GSAP for smooth transitions
    const petridish = document.querySelector('.petridish');
    if (petridish) {
        gsap.to(petridish, {
            left: '43%', // Moved 15% right with separation
            bottom: '10%',
            opacity: 1,
            rotation: 0,
            scale: 1,
            duration: 0.5,
            ease: "power2.inOut",
            onStart: () => {
                petridish.style.display = 'block';
            },
            onComplete: () => {
                // Reset z-index to original value
                petridish.style.zIndex = '8';
            }
        });
    }

    const powderCap = document.querySelector('.chemical-powder-cap');
    if (powderCap) {
        gsap.to(powderCap, {
            left: '18.5%', // Keep the original position for reset
            bottom: '29%',
            rotation: 0,
            scale: 1, // Reset to original size
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
                // Reset z-index to original value
                powderCap.style.zIndex = '8';
            }
        });
    }

    const spatula = document.querySelector('.spatchula');
    if (spatula) {
        // Reset position, rotation and scale
        gsap.to(spatula, {
            left: '43%', // Moved 15% right with separation
            bottom: '2%',
            rotation: 30,

            scale: 1,
            duration: 0.5,
            ease: "power2.inOut"
        });

        // Reset z-index to original value
        spatula.style.zIndex = '6';
    }

    const powderInSpatula = document.querySelector('.chemical-powder-in-spatula');
    if (powderInSpatula) {
        gsap.to(powderInSpatula, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                powderInSpatula.style.display = 'none';
                // Reset position and z-index
                powderInSpatula.style.left = '';
                powderInSpatula.style.bottom = '';
                powderInSpatula.style.zIndex = '6';
            }
        });
    }

    // Reset tapping equipment and test tubes
    const tappingEquipment1 = document.querySelector('.tapping-equipment');
    const tappingEquipment2 = document.getElementById('tapping-equipment2');
    const testTube1 = document.querySelector('.test-tube');
    const testTube2 = document.getElementById('test-tube2');

    if (tappingEquipment1) {
        gsap.to(tappingEquipment1, {
            bottom: '24%',
            duration: 0.5
        });
    }

    if (tappingEquipment2) {
        gsap.to(tappingEquipment2, {
            bottom: '24%',
            duration: 0.5
        });
    }

    if (testTube1) {
        gsap.to(testTube1, {
            bottom: '29.8%',
            duration: 0.5
        });
    }

    if (testTube2) {
        gsap.to(testTube2, {
            bottom: '29.8%',
            duration: 0.5
        });
    }
}

// Function to restart the simulation
function restartSimulation() {

    // Reset all variables and UI elements
    currentStep = 0;
    isWeighingMachineOn = false;
    currentWeight = 0;
    tareWeight = 0;
    currentTapCount = 0;
    totalTapCount = 0;
    remainingTrips = 0;
    totalWeight = 0;

    // Reset UI elements
    document.getElementById('weightDisplay').style.display = 'none';
    document.getElementById('bulkMachineDisplay').textContent = '0';
    document.getElementById('onButton').style.background = 'red';
    document.getElementById('startSimulationBtn').style.display = 'block';
    document.getElementById('sampleWeight').value = '50'; // Reset to default weight
    document.getElementById('bulkDensity').value = ''; // Clear bulk density
    document.getElementById('tappedDensity').value = ''; // Clear tapped density

    // Reset all powder samples
    document.querySelectorAll('.powder-sample').forEach(sample => {
        sample.style.display = 'none';
        sample.style.opacity = '0';
        sample.style.scale = '1';
        sample.style.zIndex = '5'; // Reset to original z-index
    });

    // Reset all collected samples
    document.querySelectorAll('.collected-sample').forEach(sample => {
        sample.style.display = 'none';
        sample.style.opacity = '0';
        sample.style.scale = '1';
        sample.style.zIndex = '9'; // Reset to original z-index
        sample.style.left = '';
        sample.style.bottom = '';
    });

    // Reset all elements to their initial positions
    resetElementPositions();

    // Update instruction text
    updateInstructionText();

    // Show the start popup again
    document.getElementById('startPopup').style.display = 'flex';
}
