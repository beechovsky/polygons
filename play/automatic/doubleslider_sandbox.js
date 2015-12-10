/**
 * Created by jeff on 11/17/2015.
 */
window.PICK_UP_ANYONE = true;

var bias_text_square = document.getElementById("bias_text_square");
var nonconform_text_square = document.getElementById("nonconform_text_square");

// Original bias slider, now only work for squire polygon
var square = new DoubleSlider(document.getElementById("slider_square"),{
    backgrounds:[
        {color:"#000000",icon:"ds_sad.png"},
        { color: "#567DFF", icon: "ds_happy.png" },
        {color:"#000000",icon:"ds_sad.png"}
    ],
    values:[0.20,0.80],
    onChange:function(values){
	    //show bias values on the slider
	    window.BIAS_square = values[0];
        window.NONCONFORM_square = values[1];
        window.squareSlider = 1;
        // Write stats
        START_SIM = false;
        window.writeStats();
        bias_text_square.innerHTML = Math.round(window.BIAS_square*100)+"%";
        nonconform_text_square.innerHTML = Math.round(window.NONCONFORM_square*100)+"%";

    },

    });
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// Never Ending Sharks
// Code to add two new sliders for each polygons
// added bias slider for triangle polygon
var bias_text_triangle = document.getElementById("bias_text_triangle");
var nonconform_text_triangle = document.getElementById("nonconform_text_triangle");

var triangle = new DoubleSlider(document.getElementById("slider_triangle"), {
    backgrounds: [
        { color: "#000000", icon: "ds_sad.png" },
        { color: "#FFDD56", icon: "ds_happy.png" },
        { color: "#000000", icon: "ds_sad.png" }
    ],
    values: [0.20, 0.80],
    onChange: function (values) {
	    //show bias values on the slider
        window.BIAS_triangle = values[0];
        window.NONCONFORM_triangle = values[1];
        window.triangleSlider = 2;
        // Write stats
        START_SIM = false;
        window.writeStats();
        bias_text_triangle.innerHTML = Math.round(window.BIAS_triangle * 100) + "%";
        nonconform_text_triangle.innerHTML = Math.round(window.NONCONFORM_triangle * 100) + "%";

    },


});

//added bias slider for circle polygon
var bias_text_circle = document.getElementById("bias_text_circle");
var nonconform_text_circle = document.getElementById("nonconform_text_circle");

var circle = new DoubleSlider(document.getElementById("slider_circle"), {
    backgrounds: [
        { color: "#000000", icon: "ds_sad.png" },
        { color: "#FF0000", icon: "ds_happy.png" },
        { color: "#000000", icon: "ds_sad.png" }
    ],
    values: [0.20, 0.80],
    onChange: function (values) {
	    //show bias values on the slider
        window.BIAS_circle = values[0];
        window.NONCONFORM_circle = values[1];
        window.circleSlider = 3;
        // Write stats
        START_SIM = false;
        window.writeStats();
        bias_text_circle.innerHTML = Math.round(window.BIAS_circle * 100) + "%";
        nonconform_text_circle.innerHTML = Math.round(window.NONCONFORM_circle * 100) + "%";

    },

});


//added ratio value of circle polygon on the population slider
var whatever = new NSlider(document.getElementById("slider2"),{
    backgrounds:[
        {color:"#FFDD56",icon:"ds_happy.png"},
        {color:"#567DFF",icon:"ds_happy.png"},
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // NEVER ENDING SHARKS
        {color:"#FF0000",icon:"ds_happy.png"},

        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        {color:"#000",icon:"ds_sad.png"}
    ],
    values:[0.25,0.50,0.75],
    onChange:function(values){

        // Actual values
        var VALUE_1 = values[0];
        var VALUE_2 = values[1];
        var VALUE_3 = values[2];
    	//show values on the slider
        window.EMPTINESS = 1-VALUE_3;
        window.RATIO_TRIANGLES = VALUE_1;
        window.RATIO_SQUARES = (VALUE_2-VALUE_1);
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // NEVER ENDING SHARKS
	    // added ratio value for circle polygon on the slider
        window.RATIO_CIRCLES = (VALUE_3-VALUE_2);

        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        // Write stats
        START_SIM = false;
        document.getElementById("ratio_text_triangles").innerHTML = Math.round(window.RATIO_TRIANGLES*100);
        document.getElementById("ratio_text_squares").innerHTML = Math.round(window.RATIO_SQUARES*100);
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // NEVER ENDING SHARKS
        document.getElementById("ratio_text_circles").innerHTML = Math.round(window.RATIO_CIRCLES*100);

        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        document.getElementById("empty_text").innerHTML = Math.round(window.EMPTINESS*100)+"% empty";

    },
    onLetGo:function(){
        reset();
    }
});