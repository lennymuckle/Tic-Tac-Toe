function Square(props) {
  // creates component Square.  
  return (
  <button className="square" onClick={props.onClick}>
      {props.value}
      </button>
  // button transforms square into a button
  // props.value makes it so that the value of the square is shown on click    
  );
}

class Board extends React.Component { 
  /* creates component Board (which is the parent of Square), composed of 9 squares. Components take in paramemters called props, and the render method {} returns a React element which is a lightweight description of what you want to see on the screen */
  
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
    />
   );
  }
/* Square's renderSquare method is creating the visual board of 9 squares, the value and onClick props are, respectively, allowing our squares' values from 0 to 8 to be displayed, and registering our clicks when we try to play the game */
  
  render() {  
/* This render method assigns unique values to each square of the board, if they were all assigned the same number they'd all register an X on click no matter which you selected*/
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
  // creates component Game, which is the parent of Board
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      // xIsNext sets the default first mark of the game as 'X'
    };
  }
  /* constructor is used to "initialize state," which is used to "remember" things by setting this.state. In this case our constructor is in the Game component because we've lifted the state first from Square (where it could only show us the value of each button), then to Board (where it could allow us to check for a winner of the game because we maintained the value of each of the 9 squares in Board's single location), and finally to Game (so that we can create a history of moves played in the game) */
  
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  
  render() {
    const history = this.state.history;
    const current =history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    
    const moves = history.map((step, move) => {
      const desc = move ?
            'Go to move #' + move :
            'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    
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
  
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length -1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) { 
      return;                              }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  /* This helper fuction calculates the winner of the game by utilizing the array below. The first three lines correspond to the values of the three rows of the board, the next three lines correspond to the three columns, and the final two lines correspond to the diagonals */
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
      return squares[a];
    }
  }
  return null;
}
