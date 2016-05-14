var numTilesWide = 20;
var numTilesTall = 13;
var tileSpace = 30;

var margin = .2;
var tileSize = tileSpace - margin;//(canvasWidth / numTilesWide) - .25;//19.25;
var canvasWidth = numTilesWide * tileSpace;
var canvasHeight = numTilesTall * tileSpace;

var normalTileColor = "#666666";

var stage;// = new createjs.Stage("cluedoCanvas");

var startPositions = [[4,0],[14,0],[0,6],[20,10]];
var board = [];
var currentPosition;// = {x:,y:};
var isTurn = false;
var trialMoves = [];

function drawBoard() {
	var background = new createjs.Shape();
	background.graphics.beginFill("#660066").drawRect(0, 0, 600, 400);
	background.x = 0;
	background.y = 0;
	stage.addChild(background);
	stage.addEventListener("dblclick", clearMoves);

	// initialize board array
	for(i = 0; i < numTilesWide; i++) {
		var tmp = [];
		for (j = 0; j < numTilesTall; j++) {
			tmp.push({});
			//board[i][j] = 
		}
		//board[i] = [numTilesTall];
		board.push(tmp);
	}

	// add tiles
	var tileSpace = canvasWidth / numTilesWide;
	var margin = (tileSpace - tileSize) / 2;
	for(i = 0; i < numTilesWide; i++) {
		board[i] = [];
		for (j = 0; j < numTilesTall; j++) {
			var tile = new createjs.Shape();
			tile.graphics.beginFill(normalTileColor).drawRoundRect(0,0,tileSize,tileSize,1);
			tile.x = (i * (canvasWidth / numTilesWide)) + margin;//tileSize;
			tile.y = (j * (canvasHeight / numTilesTall)) + margin;
			stage.addChild(tile);
			tile.addEventListener("click", onClick);
			//var tcoord = getTileCoord(tile.x, tile.y);
			//board[tcoord[0]][tcoord[1]] = {t: tile};
			board[i][j] = {_tile: tile, id: ("aloha"+i+j)};
			
		}
	}

}

function clearMoves() {
	console.log("number of moves to clear : " + trialMoves.length);
	for (i = 0; i < trialMoves.length; i++) {
		var p = trialMoves[i];
		console.log("clearing tile " + p.x + ", " + p.y);
		var obj = board[p.x][p.y];
			//changeTileColor(obj, "yellow");
		resetTileColor(obj);//board[p.x][p.y]);
	}
	lastTrialPosition = currentPosition;
	trialMoves = [];

	console.log("cleared moves!! " + trialMoves.length)
}

function onClick(evt) {
	var p = getTileCoord(evt.stageX, evt.stageY);
	console.log("hi " + evt.stageX + " " + p.x+ " " + evt.stageY + " " + p.y);
	if (isTurn) {
		if (isValidMove(p)) {
			console.log("valid move!!");
			trialMoves.push(p);
			lastTrialPosition = p;
			console.log("size of trialMoves : " + trialMoves.length)
			//var target = evt.target;
   			//.graphics.clear().beginFill("yellow").drawCircle(0, 0, tileSize / 2).endFill();

			var obj = board[p.x][p.y];
			changeTileColor(obj, "yellow");
			
			//obj._tile.beginFill("green");
		} else {
			console.log("not a valid move!");
		}
	}
}

function changeTileColor(obj, color) {
	obj._tile.graphics.beginFill(color).drawRoundRect(0,0,tileSize-1,tileSize-1,1);
	stage.update();

}

function resetTileColor(obj) {
	changeTileColor(obj, normalTileColor);
}

function isValidMove(coord) {
	console.log("evt: " + coord.x + ", " + coord.y);
	console.log("currentPosition: " + currentPosition.x + ", " + currentPosition.y);

	if (//helperIsValid(coord, currentPosition) 
		 helperIsValid(coord, lastTrialPosition)) {
		return true;
	}/*
	// check that move is valid from current position
	var xMove, yMove;
	var numXMove = Math.abs(currentPosition.x - coord.x);
	if (numXMove == 1)
		xMove = true;
	var numYMove = Math.abs(currentPosition.y - coord.y);
	if (numYMove == 1)
		yMove = true;
	// if not diagonal
	if ((xMove || yMove)
		&& (
		(xMove && numYMove == 0)
		|| (yMove && numXMove == 0))) {
		return true;
	}*/
	return false;
}

function helperIsValid(coord, lastPosition) {
	var xMove, yMove;
	var numXMove = Math.abs(lastPosition.x - coord.x);
	if (numXMove == 1)
		xMove = true;
	var numYMove = Math.abs(lastPosition.y - coord.y);
	if (numYMove == 1)
		yMove = true;
	// if not diagonal
	if ((xMove || yMove)
		&& (
		(xMove && numYMove == 0)
		|| (yMove && numXMove == 0))) {
		return true;
	}
}

function getTileCoord(x, y) {
	var tx = (x - (x % tileSpace)) / tileSpace;
	var ty = (y - (y % tileSpace)) / tileSpace;
	return {x: tx, y: ty};
}

