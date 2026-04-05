const { Schema, model } = require('../connection');

const ideaSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    techStack: {
        type: String,
        required: true
    },
    teamId: {
        type: Schema.Types.ObjectId, // ✅ FIX HERE
        ref: 'team', // ⚠️ same naam use karo jo team model me hai
        required: true
    },
    deadline: {
        type: Date
    }
}, { timestamps: true });

module.exports = model('ideas', ideaSchema);