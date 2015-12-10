var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var stats_canvas = document.getElementById("stats_canvas");
var stats_ctx = stats_canvas.getContext("2d");
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Never Ending Sharks
// Variables for the new sliders
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
var NONCONFORM_square = 1.00;
var BIAS_square = 0.33;
var NONCONFORM_triangle = 1.00;
var BIAS_triangle = 0.33;
var NONCONFORM_circle = 1.00;
var BIAS_circle = 0.33;
var circleSlider;
var squareSlider;
var triangleSlider;
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!>
var TILE_SIZE = 30;
var PEEP_SIZE = 30;
var GRID_SIZE = 20;
var DIAGONAL_SQUARED = (TILE_SIZE+5)*(TILE_SIZE+5) + (TILE_SIZE+5)*(TILE_SIZE+5);

window.RATIO_TRIANGLES = 0.25;
window.RATIO_SQUARES = 0.25;
//window.RATIO_PENTAGONS = 0.25;
//window.EMPTINESS = 0.25;


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// NEVER ENDING SHARKS
window.RATIO_CIRCLES = 0.25;
// new pairwise ratios - needed for graph
window.RATIO_TRIANGLES_TO_SQUARES = window.RATIO_TRIANGLES /window.RATIO_SQUARES;
window.RATIO_TRIANGLES_TO_CIRCLES = window.RATIO_TRIANGLES /window.RATIO_CIRCLES;
window.RATIO_SQUARES_TO_CIRCLES = window.RATIO_SQUARES /window.RATIO_CIRCLES;
window.RATIO_SQUARES_TO_TRIANGLES = window.RATIO_SQUARES /window.RATIO_TRIANGLES;
window.RATIO_CIRCLES_TO_SQUARES = window.RATIO_CIRCLES /window.RATIO_SQUARES;
window.RATIO_CIRCLES_TO_TRIANGLES = window.RATIO_CIRCLES /window.RATIO_TRIANGLES;
window.EMPTINESS = 0.25;

//var runTime = document.getElementById("runTime");
//runTime.innerHTML = 0;
//var numMoves = document.getElementById("numMoves");
//numMoves.innerHTML = 0;
//var goodMoves = document.getElementById("goodMoves");
//goodMoves.innerHTML = 0;


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
var assetsLeft = 0;
var onImageLoaded = function(){
	assetsLeft--;
};

var images = {};
function addAsset(name,src){
	assetsLeft++;
	images[name] = new Image();
	images[name].onload = onImageLoaded;
	images[name].src = src;
}
addAsset("yayTriangle","../img/yay_triangle.png");
addAsset("mehTriangle","../img/meh_triangle.png");
addAsset("sadTriangle","../img/sad_triangle.png");
addAsset("yaySquare","../img/yay_square.png");
addAsset("mehSquare","../img/meh_square.png");
addAsset("sadSquare","../img/sad_square.png");

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// NEVER ENDING SHARKS
//New code added here for circle image files
addAsset("yayCircle","../img/yay_circle.png");
addAsset("mehCircle","../img/meh_circle.png");
addAsset("sadCircle","../img/sad_circle.png");

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!



// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// NEVER ENDING SHARKS
//Code to allow easy addition and playing of sounds
var sounds = {};
function addSound(id,src){
	sounds[id] = new Audio(src);
	if(id == 0){
		sounds[id].loop = true;
	}

	sounds[0].muted = true;
	document.getElementById("muted_music").classList.add("mute_mus");
}
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// NEVER ENDING SHARKS
//Lets any sound clip be muted, differentiates between background music and sound effects
function muteSound(name){
	if(name == 0){
		sounds[0].muted = !sounds[0].muted;
		if(sounds[0].muted == true){
			document.getElementById("muted_music").classList.add("mute_mus");
		}
		else{
			document.getElementById("muted_music").classList.remove("mute_mus");
		}
	}
	else{
		for(var i = name; i < 5; i++){
			sounds[i].muted = !sounds[i].muted;
		}
		if(sounds[1].muted == true){
			document.getElementById("muted_effects").classList.add("mute_eff");
		}
		else{
			document.getElementById("muted_effects").classList.remove("mute_eff");
		}
	}
}
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// NEVER ENDING SHARKS
//Adds the sounds used to the program
addSound(0,"../music/background.mp3");
addSound(1,"../music/start.mp3");
addSound(2,"../music/end.mp3");
addSound(3,"../music/grab.mp3");
addSound(4,"../music/sad.mp3");
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

