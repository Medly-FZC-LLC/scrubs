document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkAuthStatus();

    // Make logo clickable to go to homepage
    const logoElements = document.querySelectorAll('.logo');
    logoElements.forEach(logo => {
        logo.style.cursor = 'pointer'; // Change cursor to pointer to indicate it's clickable
    });

    // Shopping Cart Functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.dataset.category + '_' + Date.now(); // Create unique ID
            const productName = productCard.querySelector('h4').textContent;
            const productPriceText = productCard.querySelector('.price').textContent;
            // Fix: Handle comma as decimal separator properly and ensure correct decimal placement
            // Extract the numeric part and properly handle the comma as decimal separator
            const priceMatch = productPriceText.match(/([0-9]+),([0-9]+)/);
            let productPrice;
            
            if (priceMatch) {
                // If we have a match with comma format (e.g., "349,00")
                productPrice = parseFloat(`${priceMatch[1]}.${priceMatch[2]}`);
            } else {
                // Fallback to the previous method
                productPrice = parseFloat(productPriceText.replace(/[^0-9.]/g, ''));
            }
            const productImg = productCard.querySelector('img').getAttribute('src');
            
            const product = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImg,
                quantity: 1,
                color: 'أبيض', // Default color
                size: 'M' // Default size
            };
            
            addToCart(product);
            
            // Show notification
            showNotification('تمت إضافة المنتج إلى السلة');
        });
    });
    
    // Handle logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Form submission
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send the form data to a server
            // For now, we'll just show a success message
            showNotification('تم إرسال رسالتك بنجاح');
            
            // Reset form
            this.reset();
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });
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

// Add product to cart
function addToCart(product) {
    const session = JSON.parse(localStorage.getItem('userSession'));
    let cartItems = [];
    let cartKey = 'guestCart';
    
    if (session && session.isLoggedIn) {
        cartKey = `cart_${session.userId}`;
    }
    
    cartItems = JSON.parse(localStorage.getItem(cartKey)) || [];
    
    // Store original price in SAR and current converted price
    if (typeof getCurrentCurrency === 'function') {
        const currentCurrency = getCurrentCurrency().code;
        // Store original SAR price and the current currency
        product.originalPrice = product.price;
        product.currency = currentCurrency;
    }
    
    // Check if product already exists in cart
    const existingProductIndex = cartItems.findIndex(item => 
        item.name === product.name && 
        item.color === product.color && 
        item.size === product.size
    );
    
    if (existingProductIndex !== -1) {
        // Increase quantity if product already exists
        cartItems[existingProductIndex].quantity += 1;
    } else {
        // Add new product to cart
        cartItems.push(product);
    }
    
    // Save to localStorage
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
    
    // Update cart count
    updateCartCount();
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

// Logout user
function logout() {
    localStorage.removeItem('userSession');
    window.location.href = 'index.html';
}

// Notification function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style the notification
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#2ecc71';
    notification.style.color = 'white';
    notification.style.padding = '12px 25px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
    notification.style.zIndex = '1000';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'all 0.3s ease';
    
    document.body.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Hide and remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
