const { Schema, model } = require('../Connection');

const challengeSchema = new Schema({
  title: { type: String, required: true },         // Challenge ka naam
  description: { type: String, required: true },   // Challenge details
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' }, // Level
  tags: [String],                                 // Keywords

  startDate: { type: Date, default: Date.now },    // Challenge kab start hoga
  endDate: { type: Date },                         // Kab khatam hoga

  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Kisne banaya
  participants: [{ type: Schema.Types.ObjectId, ref: 'team' }], // Kon participate kar raha hai

  
});

module.exports = model('Challenges', challengeSchema);
