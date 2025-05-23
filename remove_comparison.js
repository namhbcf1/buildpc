// Script to remove comparison-related JavaScript code

/**
 * This script removes all comparison and performance-related functionality
 * from the buildsan.js file by executing once when included in HTML.
 * It overrides relevant functions with empty implementations and removes DOM elements.
 */

(function() {
    // List of functions to override with empty implementations
    const functionsToOverride = [
        'updatePerformanceAnalysis',
        'addRecommendation',
        'updateAllPerformanceMetrics',
        'updatePerformanceDisplay',
        'updateProgressBar',
        'calculateGamePerformance',
        'calculateGraphicsPerformance',
        'calculateOfficePerformance',
        'updatePerformanceChart',
        'initPerformanceChart',
        'displayDetailedPerformance',
        'getBottleneckDescription',
        'updateLivestreamAndRenderPerformance',
        'updateBottleneckUI'
    ];

    // Override each function with an empty implementation
    functionsToOverride.forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            console.log(`Disabling function: ${funcName}`);
            window[funcName] = function() {
                // console.log(`${funcName} has been disabled`);
                return null;
            };
        }
    });

    // List of DOM element IDs that might be referenced
    const elementIdsToMock = [
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
        'system-performance',
        'price-performance-chart',
        'optimization-suggestions',
        'performance-tip',
        'selected-game-name',
        'future-upgrade-suggestion',
        'basic-comparison',
        'pro-comparison',
        'creator-comparison',
        'installment-6',
        'installment-12',
        'installment-18',
        'alternative-configs'
    ];

    // Create a proxy for document.getElementById to return mock objects for removed elements
    const originalGetElementById = document.getElementById;
    document.getElementById = function(id) {
        if (elementIdsToMock.includes(id)) {
            console.log(`Preventing access to removed element: ${id}`);
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
                removeChild: function() {},
                innerHTML: '',
                textContent: '',
                innerText: ''
            };
        }
        return originalGetElementById.call(document, id);
    };

    // Hide elements with certain classes
    document.addEventListener('DOMContentLoaded', function() {
        const classesToHide = [
            'performance-comparison',
            'suggestions',
            'performance-section',
            'bottleneck-section',
            'performance-details',
            'comparison-section'
        ];

        classesToHide.forEach(className => {
            document.querySelectorAll(`.${className}`).forEach(element => {
                if (element) {
                    element.style.display = 'none';
                }
            });
        });

        console.log('Comparison and performance features have been removed');
    });

    // Remove Chart.js initialization if needed
    if (window.initPerformanceChart) {
        window.initPerformanceChart = function() {
            console.log('Performance chart initialization prevented');
            return null;
        };
    }

    console.log('Successfully removed comparison and performance-related code');
})();
