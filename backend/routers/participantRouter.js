const express = require('express');
const router = express.Router();
const Participant = require('../models/participantModel');

// ✅ Add new participant
router.post('/add', async (req, res) => {
  try {
    const data = new Participant(req.body);
    const saved = await data.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get all participants
router.get('/getall', async (req, res) => {
  try {
    const participants = await Participant.find()
      .populate('user')
      .populate('team')
      .populate('challenges');
    res.status(200).json(participants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get participants of a specific hackathon
router.get('/challenges/:id', async (req, res) => {
  try {
    const participants = await Participant.find({ hackathon: req.params.id })
      .populate('user')
      .populate('team');
    res.status(200).json(participants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
