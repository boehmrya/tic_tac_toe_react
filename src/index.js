import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return (
    <button
      className={this.props.classes}
      onClick={() => props.onClick() }
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        classes={this.props.winnerSquares.includes(i) ? 'winner square' : 'square'}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let rowOne = [];
    let rowTwo = [];
    let rowThree = [];

    for (let i = 0; i < this.props.squares.length; i++) {
      if (i % 3 == 0) {
        for (let j = i; j < i + 3; j++) {
          if (j < 3) {
            rowOne.push(this.renderSquare(j));
          }
          else if (j < 6) {
            rowTwo.push(this.renderSquare(j));
          }
          else {
            rowThree.push(this.renderSquare(j));
          }
        }
      }
    }

    return (
      <div>
        <div className="board-row">
          {rowOne}
        </div>
        <div className="board-row">
          {rowTwo}
        </div>
        <div className="board-row">
          {rowThree}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        location: '',
      }],
      stepNumber: 0,
      xIsNext: true,
      orderAsc: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        location: calculateLocation(i),
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  reOrderMoves() {
    this.setState({
      orderAsc: this.state.orderAsc ? false : true,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.orderAsc ? this.state.history : this.state.history.slice(0).reverse();
    const stepNumber = this.state.orderAsc ? this.state.stepNumber : (history.length - 1 - this.state.stepNumber)
    const current = history[stepNumber];
    const winnerData = calculateWinner(current.squares);
    let winner = '';
    let winnerSquares = [];
    if (winnerData) {
      winner = winnerData[0];
      winnerSquares = winnerData[1];
    }

    const moves = history.map((step, move) => {
      const thisMove = this.state.orderAsc ? move : (history.length - 1 - move);
      const desc = thisMove ?
        'Go to move #' + thisMove :
        'Go to game start';

      return (
        <li key={thisMove}>
          <button onClick={() => this.jumpTo(thisMove)} className={this.state.stepNumber == thisMove ? 'active' : 'not-active'}>{desc}</button>
          <span>{step.location}</span>
        </li>
      );
    });

    const reOrder = this.state.orderAsc ? 'Sort Desc' : 'Sort Asc';

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winnerSquares={winnerSquares}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <button onClick={() => this.reOrderMoves()}>{reOrder}</button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateLocation(i) {
  const row = calculateRow(i);
  const col = calculateCol(i);
  return '(' + col + ',' + row + ')';
}

function calculateRow(i) {
  let row = 0;

  if (i < 3) {
    row = 1;
  }
  else if (i < 6) {
    row = 2;
  }
  else {
    row = 3;
  }

  return row;
}

function calculateCol(i) {
  let col = 0;

  if (i % 3 == 0) {
    col = 1;
  }
  else if (i % 3 == 1) {
    col = 2;
  }
  else {
    col = 3;
  }

  return col;
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return null;
}
