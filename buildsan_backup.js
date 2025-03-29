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
        autoSelectConfig();
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
 * Đánh giá hiệu năng của cấu hình CPU và VGA đã chọn cho các tác vụ khác nhau
 * và cập nhật giao diện người dùng
 */
function evaluateSystemPerformance() {
    console.log('Đang đánh giá hiệu năng hệ thống...');
    
    // Lấy CPU và GPU được chọn
    const selectedCpu = document.getElementById('cpu-dropdown').value;
    const selectedGpu = document.getElementById('gpu-dropdown').value;
    
    if (!selectedCpu || !selectedGpu) {
        console.warn('Chưa chọn CPU hoặc GPU');
        return;
    }
    
    // Tính điểm hiệu năng
    cpuScore = getScoreForCpu(selectedCpu);
    gpuScore = getScoreForGpu(selectedGpu);
    
    console.log('Điểm CPU:', cpuScore, 'Điểm GPU:', gpuScore);
    
    // Cập nhật tất cả các metrics
    updateAllPerformanceMetrics();
    
    // Hiển thị thông tin hiệu năng chi tiết
    displayDetailedPerformance(getSelectedGameId());
    
    // Cập nhật tổng điểm
    const totalPerformanceDiv = document.getElementById('total-performance');
    if (totalPerformanceDiv) {
        const totalScore = Math.floor((cpuScore + gpuScore) / 2);
        totalPerformanceDiv.textContent = totalScore + '/100';
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
    if (element) {
        element.textContent = `${performance.label} (${performance.score}%)`;
        element.style.color = performance.color;
    }
}

function calculateBottleneck(cpuScore, gpuScore) {
    // Calculate relative performance difference
    const maxScore = Math.max(cpuScore, gpuScore);
    const minScore = Math.min(cpuScore, gpuScore);
    const bottleneckPercentage = ((maxScore - minScore) / maxScore) * 100;
    
    // Determine which component is the bottleneck
    const isCpuBottleneck = cpuScore < gpuScore;
    
    return {
        percentage: Math.round(bottleneckPercentage),
        isCpuBottleneck: isCpuBottleneck
    };
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

function updatePerformanceUI(cpuScore, gpuScore) {
    console.log('Đang cập nhật UI hiệu năng...');

    // Tính toán hiệu năng cho từng loại
    const gamePerformance = calculateGamePerformance();
    const graphicPerformance = calculateGraphicsPerformance();
    const officePerformance = calculateOfficePerformance();
    
    console.log('Hiệu năng đã tính toán:', {
        game: gamePerformance,
        graphic: graphicPerformance,
        office: officePerformance
    });
    
    // Cập nhật các thanh tiến trình
    updateProgressBar('game-performance', gamePerformance);
    updateProgressBar('graphic-performance', graphicPerformance);
    updateProgressBar('office-performance', officePerformance);
    
    // Cập nhật UI cho Livestream và Render
    updateLivestreamAndRenderPerformance(gamePerformance, graphicPerformance, officePerformance);
    
    // Cập nhật bottleneck
    updateBottleneckUI(cpuScore, gpuScore);
    
    // Cập nhật biểu đồ
    updatePerformanceChart();
    
    console.log('Đã cập nhật UI hiệu năng thành công');
}

// Hàm cập nhật thanh tiến trình
function updateProgressBar(elementId, performance) {
    const progressBar = document.getElementById(elementId);
    if (progressBar) {
        // Cập nhật chiều rộng
        progressBar.style.width = `${performance}%`;
        
        // Cập nhật màu sắc dựa vào điểm số
        let backgroundColor;
        if (performance >= 80) {
            backgroundColor = '#4CAF50'; // Xanh lá - rất tốt
        } else if (performance >= 60) {
            backgroundColor = '#8BC34A'; // Xanh lá nhạt - tốt
        } else if (performance >= 40) {
            backgroundColor = '#FFC107'; // Vàng - trung bình
        } else {
            backgroundColor = '#F44336'; // Đỏ - kém
        }
        
        progressBar.style.backgroundColor = backgroundColor;
        
        // Tìm thẻ span cha để cập nhật thuộc tính data-score
        const metricHeader = progressBar.closest('.metric-row').querySelector('.metric-header');
        if (metricHeader) {
            const scoreSpan = metricHeader.querySelector('.score-value');
            if (scoreSpan) {
                scoreSpan.setAttribute('data-score', performance);
                scoreSpan.textContent = performance;
            }
        }
    } else {
        console.warn(`Không tìm thấy thanh tiến trình với id ${elementId}`);
    }
}

/**
 * Cập nhật các thanh hiệu năng cho Livestream và Render
 */
function updateLivestreamAndRenderPerformance(gamePerformance, graphicPerformance, officePerformance) {
    // Tính toán hiệu năng livestream dựa trên game và đồ họa
    const livestreamPerformance = Math.floor((gamePerformance.score * 0.5 + graphicPerformance.score * 0.3 + officePerformance.score * 0.2) * 0.95);
    
    // Tính toán hiệu năng render dựa nhiều vào đồ họa
    const renderPerformance = Math.floor((gamePerformance.score * 0.2 + graphicPerformance.score * 0.7 + officePerformance.score * 0.1) * 0.98);
    
    // Cập nhật UI cho livestream
    const livestreamElement = document.getElementById('livestream-performance');
    if (livestreamElement) {
        livestreamElement.style.width = `${livestreamPerformance}%`;
        livestreamElement.style.backgroundColor = getScoreColor(livestreamPerformance);
        
        // Cập nhật score attribute cho span - chọn chính xác span bên trong metric-header chứa biểu tượng livestream
        const livestreamSpan = document.querySelector('.metric-header i.fa-broadcast-tower').closest('.metric-header').querySelector('span');
        if (livestreamSpan) {
            livestreamSpan.setAttribute('data-score', livestreamPerformance);
        }
    }
    
    // Cập nhật UI cho render
    const renderElement = document.getElementById('render-performance');
    if (renderElement) {
        renderElement.style.width = `${renderPerformance}%`;
        renderElement.style.backgroundColor = getScoreColor(renderPerformance);
        
        // Cập nhật score attribute cho span - chọn chính xác span bên trong metric-header chứa biểu tượng render
        const renderSpan = document.querySelector('.metric-header i.fa-film').closest('.metric-header').querySelector('span');
        if (renderSpan) {
            renderSpan.setAttribute('data-score', renderPerformance);
        }
    }
}

/**
 * Cập nhật giao diện hiển thị bottleneck
 */
function updateBottleneckUI(cpuScore, gpuScore) {
    // Sửa ID từ bottleneck-fill thành bottleneck-indicator theo đúng ID trong HTML
    const bottleneckFill = document.getElementById('bottleneck-indicator');
    const bottleneckPercentage = document.getElementById('bottleneck-percentage');
    
    if (!bottleneckFill || !bottleneckPercentage) {
        console.warn('Không tìm thấy phần tử bottleneck-indicator hoặc bottleneck-percentage');
        return;
    }
    
    // Tính toán bottleneck
    const bottleneckData = calculateBottleneck(cpuScore, gpuScore);
    
    // Xác định vị trí của con trỏ bottleneck (trên thanh bottleneck)
    // 0% = bottleneck hoàn toàn CPU, 100% = bottleneck hoàn toàn GPU, 50% = cân bằng lý tưởng
    let position = 50 + (bottleneckData.percentage / 2); // Chuyển đổi -100 đến 100 thành 0 đến 100
    
    // Giới hạn vị trí trong khoảng 5% đến 95% để không bị ra ngoài thanh
    position = Math.max(5, Math.min(95, position));
    
    // Cập nhật giao diện
    bottleneckFill.style.left = `${position}%`;
    
    // Cập nhật màu sắc cho bottleneck fill dựa trên mức độ cân bằng
    if (Math.abs(bottleneckData.percentage) <= 10) {
        // Cân bằng gần như lý tưởng (±10%)
        bottleneckFill.style.backgroundColor = '#4caf50'; // Xanh lá
        bottleneckFill.style.border = '2px solid #2e7d32';
    } else if (Math.abs(bottleneckData.percentage) <= 30) {
        // Cân bằng chấp nhận được (±30%)
        bottleneckFill.style.backgroundColor = '#ffeb3b'; // Vàng
        bottleneckFill.style.border = '2px solid #fbc02d';
    } else {
        // Mất cân bằng đáng kể (>±30%)
        bottleneckFill.style.backgroundColor = '#f44336'; // Đỏ
        bottleneckFill.style.border = '2px solid #c62828';
    }
    
    // Hiển thị phần trăm bottleneck
    if (bottleneckData.percentage === 0) {
        bottleneckPercentage.textContent = 'Cân bằng lý tưởng';
    } else if (bottleneckData.percentage < 0) {
        bottleneckPercentage.textContent = `CPU bottleneck ${Math.abs(bottleneckData.percentage).toFixed(0)}%`;
    } else {
        bottleneckPercentage.textContent = `GPU bottleneck ${bottleneckData.percentage.toFixed(0)}%`;
    }
}

function getScoreColor(score) {
    if (score >= 90) return '#28a745'; // Excellent - Green
    if (score >= 75) return '#4bbf73'; // Very Good - Light Green
    if (score >= 60) return '#5cb85c'; // Good - Lime Green
    if (score >= 45) return '#f0ad4e'; // Average - Yellow
    if (score >= 30) return '#fd7e14'; // Fair - Orange
    return '#dc3545'; // Weak - Red
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

// Hàm lấy điểm CPU dựa trên tên
function getCPUScore(cpuName) {
    if (!cpuName) return 0;
    
    // Nếu là mã CPU từ object cpuData, lấy điểm từ đó
    const cpuKey = Object.keys(cpuData).find(key => cpuData[key].name === cpuName);
    if (cpuKey && cpuData[cpuKey].score) {
        return cpuData[cpuKey].score * 10; // Điểm trong data nhân 10 để có thang điểm 100
    }
    
    // Nếu không tìm thấy trong data, tính điểm dựa trên tên CPU
    const cpuFamily = extractCPUFamily(cpuName);
    
    if (!cpuFamily) return 30; // Giá trị mặc định nếu không xác định được dòng CPU
    
    // Điểm cơ bản dựa trên dòng CPU
    let baseScore = 0;
    switch (cpuFamily) {
        case 'Core i3':
        case 'Ryzen 3':
            baseScore = 35;
            break;
        case 'Core i5':
        case 'Ryzen 5':
            baseScore = 60;
            break;
        case 'Core i7':
        case 'Ryzen 7':
            baseScore = 80;
            break;
        case 'Core i9':
        case 'Ryzen 9':
            baseScore = 95;
            break;
        default:
            baseScore = 30;
    }
    
    // Điều chỉnh dựa trên thế hệ CPU (nếu có thông tin)
    const generation = getCPUGeneration(cpuName);
    if (generation) {
        baseScore += (generation - 8) * 5; // Mỗi thế hệ tăng 5 điểm so với Gen 8
    }
    
    // Giới hạn trong khoảng 10-100
    return Math.min(100, Math.max(10, baseScore));
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

function getGPUScore(gpuName) {
    // Try to find exact match
    for (const [key, score] of Object.entries(window.HARDWARE_SCORES.gpu)) {
        if (gpuName.includes(key)) return score;
    }
    
    // Fallback to series-based score
    if (gpuName.includes("RTX 40")) return 90;
    if (gpuName.includes("RTX 30")) return 80;
    if (gpuName.includes("RTX 20")) return 70;
    if (gpuName.includes("GTX 16")) return 60;
    if (gpuName.includes("GTX 10")) return 50;
    if (gpuName.includes("RX 7000")) return 90;
    if (gpuName.includes("RX 6000")) return 80;
    if (gpuName.includes("RX 5000")) return 70;
    return 40;
}

function parseFpsRange(fpsString) {
    // Remove "FPS" and any whitespace
    fpsString = fpsString.replace(/FPS/gi, "").trim();
    
    // Handle "X+" format
    if (fpsString.includes("+")) {
        const base = parseInt(fpsString);
        return [base, Math.round(base * 1.2)];
    }
    
    // Handle "X-Y" format
    const [min, max] = fpsString.split("-").map(num => parseInt(num.trim()));
    return [min || 30, max || 60];
}

/**
 * Lấy tên game đẹp hơn từ ID
 */
function getGameName(gameId) {
    const gameNames = {
        "valorant": "Valorant",
        "csgo": "Counter-Strike: Global Offensive",
        "pubg": "PlayerUnknown's Battlegrounds",
        "lol": "League of Legends",
        "gta-v": "Grand Theft Auto V",
        "elden-ring": "Elden Ring",
        "naraka": "Naraka: Bladepoint",
        "genshin": "Genshin Impact",
        "fo4": "FIFA Online 4",
        "black-myth-wukong": "Black Myth: Wukong",
        "god-of-war": "God of War",
        "battle-teams-2": "Battle Teams 2",
        "delta-force": "Delta Force",
        "audition": "Audition",
        "mu-origin": "MU Origin",
        "crossfire": "CrossFire"
    };
    return gameNames[gameId] || gameId;
}

/**
 * Cập nhật biểu đồ hiệu năng
 */
function updatePerformanceChart(gamePerformance, graphicPerformance, officePerformance) {
    console.log('Đang cập nhật biểu đồ hiệu năng...');
    
    const ctx = document.getElementById('performance-chart');
    if (!ctx) {
        console.error('Không tìm thấy phần tử biểu đồ hiệu năng');
        return;
    }
    
    // Tính toán các giá trị hiệu năng
    const gamingValue = calculateGamePerformance();
    const graphicsValue = calculateGraphicsPerformance();
    const officeValue = calculateOfficePerformance();
    
    // Tính hiệu năng livestream (dựa vào CPU và hiệu năng game)
    const livestreamValue = (gamingValue * 0.4) + (cpuScore * 3);
    
    // Tính hiệu năng render (dựa vào CPU, GPU và hiệu năng đồ họa)
    const renderValue = (graphicsValue * 0.5) + (cpuScore * 0.3) + (gpuScore * 0.2);
    
    // Tính hiệu năng đa nhiệm (dựa vào CPU chủ yếu)
    const multitaskingValue = (cpuScore * 0.7) + (officeValue * 0.3);
    
    console.log('Các giá trị hiệu năng đã tính toán:', {
        gaming: gamingValue,
        graphics: graphicsValue,
        office: officeValue,
        livestream: livestreamValue,
        render: renderValue,
        multitasking: multitaskingValue
    });
    
    // Lấy biểu đồ từ Chart.js registry
    const chartInstance = Chart.getChart(ctx);
    
    if (chartInstance) {
        // Chuẩn bị dữ liệu
        const normalizedValues = [
            gamingValue / 10,
            graphicsValue / 10,
            officeValue / 10,
            livestreamValue / 10,
            renderValue / 10,
            multitaskingValue / 10
        ];
        
        // Cập nhật dữ liệu
        chartInstance.data.datasets[0].data = normalizedValues;
        
        // Cập nhật gradient
        const chartArea = chartInstance.chartArea;
        const ctx = chartInstance.ctx;
        
        if (chartArea && ctx) {
            const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
            gradient.addColorStop(0, 'rgba(255, 152, 0, 0.1)');
            gradient.addColorStop(1, 'rgba(255, 87, 34, 0.3)');
            
            chartInstance.data.datasets[0].backgroundColor = gradient;
        }
        
        // Cập nhật biểu đồ
        chartInstance.update();
        console.log('Đã cập nhật biểu đồ hiệu năng thành công');
    } else {
        console.error('Không tìm thấy instance của biểu đồ hiệu năng');
    }
    
    // Cập nhật phân tích hiệu năng
    updatePerformanceAnalysis(gamingValue, graphicsValue, officeValue, livestreamValue, renderValue, multitaskingValue);
}

// Hàm tạo gradient cho biểu đồ
function createGradient(ctx, colorStart, colorEnd) {
    const chartArea = ctx.chart.chartArea;
    if (!chartArea) {
        // Fallback nếu chart area chưa có sẵn
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, colorStart);
        gradient.addColorStop(1, colorEnd);
        return gradient;
    }
    
    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;
    const r = Math.min(
        (chartArea.right - chartArea.left) / 2,
        (chartArea.bottom - chartArea.top) / 2
    );
    
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, r);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(0.5, 'rgba(255, 171, 64, 0.5)');
    gradient.addColorStop(1, colorEnd);
    
    return gradient;
}

// Hàm cập nhật phần phân tích hiệu năng
function updatePerformanceAnalysis(gamingValue, graphicsValue, officeValue, livestreamValue, renderValue, multitaskingValue) {
    console.log('Cập nhật phân tích hiệu năng với các giá trị:', {
        gamingValue, graphicsValue, officeValue, livestreamValue, renderValue, multitaskingValue
    });
    
    // Chuẩn hóa dữ liệu
    const data = [
        { name: 'Gaming', value: gamingValue },
        { name: 'Đồ họa', value: graphicsValue },
        { name: 'Văn phòng', value: officeValue },
        { name: 'Livestream', value: livestreamValue },
        { name: 'Render', value: renderValue },
        { name: 'Đa nhiệm', value: multitaskingValue }
    ];
    
    // Sắp xếp dữ liệu
    data.sort((a, b) => b.value - a.value);
    
    // Lấy điểm mạnh và điểm yếu
    const strengths = data.slice(0, 2);
    const weaknesses = data.slice(-2);
    
    // Cập nhật UI
    const strengthsList = document.getElementById('strengths-list');
    const weaknessesList = document.getElementById('weaknesses-list');
    
    if (strengthsList) {
        strengthsList.innerHTML = '';
        strengths.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name}: ${item.value}/100 điểm`;
            li.className = 'performance-list-item';
            strengthsList.appendChild(li);
        });
    } else {
        console.warn('Không tìm thấy phần tử strengths-list');
    }
    
    if (weaknessesList) {
        weaknessesList.innerHTML = '';
        weaknesses.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name}: ${item.value}/100 điểm`;
            li.className = 'performance-list-item';
            weaknessesList.appendChild(li);
        });
    } else {
        console.warn('Không tìm thấy phần tử weaknesses-list');
    }
    
    // Tạo các đề xuất nâng cấp
    const upgradeRecommendations = document.getElementById('upgrade-recommendations');
    if (upgradeRecommendations) {
        upgradeRecommendations.innerHTML = '';
        
        // Kiểm tra các giá trị hiệu năng để đưa ra đề xuất
        if (gamingValue < 60) {
            addRecommendation(upgradeRecommendations, 'Nâng cấp GPU để cải thiện hiệu năng gaming');
        }
        
        if (graphicsValue < 60 && gamingValue >= 60) {
            addRecommendation(upgradeRecommendations, 'Cân nhắc GPU chuyên nghiệp hơn cho công việc đồ họa');
        }
        
        if (livestreamValue < 50) {
            addRecommendation(upgradeRecommendations, 'Nâng cấp CPU để cải thiện khả năng livestream');
        }
        
        if (renderValue < 60) {
            addRecommendation(upgradeRecommendations, 'Bổ sung RAM và nâng cấp CPU để cải thiện khả năng render');
        }
        
        if (multitaskingValue < 55) {
            addRecommendation(upgradeRecommendations, 'Thêm RAM và nâng cấp CPU để cải thiện khả năng đa nhiệm');
        }
        
        if (officeValue < 50) {
            addRecommendation(upgradeRecommendations, 'Nâng cấp ổ SSD để cải thiện hiệu năng các tác vụ văn phòng');
        }
        
        // Nếu tất cả đều cao, đưa ra lời khuyên chung
        if (gamingValue >= 70 && graphicsValue >= 70 && officeValue >= 70 &&
            livestreamValue >= 70 && renderValue >= 70 && multitaskingValue >= 70) {
            addRecommendation(upgradeRecommendations, 'Hệ thống của bạn đã có hiệu năng rất tốt cho hầu hết các tác vụ!');
        }
        
        // Thêm lời khuyên về game tips từ hàm generatePerformanceTips
        if (typeof generatePerformanceTips === 'function') {
            const gameTips = generatePerformanceTips({ type: getGameType(currentGameId) }, cpuScore, gpuScore);
            if (gameTips && gameTips.length > 0) {
                const tipsDiv = document.createElement('div');
                tipsDiv.className = 'mt-3 game-tips';
                tipsDiv.innerHTML = '<h5 class="tips-heading">Gợi ý tối ưu game:</h5>';
                
                const tipsList = document.createElement('ul');
                tipsList.className = 'tips-list';
                
                gameTips.forEach(tip => {
                    const tipItem = document.createElement('li');
                    tipItem.textContent = tip;
                    tipsList.appendChild(tipItem);
                });
                
                tipsDiv.appendChild(tipsList);
                upgradeRecommendations.appendChild(tipsDiv);
            }
        }
    } else {
        console.warn('Không tìm thấy phần tử upgrade-recommendations');
    }
    
    console.log('Đã cập nhật phân tích hiệu năng thành công');
}

