/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

/**
 * manage all the user management
 * use {@code userAuth} for authentication all change in {@code users}
 */

const express = require('express');
const imagesRouter = express.Router();
const path = require('path');

imagesRouter.get('/taki-logo-big', (req,res) => {
    res.sendFile(path.resolve(__dirname, "takiImages", "TAKI_logo-big.png"));
});

imagesRouter.get('/taki-logo', (req,res) => {
    res.sendFile(path.resolve(__dirname, "takiImages", "TAKI_logo.png"));
});

module.exports = imagesRouter;
