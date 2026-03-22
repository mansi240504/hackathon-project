const express = require('express');
const Model = require('../models/teamModel');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const user_model = require('../models/user_model');
const teamModel = require('../models/teamModel');

//add team jab user login tabhi team create hogi

router.post('/add', verifyToken, async (req, res) => {
    try {
        const { name, members, description } = req.body;
        const newTeam = new Model({
            name,
            members: members || [],
            description,
            leader: req.user._id, // First user as leader
        });
        const savedTeam = await newTeam.save();
        res.status(200).json(savedTeam);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error creating team', error: err });

    }
});

//getall teams of a user
router.get('/getbyuser', verifyToken, (req, res) => {
    Model.find({ leader: req.user._id }).populate('members')
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/getall', (req, res) => {
    Model.find()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err);
        });
});

// PUT /teams/add-member/:teamId
router.put('/add-member/:teamId', verifyToken, async (req, res) => {
  try {
    const { email } = req.body;
    // find user by email
    const foundUser = await user_model.findOne({ email });
    if (!foundUser) return res.status(404).json({ message: "User not found" });

    // prevent leader or someone from adding themselves
    if (String(foundUser._id) === String(req.user._id)) {
      return res.status(400).json({ message: "You cannot add yourself to the team" });
    }

    // Update team: add user id to members (avoid duplicates)
    const updatedTeam = await teamModel.findByIdAndUpdate(
      req.params.teamId,
      { $addToSet: { members: foundUser._id } },
      { new: true }
    ).populate('members', 'name email'); // populate only name & email

    res.status(200).json(updatedTeam);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// REMOVE MEMBER
router.put('/remove-member/:teamId', verifyToken, async (req, res) => {
    try {
        const { memberId } = req.body;

        const updatedTeam = await teamModel.findByIdAndUpdate(
            req.params.teamId,
            { $pull: { members: memberId } },
            { new: true }
        ).populate("members");

        res.status(200).json(updatedTeam);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error', error: err });
    }
});
// DELETE TEAM (only leader can delete)
router.delete('/delete/:teamId', verifyToken, async (req, res) => {
    try {
        const team = await teamModel.findById(req.params.teamId);

        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        // only leader can delete
        if (String(team.leader) !== String(req.user._id)) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await team.deleteOne();
        res.status(200).json({ message: "Team deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// GET eligible teams for participation
router.get('/eligible', verifyToken, async (req, res) => {
    try {
        const teams = await teamModel.find({
            members: { $ne: req.user._id }, // user not in team
            $expr: { $lt: [{ $size: "$members" }, 5] } // members < 5
        }).populate("leader", "name email");

        res.status(200).json(teams);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// JOIN TEAM (for participation)
router.put('/join/:teamId', verifyToken, async (req, res) => {
    try {
        const team = await teamModel.findById(req.params.teamId);

        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }

        // max 5 members allowed
        if (team.members.length >= 5) {
            return res.status(400).json({ message: "Team is full" });
        }

        // prevent duplicate join
        if (team.members.includes(req.user._id)) {
            return res.status(400).json({ message: "Already a member" });
        }

        team.members.push(req.user._id);
        await team.save();

        res.status(200).json({
            message: "Joined team successfully",
            team
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/open-teams', verifyToken, async (req, res) => {
  try {
    const teams = await teamModel
      .find({ members: { $size: { $lt: 5 } } })
      .populate('members', 'email');

    res.status(200).json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




module.exports = router;