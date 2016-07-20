/// <reference path="typings/socket.io/socket.io.d.ts" />
var GameServer;
(function (GameServer) {
    var Application = (function () {
        function Application(app, server, io) {
            var _this = this;
            this.RemovePlayer = function (id) {
                var playerToDisconnect = _this.Players.filter(function (p) { return p.Id == id; })[0];
                var index = _this.Players.indexOf(playerToDisconnect);
                _this.Players.splice(index, 1);
            };
            this.PlayerMoved = function (data) {
                //send the fields back to both players
                _this.Server.emit('BoardUpdate', data);
            };
            this.Listener = function () {
                console.log('listening on *:3000');
            };
            this.App = app;
            this.IO = io;
            this.Server = server;
            this.Players = [];
            this.PlayerLimit = 2;
            //SetRoute
            this.App.get('/', function (req, res) {
                var dirname = __dirname.replace("scripts", "");
                res.sendFile(dirname + '/Views/Default/Index.html');
            });
            //SetListener
            this.Server.listen(3000, this.Listener);
            this.IO.on('connection', function (socket) {
                if (_this.Players.filter(function (p) { return p.Id == socket.id; })[0] == undefined) {
                    var player = new Player(socket.id.substring(2, socket.id.length));
                    _this.Players.push(player);
                    var dto = new PlayerJoinDTO(player, _this.Players);
                    socket.emit("PlayerJoined", dto);
                }
                console.log('a user connected');
                var _socket = socket;
                if (_this.Players.length < _this.PlayerLimit) {
                    socket.on('disconnect', function () {
                        var playerToRemove = _this.Players.filter(function (p) { return p.Id == socket.client.id; })[0];
                        _this.Players.splice(_this.Players.indexOf(playerToRemove), 1);
                        socket;
                        console.log("player disconnected");
                    });
                    socket.on('playerMoved', _this.PlayerMoved);
                    socket.on('addclient', function (data) {
                        socket.client = data;
                        var player = new Player(socket.id);
                        _this.Players.push(player);
                    });
                }
                else if (_this.Players.length == _this.PlayerLimit) {
                    return;
                }
            });
            ;
            var express2 = require('express');
            this.App.use(express2.static(__dirname)); //giv adgang til filer i scripts 
        }
        return Application;
    }());
    GameServer.Application = Application;
    var Player = (function () {
        function Player(id) {
            this.Id = id;
        }
        return Player;
    }());
    GameServer.Player = Player;
    var PlayerJoinDTO = (function () {
        function PlayerJoinDTO(player, players) {
            this.Player = player;
            this.Players = players;
        }
        return PlayerJoinDTO;
    }());
    GameServer.PlayerJoinDTO = PlayerJoinDTO;
    GameServer.app = require('express')();
    GameServer.server = require('http').Server(GameServer.app);
    GameServer.io = require('socket.io')(GameServer.server);
    new Application(GameServer.app, GameServer.server, GameServer.io);
})(GameServer || (GameServer = {}));