// Hàm trợ giúp để thêm đề xuất
function addRecommendation(container, text) {
    const recommendation = document.createElement('div');
    recommendation.className = 'recommendation-item';
    recommendation.innerHTML = `<i class="fas fa-angle-right"></i> ${text}`;
    container.appendChild(recommendation);
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

// Hàm để viết hoa chữ cái đầu tiên
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Hàm để lấy màu cho độ ổn định
function getStabilityColor(stability) {
    switch (stability) {
        case 'Rất ổn định':
            return 'rgba(40, 167, 69, 0.2)';
        case 'Ổn định':
            return 'rgba(255, 193, 7, 0.2)';
        case 'Tương đối ổn định':
            return 'rgba(255, 152, 0, 0.2)';
        default:
            return 'rgba(220, 53, 69, 0.2)';
    }
}

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
    // Fallback nếu không có gameType
    if (!gameType) {
        gameType = { type: 'esports', cpuDependency: 'medium' };
    }
    
    const tips = [];
    const cpuGpuDiff = Math.abs(cpuScore - gpuScore);
    const avgScore = (cpuScore + gpuScore) / 2;
    
    // Thêm gợi ý dựa vào loại game
    if (gameType.type === 'esports') {
        tips.push('Game <strong>Esports</strong> yêu cầu FPS cao và độ trễ thấp để có lợi thế cạnh tranh.');
        
        if (gameType.cpuDependency === 'high' || gameType.cpuDependency === 'very-high') {
            if (cpuScore < 70) {
                tips.push('Game Esports thường phụ thuộc nhiều vào <strong>CPU</strong>. Việc nâng cấp CPU có thể tăng FPS đáng kể.');
            }
        }
    } else if (gameType.type === 'aaa') {
        tips.push('Game <strong>AAA</strong> đòi hỏi cân bằng giữa CPU và GPU mạnh để đạt được cả FPS ổn định và đồ họa chất lượng cao.');
        
        if (gameType.cpuDependency === 'low' || gameType.cpuDependency === 'very-low') {
            if (gpuScore < 70) {
                tips.push('Đối với game AAA hiện đại, GPU mạnh là yếu tố then chốt quyết định hiệu năng và chất lượng hình ảnh.');
            }
        }
    } else if (gameType.type === 'battle-royale') {
        tips.push('Game <strong>Battle Royale</strong> cần cả CPU và GPU tốt để xử lý số lượng người chơi lớn và bản đồ rộng.');
        
        if (avgScore < 65) {
            tips.push('Thiết lập đồ họa medium hoặc low là phù hợp nhất cho cấu hình của bạn với game Battle Royale.');
        }
    } else if (gameType.type === 'strategy') {
        tips.push('Game <strong>Strategy</strong> thường đòi hỏi CPU mạnh để xử lý AI và nhiều đơn vị cùng lúc.');
        
        if (gameType.cpuDependency === 'high' && cpuScore < 65) {
            tips.push('Việc nâng cấp CPU sẽ giúp cải thiện hiệu năng game strategy đáng kể, đặc biệt ở giai đoạn giữa và cuối game.');
        }
    }
    
    // Thêm gợi ý dựa vào sự chênh lệch giữa CPU và GPU
    if (cpuGpuDiff >= 25) {
        if (cpuScore > gpuScore) {
            tips.push('CPU của bạn <strong>mạnh hơn đáng kể</strong> so với GPU. Nâng cấp GPU sẽ giúp cân bằng hệ thống và tăng hiệu năng game.');
        } else {
            tips.push('GPU của bạn <strong>mạnh hơn đáng kể</strong> so với CPU. Nâng cấp CPU sẽ giúp phát huy tối đa tiềm năng của GPU hiện tại.');
        }
    }
    
    // Thêm gợi ý dựa vào mức điểm tổng thể
    if (avgScore < 50) {
        tips.push('Cấu hình của bạn ở mức thấp đến trung bình. Cài đặt đồ họa <strong>Low</strong> sẽ giúp đạt FPS ổn định nhất.');
    } else if (avgScore >= 50 && avgScore < 70) {
        tips.push('Cấu hình của bạn ở mức trung bình khá. Cài đặt đồ họa <strong>Medium</strong> là phù hợp nhất để cân bằng giữa hình ảnh và FPS.');
    } else if (avgScore >= 70 && avgScore < 85) {
        tips.push('Cấu hình của bạn ở mức khá tốt. Cài đặt đồ họa <strong>High</strong> vẫn đảm bảo FPS ổn định trong hầu hết các tình huống.');
    } else {
        tips.push('Cấu hình của bạn ở mức cao. Có thể chọn đồ họa <strong>Ultra</strong> để tận hưởng hình ảnh tuyệt đẹp với FPS vẫn ổn định.');
    }
    
    // Thêm gợi ý dựa vào CPU/GPU yếu
    if (cpuScore < 40) {
        tips.push('CPU của bạn <strong>khá yếu</strong> so với yêu cầu game hiện đại. Việc nâng cấp CPU nên được ưu tiên.');
    }
    
    if (gpuScore < 40) {
        tips.push('GPU của bạn <strong>khá yếu</strong> so với yêu cầu game hiện đại. Việc nâng cấp GPU nên được ưu tiên.');
    }
    
    // Trả về danh sách tips
    return tips;
}

