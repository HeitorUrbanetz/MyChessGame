"use strict";

let board = null;
let $board = $("#myBoard");
let game = new Chess();
let $status = $("#status");
let $fen = $("#fen");
let $pgn = $("#pgn");
let whiteSquareGrey = "#a9a9a9";
let blackSquareGrey = "#696969";
let squareToHighLight = null;
let colorToHighLight = null;
let squareClass = "square-55d63";

// function removeHighlights(color) {
//   $board.find("." + squareClass).removeClass("highlight-" + color);
// }

// function highlight() {
//   // highligth black's move
//   removeHighlights("black");
//   $board.find(".square-" + move.from).addClass("highlight-black");
//   squareToHighLight = move.to;

//   //hightlight white's move
//   removeHighlights("white");
//   $board.find(".square-" + source).addClass("highlight-white");
//   $board.find(".square-" + target).addClass("highlight-white");
// }

function removeGreySquares() {
  $("#myBoard .square-55d63").css("background", "");
}

function greySquare(square) {
  let $square = $("#myBoard .square-" + square);

  let background = whiteSquareGrey;
  if ($square.hasClass("black-3c85d")) {
    background = blackSquareGrey;
  }

  $square.css("background", background);
}

function onDragStart(source, piece, position, orientation) {
  // dont pick up pieces if the game is over
  if (game.game_over()) return false;

  // only pick up pieces for the side to move
  if (
    (game.turn() === "w" && piece.search(/^b/) !== -1) ||
    (game.turn() === "b" && piece.search(/^w/) !== -1)
  ) {
    return false;
  }
}

function onDrop(source, target) {
  // see if move is legal
  let move = game.move({
    from: source,
    to: target,
    promotion: "q",
  });

  // ilegal move
  if (move === null) return "snapback";

  updateStatus();
}

function onMouseoverSquare(square, piece) {
  let moves = game.moves({
    square: square,
    verbose: true,
  });

  if (moves.length === 0) return;

  greySquare(square);

  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to);
  }
}

function onMouseoutSquare(square, piece) {
  removeGreySquares();
}

function onSnapEnd() {
  board.position(game.fen());
}

function updateStatus() {
  let status = "";

  let moveColor = "Branco";
  if (game.turn() === "b") {
    moveColor = "Preto";
  }

  // checkmate?
  if (game.in_checkmate()) {
    status = "Acabou o Jogo, " + moveColor + " é um checkmate.";
  }

  // draw?
  else if (game.in_draw()) {
    status = "Acabou o jogo, é um empate";
  }

  //game still on
  else {
    status = moveColor + " jogue";

    // check?
    if (game.in_check()) {
      status += ", " + moveColor + " é um check";
    }
  }

  $status.html(status);
  $fen.html(game.fen());
  $pgn.html(game.pgn());
}

let config = {
  draggable: true,
  position: "start",
  dropOffBoard: "snapback",
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd,
};

board = ChessBoard("myBoard", config);
$("#startBtn").on("click", board.start);
$("#clearBtn").on("click", board.clear);

updateStatus();
// highlight();
