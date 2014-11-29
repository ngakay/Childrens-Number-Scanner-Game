window.onload = function() {
  // create paper and make drawing functions
  	var R = Raphael(0, 0, '100%', '100%');
	h = window.innerHeight 	//480 //640
	w = window.innerWidth	//800 //1024
	line = 0.75*h; //line height
	length = 0.66*w;


	var fireworks=R.image("../Found Items/fireworks.gif", w/2-500, h/2-150,300,300);
	var fireworks2=R.image("../Found Items/fireworks2.gif", w/2+120, h/2-150, 500,300);
	var treasure = R.image("../Found Items/treasureChest.png", w/2-180, h/2-70, 350, 300);

	var t = R.text(w/2, h/2-100, "Congratulations!!")
	.attr({
		fill:"#ffbf00",
		"font-size": 50
	});

}