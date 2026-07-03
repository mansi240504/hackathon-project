const { Schema, model } = require('../connection');

const mySchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String, 
        enum: ['admin', 'company', 'participant', 'user'], 
        default: 'participant'
    },
    profilePicture: { type: String, default: "" },
    collegeOrCompany: { type: String, default: "" },
    skills: { type: [String], default: [] },
    bio: { type: String, default: "" },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    portfolio: { type: String, default: "" },
    mobile: { type: String, default: "" },
    location: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('users', mySchema);