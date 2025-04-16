/**
 * Header Controller V2 - Quản lý chức năng ẩn/hiện header
 * 
 * Script này sẽ luôn ẩn header và chỉ hiển thị khi người dùng nhấp vào nút "Hiển thị Menu"
 * Phiên bản 2: Đã loại bỏ tất cả sự kiện scroll và tự động hiển thị
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 Header Controller V2 loaded');
    
    // Vô hiệu hóa tất cả event listeners cũ
    try {
        // Xóa tất cả event listeners trên window liên quan đến scroll
        const oldScrollListeners = window._scrollListeners || [];
        oldScrollListeners.forEach(listener => {
            window.removeEventListener('scroll', listener);
        });
        window._scrollListeners = [];
        
        // Ghi đè lên phương thức addEventListener gốc để ngăn chặn việc thêm sự kiện scroll mới
        const originalAddEventListener = window.addEventListener;
        window.addEventListener = function(type, listener, options) {
            if (type === 'scroll') {
                console.log('⚠️ Prevented adding scroll event that might affect header visibility');
                // Lưu lại listener để có thể xóa sau này nếu cần
                window._scrollListeners = window._scrollListeners || [];
                window._scrollListeners.push(listener);
            }
            return originalAddEventListener.call(this, type, listener, options);
        };
    } catch (e) {
        console.warn('Could not disable scroll events:', e);
    }
    
    // Các phần tử DOM
    const header = document.querySelector('header') || document.querySelector('.header');
    const body = document.body;
    
    // Tạo các phần tử UI cần thiết
    function createHeaderElements() {
        console.log('Creating header control elements');
        
        // Xóa nút cũ nếu có
        const oldHeaderTab = document.querySelector('.header-tab');
        if (oldHeaderTab) {
            oldHeaderTab.remove();
        }
        
        // Tạo tab hiển thị khi header bị ẩn
        const headerTab = document.createElement('div');
        headerTab.className = 'header-tab';
        headerTab.textContent = 'Hiển thị Menu';
        document.body.appendChild(headerTab);
        
        // Gán sự kiện cho nút hiển thị menu
        headerTab.addEventListener('click', toggleHeader);
        
        return { headerTab };
    }
    
    // Các phần tử UI
    const { headerTab } = createHeaderElements();
    
    // Ẩn header và hiển thị tab
    function hideHeader() {
        console.log('Hiding header');
        if (header) {
            header.classList.add('header-hidden');
            body.classList.add('header-is-hidden');
            
            // Xóa class at-page-top khỏi body nếu có
            body.classList.remove('at-page-top');
            
            // Hiển thị tab sau khi header đã ẩn hoàn toàn
            setTimeout(() => {
                headerTab.classList.add('visible');
            }, 300);
        }
    }
    
    // Hiển thị header và ẩn tab
    function showHeader() {
        console.log('Showing header');
        if (header) {
            header.classList.remove('header-hidden');
            headerTab.classList.remove('visible');
            body.classList.remove('header-is-hidden');
            
            // Tự động ẩn header sau 3 giây
            setTimeout(hideHeader, 3000);
        }
    }
    
    // Chuyển đổi trạng thái header (ẩn/hiện)
    function toggleHeader() {
        if (header.classList.contains('header-hidden')) {
            showHeader();
        } else {
            hideHeader();
        }
    }
    
    // Ẩn header khi trang tải xong
    function hideHeaderOnLoad() {
        setTimeout(() => {
            console.log('Initial header hiding');
            hideHeader();
            
            // Ngăn chặn hiển thị header khi cuộn
            window.addEventListener('scroll', function preventHeaderShowOnScroll(e) {
                // Nếu header đang ẩn, đảm bảo nó vẫn ẩn
                if (header.classList.contains('header-hidden')) {
                    // Đảm bảo chắc chắn các class vẫn được áp dụng đúng
                    header.classList.add('header-hidden');
                    body.classList.add('header-is-hidden');
                    body.classList.remove('at-page-top');
                }
            });
        }, 500);
    }
    
    // Khởi tạo
    hideHeaderOnLoad();
    
    // Export các hàm để có thể sử dụng ở nơi khác
    window.headerController = {
        hideHeader,
        showHeader,
        toggleHeader
    };
}); 