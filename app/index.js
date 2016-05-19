const { createStore, applyMiddleware } = require('redux');
const React = require('react');
const ReactDOM = require('react-dom');
const thunkMiddleware = require('redux-thunk').default;
var { TTTBoard } = require('./components/ttt-board');

// Run the Tic Tac Toe game in a seperate worker
// thread so we don't block the main thread.
// When the computer opponent examines its options,
// the recursive operation my block for a few seconds
var worker = new Worker('worker.output.js');

// Listen for messages from the game worker
worker.addEventListener('message',(e) => {
  store.dispatch(e.data);
});

const MAKE_MOVE = 'MAKE_MOVE';
const makeMove = (move) => {
  return (dispatch) => {
    // Notify the reducer to change the state of the page
    dispatch({ type: MAKE_MOVE, move: move });

    // Notify the game worker of the new move
    worker.postMessage({ type: MAKE_MOVE, move: move });
  };
};

const START_GAME = 'START_GAME';
const startGame = () => {
  return (dispatch) => {
    dispatch({ type: START_GAME });
    // Notify the game worker of the start of a new game
    worker.postMessage({ type: START_GAME });
  };
};

const UPDATE_GAME = 'UPDATE_GAME';
const updateGame = (game) => {
  return { type: UPDATE_GAME, game: game };
};

var gameReducer = (state, action) => {
  if (state === undefined) {
    state = {
      board: ['e', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'],
      disabled: true,
      over: false,
      current: 'x'
    };
  }

  switch(action.type){
    case START_GAME:
      return Object.assign({}, state, { disabled: false })
    case MAKE_MOVE:
      // ignore moves when the game is disabled
      if (state.disabled) {
        return state;
      }
      // change state of board
      let board = state.board.slice();
      board[action.move] = 'x';
      return Object.assign({}, state, { board });
    case UPDATE_GAME:
      let game = action.game;
      // disable the game if the game is over
      let disabled = game.over;
      return Object.assign({}, game, { disabled })
    default:
      return state;
  }
};

var app = function (state = {}, action = {}) {
  return {
    game: gameReducer(state.game, action)
  };
};


var store = createStore(app, applyMiddleware(thunkMiddleware));
var Application = (props) => {
  const state = store.getState();

  var { game } = state;
  
  var startButton = () =>
    React.createElement('button', {
      onClick: () => store.dispatch(startGame())
    }, 'Start Game!');

  var gameResult = () =>
    React.createElement('p', null, [
      'Game Over: ', game.tie ? 'Tie!' : `${game.winner} wins!`
    ]);

  var nextPlayer = () =>
    React.createElement('p', null, `Up Next: ${game.current}`);

  return React.createElement('div', null, [
    React.createElement('h1', { className: 'page-header' }, 'Tic Tac Toe'),
    React.createElement('div', { className: 'subheader' }, [
      game.disabled && startButton(),
      game.over && gameResult(),
      !game.disabled && nextPlayer()
    ]),
    React.createElement(TTTBoard, {
      board: game.board,
      onClick: (e, move) => store.dispatch(makeMove(move))
    })
  ]);
};


var mountPoint = document.querySelector('#app');
var render = () =>
  ReactDOM.render(React.createElement(Application), mountPoint);

store.subscribe(render);
render();