// Hàm tính toán hiệu năng gaming
function calculateGamePerformance() {
    if (typeof cpuScore === 'undefined' || typeof gpuScore === 'undefined') {
        console.warn('cpuScore hoặc gpuScore chưa được định nghĩa');
        return 0;
    }
    
    // Gaming phụ thuộc phần lớn vào GPU và một phần vào CPU
    const gameType = getGameType(currentGameId);
    
    // Các trò chơi khác nhau sẽ phụ thuộc vào CPU/GPU theo tỷ lệ khác nhau
    let cpuWeight = 0.3;
    let gpuWeight = 0.7;
    
    if (gameType === 'esports') {
        // Esports thường phụ thuộc nhiều vào CPU
        cpuWeight = 0.5;
        gpuWeight = 0.5;
    } else if (gameType === 'strategy') {
        // Game chiến thuật cũng phụ thuộc nhiều vào CPU
        cpuWeight = 0.6;
        gpuWeight = 0.4;
    } else if (gameType === 'aaa') {
        // AAA games phụ thuộc nhiều vào GPU
        cpuWeight = 0.25;
        gpuWeight = 0.75;
    }
    
    const performance = (cpuScore * cpuWeight) + (gpuScore * gpuWeight);
    return Math.min(100, Math.floor(performance)); // Giới hạn ở 100
}

