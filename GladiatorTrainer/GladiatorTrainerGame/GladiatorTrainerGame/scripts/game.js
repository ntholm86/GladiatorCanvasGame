var Game;
(function (Game) {
    var App = (function () {
        function App() {
            var _this = this;
            this.Simulation = function () {
                _this.Board.DrawFields();
            };
            this.InitiateFields = function () {
                _this.Board.Fields.push();
                _this.Board.Fields[0][0].Object = new BoardObject("#000000");
                _this.Board.Fields[6][7].Object = new BoardObject("#000000");
                _this.Board.Fields[9][7].Object = new BoardObject("#cecece");
                _this.Board.Fields[6][5].Object = new BoardObject("#32ba3e");
                _this.Board.Fields[1][7].Object = new BoardObject("#3880e3");
            };
            this.Board = new Board();
            this.InitiateFields();
            this.Simulation();
        }
        return App;
    }());
    Game.App = App;
    var Field = (function () {
        function Field(x, y) {
            this.xpos = x;
            this.ypos = y;
            this.Selected = false;
        }
        return Field;
    }());
    Game.Field = Field;
    var BoardObject = (function () {
        function BoardObject(color) {
            this.color = color;
        }
        return BoardObject;
    }());
    Game.BoardObject = BoardObject;
    var Board = (function () {
        function Board() {
            var _this = this;
            this.Init = function () {
                _this.Canvas = document.getElementById('hexmap');
                _this.Canvas.addEventListener('click', _this.FieldMarkerClickHandler, false);
                _this.BoardHeight = 10;
                _this.BoardWidth = 10;
                _this.HexagonAngle = 0.523598776;
                _this.SideLength = 36;
                _this.HexHeight = Math.sin(_this.HexagonAngle) * _this.SideLength;
                _this.HexRadius = Math.cos(_this.HexagonAngle) * _this.SideLength;
                _this.HexRectangleHeight = _this.SideLength + 2 * _this.HexHeight;
                _this.HexRectangleWidth = 2 * _this.HexRadius;
                if (_this.Canvas.getContext) {
                    _this.Context = _this.Canvas.getContext('2d');
                    _this.Context.fillStyle = "#000000";
                    _this.Context.strokeStyle = "#CCCCCC";
                    _this.Context.lineWidth = 1;
                }
            };
            this.DrawHexagon = function (canvasContext, x, y, fill, xpos, ypos, field) {
                if (field === void 0) { field = null; }
                var fill = fill || false;
                canvasContext.beginPath();
                canvasContext.moveTo(x + _this.HexRadius, y);
                canvasContext.lineTo(x + _this.HexRectangleWidth, y + _this.HexHeight);
                canvasContext.lineTo(x + _this.HexRectangleWidth, y + _this.HexHeight + _this.SideLength);
                canvasContext.lineTo(x + _this.HexRadius, y + _this.HexRectangleHeight);
                canvasContext.lineTo(x, y + _this.SideLength + _this.HexHeight);
                canvasContext.lineTo(x, y + _this.HexHeight);
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
                canvasContext.fillText(xpos + "," + ypos, x + _this.HexRadius - 15, y + _this.HexHeight + 25);
            };
            this.DrawFields = function () {
                _this.Context.clearRect(0, 0, _this.Canvas.width, _this.Canvas.height);
                for (var x = 0; x < _this.BoardWidth; ++x) {
                    for (var y = 0; y < _this.BoardHeight; ++y) {
                        var screenX, screenY;
                        screenX = x * _this.HexRectangleWidth + ((y % 2) * _this.HexRadius);
                        screenY = y * (_this.HexHeight + _this.SideLength);
                        if (x >= 0 && x < _this.BoardWidth) {
                            if (y >= 0 && y < _this.BoardHeight) {
                                var field = _this.Fields[x][y];
                                if (field.Object) {
                                    _this.Context.fillStyle = field.Object.color;
                                }
                                _this.DrawHexagon(_this.Context, screenX, screenY, true, x, y, field);
                                field.Selected = false;
                            }
                        }
                        _this.Context.fillStyle = "white";
                    }
                }
            };
            this.FieldMarkerClickHandler = function (eventInfo) {
                // 1) find ud af om der er nogen objecter på feltet
                var x, y, hexX, hexY, screenX, screenY;
                x = eventInfo.offsetX || eventInfo.layerX;
                y = eventInfo.offsetY || eventInfo.layerY;
                hexY = Math.floor(y / (_this.HexHeight + _this.SideLength));
                hexX = Math.floor((x - (hexY % 2) * _this.HexRadius) / _this.HexRectangleWidth);
                if (_this.Fields[hexX][hexY].Object != null) {
                    console.log("object found on " + hexX + "," + hexY);
                }
                screenX = hexX * _this.HexRectangleWidth + ((hexY % 2) * _this.HexRadius);
                screenY = hexY * (_this.HexHeight + _this.SideLength);
                var selectedField = _this.GetFieldByCoords(hexX, hexY);
                selectedField.Selected = true;
                _this.DrawFields();
            };
            this.GetFieldByCoords = function (x, y) {
                var field = _this.Fields[x][y];
                return field;
            };
            this.Init();
            this.Fields = [];
            for (var x = 0; x < this.BoardWidth; ++x) {
                this.Fields[x] = [];
                for (var y = 0; y < this.BoardHeight; ++y) {
                    this.Fields[x][y] = new Field(x, y);
                }
            }
        }
        return Board;
    }());
    Game.Board = Board;
})(Game || (Game = {}));
