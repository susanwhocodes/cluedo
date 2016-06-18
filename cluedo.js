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
var playerPiece, playerAnimator;
var isTurn = false;
var trialMoves = [];
var doorSelected = false;
var clues;
var roomContainer;
var rooms;
var roomCoords = [];
var lastClickedDoorCoord;
var remainingSpaces = 0, diceTotal = 0;
var currentFactIndex = 0;
var facts = ["Fourty percent of women who leave STEM professions state  a \"macho\" culture as the reason to leave. ",
			"Women are put off from certain jobs, because when they get into said job, their presence is talked about, merely because they are an oddity in the profession.",
			"In certain fields, women perform better than men, yet are put off by the men boasting about how well they did, and the \"masculine\" stereotypes surrounding the jobs.",
			"However, even among women who begin a science-related career, more than half leave by mid-career, double the rate of men.", "The gender bias coerces people into believing that women's labour isn't worth as much as men's labour. Women are taught from a young age, although it has gotten better in recent years, that nursing, education, and childcare are \"feminine\" jobs, and to earn a decent amount of money in male-dominated jobs, such as construction, finance, and business is near impossible. However, we can change that by promoting equality, and to make sure that girls don't feel that any job is impossible for them to achieve." ];

var WIS,WCA,WSE,MIS,MSIYS,MWB, characterSelection, chooseChar, choice; 

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
			tile.addEventListener("click", onTileClick);
			//var tcoord = getTileCoord(tile.x, tile.y);
			//board[tcoord[0]][tcoord[1]] = {t: tile};
			board[i][j] = {_tile: tile, id: ("aloha"+i+j)};
			
		}
	}

}

function clearMoves() {
	console.log("number of moves to clear : " + trialMoves.length);
	console.log("remaining moves : " + remainingSpaces);
	remainingSpaces = diceTotal;
	for (i = 0; i < trialMoves.length; i++) {
		var p = trialMoves[i];
		console.log("clearing tile " + p.x + ", " + p.y);
		var obj = board[p.x][p.y];
			//addTempMove(obj, "yellow");
		//resetTileColor(obj);//board[p.x][p.y]);
		stage.removeChild(obj._selected);

	}
	stage.update();
	lastTrialPosition = currentPosition;
	trialMoves = [];
	console.log("cleared moves!! " + trialMoves.length)
	console.log("remaining moves : " + remainingSpaces);
	
}

function onTileClick(evt) {
	var p = getTileCoord(evt.stageX, evt.stageY);
	console.log("onTileClick: " + evt.stageX + " " + p.x+ " " + evt.stageY + " " + p.y);
	if (isTurn) {
		if (isValidMove(p)) {
			console.log("valid move!!");
			trialMoves.push(p);
			lastTrialPosition = p;
			console.log("size of trialMoves : " + trialMoves.length);
			console.log("lastTrialPosition : " + lastTrialPosition.x + ", " + lastTrialPosition.y);
			//var target = evt.target;
   			//.graphics.clear().beginFill("yellow").drawCircle(0, 0, tileSize / 2).endFill();

			var obj = board[p.x][p.y];
			addTempMove(obj, "#ffff33");//"yellow");
			
			//obj._tile.beginFill("green");
		} else {
			console.log("not a valid move!");
		}
	}
}


function addTempMove(obj, color) {
	//obj._tile.graphics.beginFill(color).drawRoundRect(0,0,tileSize-1,tileSize-1,1);
	obj._selected = new createjs.Shape();
		
	if (doorSelected) {
		obj._selected.graphics.beginFill("#FF0").drawPolyStar(3, 3, (tileSize/2), 5, 0.6, -90);
 		obj._selected.x = obj._tile.x + (tileSize/2);// + obj._tile.width;
		obj._selected.y = obj._tile.y + (tileSize/2);// + obj._tile.height;
	
	} else {
		obj._selected.graphics.beginFill(color).drawRoundRect(3,3,(tileSize-6),tileSize-6,4);
		obj._selected.x = obj._tile.x;
		obj._selected.y = obj._tile.y;
	
	}
	(obj._selected).addEventListener("click", onTempMoveClick);
	stage.addChild(obj._selected);
	stage.update();
	remainingSpaces--;
}

