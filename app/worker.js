const { Game, Player } = require('./game.js');


var human;
var opponent;
var game;

var postGameUpdate = (game) => {
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

onmessage = (e) =>{
  switch(e.data.type){
    case 'START_GAME':
      human = new Player('x');
      opponent = new Player('o')
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
      let best = opponent.chooseMove(game);
      if ('move' in best) {
        game = game.makeMove(best.move);
        postGameUpdate(game);
      }
      return;
  }
};
