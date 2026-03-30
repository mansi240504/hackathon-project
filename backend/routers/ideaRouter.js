const express = require('express');
const router = express.Router();
const Idea = require('../models/ideaModel');

// ✅ Add Idea with teamId
router.post('/add', async (req, res) => {
    try {
        const { title, description, techStack, teamId } = req.body;

        const newIdea = new Idea({
            title,
            description,
            techStack,
            teamId
        });

        const result = await newIdea.save();
        res.json(result);

    } catch (err) {
        res.status(500).json(err);
    }
});

// ✅ Get ideas of a specific team
router.get('/team/:teamId', async (req, res) => {
    try {
        const result = await Idea.find({ teamId: req.params.teamId });
        res.json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});

// ✅ Get ideas with team details (populate 🔥)
router.get('/getall', async (req, res) => {
    try {
        const result = await Idea.find().populate('teamId');
        res.json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;