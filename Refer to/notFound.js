window.onload = function() {
    /* 
     * Create paper and make drawing functions
     */
  	var R = Raphael(0, 0, '100%', '100%');
	h = window.innerHeight; 	//480 //640
	w = window.innerWidth;	//800 //1024

	/*
	 *  Initialize congratulatory text. Background is defined in found.html instead. 
	 */
	var t = R.text(w/2, h/2-100, "You found a crab instead!")
	.attr({
		fill:"#800000",
		"font-size": 50
	});

	function chooseImage(num){
		switch (num){
			case 1: {
				var crab=R.image("../Found Items/crab.png", w/2-150, h/2-50, 300, 300);
				break;
			}
			case 2: {
				var crab=R.image("../Found Items/crab2.png", w/2-150, h/2-50, 300, 300);
				break;
			}
		}
	}

	function makeRandomNumber(){
		return Math.floor(Math.random()*2+1);
	}
	
	var num=makeRandomNumber();
	chooseImage(num);
}