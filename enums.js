// Safe property setter
function safeSetWindowProperty(property, value) {
    try {
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
            console.log(`Created safe property '${safeProp}' for read-only '${property}'`);
            return true;
        }
        
        // Set property directly if possible
        window[property] = value;
        return true;
    } catch (e) {
        console.warn(`Could not set window.${property}:`, e);
        return false;
    }
}

// Mock require for browser environment
if (typeof window !== 'undefined' && !window.require) {
    window.require = function(moduleName) {
        console.log(`Mock require called for: ${moduleName}`);
        if (moduleName === '@popperjs/core') {
            if (typeof Popper !== 'undefined') {
                return Popper;
            }
            return {};
        }
        return {};
    };
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { safeSetWindowProperty };
} 