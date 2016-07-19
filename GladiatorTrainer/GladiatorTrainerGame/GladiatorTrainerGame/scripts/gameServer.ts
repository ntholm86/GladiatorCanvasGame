/// <reference path="typings/socket.io/socket.io.d.ts" />

module GameServer {    
   
    export class App {
        ExpressApp: any;
        Http: any;
        Server: SocketIO.Server;

        constructor(app: any, http: any, server: SocketIO.Server) {
            this.ExpressApp = app;
            this.Http = http;
            this.Server = server;

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

            socket.on('disconnect', this.OnDisconnect);
            socket.on('playerMoved', this.PlayerMoved);
        }
        
        OnDisconnect = () => {
            console.log("player disconnected");
        }

        PlayerMoved = (data: GameInterfaces.IField[][]) => {
            //send the fields back to both players
            this.Server.emit('BoardUpdate', data);
        }

        Listener = () => {
            console.log('listening on *:3000');
        }
    }
  
    export var express = require('express')();
      
    export var http = require('http').Server(express);
    export var io = require('socket.io')(http);
    export var Application = new App(express, http, io)
 
   
}