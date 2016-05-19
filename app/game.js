const WINNING_COMBINATIONS = [
  // rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  // columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  // diagonals
  [0, 4, 8],
  [2, 4, 6]
];


class Player {
  constructor(piece){
    this.piece = piece;
  }
  chooseMove(game, isOpponent = true) {
    var best = {
      score: isOpponent ? -2 : 2
    };

    if (game.over()) { // won, lost, or all filled
      if (game.winner() === this.piece) {
        return { score: 1 };
      } else if (game.loser() === this.piece) {
        return { score: -1 };
      } else {
        return { score: 0 };
      }
    }
    var nextMoves = game.getLegalMoves();
    nextMoves.forEach((move) => {
      // perform potential move
      var outcome = game.makeMove(move);
      var reply   = this.chooseMove(outcome, !isOpponent);
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
}

class Grid {
  constructor (spaces) {
    this.spaces = spaces;
  }
  mark (space, player){
    var next = this.spaces.slice();
    next[space] = player;
    return new Grid(next);
  }
  complete() {
    return !this.spaces.includes('e');
  }
}

var getOpponent = (player) => {
  return player === 'x' ? 'o' : 'x';
};

class Game {
  constructor({ x, o, grid, current }) {
    this.x = x;
    this.o = o;
    this.current = current || 'x';
    this.grid = grid || new Grid([
      'e', 'e', 'e',
      'e', 'e', 'e',
      'e', 'e', 'e'
    ]);
  }
  makeMove(nextPlay) {
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
  getLegalMoves() {
    var spaces = this.grid.spaces;
    return spaces.reduce((arr, space, i) => {
      if (space === 'e') { arr.push(i); }
      return arr;
    }, []);
  }
  getCurrentPlayer() {
    return this.current;
  }
  getNextPlayer() {
    return this.current === 'x' ? 'o' : 'x';
  }
  winner () {
    var winner;
    for(var i = 0; i < WINNING_COMBINATIONS.length; i++) {
      let combo = WINNING_COMBINATIONS[i];
      let plays = combo.map((location) => this.grid.spaces[location]);
      
      // empty space found, this is not a winner
      // move on
      if (plays.includes('e')) continue;
      
      // compare boxes and determine winner
      var [tic, tac, toe] = plays;
      if (tic === tac && tac === toe) {
        winner = tic;
        break;
      }
    }
    return winner;
  }
  loser () {
    var winner = this.winner();
    var loser;
    if (winner) {
      loser = winner === 'x' ? 'o' : 'x';
    }
    return loser;
  }
  tie() {
    return this.over() && !this.winner();
  }
  over() {
    return this.grid.complete() || this.winner();
  }
}

module.exports = {
  Game,
  Player
};
