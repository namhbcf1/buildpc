/**
 * Fix Dropdown Selection - Khắc phục vấn đề không thể chọn dropdown trong chế độ tùy chỉnh
 * Phiên bản tăng cường: xử lý đặc biệt cho thiết bị cảm ứng và Safari trên iOS
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Fix Dropdown Selection loaded (Enhanced version)');
    
    // Phát hiện thiết bị di động
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isMobile) {
        console.log('📱 Mobile device detected: ' + navigator.userAgent);
        if (isIOS) {
            console.log('🍎 iOS device detected - applying special fixes');
            // Thêm class đặc biệt cho body để áp dụng CSS cho iOS
            document.body.classList.add('ios-device');
        }
    }
    
    // Tạo sự kiện custom để thông báo rằng trang đã tải xong
    setTimeout(() => {
        document.dispatchEvent(new CustomEvent('fix-dropdown-ready'));
        console.log('📢 fix-dropdown-ready event dispatched');
    }, 1000);
    
    // Trực tiếp kích hoạt tất cả các dropdown ngay khi tải trang
    enableAllDropdowns();
    
    // Theo dõi khi nút "Tùy Chỉnh" được nhấp để kích hoạt các dropdown
    const customModeButton = document.querySelector('.config-option[data-config="custom"]');
    if (customModeButton) {
        console.log('✅ Found custom mode button');
        
        // Xóa tất cả event listeners cũ nếu có
        const newCustomButton = customModeButton.cloneNode(true);
        customModeButton.parentNode.replaceChild(newCustomButton, customModeButton);
        
        // Thêm event listeners mới
        ['click', 'touchstart'].forEach(eventType => {
            newCustomButton.addEventListener(eventType, function(e) {
                if (eventType === 'touchstart') {
                    // Ngăn chặn các sự kiện khác trên touch device
                    e.preventDefault();
                }
                console.log("👆 Custom mode button " + eventType);
                handleCustomModeClick();
            }, { passive: false });
        });
    } else {
        console.warn('❌ Custom mode button not found');
    }
    
    // Thêm sự kiện touch và click trực tiếp cho tất cả dropdown
    document.querySelectorAll('.component select').forEach(dropdown => {
        try {
            console.log('Processing dropdown: ' + dropdown.id);
            
            // Đảm bảo dropdown có thể nhận tất cả loại sự kiện tương tác
            ['mousedown', 'touchstart', 'focus', 'click'].forEach(eventType => {
                dropdown.addEventListener(eventType, function(e) {
                    // Không ngăn chặn sự kiện mặc định trên iOS để tránh lỗi
                    if (eventType === 'touchstart' && !isIOS) {
                        e.preventDefault(); // Chỉ ngăn trên Android
                    }
                    
                    console.log("👆 " + eventType + " trên dropdown: " + this.id);
                    
                    // Đảm bảo dropdown không bị disabled
                    this.disabled = false;
                    
                    // Xóa thuộc tính readonly nếu có
                    this.removeAttribute('readonly');
                    
                    // Kích hoạt chế độ tùy chỉnh nếu chưa được chọn
                    const customOption = document.querySelector('.config-option[data-config="custom"]');
                    if (customOption && !customOption.classList.contains('active')) {
                        customOption.click();
                    }
                    
                    // Thêm class để hiển thị trạng thái active
                    this.classList.add('active-dropdown');
                    this.focus();
                }, isIOS ? { passive: true } : { passive: false });
            });
            
            // Fix đặc biệt cho iOS Safari
            if (isIOS) {
                // iOS Safari cần kích thước lớn hơn để dễ dàng tương tác
                dropdown.style.fontSize = '16px'; // Ngăn iOS zoom vào form
                dropdown.style.height = '44px'; // Touch target size phù hợp
                dropdown.style.padding = '10px';
                dropdown.style.marginBottom = '15px';
                
                // Đảm bảo dropdown hiển thị đúng trên iOS
                dropdown.style.appearance = 'menulist';
                dropdown.style.webkitAppearance = 'menulist';
            }
            
            // Thay thế dropdown để xóa các sự kiện có thể ngăn chặn
            const newDropdown = dropdown.cloneNode(true);
            
            // Copy styles từ dropdown gốc
            if (window.getComputedStyle) {
                const computedStyle = window.getComputedStyle(dropdown);
                for (let key of computedStyle) {
                    try {
                        newDropdown.style[key] = computedStyle[key];
                    } catch (e) {
                        // Bỏ qua lỗi CSS không hỗ trợ
                    }
                }
            }
            
            dropdown.parentNode.replaceChild(newDropdown, dropdown);
            
            // Thêm sự kiện change mới cho dropdown
            newDropdown.addEventListener('change', function(e) {
                console.log('🔄 Dropdown đã thay đổi:', this.id, 'Giá trị:', this.value);
                
                // Fix lỗi không trigger sự kiện change
                try {
                    // Trigger sự kiện change thủ công
                    const event = new Event('change', { bubbles: true });
                    this.dispatchEvent(event);
                } catch (err) {
                    console.error('Không thể trigger sự kiện change:', err);
                }
                
                // Đảm bảo ở chế độ tùy chỉnh
                const customOption = document.querySelector('.config-option[data-config="custom"]');
                if (customOption) {
                    customOption.classList.add('active');
                }
            });
        } catch (err) {
            console.error('Lỗi khi xử lý dropdown ' + dropdown.id + ':', err);
        }
    });
    
    // Đảm bảo dropdown selection luôn hoạt động đúng trong chế độ tùy chỉnh
    function fixDropdownSelection() {
        // Sử dụng MutationObserver để theo dõi các thay đổi trong DOM
        try {
            const observer = new MutationObserver(function(mutations) {
                console.log('🔄 DOM đã thay đổi, kích hoạt lại dropdown');
                enableAllDropdowns();
            });

            // Bắt đầu quan sát các thay đổi trên toàn bộ phần components-grid
            const componentsGrid = document.querySelector('.components-grid');
            if (componentsGrid) {
                observer.observe(componentsGrid, { 
                    attributes: true, 
                    childList: true, 
                    subtree: true,
                    attributeFilter: ['disabled', 'class'] 
                });
            } else {
                console.warn('⚠️ Không tìm thấy .components-grid để quan sát');
                // Quan sát toàn bộ body nếu không tìm thấy components-grid
                observer.observe(document.body, { 
                    attributes: true, 
                    childList: true, 
                    subtree: true,
                    attributeFilter: ['disabled', 'class'] 
                });
            }
        } catch (err) {
            console.error('❌ Lỗi khi tạo MutationObserver:', err);
        }

        // Thiết lập interval để liên tục kích hoạt tất cả dropdown
        const intervalID = setInterval(enableAllDropdowns, 500);
        
        // Dừng interval sau 30 giây để tiết kiệm tài nguyên
        setTimeout(() => {
            clearInterval(intervalID);
            console.log('🛑 Đã dừng interval kiểm tra dropdown sau 30 giây');
        }, 30000);
    }
    
    // Kích hoạt tất cả dropdown để đảm bảo chúng có thể chọn được
    function enableAllDropdowns() {
        try {
            const dropdowns = document.querySelectorAll('.component select');
            console.log(`🔍 Đang kích hoạt ${dropdowns.length} dropdown`);
            
            dropdowns.forEach(dropdown => {
                try {
                    // Đảm bảo dropdown không bị vô hiệu hóa
                    dropdown.disabled = false;
                    
                    // Thêm class để áp dụng CSS làm nổi bật
                    dropdown.classList.add('custom-mode-dropdown');
                    
                    // Đảm bảo tất cả option có thể chọn được (trừ option đầu tiên nếu là placeholder)
                    Array.from(dropdown.options).forEach((option, index) => {
                        if (index === 0 && option.value === "") {
                            // Giữ nguyên option đầu tiên (placeholder)
                        } else {
                            option.disabled = false;
                        }
                    });
                    
                    // Đảm bảo dropdown có thể tương tác
                    dropdown.style.pointerEvents = 'auto';
                    dropdown.style.cursor = 'pointer';
                    
                    // Xóa thuộc tính readonly nếu có
                    dropdown.removeAttribute('readonly');
                    
                    // Thêm CSS đặc biệt cho thiết bị di động
                    if (isMobile) {
                        // Tăng kích thước để dễ chạm
                        dropdown.style.height = isIOS ? '44px' : '40px';
                        dropdown.style.fontSize = '16px'; // Ngăn iOS zoom
                        
                        // Đảm bảo appearance đúng
                        dropdown.style.appearance = 'menulist';
                        dropdown.style.webkitAppearance = 'menulist';
                        dropdown.style.mozAppearance = 'menulist';
                    }
                    
                    // Đảm bảo parent container không bị disabled
                    if (dropdown.parentElement) {
                        dropdown.parentElement.classList.remove('disabled');
                    }
                } catch (err) {
                    console.error('❌ Lỗi khi kích hoạt dropdown ' + dropdown.id + ':', err);
                }
            });
        } catch (err) {
            console.error('❌ Lỗi trong enableAllDropdowns:', err);
        }
    }
    
    // Xử lý khi chế độ tùy chỉnh được chọn
    function handleCustomModeClick() {
        console.log('🔧 Đang xử lý kích hoạt chế độ tùy chỉnh...');
        
        // Đợi một chút để đảm bảo các xử lý khác đã hoàn tất
        setTimeout(() => {
            // Kích hoạt tất cả dropdown
            fixDropdownSelection();
            enableAllDropdowns();
            
            // Thêm hướng dẫn cho người dùng
            addCustomModeInstructions();
            
            console.log('✅ Đã kích hoạt chế độ tùy chỉnh và kích hoạt tất cả dropdown');
        }, 100);
    }
    
    // Thêm hướng dẫn cho người dùng trong chế độ tùy chỉnh
    function addCustomModeInstructions() {
        try {
            // Xóa hướng dẫn cũ nếu có
            const existingInstructions = document.querySelector('.custom-mode-instructions');
            if (existingInstructions) {
                existingInstructions.remove();
            }
            
            // Tạo phần tử hướng dẫn mới
            const instructions = document.createElement('div');
            instructions.className = 'custom-mode-instructions';
            instructions.style.padding = '10px';
            instructions.style.margin = '10px 0';
            instructions.style.backgroundColor = '#f8f9fa';
            instructions.style.border = '1px solid #ddd';
            instructions.style.borderRadius = '5px';
            instructions.style.color = '#333';
            instructions.style.fontSize = isMobile ? '14px' : '16px';
            
            // Thêm nội dung hướng dẫn
            let content = `
                <h4 style="margin-top: 0; color: #0056b3;">Hướng dẫn chế độ Tùy Chỉnh</h4>
                <p>Trong chế độ này, bạn có thể tự do lựa chọn các linh kiện phù hợp với nhu cầu của mình:</p>
                <ol>
                    <li>Bấm vào các dropdown bên dưới để chọn từng linh kiện</li>
                    <li>Mỗi lựa chọn sẽ được lưu lại tự động</li>
                    <li>Bạn có thể thay đổi lựa chọn bất kỳ lúc nào</li>
                </ol>
            `;
            
            // Thêm hướng dẫn đặc biệt cho thiết bị iOS
            if (isIOS) {
                content += `
                    <div style="margin-top: 10px; padding: 8px; background-color: #fff4e5; border: 1px solid #ffc107; border-radius: 4px;">
                        <p style="margin: 0; font-weight: bold; color: #856404;">Lưu ý cho người dùng iOS:</p>
                        <p style="margin: 5px 0 0 0;">Nếu dropdown không phản hồi, hãy bấm và giữ trong 1 giây rồi thả ra để mở danh sách lựa chọn.</p>
                    </div>
                `;
            }
            
            instructions.innerHTML = content;
            
            // Chèn hướng dẫn vào trước phần dropdown
            const componentSection = document.querySelector('#component-selection .section-header');
            if (componentSection) {
                componentSection.after(instructions);
            } else {
                console.warn('⚠️ Không tìm thấy section header để chèn hướng dẫn');
                // Thử chèn vào vị trí khác
                const componentsGrid = document.querySelector('.components-grid');
                if (componentsGrid) {
                    componentsGrid.parentNode.insertBefore(instructions, componentsGrid);
                }
            }
        } catch (err) {
            console.error('❌ Lỗi khi thêm hướng dẫn:', err);
        }
    }
    
    // Kích hoạt một lần nữa khi trang đã tải xong
    document.addEventListener('fix-dropdown-ready', function() {
        console.log('📢 Nhận được sự kiện fix-dropdown-ready');
        handleCustomModeClick();
        
        // Kiểm tra nếu chế độ tùy chỉnh đã được chọn
        const customOption = document.querySelector('.config-option[data-config="custom"]');
        if (customOption) {
            console.log('Trạng thái custom option:', customOption.classList.contains('active') ? 'active' : 'inactive');
            
            // Luôn kích hoạt chế độ tùy chỉnh mặc định
            if (!customOption.classList.contains('active')) {
                console.log('Kích hoạt nút custom');
                customOption.click();
            } else {
                console.log('Custom đã active, vẫn tiếp tục xử lý');
                handleCustomModeClick(); // Vẫn xử lý để đảm bảo tất cả dropdown được kích hoạt
            }
        } else {
            console.warn('❌ Không tìm thấy custom option');
        }
    });
}); 