import React from 'react';
import ReactDOM from 'react-dom';
require('./main.css');

function Square(props) {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, j) {
    return <Square key={j} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }

  render() {
    let boardRows = [], boardRow = [];
    for (let i=0; i<3; i++) {
      boardRow = [];
      for (let j=0; j<3; j++) {
        boardRow.push(this.renderSquare(j+3*i, j));
      }
      boardRows.push(
        <div className="board-row" key={i}>
          {boardRow}
        </div>
      );
    }
    return (
      <div>
        {boardRows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
      stepNumber: 0,
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
        squares: squares
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Победитель: ' + winner;
    } else {
      status = 'Следующий игрок: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const moves = history.map((step, move) => {
      const desc = move ?
        'Ход #' + move :
        'Начало игры';
      let activeMove = 'item';
      if (move === this.state.stepNumber) {
        activeMove += ' active';
      }
      return (
        <li className={activeMove} key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('container')
);

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
  for (let i=0; i<lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
