// powder-cap.js - Powder box cap events

// Step 4: Powder box cap
document.querySelector('.chemical-powder-cap').addEventListener('click', function() {
    if (currentStep !== 4) return;

    // Create a timeline for smoother animation sequence
    const capTimeline = gsap.timeline({
        onComplete: () => {
            currentStep = 5;
            updateInstructionText();
            playInstructionAudio();
        }
    });

    // First, animate the cap moving up only
    capTimeline.to(this, {
        bottom: '35%',
        zIndex: "5",
        duration: 0.4,
        ease: "power2.out"
    })

    // Then, animate the cap moving to the left
    .to(this, {
        left: '12%', // Moved 15% right with separation, then 5% more left
        duration: 0.5,
        ease: "power2.inOut"
    })

    // Finally, make it slightly smaller to create perspective effect
    .to(this, {
        scale: 0.85, // Make it 85% of original size
        duration: 0.3,
        ease: "power1.out"
    });
});
