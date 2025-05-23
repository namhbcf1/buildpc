/**
 * This script overrides performance-related functions with empty implementations
 * to prevent errors after removing the "Hiệu Năng Dự Kiến" section.
 */

// Override performance initialization function
window.initPerformance = function() {
    console.log('Performance metrics initialization disabled.');
    return;
};

// Override performance update functions
window.updateAllPerformanceMetrics = function() {
    console.log('Performance metrics updates disabled.');
    return;
};

window.updatePerformanceDisplay = function() {
    return;
};

window.updateProgressBar = function() {
    return;
};

window.calculateGamePerformance = function() {
    return 0;
};

window.calculateGraphicsPerformance = function() {
    return 0;
};

window.calculateOfficePerformance = function() {
    return 0;
};

window.updatePerformanceChart = function() {
    return;
};

window.initPerformanceChart = function() {
    return;
};

window.displayDetailedPerformance = function() {
    return;
};

// Override element access to prevent null reference errors
const originalGetElementById = document.getElementById;
document.getElementById = function(id) {
    const performanceIds = [
        'performance-chart',
        'game-performance',
        'graphic-performance',
        'office-performance',
        'livestream-performance',
        'render-performance',
        'bottleneck-indicator',
        'bottleneck-percentage',
        'game-performance-details',
        'strength-metrics',
        'weakness-metrics',
        'upgrade-recommendations',
        'system-performance'
    ];
    
    if (performanceIds.includes(id)) {
        console.log(`Access to removed element '${id}' prevented.`);
        return {
            style: {},
            classList: {
                add: function() {},
                remove: function() {},
                contains: function() { return false; }
            },
            querySelector: function() { return null; },
            querySelectorAll: function() { return []; },
            addEventListener: function() {},
            removeEventListener: function() {},
            appendChild: function() {},
            innerHTML: ''
        };
    }
    
    return originalGetElementById.call(document, id);
};

console.log('Performance metrics features have been disabled.');

/**
 * Performance Disabler Script
 * 
 * This script disables the performance comparison and suggestion features
 * by overriding related functions and preventing them from executing.
 */

document.addEventListener('DOMContentLoaded', function() {
  // Override any functions related to performance comparison
  window.updatePerformance = function() {
    console.log("Performance comparison feature is disabled");
    return;
  };
  
  window.comparePerformance = function() {
    console.log("Performance comparison feature is disabled");
    return;
  };
  
  window.showSuggestions = function() {
    console.log("Suggestions feature is disabled");
    return;
  };
  
  // Remove any event listeners that might be attached to removed elements
  const cpuDropdown = document.getElementById('cpuDropdown');
  const gpuDropdown = document.getElementById('gpuDropdown');
  
  if (cpuDropdown) {
    cpuDropdown.removeEventListener('change', updatePerformance);
  }
  
  if (gpuDropdown) {
    gpuDropdown.removeEventListener('change', updatePerformance);
  }
  
  // Hide any remaining UI elements related to the disabled features
  document.querySelectorAll('.performance-comparison, .suggestions').forEach(function(element) {
    if (element) {
      element.style.display = 'none';
    }
  });
  
  console.log("Performance comparison and suggestions features have been disabled");
});
