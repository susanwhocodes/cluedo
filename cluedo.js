var numTilesWide = 20;
var numTilesTall = 13;
var margin = .2;
var tileSpace = 30;
var tileSize = tileSpace - margin;//(canvasWidth / numTilesWide) - .25;//19.25;
var canvasWidth = numTilesWide * tileSpace;
var canvasHeight = numTilesTall * tileSpace;

var stage;// = new createjs.Stage("cluedoCanvas");
	

function drawBoard() {
	var background = new createjs.Shape();
	background.graphics.beginFill("#660066").drawRect(0, 0, 600, 400);
	background.x = 0;
	background.y = 0;
	stage.addChild(background);

	// add tiles
	var tileSpace = canvasWidth / numTilesWide;
	var margin = (tileSpace - tileSize) / 2;
	for(i = 0; i < numTilesWide; i++) {
		for (j = 0; j < numTilesTall; j++) {
			var tile = new createjs.Shape();
			tile.graphics.beginFill("#666666").drawRoundRect(0,0,tileSize,tileSize,1);
			tile.x = (i * (canvasWidth / numTilesWide)) + margin;//tileSize;
			tile.y = (j * (canvasHeight / numTilesTall)) + margin;
			stage.addChild(tile);
		}
	}
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
	
	stage.update();
}



