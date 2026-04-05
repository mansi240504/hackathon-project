const { Schema, model } = require('../connection');

const participantSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'users' },   // Individual user (optional)
  team: { type: Schema.Types.ObjectId, ref: 'team' },    // Team reference (agar team-based participation hai)
  hackathon: { type: Schema.Types.ObjectId, ref: 'hackathon' }, // Kis hackathon me participate kiya

  registrationDate: { type: Date, default: Date.now },  // Kab join kiya
  status: { 
    type: String, 
    enum: ['Registered', 'Submitted', 'Evaluated', 'Winner'], 
    default: 'Registered' 
  },

  submissionLink: { type: String, default: '' }, // GitHub
  score: { type: Number, default: 0 },          
  feedback: { type: String, default: '' }         
});

module.exports = model('participant', participantSchema);
