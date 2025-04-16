/**
 * Configuration Switcher
 * 
 * This script handles switching between different predefined configurations
 * for the PC builder based on common usage scenarios.
 */

// Fix for "Cannot set property top of #<Window> which has only a getter" error
(function() {
    // List of read-only window properties that might be accidentally modified
    const readOnlyProps = ['top', 'parent', 'self', 'window', 'frames', 'location'];
    
    // Create safe getter/setter for each property
    readOnlyProps.forEach(prop => {
        try {
            const descriptor = Object.getOwnPropertyDescriptor(window, prop);
            if (descriptor && !descriptor.configurable) {
                console.log(`Adding safety wrapper for read-only property: ${prop}`);
                
                // Store original value
                const originalValue = window[prop];
                
                // Create a proxy variable with the original name + '_safe'
                Object.defineProperty(window, prop + '_safe', {
                    get: () => originalValue,
                    set: () => console.warn(`Prevented setting read-only property: ${prop}`),
                    configurable: true
                });
            }
        } catch (e) {
            console.warn(`Error setting up property safety for ${prop}:`, e);
        }
    });
})();

document.addEventListener('DOMContentLoaded', function() {
    // Log loading of configuration switcher
    console.log('✅ Configuration Switcher loaded successfully');

    // Check if debug mode is enabled
    const isDebugMode = window.location.search.includes('debug=true');
    
    // Debug log function
    function debugLog(...args) {
        if (isDebugMode) {
            console.log('🔧 [ConfigSwitcher]', ...args);
        }
    }
    
    // List available components in dropdowns for debugging
    if (isDebugMode) {
        setTimeout(() => {
            debugLog('Scanning available component options:');
            document.querySelectorAll('.component select').forEach(dropdown => {
                const options = Array.from(dropdown.options)
                    .filter(opt => opt.value)
                    .map(opt => opt.value);
                debugLog(`${dropdown.id} options:`, options.join(', '));
            });
        }, 1000);
    }

    // Component configuration presets - revised to match actual component IDs
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
        
        // Office PC configuration - adjusted component IDs
        office: {
            cpu: "12400f", // Intel Core i5-12400F
            mainboard: "HNZ-B760", // ASUS PRIME B760M-K D4
            vga: "1660s", // NVIDIA GeForce GTX 1660 Super
            ram: "gskill-16", // G.SKILL 16GB DDR4 3200MHz
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
            ssd: "crucial-500", // Crucial P2 500GB NVMe PCIe
            psu: "COSAIR850", // Corsair RM850x 850W
            case: "GA3", // DeepCool Gamer Storm GA
            cpuCooler: "CR1000", // Deepcool AK620
            hdd: "4tb", // 4TB HDD
            monitor: "designer-27" // 27" Designer Monitor
        },
        
        // Streaming & Video PC configuration
        streaming: {
            cpu: "13400f", // Intel Core i5-13400F
            mainboard: "HNZ-B760", // ASUS PRIME B760M-K D4
            vga: "3060", // NVIDIA GeForce RTX 3060
            ram: "sstc-16", // Team T-FORCE 16GB DDR4 3600MHz
            ssd: "crucial-500", // Crucial P2 500GB
            psu: "VSP750", // Cooler Master VSP 750W
            case: "GA3", // DeepCool Gamer Storm GA
            cpuCooler: "ID-SE-224", // ID-COOLING SE-224-XT
            hdd: "2tb", // 2TB HDD
            monitor: "streaming-monitor" // Streaming Monitor
        },
        
        // Fallback configuration in case components aren't found
        fallback: {
            cpu: "10400f", // Intel Core i5-10400F
            mainboard: "H510", // MSI H510M PRO
            vga: "1660s", // NVIDIA GeForce GTX 1660 Super
            ram: "adata-8", // ADATA 8GB DDR4 2666MHz
            ssd: "crucial-256", // Crucial BX500 256GB SATA SSD
            psu: "VSP650", // Cooler Master VSP 650W
            case: "H510F", // Case
            cpuCooler: "deepcool" // Deepcool GAMMAXX 400
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
        if (!config) {
            console.warn('Invalid configuration provided');
            return;
        }
        
        console.log('Applying configuration:', Object.keys(config).join(', '));
        
        // Make sure the components grid is visible
        const componentsGrid = document.querySelector('.components-grid');
        if (componentsGrid) {
            componentsGrid.style.display = 'grid';
        }
        
        // Make sure all component containers are visible
        document.querySelectorAll('.component').forEach(component => {
            component.style.display = 'block';
        });
        
        // Track successful changes for logging
        let changedComponents = 0;
        let attemptedComponents = 0;
        
        try {
            // Loop through each property in the configuration
            Object.keys(config).forEach(componentType => {
                attemptedComponents++;
                const componentValue = config[componentType];
                const dropdown = document.getElementById(componentType);
                
                // If dropdown exists 
                if (dropdown) {
                    // Make sure the dropdown is enabled
                    dropdown.disabled = false;
                    
                    // First check if the value exists in the dropdown
                    let optionExists = false;
                    
                    try {
                        optionExists = Array.from(dropdown.options).some(option => option.value === componentValue);
                    } catch (e) {
                        console.warn(`Error checking options for ${componentType}:`, e);
                        optionExists = false;
                    }
                    
                    // If the option exists, set the dropdown value
                    if (optionExists) {
                        console.log(`Setting ${componentType} to "${componentValue}"`);
                        
                        try {
                            dropdown.value = componentValue;
                            
                            // Trigger change event to update UI and calculations
                            dropdown.dispatchEvent(new Event('change', { bubbles: true }));
                            changedComponents++;
                        } catch (e) {
                            console.error(`Error setting ${componentType} value:`, e);
                        }
                    } else {
                        console.warn(`Option "${componentValue}" not found in ${componentType} dropdown`);
                    }
                } else {
                    console.warn(`Dropdown element for ${componentType} not found`);
                }
            });
            
            console.log(`Configuration applied: ${changedComponents}/${attemptedComponents} components updated`);
        } catch (error) {
            console.error('Error applying configuration:', error);
        }
        
        // Update the total price and compatibility after applying configuration
        try {
            // Add a small delay to ensure all changes are processed
            setTimeout(() => {
                updateConfigurationSummary();
            }, 100);
        } catch (error) {
            console.error('Error updating configuration summary:', error);
        }
    }
    
    /**
     * Update configuration summary and calculations
     */
    function updateConfigurationSummary() {
        try {
            // Check if these functions exist in the global scope
            if (typeof updateSelectedComponents === 'function') {
                console.log('Updating selected components');
                updateSelectedComponents();
            }
            
            if (typeof calculateTotalPriceAndSummary === 'function') {
                console.log('Calculating total price');
                calculateTotalPriceAndSummary();
            }
            
            // Handle performance metrics safely - this might be disabled
            try {
                if (typeof updateAllPerformanceMetrics === 'function') {
                    console.log('Updating performance metrics');
                    updateAllPerformanceMetrics();
                }
            } catch (e) {
                // Performance features disabled, this is fine
                console.log('Performance metrics update skipped (features disabled)');
            }
            
            // Handle any chart-related errors that might occur during updates
            preventChartErrors();
        } catch (error) {
            console.error('Error in updateConfigurationSummary:', error);
        }
    }
    
    /**
     * Prevent chart-related errors by providing mock objects
     */
    function preventChartErrors() {
        // Check if Chart.js is loaded and canvas elements exist
        try {
            const performanceChart = document.getElementById('performance-chart');
            if (performanceChart && typeof Chart === 'undefined') {
                // Create a mock Chart object to prevent errors
                window.Chart = function() {
                    return {
                        update: function() {},
                        destroy: function() {}
                    };
                };
            }
            
            // Handle missing canvas context
            if (performanceChart && typeof performanceChart.getContext !== 'function') {
                performanceChart.getContext = function() {
                    return {
                        createLinearGradient: function() {
                            return {
                                addColorStop: function() {}
                            };
                        }
                    };
                };
            }
        } catch (e) {
            console.log('Chart error prevention setup:', e);
        }
    }

    /**
     * Highlight the custom option when user manually changes components
     */
    function highlightCustomOption() {
        // Find custom option and activate it
        const customOption = document.querySelector('.config-option[data-config="custom"]');
        if (customOption) {
            // Remove active class from all options and add to custom
            configOptions.forEach(opt => opt.classList.remove('active'));
            customOption.classList.add('active');
            
            // Make sure the components grid is visible
            const componentsGrid = document.querySelector('.components-grid');
            if (componentsGrid) {
                componentsGrid.style.display = 'grid';
            }
            
            // Make sure all component dropdowns are visible and enabled
            document.querySelectorAll('.component').forEach(component => {
                component.style.display = 'block';
            });
            
            // Thông báo cho người dùng biết họ có thể chọn tự do
            showCustomModeMessage();
            
            // Enable all dropdowns and make them interactive
            document.querySelectorAll('.component select').forEach(dropdown => {
                // Đảm bảo dropdown không bị disabled
                dropdown.disabled = false;
                
                // Thêm class tùy chỉnh để làm nổi bật
                dropdown.classList.add('custom-mode-dropdown');
                
                // Đảm bảo các options trong dropdown đều có thể chọn được
                Array.from(dropdown.options).forEach(option => {
                    option.disabled = option.value === "";
                });
                
                // Kích hoạt sự kiện click để làm nổi bật dropdown
                dropdown.addEventListener('click', function() {
                    // Đảm bảo dropdown có thể mở ra khi click
                    this.focus();
                    this.classList.add('active-dropdown');
                });
            });
            
            console.log('Tùy Chỉnh mode activated - all components should be visible and selectable');
        }
    }
    
    // Thêm thông báo trực quan để người dùng biết họ có thể chọn linh kiện
    function showCustomModeMessage() {
        const existingMessage = document.getElementById('custom-mode-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const message = document.createElement('div');
        message.id = 'custom-mode-message';
        message.innerHTML = '<i class="fas fa-info-circle"></i> Vui lòng bấm vào các dropdown bên dưới để chọn linh kiện tùy thích';
        message.style.textAlign = 'center';
        message.style.margin = '10px 0';
        message.style.padding = '12px';
        message.style.backgroundColor = '#f0f7ff';
        message.style.borderRadius = '5px';
        message.style.color = '#2c74dc';
        message.style.fontWeight = 'bold';
        message.style.border = '2px solid #2c74dc';
        message.style.animation = 'pulse 2s infinite';
        
        // Thêm CSS cho animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(44, 116, 220, 0.4); }
                70% { box-shadow: 0 0 0 10px rgba(44, 116, 220, 0); }
                100% { box-shadow: 0 0 0 0 rgba(44, 116, 220, 0); }
            }
        `;
        document.head.appendChild(style);
        
        const componentSection = document.querySelector('#component-selection .section-header');
        if (componentSection) {
            componentSection.after(message);
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
    
    // Ensure components are visible when the page loads with the "Tùy Chỉnh" (custom) option selected
    const customOption = document.querySelector('.config-option[data-config="custom"]');
    if (customOption && customOption.classList.contains('active')) {
        console.log('Custom option is active on page load - ensuring components are visible');
        setTimeout(() => {
            highlightCustomOption(); // Call this to ensure components are visible
        }, 300);
    }
}); 