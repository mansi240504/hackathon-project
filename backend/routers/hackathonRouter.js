const Model =require('../models/hackathonModel');
const express =require('express');
const router = express.Router();
const User =require('../models/user_model');
const verifyToken = require('../middleware/verifyToken');
const bcrypt = require('bcrypt');

router.post('/add',verifyToken, (req, res) => {
     if (req.user.role !== 'company') {
        return res.status(403).json({ message: "Access denied" });
    }
    console.log(req.body);
    new Model(req.body).save()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {

            res.status(500).json(err);
        });
});
// Get all challenges
router.get('/getall', async (req, res) => {
  try {
    const challenges = await Model.find(); // Fetch all data from DB
    res.status(200).json(challenges);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching challenges', error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await Model.findById(req.params.id);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/delete/:id', verifyToken, async (req, res) => {
   if (req.user.role !== 'company' && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
    }
  try {
    const { password } = req.body;

    // ✅ Correct user fetch
    const user = await User.findById(req.user._id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    // 🔐 Password verify
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    // 🧑‍💼 Role check
    if (user.role !== 'admin' && user.role !== 'company') {
      return res.status(403).json({ message: "Access denied" });
    }

    await Model.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Challenge deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


module.exports=router;