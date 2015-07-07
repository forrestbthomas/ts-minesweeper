var app = angular.module('app', []);

interface ICoordinate {
    x: number;
    y: number;
}

class Tile {
    isMine: boolean;
    init: string;
    flagOptions: Array<any>;
    counter: number;
    position: ICoordinate;
    checked: boolean;
    constructor(isMine: boolean, position: ICoordinate) {
        this.isMine = isMine;
        this.init = '_';
        this.flagOptions = [1,2,3,4,'?'];
        this.counter = 0;
        this.position = position;
        this.checked = false;
    }
}

class Board {
    rows: number;
    columns: number;
    grid: Array<Array<any>>
    mineCount: number;
    constructor(size: number) {
        this.rows = size;
        this.columns = size;
        this.grid = this.buildGrid(size);
    }
    public buildGrid(numMines: number) {
        var grid = [];
        for (var i = 0; i < this.rows; i++) {
            var row = [];
            for (var j = 0; j < this.columns; j++) {
                row.push(new Tile(false, {y: i, x: j}));
            }
            grid.push(row);
        }
        this.placeMines(grid);
        return grid;
    }
    public placeMines(grid: Array<Array<any>>) {
        this.mineCount = 0;
        var storage = {};
        var counter = (this.rows + this.columns) / 2;
        while(counter > 0) {
            var row = Math.floor(Math.random() * this.rows);
            var col = Math.floor(Math.random() * this.columns);
            var pos = row + ',' + col;
            if (!storage[pos]) {
              storage[pos] = true
              grid[row][col] = new Tile(true, {y: row, x: col});
              counter--;
              this.mineCount++;
            }
       }
    }
}

app.controller('MineController', ['$scope', function($scope) {
    $scope.board = new Board(10);

    $scope.resetBoard = function() {
      $scope.board = new Board(10);
    }

    $scope.resetCounter = function(tile) {
      if (tile.counter > tile.flagOptions.length) {
          tile.counter = 0;
      }
    }

    $scope.revealTile = function(tile) {
        tile.display = tile.init;
        if (tile.isMine) {
          $scope.gameOver();
        } else {
          $scope.revealTilesWithNoBorderingMines(tile);
        }
    }

    $scope.flag = function(tile) {
        tile.display = tile.flagOptions[tile.counter];
        tile.flagged = true;
        tile.counter++;
        $scope.resetCounter(tile);
    }

    $scope.validatePositions = function(positionsArr) {
      return positionsArr.filter(function(tilePos) {
        if (tilePos.x >= 0 && tilePos.x < $scope.board.rows) { 
            if (tilePos.y >= 0 && tilePos.y < $scope.board.columns) {
                return tilePos;
            }
        }
      });
    };

    $scope.revealTilesWithNoBorderingMines = function(tile) {
        var shouldDisplay = true;
        var x = tile.position.x;
        var y = tile.position.y;
        var positionsToCheck = [
          { x: x - 1, y: y }, 
          {x: x, y: y - 1},
          {x: x + 1, y: y},
          {x: x, y: y + 1}
        ];

        $scope.validatePositions(positionsToCheck).forEach(function(tilePos) {
            var tileToCheck = $scope.board.grid[tilePos.x][tilePos.y];
            if (!tileToCheck.checked) {
              tileToCheck.checked = true;
              if (tileToCheck.isMine) {
                shouldDisplay = false;
              } else {
                $scope.revealTilesWithNoBorderingMines(tileToCheck);
              }
            }
        });
        if (shouldDisplay) {
            tile.display = tile.init;
        }
    }

    $scope.gameOver = function() {
      alert('YOU LOST!!!');
      $scope.resetBoard();
    }
}])