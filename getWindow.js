function getWindow(node) {
    if (!node) return window;
    
    // Cache để tránh đệ quy vô hạn
    if (window._getWindowCache && window._getWindowCache.has(node)) {
        return window._getWindowCache.get(node);
    }
    
    if (!window._getWindowCache) {
        window._getWindowCache = new WeakMap();
    }
    
    let result = window;
    
    try {
        // Kiểm tra trực tiếp window
        if (node === window) {
            result = window;
        }
        // Kiểm tra document
        else if (node.ownerDocument && node.ownerDocument.defaultView) {
            result = node.ownerDocument.defaultView;
        }
        // Kiểm tra window-like object
        else if (node.document && node.location) {
            result = node;
        }
    } catch (e) {
        console.warn('Error in getWindow:', e);
        result = window;
    }
    
    window._getWindowCache.set(node, result);
    return result;
}

// Safe getComputedStyle function
function safeGetComputedStyle(element) {
    try {
        if (!element) return null;
        const win = getWindow(element);
        return win.getComputedStyle(element);
    } catch (error) {
        console.error('Error getting computed style:', error);
        return null;
    }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getWindow,
        safeGetComputedStyle
    };
} 