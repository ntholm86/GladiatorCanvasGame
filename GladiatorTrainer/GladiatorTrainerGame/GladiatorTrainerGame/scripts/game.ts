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
            this.Board.Fields[0][0].Object = new BoardObject("#000000");
            this.Board.Fields[6][7].Object = new BoardObject("#000000");
            this.Board.Fields[9][7].Object = new BoardObject("#cecece");
            this.Board.Fields[6][5].Object = new BoardObject("#32ba3e");
            this.Board.Fields[1][7].Object = new BoardObject("#3880e3");
        }
    }

    export class Field {
        xpos: number;
        ypos: number;
        Object: BoardObject;
        Selected: boolean; 

        constructor(x: number, y: number) {
            this.xpos = x;
            this.ypos = y;     
            this.Selected = false;               
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
        }
        
        Init = () => {
            this.Canvas = <HTMLCanvasElement>document.getElementById('hexmap');
            this.Canvas.addEventListener('click', this.FieldMarkerClickHandler, false);
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


        DrawHexagon = (canvasContext: CanvasRenderingContext2D, x: number, y: number, fill: boolean, xpos: number, ypos: number, field: Field = null) => {
            var fill = fill || false;
            canvasContext.beginPath();
            canvasContext.moveTo(x + this.HexRadius, y);
            canvasContext.lineTo(x + this.HexRectangleWidth, y + this.HexHeight);
            canvasContext.lineTo(x + this.HexRectangleWidth, y + this.HexHeight + this.SideLength);
            canvasContext.lineTo(x + this.HexRadius, y + this.HexRectangleHeight);
            canvasContext.lineTo(x, y + this.SideLength + this.HexHeight);
            canvasContext.lineTo(x, y + this.HexHeight);

            if (field) {
                if (field.Selected) {
                    canvasContext.fillStyle = "red";
                }
            }
       
            canvasContext.closePath();
            
            if (fill) {
                canvasContext.fill();
            } 

            canvasContext.stroke();

            canvasContext.fillStyle = "#000000";
            canvasContext.font = "18pt Arial";
            canvasContext.fillText(xpos + "," + ypos, x + this.HexRadius - 15, y + this.HexHeight + 25);
           
        }

        DrawFields = () => {

            this.Context.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
           

            for (var x = 0; x < this.BoardWidth; ++x) {
                for (var y = 0; y < this.BoardHeight; ++y) {                 

                    var screenX,
                        screenY;

                    screenX = x * this.HexRectangleWidth + ((y % 2) * this.HexRadius);
                    screenY = y * (this.HexHeight + this.SideLength);

                    if (x >= 0 && x < this.BoardWidth) {
                        if (y >= 0 && y < this.BoardHeight) {
                            var field = this.Fields[x][y];
                            if (field.Object) {
                                this.Context.fillStyle = field.Object.color;
                            } 

                            this.DrawHexagon(this.Context, screenX, screenY, true, x, y, field);
                            field.Selected = false;
                        }
                    }
                    this.Context.fillStyle = "white";
                   
                }
            }
        }





      


        FieldMarkerClickHandler = (eventInfo) => {
            // 1) find ud af om der er nogen objecter på feltet


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


            if (this.Fields[hexX][hexY].Object != null ) {
                console.log("object found on " + hexX + "," + hexY);
            }


            screenX = hexX * this.HexRectangleWidth + ((hexY % 2) * this.HexRadius);
            screenY = hexY * (this.HexHeight + this.SideLength);

            var selectedField = this.GetFieldByCoords(hexX, hexY);
            selectedField.Selected = true;
            this.DrawFields();
        }

        GetFieldByCoords = (x, y) => {
            var field = this.Fields[x][y];
            return field;
        }
    }

}