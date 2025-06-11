// Cart JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkAuthStatus();
    
    // Load cart items
    loadCartItems();
    
    // Handle checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            // Generate a random order ID
            const orderId = Math.floor(Math.random() * 9000000000) + 1000000000;
            
            // Get cart items and total
            const session = JSON.parse(localStorage.getItem('userSession'));
            let cartItems = [];
            let cartKey = 'guestCart';
            
            if (session && session.isLoggedIn) {
                cartKey = `cart_${session.userId}`;
            }
            
            cartItems = JSON.parse(localStorage.getItem(cartKey)) || [];
            
            // Calculate total
            let total = 0;
            cartItems.forEach(item => {
                total += item.price * item.quantity;
            });
            
            // Format total with proper decimal handling
            const formattedTotal = total.toFixed(2).replace('.', ',');
            
            // Prepare WhatsApp message
            const message = `الطلب #${orderId} - الرجاء ارسال فاتورة لدفعها - المبلغ: ${formattedTotal} ريال`;
            
            // WhatsApp phone number (replace with your actual business number)
            const phoneNumber = '971562457488'; // Replace with your WhatsApp business number
            
            // Redirect to WhatsApp
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }
});

// Check authentication status
function checkAuthStatus() {
    const session = JSON.parse(localStorage.getItem('userSession'));
    const userLoggedInElements = document.querySelectorAll('.user-logged-in');
    const userNotLoggedInElements = document.querySelectorAll('.user-not-logged-in');
    
    if (session && session.isLoggedIn) {
        // User is logged in
        userLoggedInElements.forEach(el => el.style.display = 'block');
        userNotLoggedInElements.forEach(el => el.style.display = 'none');
        
        // Set username in header
        const usernameElements = document.querySelectorAll('.username');
        usernameElements.forEach(el => el.textContent = session.fullname);
    } else {
        // User is not logged in
        userLoggedInElements.forEach(el => el.style.display = 'none');
        userNotLoggedInElements.forEach(el => el.style.display = 'block');
    }
    
    // Update cart count
    updateCartCount();
}

// Load cart items
function loadCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartEmptyElement = document.querySelector('.cart-empty');
    const cartContentElement = document.querySelector('.cart-content');
    
    if (!cartItemsContainer) return;
    
    // Clear existing items
    cartItemsContainer.innerHTML = '';
    
    // Get cart items based on login status
    const session = JSON.parse(localStorage.getItem('userSession'));
    let cartItems = [];
    
    if (session && session.isLoggedIn) {
        // Get user's cart
        cartItems = JSON.parse(localStorage.getItem(`cart_${session.userId}`)) || [];
    } else {
        // Get guest cart
        cartItems = JSON.parse(localStorage.getItem('guestCart')) || [];
    }
    
    // Show/hide empty cart message
    if (cartItems.length === 0) {
        cartEmptyElement.style.display = 'block';
        cartContentElement.style.display = 'none';
        return;
    } else {
        cartEmptyElement.style.display = 'none';
        cartContentElement.style.display = 'flex';
    }
    
    // Get the template
    const template = document.getElementById('cart-item-template');
    
    // Calculate totals
    let subtotal = 0;
    
    // Add each item to the cart
    cartItems.forEach(item => {
        const clone = document.importNode(template.content, true);
        
        // Set data attributes
        clone.querySelector('.cart-item').dataset.id = item.id;
        
        // Set item details
        clone.querySelector('.item-image img').src = item.image;
        clone.querySelector('.item-image img').alt = item.name;
        clone.querySelector('.item-name').textContent = item.name;
        clone.querySelector('.item-color span').textContent = item.color || 'أبيض';
        clone.querySelector('.item-size span').textContent = item.size || 'M';
        
        // Store the original price in data attribute for currency conversion
        const priceElement = clone.querySelector('.item-price');
        priceElement.dataset.sarPrice = item.price;
        
        // Format price with proper decimal handling
        const formattedPrice = typeof item.price === 'number' ? item.price.toFixed(2).replace('.', ',') : item.price;
        priceElement.textContent = `${formattedPrice} ريال`;
        clone.querySelector('.item-quantity input').value = item.quantity;
        
        // Calculate and set item total
        const itemTotal = item.price * item.quantity;
        const totalElement = clone.querySelector('.item-total');
        totalElement.dataset.sarPrice = itemTotal;
        
        const formattedTotal = itemTotal.toFixed(2).replace('.', ',');
        totalElement.textContent = `${formattedTotal} ريال`;
        
        // Add to subtotal
        subtotal += itemTotal;
        
        // Add event listeners for quantity buttons
        const decreaseBtn = clone.querySelector('.quantity-btn.decrease');
        const increaseBtn = clone.querySelector('.quantity-btn.increase');
        const quantityInput = clone.querySelector('.item-quantity input');
        const removeBtn = clone.querySelector('.remove-item');
        
        decreaseBtn.addEventListener('click', function() {
            updateItemQuantity(item.id, parseInt(quantityInput.value) - 1);
        });
        
        increaseBtn.addEventListener('click', function() {
            updateItemQuantity(item.id, parseInt(quantityInput.value) + 1);
        });
        
        removeBtn.addEventListener('click', function() {
            removeCartItem(item.id);
        });
        
        // Append to cart items container
        cartItemsContainer.appendChild(clone);
    });
    
    // Update summary
    updateCartSummary(subtotal);
}

