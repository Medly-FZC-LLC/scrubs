// Currency Conversion JavaScript

// Currency exchange rates (fixed rates for demonstration)
const exchangeRates = {
    SAR: 1,      // Base currency (Saudi Riyal)
    USD: 0.27,   // 1 SAR = 0.27 USD
    AED: 0.98    // 1 SAR = 0.98 AED
};

// Currency symbols
const currencySymbols = {
    SAR: 'ر.س',
    USD: '$',
    AED: 'د.إ'
};

// Default currency
let currentCurrency = localStorage.getItem('selectedCurrency') || 'SAR';

// Initialize currency on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set the selected currency in the dropdown
    const currencySelector = document.getElementById('currency-selector');
    if (currencySelector) {
        currencySelector.value = currentCurrency;
    }
    
    // Update all prices on the page
    updateAllPrices();
    
    // Add event listener to currency selector
    if (currencySelector) {
        currencySelector.addEventListener('change', function() {
            currentCurrency = this.value;
            localStorage.setItem('selectedCurrency', currentCurrency);
            updateAllPrices();
        });
    }
});

// Convert price from SAR to selected currency
function convertPrice(priceInSAR, targetCurrency) {
    // Ensure we're working with a number
    let numericPrice;
    
    if (typeof priceInSAR === 'string') {
        // Handle string with comma as decimal separator
        const priceMatch = priceInSAR.match(/([0-9]+),([0-9]+)/);
        if (priceMatch) {
            numericPrice = parseFloat(`${priceMatch[1]}.${priceMatch[2]}`);
        } else {
            // Remove any non-numeric characters except period
            numericPrice = parseFloat(priceInSAR.replace(/[^\d.]/g, ''));
        }
    } else {
        // Already a number
        numericPrice = parseFloat(priceInSAR);
    }
    
    if (isNaN(numericPrice)) {
        return '0';
    }
    
    // Convert to target currency
    const convertedPrice = numericPrice * exchangeRates[targetCurrency];
    
    // Format the price with 2 decimal places
    return convertedPrice.toFixed(2);
}

// Format price with currency symbol
function formatPrice(price, currency) {
    const symbol = currencySymbols[currency];
    
    // Format based on currency
    if (currency === 'USD') {
        return `${symbol}${price}`;  // $ before the number
    } else {
        return `${price} ${symbol}`;  // Symbol after the number for SAR and AED
    }
}

// Update all prices on the page
function updateAllPrices() {
    // Update product prices
    const priceElements = document.querySelectorAll('.price');
    priceElements.forEach(element => {
        // Get the original price in SAR from data attribute or set it if not exists
        if (!element.dataset.sarPrice) {
            // Store original SAR price when first encountered
            const originalText = element.textContent;
            
            // Handle string with comma as decimal separator
            const priceMatch = originalText.match(/([0-9]+),([0-9]+)/);
            let numericPrice;
            
            if (priceMatch) {
                numericPrice = parseFloat(`${priceMatch[1]}.${priceMatch[2]}`);
            } else {
                numericPrice = parseFloat(originalText.replace(/[^\d.]/g, ''));
            }
            
            element.dataset.sarPrice = numericPrice;
        }
        
        // Convert and format the price
        const sarPrice = element.dataset.sarPrice;
        const convertedPrice = convertPrice(sarPrice, currentCurrency);
        element.textContent = formatPrice(convertedPrice, currentCurrency);
    });
    
    // Update cart item prices
    const itemPriceElements = document.querySelectorAll('.item-price');
    itemPriceElements.forEach(element => {
        if (!element.dataset.sarPrice) {
            const originalText = element.textContent;
            const numericPrice = parseFloat(originalText.replace(/[^\d.]/g, ''));
            element.dataset.sarPrice = numericPrice;
        }
        
        const sarPrice = element.dataset.sarPrice;
        const convertedPrice = convertPrice(sarPrice, currentCurrency);
        element.textContent = formatPrice(convertedPrice, currentCurrency);
    });
    
    // Update cart item totals
    const itemTotalElements = document.querySelectorAll('.item-total');
    itemTotalElements.forEach(element => {
        if (!element.dataset.sarPrice) {
            const originalText = element.textContent;
            const numericPrice = parseFloat(originalText.replace(/[^\d.]/g, ''));
            element.dataset.sarPrice = numericPrice;
        }
        
        const sarPrice = element.dataset.sarPrice;
        const convertedPrice = convertPrice(sarPrice, currentCurrency);
        element.textContent = formatPrice(convertedPrice, currentCurrency);
    });
    
    // Update cart subtotal and total
    const subtotalElement = document.querySelector('.cart-subtotal');
    const totalElement = document.querySelector('.cart-total');
    
    if (subtotalElement) {
        if (!subtotalElement.dataset.sarPrice) {
            const originalText = subtotalElement.textContent;
            const numericPrice = parseFloat(originalText.replace(/[^\d.]/g, ''));
            subtotalElement.dataset.sarPrice = numericPrice;
        }
        
        const sarPrice = subtotalElement.dataset.sarPrice;
        const convertedPrice = convertPrice(sarPrice, currentCurrency);
        subtotalElement.textContent = formatPrice(convertedPrice, currentCurrency);
    }
    
    if (totalElement) {
        if (!totalElement.dataset.sarPrice) {
            const originalText = totalElement.textContent;
            const numericPrice = parseFloat(originalText.replace(/[^\d.]/g, ''));
            totalElement.dataset.sarPrice = numericPrice;
        }
        
        const sarPrice = totalElement.dataset.sarPrice;
        const convertedPrice = convertPrice(sarPrice, currentCurrency);
        totalElement.textContent = formatPrice(convertedPrice, currentCurrency);
    }
}

// Function to update prices when adding to cart
function getConvertedPrice(priceInSAR) {
    const convertedPrice = convertPrice(priceInSAR, currentCurrency);
    return {
        value: parseFloat(convertedPrice),
        formatted: formatPrice(convertedPrice, currentCurrency),
        currency: currentCurrency
    };
}

// Get current currency
function getCurrentCurrency() {
    return {
        code: currentCurrency,
        symbol: currencySymbols[currentCurrency]
    };
}
