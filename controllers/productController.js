const db = require('../config/db');

exports.getProducts = (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  db.query(
    "SELECT * FROM products WHERE status = 'active' LIMIT ? OFFSET ?",
    [parseInt(limit), parseInt(offset)],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
};

exports.getAllProducts = (req, res) => {
  const { page = 1, limit = 10 ,id} = req.query;

  if(id){
    db.query(
      "SELECT * FROM products where id = ?",
      [parseInt(id)],
      (err, results) => {
        if (err) return res.status(500).json(err);
        return res.json(results);
      }
    );
  }
  else{
  const offset = (page - 1) * limit;
  db.query(
    "SELECT * FROM products LIMIT ? OFFSET ?",
    [parseInt(limit), parseInt(offset)],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
}
};

exports.searchProducts = (req, res) => {
  const { name, category,page = 1, limit = 10,id } = req.query;

  if(id){
    db.query(
      "SELECT * FROM products where id = ?",
      [parseInt(id)],
      (err, results) => {
        if (err) return res.status(500).json(err);
        return res.json(results);
      }
    );
  }
  else{
  const offset = (page - 1) * limit;
  let query = "SELECT * FROM products WHERE status = 'active'";
  let params = [];
  if (name) {
    query += " AND name LIKE ?";
    params.push(`%${name}%`);
  }
  if (category) {
    query += " AND category_id = ?";
    params.push(category);
  }
  query += " LIMIT ? OFFSET ?";
  params.push(parseInt(limit), parseInt(offset));
  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};
}
