﻿/// <reference path="typings/socket.io/socket.io.d.ts" />

module GameClient {
    export class App {
        Board: Board;        
        Player: Player;
        TurnHandler: TurnHandler;
        constructor(io: SocketIO.Socket) {
            this.Board = new Board(io, this);
            this.TurnHandler = new GameClient.TurnHandler(io, this);
            this.InitiateFields();             
            this.Start();            
        }

        Start = () => {
            this.Board.DrawBoardFields();
        }

        InitiateFields = () => {
            this.Board.Fields.push();
            this.Board.Fields[0][0].Object = new BoardObject("red", "green", "yellow", true);
            this.Board.Fields[6][7].Object = new BoardObject("purple", "green", "yellow", true);
            this.Board.Fields[9][7].Object = new BoardObject("#cecece", "green", "yellow", true);
            this.Board.Fields[6][5].Object = new BoardObject("#32ba3e", "green", "yellow", true);
            this.Board.Fields[1][7].Object = new BoardObject("#3880e3", "green", "yellow", true);
        }
    }

    export class Field implements GameInterfaces.IField {
        Xpos: number;
        Ypos: number;
        Object: BoardObject;
        FillColor: string;

        constructor(x: number, y: number) {
            this.Xpos = x;
            this.Ypos = y;
            this.FillColor = "#2bb54f";
        }
    }

    export class BoardObject implements GameInterfaces.IBoardObject {
        Color: string;
        SelectedColor: string;
        HoverColor: string;
        InterActive: boolean;

        constructor(color: string, selectedColor: string, hoverColor: string, interactive: boolean) {
            this.Color = color;
            this.InterActive = interactive;
            this.SelectedColor = selectedColor;
            this.HoverColor = hoverColor;
        }

    }


    export class Player {
        Id: string;

        constructor(id: string) {
            this.Id = id;
        }
    }

    export class TurnHandler {
        HasTurn: boolean;
        IO: SocketIO.Socket;
        PlayerId: string;
        App: App;

        constructor(io: SocketIO.Socket, app: App) {
            this.IO = io;
            this.HasTurn = false;
        }
     
        EndTurn = () => {
            this.IO.emit("TurnEnded", this.App.Player.Id);
            this.HasTurn = false;
        }

        //NotifyPlayersGameStarted = () => {
        //    this.IO.emit("GameStarted", this.CurrentPlayer);
        //}

    }

    export class Board {
        HexHeight: number;
        HexRadius: number;
        HexRectangleHeight: number;
        HexRectangleWidth: number;
        HexagonAngle: number; // 30 degrees in radians
        SideLength: number;
        BoardWidth: number;
        BoardHeight: number;
        Context: CanvasRenderingContext2D;
        Canvas: HTMLCanvasElement;       
        Fields: Field[][];
        SelectedField: Field;
        HoveredField: Field;
        FakeField: Field;
        Socket: SocketIO.Socket;
        Players: Player[];
        App: App;

