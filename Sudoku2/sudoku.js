// Pseudo code outline for Sudoku game

// Global variables

const darkModeButton = document.getElementById('dark-mode-button');
const timerElem = document.getElementById('timer');
const cells = document.querySelectorAll('.cell');
const sliderContainer = document.querySelectorAll('.slider-container');

let gameBoard = [];                            	// 2D array to store the Sudoku game board
let solutionBoard = [];                        	// 2D array to store the solution board
let currentDifficulty = 10;               		// Variable to store the current difficulty level
let darkModeEnabled = false;                   	// Variable to store the current dark mode state
let seconds = 0;                          		// Seconds on timer
let minutes = 0;                          		// Minutes on timer
//let timer = setInterval(gameTimer, 1000);
let timeToCreateSudoku = 0;

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
}

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
	let newGameBoard = grid;

	// Shuffle the array randomly
	shuffle(cellsToRemove);

	// Loop through the shuffled array of cell indices
	for (let i = 0; i < cellsToRemove.length && numToRemove > 0; i++) {
		// Determine the row and column of the current cell
		let row = Math.floor(cellsToRemove[i] / 9);
		let col = cellsToRemove[i] % 9;

		// Temporarily remove the value of the cell by setting it to 0
		let temp = newGameBoard[row][col];
		newGameBoard[row][col] = 0;

		// Count the number of solutions to the partially-filled Sudoku puzzle
		let numSolutions = countSolutions(newGameBoard);

		// If there is not exactly one solution, restore the removed value to the cell
		if (numSolutions !== 1) {
			newGameBoard[row][col] = temp;
		}
		// Otherwise, decrement the number of cells to remove
		else {
			numToRemove--;
		}
	}

	return newGameBoard;
};

