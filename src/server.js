/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const gameRouter = require('./server/gamesRouter');
const userRouter = require('./server/usersRouter');
const activeGameRouter = require('./server/activeGameRouter');
const chatManagement = require('./server/chatRouter');
const imagesRouter = require('./server/imagesRouter');

const PORT = 3000;

app.use(session({secret: 'top secret password', cookie: {maxAge: null}}));
app.use(bodyParser.text());

// run index.html on startup
app.use(express.static(path.resolve(__dirname, "..", "public")));

// use routers
app.use('/users', userRouter);
app.use('/games', gameRouter);
app.use('/activeGame', activeGameRouter);
app.use('/chat', chatManagement);
app.use('/images', imagesRouter);

// run server
app.listen(PORT, console.log('Taki server listening on port ' + PORT));

module.exports = gameRouter;
