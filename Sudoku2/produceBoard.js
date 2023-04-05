const darkModeButton = document.getElementById('dark-mode-button');
const timerElem = document.getElementById('timer');
const cells = document.querySelectorAll('.cell');
const sliderContainer = document.querySelectorAll('.slider-container');

let board = [];
let seconds = 0;
let minutes = 0;
let timer = setInterval(gameTimer, 1000);
let timeToCreateSudoku = 0;
let difficulty = 30;

// Call the createSudokuPuzzle() function to get the fully solved grid and the modified grid
let solvedBoard = createSudokuPuzzle();

// Function used to shuffle numbers when making a sudoku grid
function shuffle(array) {
    // Loop through the array from the end to the beginning
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index between 0 and i (inclusive)
        let j = Math.floor(Math.random() * (i + 1));

        // Swap the elements at index i and index j
        [array[i], array[j]] = [array[j], array[i]];
    }
};

function setDifficulty() {
    let difficultySlider = document.getElementById("difficulty-slider");
    let difficultyLabel = document.getElementById("difficulty-label");
    let numCellsToRemove;
    switch (difficultySlider.value) {
        case "1":
            numCellsToRemove = 30;
            break;
        case "2":
            numCellsToRemove = 40;
            break;
        case "3":
            numCellsToRemove = 50;
            break;
        default:
            numCellsToRemove = 30;
            break;
    }
    return numCellsToRemove;
}

// Fills one sudoku square
function fillSquare(grid, row, col) {
    // Get an array of the numbers 1-9
    let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    // Shuffle the numbers randomly
    shuffle(nums);

    // Loop through the rows and columns of the 3x3 square
    for (let i = row; i < row + 3; i++) {
        for (let j = col; j < col + 3; j++) {
            // Set the current cell to the first number in the shuffled array
            grid[i][j] = nums.shift();
        }
    }
};

function isValid(grid, row, col, num) {
    // Check if the current value is already in the same row
    for (let i = 0; i < 9; i++) {
        if (grid[row][i] === num) {
            return false;
        }
    }

    // Check if the current value is already in the same column
    for (let j = 0; j < 9; j++) {
        if (grid[j][col] === num) {
            return false;
        }
    }

    // Check if the current value is already in the same 3x3 square
    let startRow = Math.floor(row / 3) * 3;
    let startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[startRow + i][startCol + j] === num) {
                return false;
            }
        }
    }

    // If the current value is not already in the same row, column, or 3x3 square, return true
    return true;
};

function solveSudoku(grid) {
    // Loop through the rows of the Sudoku grid
    for (let row = 0; row < 9; row++) {

        // Loop through the columns of the Sudoku grid
        for (let col = 0; col < 9; col++) {

            // Check if the current cell is empty (has a value of 0)
            if (grid[row][col] === 0) {

                // Loop through the possible values for the current cell (1-9)
                for (let num = 1; num <= 9; num++) {

                    // Check if the current value is valid for the current cell
                    if (isValid(grid, row, col, num)) {

                        // Set the current cell to the current value
                        grid[row][col] = num;

                        // Recursively call solveSudoku to solve the rest of the puzzle
                        if (solveSudoku(grid)) {
                            // If the puzzle is solved, return true
                            return true;
                        } else {
                            // If the puzzle is not solved, backtrack by resetting the current cell to 0
                            grid[row][col] = 0;
                        }
                    }
                }

                // If no value is valid for the current cell, return false
                return false;
            }
        }
    }

    // If all cells are filled in, return true
    return true;
};

function findEmptyCell(grid) {
    // Loop through each cell in the grid
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            // If the cell is empty (has a value of 0), return its coordinates
            if (grid[row][col] === 0) {
                return [row, col];
            }
        }
    }

    // If there are no empty cells, return [-1, -1] to indicate that the grid is full
    return [-1, -1];
};