        constructor(io: SocketIO.Socket, app: App) {
            this.App = app;
            this.Socket = <SocketIO.Socket>io;
            this.FakeField = new Field(-1, -1);
            this.SelectedField = this.FakeField;
            this.HoveredField = this.FakeField;
            this.Init();
            this.Fields = [];
            for (var x = 0; x < this.BoardWidth; ++x) {
                this.Fields[x] = [];
                for (var y = 0; y < this.BoardHeight; ++y) {
                    this.Fields[x][y] = new Field(x, y);
                }
            }

            this.Socket.on("PlayerJoined", (dto: GameServer.PlayerJoinDTO) => {
                this.App.Player = dto.Player;
                this.Players = dto.Players;
                console.log("player: " + dto.Player.Id);
                console.log("players");
                $.each(dto.Players, (i, item) => {
                    console.log(item.Id);
                });
                
            });

            this.Socket.on("BoardFullMessage", (message) => {
                $("#serverMessages").html("<h1>Board full</h1>");
            });


            this.Socket.on("BoardUpdate", (fields: GameInterfaces.IField[][]) => {
                if (fields) {
                    this.Fields = fields;
                }
                
                this.DrawBoardFields();
            });

            this.Socket.on("GameStarted", (startingPlayer: GameServer.Player) => {
                if (startingPlayer.Id == this.App.Player.Id) {
                    this.App.TurnHandler.HasTurn = true;
                    $("#serverMessages").html("<h1>Your turn!</h1>");
                } else {
                    $("#serverMessages").html("<h1>The other player is making his move</h1>");
                }
                
            });

            this.Socket.on("TurnPass", (playerId: string) => {
                $("#serverMessages").html("");                
                if (playerId == this.App.Player.Id) {
                    this.App.TurnHandler.HasTurn = true;
                    $("#serverMessages").html("<h1>Your turn!</h1>");
                } else {
                    this.App.TurnHandler.HasTurn = false;
                    $("#serverMessages").html("<h1>The other player is making his move</h1>");
                }
            });
            
        }

        Init = () => {
            this.Canvas = <HTMLCanvasElement>document.getElementById('hexmap');
            this.Canvas.addEventListener('click', this.FieldClickHandler, false);
            this.Canvas.addEventListener('contextmenu', this.RightClickHandler, false);
            this.Canvas.addEventListener('mousemove', this.MouseMove, false);
            this.BoardHeight = 10;
            this.BoardWidth = 10;
            this.HexagonAngle = 0.523598776;
            this.SideLength = 36;

            this.HexHeight = Math.sin(this.HexagonAngle) * this.SideLength;
            this.HexRadius = Math.cos(this.HexagonAngle) * this.SideLength;
            this.HexRectangleHeight = this.SideLength + 2 * this.HexHeight;
            this.HexRectangleWidth = 2 * this.HexRadius;

            if (this.Canvas.getContext) {
                this.Context = this.Canvas.getContext('2d');

                this.Context.fillStyle = "#000000";
                this.Context.strokeStyle = "#CCCCCC";
                this.Context.lineWidth = 1;

            }
        }

        DrawHexagon = (canvasContext: CanvasRenderingContext2D, x: number, y: number, fill: boolean, xpos: number, ypos: number) => {
            var fill = fill || false;
            canvasContext.beginPath();            
            canvasContext.moveTo(x + this.HexRadius, y);
            canvasContext.lineTo(x + this.HexRectangleWidth, y + this.HexHeight);
            canvasContext.lineTo(x + this.HexRectangleWidth, y + this.HexHeight + this.SideLength);
            canvasContext.lineTo(x + this.HexRadius, y + this.HexRectangleHeight);
            canvasContext.lineTo(x, y + this.SideLength + this.HexHeight);
            canvasContext.lineTo(x, y + this.HexHeight);

            canvasContext.closePath();

            if (fill) {
                canvasContext.fill();
            }
            
            canvasContext.stroke();

            canvasContext.fillStyle = "#000000";
            canvasContext.font = "18pt Arial";
            canvasContext.fillText(xpos + "," + ypos, x + this.HexRadius - 15, y + this.HexHeight + 25);

        }

