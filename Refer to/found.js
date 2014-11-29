window.onload = function() {
    /* 
     * Create paper and make drawing functions
     */
  	var R = Raphael(0, 0, '100%', '100%');
	h = window.innerHeight 	//480 //640
	w = window.innerWidth	//800 //1024
	
	
	/*
	 *  Initialize congratulatory text. Background is defined in found.html instead. 
	 */
	var t = R.text(w/2, h/2-100, "Nice job! Let's see what you've found!")
	.attr({
		fill:"#800000",
		"font-size": 50
	});

	/*
	 * Functions and calls to randomize objects found. Using pngs because they allow 
	 * for transparent backgrounds, unlike jpgs. 
	 */
	function chooseImage(num){
		switch (num){
			case 1: {
				var shovel=R.image("../Found Items/shovel.png", w/2-150, h/2-50, 300, 300);
				break;
			}
			case 2: {
				var binoculars=R.image("../Found Items/binoculars.png", w/2-150, h/2-50, 300, 300);
				break;
			}
			case 3: {
				var seashell=R.image("../Found Items/seashell.png", w/2-150, h/2-50, 300, 300);
				break;
			}
			case 4: {
				var coin=R.image("../Found Items/coin.png", w/2-150, h/2-50, 300, 300);
				break;
			}
			case 5: {
				var coconut=R.image("../Found Items/coconut.png", w/2-150, h/2-50, 300, 300);
				break;
			}
			case 6: {
				var volleyball=R.image("../Found Items/volleyball.png", w/2-150, h/2-50, 300, 300);
				break;
			}
			case 7: {
				var pail=R.image("../Found Items/pail.png", w/2-150, h/2-50, 300, 300);
				break;
			}
			case 8: {
				var sunglasses=R.image("../Found Items/sunglasses.png", w/2-150, h/2-100, 300, 300);
				break;
			}
			case 9: {
				var treasureMap=R.image("../Found Items/treasureMap.png", w/2-150, h/2-50, 300, 300);
				break;
			}
		}
		
	}

	function makeRandomNumber(){
		return Math.floor(Math.random()*9+1);
	}
	
	var num=makeRandomNumber();
	chooseImage(num);

}