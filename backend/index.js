require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

// Routes
const UserRouter = require('./routers/userrouter');
const HackRouter = require('./routers/hackathonRouter');
const TeamRouter = require('./routers/teamRouter');
const ParticipationRouter = require('./routers/participantRouter');
const IdeaRouter = require('./routers/ideaRouter');

// Environment variables
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));

app.use(express.json());

// Routes
app.use('/user', UserRouter);
app.use('/challenges', HackRouter);
app.use('/teams', TeamRouter);
app.use('/participants', ParticipationRouter);
app.use('/ideas', IdeaRouter);

// Health check
app.get('/', (req, res) => {
    res.send('🚀 API is running successfully');
});

// Server start
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});