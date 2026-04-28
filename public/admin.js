// API Base URL
const API_URL = '/api';

// Check authentication on page load
function checkAuthentication() {
  fetch(`${API_URL}/auth/status`)
    .then(response => response.json())
    .then(data => {
      if (!data.authenticated) {
        // Redirect to login page if not authenticated
        window.location.href = 'admin-login.html';
      } else {
        // Show admin username
        const adminUsername = document.getElementById('adminUsername');
        if (adminUsername) {
          adminUsername.textContent = `Welcome, ${data.username}`;
        }
      }
    })
    .catch(error => {
      console.error('Auth check error:', error);
      window.location.href = 'admin-login.html';
    });
}

// Logout function
function logout() {
  fetch(`${API_URL}/logout`, {
    method: 'POST'
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Clear localStorage
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminUsername');
        // Redirect to login page
        window.location.href = 'admin-login.html';
      }
    })
    .catch(error => {
      console.error('Logout error:', error);
      alert('Error logging out');
    });
}

// Initialize Admin Dashboard
document.addEventListener('DOMContentLoaded', function() {
  // Check authentication first
  checkAuthentication();

  // Setup logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  // Initialize dashboard
  setupTabs();
  loadProducts();
  loadOrders();
  setupProductForm();
});

// Tab Navigation
function setupTabs() {
  const tabs = document.querySelectorAll('.admin-tab');
  const tabContents = document.querySelectorAll('.admin-tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');

      // Remove active class from all tabs and contents
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Add active class to clicked tab and corresponding content
      this.classList.add('active');
      document.getElementById(`${tabName}Tab`).classList.add('active');
    });
  });
}

// Load Products Table
function loadProducts() {
  const tbody = document.getElementById('productsTableBody');
  if (!tbody) return;

  fetch(`${API_URL}/products`)
    .then(response => response.json())
    .then(products => {
      tbody.innerHTML = products.map(product => `
        <tr>
          <td>${product.id}</td>
          <td><img src="${product.image}" alt="${product.name}"></td>
          <td>${product.name}</td>
          <td>${product.category}</td>
          <td>Rs ${product.price.toLocaleString()}</td>
          <td>
            <button class="action-btn edit-btn" onclick="editProduct(${product.id})">Edit</button>
            <button class="action-btn delete-btn" onclick="deleteProduct(${product.id})">Delete</button>
          </td>
        </tr>
      `).join('');
    })
    .catch(error => {
      console.error('Error loading products:', error);
      tbody.innerHTML = '<tr><td colspan="6">Error loading products</td></tr>';
    });
}

// Load Orders Table
function loadOrders() {
  const tbody = document.getElementById('ordersTableBody');
  if (!tbody) return;

  fetch(`${API_URL}/orders`)
    .then(response => response.json())
    .then(orders => {
      tbody.innerHTML = orders.map(order => `
        <tr>
          <td>${order.id}</td>
          <td>${order.customer.name}</td>
          <td>${order.customer.phone}</td>
          <td>Rs ${order.total.toLocaleString()}</td>
          <td><span class="status-badge status-${order.status}">${order.status}</span></td>
          <td>${new Date(order.createdAt).toLocaleDateString()}</td>
          <td>
            <button class="action-btn view-btn" onclick="viewOrder(${order.id})">View</button>
            <button class="action-btn delete-btn" onclick="deleteOrder(${order.id})">Delete</button>
          </td>
        </tr>
      `).join('');
    })
    .catch(error => {
      console.error('Error loading orders:', error);
      tbody.innerHTML = '<tr><td colspan="7">Error loading orders</td></tr>';
    });
}

// Setup Product Form
function setupProductForm() {
  const addProductBtn = document.getElementById('addProductBtn');
  const cancelProductBtn = document.getElementById('cancelProductBtn');
  const productForm = document.getElementById('productForm');
  const addProductForm = document.getElementById('addProductForm');

  if (addProductBtn) {
    addProductBtn.addEventListener('click', function() {
      productForm.style.display = 'block';
      document.getElementById('formTitle').textContent = 'Add New Product';
      addProductForm.reset();
      document.getElementById('productId').value = '';
    });
  }

  if (cancelProductBtn) {
    cancelProductBtn.addEventListener('click', function() {
      productForm.style.display = 'none';
    });
  }

  if (addProductForm) {
    addProductForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const productId = document.getElementById('productId').value;
      const productData = {
        name: document.getElementById('productName').value,
        price: parseInt(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        image: document.getElementById('productImage').value,
        description: document.getElementById('productDescription').value
      };

      const url = productId ? `${API_URL}/products/${productId}` : `${API_URL}/products`;
      const method = productId ? 'PUT' : 'POST';

      fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      })
      .then(response => response.json())
      .then(() => {
        productForm.style.display = 'none';
        loadProducts();
        alert(productId ? 'Product updated successfully!' : 'Product added successfully!');
      })
      .catch(error => {
        console.error('Error saving product:', error);
        alert('Error saving product. Please try again.');
      });
    });
  }
}

