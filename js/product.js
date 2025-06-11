document.addEventListener('DOMContentLoaded', function() {
    // Make logo clickable to go to homepage
    const logoElements = document.querySelectorAll('.logo');
    logoElements.forEach(logo => {
        logo.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
        logo.style.cursor = 'pointer'; // Change cursor to pointer to indicate it's clickable
    });

    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    // Product data
    const products = {
        // Male products
        'm1': {
            name: 'سكراب سكربز أكتيف رجالي',
            price: '249 ريال',
            image: 'images/male/سكراب سكربز أكتيف رجالي.jpg',
            description: 'سكراب سكربز أكتيف رجالي مصنوع من أفضل الخامات ليوفر لك الراحة والمرونة أثناء العمل. يتميز بتصميم عصري وأنيق مناسب للاستخدام اليومي في المجال الطبي.',
            features: [
                'قماش مرن عالي الجودة',
                'مقاوم للتجاعيد والبقع',
                'جيوب متعددة عملية',
                'سهل التنظيف والعناية',
                'متوفر بعدة مقاسات'
            ],
            category: 'male'
        },
        'm2': {
            name: 'سكراب سكربز الفاخر رجالي',
            price: '349 ريال',
            image: 'images/male/سكراب سكربز الفاخر رجالي.jpg',
            description: 'سكراب سكربز الفاخر رجالي من أفخم المنتجات لدينا، مصنوع من أجود أنواع الأقمشة لتوفير أقصى درجات الراحة والأناقة. مثالي للأطباء والعاملين في المجال الصحي الذين يبحثون عن التميز.',
            features: [
                'قماش فاخر عالي الجودة',
                'تصميم أنيق وعصري',
                'مقاوم للتجاعيد والبقع',
                'جيوب متعددة واسعة',
                'خياطة متينة تدوم طويلاً'
            ],
            category: 'male'
        },
        'm3': {
            name: 'سكراب سكربز سبورت رجالي',
            price: '299 ريال',
            image: 'images/male/سكراب سكربز سبورت رجالي.jpg',
            description: 'سكراب سكربز سبورت رجالي مصمم خصيصاً للنشاط والحركة، يوفر مرونة عالية وراحة فائقة أثناء العمل. مثالي للعاملين في المجال الطبي الذين يتطلب عملهم الحركة المستمرة.',
            features: [
                'قماش مرن يسمح بحرية الحركة',
                'خفيف الوزن ومريح',
                'تهوية ممتازة',
                'مقاوم للعرق والبقع',
                'جيوب عملية متعددة'
            ],
            category: 'male'
        },
        'm4': {
            name: 'سكراب سكربز كلاسيك رجالي',
            price: '279 ريال',
            image: 'images/male/سكراب سكربز كلاسيك رجالي.jpg',
            description: 'سكراب سكربز كلاسيك رجالي بتصميم تقليدي أنيق يناسب جميع الأذواق. مصنوع من قماش عالي الجودة يوفر الراحة والمتانة لاستخدام يومي طويل الأمد.',
            features: [
                'تصميم كلاسيكي أنيق',
                'قماش متين عالي الجودة',
                'مريح للاستخدام اليومي',
                'سهل التنظيف والعناية',
                'متوفر بألوان متعددة'
            ],
            category: 'male'
        },
        
        // Female products
        'f1': {
            name: 'سكراب سكربز أكتيف نسائي',
            price: '249 ريال',
            image: 'images/female/سكراب سكربز أكتيف نسائي.jpg',
            description: 'سكراب سكربز أكتيف نسائي مصمم خصيصاً لتوفير الراحة والمرونة للعاملات في المجال الطبي. يتميز بقصة مريحة وعصرية تناسب جميع أنواع الجسم.',
            features: [
                'قماش مرن عالي الجودة',
                'تصميم يناسب الجسم الأنثوي',
                'مقاوم للتجاعيد والبقع',
                'جيوب متعددة عملية',
                'متوفر بعدة مقاسات وألوان'
            ],
            category: 'female'
        },
        'f2': {
            name: 'سكراب سكربز الفاخر نسائي',
            price: '349 ريال',
            image: 'images/female/سكراب سكربز الفاخر نسائي.jpg',
            description: 'سكراب سكربز الفاخر نسائي من أرقى المنتجات لدينا، مصنوع من أفخم أنواع الأقمشة لتوفير أقصى درجات الراحة والأناقة. مثالي للطبيبات والعاملات في المجال الصحي اللواتي يبحثن عن التميز.',
            features: [
                'قماش فاخر ناعم الملمس',
                'تصميم أنيق يبرز جمال القوام',
                'مقاوم للتجاعيد والبقع',
                'جيوب متعددة واسعة',
                'خياطة متينة تدوم طويلاً'
            ],
            category: 'female'
        },
        'f3': {
            name: 'سكراب سكربز مودرن نسائي',
            price: '299 ريال',
            image: 'images/female/سكراب سكربز مودرن نسائي.jpg',
            description: 'سكراب سكربز مودرن نسائي بتصميم عصري وأنيق يجمع بين الراحة والأناقة. مصنوع من قماش عالي الجودة يوفر مظهراً احترافياً مع الحفاظ على الراحة طوال اليوم.',
            features: [
                'تصميم عصري أنيق',
                'قماش ناعم ومريح',
                'قصة تناسب جميع أنواع الجسم',
                'مقاوم للبقع والتجاعيد',
                'متوفر بألوان متعددة'
            ],
            category: 'female'
        },
        'f4': {
            name: 'سكراب كويني نسائي',
            price: '329 ريال',
            image: 'images/female/سكراب كويني نسائي.jpg',
            description: 'سكراب كويني نسائي بتصميم فريد وفاخر يمنحك إطلالة ملكية في مكان العمل. مصنوع من أجود أنواع الأقمشة لتوفير الراحة والأناقة معاً.',
            features: [
                'تصميم فريد وفاخر',
                'قماش ناعم عالي الجودة',
                'تفاصيل أنيقة تميزك عن الآخرين',
                'مقاوم للبقع والتجاعيد',
                'خياطة متينة تدوم طويلاً'
            ],
            category: 'female'
        }
    };
    
    // Load product details
    function loadProductDetails() {
        if (productId && products[productId]) {
            const product = products[productId];
            
            // Update page title
            document.title = product.name + ' - سكربز';
            
            // Update product details
            document.getElementById('product-name').textContent = product.name;
            document.getElementById('product-title').textContent = product.name;
            document.getElementById('product-price').textContent = product.price;
            document.getElementById('product-description').textContent = product.description;
            document.getElementById('main-product-image').src = product.image;
            document.getElementById('main-product-image').alt = product.name;
            
            // Update WhatsApp inquiry link
            const whatsappLink = document.querySelector('.whatsapp-inquiry');
            if (whatsappLink) {
                whatsappLink.href = `https://api.whatsapp.com/send/?phone=971562457488&text=أرغب في الاستفسار عن المنتج: ${product.name}&type=phone_number&app_absent=0`;
            }
            
            // Update features list
            const featuresList = document.getElementById('product-features');
            featuresList.innerHTML = '';
            product.features.forEach(feature => {
                const li = document.createElement('li');
                li.textContent = feature;
                featuresList.appendChild(li);
            });
            
            // Load related products
            loadRelatedProducts(product.category, productId);
        } else {
            // Redirect to home page if product not found
            window.location.href = 'index.html';
        }
    }
    
    // Load related products
    function loadRelatedProducts(category, currentProductId) {
        const relatedProductsContainer = document.getElementById('related-products-container');
        relatedProductsContainer.innerHTML = '';
        
        // Get products of the same category
        const relatedProducts = Object.entries(products)
            .filter(([id, product]) => product.category === category && id !== currentProductId)
            .slice(0, 4); // Limit to 4 related products
        
        relatedProducts.forEach(([id, product]) => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.setAttribute('data-category', product.category);
            
            productCard.innerHTML = `
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-overlay">
                        <a href="product.html?id=${id}" class="view-btn">عرض التفاصيل</a>
                    </div>
                </div>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="price">${product.price}</p>
                    <button class="add-to-cart">إضافة للسلة</button>
                </div>
            `;
            
            relatedProductsContainer.appendChild(productCard);
        });
        
        // Add event listeners to the new add to cart buttons
        const addToCartButtons = relatedProductsContainer.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('h4').textContent;
                const productPrice = productCard.querySelector('.price').textContent;
                const productImg = productCard.querySelector('img').getAttribute('src');
                
                const product = {
                    id: Date.now(), // Unique ID based on timestamp
                    name: productName,
                    price: productPrice,
                    image: productImg
                };
                
                let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                cartItems.push(product);
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                
                // Update cart count
                const cartCount = document.querySelector('.cart-count');
                cartCount.textContent = cartItems.length;
                
                // Show notification
                showNotification('تمت إضافة المنتج إلى السلة');
            });
        });
    }
    
    // Size selection
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
        });
    });
    
    // Quantity selector
    const quantityInput = document.getElementById('quantity-input');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    
    minusBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });
    
    plusBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        if (value < 10) {
            quantityInput.value = value + 1;
        }
    });
    
    // Add to cart from product page
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn && productId && products[productId]) {
        addToCartBtn.addEventListener('click', function() {
            const product = products[productId];
            const quantity = parseInt(quantityInput.value);
            const selectedSize = document.querySelector('.size-btn.active')?.textContent || 'M';
            
            const cartItem = {
                id: Date.now(), // Unique ID based on timestamp
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity,
                size: selectedSize
            };
            
            let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            cartItems.push(cartItem);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            
            // Update cart count
            const cartCount = document.querySelector('.cart-count');
            cartCount.textContent = cartItems.length;
            
            // Show notification
            showNotification('تمت إضافة المنتج إلى السلة');
        });
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
    
    // Initialize cart count
    const cartCount = document.querySelector('.cart-count');
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartCount.textContent = cartItems.length;
    
    // Load product details when page loads
    loadProductDetails();
});
