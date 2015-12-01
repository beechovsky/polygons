(function(exports){

	// Singleton
	var Mouse = {
		x: 0,
		y: 0,
        origX: 0, //Added variables for original coordinates for click point
        origY: 0,
        wasBox: false, //Added variable for detecting if there was a box select on the previous frame.
		pressed: false,
        boxFinished: false,
        middleClick: false,
        finalX: 0,  //Added variables for storing the last location before lifting up on the mouse.
        finalY: 0
	};
	exports.Mouse = Mouse;

	var canvas = document.getElementById("canvas");

	// Event Handling
	var onMouseMove,onTouchMove;

	// Cursor
	Mouse.isOverDraggable = false;
	function updateCursor(){
		if(Mouse.isOverDraggable){
			canvas.style.cursor = "";
			if(Mouse.pressed){
				canvas.style.cursor = "-moz-grabbing";
				if(canvas.style.cursor=="") canvas.style.cursor="-webkit-grabbing";
				if(canvas.style.cursor=="") canvas.style.cursor="-ms-grabbing";
				if(canvas.style.cursor=="") canvas.style.cursor="-o-grabbing";
				if(canvas.style.cursor=="") canvas.style.cursor="grabbing";
			}else{
				canvas.style.cursor = "-moz-grab";
				if(canvas.style.cursor=="") canvas.style.cursor="-webkit-grab";
				if(canvas.style.cursor=="") canvas.style.cursor="-ms-grab";
				if(canvas.style.cursor=="") canvas.style.cursor="-o-grab";
				if(canvas.style.cursor=="") canvas.style.cursor="grab";
			}
		}else{
			canvas.style.cursor = "";
		}
	}

	function fixPosition(){
		//return;
		/*var BORDER = PEEP_SIZE/2;
		if(Mouse.x<BORDER) Mouse.x=BORDER;
		if(Mouse.x>canvas.width-BORDER) Mouse.x=canvas.width-BORDER;
		if(Mouse.y<BORDER) Mouse.y=BORDER;
		if(Mouse.y>canvas.height-BORDER) Mouse.y=canvas.height-BORDER;*/
		// Looks a bit weird?... Esp if offset-grab...
	}
	
	canvas.addEventListener("mousedown",function(event){
        if(event.button == 1){
            Mouse.middleClick = true;  
            //alert("Middle mouse clicked");
        }
		updateCursor();
        //Added recording coordinates of original click
        //alert("You pressed button: " + event.button);
        Mouse.origX = event.pageX;
        Mouse.origY = event.pageY;
	    Mouse.pressed = true;
	    onMouseMove(event);
	    event.preventDefault();
	    event.stopPropagation();
	},false);

	canvas.addEventListener("mouseup",function(event){
		updateCursor();
	    Mouse.pressed = false;
	    event.preventDefault();
	    event.stopPropagation();
	},false);

	canvas.addEventListener("mousemove",onMouseMove = function(event){
		updateCursor();
		Mouse.x = event.pageX;
		Mouse.y = event.pageY;
		fixPosition();
		event.preventDefault();
	    event.stopPropagation();

	},false);

	canvas.addEventListener("touchstart",function(event){
	    Mouse.pressed = true;
	    onTouchMove(event);
	    event.preventDefault();
	    event.stopPropagation();
	},false);

	canvas.addEventListener("touchend",function(event){
	    Mouse.pressed = false;
	    event.preventDefault();
	    event.stopPropagation();
	},false);

	canvas.addEventListener("touchmove",onTouchMove = function(event){
		Mouse.x = event.changedTouches[0].clientX;
		Mouse.y = event.changedTouches[0].clientY;
		fixPosition();
		event.preventDefault();
	    event.stopPropagation();
	},false);


})(window);