// Hàm tính toán hiệu năng đồ họa
function calculateGraphicsPerformance() {
    if (typeof cpuScore === 'undefined' || typeof gpuScore === 'undefined') {
        console.warn('cpuScore hoặc gpuScore chưa được định nghĩa');
        return 0;
    }
    
    // Đồ họa phụ thuộc phần lớn vào GPU
    const performance = (cpuScore * 0.2) + (gpuScore * 0.8);
    return Math.min(100, Math.floor(performance));
}

// Hàm tính toán hiệu năng văn phòng
function calculateOfficePerformance() {
    if (typeof cpuScore === 'undefined' || typeof gpuScore === 'undefined') {
        console.warn('cpuScore hoặc gpuScore chưa được định nghĩa');
        return 0;
    }
    
    // Văn phòng phụ thuộc chủ yếu vào CPU
    const performance = (cpuScore * 0.8) + (gpuScore * 0.2);
    return Math.min(100, Math.floor(performance));
}

// Hàm cập nhật hiệu năng cho tất cả các loại tác vụ
function updateAllPerformanceMetrics() {
    if (typeof cpuScore === 'undefined' || typeof gpuScore === 'undefined') {
        console.warn('cpuScore hoặc gpuScore chưa được định nghĩa. Không thể cập nhật metrics.');
        return;
    }
    
    console.log('Cập nhật tất cả các metrics với cpuScore:', cpuScore, 'gpuScore:', gpuScore);
    
    // Cập nhật giao diện người dùng
    updatePerformanceUI();
    
    // Cập nhật bottleneck
    updateBottleneckUI(cpuScore, gpuScore);
    
    // Cập nhật biểu đồ
    updatePerformanceChart();
}

