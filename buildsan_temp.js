// Import các module cần thiết
import {
    cpuData,
    mainboardData,
    vgaData,
    ramData,
    ssdData,
    psuData,
    caseData,
    cpuCoolerData,
    monitorData,
    hddData
} from './js/data/index.js';

import { getConfig, intelConfigs, amdConfigs } from './js/configs/index.js';

// Các biến và hằng số toàn cục
const components = {
    cpu: cpuData,
    mainboard: mainboardData,
    vga: vgaData,
    ram: ramData,
    ssd: ssdData,
    psu: psuData,
    case: caseData,
    cpuCooler: cpuCoolerData,
    hdd: hddData,
    monitor: monitorData
};

let isAutoSelecting = false;

// Các hàm chính không trùng lặp
function handleImageError(img) {
    img.src = 'images/placeholder.png';
}

    function updateSelectedComponents() {
    // ... code từ hàm gốc
    }

    function calculateTotalPriceAndSummary() {
    // ... code từ hàm gốc
    }

    function updateScores() {
    // ... code từ hàm gốc
}

    function autoSelectConfig() {
    // ... code từ hàm gốc
}

    function populateDropdowns() {
    // ... code từ hàm gốc
}

function updateDropdown(id, value) {
    // ... code từ hàm gốc
}

function evaluateSystemPerformance() {
    // ... code từ hàm gốc
}

function calculateOverallPerformance(cpuScore, gpuScore, type) {
    // ... code từ hàm gốc
}

function updatePerformanceDisplay(elementId, performance) {
    // ... code từ hàm gốc
}

function getBottleneckDescription(bottleneckData) {
    // ... code từ hàm gốc
}

function updatePerformanceUI(cpuScore, gpuScore) {
    // ... code từ hàm gốc
}

function updateProgressBar(elementId, performance) {
    // ... code từ hàm gốc
}

function updateLivestreamAndRenderPerformance(gamePerformance, graphicPerformance, officePerformance) {
    // ... code từ hàm gốc
}

function updateBottleneckUI(cpuScore, gpuScore) {
    // ... code từ hàm gốc
}

function getScoreColor(score) {
    // ... code từ hàm gốc
}

function estimateGameFPS(performanceRating, gameId) {
    // ... code từ hàm gốc
}

function extractCPUFamily(cpuName) {
    // ... code từ hàm gốc
}

function getCPUScore(cpuName) {
    // ... code từ hàm gốc
}

function getGPUScore(gpuName) {
    // ... code từ hàm gốc
}

function calculateBottleneck(cpuScore, gpuScore) {
    // ... code từ hàm gốc
}

function updateScoreMessage(totalScore) {
    // ... code từ hàm gốc
}

function resetGameSpecificPerformance() {
    // ... code từ hàm gốc
}

function calculateStability(cpuScore, gpuScore) {
    // ... code từ hàm gốc
}

function getLighterColor(color) {
    // ... code từ hàm gốc
}

function getFpsColor(fps) {
    // ... code từ hàm gốc
}

function generatePerformanceTips(gameType, cpuScore, gpuScore) {
    // ... code từ hàm gốc
}

function calculateGamePerformance(cpuScore, gpuScore) {
    // ... code từ hàm gốc
}

function calculateGraphicsPerformance(cpuScore, gpuScore) {
    // ... code từ hàm gốc
}

function calculateOfficePerformance(cpuScore, gpuScore) {
    // ... code từ hàm gốc
}

function updateAllPerformanceMetrics() {
    // ... code từ hàm gốc
}

function updatePerformanceAnalysis(gamingValue, graphicsValue, officeValue, livestreamValue, renderValue) {
    // ... code từ hàm gốc
}

function addRecommendation(container, text) {
    // ... code từ hàm gốc
}

function displayDetailedPerformance(gameId) {
    // ... code từ hàm gốc
}

function getScoreForCpu(cpuName) {
    // ... code từ hàm gốc
}

function getScoreForGpu(gpuName) {
    // ... code từ hàm gốc
}

function getSelectedGameId() {
    // ... code từ hàm gốc
}

function calculateEstimatedFPS(gameId, cpuScore, gpuScore) {
    // ... code từ hàm gốc
}

function initPerformanceChart() {
    // ... code từ hàm gốc
}

function updatePerformanceChart(gamingValue, graphicsValue, officeValue, livestreamValue, renderValue) {
    // ... code từ hàm gốc
}

function createGradient(ctx, colorStart, colorEnd) {
    // ... code từ hàm gốc
}

function initPerformance() {
    // ... code từ hàm gốc
}

function setupEventListeners() {
    // ... code từ hàm gốc
}

function loadRequiredLibraries() {
    // ... code từ hàm gốc
}

function initializeDropdowns() {
    // ... code từ hàm gốc
}

function safeSetWindowProperty(property, value) {
    try {
        if (window && typeof window === 'object') {
            const descriptor = Object.getOwnPropertyDescriptor(window, property);
            if (!descriptor || descriptor.configurable) {
                Object.defineProperty(window, property, {
                    value: value,
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            } else if (descriptor.set) {
                descriptor.set.call(window, value);
        } else {
                console.warn(`Cannot set window.${property} - property is not configurable and has no setter`);
            }
        }
    } catch (error) {
        console.error(`Error setting window.${property}:`, error);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadRequiredLibraries();
        initializeDropdowns();
        initPerformance();
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});
