// Core Performance Calculation Functions
function calculateGamePerformance(cpuScore, gpuScore) {
    if (!cpuScore || !gpuScore) return 0;
    const weightedCPU = cpuScore * 0.4;
    const weightedGPU = gpuScore * 0.6;
    return Math.min(Math.round(weightedCPU + weightedGPU), 100);
}

function calculateGraphicsPerformance(cpuScore, gpuScore) {
    if (!cpuScore || !gpuScore) return 0;
    const weightedCPU = cpuScore * 0.3;
    const weightedGPU = gpuScore * 0.7;
    return Math.min(Math.round(weightedCPU + weightedGPU), 100);
}

function calculateOfficePerformance(cpuScore, gpuScore) {
    if (!cpuScore || !gpuScore) return 0;
    const weightedCPU = cpuScore * 0.7;
    const weightedGPU = gpuScore * 0.3;
    return Math.min(Math.round(weightedCPU + weightedGPU), 100);
}

function calculateBottleneck(cpuScore, gpuScore) {
    if (!cpuScore || !gpuScore || isNaN(cpuScore) || isNaN(gpuScore)) {
        return { percentage: 0, component: 'None' };
    }
    const difference = Math.abs(cpuScore - gpuScore);
    const bottleneck = Math.min(difference / Math.max(cpuScore, gpuScore) * 100, 100);
    const component = cpuScore < gpuScore ? 'CPU' : 'GPU';
    return {
        percentage: Math.round(bottleneck),
        component: component
    };
}

function calculateStability(cpuScore, gpuScore) {
    if (!cpuScore || !gpuScore) return 0;
    const difference = Math.abs(cpuScore - gpuScore);
    const maxScore = Math.max(cpuScore, gpuScore);
    return Math.round(100 - (difference / maxScore * 100));
}

function generatePerformanceTips(gameType, cpuScore, gpuScore) {
    const tips = [];
    const bottleneck = calculateBottleneck(cpuScore, gpuScore);
    
    if (bottleneck.percentage > 20) {
        tips.push(`Consider upgrading your ${bottleneck.component} to reduce bottleneck`);
    }
    
    switch (gameType) {
        case 'fps':
            if (gpuScore < 70) tips.push('For FPS games, a better GPU will improve frame rates');
            if (cpuScore < 60) tips.push('FPS games benefit from strong CPU performance');
            break;
        case 'moba':
            if (cpuScore < 50) tips.push('MOBA games are CPU-intensive, consider a CPU upgrade');
            break;
        case 'rpg':
            if (gpuScore < 60) tips.push('RPG games benefit from better graphics performance');
            break;
        default:
            if (Math.min(cpuScore, gpuScore) < 50) {
                tips.push('General gaming performance could be improved with hardware upgrades');
            }
    }
    
    return tips;
}

module.exports = {
    calculateGamePerformance,
    calculateGraphicsPerformance,
    calculateOfficePerformance,
    calculateBottleneck,
    calculateStability,
    generatePerformanceTips
}; 