function displayDetailedPerformance(gameId) {
    console.log('Hiển thị thông tin hiệu năng chi tiết cho game ID:', gameId);
    
    if (!gameId) {
        console.warn('Không có game ID');
        return;
    }
    
    // Lấy thể loại game để đưa ra phân tích cụ thể
    let gameType = getGameType(gameId);
    
    // Nếu không tìm thấy, sử dụng giá trị mặc định
    if (!gameType) {
        console.warn('Không tìm thấy thông tin game type cho game ID:', gameId);
        gameType = 'generic';
    }
    
    // Lấy thông tin FPS
    const fpsInfo = calculateEstimatedFPS(gameId, cpuScore, gpuScore);
    console.log('Thông tin FPS ước tính:', fpsInfo);
    
    // Hiển thị thông tin FPS
    const fpsInfoElement = document.getElementById('fps-info');
    const fpsValueElement = document.getElementById('fps-value');
    
    if (fpsInfoElement && fpsValueElement) {
        // Cập nhật giá trị FPS
        fpsValueElement.textContent = fpsInfo.fps;
        
        // Cập nhật màu sắc dựa vào FPS
        const fpsColor = getFpsColor(fpsInfo.fps);
        fpsValueElement.style.color = fpsColor;
        
        // Hiển thị thông tin chất lượng
        const qualityElement = document.getElementById('quality-value');
        if (qualityElement) {
            qualityElement.textContent = fpsInfo.quality || 'Trung bình';
            qualityElement.style.color = fpsColor;
        }
        
        // Hiển thị thông tin độ phân giải
        const resolutionElement = document.getElementById('resolution-value');
        if (resolutionElement) {
            resolutionElement.textContent = fpsInfo.resolution || '1080p';
        }
    } else {
        console.warn('Không tìm thấy phần tử FPS info hoặc FPS value');
    }
    
    // Hiển thị game đang được phân tích
    const gameNameElement = document.getElementById('analyzed-game-name');
    if (gameNameElement) {
        const gameName = getGameName(gameId);
        gameNameElement.textContent = gameName || 'Tổng quan';
    }
    
    // Hiển thị các mẹo cải thiện hiệu năng
    const gameTips = generatePerformanceTips({ type: gameType }, cpuScore, gpuScore);
    const tipsContainer = document.getElementById('game-performance-tips');
    
    if (tipsContainer && gameTips && gameTips.length > 0) {
        tipsContainer.innerHTML = '';
        
        const tipsList = document.createElement('ul');
        tipsList.className = 'tips-list';
        
        gameTips.forEach(tip => {
            const tipItem = document.createElement('li');
            tipItem.textContent = tip;
            tipsList.appendChild(tipItem);
        });
        
        tipsContainer.appendChild(tipsList);
    } else if (tipsContainer) {
        tipsContainer.innerHTML = '<p>Không có mẹo hiệu năng cụ thể cho game này.</p>';
    }
    
    console.log('Đã hiển thị thông tin hiệu năng chi tiết thành công');
}

