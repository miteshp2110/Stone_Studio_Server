const db = require('../config/db');

exports.addCategory = (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  db.query("INSERT INTO categories (name) VALUES (?)", [name], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json({ message: "Category added successfully", categoryId: result.insertId });
  });
};
