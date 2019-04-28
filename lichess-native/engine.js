// Author: pdulvp
//var load_engine = require("./node_modules/stockfish/load_engine");

var id = 0;
var stockfish = require("stockfish");
var robot = require("robotjs");


function removeDups(names) {
  let unique = {};
  names.forEach(function(i) {
    if(!unique[i]) {
      unique[i] = true;
    }
  });
  return Object.keys(unique);
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}


var engine = {
	nextmove: function(fen) {
		return new Promise(function(resolve, reject) {
			var stockfishes = [];
			stockfishes[0] = stockfish();
			stockfishes[0].postMessage('setoption name MultiPV value 3');
			//stockfishes[id].postMessage('setoption name Contempt value 10');
			//stockfishes[id].postMessage('setoption name Skill Level value 10');
			stockfishes[0].postMessage('ucinewgame');
			stockfishes[0].postMessage('isready');
			stockfishes[0].postMessage('position fen '+fen);
			stockfishes[0].postMessage('go movetime 3000');

			var messa = [];
			stockfishes[0].onmessage = function (message) {
				if (message.indexOf("info depth")>=0) {
					let nv= message.split(" pv ")[1].split(" ")[0];
					//messa.push(nv);
				}
				if (message.indexOf("bestmove")>=0) {
					let nv= message.split(" ")[1];
					messa.push(nv);
					//console.log(nv);
					var a = removeDups(messa);
					shuffleArray(a)
					resolve(a);
					messa = [];
				}
			}
		});
	}, 
	
	move(position, gridPosition) {
		return new Promise(function(resolve, reject) {
			
			toMove = position;
			//console.log(toMove);
			
			let coords = {x1: toMove.charCodeAt(0) - "a".charCodeAt(0)+1, y1: parseInt(toMove.charAt(1)), x2: toMove.charCodeAt(2) - "a".charCodeAt(0)+1, y2: parseInt(toMove.charAt(3)) };
			//console.log(coords);
			
			// Get mouse position.
			var mouse = robot.getMousePos();
			//console.log(mouse);
			// Get pixel color in hex format.
			//var hex = robot.getPixelColor(mouse.x, mouse.y);
			//console.log("#" + hex + " at x:" + mouse.x + " y:" + mouse.y);
			//robot.setMouseDelay(30);
			
			let gridCoords = {
				x1: Math.floor(gridPosition.left + gridPosition.caseWidth * (coords.x1 - 1) + gridPosition.caseWidth / 2),
				y1: Math.floor(gridPosition.top + gridPosition.caseHeight * (8 - coords.y1) + gridPosition.caseHeight / 2), 
				x2: Math.floor(gridPosition.left + gridPosition.caseWidth * (coords.x2 - 1) + gridPosition.caseWidth / 2),
				y2: Math.floor(gridPosition.top + gridPosition.caseHeight * (8 - coords.y2) + gridPosition.caseHeight / 2)
			};
		 
			robot.setMouseDelay(200);
			robot.moveMouseSmooth(gridCoords.x1, gridCoords.y1);
			robot.mouseClick();
			robot.moveMouseSmooth(gridCoords.x2, gridCoords.y2);
			robot.mouseClick();
			resolve(toMove);
		
		});
	}
};

/*
engine.nextmove("N7/P3pk1p/3p2p1/r4p2/8/4b2B/4P1KP/1R6 w - - 0 34").then(function (e) {
	let toMove = e[0];
	engine.move(toMove, { left: 719.8, top: 196.2, caseWidth: 51.20000000000001, caseHeight: 51.2 });
});*/

module.exports = engine;