function removeTempMove(obj, fromEnd = false) {
	obj._selected.removeEventListener("click", onTempMoveClick);
	stage.removeChild(obj._selected);
	stage.update();
	if (fromEnd) {
		trialMoves.pop();
	} else {
		trialMoves = trialMoves.slice(1,trialMoves.length - 1);
	}
	remainingSpaces++;
}

function onTempMoveClick(evt) {
	console.log("onTempMoveClick");
	var clickCoord = getTileCoord(evt.stageX, evt.stageY);
	
	//we can only remove the last move
	if (clickCoord.x != lastTrialPosition.x || clickCoord.y != lastTrialPosition.y)
		return;
	console.log("about to remove temp move");
	var obj = board[clickCoord.x][clickCoord.y];
	removeTempMove(obj, true);
	if (trialMoves.length > 0)
		lastTrialPosition = trialMoves[trialMoves.length - 1];
	else
		lastTrialPosition = currentPosition;
	console.log("size of trialMoves : " + trialMoves.length);
			
	obj["_selected"] = undefined;
}

function resetTileColor(obj) {
	addTempMove(obj, normalTileColor);
}

function isValidMove(coord) {
	console.log("evt: " + coord.x + ", " + coord.y);
	console.log("currentPosition: " + currentPosition.x + ", " + currentPosition.y);
	console.log("remaining spaces : " + remainingSpaces);

	if (remainingSpaces <= 0) {
		console.log("no more moves !!!!");
		return false;
	}

	if (//helperIsValid(coord, currentPosition) 
		helperIsValid(coord, lastTrialPosition)) {
		return true;
	}
	return false;
}

function makeMove() {
	// do animation
	//foreach(tm in trialMoves) {
	//	moveSpace(playerAnimator, tm);
	//}
	//trialMoves.forEach(moveIt);
	playerAnimator = createjs.Tween.get(playerPiece, {override: true});
//	
	for(i = 0; i < trialMoves.length; i++) {
		moveIt(trialMoves[i], i, playerAnimator);
	//	var obj = board[trialMoves[i].x][trialMoves[i].y];
	//	removeTempMove(obj, false);
		currentPosition = trialMoves[i];
	}
	if(doorSelected) {
		enterRoom();
	}
	resetTurn();

}

function moveIt(item, index, playerTween) {
	console.log("moving it : " + item.x + ", " + item.y + "  " + item + " index: " + index);
	var dest = getRawCoord(item.x, item.y);
	console.log("raw coord : " + dest.x + ", " + dest.y);
//	playerAnimator = createjs.Tween.get(playerPiece, {override: true});
//	playerAnimator.to({x: dest.x}, 10)
//				  .to({y: dest.y}, 10);//, createjs.Ease.getPowInOut(4));
	playerTween.to({x: dest.x, y: dest.y}, 300, createjs.Ease.getPowInOut(4));
	//playerTween.wait(500);
	//var obj = board[item.x][item.y];
	//stage.update();
	//moveSpace(playerAnimator, trialMoves[index]);
}

