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
                _this.Board.Fields[0][0].Objects.push(new BoardObject("#000000"));
                _this.Board.Fields[6][7].Objects.push(new BoardObject("#000000"));
                _this.Board.Fields[9][7].Objects.push(new BoardObject("#cecece"));
                _this.Board.Fields[6][5].Objects.push(new BoardObject("#32ba3e"));
                _this.Board.Fields[1][7].Objects.push(new BoardObject("#3880e3"));
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
            this.Objects = new Array();
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
                //this.Canvas.addEventListener('click', this.FieldMarkerClickHandler, false);
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
                    _this.DrawBoard(_this.Context, _this.BoardWidth, _this.BoardHeight);
                }
            };
            this.DrawBoard = function (canvasContext, width, height) {
                var i, j;
                for (i = 0; i < width; ++i) {
                    for (j = 0; j < height; ++j) {
                        _this.DrawHexagon(_this.Context, i * _this.HexRectangleWidth + ((j % 2) * _this.HexRadius), j * (_this.SideLength + _this.HexHeight), false, i, j);
                    }
                }
            };
            this.DrawHexagon = function (canvasContext, x, y, fill, xpos, ypos) {
                var fill = fill || false;
                canvasContext.beginPath();
                canvasContext.moveTo(x + _this.HexRadius, y);
                canvasContext.lineTo(x + _this.HexRectangleWidth, y + _this.HexHeight);
                canvasContext.lineTo(x + _this.HexRectangleWidth, y + _this.HexHeight + _this.SideLength);
                canvasContext.lineTo(x + _this.HexRadius, y + _this.HexRectangleHeight);
                canvasContext.lineTo(x, y + _this.SideLength + _this.HexHeight);
                canvasContext.lineTo(x, y + _this.HexHeight);
                canvasContext.font = "18pt Arial";
                canvasContext.fillText(xpos + "," + ypos, x + _this.HexRadius - 15, y + _this.HexHeight + 25);
                canvasContext.closePath();
                if (fill) {
                    canvasContext.fill();
                }
                else {
                    canvasContext.stroke();
                }
            };
            this.DrawFields = function () {
                _this.Context.clearRect(0, 0, _this.Canvas.width, _this.Canvas.height);
                _this.DrawBoard(_this.Context, _this.BoardWidth, _this.BoardHeight);
                for (var x = 0; x < _this.BoardWidth; ++x) {
                    for (var y = 0; y < _this.BoardHeight; ++y) {
                        $.each(_this.Fields[x][y].Objects, function (i, object) {
                            var screenX, screenY;
                            screenX = x * _this.HexRectangleWidth + ((y % 2) * _this.HexRadius);
                            screenY = y * (_this.HexHeight + _this.SideLength);
                            if (x >= 0 && x < _this.BoardWidth) {
                                if (y >= 0 && y < _this.BoardHeight) {
                                    _this.Context.fillStyle = object.color;
                                    _this.DrawHexagon(_this.Context, screenX, screenY, true, x, y);
                                }
                            }
                        });
                    }
                }
            };
            this.DrawMultipleBoardObjects = function (objects) {
                $.each(objects, function (i, object) {
                    var x, y, hexX, hexY, screenX, screenY;
                    //if (object.xpos >= 0 && object.xpos < this.BoardWidth) {
                    //    if (object.ypos >= 0 && object.ypos < this.BoardHeight) {
                    //        this.Context.fillStyle = object.color;
                    //        this.DrawHexagon(this.Context, screenX, screenY, true, object.xpos, object.ypos);
                    //    }
                    //}
                });
            };
            this.DrawBoardObject = function (xin, yin, color) {
                var x, y, hexX, hexY, screenX, screenY;
                x = xin * _this.HexRectangleWidth;
                y = yin * _this.HexRectangleHeight;
                screenX = xin * _this.HexRectangleWidth + ((yin % 2) * _this.HexRadius);
                screenY = yin * (_this.HexHeight + _this.SideLength);
                _this.Context.clearRect(0, 0, _this.Canvas.width, _this.Canvas.height);
                _this.DrawBoard(_this.Context, _this.BoardWidth, _this.BoardHeight);
                // Check if the mouse's coords are on the board
                if (xin >= 0 && xin < _this.BoardWidth) {
                    if (yin >= 0 && yin < _this.BoardHeight) {
                        _this.Context.fillStyle = color;
                        _this.DrawHexagon(_this.Context, screenX, screenY, true, xin, yin);
                    }
                }
            };
            this.FieldClickHandler = function (eventInfo) {
                var x, y, hexX, hexY, screenX, screenY;
                x = eventInfo.offsetX || eventInfo.layerX;
                y = eventInfo.offsetY || eventInfo.layerY;
                hexY = Math.floor(y / (_this.HexHeight + _this.SideLength));
                hexX = Math.floor((x - (hexY % 2) * _this.HexRadius) / _this.HexRectangleWidth);
                screenX = hexX * _this.HexRectangleWidth + ((hexY % 2) * _this.HexRadius);
                screenY = hexY * (_this.HexHeight + _this.SideLength);
                _this.Context.clearRect(0, 0, _this.Canvas.width, _this.Canvas.height);
                _this.DrawBoard(_this.Context, _this.BoardWidth, _this.BoardHeight);
                // Check if the mouse's coords are on the board
                if (hexY >= 0 && hexY < _this.BoardHeight) {
                    _this.Context.fillStyle = "#000000";
                    _this.DrawHexagon(_this.Context, screenX, screenY, true, hexX, hexY);
                }
            };
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
        return Board;
    }());
    Game.Board = Board;
})(Game || (Game = {}));
