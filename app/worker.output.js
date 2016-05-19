/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/Users/jorgecruz/Development/Playground/react-sample-app/app";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(191);

	var Game = _require.Game;
	var Player = _require.Player;


	var human;
	var opponent;
	var game;

	var postGameUpdate = function postGameUpdate(game) {
	  postMessage({
	    type: 'UPDATE_GAME',
	    game: {
	      board: game.grid.spaces,
	      winner: game.winner(),
	      loser: game.loser(),
	      over: game.over(),
	      tie: game.tie(),
	      current: game.getCurrentPlayer(),
	      next: game.getNextPlayer()
	    }
	  });
	};

	onmessage = function onmessage(e) {
	  switch (e.data.type) {
	    case 'START_GAME':
	      human = new Player('x');
	      opponent = new Player('o');
	      game = new Game({ x: human, o: opponent });
	      postGameUpdate(game);
	      return;
	    case 'MAKE_MOVE':
	      if (!game) return;

	      try {
	        // a human user may attempt to play
	        // an illegal move
	        game = game.makeMove(e.data.move);
	      } finally {
	        postGameUpdate(game);
	      }

	      // make the computer move
	      var best = opponent.chooseMove(game);
	      if ('move' in best) {
	        game = game.makeMove(best.move);
	        postGameUpdate(game);
	      }
	      return;
	  }
	};

/***/ },

/***/ 191:
/***/ function(module, exports) {

	'use strict';

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var WINNING_COMBINATIONS = [
	// rows
	[0, 1, 2], [3, 4, 5], [6, 7, 8],

	// columns
	[0, 3, 6], [1, 4, 7], [2, 5, 8],

	// diagonals
	[0, 4, 8], [2, 4, 6]];

	var Player = function () {
	  function Player(piece) {
	    _classCallCheck(this, Player);

	    this.piece = piece;
	  }

	  _createClass(Player, [{
	    key: 'chooseMove',
	    value: function chooseMove(game) {
	      var _this = this;

	      var isOpponent = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

	      var best = {
	        score: isOpponent ? -2 : 2
	      };

	      if (game.over()) {
	        // won, lost, or all filled
	        if (game.winner() === this.piece) {
	          return { score: 1 };
	        } else if (game.loser() === this.piece) {
	          return { score: -1 };
	        } else {
	          return { score: 0 };
	        }
	      }
	      var nextMoves = game.getLegalMoves();
	      nextMoves.forEach(function (move) {
	        // perform potential move
	        var outcome = game.makeMove(move);
	        var reply = _this.chooseMove(outcome, !isOpponent);
	        if (isOpponent && best.score < reply.score) {
	          best.score = reply.score;
	          best.move = move;
	        } else if (!isOpponent && best.score > reply.score) {
	          best.score = reply.score;
	          best.move = move;
	        }
	      });
	      return best;
	    }
	  }]);

	  return Player;
	}();

	var Grid = function () {
	  function Grid(spaces) {
	    _classCallCheck(this, Grid);

	    this.spaces = spaces;
	  }

	  _createClass(Grid, [{
	    key: 'mark',
	    value: function mark(space, player) {
	      var next = this.spaces.slice();
	      next[space] = player;
	      return new Grid(next);
	    }
	  }, {
	    key: 'complete',
	    value: function complete() {
	      return !this.spaces.includes('e');
	    }
	  }]);

	  return Grid;
	}();

	var getOpponent = function getOpponent(player) {
	  return player === 'x' ? 'o' : 'x';
	};

	var Game = function () {
	  function Game(_ref) {
	    var x = _ref.x;
	    var o = _ref.o;
	    var grid = _ref.grid;
	    var current = _ref.current;

	    _classCallCheck(this, Game);

	    this.x = x;
	    this.o = o;
	    this.current = current || 'x';
	    this.grid = grid || new Grid(['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e']);
	  }

	  _createClass(Game, [{
	    key: 'makeMove',
	    value: function makeMove(nextPlay) {
	      var player = this.current;
	      var legalMoves = this.getLegalMoves();
	      if (!this.over() && legalMoves.includes(nextPlay)) {
	        return new Game({
	          x: this.x,
	          o: this.o,
	          grid: this.grid.mark(nextPlay, player),
	          current: getOpponent(this.current)
	        });
	      } else {
	        throw new Error('Illegal Move');
	      }
	    }
	  }, {
	    key: 'getLegalMoves',
	    value: function getLegalMoves() {
	      var spaces = this.grid.spaces;
	      return spaces.reduce(function (arr, space, i) {
	        if (space === 'e') {
	          arr.push(i);
	        }
	        return arr;
	      }, []);
	    }
	  }, {
	    key: 'getCurrentPlayer',
	    value: function getCurrentPlayer() {
	      return this.current;
	    }
	  }, {
	    key: 'getNextPlayer',
	    value: function getNextPlayer() {
	      return this.current === 'x' ? 'o' : 'x';
	    }
	  }, {
	    key: 'winner',
	    value: function winner() {
	      var _this2 = this;

	      var winner;
	      for (var i = 0; i < WINNING_COMBINATIONS.length; i++) {
	        var combo = WINNING_COMBINATIONS[i];
	        var plays = combo.map(function (location) {
	          return _this2.grid.spaces[location];
	        });

	        // empty space found, this is not a winner
	        // move on
	        if (plays.includes('e')) continue;

	        // compare boxes and determine winner

	        var _plays = _slicedToArray(plays, 3);

	        var tic = _plays[0];
	        var tac = _plays[1];
	        var toe = _plays[2];

	        if (tic === tac && tac === toe) {
	          winner = tic;
	          break;
	        }
	      }
	      return winner;
	    }
	  }, {
	    key: 'loser',
	    value: function loser() {
	      var winner = this.winner();
	      var loser;
	      if (winner) {
	        loser = winner === 'x' ? 'o' : 'x';
	      }
	      return loser;
	    }
	  }, {
	    key: 'tie',
	    value: function tie() {
	      return this.over() && !this.winner();
	    }
	  }, {
	    key: 'over',
	    value: function over() {
	      return this.grid.complete() || this.winner();
	    }
	  }]);

	  return Game;
	}();

	module.exports = {
	  Game: Game,
	  Player: Player
	};

/***/ }

/******/ });