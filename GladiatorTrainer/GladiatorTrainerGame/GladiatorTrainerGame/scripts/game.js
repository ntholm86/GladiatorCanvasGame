var Game;
(function (Game) {
    var App = (function () {
        function App() {
            var _this = this;
            this.Simulation = function () {
                _this.Board.DrawBoardFields();
            };
            this.InitiateFields = function () {
                _this.Board.Fields.push();
                _this.Board.Fields[0][0].Object = new BoardObject("#000000", "green", "yellow", true);
                _this.Board.Fields[6][7].Object = new BoardObject("#000000", "green", "yellow", true);
                _this.Board.Fields[9][7].Object = new BoardObject("#cecece", "green", "yellow", true);
                _this.Board.Fields[6][5].Object = new BoardObject("#32ba3e", "green", "yellow", true);
                _this.Board.Fields[1][7].Object = new BoardObject("#3880e3", "green", "yellow", true);
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
            this.Xpos = x;
            this.Ypos = y;
            this.FillColor = "pink";
        }
        return Field;
    }());
    Game.Field = Field;
    var BoardObject = (function () {
        function BoardObject(color, selectedColor, hoverColor, interactive) {
            this.Color = color;
            this.InterActive = interactive;
            this.SelectedColor = selectedColor;
            this.HoverColor = hoverColor;
        }
        return BoardObject;
    }());
    Game.BoardObject = BoardObject;
    var Coordinates = (function () {
        function Coordinates(x, y) {
            this.Xpos = x;
            this.Ypos = y;
        }
        return Coordinates;
    }());
    Game.Coordinates = Coordinates;
    var Board = (function () {
        function Board() {
            var _this = this;
            this.Init = function () {
                _this.Canvas = document.getElementById('hexmap');
                _this.Canvas.addEventListener('click', _this.FieldClickHandler, false);
                _this.Canvas.addEventListener('contextmenu', _this.RightClickHandler, false);
                _this.Canvas.addEventListener('mousemove', _this.MouseMove, false);
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
            this.DrawHexagon = function (canvasContext, x, y, fill, xpos, ypos) {
                var fill = fill || false;
                canvasContext.beginPath();
                canvasContext.moveTo(x + _this.HexRadius, y);
                canvasContext.lineTo(x + _this.HexRectangleWidth, y + _this.HexHeight);
                canvasContext.lineTo(x + _this.HexRectangleWidth, y + _this.HexHeight + _this.SideLength);
                canvasContext.lineTo(x + _this.HexRadius, y + _this.HexRectangleHeight);
                canvasContext.lineTo(x, y + _this.SideLength + _this.HexHeight);
                canvasContext.lineTo(x, y + _this.HexHeight);
                canvasContext.closePath();
                if (fill) {
                    canvasContext.fill();
                }
                canvasContext.stroke();
                canvasContext.fillStyle = "#000000";
                canvasContext.font = "18pt Arial";
                canvasContext.fillText(xpos + "," + ypos, x + _this.HexRadius - 15, y + _this.HexHeight + 25);
            };
            this.DrawBoardFields = function () {
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
                                    _this.Context.fillStyle = field.Object.Color;
                                    if (field == _this.SelectedField) {
                                        _this.Context.fillStyle = field.Object.SelectedColor;
                                    }
                                    if (field == _this.HoveredField) {
                                        _this.Context.fillStyle = field.Object.HoverColor;
                                    }
                                }
                                else if (_this.SelectedField.Xpos != -1 && field == _this.HoveredField) {
                                    _this.Context.fillStyle = field.FillColor;
                                }
                                _this.DrawHexagon(_this.Context, screenX, screenY, true, x, y);
                            }
                        }
                        _this.Context.fillStyle = "white";
                    }
                }
            };
            this.Deselect = function () {
                _this.SelectedField = _this.FakeField;
                _this.DrawBoardFields();
            };
            this.RightClickHandler = function (eventInfo) {
                _this.Deselect();
                eventInfo.preventDefault();
                eventInfo.stopImmediatePropagation();
                return false;
            };
            this.MoveBoardObject = function (fieldFrom, fieldTo) {
                fieldTo.Object = fieldFrom.Object;
                fieldFrom.Object = null;
                _this.DrawBoardFields();
                console.log("moved object to " + fieldTo.Xpos + "," + fieldTo.Ypos);
            };
            this.FieldClickHandler = function (eventInfo) {
                var x, y, hexX, hexY, screenX, screenY;
                x = eventInfo.offsetX || eventInfo.layerX;
                y = eventInfo.offsetY || eventInfo.layerY;
                hexY = Math.floor(y / (_this.HexHeight + _this.SideLength));
                hexX = Math.floor((x - (hexY % 2) * _this.HexRadius) / _this.HexRectangleWidth);
                if (_this.Fields[hexX][hexY] != undefined && _this.Fields[hexX][hexY].Object != null) {
                    console.log("object found on " + hexX + "," + hexY);
                }
                var hoveredField = _this.GetFieldByCoords(hexX, hexY);
                if (_this.SelectedField.Xpos != -1) {
                    _this.MoveBoardObject(_this.SelectedField, hoveredField);
                    _this.Deselect();
                }
                else {
                    _this.SelectedField = hoveredField;
                }
                _this.DrawBoardFields();
            };
            this.GetFieldByCoords = function (x, y) {
                var field = _this.Fields[x][y];
                return field;
            };
            this.CheckMouseOnBoard = function (hexX, hexY) {
                if (hexX >= 0 && hexX < _this.BoardWidth) {
                    if (hexY >= 0 && hexY < _this.BoardHeight) {
                        return true;
                    }
                }
                return false;
            };
            this.MouseMove = function (eventInfo) {
                var x, y, hexX, hexY, screenX, screenY;
                x = eventInfo.offsetX || eventInfo.layerX;
                y = eventInfo.offsetY || eventInfo.layerY;
                hexY = Math.floor(y / (_this.HexHeight + _this.SideLength));
                hexX = Math.floor((x - (hexY % 2) * _this.HexRadius) / _this.HexRectangleWidth);
                if (!_this.CheckMouseOnBoard(hexX, hexY)) {
                    return false;
                }
                var field = _this.Fields[hexX][hexY];
                if (field.Object == null) {
                    _this.Context.fillStyle = "pink";
                }
                //if (this.SelectedField.Object.InterActive) {
                //}
                _this.HoveredField = field;
                _this.DrawBoardFields();
            };
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
        return Board;
    }());
    Game.Board = Board;
})(Game || (Game = {}));
