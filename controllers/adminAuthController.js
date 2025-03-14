
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerAdmin = (req, res) => {
    // Only an existing admin can register a new admin.
    // (Ensure your route is protected with verifyToken & requireAdmin)
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    
    // Check if a user with the given email already exists
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length > 0)
        return res.status(400).json({ message: 'User already exists.' });
      
      // Hash the password before storing it
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json(err);
        
        const adminData = {
          email,
          password: hash,
          name: name || 'Admin User',
          role: 'admin',
          google_id: null  // Admins using email/password do not use Google OAuth
        };
        
        db.query("INSERT INTO users SET ?", adminData, (err, result) => {
          if (err) return res.status(500).json(err);
          res.json({ message: 'Admin registered successfully', adminId: result.insertId });
        });
      });
    });
  };

  exports.adminLogin = (req, res) => {
    // console.log(req.body)
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    
    db.query(
      "SELECT * FROM users WHERE email = ? AND role = 'admin' AND password IS NOT NULL",
      [email],
      (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0)
          return res.status(401).json({ message: 'Invalid credentials.' });
        
        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) return res.status(500).json(err);
          if (!isMatch)
            return res.status(401).json({ message: 'Invalid credentials.' });
          
          
          const payload = { id: user.id, role: user.role };
          const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
          res.json({ token });
        });
      }
    );
  };