function solveRecursive(grid, numSolutions) {
    // Find the first empty cell in the grid
    let [row, col] = findEmptyCell(grid);

    // If there are no empty cells, the puzzle is solved
    if (row === -1) {
        numSolutions++;
        return numSolutions;
    }

    // Try each possible value for the empty cell
    for (let val = 1; val <= 9; val++) {
        // If the value is valid for the cell, set it and recursively solve the puzzle
        if (isValid(grid, row, col, val)) {
            grid[row][col] = val;
            numSolutions = solveRecursive(grid, numSolutions);
        }
    }

    // Backtrack by resetting the current cell and returning to the previous cell
    grid[row][col] = 0;

    return numSolutions;
};

function countSolutions(grid) {
    // Clone the grid to avoid modifying the original
    let clonedGrid = JSON.parse(JSON.stringify(grid));

    // Initialize a counter for the number of solutions
    let numSolutions = 0;

    // Call the solveRecursive function to solve the puzzle
    numSolutions = solveRecursive(clonedGrid, numSolutions);

    // Return the number of solutions found
    return numSolutions;
};

function removeNumbers(grid, numToRemove) {
    // Create an array with the indices of all the cells in the grid
    let cellsToRemove = Array.from({ length: 81 }, (_, i) => i);
    // Shuffle the array randomly
    shuffle(cellsToRemove);

    // Loop through the shuffled array of cell indices
    for (let i = 0; i < cellsToRemove.length && numToRemove > 0; i++) {
        // Determine the row and column of the current cell
        let row = Math.floor(cellsToRemove[i] / 9);
        let col = cellsToRemove[i] % 9;

        // Temporarily remove the value of the cell by setting it to 0
        let temp = grid[row][col];
        grid[row][col] = 0;

        // Count the number of solutions to the partially-filled Sudoku puzzle
        let numSolutions = countSolutions(grid);

        // If there is not exactly one solution, restore the removed value to the cell
        if (numSolutions !== 1) {
            grid[row][col] = temp;
        }
        // Otherwise, decrement the number of cells to remove
        else {
            numToRemove--;
        }
    }
};

function createSudokuPuzzle() {
    // Define a 9x9 empty Sudoku grid
    let grid = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0));

    // Fill in the diagonal 3x3 squares with random numbers
    for (let i = 0; i < 9; i += 3) {
        fillSquare(grid, i, i);
    }

    // Make a copy of the fully solved grid
    let solvedGrid = JSON.parse(JSON.stringify(grid));

    // Measure the starting time
    let startTime = Date.now();

    // Solve the complete Sudoku puzzle
    solveSudoku(solvedGrid);

    // Measure the ending time
    let endTime = Date.now();

    // Calculate the elapsed time in milliseconds
    let elapsedTime = endTime - startTime;

    console.log(`Elapsed time: ${elapsedTime} ms`);

    // Remove some numbers to create the puzzle
    let puzzleGrid = JSON.parse(JSON.stringify(solvedGrid));

    removeNumbers(puzzleGrid, difficulty);

    board = puzzleGrid;

    return solvedGrid;
};

// Function to highlight cells in the same row, column, and square
function highlightCells(row, col, boardElement, type) {
    // Highlight cells in the same row and column
    for (let i = 0; i < 9; i++) {
        let cell = boardElement.rows[i].cells[col];
        if (i !== row) {
            cell.classList.add("highlighted");
        } else {
            cell.classList.add("current");
        }
        if (type) {
            //console.log(`Highlighting ${type} at row ${i}, col ${col}`);
        }
    }

    for (let j = 0; j < 9; j++) {
        let cell = boardElement.rows[row].cells[j];
        if (j !== col) {
            cell.classList.add("highlighted");
        } else {
            cell.classList.add("current");
        }
        if (type) {
            //console.log(`Highlighting ${type} at row ${row}, col ${j}`);
        }
    }

    // Highlight cells in the same square
    let squareRow = Math.floor(row / 3) * 3;
    let squareCol = Math.floor(col / 3) * 3;
    for (let i = squareRow; i < squareRow + 3; i++) {
        for (let j = squareCol; j < squareCol + 3; j++) {
            let cell = boardElement.rows[i].cells[j];
            if (i !== row || j !== col) {
                cell.classList.add("highlighted");
            } else {
                cell.classList.add("current");
            }
            if (type) {
                //console.log(`Highlighting ${type} at row ${i}, col ${j}`);
            }
        }
    }
};

