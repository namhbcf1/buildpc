/**
 * Fix Dropdown Selection - Khắc phục vấn đề không thể chọn dropdown trong chế độ tùy chỉnh
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Fix Dropdown Selection loaded');
    
    // Tạo sự kiện custom để thông báo rằng trang đã tải xong
    setTimeout(() => {
        document.dispatchEvent(new CustomEvent('fix-dropdown-ready'));
    }, 1000);
    
    // Theo dõi khi nút "Tùy Chỉnh" được nhấp để kích hoạt các dropdown
    const customModeButton = document.querySelector('.config-option[data-config="custom"]');
    if (customModeButton) {
        customModeButton.addEventListener('click', handleCustomModeClick);
    }
    
    // Đảm bảo dropdown selection luôn hoạt động đúng trong chế độ tùy chỉnh
    function fixDropdownSelection() {
        // Sử dụng MutationObserver để theo dõi các thay đổi trong DOM
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // Khi một dropdown được thêm hoặc thuộc tính của nó thay đổi
                if (mutation.type === 'attributes' || mutation.type === 'childList') {
                    // Kiểm tra tất cả các dropdown trong phần cấu hình
                    const configModeName = document.querySelector('.config-mode-name');
                    const customOptionActive = document.querySelector('.config-option[data-config="custom"].active');
                    if ((configModeName && configModeName.textContent.includes('Tùy Chỉnh')) || customOptionActive) {
                        const dropdowns = document.querySelectorAll('.component select');
                        dropdowns.forEach(dropdown => {
                            // Đảm bảo dropdown không bị vô hiệu hóa trong chế độ tùy chỉnh
                            dropdown.disabled = false;
                            dropdown.parentElement.classList.remove('disabled');
                            
                            // Đảm bảo sự kiện onchange vẫn hoạt động
                            dropdown.onchange = function() {
                                const componentType = this.getAttribute('data-component-type');
                                const selectedValue = this.value;
                                console.log(`Đã chọn ${selectedValue} cho ${componentType}`);
                                
                                // Cập nhật cấu hình hiện tại với lựa chọn mới
                                try {
                                    window.currentConfigurations = window.currentConfigurations || {};
                                    window.currentConfigurations[componentType] = selectedValue;
                                } catch (error) {
                                    console.error('Lỗi khi cập nhật cấu hình:', error);
                                }
                            };
                        });
                    }
                }
            });
        });

        // Bắt đầu quan sát các thay đổi trên toàn bộ phần cấu hình
        const configContainer = document.querySelector('.config-container');
        if (configContainer) {
            observer.observe(configContainer, { 
                attributes: true, 
                childList: true, 
                subtree: true,
                attributeFilter: ['disabled', 'class'] 
            });
        }

        // Thiết lập interval để kiểm tra và sửa chữa các dropdown định kỳ
        setInterval(() => {
            const configModeName = document.querySelector('.config-mode-name');
            const customOptionActive = document.querySelector('.config-option[data-config="custom"].active');
            if ((configModeName && configModeName.textContent.includes('Tùy Chỉnh')) || customOptionActive) {
                const dropdowns = document.querySelectorAll('.component select');
                dropdowns.forEach(dropdown => {
                    dropdown.disabled = false;
                    dropdown.parentElement.classList.remove('disabled');
                });
            }
        }, 500);
    }
    
    // Xử lý khi chế độ tùy chỉnh được chọn
    function handleCustomModeClick() {
        // Đợi một chút để đảm bảo các xử lý khác đã hoàn tất
        setTimeout(() => {
            // Kích hoạt tất cả dropdown
            fixDropdownSelection();
            
            // Xóa tất cả cấu hình hiện tại
            clearAllConfigurations();
            
            // Thêm hướng dẫn cho người dùng
            addCustomModeInstructions();
            
            // Đảm bảo các dropdown được hiển thị và có thể tương tác
            const dropdowns = document.querySelectorAll('.component select');
            dropdowns.forEach(dropdown => {
                dropdown.disabled = false;
                dropdown.parentElement.classList.remove('disabled');
                dropdown.style.pointerEvents = 'auto';
            });
            
            console.log('Đã kích hoạt chế độ tùy chỉnh và reset tất cả dropdown');
        }, 200);
    }
    
    // Xóa tất cả cấu hình hiện tại và chuẩn bị cho việc chọn lại
    function clearAllConfigurations() {
        // Thiết lập lại tất cả dropdown về giá trị mặc định
        const dropdowns = document.querySelectorAll('.component select');
        dropdowns.forEach(dropdown => {
            // Đặt về giá trị đầu tiên hoặc để trống
            if (dropdown.options.length > 0) {
                dropdown.selectedIndex = 0;
            }
            
            // Thêm sự kiện theo dõi thay đổi
            dropdown.addEventListener('change', function() {
                const componentType = this.getAttribute('data-component-type');
                const selectedValue = this.value;
                console.log(`Chế độ tùy chỉnh: Đã chọn ${selectedValue} cho ${componentType}`);
            });
        });
        
        // Khởi tạo lại đối tượng lưu trữ cấu hình nếu cần
        window.currentConfigurations = {};
        
        console.log('Đã xóa tất cả cấu hình và chuẩn bị cho việc chọn lại');
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
        const componentsSection = document.querySelector('.components-section');
        if (componentsSection) {
            componentsSection.insertBefore(instructions, componentsSection.firstChild);
        }
    }
    
    // Trigger khi trang đã tải xong
    document.addEventListener('fix-dropdown-ready', function() {
        handleCustomModeClick();
        
        // Kiểm tra nếu chế độ tùy chỉnh đã được chọn
        const customOption = document.querySelector('.config-option[data-config="custom"]');
        if (customOption && customOption.classList.contains('active')) {
            setTimeout(() => {
                customOption.click(); // Kích hoạt click event để chạy hàm xử lý
            }, 500);
        }
    });
}); 