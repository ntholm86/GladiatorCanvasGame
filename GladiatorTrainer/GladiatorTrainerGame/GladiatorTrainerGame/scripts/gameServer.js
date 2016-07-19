/// <reference path="typings/socket.io/socket.io.d.ts" />
var GameServer;
(function (GameServer) {
    var App = (function () {
        function App(app, http, server) {
            var _this = this;
            this.OnConnection = function (socket) {
                console.log('a user connected');
                socket.on('disconnect', _this.OnDisconnect);
                socket.on('playerMoved', _this.PlayerMoved);
            };
            this.OnDisconnect = function () {
                console.log("player disconnected");
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
    GameServer.express = require('express')();
    GameServer.http = require('http').Server(GameServer.express);
    GameServer.io = require('socket.io')(GameServer.http);
    GameServer.Application = new App(GameServer.express, GameServer.http, GameServer.io);
})(GameServer || (GameServer = {}));
