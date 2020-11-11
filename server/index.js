
require('dotenv').config()
const express = require('express');
const app = express();
const session = require('express-session');
const massive = require('massive');
const authCtrl = require('./controllers/authController');
const treasureCtrl = require('./controllers/treasureController');
const auth = require('./middleware/authMiddleware');


const { CONNECTION_STRING, SESSION_SECRET} = process.env;


massive(
    {
        connectionString: CONNECTION_STRING,
        ssl: {rejectUnauthorized: false}

    }

).then((db) => {
    app.set('db',db);
    console.log('connecting to DB')
});

app.use(express.json())

app.use(
    session({
      resave: true,
      saveUninitialized: false,
      secret: SESSION_SECRET
    })
  );

const PORT = 4000;

app.post('/auth/register', authCtrl.register);

app.post('/auth/login', authCtrl.login);

app.get('/auth/logout', authCtrl.logout);

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)

app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure);

app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);

app.get('/api/treasure/all', auth.usersOnly, treasureCtrl.getAllTreasure);

app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)

app.listen(PORT, ()=>{
    console.log(`server listening on port: ${PORT}`)
})