function enterRoom() {
	
	var roomMask = new createjs.Shape();
	roomMask.graphics.beginFill("maroon").drawRoundRect(0,0,canvasWidth,canvasHeight,4);
	roomMask.x = 0;
	roomMask.y = 0;
	roomMask.mouseChildren = false;
	roomContainer.addChild(roomMask);
	
	var t = currentFactIndex < facts.length ? facts[currentFactIndex] : "You win!";
	currentFactIndex++;
	console.log("fact: " + t);
	var text = new createjs.Text(t, "20px Arial", "#ff7700");
	text.lineWidth = 400;
 	text.x = 100;
 	text.y = 50;
 	text.textBaseline = "alphabetic";
 	roomContainer.addChild(text);
	stage.addChild(roomContainer);//roomMask);

 	var buttonContainer = new createjs.Container();

 	var button = new createjs.Shape();
 	button.graphics.beginFill("blue").drawRoundRect(0, 0, 100, 30,4);
 	button.x = canvasWidth/2 - 50;
 	button.y = canvasHeight * (3/4);
 	 stage.addChild(button);

 	var buttonLabel = new createjs.Text("Ok", "20px Arial", "#ff7700");
 	buttonLabel.x = button.x + 50;
 	buttonLabel.y = button.y + 15;
 	buttonLabel.textBaseline = "middle";
 	buttonLabel.textAlign = "center";
 	stage.addChild(buttonLabel);

 	buttonContainer.addChild(button);
 	buttonContainer.addChild(buttonLabel);
 	stage.addChild(buttonContainer);

	console.log("button coord : " + button.x + ", " + button.y + " on " + canvasWidth + " x " + canvasHeight);
	buttonContainer.addEventListener("click", handleFactButtonClick);

	resetTurn();


	/*// which room?
	//forEach(var room in roomCoords) {
	for(var i = 0; i < roomCoords.length; i++)
		if (lastClickedDoorCoord.x > room[i].leftX && lastClickedDoorCoord.x < room[i].rightX
			&& lastClickedDoorCoord.y > room[i].topY && lastClickedDoorCoord.y < room[i].bottomY) {

		}
	}*/

	//var results = Container.getObjectsUnderPoint();

	//stage.removeEventListener("dblclick", clearMoves);
}
function handleFactButtonClick(event) {
     // Click Happened.
     console.log("fact button click!");
     stage.removeChild(event.target.parent);
     stage.removeChild(roomContainer);
 }

 function resetTurn() {
 	doorSelected = false;
resetDie();

	clearMoves();
 }

function isTurn() {
	return true;
}

