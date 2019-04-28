// Author: pdulvp
console.log("hello");


var mutationObserver = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.addedNodes.length>0) {
	
		setTimeout(function (e) {
			console.log("my turn");
			let fen = getFen();
			console.log(fen);
			var browserZoomLevel = window.devicePixelRatio;
			var ele = document.getElementsByClassName("cg-board")[0];
			var rect = ele.getBoundingClientRect();
			var position = { 
				screenX: window.mozInnerScreenX * browserZoomLevel, 
				screenY: window.mozInnerScreenY * browserZoomLevel,
				innerWidth: window.innerWidth * browserZoomLevel,
				innerHeight: window.innerHeight * browserZoomLevel, 
				top: rect.top * browserZoomLevel,
				right: rect.right * browserZoomLevel,
				bottom: rect.bottom * browserZoomLevel,
				left: rect.left * browserZoomLevel, 
				zoom: browserZoomLevel
			};
			
			var gridPosition = {
				fen: fen,
				left: Math.floor(position.screenX + position.left),
				top: Math.floor(position.screenY + position.top),
				caseWidth: Math.floor(Math.abs((position.right-position.left)/8)), 
				caseHeight: Math.floor(Math.abs((position.bottom-position.top)/8))
			};
			browser.runtime.sendMessage(gridPosition);
		}, 600);

	} else {
		console.log("your turn");
	}
  });
});

// Starts listening for changes in the root HTML element of the page.
mutationObserver.observe(document.getElementsByClassName("whos_turn")[1], {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
  attributeOldValue: true,
  characterDataOldValue: true
});




function reduceFenLine(id) {
	let result = id.join("");
	result = result.replace(/00000000/g, "8");
	result = result.replace(/0000000/g, "7");
	result = result.replace(/000000/g, "6");
	result = result.replace(/00000/g, "5");
	result = result.replace(/0000/g, "4");
	result = result.replace(/000/g, "3");
	result = result.replace(/00/g, "2");
	result = result.replace(/0/g, "1");
	return result;
}

function getFen() {
	var pieces = document.getElementsByClassName("cg-board")[0].getElementsByTagName("piece");

	var cases = [];
	for (let y=0; y<8; y++) {
		cases[y] = Array(8).fill("0");
	}

	for (i in pieces) {
		if (pieces[i].tagName =="PIECE") {
			let player = pieces[i].classList.contains("black");
			let playerR = pieces[i].style.transform;
			let playerX = playerR.split("px, ")[0].split("(")[1];
			let playerY = playerR.split("px, ")[1].split("px)")[0];
			let data = { x: (playerX / 64), y: (playerY / 64), p: pieces[i].classList[0], t: pieces[i].classList[1][0] } ;
			if (pieces[i].classList[1] == "knight") {
				data.t = "n";
			}
			if (data.p == "white") {
				data.t = data.t.toUpperCase();
			}
			cases[data.y][data.x]=data.t;
		}
	}

	return cases.map(arr => reduceFenLine(arr)).join("/");
}

