const express = require('express');
const Model = require('../models/user_model');
const router = express.Router();
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.post('/add', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Model.create({
      name,
      email,
      password: hashedPassword, // 🔐 HASHED
      role
    });

    

    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//getall
router.get('/getall', (req, res) => {
    Model.find()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err);
        });
});

// authenticate
router.post('/authenticate', async(req, res) => {
    try {
        const { email, password } = req.body;
         // user find by email
          const user = await Model.findOne({ email });  
          if (!user) { return res.status(404).json({ message: "User not found" });
            }
            // password verify
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
              return res.status(400).json({ message: "Invalid credentials" });
              

            }
            // token generate
            const token = jwt.sign(
              { _id: user._id, email: user.email, role: user.role },
              process.env.JWT_SECRET,
              { expiresIn: '1h' }
            );
            // response with token and role 
            res.status(200).json({ 
                token,
                user :{
                 role: user.role, 
                 _id: user._id,
                 name: user.name,
                 email: user.email}
                });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

module.exports = router;