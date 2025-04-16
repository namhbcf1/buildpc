/**
 * Fix Dropdown Selection - Khắc phục vấn đề không thể chọn dropdown trong chế độ tùy chỉnh
 * Phiên bản tăng cường: xử lý đặc biệt cho thiết bị cảm ứng và Safari trên iOS
 * Phiên bản 2.0: Giảm thiểu log, tối ưu hóa hiệu suất
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Fix Dropdown Selection v2.0 loaded');
    
    // Biến theo dõi trạng thái để tránh xử lý trùng lặp
    let isProcessing = false;
    let customModeActivated = false;
    let fixesApplied = false;
    let observerActive = false;
    
    // Phát hiện thiết bị di động
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    
    if (isMobile) {
        console.log('📱 Mobile device detected' + (isIOS ? ' (iOS)' : ''));
        if (isIOS) {
            document.body.classList.add('ios-device');
        }
    }
    
    // Chức năng chính: kích hoạt tất cả dropdown
    function enableAllDropdowns(silent = false) {
        // Tránh xử lý trùng lặp
        if (isProcessing) return;
        isProcessing = true;
        
        try {
            const dropdowns = document.querySelectorAll('.component select');
            if (!silent) {
                console.log(`Enabling ${dropdowns.length} dropdowns`);
            }
            
            dropdowns.forEach(dropdown => {
                try {
                    // Đảm bảo dropdown không bị vô hiệu hóa
                    dropdown.disabled = false;
                    dropdown.classList.add('custom-mode-dropdown');
                    
                    // Xóa các thuộc tính hạn chế
                    dropdown.removeAttribute('readonly');
                    dropdown.style.pointerEvents = 'auto';
                    dropdown.style.cursor = 'pointer';
                    
                    // Bật tất cả options
                    Array.from(dropdown.options).forEach((option, index) => {
                        if (index === 0 && option.value === "") {
                            // Giữ nguyên placeholder
                        } else {
                            option.disabled = false;
                        }
                    });
                    
                    // Tối ưu hóa cho thiết bị mobile
                    if (isMobile && !dropdown.hasAttribute('mobile-optimized')) {
                        dropdown.setAttribute('mobile-optimized', 'true');
                        
                        // Đặt kích thước phù hợp cho từng loại thiết bị
                        dropdown.style.height = isIOS ? '44px' : '40px';
                        dropdown.style.fontSize = '16px';
                        
                        // Đảm bảo hiển thị đúng
                        dropdown.style.appearance = 'menulist';
                        dropdown.style.webkitAppearance = 'menulist';
                        dropdown.style.mozAppearance = 'menulist';
                    }
                    
                    // Đảm bảo container không bị disabled
                    if (dropdown.parentElement && dropdown.parentElement.classList.contains('disabled')) {
                        dropdown.parentElement.classList.remove('disabled');
                    }
                } catch (err) {
                    console.error('Error processing dropdown:', err);
                }
            });
        } catch (err) {
            console.error('Error in enableAllDropdowns:', err);
        } finally {
            isProcessing = false;
        }
    }
    
    // Thiết lập MutationObserver để theo dõi thay đổi DOM một lần duy nhất
    function setupMutationObserver() {
        if (observerActive) return;
        
        try {
            const observer = new MutationObserver(function(mutations) {
                // Chỉ kích hoạt dropdown khi cần thiết
                const needsUpdate = mutations.some(mutation => {
                    return mutation.type === 'attributes' && 
                           (mutation.attributeName === 'disabled' || 
                            mutation.attributeName === 'class');
                });
                
                if (needsUpdate) {
                    // Sử dụng silent mode để tránh log quá nhiều
                    enableAllDropdowns(true);
                }
            });

            // Quan sát chọn lọc để tối ưu hiệu suất
            const componentsGrid = document.querySelector('.components-grid');
            if (componentsGrid) {
                observer.observe(componentsGrid, { 
                    attributes: true, 
                    childList: false, 
                    subtree: true,
                    attributeFilter: ['disabled', 'class'] 
                });
                observerActive = true;
            } else {
                // Fallback nếu không tìm thấy components grid
                const componentSection = document.querySelector('#component-selection');
                if (componentSection) {
                    observer.observe(componentSection, {
                        attributes: true,
                        childList: false,
                        subtree: true,
                        attributeFilter: ['disabled', 'class']
                    });
                    observerActive = true;
                }
            }
            
            console.log('DOM observer set up successfully');
        } catch (err) {
            console.error('Error setting up observer:', err);
        }
    }
    
    // Xử lý khi chế độ tùy chỉnh được chọn
    function handleCustomModeClick() {
        if (customModeActivated) return;
        
        try {
            console.log('Activating custom mode...');
            
            // Kích hoạt tất cả dropdown
            enableAllDropdowns();
            
            // Thiết lập MutationObserver nếu chưa
            if (!observerActive) {
                setupMutationObserver();
            }
            
            // Thêm hướng dẫn cho người dùng
            addCustomModeInstructions();
            
            // Đánh dấu đã kích hoạt
            customModeActivated = true;
            
            console.log('Custom mode activated');
        } catch (err) {
            console.error('Error in handleCustomModeClick:', err);
        }
    }
    
    // Thêm hướng dẫn cho người dùng ở chế độ tùy chỉnh
    function addCustomModeInstructions() {
        try {
            // Không thêm lại nếu đã tồn tại
            if (document.querySelector('.custom-mode-instructions')) {
                return;
            }
            
            const instructions = document.createElement('div');
            instructions.className = 'custom-mode-instructions';
            instructions.style.padding = '10px';
            instructions.style.margin = '10px 0';
            instructions.style.backgroundColor = '#f8f9fa';
            instructions.style.border = '1px solid #ddd';
            instructions.style.borderRadius = '5px';
            instructions.style.color = '#333';
            instructions.style.fontSize = isMobile ? '14px' : '16px';
            
            // Nội dung hướng dẫn
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
            
            // Chèn hướng dẫn vào UI
            const insertPoint = 
                document.querySelector('#component-selection .section-header') || 
                document.querySelector('.components-grid');
                
            if (insertPoint) {
                if (insertPoint.className.includes('section-header')) {
                    insertPoint.after(instructions);
                } else {
                    insertPoint.parentNode.insertBefore(instructions, insertPoint);
                }
            }
        } catch (err) {
            console.error('Error adding instructions:', err);
        }
    }
    
    // === Thiết lập các event listeners ===
    
    // Theo dõi nút "Tùy Chỉnh"
    function setupCustomButton() {
        const customModeButton = document.querySelector('.config-option[data-config="custom"]');
        if (!customModeButton) {
            console.warn('Custom mode button not found');
            return;
        }
        
        try {
            // Đảm bảo chỉ có một lần sự kiện được gắn
            const newButton = customModeButton.cloneNode(true);
            customModeButton.parentNode.replaceChild(newButton, customModeButton);
            
            // Xử lý cả click thông thường và touch
            newButton.addEventListener('click', handleCustomModeClick);
            
            if (isMobile) {
                newButton.addEventListener('touchstart', function(e) {
                    handleCustomModeClick();
                }, { passive: true });
            }
            
            console.log('Custom button set up');
        } catch (err) {
            console.error('Error setting up custom button:', err);
        }
    }
    
    // Thiết lập sự kiện cho các dropdown
    function setupDropdowns() {
        const dropdowns = document.querySelectorAll('.component select');
        if (!dropdowns.length) {
            console.warn('No dropdowns found');
            return;
        }
        
        console.log(`Setting up ${dropdowns.length} dropdowns`);
        
        dropdowns.forEach(dropdown => {
            try {
                // Chỉ thiết lập một lần mỗi dropdown
                if (dropdown.hasAttribute('event-setup')) return;
                
                // Sử dụng cloneNode để xóa tất cả event listener cũ
                const newDropdown = dropdown.cloneNode(true);
                dropdown.parentNode.replaceChild(newDropdown, dropdown);
                
                // Đánh dấu đã thiết lập
                newDropdown.setAttribute('event-setup', 'true');
                
                // Đảm bảo dropdown không bị vô hiệu hóa ban đầu
                newDropdown.disabled = false;
                newDropdown.classList.add('custom-mode-dropdown');
                
                // Thêm sự kiện click/touch
                if (isMobile) {
                    newDropdown.addEventListener('touchstart', function(e) {
                        // Kích hoạt chế độ tùy chỉnh khi dropdown được chạm
                        activateCustomMode();
                        
                        // Đảm bảo dropdown có thể nhận input
                        this.disabled = false;
                        this.classList.add('active-dropdown');
                    }, { passive: true });
                }
                
                // Sự kiện click để phòng trường hợp touch không hoạt động
                newDropdown.addEventListener('mousedown', function() {
                    activateCustomMode();
                    this.disabled = false;
                });
                
                // Sự kiện focus
                newDropdown.addEventListener('focus', function() {
                    this.classList.add('active-dropdown');
                });
                
                // Sự kiện blur
                newDropdown.addEventListener('blur', function() {
                    this.classList.remove('active-dropdown');
                });
                
                // Sự kiện change
                newDropdown.addEventListener('change', function() {
                    // Đảm bảo ở chế độ tùy chỉnh
                    activateCustomMode();
                });
                
            } catch (err) {
                console.error('Error setting up dropdown:', err);
            }
        });
    }
    
    // Kích hoạt chế độ tùy chỉnh nếu chưa được chọn
    function activateCustomMode() {
        if (customModeActivated) return;
        
        const customOption = document.querySelector('.config-option[data-config="custom"]');
        if (customOption && !customOption.classList.contains('active')) {
            customOption.click();
        } else {
            handleCustomModeClick();
        }
    }
    
    // === Khởi tạo ===
    
    // Áp dụng các sửa đổi khi trang đã tải
    function initializeDropdownFixes() {
        if (fixesApplied) return;
        
        try {
            // Thiết lập các event listeners
            setupCustomButton();
            setupDropdowns();
            
            // Kích hoạt dropdown ban đầu
            enableAllDropdowns();
            
            // Thiết lập MutationObserver
            setupMutationObserver();
            
            // Đánh dấu đã áp dụng
            fixesApplied = true;
            
            console.log('Dropdown fixes initialized');
            
            // Kích hoạt chế độ tùy chỉnh mặc định nếu đang được chọn
            const customOption = document.querySelector('.config-option[data-config="custom"]');
            if (customOption && customOption.classList.contains('active')) {
                handleCustomModeClick();
            }
        } catch (err) {
            console.error('Error in initialization:', err);
        }
    }
    
    // Kích hoạt ngay lập tức
    initializeDropdownFixes();
    
    // Đảm bảo chạy ngay cả khi DOMContentLoaded đã xảy ra
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(initializeDropdownFixes, 100);
    }
}); 