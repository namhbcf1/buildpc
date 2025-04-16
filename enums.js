// Safe property setter with enhanced error handling
function safeSetWindowProperty(property, value) {
    try {
        // Special handling for dropdown-related issues
        if (property.includes('dropdown') || property.includes('select')) {
            console.log(`Special handling for dropdown-related property: ${property}`);
            // Use a safer alternative name
            const safeProp = `safe_${property}`;
            window[safeProp] = value;
            console.log(`Using safe alternative ${safeProp} instead of ${property}`);
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
            console.log(`Created safe property '${safeProp}' for read-only '${property}'`);
            
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
        console.warn(`Could not set window.${property}:`, e);
        
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
        
        console.log(`Fallback: Stored ${property} in _safeProps object with accessor method`);
        return false;
    }
}

// Enhanced popper mock for dropdown support
if (typeof window !== 'undefined' && !window.require) {
    window.require = function(moduleName) {
        console.log(`Mock require called for: ${moduleName}`);
        if (moduleName === '@popperjs/core') {
            if (typeof Popper !== 'undefined') {
                return Popper;
            }
            // Return mock Popper with required methods
            return {
                createPopper: function(reference, popper, options) {
                    console.log('Mock createPopper called');
                    return {
                        update: function() { console.log('Mock popper update'); },
                        destroy: function() { console.log('Mock popper destroy'); },
                        forceUpdate: function() { console.log('Mock popper forceUpdate'); },
                        setOptions: function() { console.log('Mock popper setOptions'); }
                    };
                }
            };
        }
        return {};
    };
}

// Fix for dropdown interaction issues
document.addEventListener('DOMContentLoaded', function() {
    // Ensure dropdowns can be interacted with
    try {
        // Prevent any code from disabling dropdowns
        const originalSetAttribute = Element.prototype.setAttribute;
        Element.prototype.setAttribute = function(name, value) {
            if (this.tagName === 'SELECT' && name === 'disabled') {
                console.log('Prevented disabling a SELECT element');
                return;
            }
            return originalSetAttribute.call(this, name, value);
        };
        
        // Prevent setting readonly on dropdowns
        const originalDefineProperty = Object.defineProperty;
        Object.defineProperty = function(obj, prop, descriptor) {
            if (obj instanceof HTMLSelectElement && 
                (prop === 'disabled' || prop === 'readonly')) {
                console.log('Prevented modifying select element properties');
                return obj;
            }
            return originalDefineProperty.call(this, obj, prop, descriptor);
        };
        
        console.log('Set up dropdown protection');
    } catch (e) {
        console.warn('Error setting up dropdown protection:', e);
    }
});

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { safeSetWindowProperty };
} 