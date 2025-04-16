// Safe property setter with enhanced error handling - phiên bản tối ưu
function safeSetWindowProperty(property, value) {
    try {
        // Giảm thiểu logging không cần thiết
        const isDropdownRelated = property.includes('dropdown') || 
                                  property.includes('select') || 
                                  property.includes('option');
        
        // Special handling for dropdown-related issues
        if (isDropdownRelated) {
            // Use a safer alternative name
            const safeProp = `safe_${property}`;
            window[safeProp] = value;
            
            // Chỉ log khi thực sự cần thiết
            if (property.includes('debug') || property.includes('log')) {
                console.log(`Using safe alternative ${safeProp} instead of ${property}`);
            }
            return true;
        }
        
        // Check if property is configurable
        const descriptor = Object.getOwnPropertyDescriptor(window, property);
        if (descriptor && !descriptor.configurable) {
            // Create a safe alternative property
            const safeProp = `${property}_safe`;
            Object.defineProperty(window, safeProp, {
                value: value,
                writable: true,
                configurable: true,
                enumerable: true
            });
            
            // Provide an accessor method
            window[`get${property.charAt(0).toUpperCase() + property.slice(1)}`] = function() {
                return window[safeProp];
            };
            
            return true;
        }
        
        // Set property directly if possible
        window[property] = value;
        return true;
    } catch (e) {
        // Giảm thiểu warnings trên console
        if (!window._warnedProps) {
            window._warnedProps = new Set();
        }
        
        if (!window._warnedProps.has(property)) {
            console.warn(`Could not set window.${property}`);
            window._warnedProps.add(property);
        }
        
        // Fallback: create a global object to store these values
        if (!window._safeProps) {
            window._safeProps = {};
        }
        
        // Store value in the safe object
        window._safeProps[property] = value;
        
        // Create accessor method
        window[`get${property.charAt(0).toUpperCase() + property.slice(1)}`] = function() {
            return window._safeProps[property];
        };
        
        return false;
    }
}

// Enhanced popper mock for dropdown support
if (typeof window !== 'undefined' && !window.require) {
    // Only create mock if it doesn't exist
    window.require = function(moduleName) {
        // Không cần log mỗi lần require được gọi
        if (moduleName === '@popperjs/core') {
            if (typeof Popper !== 'undefined') {
                return Popper;
            }
            // Return mock Popper with required methods
            return {
                createPopper: function(reference, popper, options) {
                    // Tránh log quá nhiều
                    const popperMock = {
                        update: function() {},
                        destroy: function() {},
                        forceUpdate: function() {},
                        setOptions: function() {}
                    };
                    
                    // Tạo thuộc tính state để tránh lỗi
                    Object.defineProperty(popperMock, 'state', {
                        get: function() {
                            return {
                                elements: {
                                    reference: reference,
                                    popper: popper
                                },
                                options: options || {}
                            };
                        }
                    });
                    
                    return popperMock;
                }
            };
        }
        return {};
    };
}

// Fix for dropdown interaction issues
document.addEventListener('DOMContentLoaded', function() {
    // Đếm số lần thay đổi để tránh gây ra quá nhiều log
    let modificationCount = 0;
    const MAX_LOGS = 5;
    
    // Ensure dropdowns can be interacted with
    try {
        // Prevent any code from disabling dropdowns
        const originalSetAttribute = Element.prototype.setAttribute;
        Element.prototype.setAttribute = function(name, value) {
            if (this.tagName === 'SELECT' && name === 'disabled' && value) {
                // Chỉ log giới hạn số lần để tránh spam console
                if (modificationCount < MAX_LOGS) {
                    console.log('Prevented disabling a SELECT element');
                    modificationCount++;
                    
                    if (modificationCount === MAX_LOGS) {
                        console.log('Further setAttribute logs suppressed');
                    }
                }
                return;
            }
            return originalSetAttribute.call(this, name, value);
        };
        
        // Prevent setting readonly on dropdowns
        const originalDefineProperty = Object.defineProperty;
        Object.defineProperty = function(obj, prop, descriptor) {
            if (obj instanceof HTMLSelectElement && 
                (prop === 'disabled' || prop === 'readonly') && 
                descriptor && descriptor.value === true) {
                
                // Trả về object mà không thay đổi thuộc tính
                return obj;
            }
            return originalDefineProperty.call(this, obj, prop, descriptor);
        };
    } catch (e) {
        // Chỉ log lỗi nghiêm trọng
        console.warn('Error setting up dropdown protection');
    }
    
    // Fix cho form elements trên iOS
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
        try {
            // Đảm bảo font size đủ lớn để tránh zoom
            document.querySelectorAll('select, input, textarea').forEach(el => {
                if (getComputedStyle(el).fontSize.replace('px', '') < 16) {
                    el.style.fontSize = '16px';
                }
            });
        } catch (e) {
            // Bỏ qua lỗi không đáng kể
        }
    }
});

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { safeSetWindowProperty };
} 