var Game;
(function (Game) {
    var App = (function () {
        function App() {
            var _this = this;
            this.Simulation = function () {
                var objects = new Array();
                objects.push(new BoardObject(9, 0, "#000000"));
                objects.push(new BoardObject(2, 2, "#cecece"));
                objects.push(new BoardObject(5, 3, "#32ba3e"));
                objects.push(new BoardObject(3, 9, "#3880e3"));
                _this.Board.ObjectsOnBoard = objects;
                _this.Board.DrawMultipleBoardObjects(objects);
            };
            this.Board = new Board();
            this.Simulation();
        }
        return App;
    }());
    Game.App = App;
    var BoardObject = (function () {
        function BoardObject(x, y, color) {
            this.color = color;
            this.xpos = x;
            this.ypos = y;
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
                    _this.DrawBoard(_this.Context, _this.BoardWidth, _this.BoardHeight);
                }
            };
            //DrawObjectsOnBoard = (objects: BoardObject[]) => {
            //    for (var y = 0; y <= this.BoardHeight; y++) {
            //        for (var x = 0; x <= this.BoardWidth; x++) {
            //            var objectsOnField = objects.filter(o => o.xpos == x && o.ypos == y);
            //            if (objectsOnField) {
            //            }
            //        }
            //    }
            //}
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
            this.DrawMultipleBoardObjects = function (objects) {
                _this.Context.clearRect(0, 0, _this.Canvas.width, _this.Canvas.height);
                _this.DrawBoard(_this.Context, _this.BoardWidth, _this.BoardHeight);
                $.each(objects, function (i, object) {
                    var x, y, hexX, hexY, screenX, screenY;
                    x = object.xpos * _this.HexRectangleWidth;
                    y = object.ypos * _this.HexRectangleHeight;
                    hexY = Math.floor(y / (_this.HexHeight + _this.SideLength));
                    hexX = Math.floor((x - (hexY % 2) * _this.HexRadius) / _this.HexRectangleWidth);
                    screenX = object.xpos * _this.HexRectangleWidth + ((object.ypos % 2) * _this.HexRadius);
                    screenY = object.ypos * (_this.HexHeight + _this.SideLength);
                    if (object.xpos >= 0 && object.xpos < _this.BoardWidth) {
                        if (object.ypos >= 0 && object.ypos < _this.BoardHeight) {
                            _this.Context.fillStyle = object.color;
                            _this.DrawHexagon(_this.Context, screenX, screenY, true, object.xpos, object.ypos);
                        }
                    }
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
            this.FieldMarkerClickHandler = function (eventInfo) {
                // 1) find ud af om der er nogen objecter på feltet
                var x, y, hexX, hexY, screenX, screenY;
                x = eventInfo.offsetX || eventInfo.layerX;
                y = eventInfo.offsetY || eventInfo.layerY;
                hexY = Math.floor(y / (_this.HexHeight + _this.SideLength));
                hexX = Math.floor((x - (hexY % 2) * _this.HexRadius) / _this.HexRectangleWidth);
                if (_this.ObjectsOnBoard.filter(function (o) { return o.xpos == hexX && o.ypos == hexY; }).length > 0) {
                    console.log("clearing coords " + hexX + "," + hexY);
                    _this.Context.clearRect(hexX, hexY, _this.Canvas.width, _this.Canvas.height);
                }
                screenX = hexX * _this.HexRectangleWidth + ((hexY % 2) * _this.HexRadius);
                screenY = hexY * (_this.HexHeight + _this.SideLength);
                //this.Context.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
                //this.DrawBoard(this.Context, this.BoardWidth, this.BoardHeight);
                //// Check if the mouse's coords are on the board
                //if (hexY >= 0 && hexY < this.BoardHeight) {
                //    this.Context.fillStyle = "#000000";
                //    this.DrawHexagon(this.Context, screenX, screenY, true);
                //}
            };
            this.Init();
        }
        return Board;
    }());
    Game.Board = Board;
})(Game || (Game = {}));