function helperIsValid(coord, lastPosition) {
	if (doorSelected)
		return false;
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

function getRawCoord(x, y) {
	var rx = (tileSpace * x) + (tileSpace/2);
	var ry = (tileSpace * y) + (tileSpace/2);
	return {x: rx, y: ry};
}

function addRoom(x, y, w, h, color, loc, name) {
	var room = new createjs.Shape();
	var roomX = x * tileSpace;
	var roomY = y * tileSpace;
	var roomWidth = w * tileSpace;
	var roomHeight = h * tileSpace;
	room.graphics.beginFill(color).drawRoundRect(0,0,roomWidth, roomHeight, 2);
	room.x = roomX;
	room.y = roomY;
	this.stage.addChild(room);
	roomCoords[name] = {leftX: x, rightX: x+w, topY: y, bottomY: y+h};

	var text = new createjs.Text(name, "20px Arial", "#101010");//"black");//"#ff7700");
 	text.x = room.x + (roomWidth/8);
 	text.y = room.y + (roomHeight/2) + 6;
 	text.textBaseline = "alphabetic";
 	stage.addChild(text);

	// remove even listeners from tiles underneath room
	var roomTC = getTileCoord(roomX, roomY);
	for (iw = 0; iw < w; ++iw) {
		for (ih = 0; ih < h; ++ih) {
			console.log("iw : " + iw + ", ih : " + ih);
			//console.log("removing listeners on room " + (roomTC[0]+iw) + ", " + (roomTC[1]+ih));
			var obj = board[roomTC.x+iw][roomTC.y+ih];
			//alert(obj.id);
			if (obj !== undefined && obj.hasOwnProperty("_tile") && obj._tile !== undefined) {
				obj._tile.removeEventListener("click", onTileClick);
				console.log("removing listeners on room " + (roomTC.x+iw) + ", " + (roomTC.y+ih));
			
			} else {
				console.log("CAN'T REMOVE listener : " + (roomTC.x+iw) + ", " + (roomTC.y+ih));
			}
			
		}
	}
	//console.log("removing listeners on room " + roomTC[0] + ", " + roomTC[1]);
	//board[roomTC[0]][roomTC[1]].tile.removeEventListener("click", onTileClick);

	// add door
	var doorWidth, doorHeight, doorX, doorY;
	var doorNarrow = tileSize / 4;
	var doorWide = tileSize;

	switch (loc) {
		case "left" : 
				doorX = roomX;// + doorNarrow;//room.x / 2;
				doorY = roomY + tileSpace;
				doorWidth = doorNarrow;
				doorHeight = doorWide;
			break;

		case "right" :
				doorX = roomX + roomWidth - doorNarrow;//((room.x * tileSpace)+ room.w)  - doorNarrow;
				//alert("room x : " + roomX);
				doorY = roomY + tileSpace;
				doorWidth = doorNarrow;
				doorHeight = doorWide;
				break;

		case "top" :
				doorX = roomX + tileSpace;
				doorY = roomY;// + doorNarrow;
				doorWidth = doorWide;
				doorHeight = doorNarrow;
				break;

		case "bottom" :
				doorX = roomX + tileSpace;
				doorY = roomY + roomHeight - doorNarrow;
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
	door.addEventListener("click", onDoorClick);
	this.stage.addChild(door);
}

function onDoorClick(evt) {
	var p = getTileCoord(evt.stageX, evt.stageY);
	lastClickedDoorCoord = p;
	console.log("~~onDoorClick: " + evt.stageX + " " + p.x+ " " + evt.stageY + " " + p.y);
	if (isTurn) {
		if (isValidMove(p)) {
			console.log("valid door move!!");
			doorSelected = true;
			//trialMoves.push(p);
			lastTrialPosition = p;
			console.log("size of trialMoves : " + trialMoves.length);
			console.log("lastTrialPosition : " + lastTrialPosition.x + ", " + lastTrialPosition.y);
			//var target = evt.target;
   			//.graphics.clear().beginFill("yellow").drawCircle(0, 0, tileSize / 2).endFill();

			var obj = board[p.x][p.y];
			addTempMove(obj, "#ffff33");//"yellow");
			
			//obj._tile.beginFill("green");
		} else {
			console.log("not a valid move!");
		}
	}
}

function init() {
	var canvas = document.getElementById("cluedoCanvas");
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;

	stage = new createjs.Stage("cluedoCanvas");
	roomContainer = new createjs.Container();

	drawBoard();
	addRoom(5, 0, 8, 3, "brown", "bottom", "Ball Room");
	addRoom(0,0,3,5,"green", "right","Kitchen");
	addRoom(0, 10, 5, 3, "blue", "right","Lounge");
	addRoom(8,10,5,3,"red", "top","Hall");
	
	addRoom(0,6,5,3,"#99FF66", "right","Dining Room");//light green
	addRoom(15,0,5,2,"fuchsia", "bottom","Conservatory");
	addRoom(15,3,5,2,"orange", "top","Billiard Room");
	addRoom(15,6,5,3,"cyan", "left","Library");
	
	addRoom(15,10,5,3,"purple", "top","Study");

	// add user
	playerPiece = new createjs.Shape();
    playerPiece.graphics.beginFill("Crimson").drawCircle(0, 0, tileSize / 2);
    setStartPosition(playerPiece, startPositions[0]);
    stage.addChild(playerPiece);
   stage.update();
   playerAnimator = createjs.Tween.get(playerPiece, {useTicks: true});//, {loop: true});
//    moveSpace(playerPiece,anim);
          
    createjs.Ticker.setFPS(600);
    createjs.Ticker.addEventListener("tick", stage);
	
	isTurn = true;

	WIS = document.getElementById("div1");
	WCA = document.getElementById("div2");
	WSE = document.getElementById("div3");
	MIS = document.getElementById("div4");
	MSIYS = document.getElementById("div5");
	MWB = document.getElementById("div6");
	characterSelection = document.getElementById("characterSelection");
	characterSelection.width = canvasWidth;
	chooseChar = document.getElementById("chooseChar");
}

function moveSpace(dest) {
	//alert(circle.x);
	console.log("moveSpace: " + dest.x + ", " + dest.y);
//	playerAnimator = createjs.Tween.get(playerPiece);//, {loop: true});
	playerAnimator.to({x: dest.x + tileSpace, y: dest.y + tileSpace}, 10, createjs.Ease.getPowInOut(4));
	stage.update();
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

function setPlayerPosition(pos) {
	circle.x = (tileSpace * pos.x) + (tileSpace/2);
	circle.y = (tileSpace * pos.y) + (tileSpace/2);
	currentPosition = {x: pos.x, y: pos.y};
	lastTrialPosition = currentPosition;
}

function startTurn() {
	isTurn = true;
}

function endTurn() {
	isTurn = false;
}

function rollDice(){
    var die1 = document.getElementById("die1");
    var die2 = document.getElementById("die2");
    var status = document.getElementById("status");
    var d1 = Math.floor(Math.random()* 6) + 1 ;
    var d2 = Math.floor(Math.random()* 6) + 1;
    diceTotal = d1 + d2;
    remainingSpaces = diceTotal;
    die1.innerHTML = d1;
    die2.innerHTML = d2;
    status.innerHTML = "You can move "+diceTotal+" spaces.";
    if(d1 == d2){
        status.innerHTML += " DOUBLES! What luck you have. Too bad it doesn't mean anything... "
    }
}

function resetDie() {
	 var die1 = document.getElementById("die1");
    var die2 = document.getElementById("die2");
    var status = document.getElementById("status");
    diceTotal = 0;
    remainingSpaces = diceTotal;
    die1.innerHTML = 0;
    die2.innerHTML = 0;
    status.innerHTML = "You can move "+diceTotal+" spaces.";
    
}


function sayHello() {
	choice = "WomanInSuit";
	WIS.style.display = "block";
	WCA.style.display = "none";
	WSE.style.display = "none";
	MIS.style.display = "none";
	MSIYS.style.display = "none";
	MWB.style.display = "none";
	chooseChar.style.display = "inline";
	chooseChar.disabled = false;
}

function sayHello2() {
	choice = "WomanCrossingArms";
	WCA.style.display = "block";
	WIS.style.display = "none";
	WSE.style.display = "none";
	MIS.style.display = "none";
	MSIYS.style.display = "none";
	MWB.style.display = "none";
	chooseChar.style.display = "inline";
	chooseChar.disabled = false;

}
function sayHello3() {
	choice = "WomanStaringEmotional";
	WSE.style.display = "block";
	WCA.style.display = "none";
	WIS.style.display = "none";
	MIS.style.display = "none";
	MSIYS.style.display = "none";
	MWB.style.display = "none";
	chooseChar.style.display = "inline";
	chooseChar.disabled = false;
}


function sayHello4() {
	choice = "ManWithBucket";
	MIS.style.display = "block"
	WCA.style.display = "none";
	WIS.style.display = "none";
	WSE.style.display = "none";
	MSIYS.style.display = "none";
	MWB.style.display = "none";
	chooseChar.style.display = "inline";
	chooseChar.disabled = false;
}
function sayHello5() {
	choice="ManInScrubs";
	MSIYS.style.display = "block";
	WCA.style.display = "none";
	WIS.style.display = "none";
	WSE.style.display = "none";
	MIS.style.display = "none";
	MWB.style.display = "none";
	chooseChar.style.display = "inline";
	chooseChar.disabled = false;
}

function sayHello6() {
	choice = "ManStaringIntoYourSoul";
	MWB.style.display = "block";
	WCA.style.display = "none";
	WIS.style.display = "none";
	WSE.style.display = "none";
	MIS.style.display = "none";
	MSIYS.style.display = "none";
	chooseChar.style.display = "inline";
	chooseChar.disabled = false;
}

function chooseCharacter() {
	
	console.log("choice : " + choice);
	if (!choice)
		return;
	console.log("choice : " + choice);
	var divs = ["WomanInSuit","WomanCrossingArms", "WomanStaringEmotional", "ManWithBucket", "ManInScrubs", "ManStaringIntoYourSoul"];
	for(var i = 0; i < divs.length; i++) {
		var el = document.getElementById(divs[i]);
		el.style.display = choice == divs[i] ? "block" : "none";
		chooseChar.disabled = true;
		chooseChar.style.display = "none";
	}
	var c = document.getElementById("cluedoCanvas");
	c.style.display = "inline-table";
	characterSelection.style.float = "right";
	var dc = document.getElementById("dieControls");
	dc.style.display = "inline-table";
	var mm = document.getElementById("makeMove");
	mm.style.display = "inline-table";
	mm.style.float = "right";
	mm.style.position = "relative";
	mm.style.top = 0;
}