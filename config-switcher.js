/**
 * Configuration Switcher
 * 
 * This script handles switching between different predefined configurations
 * for the PC builder based on common usage scenarios.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Component configuration presets
    const configurations = {
        // Gaming PC configuration
        gaming: {
            cpu: "13600k", // Intel Core i5-13600K
            mainboard: "MSI-Z690", // MSI PRO Z690-A DDR4
            vga: "3070ti", // NVIDIA GeForce RTX 3070 Ti
            ram: "corsair-32", // Corsair 32GB DDR4 3600MHz
            ssd: "samsung-1TB", // Samsung 970 EVO Plus 1TB
            psu: "COSAIR850", // Corsair RM850x 850W
            case: "Corsair-5000D", // Corsair 5000D AIRFLOW
            cpuCooler: "NZXT-X63", // NZXT Kraken X63
            hdd: "4tb", // 4TB HDD
            monitor: "240hz" // 240Hz Gaming Monitor
        },
        
        // Office PC configuration
        office: {
            cpu: "12400f", // Intel Core i5-12400F
            mainboard: "HNZ-B760", // ASUS PRIME B760M-K D4
            vga: "1660s", // NVIDIA GeForce GTX 1660 Super
            ram: "corsair-16", // Corsair 16GB DDR4 3600MHz
            ssd: "crucial-500", // Crucial P2 500GB
            psu: "VSP650", // Cooler Master VSP 650W
            case: "H510F", // NZXT H510 Flow
            cpuCooler: "deepcool", // Deepcool GAMMAXX 400
            hdd: "2tb", // 2TB HDD
            monitor: "office-24" // 24" Office Monitor
        },
        
        // Design & Graphics PC configuration
        design: {
            cpu: "13600k", // Intel Core i5-13600K
            mainboard: "MSI-Z690", // MSI PRO Z690-A DDR4
            vga: "4070", // NVIDIA GeForce RTX 4070
            ram: "corsair-32", // Corsair 32GB DDR4 3600MHz
            ssd: "samsung-1TB", // Samsung 970 EVO Plus 1TB
            psu: "COSAIR850", // Corsair RM850x 850W
            case: "GA3", // DeepCool Gamer Storm GA
            cpuCooler: "CR1000", // Deepcool AK620
            hdd: "4tb", // 4TB HDD
            monitor: "designer-27" // 27" Designer Monitor
        },
        
        // Streaming & Video PC configuration
        streaming: {
            cpu: "13600k", // Intel Core i5-13600K
            mainboard: "MSI-Z690", // MSI PRO Z690-A DDR4
            vga: "3070ti", // NVIDIA GeForce RTX 3070 Ti
            ram: "corsair-32", // Corsair 32GB DDR4 3600MHz
            ssd: "samsung-1TB", // Samsung 970 EVO Plus 1TB
            psu: "COSAIR850", // Corsair RM850x 850W
            case: "GA3", // DeepCool Gamer Storm GA
            cpuCooler: "TMR120SE", // ID-COOLING SE-224-XT
            hdd: "4tb", // 4TB HDD
            monitor: "streaming-monitor" // Streaming Monitor
        },
        
        // Custom configuration (empty)
        custom: {
            // This is empty as it represents the user's custom selections
        }
    };

    // Get all configuration option elements
    const configOptions = document.querySelectorAll('.config-option');
    
    // Add click event listener to each configuration option
    configOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            configOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to the clicked option
            this.classList.add('active');
            
            // Get the selected configuration type
            const configType = this.getAttribute('data-config');
            
            // Apply the configuration if it's not custom
            if (configType !== 'custom') {
                applyConfiguration(configurations[configType]);
            } else {
                // For custom, we just reset the UI highlight but leave selections intact
                highlightCustomOption();
            }
        });
    });

    /**
     * Apply a specific configuration to the component dropdown selections
     * @param {Object} config - The configuration object containing component selections
     */
    function applyConfiguration(config) {
        // Check if config is valid
        if (!config) return;
        
        // Loop through each property in the configuration
        Object.keys(config).forEach(componentType => {
            const componentValue = config[componentType];
            const dropdown = document.getElementById(componentType);
            
            // If dropdown exists and has the value as an option
            if (dropdown) {
                // First check if the value exists in the dropdown
                const optionExists = Array.from(dropdown.options).some(option => option.value === componentValue);
                
                // If the option exists, set the dropdown value
                if (optionExists) {
                    dropdown.value = componentValue;
                    
                    // Trigger change event to update UI and calculations
                    dropdown.dispatchEvent(new Event('change', { bubbles: true }));
                } else {
                    console.warn(`Option ${componentValue} not found in ${componentType} dropdown`);
                }
            }
        });
        
        // Update the total price and compatibility after applying configuration
        try {
            // Check if these functions exist in the global scope
            if (typeof updateSelectedComponents === 'function') {
                updateSelectedComponents();
            }
            
            if (typeof calculateTotalPriceAndSummary === 'function') {
                calculateTotalPriceAndSummary();
            }
            
            if (typeof updateAllPerformanceMetrics === 'function') {
                updateAllPerformanceMetrics();
            }
        } catch (error) {
            console.error('Error updating PC configuration:', error);
        }
    }

    /**
     * Highlight the custom option when user manually changes components
     */
    function highlightCustomOption() {
        // Find custom option and activate it
        const customOption = document.querySelector('.config-option[data-config="custom"]');
        if (customOption) {
            configOptions.forEach(opt => opt.classList.remove('active'));
            customOption.classList.add('active');
        }
    }

    // Add change event listeners to all component dropdowns
    document.querySelectorAll('.component select').forEach(dropdown => {
        dropdown.addEventListener('change', function() {
            // When a user manually changes a dropdown, switch to custom mode
            highlightCustomOption();
        });
    });

    // Add responsiveness for mobile layouts
    function adjustLayoutForMobile() {
        const configSelector = document.querySelector('.config-selector');
        const configOptions = document.querySelector('.config-options');
        
        if (window.innerWidth < 768) {
            // Make options scroll horizontally on mobile
            configOptions.style.overflowX = 'auto';
            configOptions.style.flexWrap = 'nowrap';
            configOptions.style.justifyContent = 'flex-start';
            configOptions.style.paddingBottom = '10px'; // For scrollbar space
            
            // Adjust option width for mobile
            document.querySelectorAll('.config-option').forEach(option => {
                option.style.minWidth = '140px';
                option.style.flex = '0 0 auto';
            });
        } else {
            // Reset styles for desktop
            configOptions.style.overflowX = '';
            configOptions.style.flexWrap = '';
            configOptions.style.justifyContent = '';
            configOptions.style.paddingBottom = '';
            
            document.querySelectorAll('.config-option').forEach(option => {
                option.style.minWidth = '';
                option.style.flex = '';
            });
        }
    }

    // Call on page load and window resize
    adjustLayoutForMobile();
    window.addEventListener('resize', adjustLayoutForMobile);
}); 