// Edit Product
function editProduct(productId) {
  fetch(`${API_URL}/products/${productId}`)
    .then(response => response.json())
    .then(product => {
      document.getElementById('productForm').style.display = 'block';
      document.getElementById('formTitle').textContent = 'Edit Product';
      document.getElementById('productId').value = product.id;
      document.getElementById('productName').value = product.name;
      document.getElementById('productPrice').value = product.price;
      document.getElementById('productCategory').value = product.category;
      document.getElementById('productImage').value = product.image;
      document.getElementById('productDescription').value = product.description;
    })
    .catch(error => {
      console.error('Error loading product:', error);
      alert('Error loading product details');
    });
}

// Delete Product
function deleteProduct(productId) {
  if (confirm('Are you sure you want to delete this product?')) {
    fetch(`${API_URL}/products/${productId}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(() => {
      loadProducts();
      alert('Product deleted successfully!');
    })
    .catch(error => {
      console.error('Error deleting product:', error);
      alert('Error deleting product. Please try again.');
    });
  }
}

// View Order Details
function viewOrder(orderId) {
  fetch(`${API_URL}/orders`)
    .then(response => response.json())
    .then(orders => {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      const modalContent = document.getElementById('orderModalContent');
      modalContent.innerHTML = `
        <div style="text-align: left;">
          <div style="margin-bottom: 20px;">
            <h3 style="color: var(--primary-navy); margin-bottom: 10px;">Order Information</h3>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Status:</strong> <span class="status-badge status-${order.status}">${order.status}</span></p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="color: var(--primary-navy); margin-bottom: 10px;">Customer Details</h3>
            <p><strong>Name:</strong> ${order.customer.name}</p>
            <p><strong>Phone:</strong> ${order.customer.phone}</p>
            <p><strong>Address:</strong> ${order.customer.address}</p>
            <p><strong>City:</strong> ${order.customer.city}</p>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="color: var(--primary-navy); margin-bottom: 10px;">Order Items</h3>
            ${order.items.map(item => `
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border-color);">
                <span>${item.name} × ${item.quantity}</span>
                <span>Rs ${(item.price * item.quantity).toLocaleString()}</span>
              </div>
            `).join('')}
          </div>

          <div>
            <h3 style="color: var(--primary-navy); margin-bottom: 10px;">Order Summary</h3>
            <div style="display: flex; justify-content: space-between; padding: 10px 0;">
              <span>Subtotal:</span>
              <span>Rs ${order.subtotal.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px 0;">
              <span>Shipping:</span>
              <span>Rs ${order.shipping.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px 0; font-weight: 700; font-size: 1.2rem; color: var(--primary-gold);">
              <span>Total:</span>
              <span>Rs ${order.total.toLocaleString()}</span>
            </div>
          </div>

          <div style="margin-top: 30px;">
            <h3 style="color: var(--primary-navy); margin-bottom: 10px;">Update Status</h3>
            <select id="orderStatus" style="padding: 10px; border: 1px solid var(--border-color); border-radius: 5px; width: 100%;">
              <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
              <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
              <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
              <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
            </select>
            <button onclick="updateOrderStatus(${order.id})" class="btn btn-primary" style="margin-top: 15px; width: 100%;">Update Status</button>
          </div>
        </div>
      `;

      document.getElementById('orderModal').style.display = 'flex';
    })
    .catch(error => {
      console.error('Error loading order:', error);
      alert('Error loading order details');
    });
}

// Close Order Modal
document.addEventListener('DOMContentLoaded', function() {
  const closeOrderModal = document.getElementById('closeOrderModal');
  const orderModal = document.getElementById('orderModal');

  if (closeOrderModal) {
    closeOrderModal.addEventListener('click', function() {
      orderModal.style.display = 'none';
    });
  }

  // Close modal when clicking outside
  if (orderModal) {
    orderModal.addEventListener('click', function(e) {
      if (e.target === orderModal) {
        orderModal.style.display = 'none';
      }
    });
  }
});

// Update Order Status
function updateOrderStatus(orderId) {
  const status = document.getElementById('orderStatus').value;

  fetch(`${API_URL}/orders/${orderId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status })
  })
  .then(response => response.json())
  .then(() => {
    document.getElementById('orderModal').style.display = 'none';
    loadOrders();
    alert('Order status updated successfully!');
  })
  .catch(error => {
    console.error('Error updating order:', error);
    alert('Error updating order status. Please try again.');
  });
}

// Delete Order
function deleteOrder(orderId) {
  if (confirm('Are you sure you want to delete this order?')) {
    fetch(`${API_URL}/orders/${orderId}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(() => {
      loadOrders();
      alert('Order deleted successfully!');
    })
    .catch(error => {
      console.error('Error deleting order:', error);
      alert('Error deleting order. Please try again.');
    });
  }
}
