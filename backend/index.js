const express = require('express');
const mongoose = require('mongoose');
const app = express();
const UserRouter = require('./routers/userrouter');
const HackRouter = require('./routers/hackathonRouter');
const TeamRouter = require('./routers/teamRouter');
const ParticipationRouter = require('./routers/participantRouter');


const cors = require('cors');
const port = 4000;  // port kuch bhi de skte hai but kuch port jyada use kiye jaate hai

//middleware
app.use(cors({
    origin: ['http://localhost:3000']
}));
app.use(express.json());
app.use("/user", UserRouter);
app.use("/challenges", HackRouter);
app.use("/teams", TeamRouter);
app.use("/participants", ParticipationRouter);

//endpoint 
app.get('/', (req, res) => {
    res.send("response from express")
});

app.get('/add', (req, res) => {
    res.send("response from add")
});
app.get('/getall', (req, res) => {
    res.send("response from getall")
});
app.get('/delete', (req, res) => {
    res.send("response from  delete")
});
//starting the server 
app.listen(port, () => {
    console.log('server started ');
});