/**
 * Header Controller - Quản lý chức năng ẩn/hiện header
 * 
 * Script này sẽ tự động ẩn header và chỉ hiển thị lại khi người dùng nhấp vào nút "Hiển thị Menu"
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 Header Controller loaded');
    
    // Các phần tử DOM
    const header = document.querySelector('header') || document.querySelector('.header');
    const body = document.body;
    
    // Tạo các phần tử UI cần thiết
    function createHeaderElements() {
        console.log('Creating header control elements');
        
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