/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

/** TODO delete
 * npm install
 * npm run build-watch
 * npm install --save express
 * npm install express-session
 * npm install body-parser
 */

const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const gameRouter = require('./server/gamesRouter');
const userRouter = require('./server/usersRouter');

const PORT = 3000;

app.use(session({secret: 'top secret password', cookie: {maxAge: null}}));
app.use(bodyParser.text());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// run index.html on startup
app.use(express.static(path.resolve(__dirname, "..", "public")));

app.use('/users', userRouter);
app.use('/games', gameRouter);

// run server
app.listen(PORT, console.log('Taki server listening on port ' + PORT));

module.exports = gameRouter;
