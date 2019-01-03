/*
function a(){
  console.log('A');
}
*/
var a = function(){
  console.log('A');
}

console.log('1');
function slowfunc(callback){
  callback();
}
console.log('2');
slowfunc(a);
console.log('3');