        DrawBoardFields = () => {
            //console.log("SelectedField: ");
            //console.log(this.SelectedField);
            //console.log("HoveredField: ");
            //console.log(this.HoveredField);
            this.Context.clearRect(0, 0, this.Canvas.width, this.Canvas.height);


            for (var x = 0; x < this.BoardWidth; ++x) {
                for (var y = 0; y < this.BoardHeight; ++y) {

                    var screenX,
                        screenY;

                    screenX = x * this.HexRectangleWidth + ((y % 2) * this.HexRadius);
                    screenY = y * (this.HexHeight + this.SideLength);

                    if (x >= 0 && x < this.BoardWidth) {
                        if (y >= 0 && y < this.BoardHeight) {
                            this.Context.fillStyle = "white";
                            this.Context.strokeStyle = "#CCCCCC";
                            this.Context.lineWidth = 1;
                            var field = this.Fields[x][y];
                            var fill = true;
                            if (field.Object) {//Hvis der er et object på feltet
                                this.Context.fillStyle = field.Object.Color;
                                if (field == this.SelectedField) {//hvis feltet er klikket på og valgt
                                    this.Context.fillStyle = field.Object.SelectedColor;
                                }
                                if (field == this.HoveredField) {//hvis hover
                                    this.Context.fillStyle = field.Object.HoverColor;
                                }
                            } else if (this.SelectedField.Xpos != -1 && field == this.HoveredField) {//ellers brug farven fra field når man hover                               
                                this.Context.strokeStyle = field.FillColor;
                                this.Context.lineWidth = 5;
                                fill = false;  
                            } 


                            this.DrawHexagon(this.Context, screenX, screenY, fill, x, y);
                        }
                    }
                   

                }
            }
        }

        Deselect = () => {
            this.SelectedField = this.FakeField;
            this.DrawBoardFields();
        }

        RightClickHandler = (eventInfo: Event) => {
            this.Deselect();
            eventInfo.preventDefault();
            eventInfo.stopImmediatePropagation();
            return false;

        }

        MoveBoardObject = (fieldFrom: Field, fieldTo: Field) => {
            fieldTo.Object = fieldFrom.Object;
            fieldFrom.Object = null;
            this.Socket.emit("playerMoved", this.Fields);
            //this.DrawBoardFields();
            console.log("moved object to " + fieldTo.Xpos + "," + fieldTo.Ypos);

            //ChangeTurn
            this.Socket.emit("endTurn", this.App.Player.Id);
        }


        FieldClickHandler = (eventInfo) => {
            if (!this.App.TurnHandler.HasTurn)
                return;

            var x,
                y,
                hexX,
                hexY,
                screenX,
                screenY;

            x = eventInfo.offsetX || eventInfo.layerX;
            y = eventInfo.offsetY || eventInfo.layerY;
            hexY = Math.floor(y / (this.HexHeight + this.SideLength));
            hexX = Math.floor((x - (hexY % 2) * this.HexRadius) / this.HexRectangleWidth);
            
            var clickedField = this.GetFieldByCoords(hexX, hexY);
           
            if (this.SelectedField.Xpos != -1) {//hvis der er noget der er selected  
                if (clickedField.Object == null) {//hvis det klikkede felt er tomt
                    this.MoveBoardObject(this.SelectedField, clickedField);
                    this.Deselect();
                }                    
            }else if(clickedField.Object){
                this.SelectedField = clickedField;
            }

            this.DrawBoardFields();

        }

        GetFieldByCoords = (x, y) => {
            var field = this.Fields[x][y];
            return field;
        }

        CheckMouseOnBoard = (hexX, hexY) => {
            if (hexX >= 0 && hexX < this.BoardWidth) {
                if (hexY >= 0 && hexY < this.BoardHeight) {
                    return true;
                }
            }
            return false;
        }

        MouseMove = (eventInfo) => {
            if (!this.App.TurnHandler.HasTurn)
                return;

            var x,
                y,
                hexX,
                hexY,
                screenX,
                screenY;

            x = eventInfo.offsetX || eventInfo.layerX;
            y = eventInfo.offsetY || eventInfo.layerY;
            hexY = Math.floor(y / (this.HexHeight + this.SideLength));
            hexX = Math.floor((x - (hexY % 2) * this.HexRadius) / this.HexRectangleWidth);

            if (!this.CheckMouseOnBoard(hexX, hexY)) {
                return false;
            }

            var field = this.Fields[hexX][hexY];

            

            if (this.HoveredField != field) {
                if (field.Object == null) {//hvis det er et felt vi kan rykke til                
                    this.Context.fillStyle = "pink";
                }

                this.HoveredField = field;
                this.DrawBoardFields();
            }
            
        };
    }

}