const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Hardcoded admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = '1234';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Session middleware
app.use(session({
  secret: 'auravida-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Database file paths
const productsFile = path.join(__dirname, '../data/products.json');
const ordersFile = path.join(__dirname, '../data/orders.json');

// Initialize data files if they don't exist
const initializeDataFiles = () => {
  if (!fs.existsSync(path.join(__dirname, '../data'))) {
    fs.mkdirSync(path.join(__dirname, '../data'), { recursive: true });
  }
  
  if (!fs.existsSync(productsFile)) {
    const sampleProducts = [
      {
        id: 1,
        name: "Organic Face Wash",
        price: 299,
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
        category: "Face Washes",
        description: "Gentle organic face wash for all skin types"
      },
      {
        id: 2,
        name: "Vitamin C Serum",
        price: 599,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400",
        category: "Serums",
        description: "Brightening serum with natural Vitamin C"
      },
      {
        id: 3,
        name: "Organic Shampoo",
        price: 349,
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400",
        category: "Haircare",
        description: "Natural shampoo for healthy hair"
      },
      {
        id: 4,
        name: "Natural Body Lotion",
        price: 449,
        image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=400",
        category: "Bodycare",
        description: "Moisturizing body lotion with organic ingredients"
      },
      {
        id: 5,
        name: "Men's Face Scrub",
        price: 399,
        image: "https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=400",
        category: "Men",
        description: "Exfoliating face scrub for men"
      },
      {
        id: 6,
        name: "Kids Gentle Soap",
        price: 199,
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
        category: "Kids",
        description: "Mild soap suitable for children"
      }
    ];
    fs.writeFileSync(productsFile, JSON.stringify(sampleProducts, null, 2));
  }
  
  if (!fs.existsSync(ordersFile)) {
    fs.writeFileSync(ordersFile, JSON.stringify([], null, 2));
  }
};

// Initialize data files
initializeDataFiles();

// Helper functions to read/write data
const readProducts = () => {
  const data = fs.readFileSync(productsFile);
  return JSON.parse(data);
};

const writeProducts = (products) => {
  fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
};

const readOrders = () => {
  const data = fs.readFileSync(ordersFile);
  return JSON.parse(data);
};

const writeOrders = (orders) => {
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
};

// API Routes

// Get all products
app.get('/api/products', (req, res) => {
  try {
    const products = readProducts();
    const { category } = req.query;
    
    if (category) {
      const filtered = products.filter(p => p.category === category);
      res.json(filtered);
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error reading products' });
  }
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  try {
    const products = readProducts();
    const product = products.find(p => p.id === parseInt(req.params.id));
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error reading product' });
  }
});

// Add new product (Admin)
app.post('/api/products', (req, res) => {
  try {
    const products = readProducts();
    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      ...req.body
    };
    products.push(newProduct);
    writeProducts(products);
    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error adding product' });
  }
});

// Update product (Admin)
app.put('/api/products/:id', (req, res) => {
  try {
    const products = readProducts();
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    
    if (index !== -1) {
      products[index] = { ...products[index], ...req.body };
      writeProducts(products);
      res.json(products[index]);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating product' });
  }
});

// Delete product (Admin)
app.delete('/api/products/:id', (req, res) => {
  try {
    const products = readProducts();
    const index = products.findIndex(p => p.id === parseInt(req.params.id));
    
    if (index !== -1) {
      const deleted = products.splice(index, 1)[0];
      writeProducts(products);
      res.json(deleted);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting product' });
  }
});

// Create order
app.post('/api/orders', (req, res) => {
  try {
    const orders = readOrders();
    const newOrder = {
      id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1,
      ...req.body,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    writeOrders(orders);
    res.json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Error creating order' });
  }
});

// Get all orders (Admin)
app.get('/api/orders', (req, res) => {
  try {
    const orders = readOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error reading orders' });
  }
});

// Update order status (Admin)
app.put('/api/orders/:id', (req, res) => {
  try {
    const orders = readOrders();
    const index = orders.findIndex(o => o.id === parseInt(req.params.id));
    
    if (index !== -1) {
      orders[index] = { ...orders[index], ...req.body };
      writeOrders(orders);
      res.json(orders[index]);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating order' });
  }
});

// Delete order (Admin)
app.delete('/api/orders/:id', (req, res) => {
  try {
    const orders = readOrders();
    const index = orders.findIndex(o => o.id === parseInt(req.params.id));
    
    if (index !== -1) {
      const deleted = orders.splice(index, 1)[0];
      writeOrders(orders);
      res.json(deleted);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting order' });
  }
});

// Admin Authentication Routes

// Login route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.adminLoggedIn = true;
    req.session.adminUsername = username;
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});

// Logout route
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Error logging out' });
    } else {
      res.json({ success: true, message: 'Logout successful' });
    }
  });
});

// Check authentication status
app.get('/api/auth/status', (req, res) => {
  if (req.session.adminLoggedIn) {
    res.json({ authenticated: true, username: req.session.adminUsername });
  } else {
    res.json({ authenticated: false });
  }
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend: http://localhost:${PORT}`);
  console.log(`Admin Dashboard: http://localhost:${PORT}/admin.html`);
});
