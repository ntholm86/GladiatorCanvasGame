module Game {

    export class App {
        Board: Board;

        constructor() {
            this.Board = new Board();
            this.InitiateFields();
            this.Simulation();
        }

        Simulation = () => {
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

    export class Field {
        Xpos: number;
        Ypos: number;
        Object: BoardObject;
        FillColor: string;

        constructor(x: number, y: number) {
            this.Xpos = x;
            this.Ypos = y;
            this.FillColor = "pink";
        }
    }

    export class BoardObject {
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

    export class Coordinates {
        Xpos: number;
        Ypos: number;

        constructor(x: number, y: number) {
            this.Xpos = x;
            this.Ypos = y;
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
        SelectedField: Field;
        HoveredField: Field;
        FakeField: Field;
        constructor() {
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
            console.log("SelectedField: ");
            console.log(this.SelectedField);
            console.log("HoveredField: ");
            console.log(this.HoveredField);
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
                            var field = this.Fields[x][y];
                            if (field.Object) {//Hvis der er et object på feltet
                                this.Context.fillStyle = field.Object.Color;
                                if (field == this.SelectedField) {//hvis feltet er klikket på og valgt
                                    this.Context.fillStyle = field.Object.SelectedColor;
                                }
                                if (field == this.HoveredField) {//hvis hover
                                    this.Context.fillStyle = field.Object.HoverColor;
                                }
                            } else if (this.SelectedField.Xpos != -1 && field == this.HoveredField) {//ellers brug farven fra field når man hover
                                this.Context.fillStyle = field.FillColor;
                            }

                            this.DrawHexagon(this.Context, screenX, screenY, true, x, y);
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
            this.DrawBoardFields();
            console.log("moved object to " + fieldTo.Xpos + "," + fieldTo.Ypos);
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
            
            var clickedField = this.GetFieldByCoords(hexX, hexY);
           
            if (this.SelectedField.Xpos != -1) {//hvis der er noget der er selected  
                if (clickedField.Object == null) {
                    this.MoveBoardObject(this.SelectedField, clickedField);
                    this.Deselect();
                }                    
            }else{
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