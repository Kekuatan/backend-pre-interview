// Define modules
const modules = {};

// Sum calculation
modules.sum = function sum(obj) {
  let sum = 0;
  for (let el in obj) {
    sum += parseFloat(obj[el]);
  }
  return sum;
};

module.exports = modules;