// Hàm lấy màu dựa vào FPS
function getFpsColor(fps) {
    if (fps >= 240) return '#006400'; // Dark green - Tuyệt vời
    if (fps >= 144) return '#4CAF50'; // Light green - Rất tốt
    if (fps >= 100) return '#2196F3'; // Blue - Tốt
    if (fps >= 60) return '#FF9800'; // Orange - Chấp nhận được
    if (fps >= 30) return '#FF5722'; // Light red - Kém
    return '#B71C1C'; // Dark red - Rất kém
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
    const gameSelector = document.getElementById('game-genre');
    if (gameSelector) {
        return gameSelector.value;
    }
    return null;
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
function getGameName(gameId) {
    const gameNames = {
        'cs2': 'Counter-Strike 2',
        'valorant': 'Valorant',
        'fortnite': 'Fortnite',
        'apex': 'Apex Legends',
        'pubg': 'PUBG',
        'cod': 'Call of Duty',
        'gta5': 'GTA V',
        'rdr2': 'Red Dead Redemption 2',
        'cyberpunk': 'Cyberpunk 2077',
        'lol': 'League of Legends',
        'dota2': 'Dota 2',
        'minecraft': 'Minecraft',
        'wow': 'World of Warcraft',
        'forza': 'Forza Horizon 5'
    };
    
    return gameNames[gameId] || gameId;
}
