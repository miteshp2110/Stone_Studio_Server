const db = require('../config/db');
exports.getProfile = (req,res)=>{
    const {id} = req.user;
    db.query("SELECT name,email,created_at FROM users where id = ?",[id],(err,results)=>{
        if(err){return res.status(500).json(err)}

        res.json(results[0])
    })
}