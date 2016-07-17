module Game {

    export class App {
        Board: Board;

        constructor() {
            this.Board = new Board();
            this.InitiateFields();
            this.Simulation();
        }

        Simulation = () => {
            this.Board.DrawFields();
        }

        InitiateFields = () => {
            this.Board.Fields.push();
            this.Board.Fields[0][0].Objects.push(new BoardObject("#000000"));
            this.Board.Fields[6][7].Objects.push(new BoardObject("#000000"));
            this.Board.Fields[9][7].Objects.push(new BoardObject("#cecece"));
            this.Board.Fields[6][5].Objects.push(new BoardObject("#32ba3e"));
            this.Board.Fields[1][7].Objects.push(new BoardObject("#3880e3"));
        }
    }

    export class Field {
        xpos: number;
        ypos: number;
        Objects: BoardObject[];

        constructor(x: number, y: number) {
            this.xpos = x;
            this.ypos = y;
            this.Objects = new Array<BoardObject>();
        }
    }

    export class BoardObject {
        color: string;

        constructor(color: string) {
            this.color = color;
        }

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
        ObjectsOnBoard: BoardObject[];
        Fields: Field[][];

        constructor() {
            this.Init();
            this.Fields = [];
            for (var x = 0; x < this.BoardWidth; ++x) {
                this.Fields[x] = [];
                for (var y = 0; y < this.BoardHeight; ++y) {
                    this.Fields[x][y] = new Field(x, y);
                }
            }
            console.log(this.Fields);
        }

        Init = () => {
            this.Canvas = <HTMLCanvasElement>document.getElementById('hexmap');
            //this.Canvas.addEventListener('click', this.FieldMarkerClickHandler, false);
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

                this.DrawBoard(this.Context, this.BoardWidth, this.BoardHeight);
            }
        }

        DrawBoard = (canvasContext: CanvasRenderingContext2D, width: number, height: number) => {
            var i,
                j;

            for (i = 0; i < width; ++i) {
                for (j = 0; j < height; ++j) {
                    this.DrawHexagon(
                        this.Context,
                        i * this.HexRectangleWidth + ((j % 2) * this.HexRadius),
                        j * (this.SideLength + this.HexHeight),
                        false,
                        i,
                        j
                    );
                }
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
            canvasContext.font = "18pt Arial";
            canvasContext.fillText(xpos + "," + ypos, x + this.HexRadius - 15, y + this.HexHeight + 25);
            canvasContext.closePath();

            if (fill) {
                canvasContext.fill();
            } else {
                canvasContext.stroke();
            }
        }

        DrawFields = () => {

            this.Context.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
            this.DrawBoard(this.Context, this.BoardWidth, this.BoardHeight);

            for (var x = 0; x < this.BoardWidth; ++x) {
                for (var y = 0; y < this.BoardHeight; ++y) {

                    $.each(this.Fields[x][y].Objects, (i, object) => {

                        var screenX,
                            screenY;

                        screenX = x * this.HexRectangleWidth + ((y % 2) * this.HexRadius);
                        screenY = y * (this.HexHeight + this.SideLength);

                        if (x >= 0 && x < this.BoardWidth) {
                            if (y >= 0 && y < this.BoardHeight) {
                                this.Context.fillStyle = object.color;
                                this.DrawHexagon(this.Context, screenX, screenY, true, x, y);
                            }
                        }
                    });
                }
            }
        }


        DrawMultipleBoardObjects = (objects: BoardObject[]) => {

            $.each(objects, (i, object) => {
                var x,
                    y,
                    hexX,
                    hexY,
                    screenX,
                    screenY;

                //if (object.xpos >= 0 && object.xpos < this.BoardWidth) {
                //    if (object.ypos >= 0 && object.ypos < this.BoardHeight) {
                //        this.Context.fillStyle = object.color;
                //        this.DrawHexagon(this.Context, screenX, screenY, true, object.xpos, object.ypos);
                //    }
                //}

            });


        }


        DrawBoardObject = (xin: number, yin: number, color: string) => {
            var x,
                y,
                hexX,
                hexY,
                screenX,
                screenY;

            x = xin * this.HexRectangleWidth;
            y = yin * this.HexRectangleHeight;

            screenX = xin * this.HexRectangleWidth + ((yin % 2) * this.HexRadius);
            screenY = yin * (this.HexHeight + this.SideLength);

            this.Context.clearRect(0, 0, this.Canvas.width, this.Canvas.height);

            this.DrawBoard(this.Context, this.BoardWidth, this.BoardHeight);

            // Check if the mouse's coords are on the board
            if (xin >= 0 && xin < this.BoardWidth) {
                if (yin >= 0 && yin < this.BoardHeight) {
                    this.Context.fillStyle = color;
                    this.DrawHexagon(this.Context, screenX, screenY, true, xin, yin);
                }
            }
        }

        FieldClickHandler = (eventInfo) => {

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

            screenX = hexX * this.HexRectangleWidth + ((hexY % 2) * this.HexRadius);
            screenY = hexY * (this.HexHeight + this.SideLength);

            this.Context.clearRect(0, 0, this.Canvas.width, this.Canvas.height);

            this.DrawBoard(this.Context, this.BoardWidth, this.BoardHeight);

            // Check if the mouse's coords are on the board
            if (hexY >= 0 && hexY < this.BoardHeight) {
                this.Context.fillStyle = "#000000";
                this.DrawHexagon(this.Context, screenX, screenY, true, hexX, hexY);
            }
        }

        //FieldMarkerClickHandler = (eventInfo) => {
        //    // 1) find ud af om der er nogen objecter på feltet


        //    var x,
        //        y,
        //        hexX,
        //        hexY,
        //        screenX,
        //        screenY;

        //    x = eventInfo.offsetX || eventInfo.layerX;
        //    y = eventInfo.offsetY || eventInfo.layerY;


        //    hexY = Math.floor(y / (this.HexHeight + this.SideLength));
        //    hexX = Math.floor((x - (hexY % 2) * this.HexRadius) / this.HexRectangleWidth);


        //    if (this.ObjectsOnBoard.filter(o => o.xpos == hexX && o.ypos == hexY).length > 0) {
        //        console.log("object found on " + hexX + "," + hexY);
        //        // this.Context.clearRect(hexX, hexY, this.Canvas.width, this.Canvas.height);
        //    }


        //    screenX = hexX * this.HexRectangleWidth + ((hexY % 2) * this.HexRadius);
        //    screenY = hexY * (this.HexHeight + this.SideLength);

        //    //this.Context.clearRect(0, 0, this.Canvas.width, this.Canvas.height);

        //    //this.DrawBoard(this.Context, this.BoardWidth, this.BoardHeight);

        //    //// Check if the mouse's coords are on the board
        //    //if (hexY >= 0 && hexY < this.BoardHeight) {
        //    //    this.Context.fillStyle = "#000000";
        //    //    this.DrawHexagon(this.Context, screenX, screenY, true);
        //    //}
        //}
    }

}