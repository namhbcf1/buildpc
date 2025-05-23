// Import dữ liệu linh kiện từ các file riêng lẻ
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

// Import các cấu hình budget từ module configs
import { getConfig, intelConfigs, amdConfigs } from './js/configs/index.js';

// Đảm bảo các biến đánh giá hiệu năng là biến toàn cục - Fix cho Chrome
window.PERFORMANCE_RATINGS = {
    EXCELLENT: { label: "Xuất sắc", color: "#28a745", percentage: 95 },
    VERY_GOOD: { label: "Rất tốt", color: "#5cb85c", percentage: 80 },
    GOOD: { label: "Tốt", color: "#4bbf73", percentage: 65 },
    AVERAGE: { label: "Trung bình", color: "#f0ad4e", percentage: 50 },
    FAIR: { label: "Khá", color: "#fd7e14", percentage: 35 },
    WEAK: { label: "Yếu", color: "#dc3545", percentage: 20 }
};

// Định nghĩa đánh giá CPU
window.CPU_RATINGS = {
    "Core i3": { 
        gaming: window.PERFORMANCE_RATINGS.FAIR, 
        graphics: window.PERFORMANCE_RATINGS.FAIR, 
        office: window.PERFORMANCE_RATINGS.GOOD 
    },
    "Core i5": { 
        gaming: window.PERFORMANCE_RATINGS.GOOD, 
        graphics: window.PERFORMANCE_RATINGS.GOOD, 
        office: window.PERFORMANCE_RATINGS.VERY_GOOD 
    },
    "Core i7": { 
        gaming: window.PERFORMANCE_RATINGS.VERY_GOOD, 
        graphics: window.PERFORMANCE_RATINGS.VERY_GOOD, 
        office: window.PERFORMANCE_RATINGS.EXCELLENT 
    },
    "Core i9": { 
        gaming: window.PERFORMANCE_RATINGS.EXCELLENT, 
        graphics: window.PERFORMANCE_RATINGS.EXCELLENT, 
        office: window.PERFORMANCE_RATINGS.EXCELLENT 
    },
    "Ryzen 3": { 
        gaming: window.PERFORMANCE_RATINGS.FAIR, 
        graphics: window.PERFORMANCE_RATINGS.FAIR, 
        office: window.PERFORMANCE_RATINGS.GOOD 
    },
    "Ryzen 5": { 
        gaming: window.PERFORMANCE_RATINGS.GOOD, 
        graphics: window.PERFORMANCE_RATINGS.GOOD, 
        office: window.PERFORMANCE_RATINGS.VERY_GOOD 
    },
    "Ryzen 7": { 
        gaming: window.PERFORMANCE_RATINGS.VERY_GOOD, 
        graphics: window.PERFORMANCE_RATINGS.VERY_GOOD, 
        office: window.PERFORMANCE_RATINGS.EXCELLENT 
    },
    "Ryzen 9": { 
        gaming: window.PERFORMANCE_RATINGS.EXCELLENT, 
        graphics: window.PERFORMANCE_RATINGS.EXCELLENT, 
        office: window.PERFORMANCE_RATINGS.EXCELLENT 
    }
};

// Định nghĩa đánh giá VGA
window.VGA_RATINGS = {
    "GTX 1650": { gaming: window.PERFORMANCE_RATINGS.FAIR, graphics: window.PERFORMANCE_RATINGS.FAIR },
    "GTX 1660": { gaming: window.PERFORMANCE_RATINGS.AVERAGE, graphics: window.PERFORMANCE_RATINGS.AVERAGE },
    "RTX 2060": { gaming: window.PERFORMANCE_RATINGS.GOOD, graphics: window.PERFORMANCE_RATINGS.GOOD },
    "RTX 2070": { gaming: window.PERFORMANCE_RATINGS.GOOD, graphics: window.PERFORMANCE_RATINGS.VERY_GOOD },
    "RTX 3060": { gaming: window.PERFORMANCE_RATINGS.GOOD, graphics: window.PERFORMANCE_RATINGS.GOOD },
    "RTX 3070": { gaming: window.PERFORMANCE_RATINGS.VERY_GOOD, graphics: window.PERFORMANCE_RATINGS.VERY_GOOD },
    "RTX 3080": { gaming: window.PERFORMANCE_RATINGS.EXCELLENT, graphics: window.PERFORMANCE_RATINGS.EXCELLENT },
    "RTX 4060": { gaming: window.PERFORMANCE_RATINGS.VERY_GOOD, graphics: window.PERFORMANCE_RATINGS.VERY_GOOD },
    "RTX 4070": { gaming: window.PERFORMANCE_RATINGS.EXCELLENT, graphics: window.PERFORMANCE_RATINGS.EXCELLENT },
    "RTX 4080": { gaming: window.PERFORMANCE_RATINGS.EXCELLENT, graphics: window.PERFORMANCE_RATINGS.EXCELLENT },
    "RTX 4090": { gaming: window.PERFORMANCE_RATINGS.EXCELLENT, graphics: window.PERFORMANCE_RATINGS.EXCELLENT },
    "RX 570": { gaming: window.PERFORMANCE_RATINGS.FAIR, graphics: window.PERFORMANCE_RATINGS.FAIR },
    "RX 580": { gaming: window.PERFORMANCE_RATINGS.AVERAGE, graphics: window.PERFORMANCE_RATINGS.AVERAGE },
    "RX 5600 XT": { gaming: window.PERFORMANCE_RATINGS.GOOD, graphics: window.PERFORMANCE_RATINGS.GOOD },
    "RX 5700 XT": { gaming: window.PERFORMANCE_RATINGS.GOOD, graphics: window.PERFORMANCE_RATINGS.GOOD },
    "RX 6600": { gaming: window.PERFORMANCE_RATINGS.GOOD, graphics: window.PERFORMANCE_RATINGS.GOOD },
    "RX 6700 XT": { gaming: window.PERFORMANCE_RATINGS.VERY_GOOD, graphics: window.PERFORMANCE_RATINGS.VERY_GOOD },
    "RX 6800 XT": { gaming: window.PERFORMANCE_RATINGS.EXCELLENT, graphics: window.PERFORMANCE_RATINGS.EXCELLENT },
    "RX 7600": { gaming: window.PERFORMANCE_RATINGS.VERY_GOOD, graphics: window.PERFORMANCE_RATINGS.VERY_GOOD },
    "RX 7700 XT": { gaming: window.PERFORMANCE_RATINGS.VERY_GOOD, graphics: window.PERFORMANCE_RATINGS.EXCELLENT },
    "RX 7800 XT": { gaming: window.PERFORMANCE_RATINGS.EXCELLENT, graphics: window.PERFORMANCE_RATINGS.EXCELLENT },
    "RX 7900 XTX": { gaming: window.PERFORMANCE_RATINGS.EXCELLENT, graphics: window.PERFORMANCE_RATINGS.EXCELLENT }
};

// Initialize GAME_FPS_ESTIMATES as an empty object first
window.GAME_FPS_ESTIMATES = window.GAME_FPS_ESTIMATES || {};

// Extend the GAME_FPS_ESTIMATES with data from HowManyFPS
window.GAME_FPS_ESTIMATES = {
    ...window.GAME_FPS_ESTIMATES,
    "valorant": {
        notes: "Valorant là game esports nhẹ, tối ưu tốt cho cả CPU và GPU.",
        low: { fps: "350-400", description: "Cài đặt thấp, độ phân giải 1080p" },
        medium: { fps: "300-350", description: "Cài đặt trung bình, độ phân giải 1080p" },
        high: { fps: "250-300", description: "Cài đặt cao, độ phân giải 1080p" },
        ultra: { fps: "200-250", description: "Cài đặt ultra, độ phân giải 1080p" }
    },
    "csgo": {
        notes: "CS:GO phụ thuộc nhiều vào sức mạnh CPU, tối ưu tốt cho gaming.",
        low: { fps: "320-350", description: "Cài đặt thấp, độ phân giải 1080p" },
        medium: { fps: "270-300", description: "Cài đặt trung bình, độ phân giải 1080p" },
        high: { fps: "220-250", description: "Cài đặt cao, độ phân giải 1080p" },
        ultra: { fps: "170-200", description: "Cài đặt ultra, độ phân giải 1080p" }
    },
    "pubg": {
        notes: "PUBG đòi hỏi cân bằng giữa CPU và GPU để đạt hiệu năng tốt nhất.",
        low: { fps: "160-180", description: "Cài đặt thấp, độ phân giải 1080p" },
        medium: { fps: "130-150", description: "Cài đặt trung bình, độ phân giải 1080p" },
        high: { fps: "100-120", description: "Cài đặt cao, độ phân giải 1080p" },
        ultra: { fps: "80-100", description: "Cài đặt ultra, độ phân giải 1080p" }
    },
    "lol": {
        notes: "Liên Minh Huyền Thoại được tối ưu rất tốt, chạy mượt trên hầu hết cấu hình.",
        low: { fps: "350-400", description: "Cài đặt thấp, độ phân giải 1080p" },
        medium: { fps: "300-350", description: "Cài đặt trung bình, độ phân giải 1080p" },
        high: { fps: "250-300", description: "Cài đặt cao, độ phân giải 1080p" },
        ultra: { fps: "200-250", description: "Cài đặt ultra, độ phân giải 1080p" }
    },
    "gta-v": {
        notes: "GTA V là game open-world đòi hỏi cả CPU và GPU mạnh để đạt FPS cao.",
        low: { fps: "100-120", description: "Cài đặt thấp, độ phân giải 1080p" },
        medium: { fps: "80-100", description: "Cài đặt trung bình, độ phân giải 1080p" },
        high: { fps: "60-80", description: "Cài đặt cao, độ phân giải 1080p" },
        ultra: { fps: "45-60", description: "Cài đặt ultra, độ phân giải 1080p" }
    },
    "elden-ring": {
        notes: "Elden Ring có giới hạn FPS và đòi hỏi cấu hình khá để chơi mượt.",
        low: { fps: "80-90", description: "Cài đặt thấp, độ phân giải 1080p" },
        medium: { fps: "65-75", description: "Cài đặt trung bình, độ phân giải 1080p" },
        high: { fps: "50-60", description: "Cài đặt cao, độ phân giải 1080p" },
        ultra: { fps: "40-50", description: "Cài đặt ultra, độ phân giải 1080p" }
    },
    "naraka": {
        notes: "Naraka: Bladepoint cần GPU tốt để xử lý đồ họa và hiệu ứng.",
        low: { fps: "120-140", description: "Cài đặt thấp, độ phân giải 1080p" },
        medium: { fps: "100-120", description: "Cài đặt trung bình, độ phân giải 1080p" },
        high: { fps: "80-100", description: "Cài đặt cao, độ phân giải 1080p" },
        ultra: { fps: "60-80", description: "Cài đặt ultra, độ phân giải 1080p" }
    },
    "genshin": {
        notes: "Genshin Impact được tối ưu tốt và có thể chạy mượt trên nhiều cấu hình.",
        low: { fps: "180-200", description: "Cài đặt thấp, độ phân giải 1080p" },
        medium: { fps: "160-180", description: "Cài đặt trung bình, độ phân giải 1080p" },
        high: { fps: "140-160", description: "Cài đặt cao, độ phân giải 1080p" },
        ultra: { fps: "120-140", description: "Cài đặt ultra, độ phân giải 1080p" }
    },
    "fo4": {
        notes: "FIFA Online 4 được tối ưu tốt cho cả CPU và GPU.",
        low: { fps: "280-300", description: "Cài đặt thấp, độ phân giải 1080p" },
        medium: { fps: "230-250", description: "Cài đặt trung bình, độ phân giải 1080p" },
        high: { fps: "180-200", description: "Cài đặt cao, độ phân giải 1080p" },
        ultra: { fps: "130-150", description: "Cài đặt ultra, độ phân giải 1080p" }
    },
    "black-myth-wukong": {
        notes: "Black Myth: Wukong là game AAA đòi hỏi cấu hình mạnh.",
        low: { fps: "90-100", description: "Cài đặt thấp, độ phân giải 1080p" },
        medium: { fps: "75-85", description: "Cài đặt trung bình, độ phân giải 1080p" },
        high: { fps: "60-70", description: "Cài đặt cao, độ phân giải 1080p" },
        ultra: { fps: "50-60", description: "Cài đặt ultra, độ phân giải 1080p" }
    },
    "god-of-war": {
        notes: "God of War là game đòi hỏi cấu hình mạnh cho các cài đặt cao.",
        low: { fps: "100-110", description: "Cài đặt thấp, độ phân giải 1080p" },
        medium: { fps: "85-95", description: "Cài đặt trung bình, độ phân giải 1080p" },
        high: { fps: "70-80", description: "Cài đặt cao, độ phân giải 1080p" },
        ultra: { fps: "60-70", description: "Cài đặt ultra, độ phân giải 1080p" }
    },
    "battle-teams-2": {
        notes: "Battle Teams 2 là game bắn súng nhẹ, tối ưu tốt cho nhiều cấu hình.",
        low: { fps: "200-250", description: "Cài đặt thấp, độ phân giải 1080p" },
        medium: { fps: "150-200", description: "Cài đặt trung bình, độ phân giải 1080p" },
        high: { fps: "100-150", description: "Cài đặt cao, độ phân giải 1080p" },
        ultra: { fps: "80-100", description: "Cài đặt ultra, độ phân giải 1080p" }
    },
    "delta-force": {
        notes: "Delta Force là game bắn súng cổ điển, chạy tốt trên hầu hết cấu hình.",
        low: { fps: "250-300", description: "Cài đặt thấp, độ phân giải 1080p" },
        medium: { fps: "200-250", description: "Cài đặt trung bình, độ phân giải 1080p" },
        high: { fps: "150-200", description: "Cài đặt cao, độ phân giải 1080p" },
        ultra: { fps: "100-150", description: "Cài đặt ultra, độ phân giải 1080p" }
    },
    "audition": {
        notes: "Audition là game nhảy nhẹ, tối ưu tốt cho mọi cấu hình.",
        low: { fps: "200-250", description: "Cài đặt thấp, độ phân giải 1080p" },
        medium: { fps: "180-220", description: "Cài đặt trung bình, độ phân giải 1080p" },
        high: { fps: "150-180", description: "Cài đặt cao, độ phân giải 1080p" },
        ultra: { fps: "120-150", description: "Cài đặt ultra, độ phân giải 1080p" }
    },
    "mu-origin": {
        notes: "MU Origin là game nhập vai nhẹ, chạy tốt trên nhiều cấu hình.",
        low: { fps: "180-220", description: "Cài đặt thấp, độ phân giải 1080p" },
        medium: { fps: "150-180", description: "Cài đặt trung bình, độ phân giải 1080p" },
        high: { fps: "120-150", description: "Cài đặt cao, độ phân giải 1080p" },
        ultra: { fps: "90-120", description: "Cài đặt ultra, độ phân giải 1080p" }
    },
    "crossfire": {
        notes: "CrossFire là game bắn súng online phổ biến, tối ưu tốt cho CPU.",
        low: { fps: "300-350", description: "Cài đặt thấp, độ phân giải 1080p" },
        medium: { fps: "250-300", description: "Cài đặt trung bình, độ phân giải 1080p" },
        high: { fps: "200-250", description: "Cài đặt cao, độ phân giải 1080p" },
        ultra: { fps: "150-200", description: "Cài đặt ultra, độ phân giải 1080p" }
    }
};

// Update game type classifications
window.GAME_TYPES = {
    ...window.GAME_TYPES,
    "battle-teams-2": { type: "esports", cpuDependency: "high" },
    "delta-force": { type: "esports", cpuDependency: "medium" },
    "audition": { type: "casual", cpuDependency: "low" },
    "mu-origin": { type: "mmorpg", cpuDependency: "medium" },
    "crossfire": { type: "esports", cpuDependency: "very-high" }
};

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

// Khai báo biến toàn cục
let isAutoSelecting = false;