function generateBoard(gameBoard) {

	// Get the table element from the HTML document
	let boardElement = document.getElementById("board");

	// Create a tbody element
	let tbody = document.createElement("tbody");

	// Define a selected cell object to keep track of the currently selected cell
	let selectedCell = { row: -1, col: -1 };

	// Reset board everytime we initialize a new board
	boardElement.innerHTML = "";

	// Populate the board with cells
	for (let i = 0; i < 9; i++) {
		let row = document.createElement("tr");
		for (let j = 0; j < 9; j++) {
			let cell = document.createElement("td");
			let type = gameBoard[i][j];
			cell.classList.add("cell");

			// Set the value of the cell from the board array
			cell.textContent = gameBoard[i][j] === 0 ? "" : gameBoard[i][j];

			// Add the tabindex attribute to make the cell focusable
			cell.setAttribute("tabindex", 0);

			cell.addEventListener("mouseover", (event) => {
				selectedCell.row = i;
				selectedCell.col = j;
				handleMouseOver(event, selectedCell, boardElement, type);
			});

			cell.addEventListener("mouseout", (event) => {
				selectedCell.row = i;
				selectedCell.col = j;
				handleMouseOut(event, type);
			});

			// Set the row and column indices of the selected cell to the current cell's indices when the cell is clicked
			cell.addEventListener("click", (event) => {
				selectedCell.row = i;
				selectedCell.col = j;
				handleClick(event, selectedCell);
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

function generateSolvedSudoku() {
	// Define a 9x9 empty Sudoku grid
	let grid = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0));

	//console.table(grid);

	// Fill in the diagonal 3x3 squares with random numbers
	for (let i = 0; i < 9; i += 3) {
		fillSquare(grid, i, i);
	}

	solveSudoku(grid);

	// Return a solved sudoku puzzle based on grid
	return grid;
};

// Function to generate a new Sudoku game
function generateNewGame(difficulty) {
	// Clear the game board and solution board
	gameBoard = [];
	solutionBoard = [];

	// Generate a new Sudoku solution
	solutionBoard = generateSolvedSudoku();
	console.table(solutionBoard);

	// Generate a sudoku playable array based on the solution, and difficulty
	gameBoard = removeNumbers(solutionBoard, currentDifficulty);
	console.table(gameBoard);

	// Generate a gameBoard based on solutionBoard (remove values to be playable)
	generateBoard(gameBoard);

	// Render the game board on the HTML page
	//renderGameBoard(gameBoard);

	// Reset the banner state
	//resetBanner();
};

// Function to reset the banner state
function resetBanner() {
	// Hide the banner and reset its text and class
};

// Function to toggle dark mode
function toggleDarkMode() {
	// Toggle the dark mode state
	// Update the CSS styles for dark mode on the HTML page
};

function highlightCells(event, selectedCell, boardElement, type) {
	// Highlight cells in the same row and column
	let highlighted = document.querySelectorAll(".highlighted");
	let current = document.querySelectorAll(".current");

	for (let i = 0; i < 9; i++) {
		let cell = boardElement.rows[i].cells[selectedCell.col];
		if (i !== selectedCell.row) {
			if (darkModeEnabled) {
				cell.classList.add('dark-mode');
				cell.classList.add("highlighted");
			} else {
				cell.classList.add("highlighted");
				cell.classList.remove('dark-mode');
			}
		} else {
			if (darkModeEnabled) {
				cell.classList.add('dark-mode');
				cell.classList.add("current");
			} else {
				cell.classList.add("current");
				cell.classList.remove('dark-mode');
			}
		}
		if (type) {
			//console.log(`Highlighting ${type} at row ${i}, col ${col}`);
		}
	}

	for (let j = 0; j < 9; j++) {
		let cell = boardElement.rows[selectedCell.row].cells[j];
		if (j !== selectedCell.col) {
			if (darkModeEnabled) {
				cell.classList.add('dark-mode');
				cell.classList.add("highlighted");
			} else {
				cell.classList.add("highlighted");
				cell.classList.remove('dark-mode');
			}
		} else {
			if (darkModeEnabled) {
				cell.classList.add('dark-mode');
				cell.classList.add("current");
			} else {
				cell.classList.add("current");
				cell.classList.remove('dark-mode');
			}
		}
		if (type) {
			//console.log(`Highlighting ${type} at row ${row}, col ${j}`);
		}
	}
};

function clearHighlights(event, type) {
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

// Function to handle user guesses
function handleGuess(row, col, value) {
	// Check if the guessed value matches the solution value at the given position
	// If correct, update the game board with the guessed value
	// If incorrect, show a banner indicating the incorrect guess

	// Check if the game is won (all cells filled correctly)
	// If yes, show a banner indicating that the game is won
};

function handleMouseOver(event, selectedCell, boardElement, type) {
	console.log(`Moused over cell (${selectedCell.row}, ${selectedCell.col})`)
	highlightCells(event, selectedCell, boardElement, type);
};

function handleMouseOut(event, type) {
	clearHighlights(event, type);
};

function handleClick(event, selectedCell) {
	// Access the clicked cell using event.target
	let cell = event.target;

	console.log(`Clicked cell (${selectedCell.row}, ${selectedCell.col}) number in this cell should be (${solutionBoard[selectedCell.row][selectedCell.col]})`);

	// Set focus on the clicked cell
	cell.focus();
};

// Function to handle difficulty slider change
function handleDifficultyChange(value) {
	// Update the current difficulty level based on the slider value
	// Generate a new game with the updated difficulty level
};

// Event listeners

// Event listener for new game button
//newGameButton.addEventListener('click', function () {
// Call the generateNewGame function with the current difficulty level
//});

// Event listener for game cell clicks
//gameBoardCells.addEventListener('click', function (event) {
// Get the clicked cell position (row, col)
// Get the guessed value from the user
// Call the handleGuess function with the clicked cell position and guessed value
//});

// Event listener for difficulty slider change
//difficultySlider.addEventListener('input', function (event) {
// Get the value from the difficulty slider
// Call the handleDifficultyChange function with the slider value
//});

// Event listener for toggle dark mode button
//toggleDarkModeButton.addEventListener('click', function () {
// Call the toggleDarkMode function
//});

window.addEventListener("load", function () {
	generateNewGame(currentDifficulty);
});