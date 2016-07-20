/// <reference path="typings/socket.io/socket.io.d.ts" />
var GameServer;
(function (GameServer) {
    var App = (function () {
        function App(app, http, server) {
            var _this = this;
            this.OnConnection = function (socket) {
                console.log('a user connected');
                var _socket = socket;
                if (_this.Players.length < _this.PlayerLimit) {
                    var player = new Player(socket.id);
                    _this.Players.push(player);
                    socket.on('disconnect', function () {
                        var test = socket.user;
                        console.log("player disconnected");
                    });
                    socket.on('playerMoved', _this.PlayerMoved);
                    socket.on('AddClient', function (data) {
                        socket.user = data;
                    });
                }
                else if (_this.Players.length == _this.PlayerLimit) {
                    return;
                }
            };
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
            this.ExpressApp = app;
            this.Http = http;
            this.Server = server;
            this.Players = [];
            this.PlayerLimit = 2;
            //SetRoute
            this.ExpressApp.get('/', function (req, res) {
                var dirname = __dirname.replace("scripts", "");
                res.sendFile(dirname + '/Views/Default/Index.html');
            });
            //SetListener
            this.Http.listen(3000, this.Listener);
            this.Server.on('connection', this.OnConnection);
            var express2 = require('express');
            this.ExpressApp.use(express2.static(__dirname)); //giv adgang til filer i scripts 
        }
        return App;
    }());
    GameServer.App = App;
    var Player = (function () {
        function Player(id) {
            this.Id = id;
        }
        return Player;
    }());
    GameServer.Player = Player;
    GameServer.express = require('express')();
    GameServer.http = require('http').Server(GameServer.express);
    GameServer.io = require('socket.io')(GameServer.http);
    GameServer.Application = new App(GameServer.express, GameServer.http, GameServer.io);
})(GameServer || (GameServer = {}));
