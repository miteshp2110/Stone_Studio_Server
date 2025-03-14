const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuthController = require('../controllers/adminAuthController')
const adminCategoryController = require('../controllers/adminCategoryController');
const productController = require('../controllers/productController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      
      cb(null, file.fieldname + '-' + Date.now() + ext);
    }
  });

  const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } 
  });


router.put('/product/:id', verifyToken, requireAdmin,upload.array('images',4), adminController.updateProduct);


router.post('/product', verifyToken, requireAdmin,upload.array('images',4), adminController.addProduct);

router.post('/register', verifyToken, requireAdmin, adminAuthController.registerAdmin);

router.post('/category', verifyToken, requireAdmin, adminCategoryController.addCategory);

router.get('/stats', verifyToken, requireAdmin, adminController.getStats);

router.get('/products', verifyToken, requireAdmin, productController.getAllProducts);

router.post('/reset', verifyToken, requireAdmin, adminController.resetPassword);

module.exports = router;
