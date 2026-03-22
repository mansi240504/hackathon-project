require('dotenv').config();

const mongoose = require('mongoose');

const url = process.env.MONGO_URI;

mongoose.connect(url)
.then(() => {
    console.log("✅ MongoDB connected");
})
.catch((err) => {
    console.log("❌ DB Error:", err);
});

module.exports = mongoose;