// Update item quantity
function updateItemQuantity(itemId, newQuantity) {
    if (newQuantity < 1) return;
    
    // Get cart items based on login status
    const session = JSON.parse(localStorage.getItem('userSession'));
    let cartItems = [];
    let cartKey = 'guestCart';
    
    if (session && session.isLoggedIn) {
        cartKey = `cart_${session.userId}`;
    }
    
    cartItems = JSON.parse(localStorage.getItem(cartKey)) || [];
    
    // Find and update the item
    const itemIndex = cartItems.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        cartItems[itemIndex].quantity = newQuantity;
        
        // Save updated cart
        localStorage.setItem(cartKey, JSON.stringify(cartItems));
        
        // Reload cart items
        loadCartItems();
        
        // Update cart count
        updateCartCount();
    }
}

// Remove item from cart
function removeCartItem(itemId) {
    // Get cart items based on login status
    const session = JSON.parse(localStorage.getItem('userSession'));
    let cartItems = [];
    let cartKey = 'guestCart';
    
    if (session && session.isLoggedIn) {
        cartKey = `cart_${session.userId}`;
    }
    
    cartItems = JSON.parse(localStorage.getItem(cartKey)) || [];
    
    // Filter out the item
    cartItems = cartItems.filter(item => item.id !== itemId);
    
    // Save updated cart
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
    
    // Reload cart items
    loadCartItems();
    
    // Update cart count
    updateCartCount();
}

// Update cart summary
function updateCartSummary(subtotal) {
    const subtotalElement = document.querySelector('.cart-subtotal');
    const totalElement = document.querySelector('.cart-total');
    
    if (subtotalElement && totalElement) {
        // Store original SAR price in data attribute for currency conversion
        subtotalElement.dataset.sarPrice = subtotal;
        totalElement.dataset.sarPrice = subtotal;
        
        // Format prices with proper decimal handling
        const formattedSubtotal = subtotal.toFixed(2).replace('.', ',');
        
        // Update with formatted price and currency symbol
        if (typeof getCurrentCurrency === 'function') {
            const currency = getCurrentCurrency();
            const convertedPrice = convertPrice(subtotal, currency.code);
            const formattedPrice = formatPrice(convertedPrice, currency.code);
            
            subtotalElement.textContent = formattedPrice;
            totalElement.textContent = formattedPrice;
        } else {
            // Fallback to SAR if currency.js is not loaded
            subtotalElement.textContent = `${formattedSubtotal} ريال`;
            totalElement.textContent = `${formattedSubtotal} ريال`;
        }
    }
}

// Update cart count
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const session = JSON.parse(localStorage.getItem('userSession'));
    
    let cartItems = [];
    if (session && session.isLoggedIn) {
        // Get user's cart
        cartItems = JSON.parse(localStorage.getItem(`cart_${session.userId}`)) || [];
    } else {
        // Get guest cart
        cartItems = JSON.parse(localStorage.getItem('guestCart')) || [];
    }
    
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}
