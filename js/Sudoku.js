// Define modules
const modules = {};

// Mapping for sudoku board square
const squareCoordinates = [
  [1, 1, 1, 2, 2, 2, 3, 3, 3],
  [1, 1, 1, 2, 2, 2, 3, 3, 3],
  [1, 1, 1, 2, 2, 2, 3, 3, 3],
  [4, 4, 4, 5, 5, 5, 6, 6, 6],
  [4, 4, 4, 5, 5, 5, 6, 6, 6],
  [4, 4, 4, 5, 5, 5, 6, 6, 6],
  [7, 7, 7, 8, 8, 8, 9, 9, 9],
  [7, 7, 7, 8, 8, 8, 9, 9, 9],
  [7, 7, 7, 8, 8, 8, 9, 9, 9],
];

// Get single character from data base on set row
function getRow(board, row) {
  return board[row];
}

// Print value data on each cell
function printCell(value) {
  if (Array.isArray(value)) {
    return ".";
  } else if (value == 0) {
    return ".";
  } else {
    return value;
  }
}

// Return all cell in sudoku column
function getColumn(board, column) {
  let col = [];
  for (let row = 0; row < 9; row++) {
    col.push(board[row][column]);
  }
  return col;
}

// Return all cell in sudoku square
function getSquare(board, square) {
  let cells = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (square == squareCoordinates[r][c]) {
        cells.push(board[r][c]);
      }
    }
  }
  return cells;
}

// Convert every gap into an array of possibilities
function completeCell(board, r, c) {
  let used = [
    ...getRow(board, r),
    ...getColumn(board, c),
    ...getSquare(board, squareCoordinates[r][c]),
  ];

  let possibilities = [];
  for (let p = 1; p <= 9; p++) {
    if (!used.includes(p)) {
      possibilities.push(p);
    }
  }
  if (possibilities.length == 1) {
    // If there is only one valid possibility, update board value
    board[r][c] = possibilities[0];
    return true;
  } else {
    board[r][c] = possibilities;
    return false;
  }
}
// Look out for any possibility that appears as a possibility once-only in the row, column, or quadrant.
function appearsOnceOnly(board, possibilities, segment, r, c) {
  let updated = false;
  for (let i = 0; i < possibilities.length; i++) {
    let possibility = possibilities[i];
    let counter = 0;
    segment.forEach((cell) => {
      if (Array.isArray(cell)) {
        if (cell.includes(possibility)) {
          counter++;
        }
      } else {
        if (cell == possibility) {
          counter++;
        }
      }
    });
    if (counter == 1) {
      board[r][c] = possibility;
      updated = true;
      break;
    }
  }
  return updated;
}

// Compare result
function compare(expected, actual) {
  let array1 = expected.slice();
  let array2 = actual.slice();
  return (
    array1.length === array2.length &&
    array1.sort().every(function (value, index) {
      return value === array2.sort()[index];
    })
  );
}

// Check if it solved
function isSolved(board) {
  let expected = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let valid = true;
  // Check all of the rows
  for (let r = 0; r < 9 && valid == true; r++) {
    if (!compare(expected, getRow(board, r))) {
      valid = false;
    }
  }
  // Check all of the columns
  for (let c = 0; c < 9 && valid == true; c++) {
    if (!compare(expected, getColumn(board, c))) {
      valid = false;
    }
  }
  // Check all of the quadrants
  for (let q = 1; q < 9 && valid == true; q++) {
    if (!compare(expected, getSquare(board, q))) {
      valid = false;
    }
  }
  return valid;
}

// Look posibilities with backtrack method if normal method failed
function backtrackBased(origBoard) {
  // Create a temporary board for our recursion.
  let board = JSON.parse(JSON.stringify(origBoard));

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      // Process each incomplete cell
      if (board[r][c] == 0) {
        completeCell(board, r, c);
        if (isSolved(board)) return board;
        let cell = board[r][c];
        // If we just created a list of possibilities, iterate them and recurse
        if (Array.isArray(cell)) {
          for (let i = 0; i < cell.length; i++) {
            // Create a temporary board for each recursion.
            let board2 = JSON.parse(JSON.stringify(board));
            // Choose a value
            board2[r][c] = cell[i];
            // Recurse again using new board
            let completedBoard = backtrackBased(board2);
            if (completedBoard) {
              return completedBoard;
            }
          }
          return false;
        }
      }
    }
  }

  return false;
}

// Look posibilities with normal method
// 100% can only be a single value.
function oneValueCellConstraint(board) {
  // Set to false at the start of the loop
  let updated = false;

  // Convert every gap into an array of possibilities
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] == 0) {
        updated = completeCell(board, r, c) || updated;
      }
    }
  }

  // Look out for any possibility that appears as a possibility
  // once-only in the row, column, or quadrant.
  // If it does, fill it in!
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (Array.isArray(board[r][c])) {
        let possibilities = board[r][c];
        updated =
          appearsOnceOnly(board, possibilities, getRow(board, r), r, c) ||
          appearsOnceOnly(board, possibilities, getColumn(board, c), r, c) ||
          appearsOnceOnly(
            board,
            possibilities,
            getSquare(board, squareCoordinates[r][c]),
            r,
            c
          ) ||
          updated;
      }
    }
  }

  // Reinitialize gaps back to zero before ending
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (Array.isArray(board[r][c])) {
        board[r][c] = 0;
      }
    }
  }

  return updated;
}

modules.solve = function (board) {
  let updated = true,
    solved = false;

  // Looks all posibilities with normal method
  while (updated && !solved) {
    updated = oneValueCellConstraint(board);
    solved = isSolved(board);
  }

  // If normal method fail use brute force.
  if (!solved) {
    board = backtrackBased(board);
    solved = isSolved(board);
  }

  return board;
};

// Print sudoku board
modules.printBoard = function (gameArr) {
  for (let i = 0; i < 9; i++) {
    let row = getRow(gameArr, i);
    if (i % 3 == 0) {
      console.log("|=======|=======|=======|");
    }
    console.log(
      "|",
      printCell(row[0]),
      printCell(row[1]),
      printCell(row[2]),
      "|",
      printCell(row[3]),
      printCell(row[4]),
      printCell(row[5]),
      "|",
      printCell(row[6]),
      printCell(row[7]),
      printCell(row[8]),
      "|"
    );
  }
  console.log("|=======|=======|=======|");
};

module.exports = modules;
