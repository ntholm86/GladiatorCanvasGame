var Game;
(function (Game) {
    var App = (function () {
        function App() {
            this.Board = new Board();
        }
        return App;
    }());
    Game.App = App;
    var Hero = (function () {
        function Hero(name, strength) {
            this.writer = function (text) {
                alert(text);
            };
            this.Name = name;
            this.Strength = strength;
            this.test = this.writer;
        }
        return Hero;
    }());
    Game.Hero = Hero;
    var Board = (function () {
        function Board() {
            var _this = this;
            this.Init = function () {
                var canvas = document.getElementById('hexmap');
                _this.BoardHeight = 10;
                _this.BoardWidth = 10;
                _this.HexagonAngle = 0.523598776;
                _this.SideLength = 36;
                _this.HexHeight = Math.sin(_this.HexagonAngle) * _this.SideLength;
                _this.HexRadius = Math.cos(_this.HexagonAngle) * _this.SideLength;
                _this.HexRectangleHeight = _this.SideLength + 2 * _this.HexHeight;
                _this.HexRectangleWidth = 2 * _this.HexRadius;
                if (canvas.getContext) {
                    _this.Context = canvas.getContext('2d');
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
                        _this.DrawHexagon(_this.Context, i * _this.HexRectangleWidth + ((j % 2) * _this.HexRadius), j * (_this.SideLength + _this.HexHeight), false);
                    }
                }
            };
            this.DrawHexagon = function (canvasContext, x, y, fill) {
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
                else {
                    canvasContext.stroke();
                }
            };
            this.Init();
        }
        return Board;
    }());
    Game.Board = Board;
})(Game || (Game = {}));
//# sourceMappingURL=game.js.map