describe("Minesweeper", function() {
    var $controller, $scope, board, tile, alertSpy;

    beforeEach(module('app'));

    beforeEach(inject(function(_$controller_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        $scope = {};
        $controller('MineController', { $scope: $scope });
    }));

    beforeEach(function () {
        board = new Board(10);
    });

    describe("Board", function() {
        alertSpy = sinon.stub(window, 'alert', function() {});

        it("exists", function() {
            expect(board).not.toBeUndefined();
        });

        it("has rows and columns", function() {
            expect(board.rows).toEqual(10);
            expect(board.columns).toEqual(10);
        });

        it("builds grid on init", function() {
            expect(board.grid).not.toBeUndefined();
        });

        describe('BuildGrid', function() {

          it('calls placeMines', function() {
            var spiedFn = sinon.stub(board, 'placeMines');
            board.buildGrid(10);
            expect(spiedFn.callCount).toEqual(1);
          });

          it('makes a grid', function() {
            expect(board.grid[0]).not.toBeUndefined();
            expect(board.grid[0][0]).not.toBeUndefined();
          });
        });

        describe('PlaceMines', function() {

          it('places a number of mines relative to the size of the board and handles collisions', function() {
            expect(board.mineCount).toEqual(10);
          });

        });

    });

    describe('Tile', function () {

      beforeEach(function () {
        tile = new Tile(false, {x: 0, y: 0});
      });

      it('exists', function() {
        expect(tile).not.toBeUndefined();
      });

      it('has an isMine property', function() {
        expect(tile.isMine).toBe(false);
        tile = new Tile(true, {x: 0, y: 0});
        expect(tile.isMine).toBe(true);
      });

      it('has default properties: init, flagOptions, and counter', function() {
        expect(tile.flagOptions).toEqual([1,2,3,4,'?']);
        expect(tile.init).toEqual('_');
        expect(tile.counter).toEqual(0);
      });

      it('has a position property, set on initialization', function() {
        expect(tile.position).not.toBeUndefined();
      });

    });

    describe('MineController', function () {

      it('has a board property', function() {
        expect($scope.board).not.toBeUndefined();
      });

      it('has a display function', function() {
        expect(typeof $scope.revealTile).toEqual('function');
      });

      it('has a flag function', function() {
        expect(typeof $scope.flag).toEqual('function');
      });

      describe('$scope.revealTile', function() {
        beforeEach(function () {
          tile = new Tile(false, {x: 0, y: 0});
        });

        it('displays the tile', function() {
          $scope.revealTile(tile);
          expect(tile.display).toEqual('_');
        });

        it('calls gameOver function if tile is a mine', function() {
          tile.isMine = true;
          var gameOverStub = sinon.stub($scope, 'gameOver');
          $scope.revealTile(tile);
          expect(gameOverStub.callCount).toEqual(1);
        });

        it('calls the resetCounter function', function() {
          var resetCounterSpy = sinon.stub($scope, 'resetCounter');
          $scope.flag(tile);
          expect(resetCounterSpy.callCount).toEqual(1);
        });

        describe('revealTilesWithNoBorderingMines function', function() {

          // it('looks at neighboring tiles to see if they are mines', function() {
          //   $scope.revealTilesWithNoBorderingMines(board.grid[0][0]);
          //   expect(board.grid[0][1].display).toEqual('_');
          //   expect(board.grid[1][0].display).toEqual('_');
          // });

        });

        describe('resetCounter function', function() {

          it('resets the tile counter to 0 when appropriate', function() {
            $scope.flag(tile);
            $scope.flag(tile);
            $scope.flag(tile);
            $scope.flag(tile);
            $scope.flag(tile);
            expect(tile.counter).toEqual(5);
            $scope.flag(tile);
            expect(tile.counter).toEqual(0);
          });

        });

        describe('gameOver function', function() {

          it('alerts the game is over', function() {
            $scope.gameOver();
            expect(alertSpy.callCount).toEqual(1);
          });

          it('resets the board', function() {
            var resetBoardSpy = sinon.stub($scope, 'resetBoard');
            tile.isMine = true;
            $scope.gameOver(tile);
            expect(resetBoardSpy.callCount).toEqual(1);
          });

        });

        describe('resetBoard function', function() {

          it('resets the board', function() {
            $scope.board = null;
            $scope.resetBoard();
            expect($scope.board).not.toBeUndefined();
          });

        });
      });

      describe('$scope.flag', function() {
        beforeEach(function () {
          tile = new Tile(false, {x: 0, y: 0});
        });

        it('flags the tile', function() {
          $scope.flag(tile);
          expect(tile.display).toEqual(1);
        });

      });

    });
});