/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

const express = require('express');
const path = require('path');
const imagesRouter = express.Router();

imagesRouter.get('/taki-logo-big', (req,res) => {
    res.sendFile(path.resolve(__dirname, "takiImages", "TAKI_logo-big.png"));
});

imagesRouter.get('/taki-logo', (req,res) => {
    res.sendFile(path.resolve(__dirname, "takiImages", "TAKI_logo.png"));
});

module.exports = imagesRouter;
