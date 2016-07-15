module Game {

    export class App {
        Board: Board;

        constructor() {
            this.Board = new Board();            
        }
    }

    export class Hero {
        Name: string;
        Strength: number;
        test: (text: string) => void;

        constructor(name: string, strength: number) {
            this.Name = name; 
            this.Strength = strength;

            this.test = this.writer;
        }
        
        writer = (text) => {
            alert(text);
        }
    }

    export class Board {
        HexHeight: number;
        HexRadius: number;
        HexRectangleHeight: number;
        HexRectangleWidth: number;
        HexagonAngle:number; // 30 degrees in radians
        SideLength: number;
        BoardWidth: number;
        BoardHeight: number; 
        Context: CanvasRenderingContext2D;
        constructor() {
            this.Init();
        }

        Init = () => {
            var canvas = <HTMLCanvasElement>document.getElementById('hexmap');

            this.BoardHeight = 10;
            this.BoardWidth = 10;
            this.HexagonAngle = 0.523598776;
            this.SideLength = 36;

            this.HexHeight = Math.sin(this.HexagonAngle) * this.SideLength;
            this.HexRadius = Math.cos(this.HexagonAngle) * this.SideLength;
            this.HexRectangleHeight = this.SideLength + 2 * this.HexHeight;
            this.HexRectangleWidth = 2 * this.HexRadius;

            if (canvas.getContext) {
                this.Context = canvas.getContext('2d');

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
                        this.Context ,
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
    }

}