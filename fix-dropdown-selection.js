/**
 * Fix Dropdown Selection - Khắc phục vấn đề không thể chọn dropdown trong chế độ tùy chỉnh
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Fix Dropdown Selection loaded');
    
    // Tạo sự kiện custom để thông báo rằng trang đã tải xong
    setTimeout(() => {
        document.dispatchEvent(new CustomEvent('fix-dropdown-ready'));
    }, 1000);
    
    // Trực tiếp kích hoạt tất cả các dropdown ngay khi tải trang
    enableAllDropdowns();
    
    // Theo dõi khi nút "Tùy Chỉnh" được nhấp để kích hoạt các dropdown
    const customModeButton = document.querySelector('.config-option[data-config="custom"]');
    if (customModeButton) {
        customModeButton.addEventListener('click', function() {
            console.log("Đã nhấp vào nút Tùy Chỉnh");
            handleCustomModeClick();
        });
    }
    
    // Thêm sự kiện click trực tiếp cho tất cả dropdown
    document.querySelectorAll('.component select').forEach(dropdown => {
        // Đảm bảo dropdown có thể nhận click
        dropdown.addEventListener('mousedown', function(e) {
            console.log("Click trên dropdown:", this.id);
            // Đảm bảo dropdown không bị disabled
            this.disabled = false;
            
            // Kích hoạt chế độ tùy chỉnh nếu chưa được chọn
            const customOption = document.querySelector('.config-option[data-config="custom"]');
            if (customOption && !customOption.classList.contains('active')) {
                customOption.click();
            }
        });
        
        // Thay thế dropdown để xóa các sự kiện có thể ngăn chặn
        const newDropdown = dropdown.cloneNode(true);
        dropdown.parentNode.replaceChild(newDropdown, dropdown);
        
        // Thêm sự kiện change mới cho dropdown
        newDropdown.addEventListener('change', function() {
            console.log('Dropdown đã thay đổi:', this.id, 'Giá trị:', this.value);
            // Đảm bảo ở chế độ tùy chỉnh
            const customOption = document.querySelector('.config-option[data-config="custom"]');
            if (customOption) {
                customOption.classList.add('active');
            }
        });
    });
    
    // Đảm bảo dropdown selection luôn hoạt động đúng trong chế độ tùy chỉnh
    function fixDropdownSelection() {
        // Sử dụng MutationObserver để theo dõi các thay đổi trong DOM
        const observer = new MutationObserver(function(mutations) {
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
            console.warn('Không tìm thấy .components-grid để quan sát');
            // Quan sát toàn bộ body nếu không tìm thấy components-grid
            observer.observe(document.body, { 
                attributes: true, 
                childList: true, 
                subtree: true,
                attributeFilter: ['disabled', 'class'] 
            });
        }

        // Thiết lập interval để liên tục kích hoạt tất cả dropdown
        setInterval(enableAllDropdowns, 500);
    }
    
    // Kích hoạt tất cả dropdown để đảm bảo chúng có thể chọn được
    function enableAllDropdowns() {
        const dropdowns = document.querySelectorAll('.component select');
        dropdowns.forEach(dropdown => {
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
            
            // Bỏ qua sự kiện preventDefault nếu có
            dropdown.addEventListener('click', function(e) {
                e.stopPropagation();
            }, true);
            
            dropdown.parentElement.classList.remove('disabled');
        });
    }
    
    // Xử lý khi chế độ tùy chỉnh được chọn
    function handleCustomModeClick() {
        console.log('Đang xử lý kích hoạt chế độ tùy chỉnh...');
        
        // Đợi một chút để đảm bảo các xử lý khác đã hoàn tất
        setTimeout(() => {
            // Kích hoạt tất cả dropdown
            fixDropdownSelection();
            enableAllDropdowns();
            
            // Thêm hướng dẫn cho người dùng
            addCustomModeInstructions();
            
            console.log('Đã kích hoạt chế độ tùy chỉnh và kích hoạt tất cả dropdown');
        }, 100);
    }
    
    // Xóa tất cả cấu hình hiện tại và chuẩn bị cho việc chọn lại
    function clearAllConfigurations() {
        // Thiết lập lại tất cả dropdown về giá trị mặc định nếu cần
        // Bình thường không cần reset khi người dùng muốn tùy chỉnh
    }
    
    // Thêm hướng dẫn cho người dùng trong chế độ tùy chỉnh
    function addCustomModeInstructions() {
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
        
        instructions.innerHTML = `
            <h4 style="margin-top: 0; color: #0056b3;">Hướng dẫn chế độ Tùy Chỉnh</h4>
            <p>Trong chế độ này, bạn có thể tự do lựa chọn các linh kiện phù hợp với nhu cầu của mình:</p>
            <ol>
                <li>Sử dụng các dropdown bên dưới để chọn từng linh kiện</li>
                <li>Mỗi lựa chọn sẽ được lưu lại tự động</li>
                <li>Bạn có thể thay đổi lựa chọn bất kỳ lúc nào</li>
            </ol>
        `;
        
        // Chèn hướng dẫn vào trước phần dropdown
        const componentSection = document.querySelector('#component-selection .section-header');
        if (componentSection) {
            componentSection.after(instructions);
        }
    }
    
    // Kích hoạt một lần nữa khi trang đã tải xong
    document.addEventListener('fix-dropdown-ready', function() {
        handleCustomModeClick();
        
        // Kiểm tra nếu chế độ tùy chỉnh đã được chọn
        const customOption = document.querySelector('.config-option[data-config="custom"]');
        if (customOption) {
            // Luôn kích hoạt chế độ tùy chỉnh mặc định
            if (!customOption.classList.contains('active')) {
                customOption.click();
            } else {
                handleCustomModeClick(); // Vẫn xử lý để đảm bảo tất cả dropdown được kích hoạt
            }
        }
    });
}); 