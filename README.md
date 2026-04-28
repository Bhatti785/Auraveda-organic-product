# Auravida Organic Products

A lightweight, full-stack e-commerce website for organic skincare products with a clean, modern design and admin dashboard.

## Features

### Frontend
- **Responsive Design**: Mobile-first approach with smooth animations
- **Natural Color Scheme**: Soft colors (white, green, beige) for organic feel
- **Navigation**: Hamburger menu with left sliding drawer
- **Pages**: Home, Products, Product Details, Cart, Checkout, About, Contact
- **Shopping Cart**: LocalStorage-based cart management
- **Cash on Delivery**: Simple COD checkout system

### Backend
- **Node.js with Express.js**: Lightweight and fast
- **RESTful API**: Complete CRUD operations for products and orders
- **JSON Database**: Simple file-based storage (easy to migrate to SQLite)

### Admin Dashboard
- **Product Management**: Add, edit, and delete products
- **Order Management**: View orders and update status
- **Clean UI**: Simple and intuitive interface

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: JSON files (can be upgraded to SQLite)
- **Styling**: Custom CSS with responsive design

## Project Structure

```
auravida-organic-products/
├── public/                 # Frontend files
│   ├── index.html         # Home page
│   ├── products.html      # Products listing
│   ├── product-details.html # Product details
│   ├── cart.html          # Shopping cart
│   ├── checkout.html      # Checkout page
│   ├── about.html         # About page
│   ├── contact.html       # Contact page
│   ├── admin.html         # Admin dashboard
│   ├── styles.css         # All styles
│   ├── script.js          # Frontend JavaScript
│   └── admin.js           # Admin JavaScript
├── server/
│   └── index.js           # Express server & API routes
├── data/                  # Database files (auto-created)
│   ├── products.json      # Products data
│   └── orders.json        # Orders data
├── package.json           # Dependencies
└── README.md             # This file
```

## Installation

1. **Clone or download the project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open in browser**
   - Frontend: `http://localhost:3000`
   - Admin Dashboard: `http://localhost:3000/admin.html`

## Usage

### Shopping Flow
1. Browse products on the home page or products page
2. Click on a product to view details
3. Add products to cart
4. Review cart and proceed to checkout
5. Fill in shipping information (Name, Phone, Address, City)
6. Place order (Cash on Delivery only)
7. Receive order confirmation

### Admin Dashboard
1. Access admin dashboard at `/admin.html`
2. **Products Tab**:
   - Click "Add New Product" to create products
   - Click "Edit" to modify existing products
   - Click "Delete" to remove products
3. **Orders Tab**:
   - View all customer orders
   - Click "View" to see order details
   - Update order status (Pending → Processing → Shipped → Delivered)
   - Click "Delete" to remove orders

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `GET /api/orders` - Get all orders (admin)
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status (admin)
- `DELETE /api/orders/:id` - Delete order (admin)

## Product Categories

- Clearance Sale
- New Arrivals
- Face Washes
- Serums
- Haircare
- Makeup
- Bodycare
- Men
- Skincare
- Kids
- Soaps
- Gifting

## Deployment

### Local Development
```bash
npm install
npm start
```

### Railway (Backend + Frontend)
1. Create a new project on Railway
2. Connect your GitHub repository
3. Railway will automatically detect Node.js
4. Set environment variable `PORT` (Railway does this automatically)
5. Deploy!

### Vercel (Frontend Only)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Note: You'll need a separate backend deployment for API calls

### Shared Hosting / VPS
1. Upload all files to your server
2. Install Node.js on your server
3. Run `npm install`
4. Start the server: `npm start`
5. Use PM2 to keep the server running:
   ```bash
   npm install -g pm2
   pm2 start server/index.js --name auravida
   pm2 save
   pm2 startup
   ```

### Using a Reverse Proxy (Nginx)
If using Nginx, configure like this:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Customization

### Change Colors
Edit `public/styles.css` and modify the CSS variables:
```css
:root {
  --primary-green: #4a7c59;
  --light-green: #7cb342;
  --beige: #f5f0e6;
  /* ... other colors */
}
```

### Add More Products
1. Access admin dashboard at `/admin.html`
2. Click "Add New Product"
3. Fill in product details
4. Save

### Modify Sample Data
Edit `server/index.js` and modify the `sampleProducts` array in the `initializeDataFiles` function.

### Add Authentication
For production, consider adding:
- JWT authentication for admin
- User registration and login
- Session management

## Environment Variables

- `PORT`: Server port (default: 3000)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lightweight vanilla JavaScript (no frameworks)
- Optimized images (use compressed images)
- Minimal dependencies
- Fast page loads

## Security Considerations

For production deployment, consider:
1. Adding HTTPS (SSL certificate)
2. Implementing admin authentication
3. Adding rate limiting
4. Input validation and sanitization
5. CORS configuration
6. Environment variables for sensitive data

## Troubleshooting

### Port already in use
Change the port in `package.json` or set the `PORT` environment variable:
```bash
PORT=4000 npm start
```

### Products not loading
Check that the `data/products.json` file exists. The server creates it automatically on first run.

### Cart not persisting
Ensure LocalStorage is enabled in your browser.

## Support

For issues or questions:
- Check the code comments in the files
- Review the API endpoints section
- Ensure all dependencies are installed

## License

ISC

## Credits

Created with ❤️ for organic skincare enthusiasts.

---

**Note**: This is a lightweight, beginner-friendly e-commerce solution. For production use, consider adding authentication, payment gateways, and a proper database system.