function addRoom(x, y, w, h, color, loc) {
	var room = new createjs.Shape();
	var roomX = x * tileSpace;
	var roomY = y * tileSpace;
	var roomWidth = w * tileSpace;
	var roomHeight = h * tileSpace;
	room.graphics.beginFill(color).drawRoundRect(0,0,roomWidth, roomHeight, 2);
	room.x = roomX;
	room.y = roomY;
	this.stage.addChild(room);

	// remove even listeners from tiles underneath room
	var roomTC = getTileCoord(roomX, roomY);
	for (iw = 0; iw < w; ++iw) {
		for (ih = 0; ih < h; ++ih) {
			console.log("iw : " + iw + ", ih : " + ih);
			//console.log("removing listeners on room " + (roomTC[0]+iw) + ", " + (roomTC[1]+ih));
			var obj = board[roomTC.x+iw][roomTC.y+ih];
			//alert(obj.id);
			if (obj !== undefined && obj.hasOwnProperty("_tile") && obj._tile !== undefined) {
				obj._tile.removeEventListener("click", onClick);
				console.log("removing listeners on room " + (roomTC.x+iw) + ", " + (roomTC.y+ih));
			
			} else {
				console.log("CAN'T REMOVE listener : " + (roomTC.x+iw) + ", " + (roomTC.y+ih));
			}
			
		}
	}
	//console.log("removing listeners on room " + roomTC[0] + ", " + roomTC[1]);
	//board[roomTC[0]][roomTC[1]].tile.removeEventListener("click", onClick);

	// add door
	var doorWidth, doorHeight, doorX, doorY;
	var doorNarrow = tileSize / 4;
	var doorWide = tileSize;

	switch (loc) {
		case "left" : 
				doorX = roomX - (doorNarrow/2);//room.x / 2;
				doorY = roomY;
				doorWidth = doorNarrow;
				doorHeight = doorWide;
			break;

		case "right" :
				doorX = roomX + roomWidth - (doorNarrow/2);//((room.x * tileSpace)+ room.w)  - doorNarrow;
				//alert("room x : " + roomX);
				doorY = roomY;
				doorWidth = doorNarrow;
				doorHeight = doorWide;
				break;

		case "top" :
				doorX = roomX;
				doorY = roomY - (doorNarrow/2);
				doorWidth = doorWide;
				doorHeight = doorNarrow;
				break;

		case "bottom" :
				doorX = roomX;
				doorY = roomY + roomHeight - (doorNarrow/2);
				doorWidth = doorWide;
				doorHeight = doorNarrow;
				//alert("x: " + doorX + " y: " + doorY + "w: " + doorWidth + " h: " + doorHeight);
				break;
		default :
				doorX=5;
				doorY=5;
				doorWidth = 5;
				doorHeight = 5;

			break;
	}
	var door = new createjs.Shape();
	door.graphics.beginFill("black").drawRoundRect(0,0,doorWidth, doorHeight, 2);
	door.x = doorX;// tileSpace;
	door.y = doorY;// * tileSpace;
	this.stage.addChild(door);
}


function init() {
	var canvas = document.getElementById("cluedoCanvas");
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;

	stage = new createjs.Stage("cluedoCanvas");

	drawBoard();
	addRoom(5, 0, 8, 3, "brown", "bottom");
	addRoom(0,0,3,5,"green", "right");
	addRoom(0, 10, 5, 3, "blue", "top");
	addRoom(8,10,5,3,"red", "right");
	addRoom(17,5,3,4,"orange", "top");
	addRoom(11,4,3,5,"cyan", "bottom");
	addRoom(4,5,5,3,"yellow", "top");
	addRoom(15,0,5,4,"fuchsia", "left");
	addRoom(15,10,5,3,"purple", "top");

	// add user
	var circle = new createjs.Shape();
    circle.graphics.beginFill("Crimson").drawCircle(0, 0, tileSize / 2);
    setStartPosition(circle, startPositions[0]);
    stage.addChild(circle);
    var anim = createjs.Tween.get(circle, {loop: true});
    moveSpace(circle,anim);
          
 //   createjs.Ticker.setFPS(60);
  //  createjs.Ticker.addEventListener("tick", stage);
	
	stage.update();

	isTurn = true;
}

function moveSpace(circle, a) {
	//alert(circle.x);
	a.to({x: circle.x + tileSpace}, 1000, createjs.Ease.getPowInOut(4));
         /* .to({alpha: 0, y: 75}, 500, createjs.Ease.getPowInOut(2))
          .to({alpha: 0, y: 125}, 100)
          .to({alpha: 1, y: 100}, 500, createjs.Ease.getPowInOut(2))
          .to({x: 100}, 800, createjs.Ease.getPowInOut(2));*/
}

function setStartPosition(circle, pos) {
	circle.x = (tileSpace * pos[0]) + (tileSpace/2);
	circle.y = (tileSpace * pos[1]) + (tileSpace/2);
	currentPosition = {x: pos[0], y: pos[1]};
	lastTrialPosition = currentPosition;
}

function startTurn() {
	isTurn = true;
}

function endTurn() {
	isTurn = false;
}

