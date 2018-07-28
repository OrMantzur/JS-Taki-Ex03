/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */
// ================================= Game =================================

const GameType = {
    BASIC: "basic",
    ADVANCED: "advanced"
};


const GameState = {
    WAITING_FOR_PLAYERS: "waiting for players to join",
    GAME_STARTED: "gameStarted",
    GAME_ENDED: "gameEnded - Player won",
    OPEN_TAKI: "openTaki",
    OPEN_PLUS: "openPlus",
    CHANGE_COLOR: "changeColor",
    SUPER_TAKI: "superTaki",
    CLOSE_TAKI: "closeTaki",
    CLOSE_PLUS: "closePlus",
    OPEN_PLUS_2: "openPlus2",
    CLOSE_PLUS_2: "closePlus2"
};

const Direction = {
    RIGHT: 1,
    LEFT: -1
};
// ================================= Cards =================================
const NumberCard = ["1", "3", "4", "5", "6", "7", "8", "9"];

const SpecialCard = {
    TAKI: "taki",
    STOP: "stop",
    CHANGE_COLOR: "change color",
    PLUS: "plus",
    PLUS_2: "+2",
    SUPER_TAKI: "super taki",
    CHANGE_DIRECTION: "change direction"
};

module.exports = {GameType, GameState, Direction, NumberCard, SpecialCard };