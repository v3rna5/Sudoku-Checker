// Bussiness logic.

// Constractor of Map objects (to map the board).
var test =[];
function Board() {
  this.rows = [[], [], [], [], [], [], [], [], []];
  this.columns = [[], [], [], [], [], [], [], [], []];
  this.boxes = [[], [], [], [], [], [], [], [], []];
  this.history = [];
}

// Function to check the value for the duplicates in a row, column and 3 by 3 box.
Board.prototype.getSet = function(num, row, col) {
  if (this.rows[row].includes(num) || this.columns[col].includes(num) || this.boxes[this.toBoxIndex(row, col)].includes(num)) {
    return false;
  } else {
    return true;
  }
};

Board.prototype.fillBoard = function(num, row, col) {
  this.rows[row].push(num);
  this.columns[col].push(num);
  this.boxes[this.toBoxIndex(row, col)].push(num);
  this.history.push([num,row, col]);
}

Board.prototype.emptyCell = function(num, row, col) {
  this.rows[row].pop(num);
  this.columns[col].pop(num);
  this.boxes[this.toBoxIndex(row, col)].pop(num);
  this.history.pop([num,row, col]);
}


Board.prototype.toBoxIndex = function(row, col) {
  return Math.floor(row / 3) * 3 + Math.floor(col/3);
}

Board.prototype.validation = function(input){
  if (!(/^\d+$/.test(input))){
    return false;
  } else if(parseInt(input) > 9 || parseInt(input) < 1) {
    return false;
  } else {
    return true;
  }
}

Board.prototype.generate = function(level) {
  var set = 0;
  var col = 0;
  var row = 0;
  var num = 0;
  while (set < level) {
    col = Math.floor(Math.random() * 9);
    row = Math.floor(Math.random() * 9);
    num = Math.floor(Math.random() * 9 + 1);

    if(!$("input#" + col + row).val()){
      if(this.getSet(num, row, col)) {
        set++;
        this.fillBoard(num, row, col);
        $("input#" + col + row).val(num).prop('disabled', true).addClass('preset');
      }
    }
  }
}

// This function generate random hint, which might be wrong.
Board.prototype.generateHint = function() {
  var set = 0;
  var col = 0;
  var row = 0;
  var num = 0;
  while (set < 1) {
    col = Math.floor(Math.random() * 9);
    row = Math.floor(Math.random() * 9);
    num = Math.floor(Math.random() * 9 + 1);

    if(!$("input#" + col + row).val()){
      if(this.getSet(num, row, col)) {
        set++;
        this.fillBoard(num, row, col);
        $("input#" + col + row).val(num).prop('disabled', true).addClass('presetHint');
      }
    }
  }
}

Board.prototype.solution = function(){
  test = [];
  var key =  $(".square");
  function checkEmpty(){
    for (i = 0; i < 81; i++) {
      if (key[i].value != ""){
      test.push(parseInt(key[i].value));
    } else {test.push(0);}
      }
    }
    checkEmpty();
    console.log(test);

}
function restart(){
  renew();
  timer();
}


var reset;
function timer() {
var time = 0;
var minutes = 0;
reset = setInterval(function(){
  time = time + 1;
  if (time == 60){
    time = 0;
    minutes = minutes + 1
  }
$("#time").text(minutes+":"+time);}, 1000)
}

Board.prototype.refresh = function() {
  for(var i = 0; i < 9; i++) {
    for(var j = 0; j < 9; j++){
      this.rows.pop();
      $("input#" + j + i).val("").prop( "disabled", false).removeClass('preset');
    }
  } clearInterval(reset);
};

function solver(depth, board) {
  console.log(depth);
  if (depth == 81){
    return true;
  }
  var row = Math.floor(depth / 9);
  var col = depth % 9;
  for (var i = 1; i < 10; i++) {
    if (!board.getSet(i, row, col)) {
      continue;
    }
    board.fillBoard(i, row, col);
    if (solver((depth + 1), board)) {
      return true;
    }
    board.emptyCell(i, row, col)
  }
  return false;
}

function solving(){

var value = 1;
var position = [];
var valueini = [];
var row = 0;
var column = 0;
var secondposition =[[row,column]];
var i =0;


while ( i < 81){
console.log("hello");
if (test[i] == 0){
// if (getSet(value,secondposition[secondposition.length-1][0],secondposition[secondposition.length-1][1]) && value < 10){
if (test[i] != 4 && value < 10){
        test[i] = value;
        position.push[i]
        valueini.push(value);
        value = 0;
        i = i+1;
        temppos=[row,column];
        secondposition.push(temppos);
        column = column+1;
        if (column > 8){
          row = row + 1;
          column = 0;
        }

}
else if (value > 8){
          test[i]= 0;
          i = position.pop();
          value = valueini.pop();
          secondpostion.pop();
}
}else {
          i = i+1;
}

          value = value +1;
          console.log(test);
}
}



// UI logic.

$(document).ready(function(){
  var board = new Board();

  console.log(solver(0, board));
  console.log(board);
  board.history.forEach(function(arr){
    console.log(arr[2]);
    $("input#" + arr[2] + arr[1]).val(arr[0]);
  });

  $("#easy").click(function(event){
    event.preventDefault();
    board.refresh();
    board = new Board();
    board.generate(35);
    board.solution();
    console.log(board);
    timer();
    solving();
  })
  $("#medium").click(function(event){
    event.preventDefault();
    //console.log(board);
    board.refresh();
    board = new Board();
    board.generate(31);
    console.log(board);
    timer();
  })
  $("#hard").click(function(event){
    event.preventDefault();
    board.refresh();
    board = new Board();
    board.generate(28);
    console.log(board);
    timer();
  })

  $("#restart").click(function(event) {
    event.preventDefault();
    board.refresh();
  })




  $("table input").keyup(function(e) {
    var $target = $(e.target);
    var userInput = $target.val();

    if(e.keyCode == 8) {
      console.log("hello");
      board.emptyCell($target.val() , $target.data("row"), $target.data("col"));
      console.log(board);
      return;
    }

    if (!board.validation(userInput)){
       alert("Input is out of range");
       $target.val("");
       return;
     };

    userInput = parseInt(userInput);
    console.log($target.data("col"));
    console.log($target.data("row"));
    console.log(userInput);
    var check = board.getSet(userInput, $target.data("row"), $target.data("col"));
    console.log(check);
    if (check) {
      board.fillBoard(userInput , $target.data("row"), $target.data("col"));
      $("input#" + $target.data("col") + $target.data("row")).prop('disabled', false);
    } else {
      $target.val("");
    }
    console.log(board);

  });

  board.solution();

  $("#showhint").click(function(event){
    event.preventDefault();
    board.generateHint();
    console.log(board);
  });


});
