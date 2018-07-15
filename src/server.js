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
const gameManager = require('./server/logic/gameManager');
const userManager = require('./server/usersManager');

const PORT = 3000;

app.use(session({secret: 'keyboard cat', cookie: {maxAge: null}}));
app.use(bodyParser.text());

// run index.html on startup
app.use(express.static(path.resolve(__dirname, "..", "public")));

app.use('/users', userManager);

// run server
app.listen(PORT, console.log('taki application listening on port ' + PORT));

module.exports = gameManager;
