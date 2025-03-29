// Tạo object components để chứa toàn bộ dữ liệu linh kiện
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

// Biến toàn cục
let isAutoSelecting = false;
let componentSelects = {};

// Khởi tạo ứng dụng khi trang đã tải xong
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

// Thêm tính năng theo dõi tiến trình xây dựng
function updateBuildProgress() {
    const progressSteps = document.querySelectorAll('.progress-step');
    let completedSteps = 0;
    
    // Kiểm tra ngân sách đã chọn chưa (luôn hoàn thành)
    progressSteps[0].classList.add('completed');
    completedSteps++;
    
    // Kiểm tra CPU type đã chọn chưa
    if (document.getElementById('cpu-type').value) {
        progressSteps[1].classList.add('completed');
        completedSteps++;
    } else {
        progressSteps[1].classList.remove('completed');
    }
    
    // Kiểm tra game đã chọn chưa
    if (document.getElementById('game-genre').value) {
        progressSteps[2].classList.add('completed');
        completedSteps++;
    } else {
        progressSteps[2].classList.remove('completed');
    }
    
    // Kiểm tra đã chọn đủ các linh kiện chính chưa
    const requiredComponents = ['cpu', 'mainboard', 'vga', 'ram', 'ssd', 'psu', 'case', 'cpuCooler'];
    let hasAllRequiredComponents = true;
    
    requiredComponents.forEach(component => {
        if (!document.getElementById(component).value) {
            hasAllRequiredComponents = false;
        }
    });
    
    if (hasAllRequiredComponents) {
        progressSteps[3].classList.add('completed');
        completedSteps++;
    } else {
        progressSteps[3].classList.remove('completed');
    }
    
    // Kiểm tra đã xem chi tiết chưa (hoàn thành)
    if (document.getElementById('summary-modal').style.display === 'block') {
        progressSteps[4].classList.add('completed');
        completedSteps++;
    } else {
        progressSteps[4].classList.remove('completed');
    }
}