// Add event listener for the game-genre dropdown as soon as the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const gameGenreDropdown = document.getElementById('game-genre');
    if (gameGenreDropdown) {
        gameGenreDropdown.addEventListener('change', function() {
            console.log("🎮 Game genre changed to:", this.value);
            console.log("Calling autoSelectConfig after game change");
            // Call the debug function first
            debugSelections();
            // Then try to auto-select
            autoSelectConfig();
        });
        console.log("✅ Successfully attached event listener to game-genre dropdown");
    } else {
        console.error("❌ Could not find game-genre dropdown on page load");
    }
    
    // Debug function to check all necessary selections
    window.debugSelections = function() {
        console.log("--------- DEBUG SELECTIONS ---------");
        const gameDropdown = document.getElementById('game-genre');
        const budgetRange = document.getElementById('budget-range');
        const cpuTypeDropdown = document.getElementById('cpu-type');
        
        console.log("Elements found:");
        console.log("- Game dropdown:", gameDropdown ? "✅" : "❌");
        console.log("- Budget range:", budgetRange ? "✅" : "❌");
        console.log("- CPU type dropdown:", cpuTypeDropdown ? "✅" : "❌");
        
        if (gameDropdown && budgetRange && cpuTypeDropdown) {
            console.log("Current values:");
            console.log("- Game:", gameDropdown.value || "not selected");
            console.log("- Budget:", budgetRange.value ? `${parseInt(budgetRange.value)/1000000}M` : "not set");
            console.log("- CPU type:", cpuTypeDropdown.value || "not selected");
            
            // Check if all values are valid for auto-selection
            const gameValid = gameDropdown.value && gameDropdown.value.trim() !== "";
            const budgetValid = budgetRange.value && !isNaN(parseInt(budgetRange.value));
            const cpuTypeValid = cpuTypeDropdown.value && cpuTypeDropdown.value.trim() !== "";
            
            console.log("Values valid for auto-selection:");
            console.log("- Game:", gameValid ? "✅" : "❌");
            console.log("- Budget:", budgetValid ? "✅" : "❌");
            console.log("- CPU type:", cpuTypeValid ? "✅" : "❌");
            
            if (gameValid && budgetValid && cpuTypeValid) {
                console.log("✅ All values are valid for auto-selection");
                
                // Check if configuration exists
                const cpuType = cpuTypeDropdown.value.trim();
                const game = gameDropdown.value.trim();
                const budgetInMillions = parseInt(budgetRange.value) / 1000000;
                
                // Check in configs
                let configExists = false;
                if (cpuType === 'Intel' && intelConfigs[game]) {
                    const budgetKey = `${budgetInMillions}M`;
                    if (intelConfigs[game][budgetKey]) {
                        configExists = true;
                        console.log(`✅ Configuration found for Intel, ${game}, ${budgetKey}`);
                    } else {
                        console.log(`❌ No configuration found for Intel, ${game}, ${budgetKey}`);
                        console.log("Available budgets:", Object.keys(intelConfigs[game]));
                    }
                } else if (cpuType === 'Amd' && amdConfigs[game]) {
                    const budgetKey = `${budgetInMillions}M`;
                    if (amdConfigs[game][budgetKey]) {
                        configExists = true;
                        console.log(`✅ Configuration found for AMD, ${game}, ${budgetKey}`);
                    } else {
                        console.log(`❌ No configuration found for AMD, ${game}, ${budgetKey}`);
                        console.log("Available budgets:", Object.keys(amdConfigs[game]));
                    }
                } else {
                    console.log(`❌ No configurations found for ${cpuType}, ${game}`);
                    if (cpuType === 'Intel') {
                        console.log("Available Intel games:", Object.keys(intelConfigs));
                    } else if (cpuType === 'Amd') {
                        console.log("Available AMD games:", Object.keys(amdConfigs));
                    }
                }
            } else {
                console.log("❌ Some values are not valid for auto-selection");
            }
        }
        console.log("-------- END DEBUG --------");
    };
});

// Fallback function for images that fail to load
function handleImageError(img) {
    // Set a default color based on component type
    const componentType = img.dataset.componentType || 'default';
    const bgColors = {
        cpu: '#3498db',
        mainboard: '#2ecc71',
        vga: '#e74c3c',
        ram: '#f39c12',
        ssd: '#9b59b6',
        hdd: '#34495e',
        case: '#1abc9c',
        psu: '#d35400',
        cpuCooler: '#7f8c8d',
        monitor: '#2c3e50',
        default: '#95a5a6'
    };
    
    // Create a canvas to use as the img src
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 150;
    const ctx = canvas.getContext('2d');
    
    // Fill background
    ctx.fillStyle = bgColors[componentType];
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add text
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(img.alt || componentType, canvas.width/2, canvas.height/2);
    
    // Replace the img src with the canvas data
    img.src = canvas.toDataURL('image/png');
    
    // Prevent further error handling
    img.onerror = null;
}

// Giả sử các dữ liệu components đã được định nghĩa đầy đủ




