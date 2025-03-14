const db = require('../config/db');

exports.addToCart = (req, res) => {
  const user_id = req.user.id;
  const { product_id, quantity } = req.body;
  const qty = quantity || 1;


  db.query(
    "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
    [user_id, product_id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      
      if (results.length > 0) {
        
        const newQuantity = results[0].quantity + 1;
        db.query(
          "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?",
          [newQuantity, user_id, product_id],
          (err, updateResult) => {
            if (err) return res.status(500).json(err);
            res.json({
              success: true,
              message: "Product quantity increased",
              newQuantity,
            });
          }
        );
      } else {
      
        db.query(
          "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
          [user_id, product_id, qty],
          (err, insertResult) => {
            if (err) return res.status(500).json(err);
            res.json({
              success: true,
              message: "Product added to cart",
              cart_id: insertResult.insertId,
            });
          }
        );
      }
    }
  );
};

exports.getCart = (req, res) => {
  const user_id = req.user.id;
  db.query(
    "SELECT cart.*, products.name, products.price, products.image_urls FROM cart JOIN products ON cart.product_id = products.id WHERE cart.user_id = ?",
    [user_id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};


exports.clearCart = (req, res) => {
  const user_id = req.user.id;
  db.query("DELETE FROM cart WHERE user_id = ?", [user_id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ success: true, message: "Cart cleared successfully" });
  });
};


exports.updateCartQuantity = (req, res) => {
  const user_id = req.user.id;
  const { product_id, action } = req.body;

  db.query(
    "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
    [user_id, product_id],
    (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length === 0) {
        return res.status(404).json({ message: "Product not found in cart" });
      }

      const currentQty = results[0].quantity;
      let newQuantity;

      if (action === 'increase') {
        newQuantity = currentQty + 1;
      } else if (action === 'decrease') {
        newQuantity = currentQty - 1;
      } else {
        return res
          .status(400)
          .json({ message: "Invalid action. Use 'increase' or 'decrease'" });
      }

      if (newQuantity <= 0) {
        // Remove the item if quantity drops to zero
        db.query(
          "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
          [user_id, product_id],
          (err, deleteResult) => {
            if (err) return res.status(500).json(err);
            res.json({
              success: true,
              message: "Product removed from cart as quantity reached zero",
            });
          }
        );
      } else {
        // Update the quantity
        db.query(
          "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?",
          [newQuantity, user_id, product_id],
          (err, updateResult) => {
            if (err) return res.status(500).json(err);
            res.json({
              success: true,
              message: "Cart updated",
              newQuantity,
            });
          }
        );
      }
    }
  );
};