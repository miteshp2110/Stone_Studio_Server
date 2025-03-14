const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middlewares/authMiddleware');


router.post('/', verifyToken, cartController.addToCart);


router.get('/', verifyToken, cartController.getCart);

router.delete('/', verifyToken, cartController.clearCart);

router.put('/quantity', verifyToken, cartController.updateCartQuantity);

module.exports = router;
