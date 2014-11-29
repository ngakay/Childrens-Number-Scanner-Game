////////////////////////////////////
///black_box1.js///updated 5/2/14///
////////////////////////////////////

//3. Normal game. Both lengths and reliabilties of scanners change. 

/* current status:
	* trial0 initializes with single target
	* moveables stay in frame, and stick to sandbox
	* scanners properly SCAN and display hits based on scanner attr
	* scanners and claw all return to position after SCAN

	need:
	* STAMP
	* claw button
	* sounds?
	* data consistency

	when drawing:
	* assign data to the first element of a set, i.e. set[0].data('i', i)
	* moveables might have to be a single, un-nested, set of paths (not rect, circle),
		with no transformations  (transformPath and set new path instead).
*/

window.onload = function() {
  // create paper and make drawing functions
	var R = Raphael(0, 0, '100%', '100%');
	h = window.innerHeight 	//480 //640
	w = window.innerWidth	//800 //1024
	line = 0.75*h, //line height
	length = 0.66*w,
	trialnum = -1;


	var style = {
		fill: "#444",
		stroke: "#fff",
		"stroke-width": 3,
		"stroke-linejoin": "round"
	};


	function makeSandbox () {
		/* 
		 \ sandbox at height 'line' and width 'length'	  /
		  \ fills with sand at trial start 			 	 /
		   \ (future: include object drop animation)   */
		 
		R.setStart();
		var outer = R.rect(0.5 * (w - length - 50), line - 25, length + 50, 150).attr({
				fill: sandboxColor,
				stroke: sandboxOutline,
				'stroke-width': 3
		   }),
			inner = R.rect(0.5 * (w - length), line, length, 100).attr({
				fill: sandboxColor,
				stroke: sandboxOutline,
				'stroke-width': 3
		  }),
			bottom = inner.clone().transform('s0.9,0.5').attr({
				fill: sandboxColor,
				stroke: sandboxOutline,
				'stroke-width': 3
			}),
			lines = R.path([
				['M', inner.getBBox().x, inner.getBBox().y],
				['L', bottom.getBBox().x, bottom.getBBox().y],
				['M', inner.getBBox().x2, inner.getBBox().y],
				['L', bottom.getBBox().x2, bottom.getBBox().y],
				['M', inner.getBBox().x, inner.getBBox().y2],
				['L', bottom.getBBox().x, bottom.getBBox().y2],
				['M', inner.getBBox().x2, inner.getBBox().y2],
				['L', bottom.getBBox().x2, bottom.getBBox().y2]	]).attr({
					stroke: sandboxOutline,
					'stroke-width': 3
				});
			sand = bottom.clone().attr({
				fill: '#FFF',	//#FFFF99
				stroke: '#CC9',
				'stroke-width': 1,
				opacity: 1
			}).animate({
				transform: 's0.992,0.96',
			}, 1000,'<'),
			sandbox = R.setFinish();
			sandbox[0].data = {
				which: 'sandbox'
			};
		return (sandbox);
	};

	/**
	 * Makes a single ufo with the given size (due to scaling with the Element.transform 
	 * method) and the given number of stars opaque out of 5 (the rest are just outlined). 
	 * ***THE SCALING CURRENTLY DOES NOT WORK---THE INDIVIDUAL PATHS SCALE, BUT NOT TOGETHER
	 * The scanning light of the ufo is currently 
	 * The ufo body is made up of many different paths and colors, so the singular ufo
	 * is returned at the end of the method as a set that can be called all together. 
	 * <p>
	 * @param 	x 		the initial x-position of the ufo
	 * 			y 		the initial y-position of the ufo
	 * 			size 	the horizontal proportion of the ufo to a normal size
	 * 			stars 	the number of stars (representing efficacy) 
	 * @returns 	the set of paths that make up one ufo
	 * 
	 * 
	 **/
	var makeUfo = function (x, y, size, stars) {
		var r = size*length*0.5,
			opac = 0.2*stars,
			color = "#666" //'#'+(5-stars)*222+'';	
			color2 = "#999" //'#'+stars*222+'';
		R.setStart();

		//holder for data; indicates scanner width
		var ray = R.path([				//[0]
			['M', x+100-r, y+60],
			['h', 2*r],
			['l', -r, -90],
			['z']]).attr({
				fill: shipScannerColor, //'#666',
				opacity: 1,
				'stroke-width': 2,
				stroke: shipScannerOutline
			}), 

			bottom = R.path(			//[1]
				"M" + (x + 60) + "," + (y + 18) + " c20,30 60,30 80,0 c-20,2 -60,2 -80,0 ").attr({
				fill: "#e0f4f6",
				"stroke-width": 3,
				stroke: "#ceebee",
				opacity: 1
			});
		bottom.attr({path: Raphael.transformPath(bottom.attr('path'), 's0.7,0.7t0,-5')});
		
		var	topBody = R.path(			//[2]
				"M" + x + "," + y + " c30,-100 170,-100 200,0 c0,25 -200,25 -200,0").attr({
				fill: shipColor,
				"stroke-width": 3,
				stroke: shipOutline,
				opacity: 1//opac
			});
		
		if (stars==1){
			var lens=R.image("Images/lens1.png",x+53,y-72,100,100).attr({
				opacity: 1,
				"origx":x,
				"origy":y
			});
		}
		if (stars==2){
			var lens=R.image("Images/lens2.png",x+53,y-72,100,100).attr({
				opacity: 1,
				"origx":x,
				"origy":y
			});
		}
		if (stars==3){
			var lens=R.image("Images/lens3.png",x+53,y-72,100,100).attr({
				opacity: 1,
				"origx":x,
				"origy":y
			});
		}
		if (stars==4){
			var lens=R.image("Images/lens4.png",x+53,y-72,100,100).attr({
				opacity: 1,
				"origx":x,
				"origy":y
			});
		};

		lens.data({
			"origx":x,
			"origy":y
		});

		var num = 40, //to move location of each star to the right
			fillColor = "#e1c222", //to make empty stars (out of 5) for reliabilities
			opa= 0; //to set opacity of stars to 1
		for (i = 0; i < 4; i += 1) {		//[3]-[7]
			R.path("M" + (x + num) + "," + (y - 20) + " l10,0 l5,-10 l5,10 l10,0 l-10,6 l7,11 l-12,-7 l-12,7 l7,-11z").attr({
				fill: starColor,
				stroke: starOutline,
				opacity: opa
			});
			if (i==stars-1)
			{
				opa=0; //can be changed just to color if wanted: fillColor="#e0f4f6";            	
			}
			num += 30;
		};

		var button = R.path(			//[8]
				"M" + (x + 60) + "," + (y - 66) + " c10,-40 70,-40 80,0 c-20,8 -60,8 -80 0").attr({
				fill: buttonColor, //"#e0f4f6",
				"stroke-width": 3,
				stroke: buttonOutline, //#ceebee",
				opacity: 0
			});	
		button.attr({
			path: button.attr('path'),	//Raphael.transformPath(button.attr('path'), 's0.01,0.01'),
			opacity: 1
		});
		button.hide();

		var ufo = R.setFinish();
		var ufoConditions=[size, stars];
		var box = ufo.getBBox();

		ufo[0].data({
			which: 'ship',
			reset: 1,
			snapped: 0,
			button: 0,
			x: box.x,		//starting x-coordinate, top left
			y: box.y,		//starting y-coordinate, top left
			size: size,
			length: size*length,
			eff: stars2eff(stars)
			//beta: 1-stars2eff(stars) //see task.js
		});    	
		return ufo;
	};

	/**
	 *	Makes scanners in the shape of ufos with the given conditions for length
	 *  and number of stars (efficacy). Also lets scanners be dragged around 
	 *  screen. 
	 *  <p>
	 *  @para 		conditions for lengths and number of stars of scanners
	 *  @returns	the set of scanners
	 **/
	var makeScanners = function (conditions) {
		var randomSizes = conditions[0];
		var randomStars = conditions[1];
		conds = new Array();		//global
		for (var i = 0; i < 4; i++) {
			var num1 = parseInt(Math.random() * (4-i)); //as array length decreases
			var num2 = parseInt(Math.random() * (4-i));
			var siz = randomSizes[num1];
			var star = randomStars[num2];
			conds.push([siz, star]);
			randomSizes.splice(num1,1);    //at index num1, remove 1 item
			randomStars.splice(num2,1);
			}

		starts = [					//global
				[0.15*w, 0.2*h],
				[0.15*w, 0.5*h],
				[0.65*w, 0.2*h],
				[0.65*w, 0.5*h]];

		var ship0 = makeUfo(starts[0][0], starts[0][1], conds[0][0], conds[0][1]),
			ship1 = makeUfo(starts[1][0], starts[1][1], conds[1][0], conds[1][1]),
			ship2 = makeUfo(starts[2][0], starts[2][1], conds[2][0], conds[2][1]),
			ship3 = makeUfo(starts[3][0], starts[3][1], conds[3][0], conds[3][1]);

		var scanners=R.set(ship0, ship1, ship2, ship3);
		
		scanners.forEach(function (scanner) {
			scanner.drag(onSetMove(scanner), onSetStart(scanner), onSetStop(scanner))
			scanner.dblclick(function () {
				console.log(' snapped: '+scanner[0].data('snapped')+' button: '+scanner[0].data('button')+'');
			});

			// button will flash when moused over
			scanner[8].hover(function () {
				if (scanner[0].data('button')) {
					scanner[8].animate({
						fill: buttonMiddle,
					},40,'elastic', function () {
						scanner[8].animate({
							fill: buttonColor,
						},500, '<')
					});
				};
			});

			//////// SCAN FUNCTION ////////////////////////
		   //  button click --> scanning ray --> stamp 	//
		  //   button shrink --> reset all objects	   //
		 ///////////////////////////////////////////////
			scanner[8].click(function () {
				if (!scanner[0].data('button')) {
					return;
				}

				else {
					SCAN(scanner);
				};
			});
		});
		return scanners;
	};

	function resetALL () {
		scanners.forEach(function (scnr) {
			if (scnr[0].data('button')) {
				scnr[0].data('button', 0);	// reset button
				var oldpath = scnr[8].attr('path');
				scnr[8].hide(RESET(scnr));
			}
			else {
				RESET(scnr);
			};
			RESET(claw);
		});
		return;
	}

	function RESET (object) {
		// object is set of paths
		if (!(object[0].data('reset'))) {
			var box = object.getBBox();
			var time = 500; 	//time to return to position
			var delay = 1500;	//time to display result

			// reset each element in the object to original positions
			for (var i = 0; i < object.length; i++) {
				if(object[i].type!="image"){
					var next = Raphael.pathToRelative(object[i].attr('path'));
					var Xoffset = next[0][1] - box.x;
					next[0][1] = object[0].data('x') + Xoffset;
					var Yoffset = next[0][2] - box.y;
					next[0][2] = object[0].data('y') + Yoffset;
					var reset = Raphael.animation({path: next}, time);
				}
				else{
					var newx=object[i].data("origx")+53;
					var newy=object[i].data("origy")-72;
					var reset=Raphael.animation({x:newx, y:newy}, time);
				}
				object[i].animate(reset.delay(1000));
			}
			object[0].data('reset', 1);
			object[0].data('snapped', 0);
		};
		return ;
	};

	function SCAN (scanner) {
		if (scanner[0].data('snapped') && scanner[0].data('button')) {
			var x = scanner[0].getBBox().x,
				x2 = scanner[0].getBBox().x2,
				cx = (x2 - x)/2 + x,
				r = scanner[0].data('length') * 0.5,
				hit = (number2position(target)+5 >= x) && (number2position(target)-5 <= x2);	//enlarged accepted area
			if(hit){
				displayhit = (Math.random() < scanner[0].data('eff')) ? hit : !hit;
			}
			else{
				displayhit = false;
			}
				
			var stamp = R.rect(cx-r, line+5, 2*r, 0).attr({
					opacity:0
				});

			console.log('cx: '+ cx+ ' r: '+r+ ' hit: '+hit+' displayhit: '+displayhit+' eff: '+ scanner[0].data('eff')+'');
			if (displayhit) {
				document.getElementById('zap').play();
				scanner[0].animate({
					opacity:1,
					fill: '#06F' //"#2418df"
				},500,'<', 
				function () {	
					this.animate({	//triangle scanner
						fill: '#555'
					},500,'<');
					stamp.animate({		//stamp blue
						opacity: 1,
						height: 90,
						stroke: '#03C',
						fill: '#06F',	//06F
						'stroke-width': 4
					}, 500, '>', 
					function () {
						stamp.animate({
							opacity: 0.3
							//fill:"FFF"
						}, 200)}
					);
					scanner.toFront();
				});
			}
			else {
				document.getElementById('zap').play();
				scanner[0].animate({
					opacity:1,
					fill: '#F30'
				},500,'<', 
				function () {	// for 
					this.animate({
						fill: '#555'
					},500,'<');
					stamp.animate({		//stamp red
						opacity: 1,
						height: 90,
						stroke: '#900',
						fill: '#F00',	//#F00
						'stroke-width': 4
					}, 500, '>', 
					function () {
						stamp.animate({
							opacity: 0.3
						}, 200)});
					scanner.toFront();
				});
			};

			resetALL();
			//// RESET for all objects ////
			
			//// push data to [scans] ////
			var scandata = {
				"eff": scanner[0].data('eff'),
				"length": Math.floor(scanner[0].data('size')*100)/100,
				"left": Math.floor(position2number(x)),
				"right": Math.floor(position2number(x2)),
				"correct": hit
			};

			end.output[0].clicks.push(scandata);
			//console.log(scandata);

			return;
		}
		else {
			//fault?
			return;
		};
	};

	function makeTreasureBox(x, y){
		R.setStart();
		var rec=R.rect(x,y,10,140).attr({
    		fill:"#962828",
    		stroke:"#ffb400"
		});
		var lines=R.path("M"+(x+10)+","+y+" l-10,-10 l-10,0 l10,10, l10,0").attr({
   	 		fill:"#7a2626",
    		stroke:"#ffb400"
		});
		var lines2=R.path("M"+(x-10)+","+(y-10)+"l0,140 l10,10 l0 -140, l-10, -10").attr({
    		fill:"#7a2626",
    		stroke:"#ffb400"
		});
		var lines3=R.path("M"+(x-7)+","+(y-10)+"l10,10 l0,138 l0,-138").attr({
    		fill:"#7a2626",
    		stroke:"#dd823a"
		});
		var rec2=R.rect(x,y+64,6,10).attr({
    		fill:"#ffb400",
		    stroke:"#dd823a"
		});
		var rec3=R.rect(x+2,y+66,3,6).attr({
    		fill:"#7a2626",
    		stroke:"#dd823a"
		});
		var rectangle=R.setFinish();
		return rectangle;
	};

	/**
	 * Initializes physical target that will show up when target rectangle is double-clicked. 
	 */
	function makeTarget(){
		var tar=R.rect(number2position(target)-5,line-10,10,120)
			.attr({
				stroke: "#ffa900",
				fill: "#ffd700",
				"stroke-width": 3,
				opacity: 0
			});
		return tar;
	};

	function makeClaw (x, y) {
		var carry = R.path('M' + x + ',' + y + 'm-70,50a70,70,0,1,0,140,0a70,70,0,1,0,-140,0z')
			.attr({
				fill: '#000',
				opacity: 0
			}).toFront(),
			arm = R.path('M' + x + ',' + y + 'm0,15l25,50l-25,60l5,0l45,-60,l-30,-75')
				.attr({
					//'l28,60l-26,54l2,6l2,2l45,-60,l-26,-60'
					fill: '#888',
					stroke: '#555',
						'stroke-width': 3
				}),
			arm2 = R.path('M' + x + ',' + y + 'm0,15l-25,50l25,60l-5,0l-45,-60,l30,-75')
				.attr({
					fill: '#888',
					stroke: '#555',
					'stroke-width': 3
				}),
			pull = R.path('M' + (x - 28) + ',' + y + 'l0,-' + line + 'l56,0l0,' + line + '')
				.attr({				//claw[3]
					fill: 'none', 
					stroke: '#444',  
					'stroke-width': 4
				}),
			ringpath = 'M' + x + ',' + y + 'm-30,0 a30,30,0,1,0,60,0a30,30,0,1,0,-60,0z',
			ring = R.path(Raphael.transformPath(ringpath, 's1.1,1.1'))
				.attr({
					fill: sandboxColor,
					stroke: sandboxOutline,
					'stroke-width': 3
				}),
			rring = R.path(Raphael.transformPath(ringpath, 's0.6,0.6'))
				.attr({
					fill: '#444',
					stroke: sandboxOutline,
					'stroke-width': 3
				}),
			rring2 = R.path(Raphael.transformPath(ringpath, 's0.4,0.4'))
				.attr({
					fill: '#888',
					stroke: '#555',
					'stroke-width': 2
				});

		
		var claw = R.set(carry, arm, arm2, pull, ring, rring, rring2),
			box = claw.getBBox();
		claw.data({
				which: 'claw',
				reset: 1,		// to original position
				snapped: 0,		// to height of 'line'
				x: box.x,		//starting x-coordinate, top left
				y: box.y,		//starting y-coordinate, top left
				button: 0,		// to appear when 'snapped'
				guess: 0,
				hit: 0,
				fault: 0
			});
		claw.dblclick(function () {
				console.log(box);
				console.log('snapped: '+claw[0].data('snapped')+' button: '+claw[0].data('button'));
				GUESS(claw);
		});
		claw.drag(onSetMove(claw), onSetStart(claw), onSetStop(claw));
		return (claw);
	};

	function newGameButton(){
		var newGameButton=R.rect(10, 10, 20, 20).attr({
			stroke: "#fff",
			fill: backgroundColor
		});
		return newGameButton;
	};

	function drawGuess(numLeft, numRight){
		var guessBox=R.rect(numLeft, line-10, numRight-numLeft, 120);
		guessBox.attr({
			"stroke-width": 3,
			stroke: shipOutline
		});
		return guessBox;
	};

	function GUESS (claw) {
		// need claw button
		if (claw[0].data('snapped')) {
			var clawx = claw.getBBox().x,
				clawx2 = claw.getBBox().x2,
				guess = (clawx2 + clawx) * 0.5,
				hit = Math.abs(guess-number2position(target))<30;

			end.output[0].guess.push(guess);
			end.output[0].correct.push(hit);	//should this be exact?

			claw[0].data('guess', guess);
			claw[0].data('hit', hit);
			console.log('hit: ' + hit);
			if (hit!=true){
				drawGuess((clawx2-clawx)/2+clawx-5,(clawx2-clawx)/2+clawx+5);
				tar.attr({opacity: 0.5});
			}
			claw.animate({
				transform: 't0,50'
			},500, 'backIn', function () {
				claw.animate({
					transform: 't0,-'+(line+100)+''
				},1000, '>', function () {
					if (hit==true){
						document.getElementById('found').play();//time for screen feedback about actual location of target
						window.open("Refer to/found.html");
					}
					else{
						document.getElementById('not_found').play();//time for screen feedback about actual location of target
						window.open("Refer to/notFound.html");
					}
				})
			});
		}
		else {console.log('not online')};


		//data-writing
		popup=window.open("", "", "height=10, width=10");
		popup.document.write(JSON.stringify(end));
		popup.window.open("about:blank").close();
		popup.blur();
		window.focus();

		return ;
	};

	function splitByColorScheme(num){
		switch(num){
			case 1: {
				sandboxColor="#093";
				sandboxOutline="#050";
				shipColor="#2ac7d6";
				shipOutline="#24b7c5";
				buttonMiddle="#3C3";
				starColor="#e1c222";
				starOutline="#d6a719";
				backgroundColor="#bbb";
				break;
			}
			case 2: {
				sandboxColor="#e56ef9";
				sandboxOutline="#752582";
				shipColor="#f9e56e";
				shipOutline="#efd747";				
				buttonMiddle="#d469e6";				
				starColor="#6ec7f9";
				starOutline="#2a96d3";
				backgroundColor="#f97083";
				break;
			}
			case 3: {
				sandboxColor="#04819e";
				sandboxOutline="#015367";
				shipColor="#ff1e00";
				shipOutline="#aa3218";
				buttonMiddle="#206676";
				starColor="#acf53d";
				starOutline="#5c9900";
				backgroundColor="#00bf32";
				break;
			}
			case 4: {
				sandboxColor="#ffc200";
				sandboxOutline="#a67e00";
				shipColor="#c200ff";
				shipOutline="#61007f";
				buttonMiddle="#bf9d30";
				starColor="#ff4f00";
				starOutline="d34302";
				backgroundColor="#0c5da5";
				break;
			}
			case 5: {
				sandboxColor="#ff7400";
				sandboxOutline="#a64b00";
				shipColor="#009999";
				shipOutline="#037171";
				buttonMiddle="#bf7130";
				starColor="#990098";
				starOutline="#5b005b";
				backgroundColor="#00b945";
				break;
			}
			case 6: {
				sandboxColor="#35d335";
				sandboxOutline="#118911";
				shipColor="#df387e";
				shipOutline="#911247";
				buttonMiddle="#2aa82a";
				starColor="#21855b";
				starOutline="#a61515";
				backgroundColor="#ff8740";
				break;
			}
			case 7: {
				sandboxColor="#d50065";
				sandboxOutline="#8A0041";
				shipColor="#7e07a9";
				shipOutline="#52026e";
				buttonMiddle="#a02860";
				starColor="#07a97e";	
				starOutline="#07533f"; 	
				backgroundColor="#ecfc00";
				break;
			}
			case 8: {
				sandboxColor="#ff4800";
				sandboxOutline="#ad380a";
				shipColor="#e8c30c";
				shipOutline="#b0940a";
				buttonMiddle="#df4205";
				starColor="#0dff97";
				starOutline="#07ad66";
				backgroundColor="#7e95ec";
				break;
			}
		}
		shipScannerColor="#666";
		shipScannerOutline="#999";
		buttonColor=sandboxColor;
		buttonOutline=sandboxOutline;
	};

	var colorScheme=chooseColorScheme();
	splitByColorScheme(colorScheme);

	function initializeTrial (conditions) {
		// all global variables;
		sandbox = makeSandbox();
		scanners = makeScanners(conditions);
		fakeTarget = makeTreasureBox(0.1*w, 0.725*h);	//show size of target on side
		claw = makeClaw(0.5*w, 0.3*h);
		target = setTarget();	//target number
		tar=makeTarget();	//make rectangle where target will show up
		gameButton=newGameButton();

		availableSizes=[];
		availableEffs=[];
		for (var i=0; i<4; i++){
			//alert(scanners[i][0].data
			availableSizes.push(Math.floor(scanners[i][0].data("size")*1000)/1000);
			availableEffs.push(scanners[i][0].data("eff"));
		}

		day = new Date();
   		timestamp=day.getMonth()+1+"/"+day.getDate()+"/"+day.getFullYear()+" "+day.getHours()+":"+day.getMinutes()+":"+day.getSeconds();

		end.output.push({
			"trial": 0,	//make this a timestamp
			"available_scanners": [availableSizes, availableEffs],
			"clicks": [],		//scandata = end.output[trial].[scans][scan#]
			"guess": [],
			"target": target,
			"correct": [],
			"time": timestamp
		});

		return;
	};

	function initializeSession (userID) {
		end = {"user": userID, "output":[]};
		trial = -1;		//cludge
		target = null;
		return;
	}

	//draw things!
	var frame = R.rect(0,0,w,h).attr({
		'stroke-width':2
	});

	initializeSession('testID');
	//alert(end.user);
	conditions=[[0.5, 0.5/3, 0.5/9, 0.5/27], [1,2,3,4]]; //sizes, stars
	initializeTrial(conditions);

	sandbox.dblclick(function () {
		alert(end.output[0].target);
	});

	fakeTarget.dblclick(function() {
		tar.attr({opacity: 0.5});
	});

	gameButton.dblclick(function(){
		window.open("black_box1.html");
	});

	R.canvas.style.backgroundColor= backgroundColor;
};

////////////////////////
/// helper functions ///
////////////////////////

function number2position (num) {
	// 1:100 --> x-coordinate
	var pos = Math.floor(0.5*(w - length) + 0.01* num * length);
	return pos;
}

function position2number (pos) {
	// x-coordinate --> 1:100
	var num = (pos - 0.5 * (w - length)) * 100 / length;
	return num;
}

function setTarget () {

	var target = Math.floor(Math.random() * 86 + 1);
	target+=7; //offset so target doesn't go over sides of sandbox
	//target is 14 numbers across, so offset by 7 on each side

	return target;
}

function stars2eff (stars) {
	//var eff = 0.375 + 0.125 * stars;
	if(stars==1)
		return 0.51;
	else if (stars==2)
		return 0.67;
	else if (stars==3)
		return 0.83;
	else if (stars==4)
		return 1.0;
	else
		alert("stars2eff not working; check # of stars");
}

function chooseColorScheme(){
	return Math.floor(Math.random()*8+1);	//choose from 8 color schemes
}