var IS_PICKING_UP = false;
var lastMouseX, lastMouseY;

function Draggable(x,y){

	var self = this;
	self.x = x;
	self.y = y;
	self.gotoX = x;
	self.gotoY = y;
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //Never ending sharks - Bryan
    //Variables needed for box select code
    self.distFromMouseX = 0;
    self.distFromMouseY = 0;
    self.emptiesSelf = [];
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

	var offsetX, offsetY;
    self.pickupX = 0;
    self.pickupY = 0;
    self.wasDropped = false;

	self.pickup = function(){
        self.wasDropped = true;

		// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		// NEVER ENDING SHARKS
		sounds[3].play();
		// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

		IS_PICKING_UP = true;

		self.pickupX = (Math.floor(self.x/TILE_SIZE)+0.5)*TILE_SIZE;
		self.pickupY = (Math.floor(self.y/TILE_SIZE)+0.5)*TILE_SIZE;
		offsetX = Mouse.x-self.x;
		offsetY = Mouse.y-self.y;
		self.dragged = true;

		// Dangle
		self.dangle = 0;
		self.dangleVel = 0;

		// Draw on top
		var index = draggables.indexOf(self);
		draggables.splice(index,1);
		draggables.push(self);

	};

	self.drop = function(){

		IS_PICKING_UP = false;
        self.wasDropped = true;

		var px = Math.floor(Mouse.x/TILE_SIZE);
		var py = Math.floor(Mouse.y/TILE_SIZE);
		if(px<0) px=0;
		if(px>=GRID_SIZE) px=GRID_SIZE-1;
		if(py<0) py=0;
		if(py>=GRID_SIZE) py=GRID_SIZE-1;
		var potentialX = (px+0.5)*TILE_SIZE;
		var potentialY = (py+0.5)*TILE_SIZE;

		var spotTaken = false;
		for(var i=0;i<draggables.length;i++){
			var d = draggables[i];
			if(d==self) continue;
			var dx = d.x-potentialX;
			var dy = d.y-potentialY;
			if(dx*dx+dy*dy<10){
				spotTaken=true;
				break;
			}
		}

		if(spotTaken){
			self.gotoX = self.pickupX;
			self.gotoY = self.pickupY;
		}else{

			STATS.steps++;
			writeStats();

			self.gotoX = potentialX;
			self.gotoY = potentialY;
		}

		self.dragged = false;

	}

	var lastPressed = false;

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //Never ending sharks - Bryan
    //Added code for box select movement functions, adapted from existing and Jeff's code
    //DragUpdate - Moves each polygon to an offset from the mouse position.
    self.dragUpdate = function(){
        self.x = Mouse.x - self.distFromMouseX;
        self.y = Mouse.y - self.distFromMouseY;
    }

    //BoxMoveClosest - Moves the polygon to the closest empty spot
    //Implementation explained in further detail below
    self.boxMoveClosest = function(){
        //Modified Jeff's code for putting down box select guys
        // Find the closest empty spot and move there
		// First find and store the distances between each empty spot and the current shaker
		var distances = [];
		for(var i = 0; i < emptiesSelf.length; i++){
			var distanceX = Math.abs(emptiesSelf[i].x - self.x);
			var distanceY = Math.abs(emptiesSelf[i].y - self.y);
			var totalDistance = distanceX + distanceY;
			distances.push(totalDistance);
		}
		// This requires the following helper function:
		function indexOfSmallest(a) {
			var smallest = 0;
			for (var i = 0; i < a.length; i++) {
				if (a[i] < a[smallest]) smallest = i;
			}
			return smallest;
		}
		var smallestDistance = indexOfSmallest(distances);

        //Return the closest spot and place the polygon there.
        var closestSpot = emptiesSelf[smallestDistance];
        self.x = closestSpot.x;
        self.gotoX = closestSpot.x;
        //self.pickupX = closestSpot.x;
        //self.pickupY = closestSpot.y;
        self.y = closestSpot.y;
        self.gotoY = closestSpot.y;
    }

    //UpdateEmpty - Return a list of all empty spots on the board
    self.updateEmpty = function(){
       emptiesSelf = [];
        //For every spot
       for(var x=0;x<GRID_SIZE;x++){
		  for(var y=0;y<GRID_SIZE;y++){
            //Calculate spot position
			var spot = {
				x: (x+0.5)*TILE_SIZE,
				y: (y+0.5)*TILE_SIZE
			}
            //Initially set to false
			var spotTaken = false;
            //Check all draggables to see if they are there
			for(var i=0;i<draggables.length;i++){
				var d = draggables[i];
				var dx = d.x-spot.x;
				var dy = d.y-spot.y;
				if(dx*dx+dy*dy<10 && !d.dragged){
					spotTaken=true;
					break;
				}
			}
            //If no polygon is in the spot, it is an empty spot!
			if(!spotTaken){
				emptiesSelf.push(spot);
			}

		  }
	   }
    }
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    	//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	// Never Ending Sharks
	//variable for maintaining state of a polygon
  	var was_shaking = false;
  	//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

	self.update = function(){

		//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		// Never Ending Sharks
		//keeps track of whether a polygon was shaking
		if(self.shaking){
			was_shaking = true;
		}
		else{
			was_shaking = false;
		}
		//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

		// Shakiness? //shaking = unhappy
		self.shaking = false;
		self.bored = false;

		if(!self.dragged){
		    var neighbors = 0;
		    var squareSameness = 0;
		    var triangleSameness=0;
		    var circleSameness = 0;
		    var same = 0;
		    for(var i=0;i<draggables.length;i++){
		        var d = draggables[i];
		        if(d==self) continue;
		        var dx = d.x-self.x;
		        var dy = d.y-self.y;
		        if(dx*dx+dy*dy<DIAGONAL_SQUARED){
		            neighbors++;
		            //<!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		            // Never Ending Sharks
		            // Relationship amongs the polygons
		            if (d.color == self.color) {
		                same++;
		            }
		            if (self.color == "square") {
		                if (d.color == self.color) {
		                    squareSameness++;
		                }
		                else if (d.color == "triangle") {
		                    triangleSameness++;
		                }
		                else {
		                    circleSameness++;
		                }
		            }
		            if (self.color == "triangle") {
		                if (d.color == self.color) {
		                    triangleSameness++;
		                }
		                else if (d.color == "square") {
		                    squareSameness++;
		                }
		                else {
		                    circleSameness++;
		                }

		            }
		            if (self.color == "circle") {
		                if (d.color == self.color) {
		                    circleSameness++;
		                }
		                else if (d.color == "square") {
		                    squareSameness++;
		                }
		                else {
		                    triangleSameness++;
		                }

		            }

		        }
		    }
		    if (neighbors > 0) {
		        self.sameness = (same / neighbors);
		        self.samenessOfSquare = (squareSameness / neighbors);
		        self.samenessOfTriangle = (triangleSameness/ neighbors);
		        self.samenessOfCircle = (circleSameness/ neighbors);
		    } else {
		        self.sameness = 1;
		        self.samenessOfSquare = 1;
		        self.samenessOfTriangle= 1;
		        self.samenessOfCircle = 1;
		    }
		    //<!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		    // Never Ending Sharks
		    //  For new sliders
		    // code to change the bias level for all three polygons
            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!>
            	    if(neighbors==0){
			self.shaking = false;
		       	}
		    else{
		    	if (squareSlider == 1) {
		       	    if (self.color == "square") {
		                if (self.sameness<BIAS_square ||self.sameness>NONCONFORM_square) {
		                    self.shaking = true;
		                    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				    // Never Ending Sharks
				    //plays a sound when polygon begins to shake
		                    if(!was_shaking && !START_SIM && loaded){
					 sounds[4].play();
				    }
				    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		                }
		            }
		        }

		        if (triangleSlider == 2) {
		            if (self.color == "triangle") {
		                if (self.sameness < BIAS_triangle || self.sameness > NONCONFORM_triangle) {
		                    self.shaking = true;
		                    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				    // Never Ending Sharks
				    //plays a sound when polygon begins to shake
		                    if(!was_shaking && !START_SIM && loaded){
					 sounds[4].play();
				    }
				    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		                }
		            }
		        }
		        if (circleSlider == 3) {
		            if (self.color == "circle") {
		                if (self.sameness < BIAS_circle || self.sameness > NONCONFORM_circle) {
		                    self.shaking = true;
		                    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				    // Never Ending Sharks
				    //plays a sound when polygon begins to shake
		                    if(!was_shaking && !START_SIM && loaded){
					 sounds[4].play();
				    }
				    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		                }
		            }
		        }
		    }
            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!>
			if(self.sameness>0.99){
				self.bored = true;
			}

		}

		// Dragging
		if(!self.dragged){
			if((self.shaking||window.PICK_UP_ANYONE) && Mouse.pressed && !lastPressed){
				var dx = Mouse.x-self.x;
				var dy = Mouse.y-self.y;
				if(Math.abs(dx)<PEEP_SIZE/2 && Math.abs(dy)<PEEP_SIZE/2){
					self.pickup();
				}
			}
		}else{
			self.gotoX = Mouse.x - offsetX;
			self.gotoY = Mouse.y - offsetY;
			if(!Mouse.pressed){
				self.drop();
			}
		}
		lastPressed = Mouse.pressed;

		// Going to where you should
        if(self.wasDropped || START_SIM){
            self.x = self.x*0.5 + self.gotoX*0.5;
		    self.y = self.y*0.5 + self.gotoY*0.5;
            self.wasDropped = true;
        }

	};

	self.frame = 0;
	self.draw = function(){
		ctx.save();
		ctx.translate(self.x,self.y);

		if(self.shaking){
			self.frame+=0.07;
			ctx.translate(0,20);
			ctx.rotate(Math.sin(self.frame-(self.x+self.y)/200)*Math.PI*0.05);
			ctx.translate(0,-20);
		}

		// Draw thing
		var img;
		if(self.color=="triangle"){
			if(self.shaking){
				img = images.sadTriangle;
			}else if(self.bored){
				img = images.mehTriangle;
			}else{
				img = images.yayTriangle;
			}
		}else if(self.color=="square"){
			if(self.shaking){
				img = images.sadSquare;
			}else if(self.bored){
				img = images.mehSquare;
			}else{
				img = images.yaySquare;
			}
		}
		// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		// NEVER ENDING SHARKS
		else{
			if(self.shaking){
				img = images.sadCircle;
			}else if(self.bored){
				img = images.mehCircle;
			}else{
				img = images.yayCircle;
			}
		}

        //else{
			//if(self.shaking){
			//	img = images.sadPentagon;
			//}else if(self.bored){
			//	img = images.mehPentagon;
			//}else{
			//	img = images.yayPentagon;
			//}
        //}

		// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

		// Dangle
		if(self.dragged){
			self.dangle += (lastMouseX-Mouse.x)/100;
			ctx.rotate(-self.dangle);
			self.dangleVel += self.dangle*(-0.02);
			self.dangle += self.dangleVel;
			self.dangle *= 0.9;
		}

		ctx.drawImage(img,-PEEP_SIZE/2,-PEEP_SIZE/2,PEEP_SIZE,PEEP_SIZE);
		ctx.restore();
	};

}

