// API Base URL
const API_URL = '/api';

// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();
  setupNavigation();
});

// Navigation - Side Drawer
function setupNavigation() {
  const hamburger = document.getElementById('hamburger');
  const sideDrawer = document.getElementById('sideDrawer');
  const closeDrawer = document.getElementById('closeDrawer');
  const overlay = document.getElementById('overlay');

  if (hamburger) {
    hamburger.addEventListener('click', function() {
      sideDrawer.classList.add('open');
      overlay.classList.add('active');
    });
  }

  if (closeDrawer) {
    closeDrawer.addEventListener('click', function() {
      closeDrawerMenu();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', function() {
      closeDrawerMenu();
    });
  }

  function closeDrawerMenu() {
    sideDrawer.classList.remove('open');
    overlay.classList.remove('active');
  }
}

// Update Cart Count
function updateCartCount() {
  const cartCount = document.getElementById('cartCount');
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
  }
}

// Save Cart to LocalStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

// Add to Cart
function addToCart(productId) {
  fetch(`${API_URL}/products/${productId}`)
    .then(response => response.json())
    .then(product => {
      const existingItem = cart.find(item => item.id === productId);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        });
      }
      
      saveCart();
      
      // Show success message
      const addedMessage = document.getElementById('addedMessage');
      if (addedMessage) {
        addedMessage.style.display = 'block';
        setTimeout(() => {
          addedMessage.style.display = 'none';
        }, 3000);
      }
    })
    .catch(error => {
      console.error('Error adding to cart:', error);
      alert('Error adding product to cart');
    });
}

// Remove from Cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  loadCart();
}

// Update Quantity
function updateQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCart();
      loadCart();
    }
  }
}

// Calculate Cart Total
function calculateTotal() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;
  
  return { subtotal, shipping, total };
}

// Format Price
function formatPrice(price) {
  return 'Rs ' + price.toLocaleString();
}

// Load Featured Products (Home Page)
function loadFeaturedProducts() {
  const container = document.getElementById('featuredProducts');
  if (!container) return;

  fetch(`${API_URL}/products`)
    .then(response => response.json())
    .then(products => {
      // Show first 6 products as featured
      const featured = products.slice(0, 6);
      container.innerHTML = featured.map(product => `
        <div class="product-card" onclick="window.location.href='product-details.html?id=${product.id}'">
          <img src="${product.image}" alt="${product.name}" class="product-image">
          <div class="product-info">
            <span class="product-category">${product.category}</span>
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">${formatPrice(product.price)}</div>
          </div>
        </div>
      `).join('');
    })
    .catch(error => {
      console.error('Error loading products:', error);
      container.innerHTML = '<p class="loading">Error loading products</p>';
    });
}

// Load Products Page
function loadProducts() {
  const container = document.getElementById('productsGrid');
  const loading = document.getElementById('loadingMessage');
  const noProducts = document.getElementById('noProducts');
  const pageTitle = document.getElementById('pageTitle');
  const pageSubtitle = document.getElementById('pageSubtitle');

  if (!container) return;

  // Get category from URL
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');

  let apiUrl = `${API_URL}/products`;
  if (category) {
    apiUrl += `?category=${encodeURIComponent(category)}`;
  }

  if (pageTitle) {
    pageTitle.textContent = category || 'All Products';
  }

  if (pageSubtitle) {
    pageSubtitle.textContent = category 
      ? `Browse our ${category} collection` 
      : 'Discover our complete range of organic products';
  }

  fetch(apiUrl)
    .then(response => response.json())
    .then(products => {
      loading.style.display = 'none';

      if (products.length === 0) {
        noProducts.style.display = 'block';
        return;
      }

      container.innerHTML = products.map(product => `
        <div class="product-card" onclick="window.location.href='product-details.html?id=${product.id}'">
          <img src="${product.image}" alt="${product.name}" class="product-image">
          <div class="product-info">
            <span class="product-category">${product.category}</span>
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">${formatPrice(product.price)}</div>
          </div>
        </div>
      `).join('');
    })
    .catch(error => {
      console.error('Error loading products:', error);
      loading.style.display = 'none';
      container.innerHTML = '<p class="loading">Error loading products</p>';
    });
}

