const React = require('react');

var format = (play) => play === 'e' ? '' : play

const TTTBoard = (props) => {
  var { board, onClick } = props;
  board = board ? board : [];
  var handleBoxClick = (e) => {
    var move = parseInt(e.target.getAttribute('data-index'), 10);
    onClick(e, move);
  };

  return React.createElement('div', { className: 'tttboard', onClick: handleBoxClick }, [
    React.createElement('div', { className: 'row' }, [
      React.createElement('div', { className: 'box', 'data-index': 0 }, format(board[0])),
      React.createElement('div', { className: 'box', 'data-index': 1 }, format(board[1])),
      React.createElement('div', { className: 'box', 'data-index': 2 }, format(board[2]))
    ]),
    React.createElement('div', { className: 'row' }, [
      React.createElement('div', { className: 'box', 'data-index': 3 }, format(board[3])),
      React.createElement('div', { className: 'box', 'data-index': 4 }, format(board[4])),
      React.createElement('div', { className: 'box', 'data-index': 5 }, format(board[5]))
    ]),
    React.createElement('div', { className: 'row' }, [
      React.createElement('div', { className: 'box', 'data-index': 6 }, format(board[6])),
      React.createElement('div', { className: 'box', 'data-index': 7 }, format(board[7])),
      React.createElement('div', { className: 'box', 'data-index': 8 }, format(board[8]))
    ])
  ])
}

module.exports = {
  TTTBoard
};