window.START_SIM = false;

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// NEVER ENDING SHARKS
// boolean necessary for toggling between random and distance based movement
// it's here because it needs to be reset with everything else, and this sets it's very first default value
window.RANDOM_MOVE = true;

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

var draggables;
var STATS;

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// NEVER ENDING SHARKS
// variable to manage when all program assets are loaded
var loaded = false;
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
window.reset = function(){

	var runTime = document.getElementById("runTime");
	runTime.innerHTML = 0;
	var numMoves = document.getElementById("numMoves");
	numMoves.innerHTML = 0;
	//var goodMoves = document.getElementById("numMoves");
	//goodMoves.innerHTML = 0;

	STATS = {
		steps:0,
		offset:0
	};
	window.START_SIM = false;
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 	// NEVER ENDING SHARKS
	// boolean necessary for toggling between random and distance based movement
	// it's here because it needs to be reset with everything else, and this sets it's very first default value
	window.RANDOM_MOVE = true;

	//// reset timer
	//runTime.innerHTML = 0;
    //
	////reset number of moves
	//numMoves.innerHTML = 0;

	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

	stats_ctx.clearRect(0,0,stats_canvas.width,stats_canvas.height);

	draggables = [];
	for(var x=0;x<GRID_SIZE;x++){
		for(var y=0;y<GRID_SIZE;y++){
            var rand = Math.random();
			if(rand<(1-window.EMPTINESS)) {
				var draggable = new Draggable((x + 0.5) * TILE_SIZE, (y + 0.5) * TILE_SIZE);
				if (rand < window.RATIO_TRIANGLES) {
					draggable.color = "triangle";
				} else if (rand < (window.RATIO_TRIANGLES + window.RATIO_SQUARES)) {
					draggable.color = "square";
				}
				// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
				// NEVER ENDING SHARKS
				else {
					draggable.color = "circle";
				}
				draggables.push(draggable);
			}
		}
	}

	// Write stats for first time
	for(var i=0;i<draggables.length;i++){
		draggables[i].update();
	}
	writeStats();
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	// NEVER ENDING SHARKS
	loaded = true;
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// NEVER ENDING SHARKS
//variable to check when simulation is complete
var oldSim = START_SIM;
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

window.render = function(){

	if(assetsLeft>0 || !draggables) return;

    //All box select code is wrapped inside this if statement
    //this is because it does not affect the rest of the simulation
    if(Mouse.middleClick && !START_SIM){
        //Clear screen
        ctx.clearRect(0,0,canvas.width,canvas.height);
        //Iterate over polygons and update position if it was box dragged
        for(var i=0;i<draggables.length;i++){
		  var d = draggables[i];

		  if(window.PICK_UP_ANYONE && Mouse.boxFinished && d.dragged){
            d.dragUpdate();
		  }
          draggables[i].draw();
	   }

        //Code for drawing the inital box
        if(Mouse.pressed /*&&  !IS_PICKING_UP*/ ){
            if(!Mouse.wasBox && Mouse.x != Mouse.origX && Mouse.y != Mouse.origY){
                ctx.beginPath();
                ctx.lineWidth="4";
                ctx.strokeStyle="green";
                ctx.moveTo(Mouse.origX, Mouse.origY);
                ctx.lineTo(Mouse.origX, Mouse.y);
                ctx.lineTo(Mouse.x, Mouse.y);
                ctx.lineTo(Mouse.x, Mouse.origY);
                ctx.lineTo(Mouse.origX, Mouse.origY);
                ctx.stroke();
                Mouse.finalX = Mouse.x;
                Mouse.finalY = Mouse.y;
                Mouse.wasBox = true;
            }else{
                Mouse.wasBox = false;
                Mouse.boxFinished = false;
                for(var i=0;i < draggables.length;i++){
                    var newDrag = draggables[i]
                    if(newDrag.dragged){
                        newDrag.updateEmpty();
                        newDrag.boxMoveClosest();
                        newDrag.dragged = false;
                        //newDrag.drop();
                        Mouse.middleClick = false;
                    }
	           }

            }
        }else if(!Mouse.pressed /*&& !IS_PICKING_UP*/ && !Mouse.boxFinished){
            //Check for draggable contains, uses coordinates of draggable object and the user mouse locations.
            for(var i=0;i<draggables.length;i++){
                var d = draggables[i];
                if(Mouse.origX > Mouse.finalX && Mouse.origY > Mouse.finalY){
                    if((d.x < Mouse.origX && d.x > Mouse.finalX) && (d.y < Mouse.origY && d.y > Mouse.finalY)){
                        IS_PICKING_UP = true;
                        var d = draggables[i];
                        d.dragged = true;
                        d.distFromMouseX = Mouse.finalX - d.x;
                        d.distFromMouseY = Mouse.finalY - d.y;
                    }
                }else if(Mouse.origX > Mouse.finalX && Mouse.origY < Mouse.finalY){
                    if((d.x < Mouse.origX && d.x > Mouse.finalX) && (d.y > Mouse.origY && d.y < Mouse.finalY)){
                        IS_PICKING_UP = true;
                        var d = draggables[i];
                        d.dragged = true;
                        d.distFromMouseX = Mouse.finalX - d.x;
                        d.distFromMouseY = Mouse.finalY - d.y;
                    }
                }else if(Mouse.origX < Mouse.finalX && Mouse.origY > Mouse.finalY){
                    if((d.x > Mouse.origX && d.x < Mouse.finalX) && (d.y < Mouse.origY && d.y > Mouse.finalY)){
                        IS_PICKING_UP = true;
                        var d = draggables[i];
                        d.dragged = true;
                        d.distFromMouseX = Mouse.finalX - d.x;
                        d.distFromMouseY = Mouse.finalY - d.y;
                    }
                }else{
                    if((d.x > Mouse.origX && d.x < Mouse.finalX) && (d.y > Mouse.origY && d.y < Mouse.finalY)){
                        IS_PICKING_UP = true;
                        var d = draggables[i];
                        d.dragged = true;
                        d.distFromMouseX = Mouse.finalX - d.x;
                        d.distFromMouseY = Mouse.finalY - d.y;
                    }
                }
	       }
            Mouse.boxFinished = true;
        }
    }else{
        /*
         ctx.clearRect(0,0,canvas.width,canvas.height);
        for(var i=0;i<draggables.length;i++){
		  var d = draggables[i];

          draggables[i].draw();
	   }*/


	   // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	   // NEVER ENDING SHARKS
	   //var runTime = document.getElementById("runTime");
	   //runTime.innerHTML = 0;
	   //var numMoves = document.getElementById("numMoves");
	   //numMoves.innerHTML = 0;
	   //var goodMoves = document.getElementById("goodMoves");
	   //goodMoves.innerHTML = 0;
	   var t0 = 0;
	   var t1 = 0;
	   // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	// NEVER ENDING SHARKS
	//Keeps track of last START_SIM and plays sounds if it toggles from false to true
	if(START_SIM == true && old_sim == false){
		sounds[1].play();
	}


	old_sim = START_SIM;
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

	   // Is Stepping?
	   if(START_SIM){
		  step();
		  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		  // NEVER ENDING SHARKS
		  t0 = window.performance.now();
		  runTime.innerHTML = Math.round(t0 / 1000) - 1;
		  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	   }

	   // Draw
	   Mouse.isOverDraggable = IS_PICKING_UP;
	   ctx.clearRect(0,0,canvas.width,canvas.height);
	   for(var i=0;i<draggables.length;i++){
		  var d = draggables[i];
		  d.update();

		  if(d.shaking || window.PICK_UP_ANYONE){
			 var dx = Mouse.x-d.x;
			 var dy = Mouse.y-d.y;
			 if(Math.abs(dx)<PEEP_SIZE/2 && Math.abs(dy)<PEEP_SIZE/2){
				Mouse.isOverDraggable = true;
			 }
		  }

	   }
	   for(var i=0;i<draggables.length;i++){
		  draggables[i].draw();
	   }

	   // Done stepping?
	   if(isDone()){
		  doneBuffer--;


		  if(doneBuffer==0){
		  	 // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			 // NEVER ENDING SHARKS
			 //plays a sound when the simulation completes
		 	 sounds[2].play();
			 // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			 doneAnimFrame = 30;
			 window.START_SIM = false;
			 console.log("DONE");
			 writeStats();
		  }
	   }else if(START_SIM){

		  STATS.steps++;
		  doneBuffer = 30;

		  // Write stats
		  writeStats();

	   }
	   if(doneAnimFrame>0){
		  doneAnimFrame--;
		  var opacity = ((doneAnimFrame%15)/15)*0.2;
		  canvas.style.background = "rgba(255,255,255,"+opacity+")";
	   }else{
		  canvas.style.background = "none";
		  //t1 = window.performance.now();
		  //var time = Math.round((t1-t0) * 1000);
		  //runTime.innerHTML = 'Run time was ' + time + ' seconds';
	   }

	   // Mouse
	   lastMouseX = Mouse.x;
	   lastMouseY = Mouse.y;

	   // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	   // NEVER ENDING SHARKS
	   // Movement type toggle button
	   if(RANDOM_MOVE){
		  document.getElementById("random_moving").classList.add("random");
	   }else{
		  document.getElementById("random_moving").classList.remove("random");
	   }

	   // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    }

}
var segregation_text = document.getElementById("segregation_text");
if(!segregation_text){
    var segregation_text = document.getElementById("stats_text");
}
var shaking_text = document.getElementById("sad_text");
var bored_text = document.getElementById("meh_text");

var tmp_stats = document.createElement("canvas");
tmp_stats.width = stats_canvas.width;
tmp_stats.height = stats_canvas.height;

window.writeStats = function(){

	if(!draggables || draggables.length==0) return;

	// Average Sameness Ratio
	// Average shaking
	// Average bored
	var total = 0;
    var total_shake = 0;
    var total_bored = 0;
	//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//NEVER ENDING SHARKS
	//new variables that are used a few lines down to calculate average
	//Segergation of each shape to be used in the graph
	var totalBlue = 0;
	var totalYellow = 0;
	var totalRed = 0;
	var ammountBlue = 0;
	var ammountYellow = 0;
	var ammountRed = 0;
	//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

	for(var i=0;i<draggables.length;i++){
		var d = draggables[i];
		total += d.sameness || 0;
        total_shake += (d.shaking?1:0);
        total_bored += (d.bored?1:0);
		//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		//NEVER ENDING SHARKS
		if(d.color == "triangle"){
			var d = draggables[i];
			//calculates how many neighbors are like me, and adds to a running total
			totalYellow += d.sameness || 0;
			//adds to a total of this type of shape, allowing us to average later
			ammountYellow++;
			}
		else if(d.color == "square"){
			var d = draggables[i];
			//calculates how many neighbors are like me, and adds to a running total
			totalBlue += d.sameness || 0;
			//adds to a total of this type of shape, allowing us to average later
			ammountBlue++;
			}
		else if(d.color == "circle"){
			var d = draggables[i];
			//calculates how many neighbors are like me, and adds to a running total
			totalRed += d.sameness || 0;
			//adds to a total of this type of shape, allowing us to average later
			ammountRed++;
			}
		//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	}
	var avg = total/draggables.length;
	//var avg_shake = total_shake/draggables.length;
	//var avg_bored = total_bored/draggables.length;

	//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//NEVER ENDING SHARKS

	//this is the average Segergation of triangles
	var avgYellow = totalYellow/ammountYellow;
	//this is the average Segergation of Squares
	var avgBlue = totalBlue/ammountBlue;
	//this is the average Segergation of Circles
	var avgRed = totalRed/ammountRed;

	//these make sure to avoid NaN errors
	if(isNaN(avgYellow)) debugger;
	if(isNaN(avgBlue)) debugger;
	if(isNaN(avgRed)) debugger;
	//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	if(isNaN(avg)) debugger;

	// If stats oversteps, bump back
	if(STATS.steps>320+STATS.offset){
		STATS.offset += 120;
		var tctx = tmp_stats.getContext("2d");
		tctx.clearRect(0,0,tmp_stats.width,tmp_stats.height);
		tctx.drawImage(stats_canvas,0,0);
		stats_ctx.clearRect(0,0,stats_canvas.width,stats_canvas.height);
		stats_ctx.drawImage(tmp_stats,-119,0);
	}

	// AVG -> SEGREGATION
	//var segregation = (avg-0.5)*2;
	var segregation = avg;
	if(segregation<0) segregation=0;

	//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//NEVER ENDING SHARKS
	//var segregationYellow = (avgYellow-0.5)*2;
	var segregationYellow = avgYellow;
	//var segregationBlue = (avgBlue-0.5)*2;
	var segregationBlue = avgBlue;
	//var segregationRed = (avgRed-0.5)*2;
	var segregationRed = avgRed;

	//these three lines keep segeration from becoming negetive somehow
	if(segregationYellow<0) segregationYellow=0;
	if(segregationBlue<0) segregationBlue=0;
	if(segregationRed<0) segregationRed=0;
	//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

	// Graph it
	stats_ctx.fillStyle = "#cc2727";
	var x = STATS.steps - STATS.offset;
	//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//NEVER ENDING SHARKS
	//var y = 250 - segregation*250+10; Old version
	var y = 250 - segregationRed*250+10; //new version uses just red shape segeration
	//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	stats_ctx.fillRect(x,y,1,5);
	//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//NEVER ENDING SHARKS
	// Text
	//segregation_text.innerHTML = Math.floor(segregation*100)+"%"; Old version
	segregation_text.innerHTML = Math.floor(segregationRed*100)+"%"; //show percent segeration of red
	//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	segregation_text.style.top = Math.round(y-15)+"px";
	segregation_text.style.left = Math.round(x+35)+"px";

	stats_ctx.fillStyle = "#2727cc";
	//y = 250 - avg_shake*250+10;
	//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//NEVER ENDING SHARKS
	y = 250 - segregationBlue*250+10; //segeration of blue for this y
	//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	stats_ctx.fillRect(x,y,1,5);
	// Text
    if(shaking_text){
        //shaking_text.innerHTML = Math.floor(avg_shake*100)+"%";
		//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		//NEVER ENDING SHARKS
		shaking_text.innerHTML = Math.floor(segregationBlue*100)+"%";//show percent segeration of blue
		//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        shaking_text.style.top = Math.round(y-15)+"px";
        shaking_text.style.left = Math.round(x+35)+"px";
    }

	stats_ctx.fillStyle = "#cccc27";
	//y = 250 - avg_bored*250+10;
	//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	//NEVER ENDING SHARKS
	y = 250 - segregationYellow*250+10;
	//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	stats_ctx.fillRect(x,y,1,5);
	// Text
    if(bored_text){
		//bored_text.innerHTML = Math.floor(avg_bored*100)+"%";
		//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		//NEVER ENDING SHARKS
		bored_text.innerHTML = Math.floor(segregationYellow*100)+"%";//show percent segeration of yellow
		//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		bored_text.style.top = Math.round(y-15)+"px";
		bored_text.style.left = Math.round(x+35)+"px";
    }

	// Button
	if(START_SIM){
		document.getElementById("moving").classList.add("moving");
	}else{
		document.getElementById("moving").classList.remove("moving");
	}

}

var doneAnimFrame = 0;
var doneBuffer = 30;
function isDone(){
	if(Mouse.pressed) return false;
	for(var i=0;i<draggables.length;i++){
		var d = draggables[i];
		if(d.shaking) return false;
	}
	return true;
}

function step(){

	// Get all shakers
	var shaking = [];
	for(var i=0;i<draggables.length;i++){
		var d = draggables[i];
		if(d.shaking) shaking.push(d);
	}

	// initial number of shakers
	var numShakers = shaking.length;
	// Pick a random shaker
	if(shaking.length==0) return;
	var shaker = shaking[Math.floor(Math.random()*shaking.length)];

	// Go through every spot, get all empty ones
	var empties = [];
	for(var x=0;x<GRID_SIZE;x++){
		for(var y=0;y<GRID_SIZE;y++){

			var spot = {
				x: (x+0.5)*TILE_SIZE,
				y: (y+0.5)*TILE_SIZE
			}

			var spotTaken = false;
			for(var i=0;i<draggables.length;i++){
				var d = draggables[i];
				var dx = d.gotoX-spot.x;
				var dy = d.gotoY-spot.y;
				if(dx*dx+dy*dy<10){
					spotTaken=true;
					break;
				}
			}

			if(!spotTaken){
				empties.push(spot);
			}

		}
	}

	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	// NEVER ENDING SHARKS
	// Allow a selection between original random movement and a smarter movement algorithm
	if(RANDOM_MOVE){
		// Go to a random empty spot
		var spot = empties[Math.floor(Math.random()*empties.length)];
		if(!spot) return;
		shaker.gotoX = spot.x;
		shaker.gotoY = spot.y;
		// increment numMoves
		numMoves.innerHTML++;
		//if(shaking.pop() && shaking.length < numShakers){
		//	goodMoves.innerHTML++;
		//}
	}
	else{
		// Find the furthest empty spot and move there
		// First find and store the distances between each empty spot and the current shaker
		var distances = [];
		for(var i = 0; i < empties.length; i ++){
			var distanceX = Math.abs(empties[i].x - shaker.x);
			var distanceY = Math.abs(empties[i].y - shaker.y);
			var totalDistance = distanceX + distanceY;
			distances.push(totalDistance);
		}
		// Find the index of the largest value of totalDistance
		// This requires the following helper function:
		function indexOfLargest(a) {
			var largest = 0;
			for (var i = 1; i < a.length; i++) {
				if (a[i] > a[largest]) largest = i;
			}
			return largest;
		}
		var largestDistance = indexOfLargest(distances);
		// The last polygon tends to get hung up
		// If there's only one left, return to random sorting
		if(shaking.length < 3) RANDOM_MOVE = true;
		else{
			var closestSpot = empties[largestDistance];
			if(!closestSpot) return;
			shaker.gotoX = closestSpot.x;
			shaker.gotoY = closestSpot.y;
			// increment numMoves
			numMoves.innerHTML++;
			// track successful moves
			//if(shaking.pop() && shaking.length < numShakers){
			//	goodMoves.innerHTML++;
			//}
		}
	}

	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
}

////////////////////
// ANIMATION LOOP //
////////////////////
window.requestAnimFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	function(callback){ window.setTimeout(callback, 1000/60); };
(function animloop(){
	requestAnimFrame(animloop);
	if(window.IS_IN_SIGHT){
		render();
	}
})();

// !!!!!!!!!!!!!!!!!!!!!!!
// NEVER ENDING SHARKS
//window.IS_IN_SIGHT = false;
window.IS_IN_SIGHT = true;

// !!!!!!!!!!!!!!!!!!!!!!!!

window.onload=function(){
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	// NEVER ENDING SHARKS
	//Plays the background music when the page loads
	sounds[0].play();
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	reset();
}