// Load Product Details
function loadProductDetails() {
  const loading = document.getElementById('loadingMessage');
  const productDetails = document.getElementById('productDetails');
  const noProduct = document.getElementById('noProduct');

  if (!productDetails) return;

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    loading.style.display = 'none';
    noProduct.style.display = 'block';
    return;
  }

  fetch(`${API_URL}/products/${productId}`)
    .then(response => response.json())
    .then(product => {
      loading.style.display = 'none';

      if (!product) {
        noProduct.style.display = 'block';
        return;
      }

      productDetails.style.display = 'block';

      document.getElementById('productImage').src = product.image;
      document.getElementById('productImage').alt = product.name;
      document.getElementById('productCategory').textContent = product.category;
      document.getElementById('productName').textContent = product.name;
      document.getElementById('productDescription').textContent = product.description;
      document.getElementById('productPrice').textContent = formatPrice(product.price);

      // Add to cart button
      const addToCartBtn = document.getElementById('addToCartBtn');
      addToCartBtn.addEventListener('click', function() {
        addToCart(product.id);
      });
    })
    .catch(error => {
      console.error('Error loading product:', error);
      loading.style.display = 'none';
      noProduct.style.display = 'block';
    });
}

// Load Cart
function loadCart() {
  const cartItems = document.getElementById('cartItems');
  const emptyCart = document.getElementById('emptyCart');
  const checkoutBtn = document.getElementById('checkoutBtn');

  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = '';
    emptyCart.style.display = 'block';
    if (checkoutBtn) checkoutBtn.style.display = 'none';
    return;
  }

  emptyCart.style.display = 'none';
  if (checkoutBtn) checkoutBtn.style.display = 'inline-block';

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <h3 class="cart-item-name">${item.name}</h3>
        <div class="cart-item-price">${formatPrice(item.price)}</div>
        <div class="cart-item-quantity">
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    </div>
  `).join('');

  // Update totals
  const { subtotal, shipping, total } = calculateTotal();
  document.getElementById('subtotal').textContent = formatPrice(subtotal);
  document.getElementById('shipping').textContent = formatPrice(shipping);
  document.getElementById('total').textContent = formatPrice(total);
}

// Load Checkout
function loadCheckout() {
  const orderItems = document.getElementById('orderItems');
  const emptyCartMessage = document.getElementById('emptyCartMessage');
  const checkoutForm = document.getElementById('checkoutForm');

  if (!orderItems) return;

  if (cart.length === 0) {
    emptyCartMessage.style.display = 'block';
    if (checkoutForm) checkoutForm.style.display = 'none';
    return;
  }

  emptyCartMessage.style.display = 'none';
  if (checkoutForm) checkoutForm.style.display = 'block';

  orderItems.innerHTML = cart.map(item => `
    <div class="order-item">
      <span>${item.name} × ${item.quantity}</span>
      <span>${formatPrice(item.price * item.quantity)}</span>
    </div>
  `).join('');

  // Update totals
  const { subtotal, shipping, total } = calculateTotal();
  document.getElementById('subtotal').textContent = formatPrice(subtotal);
  document.getElementById('shipping').textContent = formatPrice(shipping);
  document.getElementById('total').textContent = formatPrice(total);

  // Handle form submission
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const orderData = {
        customer: {
          name: document.getElementById('name').value,
          phone: document.getElementById('phone').value,
          address: document.getElementById('address').value,
          city: document.getElementById('city').value
        },
        items: cart,
        subtotal: calculateTotal().subtotal,
        shipping: calculateTotal().shipping,
        total: calculateTotal().total,
        paymentMethod: 'COD'
      };

      fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })
      .then(response => response.json())
      .then(order => {
        // Clear cart
        cart = [];
        saveCart();
        
        // Show success modal
        document.getElementById('orderId').textContent = order.id;
        document.getElementById('successModal').style.display = 'flex';
      })
      .catch(error => {
        console.error('Error placing order:', error);
        alert('Error placing order. Please try again.');
      });
    });
  }
}