function clearHighlights(type) {
    let highlighted = document.querySelectorAll(".highlighted");
    let current = document.querySelectorAll(".current");
    highlighted.forEach((cell) => {
        cell.classList.remove("highlighted");
    });
    current.forEach((cell) => {
        cell.classList.remove("current");
    });
    if (type) {
        //console.log(`Clearing highlights for ${type}`);
    }
};

function isValidInput(value, row, col, board) {
    if (value === solvedBoard[row][col]) {
        console.log(`Clicked (${value}) is correct!`);
        return true;
    }
    return false;
};

// Function to handle user input from keyboard
function handleInput(event, i, j, selectedCell) {
    let inputValue = event.target.value;
    if (isValidInput(inputValue)) {
        board[i][j] = parseInt(inputValue);
        selectedCell.textContent = inputValue;
        selectedCell.classList.remove("error");
    } else {
        selectedCell.classList.add("error");
    }
};

function handleKeyDown(event, row, col, selectedCell) {
    const guessBanner = document.getElementById("guessBanner");
    if (board[row][col] != 0) {
        //console.log(`Can't guess here`);
        return;
    }
    if (selectedCell) {
        if (event.keyCode >= 49 && event.keyCode <= 57) {
            let value = event.keyCode - 48;
            //console.log(`Clicked (${value})`);
            if (isValidInput(value, row, col, board)) {
                board[row][col] = value;
                selectedCell.textContent = value;
                updateBoardTable();
                document.getElementById("guessBanner").innerHTML = "Correct";
                document.getElementById("guessBanner").classList.remove("incorrect");
                document.getElementById("guessBanner").classList.remove("empty");
                document.getElementById("guessBanner").classList.add("correct");
                if (arraysAreEqual(board, solvedBoard)) {
                    clearInterval(timer);
                    setWinBanner();
                }
            } else {
                selectedCell.textContent = "";
                document.getElementById("guessBanner").innerHTML = "Incorrect";
                document.getElementById("guessBanner").classList.remove("correct");
                document.getElementById("guessBanner").classList.remove("empty");
                document.getElementById("guessBanner").classList.add("incorrect");
            }
        } else if (event.keyCode === 8 || event.keyCode === 46) {
            selectedCell.textContent = "";
            board[row][col] = 0;
        }
    }
};

function updateBoardTable() {
    // Get the table element from the HTML document
    let boardElement = document.getElementById("board");

    // Loop through all the table cells and update their text content
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let cell = boardElement.rows[i].cells[j];
            cell.textContent = board[i][j] === 0 ? "" : board[i][j];
        }
    }
};

