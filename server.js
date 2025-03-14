require('dotenv').config();
const express = require('express');
const passport = require('./config/passport'); 
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const adminAuthRoutes = require('./routes/adminAuth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/auth/admin', adminAuthRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/admin', adminRoutes);
app.use('/token', require('./routes/verifyToken'));
app.use('/profile', require('./routes/profile'));
app.use("/uploads", express.static('uploads'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
