// Define modules
let modules = {};
const fs = require("fs");
const fileName = "sudoku.txt";

// Get Data from sudoku.txt
modules.getData = function manageData() {
  let data = fs.readFileSync(fileName, "utf8").split("\r\n");
  let prettyData = {};
  let keyName = "";
  data.forEach((item) => {
    if (item.includes("Grid")) {
      prettyData[item] = [];
      keyName = item;
    } else {
      prettyData[keyName].push(item.split("").map(Number));
    }
  });
  return prettyData;
};

module.exports = modules;
