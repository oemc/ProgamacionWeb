import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'milligram';

const elementClass = ['square', 'circle', 'simple', 'bouncy', 'wave'];

function StyleButton(props){
    return(
        <a onClick = {props.onClick}>
            {props.value}
        </a>
    );
}

class StylesMenu extends React.Component {
    buildmenu(){
        return (
            elementClass.map((style, index) => {
                return(
                <li key = {style}>
                    <StyleButton
                        value = {style}
                        onClick = {() => this.props.onClick(index)}
                    />
                </li>
                );
            })
        );
    }

    render(){
        return(
            <div class='container'>
                <div class='navbar'>
                    <ul>{this.buildmenu()}</ul>
                </div>
            </div>
        );
    }
}

function Square(props) {
    let delay = 0; 
    if (props.style === elementClass[3]){
        delay = (props.number % 3) * 0.07;
    }
    else if(props.style === elementClass[4]){
        delay = props.number * 0.3;
    }
    return( 
        <button 
            className={props.style}
            style={{
                animationDelay: `${delay}s`
            }}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}
  
class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square 
            value={this.props.squares[i]}
            style={this.props.style}
            onClick={() => this.props.onClick(i)}
            number={i}
        />
      );
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
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            XIsNext: true
        }
    }
    
    handleClick(i){
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length-1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext:!this.state.xIsNext
        });
    }

    jumpTo(step){
        this.setState({
            stepNumber:step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const stepNumber = this.state.stepNumber;
        const current = history[stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = history.map((step, move) => {
            let desc = move ? 'Go to move # ' + move : 'Go to game start';
            if (move === stepNumber){
                desc = (<b>{desc}</b>);
            }
            return (
                <li key = {move}>
                    <button onClick= {() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });
        let status;
        if (winner){
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        style={elementClass[this.props.style]}
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
  
function calculateWinner(squares){
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
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            return squares[a];
        }
    }
    return null;
}

class MainPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            style: 0
        }
    }

    changeStyle(i){
        this.setState({
            style: i
        });
    }
    
    render(){
        return(
        <div>
            <StylesMenu
                onClick= {(i) => this.changeStyle(i)}
            />
            <Game
                style = {this.state.style}
            />
        </div>
        )
    }
}
  // ========================================
  
ReactDOM.render(
    <MainPage/>,
    document.getElementById('root')
);
  