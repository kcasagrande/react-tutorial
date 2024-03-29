import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	return (
		<button
			className="square"
			onClick={props.onClick}
		>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
			value={this.props.squares[i]}
			onClick={() => this.props.onClick(i)}
		/>;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [
				{
					squares: Array(9).fill(null)
				}
			],
			stepNumber: 0,
			xIsNext: true
		};
	}

	handleClick(i) {
		const history = this.state.history;
		const stepNumber = this.state.stepNumber;
		const current = history[stepNumber]
		const squares = current.squares.slice();
		if(squares[i] || determineWinner(squares)) {
			return;
		}
		else {
			squares[i] = this.state.xIsNext ? 'X' : 'O';
			this.setState({
				history: history.slice(0, 1 + stepNumber).concat([{
					squares: squares
				}]),
				stepNumber: stepNumber + 1,
				xIsNext: stepNumber % 2
			});
		}
	}

	jumpTo(move) {
		this.setState({
			stepNumber: move,
			xIsNext: !(move % 2)
		});
		console.log('Jumps to move ' + move);
		return;
	}

  render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = determineWinner(current.squares);
		const moves = history.map((step, move) => {
			const desc = move ? 'Go to move #' + move : 'Go to game start';
			return (<li key={move}><button onClick={() => this.jumpTo(move)}>{desc}</button></li>);
		});

    let status;
		if(winner) {
			status = 'Winner : ' + winner;
		}
		else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
		}

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

function determineWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];
	for(let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
		const [a, b, c] = lines[lineIndex];
		if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