// Thêm các hiệu ứng UI
function addUIEffects() {
    // Tăng cường hiệu ứng khi scroll trang
    const animateOnScroll = () => {
        const sections = document.querySelectorAll('.selection-section');
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight * 0.75) {
                section.classList.add('animated');
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Gọi khi trang tải xong
}

// Chuyển đổi tên thông số kỹ thuật sang định dạng người đọc
function formatSpecName(key) {
    const mapping = {
        'brand': 'Thương hiệu',
        'warranty': 'Bảo hành',
        'socket': 'Socket',
        'cores': 'Số nhân',
        'threads': 'Số luồng',
        'technology': 'Công nghệ',
        'ram_support': 'Hỗ trợ RAM',
        'ram_bus': 'Bus RAM',
        'condition': 'Tình trạng',
        'sockets': 'Socket hỗ trợ',
        'memoryType': 'Loại bộ nhớ',
        'nvmeSlots': 'Số khe NVMe',
        'pcieVersion': 'Phiên bản PCIe',
        'formFactor': 'Kích thước',
        'memory': 'Dung lượng',
        'memoryType': 'Loại bộ nhớ',
        'speed': 'Tốc độ',
        'capacity': 'Dung lượng',
        'read_speed': 'Tốc độ đọc',
        'write_speed': 'Tốc độ ghi',
        'power': 'Công suất',
        'certification': 'Chứng nhận',
        'modular': 'Modular',
        'tdp': 'TDP',
        'fan_speed': 'Tốc độ quạt',
        'size': 'Kích thước',
        'material': 'Chất liệu',
        'fans_included': 'Số quạt kèm theo',
        'rgb': 'RGB',
        'panel': 'Tấm nền',
        'resolution': 'Độ phân giải',
        'refresh_rate': 'Tần số quét',
        'response_time': 'Thời gian phản hồi',
        'gpu': 'GPU',
        'memory': 'Bộ nhớ',
        'memory_type': 'Loại bộ nhớ',
        'interface': 'Giao tiếp',
        'bus': 'Bus'
    };
    
    return mapping[key] || key.replace('_', ' ');
}

// Thêm tính năng hiển thị thông số chi tiết linh kiện khi hover
function setupComponentHoverInfo() {
    const componentTypes = ['cpu', 'mainboard', 'vga', 'ram', 'ssd', 'psu', 'case', 'cpuCooler', 'hdd', 'monitor'];
    
    componentTypes.forEach(componentType => {
        const select = document.getElementById(componentType);
        const infoElement = document.getElementById(`${componentType}-info`);
        
        select.addEventListener('change', () => {
            const selectedValue = select.value;
            if (selectedValue && components[componentType] && components[componentType][selectedValue]) {
                const componentData = components[componentType][selectedValue];
                let specsHTML = '<div class="specs-table">';
                
                // Hiển thị hình ảnh sản phẩm nếu có
                if (componentData.image) {
                    specsHTML += `<div class="component-image"><img src="${componentData.image}" alt="${componentData.name}"></div>`;
                }
                
                // Hiển thị tên và giá
                specsHTML += `<div class="component-name">${componentData.name}</div>`;
                specsHTML += `<div class="component-price">${componentData.price.toLocaleString()} VNĐ</div>`;
                
                // Hiển thị các thông số kỹ thuật
                specsHTML += '<table>';
                for (const [key, value] of Object.entries(componentData)) {
                    if (key !== 'name' && key !== 'price' && key !== 'image' && key !== 'score') {
                        specsHTML += `<tr><td>${formatSpecName(key)}</td><td>${value}</td></tr>`;
                    }
                }
                specsHTML += '</table></div>';
                
                infoElement.innerHTML = specsHTML;
                infoElement.style.display = 'block';
            } else {
                infoElement.innerHTML = '<div class="specs-preview">Chưa có thông tin</div>';
            }
        });
    });
}

// Cập nhật hiển thị biểu đồ hiệu năng
function updatePerformanceChart(cpuKey, vgaKey, ramKey) {
    if (cpuKey && vgaKey && ramKey) {
        const cpuScore = components.cpu[cpuKey].score || 0;
        const vgaScore = components.vga[vgaKey].score || 0;
        const ramScore = components.ram[ramKey].score || 0;
        
        const gamePerformance = calculateGamePerformance(cpuScore, vgaScore, ramScore);
        const graphicPerformance = calculateGraphicPerformance(cpuScore, vgaScore, ramScore);
        const officePerformance = calculateOfficePerformance(cpuScore, vgaScore, ramScore);
        const streamPerformance = calculateStreamPerformance(cpuScore, vgaScore, ramScore);
        const renderPerformance = calculateRenderPerformance(cpuScore, vgaScore, ramScore);
        const multitaskPerformance = calculateMultitaskPerformance(cpuScore, vgaScore, ramScore);
        
        // Cập nhật biểu đồ hiệu năng
        const chart = Chart.getChart('performance-chart');
        if (chart) {
            chart.data.datasets[0].data = [
                gamePerformance, 
                graphicPerformance, 
                officePerformance,
                streamPerformance,
                renderPerformance,
                multitaskPerformance
            ];
            chart.update();
        }
        
        // Cập nhật trạng thái hiệu năng
        document.getElementById('game-performance').textContent = getPerformanceRating(gamePerformance);
        document.getElementById('graphic-performance').textContent = getPerformanceRating(graphicPerformance);
        document.getElementById('office-performance').textContent = getPerformanceRating(officePerformance);
    }
}

// Hàm tính toán điểm hiệu năng cho game
function calculateGamePerformance(cpuScore, vgaScore, ramScore) {
    return (cpuScore * 0.3 + vgaScore * 0.6 + ramScore * 0.1) * 10;
}

// Hàm tính toán điểm hiệu năng cho đồ họa
function calculateGraphicPerformance(cpuScore, vgaScore, ramScore) {
    return (cpuScore * 0.2 + vgaScore * 0.7 + ramScore * 0.1) * 10;
}

// Hàm tính toán điểm hiệu năng cho văn phòng
function calculateOfficePerformance(cpuScore, vgaScore, ramScore) {
    return (cpuScore * 0.5 + vgaScore * 0.1 + ramScore * 0.4) * 10;
}

// Hàm tính toán điểm hiệu năng cho livestream
function calculateStreamPerformance(cpuScore, vgaScore, ramScore) {
    return (cpuScore * 0.6 + vgaScore * 0.3 + ramScore * 0.1) * 10;
}

// Hàm tính toán điểm hiệu năng cho render video
function calculateRenderPerformance(cpuScore, vgaScore, ramScore) {
    return (cpuScore * 0.4 + vgaScore * 0.4 + ramScore * 0.2) * 10;
}

// Hàm tính toán điểm hiệu năng cho đa nhiệm
function calculateMultitaskPerformance(cpuScore, vgaScore, ramScore) {
    return (cpuScore * 0.4 + vgaScore * 0.2 + ramScore * 0.4) * 10;
}

// Xếp loại hiệu năng dự kiến
function getPerformanceRating(score) {
    if (score >= 70) return "Rất tốt";
    if (score >= 50) return "Tốt";
    if (score >= 30) return "Trung bình";
    if (score >= 10) return "Yếu";
    return "Rất yếu";
}

// Kiểm tra và hiển thị thông báo tương thích
function checkCompatibility() {
    // Lấy các giá trị đã chọn
    const cpuKey = document.getElementById('cpu').value;
    const mainboardKey = document.getElementById('mainboard').value;
    const ramKey = document.getElementById('ram').value;
    
    let compatibilityIssues = [];
    
    // Kiểm tra socket CPU và Mainboard
    if (cpuKey && mainboardKey) {
        const cpu = components.cpu[cpuKey];
        const mainboard = components.mainboard[mainboardKey];
        
        if (cpu && mainboard && !mainboard.sockets.includes(cpu.socket)) {
            compatibilityIssues.push(`Socket CPU (${cpu.socket}) không tương thích với Mainboard (${mainboard.sockets.join(', ')})`);
            
            // Hiển thị icon không tương thích
            document.getElementById('cpu-compatibility').innerHTML = '<i class="fas fa-exclamation-triangle incompatible"></i>';
            document.getElementById('mainboard-compatibility').innerHTML = '<i class="fas fa-exclamation-triangle incompatible"></i>';
        } else {
            // Hiển thị icon tương thích
            document.getElementById('cpu-compatibility').innerHTML = '<i class="fas fa-check-circle"></i>';
            document.getElementById('mainboard-compatibility').innerHTML = '<i class="fas fa-check-circle"></i>';
        }
    }
    
    // Kiểm tra loại RAM và Mainboard
    if (ramKey && mainboardKey) {
        const ram = components.ram[ramKey];
        const mainboard = components.mainboard[mainboardKey];
        
        if (ram && mainboard && ram.type !== mainboard.memoryType) {
            compatibilityIssues.push(`Loại RAM (${ram.type}) không tương thích với Mainboard (${mainboard.memoryType})`);
            
            // Hiển thị icon không tương thích
            document.getElementById('ram-compatibility').innerHTML = '<i class="fas fa-exclamation-triangle incompatible"></i>';
            document.getElementById('mainboard-compatibility').innerHTML = '<i class="fas fa-exclamation-triangle incompatible"></i>';
        } else {
            // Hiển thị icon tương thích
            document.getElementById('ram-compatibility').innerHTML = '<i class="fas fa-check-circle"></i>';
        }
    }
    
    // Hiển thị thông báo nếu có vấn đề
    if (compatibilityIssues.length > 0) {
        const messageElement = document.getElementById('compatibility-message');
        messageElement.innerHTML = compatibilityIssues.join('<br>');
        document.getElementById('compatibility-alert').classList.remove('hidden');
    } else {
        document.getElementById('compatibility-alert').classList.add('hidden');
    }
    
    // Cập nhật hiển thị các thành phần đã chọn
    updateSelectedComponents();
}

// Tự động chọn cấu hình dựa trên ngân sách và nhu cầu
function autoSelectConfig() {
    isAutoSelecting = true;
    
    const gameType = document.getElementById('game-genre').value;
    const cpuType = document.getElementById('cpu-type').value;
    const budget = parseInt(document.getElementById('budget-range').value);
    
    // Lấy cấu hình phù hợp từ dữ liệu cấu hình có sẵn
    let config = null;
    
    // Xử lý dựa trên loại game và ngân sách
    if (gameType === 'valorant' || gameType === 'csgo' || gameType === 'lol') {
        // Game nhẹ
        if (budget <= 5000000) {
            config = {
                cpu: "9100f",
                mainboard: "H81",
                vga: "1050ti",
                ram: "adata-8",
                ssd: "crucial-256",
                case: "MSI-MAG",
                cpuCooler: "deepcool",
                psu: "coolermaster-450"
            };
        } else if (budget <= 10000000) {
            config = {
                cpu: "10400f",
                mainboard: "H510",
                vga: "1660s",
                ram: "gskill-16",
                ssd: "crucial-500",
                case: "NZXT-H510",
                cpuCooler: "ID-SE-224",
                psu: "corsair-550"
            };
        } else {
            config = {
                cpu: "12400f",
                mainboard: "HNZ-B760",
                vga: "3060",
                ram: "corsair-16",
                ssd: "samsung-1TB",
                case: "GA3",
                cpuCooler: "CR1000",
                psu: "VSP750"
            };
        }
    } else if (gameType === 'pubg' || gameType === 'gta-v') {
        // Game trung bình
        if (budget <= 8000000) {
            config = {
                cpu: "10400f",
                mainboard: "H510",
                vga: "1660s",
                ram: "gskill-16",
                ssd: "crucial-500",
                case: "NZXT-H510",
                cpuCooler: "ID-SE-224",
                psu: "corsair-550"
            };
        } else if (budget <= 15000000) {
            config = {
                cpu: "12400f",
                mainboard: "HNZ-B760",
                vga: "3060",
                ram: "corsair-16",
                ssd: "samsung-1TB",
                case: "GA3",
                cpuCooler: "CR1000",
                psu: "VSP750"
            };
        } else {
            config = {
                cpu: "13400f",
                mainboard: "HNZ-B760",
                vga: "3070ti",
                ram: "sstc-16",
                ssd: "crucial-500",
                case: "GA3",
                cpuCooler: "CR1000",
                psu: "VSP750"
            };
        }
    } else if (gameType === 'elden-ring' || gameType === 'god-of-war') {
        // Game nặng
        if (budget <= 12000000) {
            config = {
                cpu: "12400f",
                mainboard: "HNZ-B760",
                vga: "3060",
                ram: "corsair-16",
                ssd: "samsung-1TB",
                case: "GA3",
                cpuCooler: "CR1000",
                psu: "VSP750"
            };
        } else if (budget <= 20000000) {
            config = {
                cpu: "13400f",
                mainboard: "HNZ-B760",
                vga: "3070ti",
                ram: "sstc-16",
                ssd: "crucial-500",
                case: "GA3",
                cpuCooler: "CR1000",
                psu: "VSP750"
            };
        } else {
            config = {
                cpu: "13600k",
                mainboard: "MSI-Z690",
                vga: "4070",
                ram: "corsair-32",
                ssd: "samsung-2TB",
                case: "Corsair-5000D",
                cpuCooler: "NZXT-X63",
                psu: "corsair-850"
            };
        }
    }
    
    // Nếu đã chọn loại CPU, lọc cấu hình theo loại CPU
    if (cpuType && config) {
        // Kiểm tra xem CPU có phù hợp với loại CPU được chọn không
        const selectedCpu = components.cpu[config.cpu];
        if (selectedCpu) {
            const cpuBrand = selectedCpu.brand.toLowerCase();
            if ((cpuType === 'Intel' && !cpuBrand.includes('intel')) || 
                (cpuType === 'Amd' && !cpuBrand.includes('amd'))) {
                // Tìm CPU thay thế phù hợp với loại CPU đã chọn
                let alternativeCpu = null;
                
                for (const [key, cpu] of Object.entries(components.cpu)) {
                    if ((cpuType === 'Intel' && cpu.brand.toLowerCase().includes('intel')) ||
                        (cpuType === 'Amd' && cpu.brand.toLowerCase().includes('amd'))) {
                        if (!alternativeCpu || Math.abs(cpu.price - components.cpu[config.cpu].price) < 
                            Math.abs(alternativeCpu.price - components.cpu[config.cpu].price)) {
                            alternativeCpu = { key, ...cpu };
                        }
                    }
                }
                
                if (alternativeCpu) {
                    config.cpu = alternativeCpu.key;
                    
                    // Cũng cần cập nhật mainboard để tương thích với CPU mới
                    for (const [key, mainboard] of Object.entries(components.mainboard)) {
                        if (mainboard.sockets.includes(alternativeCpu.socket)) {
                            config.mainboard = key;
                            break;
                        }
                    }
                }
            }
        }
    }
    
    // Cập nhật UI với cấu hình đã chọn
    if (config) {
        updateDropdown('cpu', config.cpu);
        updateDropdown('mainboard', config.mainboard);
        updateDropdown('vga', config.vga);
        updateDropdown('ram', config.ram);
        updateDropdown('ssd', config.ssd);
        updateDropdown('case', config.case);
        updateDropdown('cpuCooler', config.cpuCooler);
        updateDropdown('psu', config.psu);
        
        // Cập nhật các thông tin khác
        calculateTotalPriceAndSummary();
        updatePerformanceChart(config.cpu, config.vga, config.ram);
    }
    
    isAutoSelecting = false;
}

// Cập nhật dropdown
function updateDropdown(id, value) {
    const dropdown = document.getElementById(id);
    if (dropdown && value) {
        // Tìm option với value tương ứng
        const option = Array.from(dropdown.options).find(opt => opt.value === value);
        
        // Nếu không tìm thấy, tạo mới option
        if (!option && components[id] && components[id][value]) {
            const component = components[id][value];
            const newOption = document.createElement("option");
            newOption.value = value;
            newOption.textContent = `${component.name} - ${component.price.toLocaleString()} VNĐ`;
            dropdown.appendChild(newOption);
        }
        
        // Set giá trị cho dropdown
        dropdown.value = value;
        
        // Trigger sự kiện change để cập nhật UI
        dropdown.dispatchEvent(new Event('change'));
    }
}

// Tính tổng chi phí và cập nhật tóm tắt
function calculateTotalPriceAndSummary() {
    const componentIds = ['cpu', 'mainboard', 'vga', 'ram', 'ssd', 'case', 'cpuCooler', 'psu', 'hdd', 'monitor'];
    let totalPrice = 0;
    let summaryHTML = '';
    
    // Map component IDs to display IDs
    const displayIdMap = {
        'cpuCooler': 'cpu-cooler'
    };
    
    componentIds.forEach(componentId => {
        const select = document.getElementById(componentId);
        const selectedValue = select.value;
        
        if (selectedValue && components[componentId] && components[componentId][selectedValue]) {
            const component = components[componentId][selectedValue];
            totalPrice += component.price;
            
            summaryHTML += `
                <div class="summary-item">
                    <div class="summary-component">${formatSpecName(componentId)}</div>
                    <div class="summary-name">${component.name}</div>
                    <div class="summary-price">${component.price.toLocaleString()} VNĐ</div>
                </div>
            `;
            
            // Cập nhật thông tin trong bảng cấu hình
            const displayId = displayIdMap[componentId] || componentId;
            if (document.getElementById(`${displayId}-name`)) {
                document.getElementById(`${displayId}-name`).textContent = component.name;
            }
            
            if (document.getElementById(`${displayId}-score`) && component.score !== undefined) {
                document.getElementById(`${displayId}-score`).textContent = component.score;
            }
        }
    });
    
    // Cập nhật tổng giá
    document.querySelector('#total-price p').textContent = `${totalPrice.toLocaleString()} VNĐ`;
    
    // Cập nhật modal tóm tắt
    document.getElementById('modal-components-list').innerHTML = summaryHTML;
    document.getElementById('modal-total-price').textContent = `Tổng cộng: ${totalPrice.toLocaleString()} VNĐ`;
    
    // Cập nhật biểu đồ hiệu năng
    const cpuKey = document.getElementById('cpu').value;
    const vgaKey = document.getElementById('vga').value;
    const ramKey = document.getElementById('ram').value;
    
    if (cpuKey && vgaKey && ramKey) {
        updatePerformanceChart(cpuKey, vgaKey, ramKey);
    }
    
    // Cập nhật tiến trình xây dựng
    updateBuildProgress();
    
    return totalPrice;
}

// Cập nhật hiển thị các thành phần đã chọn
function updateSelectedComponents() {
    const componentIds = ['cpu', 'mainboard', 'vga', 'ram', 'ssd', 'case', 'cpuCooler', 'psu', 'hdd', 'monitor'];
    let selectedHTML = '';
    
    componentIds.forEach(componentId => {
        const select = document.getElementById(componentId);
        const selectedValue = select.value;
        
        if (selectedValue && components[componentId] && components[componentId][selectedValue]) {
            const component = components[componentId][selectedValue];
            selectedHTML += `
                <div class="selected-component">
                    <div class="component-type">${formatSpecName(componentId)}</div>
                    <div class="component-details">
                        <div class="component-name">${component.name}</div>
                        <div class="component-price">${component.price.toLocaleString()} VNĐ</div>
                    </div>
                </div>
            `;
        }
    });
    
    document.getElementById('selected-components-list').innerHTML = selectedHTML;
}

// Cập nhật điểm số cho từng linh kiện và tổng điểm
function updateScores() {
    const componentIds = ['cpu', 'mainboard', 'vga', 'ram', 'ssd', 'case', 'cpuCooler', 'psu'];
    let totalScore = 0;
    let scoreCount = 0;
    
    componentIds.forEach(componentId => {
        const select = document.getElementById(componentId);
        const selectedValue = select.value;
        
        if (selectedValue && components[componentId] && components[componentId][selectedValue]) {
            const component = components[componentId][selectedValue];
            if (component.score !== undefined) {
                totalScore += component.score;
                scoreCount++;
                
                // Map cpuCooler to cpu-cooler in the display ID
                const displayIdMap = {
                    'cpuCooler': 'cpu-cooler'
                };
                
                const displayId = displayIdMap[componentId] || componentId;
                document.getElementById(`${displayId}-name`).textContent = component.name;
                document.getElementById(`${displayId}-score`).textContent = component.score;
            }
        }
    });
    
    // Tính điểm trung bình
    const averageScore = scoreCount > 0 ? Math.round(totalScore / scoreCount * 10) / 10 : 0;
    
    // Cập nhật tổng điểm
    document.getElementById('total-score').textContent = averageScore;
    
    // Cập nhật thông báo dựa trên điểm số
    const scoreMessage = document.getElementById('score-message');
    if (averageScore >= 8) {
        scoreMessage.textContent = "Cấu hình máy của bạn rất mạnh, có thể xử lý mọi tác vụ.";
        scoreMessage.className = "system-message good";
    } else if (averageScore >= 6) {
        scoreMessage.textContent = "Cấu hình máy của bạn tốt, đáp ứng hầu hết nhu cầu.";
        scoreMessage.className = "system-message good";
    } else if (averageScore >= 4) {
        scoreMessage.textContent = "Cấu hình máy của bạn khá, đủ cho nhu cầu cơ bản.";
        scoreMessage.className = "system-message medium";
    } else {
        scoreMessage.textContent = "Cấu hình máy của bạn yếu, chỉ đáp ứng nhu cầu cơ bản.";
        scoreMessage.className = "system-message warning";
    }
    
    return averageScore;
}

// Điền dữ liệu vào các dropdown
    function populateDropdowns() {
    componentSelects = {
        cpu: document.getElementById('cpu'),
        mainboard: document.getElementById('mainboard'),
        vga: document.getElementById('vga'),
        ram: document.getElementById('ram'),
        ssd: document.getElementById('ssd'),
        psu: document.getElementById('psu'),
        case: document.getElementById('case'),
        cpuCooler: document.getElementById('cpuCooler'),
        hdd: document.getElementById('hdd'),
        monitor: document.getElementById('monitor')
    };

        Object.entries(componentSelects).forEach(([type, select]) => {
        select.innerHTML = '<option value="" disabled selected>Chọn ' + formatSpecName(type) + '</option>';
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

// Khởi tạo ứng dụng
function initApp() {
    // Khởi tạo các chức năng chính
    populateDropdowns();
    setupComponentHoverInfo();
    addUIEffects();
    
    // Khởi tạo sự kiện cho các dropdown
    Object.values(componentSelects).forEach(select => {
        select.addEventListener('change', () => {
            checkCompatibility();
            if (!isAutoSelecting) {
                calculateTotalPriceAndSummary();
            }
        });
    });
    
    // Khởi tạo các sự kiện cho nút tính toán và xem chi tiết
    const calculateButton = document.getElementById('calculate-button');
    const summaryModal = document.getElementById('summary-modal');
    
    if (calculateButton) {
    calculateButton.addEventListener('click', () => {
        calculateTotalPriceAndSummary();
            updateScores();
            summaryModal.style.display = "block";
    });
    }

    // Sự kiện đóng modal
    const closeModalButton = document.querySelector('.close-modal');
    if (closeModalButton) {
        closeModalButton.addEventListener('click', () => {
        summaryModal.style.display = "none";
    });
    }

    window.addEventListener('click', (event) => {
        if (event.target === summaryModal) {
            summaryModal.style.display = "none";
        }
    });

    // Sự kiện cho budget range
    const budgetRange = document.getElementById('budget-range');
    if (budgetRange) {
        budgetRange.addEventListener('input', function() {
            const value = parseInt(this.value);
            document.getElementById('budget-value').textContent = `${(value / 1000000).toFixed(1)} triệu`;
        });
        
        // Trigger sự kiện input để cập nhật giá trị hiển thị
        budgetRange.dispatchEvent(new Event('input'));
    }
    
    // Sự kiện cho CPU type và Game genre
    document.getElementById('cpu-type').addEventListener('change', autoSelectConfig);
    document.getElementById('game-genre').addEventListener('change', autoSelectConfig);
    budgetRange.addEventListener('input', autoSelectConfig);
    
    // Mô phỏng click vào Intel để khởi tạo
    document.getElementById('intel-option').click();
} 