function createBoardTableVisual() {
    console.log("Board is :");
    console.log(board);

    // Get the table element from the HTML document
    let boardElement = document.getElementById("board");

    // Create a tbody element
    let tbody = document.createElement("tbody");

    // Define a selected cell object to keep track of the currently selected cell
    let selectedCell = { row: -1, col: -1 };

    // Populate the board with cells
    for (let i = 0; i < 9; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < 9; j++) {
            let cell = document.createElement("td");
            let type = board[i][j];
            cell.classList.add("cell");

            // Set the value of the cell from the board array
            cell.textContent = board[i][j] === 0 ? "" : board[i][j];

            // Add the tabindex attribute to make the cell focusable
            cell.setAttribute("tabindex", 0);

            cell.addEventListener("mouseover", () => {
                highlightCells(i, j, boardElement, type);
                selectedCell.row = i;
                selectedCell.col = j;
                //console.log(`Mousing over (${i}, ${j})`);
            });

            cell.addEventListener("mouseout", () => {
                clearHighlights(type);
            });

            // Set the row and column indices of the selected cell to the current cell's indices when the cell is clicked
            cell.addEventListener("click", () => {
                console.log(`Clicked cell (${i}, ${j}) number in this cell should be (${solvedBoard[i][j]})`);
                selectedCell.row = i;
                selectedCell.col = j;
                cell.focus();
                setEmptyBanner();
            });

            cell.addEventListener("keydown", function (event) {
                // Add event listener for keydown events on the cell
                if (selectedCell.row !== -1 && selectedCell.col !== -1) {
                    console.log(`Keydown: ${event.key}`);
                }
                handleKeyDown(event, selectedCell.row, selectedCell.col, selectedCell);
            });

            cell.addEventListener("input", () => {
                handleInput(cell, i, j, selectedCell);
            });

            // Append the cell to the row
            row.appendChild(cell);
        }

        // Append the row to the tbody
        tbody.appendChild(row);
    }

    // Append the tbody to the table
    boardElement.appendChild(tbody);
};

function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    cells.forEach(cell => cell.classList.toggle('dark-mode'));
    sliderContainer.forEach(cell => cell.classList.toggle('dark-mode'));
};

function gameTimer() {
    seconds++;
    if (seconds == 60) {
        seconds = 0;
        minutes++;
    }
    var timerText = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
    document.getElementById("timer").innerHTML = timerText;
};

function newGame() {
    // Log the fully solved grid to the console
    solvedBoard = createSudokuPuzzle();
    console.log("Fully solved grid:");
    console.log(solvedBoard);

    // Log the modified grid with some numbers removed to the console
    console.log("Modified grid with some numbers removed:");
    console.log(board);

    updateBoardTable();
    clearInterval(timer);
    seconds = 0;
    minutes = 0;
    document.getElementById("timer").innerHTML = "00:00";
    timer = setInterval(gameTimer, 1000);

    setEmptyBanner();
};

function setEmptyBanner() {
    let banner = document.getElementById("guessBanner");
    banner.className = "";
    banner.classList.add("empty");
    document.getElementById("guessBanner").innerHTML = "";
};

function setWinBanner() {
    let banner = document.getElementById("guessBanner");
    banner.className = "";
    banner.classList.add("correct");
    document.getElementById("guessBanner").innerHTML = "Congratulations, you won! Would you like to play again?";
};

function arraysAreEqual(arr1, arr2) {
    // Check if the arrays have the same length
    if (arr1.length !== arr2.length) {
        return false;
    }

    // Check if each element of the arrays is identical
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i].length !== arr2[i].length) {
            return false;
        }
        for (let j = 0; j < arr1[i].length; j++) {
            if (arr1[i][j] !== arr2[i][j]) {
                return false;
            }
        }
    }

    // If the arrays have the same length and all elements are identical, they are equal
    return true;
};

window.addEventListener("load", function () {

    // Log the fully solved grid to the console
    console.log("Fully solved grid:");
    console.log(solvedBoard);

    // Log the modified grid with some numbers removed to the console
    console.log("Modified grid with some numbers removed:");
    console.log(board);

    // Set difficulty of the game via the difficulty slider
    difficulty = setDifficulty();
    console.log(`Difficulty is set to (${difficulty})`);
    createBoardTableVisual();
});

document.addEventListener("DOMContentLoaded", function () {
    let difficultySlider = document.getElementById("difficulty-slider");
    let difficultyLabel = document.getElementById("difficulty-label");

    difficultySlider.addEventListener("input", function () {
        switch (difficultySlider.value) {
            case "1":
                difficultyLabel.textContent = "Easy";
                break;
            case "2":
                difficultyLabel.textContent = "Medium";
                break;
            case "3":
                difficultyLabel.textContent = "Hard";
                break;
            default:
                difficultyLabel.textContent = "Easy";
                break;
        }
    })
});