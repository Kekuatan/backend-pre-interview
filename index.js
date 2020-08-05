// Define variable
const { getData } = require("./js/GetData");
const { sum } = require("./js/Calculation");
const { printBoard, solve } = require("./js/Sudoku");
let summary = {};

try {
  let filterData = getData();
  for (const property in filterData) {
    console.log("");
    console.log(`-------- ${property} --------`);
    printBoard(filterData[property]);
    console.log("");
    console.log("Completed solution");
    let gameArr = solve(filterData[property]);
    summary[property] = gameArr[0].slice(0, 3).reduce(function (acc, val) {
      return acc + val;
    }, 0);
    printBoard(gameArr);
    console.log(
      `Sum of first three numbers in the top row (from the left) ${property} : ${summary[property]}`
    );
  }
} catch (e) {
  console.error("Error:", e);
}
let summed = sum(summary);
console.log("");
console.log("-------------------------");
console.log("Sum total of first three number: " + summed);
console.log("-------------------------");
