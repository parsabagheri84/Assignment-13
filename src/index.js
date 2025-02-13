window.addEventListener('DOMContentLoaded', () => {
    const cells = [...document.querySelectorAll('.tile')];
    const turnIndicator = document.querySelector('.display-player');
    const restartBtn = document.querySelector('#reset');
    const messageBox = document.querySelector('.announcer');

    let gameBoard = Array(9).fill('');
    let activePlayer = 'X';
    let gameRunning = true;

    const GAME_RESULTS = {
        X_WIN: 'PLAYER_X_VICTORY',
        O_WIN: 'PLAYER_O_VICTORY',
        DRAW: 'GAME_TIED'
    };

    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    const loadSavedGame = () => {
        const savedBoard = localStorage.getItem('storedBoard');
        const savedPlayer = localStorage.getItem('storedPlayer');
        const savedGameState = localStorage.getItem('storedGameState');

        if (savedBoard) gameBoard = JSON.parse(savedBoard);
        if (savedPlayer) activePlayer = savedPlayer;
        if (savedGameState) gameRunning = JSON.parse(savedGameState);

        gameBoard.forEach((mark, index) => {
            if (mark) {
                cells[index].innerText = mark;
                cells[index].classList.add(`player${mark}`);
            }
        });

        turnIndicator.innerText = activePlayer;
    };

    const saveCurrentGame = () => {
        localStorage.setItem('storedBoard', JSON.stringify(gameBoard));
        localStorage.setItem('storedPlayer', activePlayer);
        localStorage.setItem('storedGameState', JSON.stringify(gameRunning));
    };

    const checkForWinner = () => {
        for (const pattern of winPatterns) {
            const [x, y, z] = pattern;
            if (gameBoard[x] && gameBoard[x] === gameBoard[y] && gameBoard[x] === gameBoard[z]) {
                declareWinner(activePlayer === 'X' ? GAME_RESULTS.X_WIN : GAME_RESULTS.O_WIN);
                gameRunning = false;
                saveCurrentGame();
                return;
            }
        }
        if (!gameBoard.includes('')) {
            declareWinner(GAME_RESULTS.DRAW);
            gameRunning = false;
            saveCurrentGame();
        }
    };

    const declareWinner = (result) => {
        messageBox.innerHTML =
            result === GAME_RESULTS.DRAW ? 'It\'s a tie!' : `Player <span class="player${activePlayer}">${activePlayer}</span> is the winner!`;
        messageBox.classList.remove('hide');
    };

    const isMoveAllowed = (cell) => !['X', 'O'].includes(cell.innerText);

    const updateGameBoard = (index) => {
        gameBoard[index] = activePlayer;
        saveCurrentGame();
    };

    const changeTurn = () => {
        turnIndicator.classList.remove(`player${activePlayer}`);
        activePlayer = activePlayer === 'X' ? 'O' : 'X';
        turnIndicator.classList.add(`player${activePlayer}`);
        turnIndicator.innerText = activePlayer;
        saveCurrentGame();
    };

    const handleCellClick = (cell, index) => {
        if (isMoveAllowed(cell) && gameRunning) {
            cell.innerText = activePlayer;
            cell.classList.add(`player${activePlayer}`);
            updateGameBoard(index);
            checkForWinner();
            if (gameRunning) changeTurn();
        }
    };

    const restartGame = () => {
        gameBoard.fill('');
        gameRunning = true;
        messageBox.classList.add('hide');

        if (activePlayer === 'O') changeTurn();

        cells.forEach(cell => {
            cell.innerText = '';
            cell.classList.remove('playerX', 'playerO');
        });

        localStorage.clear();
    };

    cells.forEach((cell, index) => cell.addEventListener('click', () => handleCellClick(cell, index)));
    restartBtn.addEventListener('click', restartGame);

    loadSavedGame();
});
