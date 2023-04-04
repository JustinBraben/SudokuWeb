let board = [];

function shuffle(array) {
    // Loop through the array from the end to the beginning
    for (let i = array.length - 1; i > 0; i--) {
        // Generate a random index between 0 and i (inclusive)
        let j = Math.floor(Math.random() * (i + 1));

        // Swap the elements at index i and index j
        [array[i], array[j]] = [array[j], array[i]];
    }
}
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
}
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
}
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
}

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
}
function countSolutions(grid) {
    // Clone the grid to avoid modifying the original
    let clonedGrid = JSON.parse(JSON.stringify(grid));

    // Initialize a counter for the number of solutions
    let numSolutions = 0;

    // Call the solveRecursive function to solve the puzzle
    numSolutions = solveRecursive(clonedGrid, numSolutions);

    // Return the number of solutions found
    return numSolutions;
}
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
}
function createSudokuPuzzle() {
    // Define a 9x9 empty Sudoku grid
    let grid = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0));

    // Fill in the diagonal 3x3 squares with random numbers
    for (let i = 0; i < 9; i += 3) {
        fillSquare(grid, i, i);
    }

    // Make a copy of the fully solved grid
    let solvedGrid = JSON.parse(JSON.stringify(grid));

    // Solve the complete Sudoku puzzle
    solveSudoku(solvedGrid);

    // Remove some numbers to create the puzzle
    let puzzleGrid = JSON.parse(JSON.stringify(solvedGrid));
    removeNumbers(puzzleGrid, 40);

    board = puzzleGrid;

    return { solvedGrid, puzzleGrid };
}

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
}

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
}

// Function to handle user input from keyboard
function handleInput(cell, i, j) {
    const value = parseInt(cell.textContent);
    if (!isNaN(value)) {
        board[i][j] = value;
    } else {
        board[i][j] = 0;
    }
}

function handleKeyDown(event, i, j) {
    switch (event.code) {
        case "ArrowUp":
            if (i > 0) {
                document.getElementById(`cell-${i - 1}-${j}`).focus();
            }
            break;
        case "ArrowDown":
            if (i < 8) {
                document.getElementById(`cell-${i + 1}-${j}`).focus();
            }
            break;
        case "ArrowLeft":
            if (j > 0) {
                document.getElementById(`cell-${i}-${j - 1}`).focus();
            }
            break;
        case "ArrowRight":
            if (j < 8) {
                document.getElementById(`cell-${i}-${j + 1}`).focus();
            }
            break;
        default:
            if (event.keyCode >= 48 && event.keyCode <= 57) {
                board[i][j] = parseInt(event.key);
            } else {
                event.preventDefault();
            }
            break;
    }
}


function createBoardTableVisual() {
    console.log("Board is :");
    console.log(board);

    // Get the table element from the HTML document
    let boardElement = document.getElementById("board");

    // Create a tbody element
    let tbody = document.createElement("tbody");

    // Populate the board with cells
    for (let i = 0; i < 9; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < 9; j++) {
            let cell = document.createElement("td");
            let type = board[i][j];
            cell.classList.add("cell");

            // Set the value of the cell from the board array
            cell.textContent = board[i][j] === 0 ? "" : board[i][j];

            // Add click event listener to the cell
            cell.addEventListener("click", function () {
                // Handle the click event here
                console.log(`Clicked cell (${i}, ${j})`);
            });

            cell.addEventListener("mouseover", () => {
                highlightCells(i, j, boardElement, type);
            });

            cell.addEventListener("mouseout", () => {
                clearHighlights(type);
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

window.addEventListener("load", function () {
    // Call the createSudokuPuzzle() function to get the fully solved grid and the modified grid
    const { solvedGrid, puzzleGrid } = createSudokuPuzzle();

    // Log the fully solved grid to the console
    console.log("Fully solved grid:");
    console.log(solvedGrid);

    // Log the modified grid with some numbers removed to the console
    console.log("Modified grid with some numbers removed:");
    console.log(puzzleGrid);

    createBoardTableVisual();
});