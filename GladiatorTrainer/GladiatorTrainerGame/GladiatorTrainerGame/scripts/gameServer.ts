/// <reference path="typings/socket.io/socket.io.d.ts" />

module GameServer {    
   
    export class Application {
        App: any;
        IO: any;
        Server: any;
        Players: Player[];
        PlayerLimit: number;
        TurnHandler: TurnHandler;

        constructor(app: any, server: any, io: any) {
            this.App = app;
            this.IO = io;
            this.Server = server;
            this.Players = [];
            this.PlayerLimit = 2;

            //SetRoute
            this.App.get('/', (req, res) => {
                var dirname = __dirname.replace("scripts", "");
                res.sendFile(dirname + '/Views/Default/Index.html');
            });

            //SetListener
            this.Server.listen(3000, this.Listener);
            this.IO.on('connection', (socket: SocketIO.Socket) => {
                if (this.Players.length < this.PlayerLimit) {
                    console.log('a user connected');

                    //Hvis player med id fra socket ikke er i vores liste
                    if (this.Players.filter(p => p.Id == socket.id)[0] == undefined) {
                        var player = new Player(socket.id.substring(2, socket.id.length));
                        this.Players.push(player);
                        var dto = new PlayerJoinDTO(player, this.Players);
                        socket.emit("PlayerJoined", dto);
                    }

                    //Hvis boarded er fyldt med spillere
                    if (this.Players.length == this.PlayerLimit) {
                        this.TurnHandler = new TurnHandler(this.Players, this.IO);
                        this.TurnHandler.NotifyPlayersGameStarted();
                    }
                                        
                    socket.on('disconnect', () => {
                        var playerToRemove = this.Players.filter(p => p.Id == socket.client.id)[0];
                        this.Players.splice(this.Players.indexOf(playerToRemove), 1);                        
                        console.log("player disconnected");
                    });

                    socket.on('playerMoved', this.PlayerMoved);

                    socket.on('addclient', (data) => {
                        socket.client = data;
                        var player = new Player(socket.id);
                        this.Players.push(player);
                    });

                    socket.on("TurnEnded", (playerid: string) => {
                        var test = "";
                    });
                } else {
                    socket.emit("BoardFullMessage", "");      
                    socket.disconnect(true);;        
                }
            });;

            
            this.App.use(require('express').static(__dirname));//giv adgang til filer i scripts 
            
        }
        
        
        private RemovePlayer = (id: string) => {
            var playerToDisconnect = this.Players.filter(p => p.Id == id)[0];
            var index = this.Players.indexOf(playerToDisconnect);
            this.Players.splice(index, 1);
        }

        PlayerMoved = (data: GameInterfaces.IField[][]) => {
            //send the fields back to both players
            this.IO.emit('BoardUpdate', data);
        }

        Listener = () => {
            console.log('listening on *:3000');
        }
    }

    export class TurnHandler {
        CurrentPlayer: Player;
        Players: Player[];
        IO: SocketIO.Server;

        constructor(players: Player[], io: SocketIO.Server) {
            this.IO = io;
            this.CurrentPlayer = players[0];
            this.Players = players;
        }

        NotifyPlayersGameStarted = () => {
            this.IO.emit("GameStarted", this.CurrentPlayer);
        }

    }

    export class Player {
        Id: string;

        constructor(id: string) {
            this.Id = id;
        }
    }

    export class PlayerJoinDTO {
        Player: Player;
        Players: Player[];

        constructor(player: Player, players: Player[]) {
            this.Player = player;
            this.Players = players;
        }
    }

    export var app = require('express')();      
    export var server = require('http').Server(app);
    export var io = require('socket.io')(server);
    new Application(app, server, io)
 
   
}