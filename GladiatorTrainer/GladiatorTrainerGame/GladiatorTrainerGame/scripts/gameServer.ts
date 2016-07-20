/// <reference path="typings/socket.io/socket.io.d.ts" />

module GameServer {    
   
    export class App {
        ExpressApp: any;
        Http: any;
        Server: SocketIO.Server;
        Players: Player[];
        PlayerLimit: number;

        constructor(app: any, http: any, server: SocketIO.Server) {
            this.ExpressApp = app;
            this.Http = http;
            this.Server = server;
            this.Players = [];
            this.PlayerLimit = 2;

            //SetRoute
            this.ExpressApp.get('/', (req, res) => {
                var dirname = __dirname.replace("scripts", "");
                res.sendFile(dirname + '/Views/Default/Index.html');
            });

            //SetListener
            this.Http.listen(3000, this.Listener);
            this.Server.on('connection', this.OnConnection);

            var express2 = require('express');
            this.ExpressApp.use(express2.static(__dirname));//giv adgang til filer i scripts 
            
        }

        OnConnection = (socket) => {
            console.log('a user connected');
            var _socket = socket;
            if (this.Players.length < this.PlayerLimit) {
                 var player = new Player(socket.id);
                this.Players.push(player);
                socket.on('disconnect', () => {
                    var test = socket.user;

                    console.log("player disconnected");
                });
                socket.on('playerMoved', this.PlayerMoved);
                socket.on('addclient', (data) => {
                    socket.user = data;
                });
            }
            else if (this.Players.length == this.PlayerLimit) {
                return;
            }

           
        }

       
        
        

        private RemovePlayer = (id: string) => {
            var playerToDisconnect = this.Players.filter(p => p.Id == id)[0];
            var index = this.Players.indexOf(playerToDisconnect);
            this.Players.splice(index, 1);
        }

        PlayerMoved = (data: GameInterfaces.IField[][]) => {
            //send the fields back to both players
            this.Server.emit('BoardUpdate', data);
        }

        Listener = () => {
            console.log('listening on *:3000');
        }
    }

    export class Player {
        Id: string;

        constructor(id: string) {
            this.Id = id;
        }
    }
  
    export var express = require('express')();
      
    export var http = require('http').Server(express);
    export var io = require('socket.io')(http);
    export var Application = new App(express, http, io)
 
   
}