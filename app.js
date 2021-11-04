const arr = [1, 2, 2, 2, 5, 6, 7, 6, 9, 5];
let result_arr = [];
let obj = {};

arr.forEach(value => !obj[value] ? obj[value] = 1 : obj[value]++);

Object.entries(obj).forEach(value => value[1] > 1 && result_arr.push(parseInt(value[0])))

console.log("RESULT : ", result_arr)