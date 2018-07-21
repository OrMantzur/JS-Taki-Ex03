/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

/**
 * all the changes in userList in userManager go through that module
 */

/**
 * list of <sessionId, userName>
 * userName and userName are unique
 */
const users = {};

function getUserName(sessionId) {
    return users[sessionId];
}

/**
 * check if user logged in
 */
function checkUserAuth(req, res, next) {
    if (users[req.session.id] === undefined) {
        res.sendStatus(401);
    } else {
        next();
    }
}

/**
 *  add user if user session and user name not already in system
 */
function addUser(req, res, next) {
    if (users[req.session.id] !== undefined) {
        res.status(403).send("user already logged in");
    } else {
        // validate user name not already in system
        let userNameToAdd = req.body;
        for (let sessionId in users) {
            let userNameInSystem = users[sessionId];
            if (userNameToAdd === userNameInSystem) {
                res.status(403).send("user name already exist");
                return;
            }
        }
        // we got here only when the user is validate
        users[req.session.id] = userNameToAdd;
        // send to next middleware request
        res.addedUserName = userNameToAdd;
        next();
    }
}

function removeUser(req, res, next) {
    if (users[req.session.id] === undefined) {
        res.status(403).send("user doesn't exist");
    } else {
        // send to next middleware request
        res.deletedUserName = users[req.session.id];
        // delete that key and value
        delete users[req.session.id];
        next();
    }
}

module.exports = {users, getUserName, checkUserAuth, addUser, removeUser};
