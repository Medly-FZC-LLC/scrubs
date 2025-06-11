// Authentication JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkAuthStatus();
    
    // Toggle password visibility
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordField = this.previousElementSibling;
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });
    
    // Handle signup form submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const termsAccepted = document.getElementById('terms').checked;
            
            // Validate form data
            if (!fullname || !email || !phone || !password || !confirmPassword) {
                alert('يرجى ملء جميع الحقول المطلوبة');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('كلمة المرور وتأكيد كلمة المرور غير متطابقين');
                return;
            }
            
            if (!termsAccepted) {
                alert('يرجى الموافقة على الشروط والأحكام');
                return;
            }
            
            // Create user object
            const user = {
                fullname,
                email,
                phone,
                password
            };
            
            // Store user in localStorage
            registerUser(user);
            
            // Redirect to login page
            alert('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
            window.location.href = 'login.html';
        });
    }
    
    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember')?.checked;
            
            // Validate form data
            if (!email || !password) {
                alert('يرجى إدخال البريد الإلكتروني وكلمة المرور');
                return;
            }
            
            // Authenticate user
            if (authenticateUser(email, password)) {
                // Set session
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const user = users.find(u => u.email === email);
                
                if (user) {
                    const session = {
                        userId: user.id,
                        fullname: user.fullname,
                        email: user.email,
                        isLoggedIn: true,
                        remember: remember
                    };
                    
                    localStorage.setItem('userSession', JSON.stringify(session));
                    
                    // Redirect to home page
                    window.location.href = 'index.html';
                }
            } else {
                alert('البريد الإلكتروني أو كلمة المرور غير صحيحة');
            }
        });
    }
    
    // Handle logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
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
        
        // Update cart count
        updateCartCount();
    } else {
        // User is not logged in
        userLoggedInElements.forEach(el => el.style.display = 'none');
        userNotLoggedInElements.forEach(el => el.style.display = 'block');
        
        // Update cart count
        updateCartCount();
    }
}

// Register a new user
function registerUser(user) {
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email already exists
    if (users.some(u => u.email === user.email)) {
        alert('البريد الإلكتروني مستخدم بالفعل');
        return false;
    }
    
    // Add new user with ID
    const newUser = {
        id: generateUserId(),
        ...user,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    // Save to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    return true;
}

// Authenticate user
function authenticateUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.some(user => user.email === email && user.password === password);
}

// Logout user
function logout() {
    localStorage.removeItem('userSession');
    window.location.href = 'index.html';
}

// Generate unique user ID
function generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
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
