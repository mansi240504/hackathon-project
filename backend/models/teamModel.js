const { Schema, model } = require('../Connection');

const teamSchema = new Schema({
  name: { type: String, required: true, trim: true },  // Team ka naam
  members: [{ type: Schema.Types.ObjectId, ref: 'users' }], // Team members

  leader: { type: Schema.Types.ObjectId, ref: 'users', required: true }, // Team leader (optional: first member)

  description: { type: String, default: '' }, // Team ka short intro
  ispublic: { type: Boolean, default: false },

  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  }, // Admin approval ke liye

  createdAt: { type: Date, default: Date.now }
});

module.exports = model('team', teamSchema);
