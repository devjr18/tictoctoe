/*
** The Gameboard represents the state of the board
*/

function Gameboard() {
  const rows = 3;
  const columns = 3;
  let board = [];

  // Create a 2d array that will represent the state of the game board
  // For this 2d array, row 0 will represent the top row and
  // column 0 will represent the left-most column.
  // This nested-loop technique is a simple and common way to create a 2d array.
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }
  

  //reset game board
  const resetGameBoard = () => {
    board = [];
    for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }
  }

  const getBoard = () => board;

  const placeMarker = (row, column, player) => {
    
    if(board[row][column].getValue() !== '') return 'invalid';
    
    board[row][column].addMarker(player);
  };

  // This method will be used to print our board to the console.
  // It is helpful to see what the board looks like after each turn as we play,
  // but we won't need it after we build our UI
  const printBoard = () => {
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
    console.log(boardWithCellValues);
  };

  // Here, we provide an interface for the rest of our
  // application to interact with the board
  return { 
    getBoard, 
    placeMarker, 
    printBoard,
    resetGameBoard
  };
};

/*
** A Cell represents one "square" on the board and can have one of
** X: Player One's marker,
** O: Player 2's marker
*/

function Cell() {
  let strValue = '';

  // Accept a player's marker to change the value of the cell
  const addMarker = (player) => {
    strValue = player;
  };

  // How we will retrieve the current value of this cell through closure
  const getValue = () => strValue;

  return {
    addMarker,
    getValue
  };
}


function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();
  
  const players = [
    {
      name: playerOneName,
      marker: 'X',
      scores : 0
    },
    {
      name: playerTwoName,
      marker: 'O',
      scores : 0
    }
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const isWinningPattern = (a, b, c) =>
  a !== '' && a === b && b === c;

  // const isTie = (a, b, c) =>
  // a !== '' && b !== '' && c !== '' && !(a === b && b === c)

  const playRound = (column, row) => {
   
    let makeMove = board.placeMarker(column, row, getActivePlayer().marker);
    let winner = "";
    

    if(makeMove !== "invalid" && winner === ''){
      

      const [row1, row2, row3] = board.getBoard();
      

      for (let i = 0; i < 3; i++) {
        if (
          isWinningPattern(
            row1[i].getValue(),
            row2[i].getValue(),
            row3[i].getValue()
          ) 
        ) {
          winner = getActivePlayer().name;
          return winner;
        }
      } 
        if (
            row1[0].getValue() !== '' &&
            row1[1].getValue() !== '' &&
            row1[2].getValue() !== '' &&
            row2[0].getValue() !== '' &&
            row2[1].getValue() !== '' &&
            row2[2].getValue() !== '' &&
            row3[0].getValue() !== '' &&
            row3[1].getValue() !== '' &&
            row3[2].getValue() !== ''
          ) {
            winner = 'tie';
            return winner;
        }
  
      if (
        isWinningPattern(row1[0].getValue(), row1[1].getValue(), row1[2].getValue()) ||
        isWinningPattern(row2[0].getValue(), row2[1].getValue(), row2[2].getValue()) ||
        isWinningPattern(row3[0].getValue(), row3[1].getValue(), row3[2].getValue())
      ) {
          winner = getActivePlayer().name;
          return winner;
      }

      if (
        isWinningPattern(row1[0].getValue(), row2[1].getValue(), row3[2].getValue()) ||
        isWinningPattern(row1[2].getValue(), row2[1].getValue(), row3[0].getValue())
      ) {
          winner = getActivePlayer().name;
          return winner;
      }
      
    
    // Switch player turn
    switchPlayerTurn();
    
  };
  
};


  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    resetGameBoard: board.resetGameBoard
  };
};

function ScreenController() {
  const game = GameController();
  const boardDiv = document.querySelector('.board');
  const containerDiv = document.querySelector('.container');
  const switchPlayerDiv = document.querySelector('.turn');

  const updateScreen = (winner) => {

    boardDiv.textContent = "";

    const activePlayer = game.getActivePlayer();
    const board = game.getBoard();

    if(!winner) {
      board.forEach((row, rowIndex) => {
        row.forEach((cell, index) => {
          const cellBtn = document.createElement('BUTTON');
          cellBtn.classList.add('cell');

          cellBtn.dataset.column = index;
          cellBtn.dataset.row = rowIndex;
          cellBtn.textContent = cell.getValue();
          boardDiv.appendChild(cellBtn);
        })
      })
    } else {
      board.forEach((row, rowIndex) => {
        row.forEach((cell, index) => {
          const cellBtn = document.createElement('BUTTON');
          cellBtn.classList.add('cell');

          cellBtn.dataset.column = index;
          cellBtn.dataset.row = rowIndex;
          cellBtn.textContent = cell.getValue();
          boardDiv.appendChild(cellBtn);
          cellBtn.disabled = true;
        });
      });
        const resetBtn = document.createElement('BUTTON');
        resetBtn.classList.add('reset-btn');
        resetBtn.textContent = 'RESET';
        containerDiv.appendChild(resetBtn);

        resetBtn.addEventListener('click', () => {

          winner = undefined;
          updateScreen();
          resetBtn.remove();
          game.resetGameBoard();
          updateScreen();
        });
     };
     if(!winner) {
    switchPlayerDiv.textContent = `${activePlayer.name}'s turn...`
    } else if ( winner === 'tie') {
      switchPlayerDiv.textContent = 'Tie!'
      alert(`${(winner).toUpperCase()}!!!`)
    } else {
      switchPlayerDiv.textContent = `The winner is ${winner}`
    }
  };
  function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;

        if (!(selectedColumn && selectedRow)) return;

        let winner = game.playRound(selectedRow, selectedColumn);
        updateScreen(winner);
    }

    boardDiv.addEventListener("click", clickHandlerBoard)
    updateScreen();
};

ScreenController()