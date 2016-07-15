module Game {

    export class App {
        Board: Board;

        constructor() {
            this.Board = new Board();  
            this.Simulation();                    
        }

        Simulation = () => {
            var objects = new Array<BoardObject>();
            objects.push(new BoardObject(1, 1, "#000000"));
            objects.push(new BoardObject(3, 1, "#cecece"));

            this.Board.DrawMultipleBoardObjects(objects);
        }
    }


    export class BoardObject {
        xpos: number; 
        ypos: number;
        color: string;

        constructor(x: number, y: number, color: string){
            this.color = color;
            this.xpos = x;
            this.ypos = y;
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

        constructor() {
            this.Init();
        }

        Init = () => {
            this.Canvas = <HTMLCanvasElement>document.getElementById('hexmap');
            this.Canvas.addEventListener('click', this.FieldClickHandler, false);
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

        DrawObjectsOnBoard = (objects: BoardObject[]) => {
            for (var y = 0; y <= this.BoardHeight; y++) {
                for (var x = 0; x <= this.BoardWidth; x++) {
                    var objectsOnField = objects.filter(o => o.xpos == x && o.ypos == y);
                    if (objectsOnField) {
                       
                    }
                }
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
                        false
                    );
                }
            }
        }

        DrawHexagon = (canvasContext: CanvasRenderingContext2D, x: number, y: number, fill: boolean) => {
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
            } else {
                canvasContext.stroke();
            }
        }

        DrawDummyObject = () => {
            this.DrawBoardObject(3, 1, "#000000");
        }

        DrawMultipleBoardObjects = (objects: BoardObject[]) => {
            this.Context.clearRect(0, 0, this.Canvas.width, this.Canvas.height);

            this.DrawBoard(this.Context, this.BoardWidth, this.BoardHeight);


            $.each(objects, (i, object) => {
                var x,
                    y,
                    hexX,
                    hexY,
                    screenX,
                    screenY;

                x = object.xpos * this.HexRectangleWidth;
                y = object.ypos * this.HexRectangleHeight;

                hexY = Math.floor(y / (this.HexHeight + this.SideLength));
                hexX = Math.floor((x - (hexY % 2) * this.HexRadius) / this.HexRectangleWidth);

                screenX = hexX * this.HexRectangleWidth + ((hexY % 2) * this.HexRadius);
                screenY = hexY * (this.HexHeight + this.SideLength);

                if (hexX >= 0 && hexX < this.BoardWidth) {
                    if (hexY >= 0 && hexY < this.BoardHeight) {
                        this.Context.fillStyle = object.color;
                        this.DrawHexagon(this.Context, screenX, screenY, true);
                    }
                }

            });


        }


        DrawBoardObject = (xin:number, yin:number, color: string) => {
            var x,
                y,
                hexX,
                hexY,
                screenX,
                screenY;

            x = xin * this.HexRectangleWidth;
            y = yin * this.HexRectangleHeight;


            hexY = Math.floor(y / (this.HexHeight + this.SideLength));
            hexX = Math.floor((x - (hexY % 2) * this.HexRadius) / this.HexRectangleWidth);

            screenX = hexX * this.HexRectangleWidth + ((hexY % 2) * this.HexRadius);
            screenY = hexY * (this.HexHeight + this.SideLength);

            this.Context.clearRect(0, 0, this.Canvas.width, this.Canvas.height);

            this.DrawBoard(this.Context, this.BoardWidth, this.BoardHeight);

            // Check if the mouse's coords are on the board
            if (hexX >= 0 && hexX < this.BoardWidth) {
                if (hexY >= 0 && hexY < this.BoardHeight) {
                    this.Context.fillStyle = color;
                    this.DrawHexagon(this.Context, screenX, screenY, true);
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
                    this.DrawHexagon(this.Context, screenX, screenY, true);
                }
            }
        

    }
    
}