document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("budget-range").addEventListener("input", function () {
        let value = parseInt(this.value);
        let formattedValue = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
        document.getElementById("budget-value").innerText = formattedValue.replace("₫", "") + " triệu";
    });
    // Khai báo các phần tử DOM
    const componentSelects = {
        cpu: document.getElementById('cpu'),
        mainboard: document.getElementById('mainboard'),
        vga: document.getElementById('vga'),
        ram: document.getElementById('ram'),
        ssd: document.getElementById('ssd'),
        psu: document.getElementById('psu'),
        case: document.getElementById('case'),
        cpuCooler: document.getElementById('cpuCooler'),
        hdd: document.getElementById('hdd'),     // <-- Đảm bảo có dòng này
        monitor: document.getElementById('monitor')    // <-- Đảm bảo có dòng này
    };
    Object.entries(componentSelects).forEach(([name, element]) => {
        if (!element) {
            console.error(`Không tìm thấy phần tử #${name}`);
        }
    });
    populateDropdowns('cpu', 'cpu', cpuData);
    populateDropdowns('mainboard', 'mainboard', mainboardData);
    populateDropdowns('vga', 'vga', vgaData);
    populateDropdowns('ram', 'ram', ramData);
    populateDropdowns('ssd', 'ssd', ssdData);
    populateDropdowns('psu', 'psu', psuData);
    populateDropdowns('case', 'case', caseData);
    populateDropdowns('cpuCooler', 'cpuCooler', cpuCoolerData);
    populateDropdowns('hdd', 'hdd', hddData);     // <-- Đảm bảo có dòng này
    populateDropdowns('monitor', 'monitor', monitorData); // <-- Đảm bảo có dòng này

    // Các phần tử hiển thị
    const totalPriceDisplay = document.getElementById('total-price');
    const selectedComponentsList = document.getElementById('selected-components-list');
    const summaryModal = document.getElementById('summary-modal');
    const modalSummaryContent = document.getElementById('modal-components-list'); // SỬA ĐỔI ID CHO ĐÚNG
    const modalTotalPriceDisplay = document.getElementById('modal-total-price');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const calculateButton = document.getElementById('calculate-button');


    // Thêm CSS
    const style = document.createElement('style');
    style.textContent = `
        .component-card {
            border: 1px solid #ddd;
            padding: 15px;
            margin: 10px 0;
            display: flex;
            align-items: center;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .component-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .component-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                120deg,
                transparent,
                rgba(255, 255, 255, 0.3),
                transparent
            );
            transition: 0.5s;
        }

        .component-card:hover::before {
            left: 100%;
        }

        .component-image {
            max-width: 100px;
            margin-right: 20px;
            object-fit: contain;
            transition: transform 0.3s ease;
        }

        .component-card:hover .component-image {
            transform: scale(1.1);
        }

        #total-price {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 15px;
            margin-top: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            animation: priceGlow 2s infinite alternate;
        }

        @keyframes priceGlow {
            from {
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            to {
                box-shadow: 0 2px 20px rgba(0,128,255,0.2);
            }
        }

        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1000;
            animation: modalFade 0.3s ease;
        }

        @keyframes modalFade {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .modal-content {
            background: white;
            padding: 20px;
            width: 90%;
            max-width: 800px;
            margin: 50px auto;
            border-radius: 10px;
            box-shadow: 0 5px 25px rgba(0,0,0,0.2);
            animation: modalSlide 0.3s ease;
        }

        @keyframes modalSlide {
            from {
                transform: translateY(-50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        .component-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            animation: tableAppear 0.5s ease;
        }

        @keyframes tableAppear {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .component-table th {
            background: linear-gradient(135deg, #f4f4f4 0%, #e8e8e8 100%);
            font-weight: bold;
            padding: 12px;
            text-align: left;
            border: 1px solid #ddd;
            transition: background-color 0.3s ease;
        }

        .component-table th:hover {
            background: linear-gradient(135deg, #e8e8e8 0%, #f4f4f4 100%);
        }

        .component-table td {
            padding: 12px;
            border: 1px solid #ddd;
            transition: background-color 0.3s ease;
        }

        .component-table tr:hover td {
            background-color: #f8f9fa;
        }

        .component-table img {
            max-width: 70px;
            height: auto;
            display: block;
            margin: auto;
            transition: transform 0.3s ease;
        }

        .component-table img:hover {
            transform: scale(1.2);
        }

        .score-message, .upgrade-message {
            padding: 10px 15px;
            border-radius: 5px;
            margin: 10px 0;
            animation: messageSlide 0.5s ease;
        }

        @keyframes messageSlide {
            from {
                transform: translateX(-20px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .score-message {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            box-shadow: 0 2px 10px rgba(40,167,69,0.2);
        }

        .upgrade-message {
            background: linear-gradient(135deg, #fd7e14 0%, #ffc107 100%);
            color: white;
            box-shadow: 0 2px 10px rgba(253,126,20,0.2);
        }

        .graphics-quality-container {
            display: flex;
            gap: 10px;
            margin: 15px 0;
            animation: qualityAppear 0.5s ease;
        }

        @keyframes qualityAppear {
            from {
                transform: translateY(10px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        .fps-estimate-container {
            background: linear-gradient(135deg, #007bff 0%, #6610f2 100%);
            color: white;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            animation: fpsGlow 2s infinite alternate;
        }

        @keyframes fpsGlow {
            from {
                box-shadow: 0 2px 10px rgba(0,123,255,0.2);
            }
            to {
                box-shadow: 0 2px 20px rgba(102,16,242,0.4);
            }
        }

        #game-specific-performance {
            padding: 15px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 8px;
            margin: 15px 0;
            animation: performanceSlide 0.5s ease;
        }

        @keyframes performanceSlide {
            from {
                transform: translateY(20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    function updateSelectedComponents() {
        updateScores()
        selectedComponentsList.innerHTML = '';
        let total = 0;
        const selectedComponentsDetails = []; // Khởi tạo mảng để chứa thông tin chi tiết linh kiện

        // Tính toán tổng giá và tạo card
        for (const [type, select] of Object.entries(componentSelects)) {
            const value = select.value;
            if (value && components[type]?.[value]) {
                const component = components[type][value];
                total += component.price;

                const card = document.createElement('div');
                card.className = 'component-card';

                // Create image HTML with error handling
                const imageHtml = component.image 
                    ? `<img src="${component.image}" class="component-image" alt="${component.name}" data-component-type="${type}" onerror="handleImageError(this)">`
                    : `<div class="component-image-placeholder" style="background-color: #f0f0f0; height: 150px; display: flex; align-items: center; justify-content: center;">${component.name}</div>`;

                card.innerHTML = `
                    ${imageHtml}
                    <h3>${component.name} - ${component.price.toLocaleString()} VNĐ</h3>
                    <div class="component-info" style="display: none;">
                        ${component.socket ? `<p>Socket: ${component.socket}</p>` : ''}
                        ${component.memoryType ? `<p>Loại RAM: ${component.memoryType}</p>` : ''}
                        ${component.cores ? `<p>Cores: ${component.cores}</p>` : ''}
                        ${component.threads ? `<p>Threads: ${component.threads}</p>` : ''}
                        ${component.technology ? `<p>Technology: ${component.technology}</p>` : ''}
                        ${component.ram_support ? `<p>RAM Support: ${component.ram_support}</p>` : ''}
                        ${component.ram_bus ? `<p>RAM Bus: ${component.ram_bus}</p>` : ''}
                        ${component.vram ? `<p>VRAM: ${component.vram}</p>` : ''}
                        ${component.vram_type ? `<p>VRAM Type: ${component.vram_type}</p>` : ''}
                        ${component.card_type ? `<p>Card Type: ${component.card_type}</p>` : ''}
                        ${component.type ? `<p>Type: ${component.type}</p>` : ''}
                        ${component.speed ? `<p>Speed: ${component.speed}</p>` : ''}
                        ${component.size ? `<p>Size: ${component.size}</p>` : ''}
                        ${component.nvmeSlots ? `<p>NVMe Slots: ${component.nvmeSlots}</p>` : ''}
                        ${component.pcieVersion ? `<p>PCIe Version: ${component.pcieVersion}</p>` : ''}
                        ${component.formFactor ? `<p>Form Factor: ${component.formFactor}</p>` : ''} <!-- Đã thêm dòng này -->
                        ${component.panelType ? `<p>Panel Type: ${component.panelType}</p>` : ''}
                        ${component.refreshRate ? `<p>Refresh Rate: ${component.refreshRate}</p>` : ''}
                        ${component.screenSize ? `<p>Screen Size: ${component.screenSize}</p>` : ''}
        
                        ${component.sockets ? `<p>Sockets hỗ trợ: ${component.sockets.join(', ')}</p>` : ''}
                        ${component.sync ? `<p>Đồng bộ LED: ${component.sync}</p>` : ''}
        
                        ${component.supportedMainboards ? `<p>Mainboard hỗ trợ: ${component.supportedMainboards.join(', ')}</p>` : ''}
                        ${component.dimensions ? `<p>Kích thước Case: ${component.dimensions}</p>` : ''}
        
                        ${component.connectors ? `<div class="connectors">
                            <p>Connectors:</p>
                            <ul>
                                ${component.connectors.mainboard ? `<li>Mainboard: ${component.connectors.mainboard}</li>` : ''}
                                ${component.connectors.cpu ? `<li>CPU: ${Array.isArray(component.connectors.cpu) ? component.connectors.cpu.join(', ') : component.connectors.cpu}</li>` : ''}
                                ${component.connectors.pcie ? `<li>PCIe: ${Array.isArray(component.connectors.pcie) ? component.connectors.pcie.join(', ') : component.connectors.pcie}</li>` : ''}
                                ${component.connectors.sata ? `<li>SATA: ${component.connectors.sata}</li>` : ''}
                                ${component.connectors.molex ? `<li>Molex: ${component.connectors.molex}</li>` : ''}
                            </ul>
                        </div>` : ''}
        
                        ${component.power ? `<p>Power: ${component.power}</p>` : ''}
                    </div>
                `;

                // Thêm sự kiện click để hiển thị thông tin chi tiết
                card.addEventListener("click", function () {
                    const info = card.querySelector(".component-info");
                    info.style.display = info.style.display === "none" ? "block" : "none";
                });

                selectedComponentsList.appendChild(card);
                selectedComponentsDetails.push(component);
            }
        }


        // Cập nhật tổng giá - FIX CHÍNH
        const priceElement = totalPriceDisplay.querySelector('p');
        if (priceElement) {
            priceElement.textContent = `${total.toLocaleString()} VNĐ`;
        } else {
            console.error('Không tìm thấy phần tử hiển thị giá');
        }

        return { total, selectedComponentsDetails }; // Trả về object chứa cả tổng tiền và danh sách chi tiết
    }

    function calculateTotalPriceAndSummary() {
        if (!modalSummaryContent || !modalTotalPriceDisplay || !imagePreviewContainer) {
            console.error("Missing modal elements");
            return;
        }

        const calculationResult = updateSelectedComponents(); // Get the return value
        const total = calculationResult.total;         // Extract total
        const selectedComponentsDetails = calculationResult.selectedComponentsDetails; // Extract selectedComponentsDetails

        modalSummaryContent.innerHTML = ''; // Xóa nội dung cũ của modal
        imagePreviewContainer.innerHTML = ''; // Xóa ảnh cũ nếu có

        // Ẩn phần hiển thị text tổng tiền trong modal (chỉ hiển thị bảng)
        modalTotalPriceDisplay.style.display = 'none';

        // Tạo bảng HTML để hiển thị thông tin chi tiết
        const table = document.createElement('table');
        table.className = 'component-table'; // Thêm class để CSS (tùy chọn)

        // Tạo hàng tiêu đề bảng
        const headerRow = table.insertRow();
        const headers = ['Loại', 'Hình ảnh', 'Tên Linh Kiện', 'Giá Tiền', 'Bảo hành', 'Tình trạng']; // Thêm "Loại"
        headers.forEach(headerText => {
            const headerCell = document.createElement('th');
            headerCell.textContent = headerText;
            headerRow.appendChild(headerCell);
        });

        // Thêm dữ liệu linh kiện vào bảng
        selectedComponentsDetails.forEach(component => {
            const dataRow = table.insertRow();

            // Ô Hình ảnh


            // Ô Loại linh kiện (type) - Lấy từ key của componentSelects
            const typeCell = dataRow.insertCell();
            let componentType = '';
            for (const [type, select] of Object.entries(componentSelects)) {
                if (select.value === Object.keys(components[type]).find(key => components[type][key] === component)) {
                    componentType = type.toUpperCase(); // In hoa loại linh kiện
                    break;
                }
            }
            typeCell.textContent = componentType;

            const imageCell = dataRow.insertCell();
            if (component.image) {
                const img = document.createElement('img');
                img.src = component.image;
                img.alt = component.name;
                img.style.maxWidth = '70px'; // Điều chỉnh kích thước ảnh trong bảng
                imageCell.appendChild(img);
            }


            // Ô Tên linh kiện
            const nameCell = dataRow.insertCell();
            nameCell.textContent = component.name;

            // Ô Giá
            const priceCell = dataRow.insertCell();
            priceCell.textContent = `${component.price.toLocaleString()} VNĐ`;

            // Ô Bảo hành
            const warrantyCell = dataRow.insertCell();
            warrantyCell.textContent = component.warranty || 'Không có';

            // Ô Tình trạng
            const conditionCell = dataRow.insertCell();
            conditionCell.textContent = component.condition || 'Không rõ';
        });

        modalSummaryContent.appendChild(table); // Thêm bảng vào modal
        summaryModal.style.display = 'block'; // Hiển thị modal
        modalTotalPriceDisplay.style.display = 'block'; // Đảm bảo phần tử hiển thị
        modalTotalPriceDisplay.textContent = `Tổng cộng: ${total.toLocaleString()} VNĐ`; // Cập nhật giá tiền
    }

    function updateScores() {
        console.log("Hàm updateScores() được gọi!");

        const cpuDropdown = document.getElementById('cpu');
        const mainboardDropdown = document.getElementById('mainboard');
        const vgaDropdown = document.getElementById('vga');
        const ssdDropdown = document.getElementById('ssd');
        const psuDropdown = document.getElementById('psu');
        const caseDropdown = document.getElementById('case');
        const cpuCoolerDropdown = document.getElementById('cpuCooler');
        const ramDropdown = document.getElementById('ram');

        // Kiểm tra dropdown elements tồn tại
        if (!cpuDropdown || !mainboardDropdown || !vgaDropdown || !ssdDropdown || !psuDropdown || !caseDropdown || !cpuCoolerDropdown || !ramDropdown) {
            console.error("❌ Không tìm thấy một hoặc nhiều dropdown elements! Kiểm tra lại ID HTML.");
            return;
        }
        const socketMessageElement = document.getElementById("socket-message");
        const scoreMessageElement = document.getElementById("score-message");
        const upgradeMessageElement = document.getElementById("upgrade-message");

        const selectedCpuKey = cpuDropdown.value;
        if (!selectedCpuKey) {
            console.error("❌ Không có CPU nào được chọn!");
            return;
        }
        const selectedCpu = cpuData[selectedCpuKey];

        // Khai báo biến selectedMainboardKey trước khi sử dụng
        const selectedMainboardKey = mainboardDropdown.value;

        // Cập nhật danh sách Mainboard theo Socket của CPU
        const mainboardOptions = mainboardDropdown.options;
        let mainboardCompatible = false;
        for (let i = 0; i < mainboardOptions.length; i++) {
            const mainboardOption = mainboardOptions[i];
            const mainboardKey = mainboardOption.value;
            const mainboard = mainboardData[mainboardKey];

            if (mainboard && mainboard.sockets.includes(selectedCpu.socket)) {
                mainboardOption.style.display = "block";
                mainboardOption.disabled = false;
                mainboardCompatible = true;
            } else {
                mainboardOption.style.display = "none";
                mainboardOption.disabled = true;
            }
        }
        if (!mainboardCompatible) {
            mainboardDropdown.value = "";
        }

        // Cập nhật danh sách RAM theo RAM hỗ trợ của CPU và loại RAM của Mainboard
        const ramOptions = ramDropdown.options;
        let ramCompatible = false;
        const selectedMainboard = mainboardData[selectedMainboardKey];

        for (let i = 0; i < ramOptions.length; i++) {
            const ramOption = ramOptions[i];
            const ramKey = ramOption.value;
            const ram = ramData[ramKey];

            if (
                ram &&
                selectedCpu.ram_support.includes(ram.type) &&
                selectedMainboard && selectedMainboard.memoryType === ram.type
            ) {
                ramOption.style.display = "block";
                ramOption.disabled = false;
                ramCompatible = true;
            } else {
                ramOption.style.display = "none";
                ramOption.disabled = true;
            }
        }
        if (!ramCompatible) {
            ramDropdown.value = "";
        }

        const selectedVgaKey = vgaDropdown.value;
        const selectedSsdKey = ssdDropdown.value;
        const selectedPsuKey = psuDropdown.value;
        const selectedCaseKey = caseDropdown.value;
        const selectedCpuCoolerKey = cpuCoolerDropdown.value;
        const selectedRamKey = ramDropdown.value; // Get selected RAM key


        const cpuName = selectedCpuKey && cpuData[selectedCpuKey] ? cpuData[selectedCpuKey].name : "...";
        const cpuScore = selectedCpuKey && cpuData[selectedCpuKey] ? Number(cpuData[selectedCpuKey].score) : "...";

        const mainboardName = selectedMainboardKey && mainboardData[selectedMainboardKey] ? mainboardData[selectedMainboardKey].name : "...";
        const mainboardScore = selectedMainboardKey && mainboardData[selectedMainboardKey] ? Number(mainboardData[selectedMainboardKey].score) : "...";

        const vgaName = selectedVgaKey && vgaData[selectedVgaKey] ? vgaData[selectedVgaKey].name : "...";
        const vgaScore = selectedVgaKey && vgaData[selectedVgaKey] ? Number(vgaData[selectedVgaKey].score) : "...";

        const ssdName = selectedSsdKey && ssdData[selectedSsdKey] ? ssdData[selectedSsdKey].name : "...";
        const ssdScore = selectedSsdKey && ssdData[selectedSsdKey] ? Number(ssdData[selectedSsdKey].score) : "...";

        const psuName = selectedPsuKey && psuData[selectedPsuKey] ? psuData[selectedPsuKey].name : "...";
        const psuScore = selectedPsuKey && psuData[selectedPsuKey] ? Number(psuData[selectedPsuKey].score) : "...";

        const caseName = selectedCaseKey && caseData[selectedCaseKey] ? caseData[selectedCaseKey].name : "...";
        const caseScore = selectedCaseKey && caseData[selectedCaseKey] ? Number(caseData[selectedCaseKey].score) : "...";

        const cpuCoolerName = selectedCpuCoolerKey && cpuCoolerData[selectedCpuCoolerKey] ? cpuCoolerData[selectedCpuCoolerKey].name : "...";
        const cpuCoolerScore = selectedCpuCoolerKey && cpuCoolerData[selectedCpuCoolerKey] ? Number(cpuCoolerData[selectedCpuCoolerKey].score) : "...";

        const ramName = selectedRamKey && ramData[selectedRamKey] ? ramData[selectedRamKey].name : "..."; // Get RAM name
        const ramScore = selectedRamKey && ramData[selectedRamKey] ? Number(ramData[selectedRamKey].score) : "..."; // Get RAM score


        document.getElementById("cpu-name").textContent = cpuName;
        document.getElementById("cpu-score").textContent = cpuScore;

        document.getElementById("mainboard-name").textContent = mainboardName;
        document.getElementById("mainboard-score").textContent = mainboardScore;

        document.getElementById("vga-name").textContent = vgaName;
        document.getElementById("vga-score").textContent = vgaScore;

        document.getElementById("ssd-name").textContent = ssdName;
        document.getElementById("ssd-score").textContent = ssdScore;

        document.getElementById("ram-name").textContent = ramName; // Display RAM name
        document.getElementById("ram-score").textContent = ramScore; // Display RAM score

        document.getElementById("cpu-cooler-name").textContent = cpuCoolerName;
        document.getElementById("cpu-cooler-score").textContent = cpuCoolerScore;

        document.getElementById("psu-name").textContent = psuName;
        document.getElementById("psu-score").textContent = psuScore;

        document.getElementById("case-name").textContent = caseName;
        document.getElementById("case-score").textContent = caseScore;


        let totalScore = "...";
        let scoreSum = 0; // Tổng điểm

        if (!isNaN(Number(cpuScore))) { scoreSum += Number(cpuScore); }
        if (!isNaN(Number(mainboardScore))) { scoreSum += Number(mainboardScore); }
        if (!isNaN(Number(vgaScore))) { scoreSum += Number(vgaScore); }
        if (!isNaN(Number(ssdScore))) { scoreSum += Number(ssdScore); }
        if (!isNaN(Number(psuScore))) { scoreSum += Number(psuScore); }
        if (!isNaN(Number(caseScore))) { scoreSum += Number(caseScore); }
        if (!isNaN(Number(cpuCoolerScore))) { scoreSum += Number(cpuCoolerScore); }
        if (!isNaN(Number(ramScore))) { scoreSum += Number(ramScore); } // Add RAM score to total


        totalScore = (scoreSum / 8).toFixed(2); // Tính tổng điểm trung bình của tất cả 8 linh kiện và làm tròn đến 2 chữ số thập phân // Changed divisor to 8


        document.getElementById("total-score").textContent = totalScore;
        console.log("totalScore:", totalScore); // Console log 1 lần thôi
        const cpuScoreValue = Number(cpuScore);
        const mainboardScoreValue = Number(mainboardScore);


        let recommendationMessage = ""; // Biến lưu thông báo khuyến nghị dựa trên điểm tổng (CHO KHU VỰC #score-message)
        let upgradeRecommendationMessage = ""; // Biến lưu thông báo KHUYẾN NGHỊ NÂNG CẤP (CHO KHU VỰC #upgrade-message)


        if (totalScore <= 2.5) {
            recommendationMessage = "MÁY HƠI YẾU, CHƠI GAME ONLINE NÊN NÂNG CPU VÀ MAIN";
        } else if (totalScore <= 4) {
            recommendationMessage = "MÁY CŨNG KHÁ ỔN RỒI MUỐN TĂNG FPS MÀ CHƠI SETTING THẤP HÃY TĂNG CPU";
        } else if (totalScore <= 6) {
            recommendationMessage = "MÁY TẠM ỔN RỒI, TĂNG FPS SETTING THẤP NÂNG CPU CÒN TĂNG FPS 3A THÌ NÂNG VGA";
        } else if (totalScore <= 8) {
            recommendationMessage = "MÁY NHƯ NÀY CÒN GÌ MÀ CHÊ NỮA";
        } else if (totalScore <= 10) {
            recommendationMessage = "BẠN MUỐN MUA CẢ SỐP KHÔNG?";
        }


        // THÊM ĐOẠN CODE MỚI ĐỂ KHUYẾN NGHỊ NÂNG CẤP CPU/MAINBOARD (CHO KHU VỰC #upgrade-message)
        if (!isNaN(cpuScoreValue) && !isNaN(mainboardScoreValue)) { // Đảm bảo cả hai giá trị đều là số
            const scoreDiff = cpuScoreValue - mainboardScoreValue; // Tính độ chênh lệch điểm (CPU - Mainboard)

            if (scoreDiff >= 3) { // CPU mạnh hơn Mainboard từ 2 điểm trở lên
                upgradeRecommendationMessage = "Nên nâng cấp Mainboard";
            } else if (scoreDiff <= -3) { // Mainboard mạnh hơn CPU từ 2 điểm trở lên (scoreDiff <= -2 tương đương MainboardScore - CPUScore >= 2)
                upgradeRecommendationMessage = "Nên nâng cấp CPU";
            }
        }


        // HIỂN THỊ THÔNG BÁO Ở CÁC KHU VỰC RIÊNG BIỆT
        if (scoreMessageElement && recommendationMessage) { // Hiển thị thông báo ĐIỂM TỔNG ở khu vực #score-message
            scoreMessageElement.textContent = recommendationMessage;
            scoreMessageElement.classList.add('score-message'); // Thêm class score-message cho #score-message
        }

        if (upgradeMessageElement && upgradeRecommendationMessage) { // Hiển thị thông báo NÂNG CẤP ở khu vực #upgrade-message
            upgradeMessageElement.textContent = upgradeRecommendationMessage;
            upgradeMessageElement.classList.add('upgrade-message'); // Thêm class upgrade-message cho #upgrade-message
        }
    }
    // Gọi hàm updateScores() lần đầu để hiển thị giá trị mặc định hoặc khi trang tải xong
    setTimeout(updateScores, 0);

    function autoSelectConfig() {
        console.log("🔍 autoSelectConfig llamado");
        isAutoSelecting = true;

        const gameDropdown = document.getElementById('game-genre');
        const budgetRange = document.getElementById('budget-range');
        const cpuTypeDropdown = document.getElementById('cpu-type');
        const cpuDropdown = document.getElementById('cpu');
        const mainboardDropdown = document.getElementById('mainboard');
        
        // Cập nhật hiển thị ngân sách
        const budgetValue = document.getElementById('budget-value');
        if (budgetValue) {
            const budgetInMillion = parseInt(budgetRange.value) / 1000000;
            budgetValue.textContent = `${budgetInMillion} triệu`;
        }

        if (!gameDropdown || !budgetRange || !cpuTypeDropdown || !cpuDropdown || !mainboardDropdown) {
            console.error("❌ Không tìm thấy một trong các dropdown! Kiểm tra lại ID.");
            if (!gameDropdown) console.error("Missing: game-genre dropdown");
            if (!budgetRange) console.error("Missing: budget-range input");
            if (!cpuTypeDropdown) console.error("Missing: cpu-type dropdown");
            if (!cpuDropdown) console.error("Missing: cpu dropdown");
            if (!mainboardDropdown) console.error("Missing: mainboard dropdown");
            isAutoSelecting = false;
            return;
        }

        const selectedGame = gameDropdown.value.trim();
        const selectedBudget = parseInt(budgetRange.value); // Chuyển đổi về số nguyên
        const selectedCpuType = cpuTypeDropdown.value.trim();

        console.log(`🎮 Game: "${selectedGame}", 💰 Budget: ${selectedBudget}, 🖥️ CPU Type: "${selectedCpuType}"`);
        
        // Debug each value separately
        console.log(`Game dropdown value: "${selectedGame}" (empty: ${selectedGame === ""})`);
        console.log(`Budget value: ${selectedBudget} (is NaN: ${isNaN(selectedBudget)})`);
        console.log(`CPU type value: "${selectedCpuType}" (empty: ${selectedCpuType === ""})`);

        if (!selectedGame || isNaN(selectedBudget) || !selectedCpuType) {
            console.warn("⚠️ Chưa chọn đầy đủ thông tin! Kiểm tra lại.");
            if (!selectedGame) console.warn("Missing: Game selection");
            if (isNaN(selectedBudget)) console.warn("Missing: Valid budget");
            if (!selectedCpuType) console.warn("Missing: CPU type selection");
            isAutoSelecting = false;
            return;
        }

        // Sử dụng hàm getConfig từ module configs để lấy cấu hình phù hợp
        const budgetInMillions = selectedBudget / 1000000;
        console.log(`💵 Budget in millions: ${budgetInMillions}`);
        
        // Format the budget key correctly - ensure it's an integer followed by 'M'
        const budgetKey = `${Math.floor(budgetInMillions)}M`;
        console.log(`🔑 Looking for budget key: "${budgetKey}"`);
        
        // Double check if game exists in configs
        if (selectedCpuType === 'Intel' && !intelConfigs[selectedGame]) {
            console.error(`❌ Game "${selectedGame}" not found in Intel configurations`);
        } else if (selectedCpuType === 'Amd' && !amdConfigs[selectedGame]) {
            console.error(`❌ Game "${selectedGame}" not found in AMD configurations`);
        }
        
        // Get the configuration but also pass the formatted budget key
        const config = getConfig(selectedCpuType, selectedGame, Math.floor(budgetInMillions));
        console.log("⚙️ Config found:", config);

        if (!config) {
            console.error(`❌ No configuration found for ${selectedCpuType}, ${selectedGame}, ${budgetKey}`);
            // Check if configs exist for this game
            if (selectedCpuType === 'Intel') {
                console.log('Available Intel configs for this game:', intelConfigs[selectedGame] ? Object.keys(intelConfigs[selectedGame]) : 'None');
            } else if (selectedCpuType === 'Amd') {
                console.log('Available AMD configs for this game:', amdConfigs[selectedGame] ? Object.keys(amdConfigs[selectedGame]) : 'None');
            }
            // Tạo div cho cảnh báo full màn hình
            const alertDiv = document.createElement('div');
            alertDiv.style.position = 'fixed';
            alertDiv.style.top = '0';
            alertDiv.style.left = '0';
            alertDiv.style.width = '100%';
            alertDiv.style.height = '100%';
            alertDiv.style.backgroundColor = 'rgba(161, 154, 154, 0.8)';
            alertDiv.style.color = 'white';
            alertDiv.style.fontSize = '29px';
            alertDiv.style.display = 'flex';
            alertDiv.style.alignItems = 'center';
            alertDiv.style.justifyContent = 'center';
            alertDiv.style.zIndex = '9999';
            alertDiv.style.textAlign = 'center';
            alertDiv.innerHTML = `
                <H1>❌ KHÔNG CÓ CẤU HÌNH PHÙ HỢP TẦM GIÁ NÀY❌
                ⚠️ THÊM ÍT TIỀN LÊN NHÉ AE KHÔNG THÌ CÙI LẮM DÙNG CÓ NHƯ KHÔNG MÀ THUI ⚠️</H1>
            `;

            // Thêm div vào body
            document.body.appendChild(alertDiv);

            setTimeout(() => {
                if (document.body.contains(alertDiv)) {
                    document.body.removeChild(alertDiv);
                }
            }, 2000); // Cảnh báo tự động ẩn sau 2 giây
            
            // Thêm sự kiện click để xóa cảnh báo khi người dùng ấn vào màn hình
            alertDiv.addEventListener('click', function () {
                document.body.removeChild(alertDiv);
            });

            // Ngừng chọn tự động
            isAutoSelecting = false;
            return;
        }

        // Lưu trữ các dropdown cần cập nhật
        const dropdownsToUpdate = [
            { id: 'cpu', value: config.cpu },
            { id: 'mainboard', value: config.mainboard },
            { id: 'vga', value: config.vga },
            { id: 'ram', value: config.ram },
            { id: 'ssd', value: config.ssd },
            { id: 'case', value: config.case },
            { id: 'cpuCooler', value: config.cpuCooler },
            { id: 'psu', value: config.psu }
        ];

        // Cập nhật từng dropdown
        for (const item of dropdownsToUpdate) {
            updateDropdown(item.id, item.value);
        }

        // Cập nhật tổng tiền và điểm số
        calculateTotalPriceAndSummary();
        isAutoSelecting = false;
    }



    function populateDropdowns() {
        Object.entries(componentSelects).forEach(([type, select]) => {
            select.innerHTML = '<option value="" disabled selected>Chọn ' + type + '</option>';
            if (components[type]) {
                Object.entries(components[type]).forEach(([key, component]) => {
                    const option = document.createElement('option');
                    option.value = key;
                    option.textContent = `${component.name} - ${component.price.toLocaleString()} VNĐ`;
                    select.appendChild(option);

                });
            }
        });
    }


    // Event Listeners
    document.getElementById("game-genre").addEventListener("change", function() {
        console.log("Game genre changed, calling autoSelectConfig");
        autoSelectConfig();
    });
    
    document.getElementById('budget-range').addEventListener('input', function() {
        // Cập nhật hiển thị giá trị ngân sách ngay lập tức
        const budgetValue = document.getElementById('budget-value');
        if (budgetValue) {
            const budgetInMillion = parseInt(this.value) / 1000000;
            budgetValue.textContent = `${budgetInMillion} triệu`;
        }
    });
    
    document.getElementById('budget-range').addEventListener('change', function() {
        console.log("Budget range changed, calling autoSelectConfig");
        
        // Try to auto-select configuration if possible
        try {
            autoSelectConfig();
        } catch (e) {
            console.error("Error in autoSelectConfig:", e);
        }
        
        // Move to the next step (CPU type selection) regardless of autoSelectConfig result
        const currentStep = document.querySelector('.progress-step.active');
        if (currentStep) {
            const currentStepNumber = parseInt(currentStep.getAttribute('data-step') || '1');
            const nextStepNumber = currentStepNumber + 1;
            
            // Find and activate the next step
            const nextStep = document.querySelector(`.progress-step[data-step="${nextStepNumber}"]`);
            if (nextStep) {
                // Update active step
                document.querySelectorAll('.progress-step').forEach(step => {
                    step.classList.remove('active');
                });
                nextStep.classList.add('active');
                
                // Show relevant section and hide others
                const sections = [
                    document.getElementById('budget-range-selection'),
                    document.getElementById('cpu-type-selection'),
                    document.getElementById('game-selection'),
                    document.getElementById('component-selection')
                ];
                
                sections.forEach((section, index) => {
                    if (section) section.style.display = index + 1 === nextStepNumber ? 'block' : 'none';
                });
                
                // Scroll to the next section
                if (sections[nextStepNumber - 1]) {
                    sections[nextStepNumber - 1].scrollIntoView({ behavior: 'smooth' });
                }
                
                console.log(`Moved to step ${nextStepNumber} (CPU type selection)`);
            }
        }
    });
    
    document.getElementById('cpu-type').addEventListener('change', function() {
        console.log("CPU type changed, calling autoSelectConfig");
        autoSelectConfig();
    });
    
    // Event listener for the manual auto-select button
    document.addEventListener('manual-auto-select', function() {
        console.log("Manual auto-select event received, calling autoSelectConfig");
        autoSelectConfig();
    });



    calculateButton.addEventListener('click', () => {
        console.log("Nút Tính Toán Chi Phí đã được bấm!");
        calculateTotalPriceAndSummary();
        updateScores() // Gọi hàm tính toán và tạo bảng
        summaryModal.style.display = "block"; // Hiển thị modal sau khi tạo bảng
    });

    document.querySelector('.close-modal').addEventListener('click', () => {
        summaryModal.style.display = "none";
    });

    window.addEventListener('click', (event) => {
        if (event.target === summaryModal) {
            summaryModal.style.display = "none";
        }
    });

    // Khởi tạo
    populateDropdowns();
    updateSelectedComponents();

    Object.values(componentSelects).forEach(select => {
        select.addEventListener('change', () => {
            if (!isAutoSelecting) calculateTotalPriceAndSummary();
        });
    });

    // Budget range change handler
    document.addEventListener('DOMContentLoaded', function() {
        // Get the budget range element
        const budgetRange = document.getElementById('budget-range');
        
        if (budgetRange) {
            budgetRange.addEventListener('input', function() {
                updateBudgetDisplay();
            });
            
            budgetRange.addEventListener('change', function() {
                console.log('Budget range changed, calling autoSelectConfig');
                
                try {
                    autoSelectConfig();
                } catch (e) {
                    console.error('Error in autoSelectConfig:', e);
                }
                
                // Ensure progression to the next step even if autoSelectConfig cannot complete
                moveToNextStep();
            });
        } else {
            console.error('Budget range element not found');
        }
    });

    // Define the updateBudgetDisplay function if it doesn't exist
    if (typeof updateBudgetDisplay !== 'function') {
        window.updateBudgetDisplay = function() {
            const budgetRange = document.getElementById('budget-range');
            const budgetValue = document.getElementById('budget-value');
            
            if (budgetRange && budgetValue) {
                const budgetInMillion = parseInt(budgetRange.value) / 1000000;
                budgetValue.textContent = `${budgetInMillion} triệu`;
            }
        };
    }

    /**
     * Move to the next step in the build process
     */
    function moveToNextStep() {
        console.log('Moving to next step...');
        
        // Find current active step
        const activeStep = document.querySelector('.progress-step.active');
        if (!activeStep) {
            console.error('No active step found');
            return;
        }
        
        const currentStepNumber = parseInt(activeStep.getAttribute('data-step'));
        const nextStepNumber = currentStepNumber + 1;
        
        console.log(`Current step: ${currentStepNumber}, Next step: ${nextStepNumber}`);
        
        // Find next step element
        const nextStep = document.querySelector(`.progress-step[data-step="${nextStepNumber}"]`);
        if (!nextStep) {
            console.error(`Next step ${nextStepNumber} not found`);
            return;
        }
        
        // Activate next step
        document.querySelectorAll('.progress-step').forEach(step => {
            step.classList.remove('active');
        });
        nextStep.classList.add('active');
        
        // Show corresponding section
        const sections = [
            document.getElementById('budget-range-selection'),
            document.getElementById('cpu-type-selection'),
            document.getElementById('game-selection'),
            document.getElementById('component-selection')
        ];
        
        // Ensure we have all sections
        if (sections.some(section => !section)) {
            console.error('One or more sections not found:', sections);
        }
        
        // Hide all sections
        sections.forEach(section => {
            if (section) {
                section.style.display = 'none';
            }
        });
        
        // Show next section
        if (sections[nextStepNumber - 1]) {
            sections[nextStepNumber - 1].style.display = 'block';
            // Scroll to the section
            sections[nextStepNumber - 1].scrollIntoView({behavior: 'smooth'});
            console.log(`Showing section for step ${nextStepNumber}`);
        } else {
            console.error(`Section for step ${nextStepNumber} not found`);
        }
        
        console.log(`Moved to step ${nextStepNumber}`);
    }

    /**
     * Go to a specific step in the build process
     * @param {number} stepNumber - The step number to go to (1-based)
     */
    function goToStep(stepNumber) {
        console.log(`Going to step ${stepNumber}`);
        
        if (stepNumber < 1 || stepNumber > 5) {
            console.error(`Invalid step number: ${stepNumber}`);
            return;
        }
        
        // Activate the specified step
        document.querySelectorAll('.progress-step').forEach(step => {
            const stepNum = parseInt(step.getAttribute('data-step'));
            step.classList.toggle('active', stepNum === stepNumber);
        });
        
        // Show corresponding section
        const sections = [
            document.getElementById('budget-range-selection'),
            document.getElementById('cpu-type-selection'),
            document.getElementById('game-selection'),
            document.getElementById('component-selection')
        ];
        
        // Hide all sections
        sections.forEach(section => {
            if (section) section.style.display = 'none';
        });
        
        // Show selected section (step numbers are 1-based, array is 0-based)
        if (sections[stepNumber - 1]) {
            sections[stepNumber - 1].style.display = 'block';
            sections[stepNumber - 1].scrollIntoView({behavior: 'smooth'});
        }
        
        console.log(`Moved to step ${stepNumber}`);
    }
});

// Thêm hàm updateDropdown
function updateDropdown(id, value) {
    console.log(`Updating dropdown ${id} with value ${value}`);
    const dropdown = document.getElementById(id);
    if (!dropdown) {
        console.error(`Dropdown with ID ${id} not found!`);
        return;
    }
    
    if (!value) {
        console.warn(`No value provided for dropdown ${id}`);
        return;
    }
    
    // Get all existing option values
    let existingOptions = Array.from(dropdown.options).map(opt => opt.value);
    console.log(`Existing options for ${id}:`, existingOptions);
    
    // Check if option exists
    if (!existingOptions.includes(value)) {
        console.log(`Value ${value} not found in dropdown ${id}, adding it`);
        
        // Find the corresponding component data
        const componentType = id; // Assume id matches the component type (cpu, mainboard, etc.)
        if (components[componentType] && components[componentType][value]) {
            const component = components[componentType][value];
            const newOption = document.createElement("option");
            newOption.value = value;
            newOption.textContent = `${component.name} - ${component.price.toLocaleString()} VNĐ`;
            dropdown.appendChild(newOption);
            console.log(`Added option "${component.name}" to dropdown ${id}`);
        } else {
            console.warn(`Component data not found for ${componentType}[${value}]`);
            const newOption = document.createElement("option");
            newOption.value = value;
            newOption.textContent = value;
            dropdown.appendChild(newOption);
            console.log(`Added generic option "${value}" to dropdown ${id}`);
        }
    }

    // Set the dropdown value
    dropdown.value = value;
    console.log(`Set dropdown ${id} to value ${value}`);
    
    // Dispatch change event
    const changeEvent = new Event('change');
    dropdown.dispatchEvent(changeEvent);
    console.log(`Dispatched change event for dropdown ${id}`);
}

/**
 * Đánh giá hiệu năng hệ thống dựa trên CPU và GPU được chọn
 */
function evaluateSystemPerformance() {
    console.log('Đang đánh giá hiệu năng hệ thống...');
    
    // Lấy CPU và GPU được chọn
    const cpuDropdown = document.getElementById('cpu-dropdown');
    const gpuDropdown = document.getElementById('gpu-dropdown');
    
    if (!cpuDropdown || !gpuDropdown) {
        console.error('Không tìm thấy dropdown CPU hoặc GPU');
        return;
    }
    
    const selectedCpu = cpuDropdown.value;
    const selectedGpu = gpuDropdown.value;
    
    if (!selectedCpu || !selectedGpu) {
        console.warn('Người dùng chưa chọn CPU hoặc GPU');
        return;
    }
    
    // Tính điểm CPU và GPU
    cpuScore = getScoreForCpu(selectedCpu);
    gpuScore = getScoreForGpu(selectedGpu);
    
    console.log('Điểm số CPU:', cpuScore, 'Điểm số GPU:', gpuScore);
    
    // Cập nhật tất cả các metrics hiệu năng
    updateAllPerformanceMetrics();
    
    // Hiển thị thông tin chi tiết về hiệu năng cho game được chọn
    const gameId = getSelectedGameId();
    if (gameId) {
        displayDetailedPerformance(gameId);
    }
    
    // Tính và hiển thị tổng điểm
    const totalScore = Math.round((cpuScore + gpuScore) / 2);
    const totalPerformanceElement = document.getElementById('total-performance');
    if (totalPerformanceElement) {
        totalPerformanceElement.textContent = totalScore;
    }
    
    console.log('Đã hoàn thành đánh giá hiệu năng hệ thống');
}

// Hàm tính toán hiệu năng tổng thể
function calculateOverallPerformance(cpuScore, gpuScore, type) {
    let score, label, color;
    
    switch(type) {
        case 'gaming':
            score = Math.round((cpuScore * 0.4 + gpuScore * 0.6) * 1.1); // Ưu tiên GPU cho gaming
            break;
        case 'graphics':
            score = Math.round((cpuScore * 0.3 + gpuScore * 0.7) * 1.05); // Ưu tiên cao cho GPU
            break;
        case 'office':
            score = Math.round((cpuScore * 0.7 + gpuScore * 0.3) * 1.2); // Ưu tiên CPU
            break;
        default:
            score = Math.round((cpuScore + gpuScore) / 2);
    }
    
    // Giới hạn score trong khoảng 0-100
    score = Math.min(100, Math.max(0, score));
    
    // Xác định label và color dựa trên score
    if (score >= 90) {
        label = "Xuất sắc";
        color = "#28a745";
    } else if (score >= 75) {
        label = "Rất tốt";
        color = "#4bbf73";
    } else if (score >= 60) {
        label = "Tốt";
        color = "#5cb85c";
    } else if (score >= 45) {
        label = "Trung bình";
        color = "#f0ad4e";
    } else if (score >= 30) {
        label = "Yếu";
        color = "#fd7e14";
    } else {
        label = "Rất yếu";
        color = "#dc3545";
    }
    
    return { score, label, color };
}

// Hàm cập nhật hiển thị hiệu năng
function updatePerformanceDisplay(elementId, performance) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // Cập nhật giá trị
    element.style.width = `${performance}%`;
    element.style.backgroundColor = getScoreColor(performance);
    
    // Cập nhật text
    const metricHeader = element.closest('.performance-metric')?.querySelector('.metric-header span');
    if (metricHeader) {
        metricHeader.setAttribute('data-score', performance);
        metricHeader.textContent = `${performance}`;
    }
}

function getBottleneckDescription(bottleneckData) {
    const { percentage, isCpuBottleneck } = bottleneckData;
    const component = isCpuBottleneck ? "CPU" : "GPU";
    
    if (percentage <= 5) return { text: "Cân bằng hoàn hảo", color: "#28a745" };
    if (percentage <= 10) return { text: `${component} giới hạn nhẹ (${percentage}%)`, color: "#4bbf73" };
    if (percentage <= 20) return { text: `${component} giới hạn trung bình (${percentage}%)`, color: "#f0ad4e" };
    if (percentage <= 30) return { text: `${component} giới hạn đáng kể (${percentage}%)`, color: "#fd7e14" };
    return { text: `${component} giới hạn nghiêm trọng (${percentage}%)`, color: "#dc3545" };
}

/**
 * Cập nhật giao diện hiệu năng dựa trên điểm CPU và GPU
 */

function updateProgressBar(elementId, performance) {
    const progressBar = document.getElementById(elementId);
    if (progressBar) {
        progressBar.style.width = `${performance}%`;
        let backgroundColor;
        if (performance >= 80) {
            backgroundColor = '#4CAF50';
        } else if (performance >= 60) {
            backgroundColor = '#8BC34A';
        } else if (performance >= 40) {
            backgroundColor = '#FFC107';
        } else {
            backgroundColor = '#F44336';
        }
        progressBar.style.backgroundColor = backgroundColor;
        const metricHeader = progressBar.closest('.performance-metric').querySelector('.metric-header span');
        if (metricHeader) {
            metricHeader.setAttribute('data-score', performance);
            metricHeader.textContent = `${performance}`;
        }
    } else {
        console.warn(`Không tìm thấy thanh tiến trình với id ${elementId}`);
    }
}

function updateLivestreamAndRenderPerformance(gamePerformance, graphicPerformance, officePerformance) {
    console.log('Cập nhật hiệu năng livestream và render với:', {
        game: gamePerformance,
        graphic: graphicPerformance,
        office: officePerformance
    });
    const livestreamPerformance = Math.floor((gamePerformance * 0.5 + graphicPerformance * 0.3 + officePerformance * 0.2) * 0.95);
    const renderPerformance = Math.floor((gamePerformance * 0.2 + graphicPerformance * 0.7 + officePerformance * 0.1) * 0.98);
    console.log('Hiệu năng đã tính:', {
        livestream: livestreamPerformance,
        render: renderPerformance
    });
    const livestreamElement = document.getElementById('livestream-performance');
    if (livestreamElement) {
        livestreamElement.style.width = `${livestreamPerformance}%`;
        livestreamElement.style.backgroundColor = getScoreColor(livestreamPerformance);
        livestreamElement.setAttribute('data-value', livestreamPerformance);
        const livestreamSpan = document.querySelector('.metric-header i.fa-broadcast-tower')?.closest('.metric-header')?.querySelector('span');
        if (livestreamSpan) {
            livestreamSpan.setAttribute('data-score', livestreamPerformance);
            livestreamSpan.textContent = 'Livestream';
        }
    }
    const renderElement = document.getElementById('render-performance');
    if (renderElement) {
        renderElement.style.width = `${renderPerformance}%`;
        renderElement.style.backgroundColor = getScoreColor(renderPerformance);
        renderElement.setAttribute('data-value', renderPerformance);
        const renderSpan = document.querySelector('.metric-header i.fa-film')?.closest('.metric-header')?.querySelector('span');
        if (renderSpan) {
            renderSpan.setAttribute('data-score', renderPerformance);
            renderSpan.textContent = 'Render';
        }
    }
    return livestreamPerformance;
}

function updateBottleneckUI(cpuScore, gpuScore) {
    console.log('Cập nhật bottleneck với CPU:', cpuScore, 'GPU:', gpuScore);
    const bottleneckFill = document.getElementById('bottleneck-indicator');
    const bottleneckPercentage = document.getElementById('bottleneck-percentage');
    
    if (!bottleneckFill || !bottleneckPercentage) {
        console.warn('Không tìm thấy phần tử bottleneck-indicator hoặc bottleneck-percentage');
        return;
    }
    
    if (!cpuScore || !gpuScore || isNaN(cpuScore) || isNaN(gpuScore)) {
        console.warn('CPU hoặc GPU score không hợp lệ:', cpuScore, gpuScore);
        bottleneckFill.style.left = '50%';
        bottleneckFill.style.backgroundColor = '#4caf50';
        bottleneckFill.style.border = '2px solid #2e7d32';
        bottleneckPercentage.textContent = 'Chưa xác định';
        return;
    }
    
    // Tính toán bottleneck
    const bottleneckData = calculateBottleneck(cpuScore, gpuScore);
    console.log('Kết quả tính toán bottleneck:', bottleneckData);
    
    // Xác định vị trí của con trỏ bottleneck (trên thanh bottleneck)
    // 0% = bottleneck hoàn toàn CPU, 100% = bottleneck hoàn toàn GPU, 50% = cân bằng lý tưởng
    const percentage = bottleneckData.isCpuBottleneck ? -bottleneckData.percentage : bottleneckData.percentage;
    let position = 50 + (percentage / 2); // Chuyển đổi thành vị trí từ 0 đến 100
    
    // Giới hạn vị trí trong phạm vi hợp lệ
    position = Math.max(5, Math.min(95, position));
    console.log('Vị trí con trỏ bottleneck:', position);
    
    // Thay đổi vị trí bottleneck indicator với animation mượt mà
    bottleneckFill.style.transition = 'left 0.5s ease-out, background-color 0.5s ease-out, border 0.5s ease-out';
    bottleneckFill.style.left = `${position}%`;
    
    // Cập nhật màu sắc cho bottleneck fill dựa trên mức độ cân bằng
    if (Math.abs(percentage) <= 10) {
        // Cân bằng tốt - màu xanh lá
        bottleneckFill.style.backgroundColor = '#4caf50';
        bottleneckFill.style.border = '2px solid #2e7d32';
    } else if (Math.abs(percentage) <= 30) {
        // Cân bằng trung bình - màu vàng
        bottleneckFill.style.backgroundColor = '#ffeb3b';
        bottleneckFill.style.border = '2px solid #fbc02d';
    } else {
        // Mất cân bằng nghiêm trọng - màu đỏ
        bottleneckFill.style.backgroundColor = '#f44336';
        bottleneckFill.style.border = '2px solid #c62828';
    }
    
    // Hiển thị phần trăm bottleneck với animation mượt mà
    bottleneckPercentage.style.transition = 'opacity 0.3s ease-out';
    bottleneckPercentage.style.opacity = '0';
    
    setTimeout(() => {
        // Hiển thị phần trăm bottleneck
        if (Math.abs(percentage) <= 5) {
        bottleneckPercentage.textContent = 'Cân bằng lý tưởng';
        } else if (percentage < 0) {
            bottleneckPercentage.textContent = `CPU bottleneck ${Math.abs(percentage).toFixed(0)}%`;
    } else {
            bottleneckPercentage.textContent = `GPU bottleneck ${percentage.toFixed(0)}%`;
    }
        bottleneckPercentage.style.opacity = '1';
    }, 300);
    
    // Cập nhật chi tiết về hiệu năng game
    updateGameDetailedPerformance(cpuScore, gpuScore);
}

function getScoreColor(score) {
    if (score >= 90) return '#2ecc71'; // Excellent - Green
    if (score >= 70) return '#27ae60'; // Very Good - Dark Green
    if (score >= 50) return '#f1c40f'; // Good - Yellow
    if (score >= 30) return '#e67e22'; // Fair - Orange
    return '#e74c3c'; // Poor - Red
}

// Add CSS for animations and hover effects
const performanceStyle = document.createElement('style');
performanceStyle.textContent = `
    .performance-card {
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .performance-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .progress-bar {
        animation: progressAnimation 1s ease-out;
    }
    
    .score-badge {
        animation: badgeAnimation 0.5s ease-out;
    }
    
    .bottleneck-warning {
        animation: warningAnimation 0.5s ease-out;
    }
    
    @keyframes progressAnimation {
        from { width: 0%; }
    }
    
    @keyframes badgeAnimation {
        from {
            transform: scale(0);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    @keyframes warningAnimation {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(performanceStyle);

/**
 * Ước tính FPS cho game cụ thể dựa trên xếp hạng hiệu năng tổng thể
 */
function estimateGameFPS(performanceRating, gameId) {
    const gameInfo = window.GAME_FPS_ESTIMATES[gameId];
    if (!gameInfo) return { fps: "N/A", description: "Không có dữ liệu" };
    
    const graphicsQuality = document.getElementById('graphics-quality').value;
    const selectedCPU = document.getElementById('cpu').value;
    const selectedVGA = document.getElementById('vga').value;
    
    // Lấy FPS cơ bản từ GAME_FPS_ESTIMATES
    const fpsData = gameInfo[graphicsQuality] || gameInfo.medium;
    let [minFps, maxFps] = fpsData.fps.split('-').map(num => parseInt(num));
    
    // Xác định loại game và mức độ phụ thuộc CPU
    const gameType = window.GAME_TYPES[gameId];
    const cpuDependency = gameType?.cpuDependency || "medium";
    
    // Kiểm tra CPU và xác định hệ số tăng FPS
    const isAMD = selectedCPU.toLowerCase().includes('ryzen');
    const isX3D = selectedCPU.toLowerCase().includes('x3d');
    
    // Hệ số tăng FPS cho CPU
    let cpuBoostFactor = 1;
    
    if (isX3D) {
        // Xử lý đặc biệt cho CPU X3D với mức tăng FPS cao hơn
        switch(gameType?.type) {
            case "esports":
                cpuBoostFactor = 1.5; // +50% cho esports
                if (cpuDependency === "very-high") {
                    cpuBoostFactor = 1.6; // +60% cho esports phụ thuộc nhiều vào CPU
                }
                break;
            case "battle-royale":
                cpuBoostFactor = 1.45; // +45% cho battle royale
                break;
            case "mmorpg":
                cpuBoostFactor = 1.45; // +45% cho MMORPG
                break;
            case "aaa":
                cpuBoostFactor = 1.4; // +40% cho game AAA
                break;
            default:
                cpuBoostFactor = 1.4; // +40% cho các game khác
        }
    } else if (isAMD) {
        // Xử lý cho các CPU AMD thường
        const isOnlineGame = gameType?.type === "esports";
        if (isOnlineGame) {
            switch(cpuDependency) {
                case "very-high":
                    cpuBoostFactor = 1.2;
                    break;
                case "high":
                    cpuBoostFactor = 1.15;
                    break;
                case "medium":
                    cpuBoostFactor = 1.12;
                    break;
                default:
                    cpuBoostFactor = 1.1;
            }
        }
    }
    
    // Áp dụng hệ số CPU và tính toán FPS cuối cùng
    minFps = Math.floor(minFps * cpuBoostFactor);
    maxFps = Math.floor(maxFps * cpuBoostFactor);
    
    // Thêm thông tin về boost vào description
    let additionalInfo = "";
    if (isX3D) {
        const boostPercent = Math.round((cpuBoostFactor - 1) * 100);
        additionalInfo = ` (+${boostPercent}% hiệu năng từ CPU AMD X3D với 3D V-Cache)`;
    } else if (isAMD && cpuBoostFactor > 1) {
        const boostPercent = Math.round((cpuBoostFactor - 1) * 100);
        additionalInfo = ` (+${boostPercent}% hiệu năng từ CPU AMD)`;
    }

    return {
        fps: `${minFps}-${maxFps}`,
        description: fpsData.description + additionalInfo
    };
}

// Hàm trích xuất model CPU từ tên CPU
function extractCPUFamily(cpuName) {
    if (!cpuName) return null;
    
    // Xử lý cho Intel
    if (cpuName.includes('Intel') || cpuName.includes('Core')) {
        if (cpuName.includes('i3')) return 'Core i3';
        if (cpuName.includes('i5')) return 'Core i5';
        if (cpuName.includes('i7')) return 'Core i7';
        if (cpuName.includes('i9')) return 'Core i9';
        if (cpuName.includes('Xeon')) return 'Core i7'; // Xeon tương đương i7 về hiệu năng
        return 'Core i3'; // Mặc định cho các CPU Intel khác
    }
    
    // Xử lý cho AMD
    if (cpuName.includes('AMD') || cpuName.includes('Ryzen')) {
        if (cpuName.includes('Ryzen 3')) return 'Ryzen 3';
        if (cpuName.includes('Ryzen 5')) return 'Ryzen 5';
        if (cpuName.includes('Ryzen 7')) return 'Ryzen 7';
        if (cpuName.includes('Ryzen 9')) return 'Ryzen 9';
        return 'Ryzen 3'; // Mặc định cho các CPU AMD khác
    }
    
    // Nếu không nhận dạng được, trả về null
    return null;
}

// Hàm tính điểm CPU
function getCPUScore(cpuName) {
    if (!cpuName) return 0;
    
    // Chuẩn hóa tên CPU
    const normalizedName = cpuName.toLowerCase().trim();
    
    // Xác định thế hệ CPU
    const generation = getCPUGeneration(normalizedName);
    const family = extractCPUFamily(normalizedName);
    
    // Điểm cơ bản dựa trên dòng CPU
    let baseScore = 0;
    if (normalizedName.includes('i9')) baseScore = 85;
    else if (normalizedName.includes('i7')) baseScore = 75;
    else if (normalizedName.includes('i5')) baseScore = 65;
    else if (normalizedName.includes('i3')) baseScore = 55;
    else if (normalizedName.includes('ryzen 9')) baseScore = 85;
    else if (normalizedName.includes('ryzen 7')) baseScore = 75;
    else if (normalizedName.includes('ryzen 5')) baseScore = 65;
    else if (normalizedName.includes('ryzen 3')) baseScore = 55;
    else baseScore = 45;

    // Điều chỉnh điểm dựa trên thế hệ
    const genBonus = Math.min(15, generation * 1.5);
    
    // Điều chỉnh dựa trên các tính năng đặc biệt
    let featureBonus = 0;
    if (normalizedName.includes('k') || normalizedName.includes('x')) featureBonus += 3;
    if (normalizedName.includes('xt')) featureBonus += 4;
    if (normalizedName.includes('hk')) featureBonus += 5;
    
    // Tính điểm cuối cùng
    let finalScore = Math.min(100, baseScore + genBonus + featureBonus);
    
    console.log('CPU Score calculation:', {
        cpu: cpuName,
        base: baseScore,
        generation: generation,
        genBonus: genBonus,
        featureBonus: featureBonus,
        final: finalScore
    });
    
    return Math.round(finalScore);
}

// Hàm tính điểm GPU
function getGPUScore(gpuName) {
    if (!gpuName) return 0;
    
    // Chuẩn hóa tên GPU
    const normalizedName = gpuName.toLowerCase().trim();
    
    // Điểm cơ bản dựa trên series
    let baseScore = 0;
    
    // NVIDIA RTX 40 Series
    if (normalizedName.includes('rtx 40')) baseScore = 90;
    else if (normalizedName.includes('rtx 4090')) baseScore = 98;
    else if (normalizedName.includes('rtx 4080')) baseScore = 95;
    else if (normalizedName.includes('rtx 4070')) baseScore = 90;
    else if (normalizedName.includes('rtx 4060')) baseScore = 85;
    
    // NVIDIA RTX 30 Series
    else if (normalizedName.includes('rtx 3090')) baseScore = 95;
    else if (normalizedName.includes('rtx 3080')) baseScore = 90;
    else if (normalizedName.includes('rtx 3070')) baseScore = 85;
    else if (normalizedName.includes('rtx 3060')) baseScore = 80;
    
    // NVIDIA RTX 20 Series
    else if (normalizedName.includes('rtx 2080')) baseScore = 85;
    else if (normalizedName.includes('rtx 2070')) baseScore = 80;
    else if (normalizedName.includes('rtx 2060')) baseScore = 75;
    
    // NVIDIA GTX Series
    else if (normalizedName.includes('gtx 1080')) baseScore = 75;
    else if (normalizedName.includes('gtx 1070')) baseScore = 70;
    else if (normalizedName.includes('gtx 1060')) baseScore = 65;
    
    // AMD RX 7000 Series
    else if (normalizedName.includes('rx 7900')) baseScore = 95;
    else if (normalizedName.includes('rx 7800')) baseScore = 90;
    else if (normalizedName.includes('rx 7700')) baseScore = 85;
    else if (normalizedName.includes('rx 7600')) baseScore = 80;
    
    // AMD RX 6000 Series
    else if (normalizedName.includes('rx 6900')) baseScore = 90;
    else if (normalizedName.includes('rx 6800')) baseScore = 85;
    else if (normalizedName.includes('rx 6700')) baseScore = 80;
    else if (normalizedName.includes('rx 6600')) baseScore = 75;
    
    // Điều chỉnh dựa trên các tính năng đặc biệt
    let featureBonus = 0;
    if (normalizedName.includes('ti')) featureBonus += 3;
    if (normalizedName.includes('super')) featureBonus += 2;
    if (normalizedName.includes('xt')) featureBonus += 2;
    
    // VRAM bonus
    let vramBonus = 0;
    if (normalizedName.includes('24gb')) vramBonus = 5;
    else if (normalizedName.includes('16gb')) vramBonus = 4;
    else if (normalizedName.includes('12gb')) vramBonus = 3;
    else if (normalizedName.includes('8gb')) vramBonus = 2;
    
    // Tính điểm cuối cùng
    let finalScore = Math.min(100, baseScore + featureBonus + vramBonus);
    
    console.log('GPU Score calculation:', {
        gpu: gpuName,
        base: baseScore,
        featureBonus: featureBonus,
        vramBonus: vramBonus,
        final: finalScore
    });
    
    return Math.round(finalScore);
}



// Hàm tính hiệu năng đồ họa


// Hàm tính hiệu năng văn phòng


// Hàm tính bottleneck
function calculateBottleneck(cpuScore, gpuScore) {
    if (!cpuScore || !gpuScore) {
        return {
            type: 'unknown',
            percentage: 0,
            description: 'Không đủ thông tin để phân tích'
        };
    }

    const ratio = cpuScore / gpuScore;
    let type, percentage, description;

    if (ratio > 1.2) {
        type = 'cpu';
        percentage = ((ratio - 1) / ratio) * 100;
        description = 'CPU đang là điểm nghẽn';
    } else if (ratio < 0.8) {
        type = 'gpu';
        percentage = ((1 - ratio) / ratio) * 100;
        description = 'GPU đang là điểm nghẽn';
    } else {
        type = 'balanced';
        percentage = 0;
        description = 'Cân bằng lý tưởng';
    }

    return {
        type,
        percentage: Math.round(percentage),
        description
    };
}

// Hàm lấy màu dựa trên điểm số

/**
 * Hiển thị thông báo về điểm số tổng thể
 * @param {number} totalScore Điểm tổng thể của hệ thống
 */
function updateScoreMessage(totalScore) {
    const scoreMessage = document.getElementById('score-message');
    
    if (!scoreMessage) return;
    
    let message = '';
    let messageClass = '';
    
    if (totalScore >= 90) {
        message = '💪 Cấu hình xuất sắc, đáp ứng mọi nhu cầu từ gaming, đồ họa đến công việc nặng.';
        messageClass = 'excellent-score';
    } else if (totalScore >= 75) {
        message = '✨ Cấu hình rất tốt, phù hợp cho cả gaming và các tác vụ đồ họa nặng.';
        messageClass = 'very-good-score';
    } else if (totalScore >= 60) {
        message = '👍 Cấu hình tốt, chơi game ổn định và làm đồ họa tốt.';
        messageClass = 'good-score';
    } else if (totalScore >= 45) {
        message = '🎮 Cấu hình đạt yêu cầu gaming. Đủ mạnh cho hầu hết các game ở mức trung bình.';
        messageClass = 'decent-score';
    } else if (totalScore >= 30) {
        message = '💻 Cấu hình cơ bản, phù hợp cho việc văn phòng và giải trí nhẹ.';
        messageClass = 'basic-score';
    } else {
        message = '⚠️ Cấu hình entry-level, phù hợp cho các tác vụ văn phòng và web.';
        messageClass = 'low-score';
    }
    
    // Thêm gợi ý nâng cấp
    if (totalScore < 60) {
        const upgradeMessage = document.getElementById('upgrade-message');
        if (upgradeMessage) {
            upgradeMessage.innerHTML = '🔧 Gợi ý nâng cấp: Xem xét nâng cấp <strong>CPU</strong> hoặc <strong>GPU</strong> để có trải nghiệm tốt hơn.';
            upgradeMessage.style.display = 'block';
        }
    }
    
    // Cập nhật thông báo
    scoreMessage.innerHTML = message;
    scoreMessage.className = 'system-message ' + messageClass;
    scoreMessage.style.display = 'block';
}

/**
 * Reset thông tin hiệu năng game cụ thể
 */
function resetGameSpecificPerformance() {
    // Ẩn container thông tin chi tiết game
    const gamePerformanceDetails = document.getElementById('game-performance-details');
    if (gamePerformanceDetails) {
        gamePerformanceDetails.style.display = 'none';
        gamePerformanceDetails.innerHTML = '';
    }
    
    // Thiết lập các giá trị mặc định trên UI
    const fpsEstimate = document.getElementById('fps-estimate');
    if (fpsEstimate) {
        fpsEstimate.textContent = '--';
    }
}

/**
 * Tính độ ổn định của FPS dựa trên sự chênh lệch giữa điểm CPU và GPU
 * @param {number} cpuScore Điểm CPU
 * @param {number} gpuScore Điểm GPU
 * @returns {string} Mô tả độ ổn định
 */
function calculateStability(cpuScore, gpuScore) {
    const difference = Math.abs(cpuScore - gpuScore);
    if (difference <= 10) return "Rất ổn định";
    if (difference <= 20) return "Ổn định";
    if (difference <= 30) return "Tương đối ổn định";
    return "Có thể không ổn định";
}

/**
 * Tạo phiên bản sáng hơn của màu được cung cấp
 * @param {string} color Mã màu hex (ví dụ: #FF9800)
 * @returns {string} Mã màu hex sáng hơn
 */
function getLighterColor(color) {
    // Chuyển đổi từ mã màu hex sang RGB
    let hex = color.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    // Làm nhạt màu (tăng độ sáng)
    r = Math.min(255, r + 40);
    g = Math.min(255, g + 40);
    b = Math.min(255, b + 40);
    
    // Chuyển đổi lại thành mã hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Lấy màu dựa trên giá trị FPS
 * @param {number} fps Giá trị FPS
 * @returns {string} Mã màu hex tương ứng với mức FPS
 */
function getFpsColor(fps) {
    if (fps >= 240) {
        return '#388E3C'; // dark green - excellent
    } else if (fps >= 144) {
        return '#7CB342'; // light green - great
    } else if (fps >= 100) {
        return '#039BE5'; // blue - good
    } else if (fps >= 60) {
        return '#FB8C00'; // orange - acceptable
    } else if (fps >= 30) {
        return '#E53935'; // light red - poor
    } else {
        return '#B71C1C'; // dark red - very poor
    }
}

/**
 * Tạo gợi ý tối ưu hiệu năng dựa trên loại game và điểm CPU/GPU
 * @param {Object} gameType Thông tin về loại game
 * @param {number} cpuScore Điểm CPU
 * @param {number} gpuScore Điểm GPU
 * @returns {string} HTML chuỗi các gợi ý hiệu năng
 */
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

/**
 * Tính toán hiệu năng gaming dựa trên điểm CPU và GPU
 */
function calculateGamePerformance(cpuScore, gpuScore) {
    if (typeof cpuScore === 'undefined' || typeof gpuScore === 'undefined') {
        console.warn('cpuScore hoặc gpuScore chưa được định nghĩa');
        return 0;
    }
    const gameId = getSelectedGameId();
    const gameType = getGameType(gameId).type;
    let cpuWeight = 0.3;
    let gpuWeight = 0.7;
    if (gameType === 'esports') {
                cpuWeight = 0.5;
                gpuWeight = 0.5;
    } else if (gameType === 'strategy') {
        cpuWeight = 0.6;
        gpuWeight = 0.4;
    } else if (gameType === 'aaa') {
        cpuWeight = 0.2;
        gpuWeight = 0.8;
    }
    const performance = Math.round(cpuScore * cpuWeight + gpuScore * gpuWeight);
    return Math.min(100, performance);
}

/**
 * Tính toán hiệu năng đồ họa dựa trên điểm CPU và GPU
 */
function calculateGraphicsPerformance(cpuScore, gpuScore) {
    if (!cpuScore || !gpuScore) return 0;
    // Đồ họa phụ thuộc nhiều vào GPU (70%) và ít vào CPU (30%)
    return Math.min(100, Math.round((cpuScore * 0.3) + (gpuScore * 0.7)));
}

/**
 * Tính toán hiệu năng văn phòng dựa trên điểm CPU và GPU
 */
function calculateOfficePerformance(cpuScore, gpuScore) {
    if (!cpuScore || !gpuScore) return 0;
    // Văn phòng phụ thuộc chủ yếu vào CPU (80%) và ít vào GPU (20%)
    return Math.min(100, Math.round((cpuScore * 0.8) + (gpuScore * 0.2)));
}

/**
 * Cập nhật tất cả các metrics hiệu năng dựa trên CPU và GPU
 */
function updateAllPerformanceMetrics() {
    // Get CPU and GPU dropdowns
    const cpuDropdown = document.getElementById('cpu');
    const vgaDropdown = document.getElementById('vga');
    
    if (!cpuDropdown || !vgaDropdown || !cpuDropdown.value || !vgaDropdown.value) {
        console.warn('CPU hoặc GPU score chưa được thiết lập');
        return;
    }
    
    // Calculate scores directly
    const cpuScore = getCPUScore(cpuDropdown.value);
    const gpuScore = getGPUScore(vgaDropdown.value);
    
    if (!cpuScore || !gpuScore) {
        console.warn('CPU hoặc GPU score không hợp lệ');
        return;
    }
    
    console.log(`Updating metrics with CPU score: ${cpuScore}, GPU score: ${gpuScore}`);
    
    // Store scores in window for other functions to use
    window.cpuScore = cpuScore;
    window.gpuScore = gpuScore;
    
    // Calculate performance metrics
    const gamePerformance = calculateGamePerformance(cpuScore, gpuScore);
    const graphicPerformance = calculateGraphicsPerformance(cpuScore, gpuScore);
    const officePerformance = calculateOfficePerformance(cpuScore, gpuScore);
    const livestreamPerformance = Math.min(100, Math.round((gamePerformance * 0.4) + (cpuScore * 0.6)));
    const renderPerformance = Math.min(100, Math.round((graphicPerformance * 0.5) + (cpuScore * 0.3) + (gpuScore * 0.2)));
    
    // Update UI elements
    updatePerformanceDisplay('game-performance', gamePerformance);
    updatePerformanceDisplay('graphic-performance', graphicPerformance);
    updatePerformanceDisplay('office-performance', officePerformance);
    updatePerformanceDisplay('livestream-performance', livestreamPerformance);
    updatePerformanceDisplay('render-performance', renderPerformance);
    
    // Update bottleneck indicator
    updateBottleneckUI(cpuScore, gpuScore);
    
    // Update performance chart if available
    updatePerformanceChart(gamePerformance, graphicPerformance, officePerformance, livestreamPerformance, renderPerformance);
    
    // Update game performance details if a game is selected
    const gameId = document.getElementById('game-genre')?.value;
    if (gameId) {
        displayDetailedPerformance(gameId);
    }
    
    // Update performance analysis
    updatePerformanceAnalysis(gamePerformance, graphicPerformance, officePerformance, livestreamPerformance, renderPerformance);
}

// Hàm cập nhật phân tích hiệu năng
function updatePerformanceAnalysis(gamingValue, graphicsValue, officeValue, livestreamValue, renderValue) {
    try {
        const analysisContainer = document.getElementById('performance-analysis');
        if (!analysisContainer) return;
        
        analysisContainer.innerHTML = ''; // Clear previous analysis
        
        const recommendations = [];
        
        // Gaming analysis
        if (gamingValue < 50) {
            recommendations.push('Consider upgrading your GPU for better gaming performance');
        }
        
        // Graphics analysis
        if (graphicsValue < 50) {
            recommendations.push('For better graphics performance, upgrade your GPU or add more VRAM');
        }
        
        // Office analysis
        if (officeValue < 50) {
            recommendations.push('For better office performance, consider upgrading your CPU or adding more RAM');
        }
        
        // Livestream analysis
        if (livestreamValue < 50) {
            recommendations.push('For smoother livestreaming, upgrade your CPU and ensure good internet connection');
        }
        
        // Render analysis
        if (renderValue < 50) {
            recommendations.push('For faster rendering, consider a CPU with more cores or a workstation GPU');
        }
        
        // Add overall recommendation
        const avgScore = (gamingValue + graphicsValue + officeValue + livestreamValue + renderValue) / 5;
        if (avgScore < 30) {
            recommendations.unshift('Your system needs significant upgrades for better overall performance');
        } else if (avgScore < 60) {
            recommendations.unshift('Consider selective upgrades based on your primary usage');
        } else if (avgScore < 80) {
            recommendations.unshift('Your system performs well but has room for improvement');
        } else {
            recommendations.unshift('Your system performs excellently across all tasks');
        }
        
        // Add recommendations to container
        recommendations.forEach(recommendation => {
            addRecommendation(analysisContainer, recommendation);
        });
        
    } catch (error) {
        console.error('Error updating performance analysis:', error);
    }
}

// Hàm thêm khuyến nghị
function addRecommendation(container, text) {
    const li = document.createElement('li');
    li.className = 'recommendation-item';
    li.innerHTML = `<i class="fas fa-arrow-right"></i> ${text}`;
    container.appendChild(li);
}

// Hàm hiển thị chi tiết hiệu năng game
function displayDetailedPerformance(gameId) {
    if (!gameId) return;
    
    const gameName = getGameName(gameId);
    const cpuScore = window.cpuScore || 0;
    const gpuScore = window.gpuScore || 0;
    
    console.log(`Displaying performance for ${gameName} with CPU: ${cpuScore}, GPU: ${gpuScore}`);
    
    // Tính FPS dự kiến
    const estimatedFps = calculateEstimatedFPS(gameId, cpuScore, gpuScore);
    
    // Lấy thông tin game từ GAME_FPS_ESTIMATES
    const gameInfo = window.GAME_FPS_ESTIMATES[gameId] || {};
    
    // Xác định preset dựa vào điểm hiệu năng
    let preset = 'low';
    const combinedScore = (cpuScore + gpuScore) / 2;
    
    if (combinedScore >= 85) {
        preset = 'ultra';
    } else if (combinedScore >= 70) {
        preset = 'high';
    } else if (combinedScore >= 50) {
        preset = 'medium';
    }
    
    // Lấy thông tin FPS từ bảng dữ liệu
    const presetInfo = gameInfo[preset] || { fps: "N/A", description: "Không có dữ liệu" };
    const fpsRange = presetInfo.fps;
    
    // Phân tách khoảng FPS
    let minFps = 0, maxFps = 0;
    if (fpsRange && fpsRange.includes('-')) {
        const parts = fpsRange.split('-');
        minFps = parseInt(parts[0], 10);
        maxFps = parseInt(parts[1], 10);
    }
    
    // Tính độ ổn định
    const stability = calculateStability(cpuScore, gpuScore);
    
    // Tạo nội dung chi tiết
    const detailsContainer = document.getElementById('game-performance-details');
    if (detailsContainer) {
        detailsContainer.innerHTML = `
            <div class="game-details">
                <h5 class="game-title">${gameName}</h5>
                <div class="performance-stats">
                    <div class="stat-item">
                        <span class="stat-label">FPS Dự kiến:</span>
                        <span class="stat-value" style="color: ${getFpsColor(minFps)}">
                            ${minFps}-${maxFps} FPS
                        </span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Độ ổn định:</span>
                        <span class="stat-value" style="color: ${getStabilityColor(stability)}">
                            ${stability}%
                        </span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Cài đặt:</span>
                        <span class="stat-value">${presetInfo.description}</span>
                    </div>
                </div>
                <div class="game-notes">
                    <p>${gameInfo.notes || 'Không có thông tin bổ sung.'}</p>
                </div>
            </div>
        `;
    } else {
        console.error('Game performance details container not found');
    }
}

// Hàm lấy điểm CPU dựa vào CPU được chọn
function getScoreForCpu(cpuName) {
    // Thiết lập điểm mặc định nếu CPU không được tìm thấy
    let score = 50;
    
    // Điểm CPU cho các CPU Intel phổ biến
    const intelScores = {
        'i3-10100': 45,
        'i3-10300': 50,
        'i3-12100': 60,
        'i3-12100F': 60,
        'i5-10400': 65,
        'i5-10600K': 70,
        'i5-11400': 72,
        'i5-11600K': 75,
        'i5-12400': 78,
        'i5-12600K': 85,
        'i5-13400': 80,
        'i5-13600K': 88,
        'i7-10700K': 80,
        'i7-11700K': 83,
        'i7-12700K': 90,
        'i7-13700K': 95,
        'i9-10900K': 85,
        'i9-11900K': 87,
        'i9-12900K': 93,
        'i9-13900K': 98
    };
    
    // Điểm CPU cho các CPU AMD phổ biến
    const amdScores = {
        'Ryzen 3 3100': 45,
        'Ryzen 3 4100': 50,
        'Ryzen 5 3600': 68,
        'Ryzen 5 5600': 75,
        'Ryzen 5 5600X': 77,
        'Ryzen 5 7600X': 85,
        'Ryzen 7 3700X': 75,
        'Ryzen 7 5700X': 82,
        'Ryzen 7 5800X': 85,
        'Ryzen 7 7800X3D': 95,
        'Ryzen 9 5900X': 90,
        'Ryzen 9 5950X': 93,
        'Ryzen 9 7900X': 95,
        'Ryzen 9 7950X': 97
    };
    
    // Tìm CPU trong danh sách Intel
    for (const cpu in intelScores) {
        if (cpuName.includes(cpu)) {
            score = intelScores[cpu];
            break;
        }
    }
    
    // Tìm CPU trong danh sách AMD
    for (const cpu in amdScores) {
        if (cpuName.includes(cpu)) {
            score = amdScores[cpu];
            break;
        }
    }
    
    return score;
}

// Hàm lấy điểm GPU dựa vào GPU được chọn
function getScoreForGpu(gpuName) {
    // Thiết lập điểm mặc định nếu GPU không được tìm thấy
    let score = 50;
    
    // Điểm GPU cho các GPU NVIDIA phổ biến
    const nvidiaScores = {
        'GTX 1650': 40,
        'GTX 1650 Super': 45,
        'GTX 1660': 50,
        'GTX 1660 Super': 55,
        'GTX 1660 Ti': 57,
        'RTX 2060': 60,
        'RTX 2060 Super': 65,
        'RTX 2070': 70,
        'RTX 2070 Super': 75,
        'RTX 2080': 80,
        'RTX 2080 Super': 83,
        'RTX 2080 Ti': 87,
        'RTX 3050': 55,
        'RTX 3060': 65,
        'RTX 3060 Ti': 75,
        'RTX 3070': 80,
        'RTX 3070 Ti': 83,
        'RTX 3080': 90,
        'RTX 3080 Ti': 93,
        'RTX 3090': 95,
        'RTX 3090 Ti': 97,
        'RTX 4060': 70,
        'RTX 4060 Ti': 78,
        'RTX 4070': 85,
        'RTX 4070 Ti': 90,
        'RTX 4080': 95,
        'RTX 4090': 99
    };
    
    // Điểm GPU cho các GPU AMD phổ biến
    const amdGpuScores = {
        'RX 6500 XT': 45,
        'RX 6600': 60,
        'RX 6600 XT': 65,
        'RX 6650 XT': 68,
        'RX 6700 XT': 75,
        'RX 6750 XT': 78,
        'RX 6800': 82,
        'RX 6800 XT': 87,
        'RX 6900 XT': 92,
        'RX 6950 XT': 94,
        'RX 7600': 65,
        'RX 7700 XT': 80,
        'RX 7800 XT': 87,
        'RX 7900 XT': 93,
        'RX 7900 XTX': 96
    };
    
    // Tìm GPU trong danh sách NVIDIA
    for (const gpu in nvidiaScores) {
        if (gpuName.includes(gpu)) {
            score = nvidiaScores[gpu];
            break;
        }
    }
    
    // Tìm GPU trong danh sách AMD
    for (const gpu in amdGpuScores) {
        if (gpuName.includes(gpu)) {
            score = amdGpuScores[gpu];
            break;
        }
    }
    
    return score;
}

// Hàm lấy ID game được chọn hiện tại
function getSelectedGameId() {
    // Thử các ID khác nhau để tìm ra phần tử phù hợp
    const gameDropdown = document.getElementById('game-genre') || 
                         document.getElementById('game-dropdown');
    
    if (gameDropdown && gameDropdown.value) {
        return gameDropdown.value;
    }
    
    // Kiểm tra xem có game card nào được chọn không
    const selectedCard = document.querySelector('.game-card.selected');
    if (selectedCard && selectedCard.dataset.game) {
        return selectedCard.dataset.game;
    }
    
    // Giá trị mặc định nếu không tìm thấy
    console.warn('Không tìm thấy game được chọn, dùng "valorant" làm mặc định');
    return 'valorant';
}

// Hàm tính FPS ước tính cho một game cụ thể
function calculateEstimatedFPS(gameId, cpuScore, gpuScore) {
    if (!gameId || !cpuScore || !gpuScore) {
        return { fps: 0, quality: 'N/A', resolution: 'N/A' };
    }
    
    // Lấy thông tin game
    const gameType = getGameType(gameId);
    
    // Cân bằng CPU và GPU dựa vào loại game
    let cpuWeight = 0.3;
    let gpuWeight = 0.7;
    
    if (gameType === 'esports') {
        cpuWeight = 0.6;
        gpuWeight = 0.4;
    } else if (gameType === 'strategy') {
        cpuWeight = 0.5;
        gpuWeight = 0.5;
    } else if (gameType === 'aaa') {
        cpuWeight = 0.2;
        gpuWeight = 0.8;
    }
    
    // Tính toán điểm tổng hợp
    const combinedScore = (cpuScore * cpuWeight) + (gpuScore * gpuWeight);
    
    // Ước tính FPS dựa vào điểm tổng hợp và loại game
    let baseFps = 0;
    let quality = 'Thấp';
    let resolution = '1080p';
    
    if (gameType === 'esports') {
        // Esports games thường chạy ở FPS cao hơn
        baseFps = combinedScore * 3;
        
        if (combinedScore >= 85) {
            quality = 'Ultra';
            resolution = '1440p';
        } else if (combinedScore >= 70) {
            quality = 'Cao';
            resolution = '1080p';
        } else if (combinedScore >= 50) {
            quality = 'Trung bình';
            resolution = '1080p';
        } else {
            quality = 'Thấp';
            resolution = '1080p';
        }
    } else if (gameType === 'aaa') {
        // AAA games thường đòi hỏi nhiều tài nguyên hơn
        baseFps = combinedScore * 1.2;
        
        if (combinedScore >= 90) {
            quality = 'Ultra';
            resolution = '4K';
        } else if (combinedScore >= 80) {
            quality = 'Ultra';
            resolution = '1440p';
        } else if (combinedScore >= 70) {
            quality = 'Cao';
            resolution = '1440p';
        } else if (combinedScore >= 60) {
            quality = 'Cao';
            resolution = '1080p';
        } else if (combinedScore >= 50) {
            quality = 'Trung bình';
            resolution = '1080p';
        } else {
            quality = 'Thấp';
            resolution = '1080p';
        }
    } else {
        // Các game khác
        baseFps = combinedScore * 1.5;
        
        if (combinedScore >= 85) {
            quality = 'Ultra';
            resolution = '1440p';
        } else if (combinedScore >= 70) {
            quality = 'Cao';
            resolution = '1080p';
        } else if (combinedScore >= 55) {
            quality = 'Trung bình';
            resolution = '1080p';
        } else {
            quality = 'Thấp';
            resolution = '1080p';
        }
    }
    
    // Làm tròn FPS
    const fps = Math.round(baseFps);
    
    return { fps, quality, resolution };
}

// Hàm lấy tên game dựa vào ID
// S? d?ng h�m getGameName d� khai b�o ? d�ng ~1868

// Khai báo biến toàn cục
let cpuScore = 0;
let gpuScore = 0;
let performanceChartInstance = null;

// Hàm khởi tạo biểu đồ hiệu năng
function initPerformanceChart() {
    try {
    const ctx = document.getElementById('performance-chart');
    if (!ctx) {
            console.error('Performance chart canvas not found');
            return null;
        }
        
        // Destroy existing chart if it exists
        let existingChart = Chart.getChart(ctx);
        if (existingChart) {
            existingChart.destroy();
        }
        
        const gradientGaming = createGradient(ctx, '#2ecc71', '#27ae60');
        const gradientGraphics = createGradient(ctx, '#3498db', '#2980b9');
        const gradientOffice = createGradient(ctx, '#f1c40f', '#f39c12');
        const gradientLivestream = createGradient(ctx, '#e74c3c', '#c0392b');
        const gradientRender = createGradient(ctx, '#9b59b6', '#8e44ad');
        
        return new Chart(ctx, {
        type: 'radar',
        data: {
                labels: ['Gaming', 'Graphics', 'Office', 'Livestream', 'Render'],
            datasets: [{
                    label: 'Performance',
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(46, 204, 113, 0.2)',
                    borderColor: '#2ecc71',
                    pointBackgroundColor: [
                        gradientGaming,
                        gradientGraphics,
                        gradientOffice,
                        gradientLivestream,
                        gradientRender
                    ],
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#2ecc71'
            }]
        },
        options: {
                responsive: true,
                maintainAspectRatio: false,
            scales: {
                r: {
                        beginAtZero: true,
                        max: 100,
                    ticks: {
                            stepSize: 20
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                                return `Performance: ${context.raw}%`;
                        }
                    }
                }
            }
        }
    });
    
    } catch (error) {
        console.error('Error initializing performance chart:', error);
        return null;
    }
}

// Hàm cập nhật biểu đồ hiệu năng
function updatePerformanceChart(gamingValue, graphicsValue, officeValue, livestreamValue, renderValue) {
    console.log("Đang cập nhật biểu đồ hiệu năng...");
    
    const ctx = document.getElementById("performance-chart");
    if (!ctx) {
        console.error("Không tìm thấy phần tử canvas cho biểu đồ hiệu năng");
        return;
    }
    
    // Kiểm tra nếu Chart.js đã được tải
    if (typeof Chart === 'undefined') {
        console.error('Chart.js chưa được tải, không thể cập nhật biểu đồ');
        return;
    }
    
    // Tạo hoặc sử dụng biểu đồ hiện có
    let chart = Chart.getChart(ctx);
    if (!chart) {
        console.log("Biểu đồ chưa được khởi tạo, đang khởi tạo...");
        chart = initPerformanceChart();
        if (!chart) return;
    }
    
    // Chuẩn hóa các giá trị để hiển thị trên biểu đồ (thang điểm 0-10)
    const normalizedValues = [
        Math.max(0, Math.min(10, gamingValue / 10)),
        Math.max(0, Math.min(10, graphicsValue / 10)),
        Math.max(0, Math.min(10, officeValue / 10)),
        Math.max(0, Math.min(10, livestreamValue / 10)),
        Math.max(0, Math.min(10, renderValue / 10))
    ];
    
    // Tạo gradient cho background
    let gradient;
    try {
        gradient = createGradient(chart.ctx, "rgba(255, 152, 0, 0.2)", "rgba(255, 87, 34, 0.2)");
    } catch (e) {
        console.warn('Không thể tạo gradient:', e);
        gradient = 'rgba(255, 152, 0, 0.2)';
    }
    
    // Cập nhật dữ liệu biểu đồ
    chart.data.datasets[0].data = normalizedValues;
    chart.data.datasets[0].backgroundColor = gradient;
    
    // Cập nhật animation
    chart.options.animation = {
        duration: 800,
        easing: 'easeInOutQuart'
    };
    
    // Cập nhật biểu đồ
    chart.update();
    
    console.log("Đã cập nhật biểu đồ hiệu năng thành công");
}

// Hàm tạo gradient cho biểu đồ
function createGradient(ctx, colorStart, colorEnd) {
    try {
        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, colorStart);
        gradient.addColorStop(1, colorEnd);
        return gradient;
    } catch (error) {
        console.error('Error creating gradient:', error);
        return colorStart; // Fallback to solid color
    }
}

// Hàm khởi tạo tất cả các thành phần hiệu năng
function initPerformance() {
    try {
        console.log('Initializing performance components...');
        
        // Load required libraries
        loadRequiredLibraries().then(() => {
            // Initialize dropdowns
            initializeDropdowns();
            
            // Initialize performance chart
    initPerformanceChart();
    
            // Set up event listeners
            setupEventListeners();
            
            // Initialize initial values if available
            const cpuDropdown = document.getElementById('cpu');
            const gpuDropdown = document.getElementById('vga');
            
            if (cpuDropdown?.value && gpuDropdown?.value) {
                safeSetWindowProperty('cpuScore', getCPUScore(cpuDropdown.value));
                safeSetWindowProperty('gpuScore', getGPUScore(gpuDropdown.value));
                updateAllPerformanceMetrics();
            }
            
            console.log('Performance components initialized successfully');
        }).catch(error => {
            console.error('Error loading required libraries:', error);
        });
        
    } catch (error) {
        console.error('Error during performance initialization:', error);
    }
}

function setupEventListeners() {
    try {
        const cpuDropdown = document.getElementById('cpu');
        const gpuDropdown = document.getElementById('vga');
    const gameGenre = document.getElementById('game-genre');
    
    if (cpuDropdown) {
        cpuDropdown.addEventListener('change', function() {
                safeSetWindowProperty('cpuScore', getCPUScore(this.value));
                updateAllPerformanceMetrics();
        });
    }
    
    if (gpuDropdown) {
        gpuDropdown.addEventListener('change', function() {
                safeSetWindowProperty('gpuScore', getGPUScore(this.value));
                updateAllPerformanceMetrics();
        });
    }
    
    if (gameGenre) {
        gameGenre.addEventListener('change', function() {
            const gameId = this.value;
                if (gameId) {
                displayDetailedPerformance(gameId);
                } else {
                    resetGameSpecificPerformance();
            }
        });
    }
    
        // Add click outside listener to close dropdowns
        document.addEventListener('click', function(event) {
            const dropdowns = document.querySelectorAll('.dropdown-menu.show');
            dropdowns.forEach(dropdown => {
                if (!dropdown.contains(event.target)) {
                    dropdown.classList.remove('show');
                }
            });
        });
        
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
}

function updatePerformanceUI(cpuScore, gpuScore) {
    try {
        // Update CPU score
        const cpuScoreElement = document.getElementById('cpu-score');
        if (cpuScoreElement) {
            cpuScoreElement.textContent = `${Math.round(cpuScore)}%`;
            cpuScoreElement.style.color = getScoreColor(cpuScore);
        }
        
        // Update GPU score
        const gpuScoreElement = document.getElementById('gpu-score');
        if (gpuScoreElement) {
            gpuScoreElement.textContent = `${Math.round(gpuScore)}%`;
            gpuScoreElement.style.color = getScoreColor(gpuScore);
        }
        
        // Calculate and update performance scores
        const gamePerformance = calculateGamePerformance(cpuScore, gpuScore);
        const graphicsPerformance = calculateGraphicsPerformance(cpuScore, gpuScore);
        const officePerformance = calculateOfficePerformance(cpuScore, gpuScore);
        
        // Update progress bars
        updateProgressBar('gaming-performance', gamePerformance);
        updateProgressBar('graphics-performance', graphicsPerformance);
        updateProgressBar('office-performance', officePerformance);
        
        // Update performance message
        const totalScore = Math.round((gamePerformance + graphicsPerformance + officePerformance) / 3);
        updateScoreMessage(totalScore);
        
        // Update performance analysis
        updatePerformanceAnalysis(
            gamePerformance,
            graphicsPerformance,
            officePerformance,
            calculateLivestreamPerformance(cpuScore, gpuScore),
            calculateRenderPerformance(cpuScore, gpuScore)
        );
        
    } catch (error) {
        console.error('Error updating performance UI:', error);
    }
}


// ... existing code ...

function loadRequiredLibraries() {
    return new Promise((resolve, reject) => {
        // Load Popper.js if not already loaded
        if (typeof window.Popper === 'undefined') {
            const popperScript = document.createElement('script');
            popperScript.src = 'https://unpkg.com/@popperjs/core@2.11.8/dist/umd/popper.min.js';
            popperScript.onload = () => {
                console.log('Popper.js loaded successfully');
                resolve();
            };
            popperScript.onerror = () => {
                console.error('Failed to load Popper.js');
                reject(new Error('Failed to load Popper.js'));
            };
            document.head.appendChild(popperScript);
        } else {
            resolve();
        }
    });
}

function initializeDropdowns() {
    try {
        const dropdowns = document.querySelectorAll('.dropdown-toggle');
        dropdowns.forEach(dropdown => {
            const menu = dropdown.nextElementSibling;
            if (menu && window.Popper) {
                const popperInstance = window.Popper.createPopper(dropdown, menu, {
                    placement: 'bottom-start',
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 2],
                            },
                        },
                    ],
                });

                dropdown.addEventListener('click', () => {
                    menu.classList.toggle('show');
                    if (menu.classList.contains('show')) {
                        popperInstance.update();
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error initializing dropdowns:', error);
    }
}

// Update the initialization sequence
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadRequiredLibraries();
        initializeDropdowns();
        initPerformance();
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});

function safeSetWindowProperty(property, value) {
    try {
        if (window && typeof window === 'object') {
            if (Object.getOwnPropertyDescriptor(window, property)?.configurable) {
                window[property] = value;
            } else {
                console.warn(`Cannot set window.${property} - property is not configurable`);
            }
        }
    } catch (error) {
        console.error(`Error setting window.${property}:`, error);
    }
}

// Hàm phân tích thế hệ CPU
function getCPUGeneration(cpuName) {
    if (!cpuName) return null;
    
    // Tìm thế hệ cho Intel
    const intelGenMatch = cpuName.match(/(\d+)th Gen|[i][3579]-(\d{1,2})\d{3}/);
    if (intelGenMatch) {
        // Ưu tiên match từ "10th Gen" format
        const gen = intelGenMatch[1] || intelGenMatch[2];
        if (gen) return parseInt(gen, 10);
    }
    
    // Tìm thế hệ cho AMD Ryzen
    const ryzenGenMatch = cpuName.match(/Ryzen \d+ (\d)000/);
    if (ryzenGenMatch && ryzenGenMatch[1]) {
        return parseInt(ryzenGenMatch[1], 10);
    }
    
    return null;
}

// Hàm hỗ trợ để lấy loại game
function getGameType(gameId) {
    const gameTypes = {
        'lol': { type: 'esports', cpuDependency: 'medium' },
        'csgo': { type: 'esports', cpuDependency: 'high' },
        'valorant': { type: 'esports', cpuDependency: 'high' },
        'pubg': { type: 'battle-royale', cpuDependency: 'high' },
        'fortnite': { type: 'battle-royale', cpuDependency: 'medium' },
        'cyberpunk': { type: 'aaa', cpuDependency: 'high' },
        'cod': { type: 'aaa', cpuDependency: 'medium' },
        'minecraft': { type: 'sandbox', cpuDependency: 'very-high' },
        'gta5': { type: 'aaa', cpuDependency: 'high' },
        'apex': { type: 'battle-royale', cpuDependency: 'high' },
        'dota2': { type: 'esports', cpuDependency: 'medium' },
        'rdr2': { type: 'aaa', cpuDependency: 'high' },
        'battlefield': { type: 'aaa', cpuDependency: 'high' },
        'rainbow6': { type: 'esports', cpuDependency: 'medium' },
        'overwatch': { type: 'esports', cpuDependency: 'medium' },
        'wow': { type: 'mmorpg', cpuDependency: 'very-high' },
        'starcraft': { type: 'strategy', cpuDependency: 'very-high' }
    };
    
    return gameTypes[gameId] || { type: 'general', cpuDependency: 'medium' };
}

// Hàm tự động chọn cấu hình dựa trên game, ngân sách và loại CPU
function autoSelectConfig(gameId, budget, cpuType) {
    if (!gameId || !budget || !cpuType) {
        console.warn('Missing required parameters for autoSelectConfig');
        return null;
    }
    
    const budgetKey = `${Math.floor(budget/1000000)}M`;
    const configs = cpuType.toLowerCase() === 'intel' ? window.intelConfigs : window.amdConfigs;
    
    if (!configs[gameId] || !configs[gameId][budgetKey]) {
        console.warn(`No configuration found for ${cpuType} ${gameId} at budget ${budgetKey}`);
        return null;
    }
    
    return configs[gameId][budgetKey];
}

// Export functions for use in other modules
if (typeof window !== 'undefined') {
    window.getCPUGeneration = getCPUGeneration;
    window.getGameType = getGameType;
    window.autoSelectConfig = autoSelectConfig;
}

// Global score tracking
let currentCPUScore = 0;
let currentGPUScore = 0;

// Hàm lấy tên game từ ID
function getGameName(gameId) {
    const gameNames = {
        'valorant': 'Valorant',
        'csgo': 'CS:GO',
        'pubg': 'PUBG',
        'lol': 'Liên Minh Huyền Thoại',
        'gta-v': 'GTA V',
        'elden-ring': 'Elden Ring',
        'naraka': 'Naraka: Bladepoint',
        'genshin': 'Genshin Impact',
        'fo4': 'FIFA Online 4',
        'black-myth-wukong': 'Black Myth: Wukong',
        'god-of-war': 'God of War',
        'battle-teams-2': 'Battle Teams 2',
        'delta-force': 'Delta Force',
        'audition': 'Audition',
        'mu-origin': 'MU Origin',
        'crossfire': 'CrossFire'
    };
    return gameNames[gameId] || gameId;
}

// Hàm lấy màu cho độ ổn định
function getStabilityColor(stability) {
    if (stability >= 90) return "#28a745"; // Rất ổn định - Green
    if (stability >= 70) return "#5cb85c";  // Ổn định - Light Green
    if (stability >= 50) return "#f0ad4e";  // Tương đối ổn định - Yellow
    return "#dc3545";                      // Không ổn định - Red
}

// Initialize the step sections
document.addEventListener('DOMContentLoaded', function() {
    // Hide all sections except the first one (budget-range-selection)
    const sections = [
        document.getElementById('budget-range-selection'),
        document.getElementById('cpu-type-selection'),
        document.getElementById('game-selection'),
        document.getElementById('component-selection')
    ];
    
    // Hide all sections except the first one
    sections.forEach((section, index) => {
        if (section) {
            section.style.display = index === 0 ? 'block' : 'none';
        }
    });
    
    // Set the first step as active
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((step, index) => {
        step.classList.toggle('active', index === 0);
        
        // Add click event listener to each step
        step.addEventListener('click', function() {
            const stepNumber = parseInt(this.getAttribute('data-step'));
            goToStep(stepNumber);
        });
    });
    
    console.log('Steps initialized. First step (Budget) is visible, others are hidden.');
    
    // Make the step icons clickable for navigation
    console.log('Adding click listeners to progress steps for direct navigation');
    
    // ... existing code ...
});

// Add event listeners for the CPU brand options to navigate to the game selection step
document.addEventListener('DOMContentLoaded', function() {
    // Get the CPU brand option elements
    const intelOption = document.getElementById('intel-option');
    const amdOption = document.getElementById('amd-option');
    const cpuTypeDropdown = document.getElementById('cpu-type');
    
    if (intelOption && amdOption && cpuTypeDropdown) {
        // Add click event listeners to the CPU brand options
        intelOption.addEventListener('click', function() {
            // Set the Intel option as selected
            intelOption.classList.add('selected');
            amdOption.classList.remove('selected');
            
            // Update the hidden dropdown value
            cpuTypeDropdown.value = 'Intel';
            
            // Trigger the change event
            cpuTypeDropdown.dispatchEvent(new Event('change'));
            
            // Move to the next step (Game selection)
            setTimeout(() => {
                moveToNextStep();
            }, 300); // Small delay to allow the UI to update
        });
        
        amdOption.addEventListener('click', function() {
            // Set the AMD option as selected
            amdOption.classList.add('selected');
            intelOption.classList.remove('selected');
            
            // Update the hidden dropdown value
            cpuTypeDropdown.value = 'Amd';
            
            // Trigger the change event
            cpuTypeDropdown.dispatchEvent(new Event('change'));
            
            // Move to the next step (Game selection)
            setTimeout(() => {
                moveToNextStep();
            }, 300); // Small delay to allow the UI to update
        });
        
        console.log('CPU brand selection event listeners added');
    } else {
        console.error('One or more CPU brand elements not found:',
            intelOption ? '✓' : '✗ intelOption',
            amdOption ? '✓' : '✗ amdOption',
            cpuTypeDropdown ? '✓' : '✗ cpuTypeDropdown'
        );
    }
});

// Add event listeners for the game cards to navigate to the component selection step
document.addEventListener('DOMContentLoaded', function() {
    // Get all game card elements
    const gameCards = document.querySelectorAll('.game-card');
    const gameGenreDropdown = document.getElementById('game-genre');
    
    if (gameCards.length > 0 && gameGenreDropdown) {
        // Add click event listeners to all game cards
        gameCards.forEach(gameCard => {
            gameCard.addEventListener('click', function() {
                // Get the game ID from the data attribute
                const gameId = this.getAttribute('data-game');
                
                if (gameId) {
                    // Remove selected class from all game cards
                    gameCards.forEach(card => card.classList.remove('selected'));
                    
                    // Add selected class to the clicked card
                    this.classList.add('selected');
                    
                    // Update the hidden dropdown value
                    gameGenreDropdown.value = gameId;
                    
                    // Trigger the change event
                    gameGenreDropdown.dispatchEvent(new Event('change'));
                    
                    // Call autoSelectConfig to try to select components
                    if (typeof autoSelectConfig === 'function') {
                        try {
                            autoSelectConfig();
                        } catch (e) {
                            console.error('Error in autoSelectConfig:', e);
                        }
                    }
                    
                    // Move to the next step (Component selection)
                    setTimeout(() => {
                        moveToNextStep();
                    }, 500); // Small delay to allow the UI to update
                }
            });
        });
        
        console.log('Game card selection event listeners added for', gameCards.length, 'game cards');
    } else {
        console.error('Game cards or game genre dropdown not found:',
            gameCards.length > 0 ? `✓ ${gameCards.length} game cards` : '✗ No game cards',
            gameGenreDropdown ? '✓' : '✗ gameGenreDropdown'
        );
    }
});

// Add event listener for the manual auto-select button
document.addEventListener('DOMContentLoaded', function() {
    // Get the manual auto-select button
    const manualAutoSelectButton = document.getElementById('manual-auto-select');
    
    if (manualAutoSelectButton) {
        // Add click event listener to the button
        manualAutoSelectButton.addEventListener('click', function() {
            console.log('Manual auto-select button clicked');
            
            // Call autoSelectConfig to try to select components
            if (typeof autoSelectConfig === 'function') {
                try {
                    autoSelectConfig();
                    console.log('Auto-select completed successfully');
                    
                    // Move to the next step (Component selection)
                    setTimeout(() => {
                        moveToNextStep();
                    }, 500); // Small delay to allow the UI to update
                } catch (e) {
                    console.error('Error in autoSelectConfig:', e);
                    alert('Có lỗi khi tự động chọn cấu hình. Vui lòng thử lại sau!');
                }
            } else {
                console.error('autoSelectConfig function not found');
                alert('Chức năng tự động chọn cấu hình không khả dụng. Vui lòng thử lại sau!');
            }
        });
        
        console.log('Manual auto-select button event listener added');
    } else {
        console.error('Manual auto-select button not found');
    }
});

// Make navigation functions globally accessible through the window object
window.moveToNextStep = function() {
    console.log('Moving to next step...');
    
    // Find current active step
    const activeStep = document.querySelector('.progress-step.active');
    if (!activeStep) {
        console.error('No active step found');
        return;
    }
    
    const currentStepNumber = parseInt(activeStep.getAttribute('data-step'));
    const nextStepNumber = currentStepNumber + 1;
    
    console.log(`Current step: ${currentStepNumber}, Next step: ${nextStepNumber}`);
    
    // Find next step element
    const nextStep = document.querySelector(`.progress-step[data-step="${nextStepNumber}"]`);
    if (!nextStep) {
        console.error(`Next step ${nextStepNumber} not found`);
        return;
    }
    
    // Activate next step
    document.querySelectorAll('.progress-step').forEach(step => {
        step.classList.remove('active');
    });
    nextStep.classList.add('active');
    
    // Show corresponding section
    const sections = [
        document.getElementById('budget-range-selection'),
        document.getElementById('cpu-type-selection'),
        document.getElementById('game-selection'),
        document.getElementById('component-selection')
    ];
    
    // Ensure we have all sections
    if (sections.some(section => !section)) {
        console.error('One or more sections not found:', sections);
    }
    
    // Hide all sections
    sections.forEach(section => {
        if (section) {
            section.style.display = 'none';
        }
    });
    
    // Show next section
    if (sections[nextStepNumber - 1]) {
        sections[nextStepNumber - 1].style.display = 'block';
        // Scroll to the section
        sections[nextStepNumber - 1].scrollIntoView({behavior: 'smooth'});
        console.log(`Showing section for step ${nextStepNumber}`);
    } else {
        console.error(`Section for step ${nextStepNumber} not found`);
    }
    
    console.log(`Moved to step ${nextStepNumber}`);
};

window.goToStep = function(stepNumber) {
    console.log(`Going to step ${stepNumber}`);
    
    if (stepNumber < 1 || stepNumber > 5) {
        console.error(`Invalid step number: ${stepNumber}`);
        return;
    }
    
    // Activate the specified step
    document.querySelectorAll('.progress-step').forEach(step => {
        const stepNum = parseInt(step.getAttribute('data-step'));
        step.classList.toggle('active', stepNum === stepNumber);
    });
    
    // Show corresponding section
    const sections = [
        document.getElementById('budget-range-selection'),
        document.getElementById('cpu-type-selection'),
        document.getElementById('game-selection'),
        document.getElementById('component-selection')
    ];
    
    // Hide all sections
    sections.forEach(section => {
        if (section) section.style.display = 'none';
    });
    
    // Show selected section (step numbers are 1-based, array is 0-based)
    if (sections[stepNumber - 1]) {
        sections[stepNumber - 1].style.display = 'block';
        sections[stepNumber - 1].scrollIntoView({behavior: 'smooth'});
    }
    
    console.log(`Moved to step ${stepNumber}`);
};
