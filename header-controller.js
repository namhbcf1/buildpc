/**
 * Header Controller - Quản lý chức năng ẩn/hiện header
 * 
 * Script này sẽ tự động ẩn header sau 5 giây không hoạt động
 * và hiển thị lại khi người dùng tương tác với trang.
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 Header Controller loaded');
    
    // Các phần tử DOM
    const header = document.querySelector('header') || document.querySelector('.header');
    const body = document.body;
    let headerTimer;
    
    // Tạo các phần tử UI cần thiết
    function createHeaderElements() {
        console.log('Creating header control elements');
        
        // Tạo vùng kích hoạt ở trên cùng của trang
        const triggerArea = document.createElement('div');
        triggerArea.className = 'header-trigger-area';
        document.body.appendChild(triggerArea);
        
        // Tạo tab hiển thị khi header bị ẩn
        const headerTab = document.createElement('div');
        headerTab.className = 'header-tab';
        headerTab.textContent = 'Hiển thị Menu';
        document.body.appendChild(headerTab);
        
        // Gán sự kiện cho các phần tử
        triggerArea.addEventListener('mouseenter', showHeader);
        headerTab.addEventListener('click', showHeader);
        
        return { triggerArea, headerTab };
    }
    
    // Các phần tử UI
    const { triggerArea, headerTab } = createHeaderElements();
    
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
            resetHeaderTimer();
        }
    }
    
    // Thiết lập lại bộ đếm thời gian ẩn header
    function resetHeaderTimer() {
        clearTimeout(headerTimer);
        headerTimer = setTimeout(hideHeader, 5000); // 5 giây
    }
    
    // Kiểm tra nếu trang đang ở đầu trang
    function isAtPageTop() {
        return window.scrollY <= 20;
    }
    
    // Khởi tạo sự kiện lắng nghe
    function initHeaderEvents() {
        if (!header) {
            console.warn('Header not found!');
            return;
        }
        
        console.log('Initializing header events');
        
        // Khởi tạo bộ hẹn giờ ẩn header ngay lập tức
        resetHeaderTimer();
        
        // Sự kiện cuộn trang
        window.addEventListener('scroll', function() {
            // Hiển thị header khi cuộn lên đầu trang
            if (isAtPageTop()) {
                showHeader();
            } else {
                resetHeaderTimer();
            }
        });
        
        // Sự kiện khi di chuột vào header
        header.addEventListener('mouseenter', function() {
            showHeader();
        });
        
        // Sự kiện tương tác với trang để reset timer
        ['click', 'touchstart', 'mousemove', 'keydown'].forEach(eventType => {
            document.addEventListener(eventType, function() {
                if (!header.classList.contains('header-hidden')) {
                    resetHeaderTimer();
                }
            });
        });
    }
    
    // Buộc ẩn header sau 1 giây để đảm bảo nó hoạt động
    function forceHideHeaderAfterDelay() {
        setTimeout(() => {
            console.log('Force hiding header');
            hideHeader();
        }, 1000);
    }
    
    // Khởi tạo
    initHeaderEvents();
    forceHideHeaderAfterDelay();
    
    // Export các hàm để có thể sử dụng ở nơi khác
    window.headerController = {
        hideHeader,
        showHeader,
        resetHeaderTimer
    };
}); 