// hover-labels.js - Show element names on hover

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    const hoverLabel = document.getElementById('hoverLabel');
    
    // Define elements and their labels
    const hoverElements = [
        // Equipment
        { selector: '.weighing-scale', label: 'Weighing Scale' },
        { selector: '.petridish', label: 'Petri Dish' },
        { selector: '.spatchula', label: 'Spatula' },
        { selector: '.chemical-powder-cap', label: 'Powder Container Cap' },
        { selector: '.calcium-carbonate-box', label: 'Chemical Powder Container' },
        { selector: '.bulk-machine', label: 'Tapping Machine' },
        { selector: '.test-tube', label: 'Test Tube' },
        { selector: '.tapping-equipment', label: 'Tapping Equipment' },
        
        // Buttons
        { selector: '#onButton', label: 'ON Button' },
        { selector: '#tareButton', label: 'TARE Button' },
        { selector: '#startTappingBtn', label: 'START Button' },
        { selector: '#startSimulationBtn', label: 'Start Simulation' },
        
        // Displays
        { selector: '#weightDisplay', label: 'Weight Display' },
        { selector: '#bulkMachineDisplay', label: 'Tap Count Display' }
    ];
    
    // Function to show label
    function showLabel(event, labelText) {
        hoverLabel.textContent = labelText;
        hoverLabel.classList.add('show');
        updateLabelPosition(event);
    }
    
    // Function to hide label
    function hideLabel() {
        hoverLabel.classList.remove('show');
    }
    
    // Function to update label position
    function updateLabelPosition(event) {
        const offsetX = 15;
        const offsetY = -30;
        
        let x = event.clientX + offsetX;
        let y = event.clientY + offsetY;
        
        // Get label dimensions
        const labelRect = hoverLabel.getBoundingClientRect();
        const labelWidth = labelRect.width;
        const labelHeight = labelRect.height;
        
        // Prevent label from going off screen
        if (x + labelWidth > window.innerWidth) {
            x = event.clientX - labelWidth - offsetX;
        }
        
        if (y < 0) {
            y = event.clientY + offsetY + 60;
        }
        
        hoverLabel.style.left = x + 'px';
        hoverLabel.style.top = y + 'px';
    }
    
    // Add event listeners to all elements
    hoverElements.forEach(item => {
        const elements = document.querySelectorAll(item.selector);
        
        elements.forEach(element => {
            element.addEventListener('mouseenter', function(e) {
                showLabel(e, item.label);
            });
            
            element.addEventListener('mousemove', function(e) {
                if (hoverLabel.classList.contains('show')) {
                    updateLabelPosition(e);
                }
            });
            
            element.addEventListener('mouseleave', function() {
                hideLabel();
            });
        });
    });
    
    console.log('Hover labels initialized');
});

