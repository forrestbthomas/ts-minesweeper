var app = angular.module('app', []);
var Tile = (function () {
    function Tile(isMine, position) {
        this.isMine = isMine;
        this.init = '_';
        this.flagOptions = [1, 2, 3, 4, '?'];
        this.counter = 0;
        this.position = position;
        this.checked = false;
    }
    return Tile;
})();
var Board = (function () {
    function Board(size) {
        this.rows = size;
        this.columns = size;
        this.grid = this.buildGrid(size);
    }
    Board.prototype.buildGrid = function (numMines) {
        var grid = [];
        for (var i = 0; i < this.rows; i++) {
            var row = [];
            for (var j = 0; j < this.columns; j++) {
                row.push(new Tile(false, { y: i, x: j }));
            }
            grid.push(row);
        }
        this.placeMines(grid);
        return grid;
    };
    Board.prototype.placeMines = function (grid) {
        this.mineCount = 0;
        var storage = {};
        var counter = (this.rows + this.columns) / 2;
        while (counter > 0) {
            var row = Math.floor(Math.random() * this.rows);
            var col = Math.floor(Math.random() * this.columns);
            var pos = row + ',' + col;
            if (!storage[pos]) {
                storage[pos] = true;
                grid[row][col] = new Tile(true, { y: row, x: col });
                counter--;
                this.mineCount++;
            }
        }
    };
    return Board;
})();
app.controller('MineController', ['$scope', function ($scope) {
    $scope.board = new Board(10);
    $scope.resetBoard = function () {
        $scope.board = new Board(10);
    };
    $scope.resetCounter = function (tile) {
        if (tile.counter > tile.flagOptions.length) {
            tile.counter = 0;
        }
    };
    $scope.revealTile = function (tile) {
        tile.display = tile.init;
        if (tile.isMine) {
            $scope.gameOver();
        }
        else {
            $scope.revealTilesWithNoBorderingMines(tile);
        }
    };
    $scope.flag = function (tile) {
        tile.display = tile.flagOptions[tile.counter];
        tile.flagged = true;
        tile.counter++;
        $scope.resetCounter(tile);
    };
    $scope.validatePositions = function (positionsArr) {
        return positionsArr.filter(function (tilePos) {
            if (tilePos.x >= 0 && tilePos.x < $scope.board.rows) {
                if (tilePos.y >= 0 && tilePos.y < $scope.board.columns) {
                    return tilePos;
                }
            }
        });
    };
    $scope.revealTilesWithNoBorderingMines = function (tile) {
        var shouldDisplay = true;
        var x = tile.position.x;
        var y = tile.position.y;
        var positionsToCheck = [
            { x: x - 1, y: y },
            { x: x, y: y - 1 },
            { x: x + 1, y: y },
            { x: x, y: y + 1 }
        ];
        $scope.validatePositions(positionsToCheck).forEach(function (tilePos) {
            var tileToCheck = $scope.board.grid[tilePos.x][tilePos.y];
            if (!tileToCheck.checked) {
                tileToCheck.checked = true;
                if (tileToCheck.isMine) {
                    shouldDisplay = false;
                }
                else {
                    $scope.revealTilesWithNoBorderingMines(tileToCheck);
                }
            }
        });
        if (shouldDisplay) {
            tile.display = tile.init;
        }
    };
    $scope.gameOver = function () {
        alert('YOU LOST!!!');
        $scope.resetBoard();
    };
}]);
