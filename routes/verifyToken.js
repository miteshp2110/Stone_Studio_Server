const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
router.get('/', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) return res.status(401).json({ message: 'Failed to authenticate token.' });
      
      res.status(200).json({message:"Token valid"})
    });
}  );

module.exports = router;