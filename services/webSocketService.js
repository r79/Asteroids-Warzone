var io = require('socket.io')();
var Game = require('./game.js');

io.on('connect', function (socket) {
    var gameInstance = new Game(function (updatedObjects) {
        socket.emit('update', updatedObjects);
    });
});

module.exports = io;

