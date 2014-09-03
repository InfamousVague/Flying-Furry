/*************************************************************************
 *
 * Copyright Matthew Wisniewski
 * Artwork Coypright Siyliss
 * __________________
 *
 * [2014] - [2020] Matthew Wisniewski
 * [2014] - [2020] Artwork Copyright Siyliss
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Matt Wisniewski,
 * The intellectual and technical concepts contained
 * herein are proprietary to Matt Wisniewski and or Siyliss.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from the developer himself.
 */


$(document).ready(function () {
    //-------------------------------------
    //++++++++++++Preperation++++++++++++++
    //-------------------------------------
    console.log('/************************************************************************');
    console.log('* ');
    console.log('* Copyright Matthew Wisniewski');
    console.log('* Artwork Coypright Siyliss');
    console.log('* __________________');
    console.log('* ');
    console.log('* [2014] Matthew Wisniewski');
    console.log('* [2014] Artwork Copyright Siyliss');
    console.log('* ');
    console.log('* NOTICE:  All information contained herein is, and remains');
    console.log('* the property of Matt Wisniewski,');
    console.log('* The intellectual and technical concepts contained');
    console.log('* herein are proprietary to Matt Wisniewski and or Siyliss.');
    console.log('* Dissemination of this information or reproduction of this material');
    console.log('* is strictly forbidden unless prior written permission is obtained');
    console.log('* from the developer himself.');
    console.log('*/');
    console.log('ANY PERSON(S) FOUND TO HAVE COPIED AND REDISTRIBUTED CODE FROM THIS SITE WILL LIKELY FACE LEGAL ACTION');
    $('.uiframe').css('visibility', 'visible');

    $('.score').hide();
    $('#spalshIMG').hide();
    $('#spalshIMG').fadeIn(3000).delay(1000).fadeOut(2000);
    
    var soundloop;
    setTimeout(function () {
        $('.splashscreen').hide();
        soundloop = setInterval(function () {
            createjs.Sound.play("background");
        }, 53000);
        createjs.Sound.play("background");
        hasinitiated = false;
    }, 6000);

    //-------------------------------------
    //+++++++++Sound Declaration+++++++++++
    //-------------------------------------

    createjs.Sound.registerSound("assets/audio/woosh.ogg", "woosh");
    createjs.Sound.registerSound("assets/audio/thump.ogg", "thump");
    createjs.Sound.registerSound("assets/audio/background.ogg", "background");
    createjs.Sound.registerSound("assets/audio/point.ogg", "point");
    createjs.Sound.registerSound("assets/audio/coin.ogg", "coin");
	//-------------------------------------
    //++++++++++StarGame Actions+++++++++++
    //-------------------------------------
    var hasinitiated = true;
    $('body').keydown(function (e) {
        if (e.keyCode === 38 || e.keyCode === 32) {
            createjs.Sound.play("woosh");
            if (!hasinitiated) {
                hasinitiated = true;
                update_frame();
                $('.start').hide();
                $('.score').hide();
                $('.logo').hide();
            }
        }
    });

    //-------------------------------------
    //++++++++++++Mobile Actions+++++++++++
    //-------------------------------------
    document.addEventListener('touchstart', function (e) {
        e.preventDefault();
        tapped = true;
        createjs.Sound.play("woosh");
        if (!hasinitiated) {
            hasinitiated = true;
            update_frame();
            $('.start').hide();
            $('.score').hide();
            $('.logo').hide();
        }
    }, false);
    document.addEventListener('touchend', function (e) {
        e.preventDefault();
        tapped = false;

    }, false);

    //-------------------------------------
    //++++++++++++Toggle Sounds+++++++++++++
    //-------------------------------------	
    var muted = false;
    $('.togglesound').click(function () {
        if (!muted) {
            muted = true;
            clearInterval(soundloop);
            createjs.Sound.stop("background");
            $(this).attr('src', 'assets/img/sound_on.png');
        } else {
            muted = false;
            createjs.Sound.play("background");
            $(this).attr('src', 'assets/img/sound_off.png');
        }
    });

    //-------------------------------------
    //++++++++++++Global Vars++++++++++++++
    //-------------------------------------
    var canvas = document.getElementById("furryFrame"),
        ctx = canvas.getContext("2d"),
        width = 1080 / 2.5,
        height = 1920 / 3,
        points = 0,
        hacked = false,
        tapped = false,
		animationSpeed = 100,
        highscore = localStorage['voxelbit_ffhs'],
        //Set up Chestnut
        Chestnut = {
            x: width / 2 - 50,
            y: height / 2 - 25,
            width: 100,
            height: 44,
            // Adjust speed for boost upwards height per click
            speed: 3,
            gap: 170,
            velX: 0,
            velY: 0,
            whoosh: false,
            // Adjust for how long a motion will continue after keyup/release
            wind_resistance: .96,
            // Adjust gravity for downward speed per keyup/release 
            gravity: 0.5,
            // Assign images to be used in animation loops
            animationSprites: {
                standby_loop: 0,
                boost: [],
                standby: [
                    'assets/img/chestnut/static/squirrel.png', 
                    'assets/img/chestnut/static/squirrel2.png', 
                    'assets/img/chestnut/static/squirrel3.png'
                    ]
            }
        },
		Sign = {
			x : 0,
			y : 40,
			height : 50,
			width : 100,
			spawned : false
		},
        Coin = {
        	x : 0,
        	y : 0,
        	width : 36,
        	height : 36,
        	spriteloop : 0,
        	sprite : [
        		'assets/img/coin/coin1.png',
        		'assets/img/coin/coin2.png',
        		'assets/img/coin/coin3.png',
        		'assets/img/coin/coin4.png'
        	],
        	collected : 0,
        	spawned : false,
        	// Spawnrate is a percent out of 100
        	spawnrate : 25
        },
        Chestnut_hitbox = {
            x : 0,
            y : 0,
            width : 85,
            height : 29,
            xoffset : 5,
            yoffset : 10
        },
        topLogs = [
            'assets/img/logs/top/toplog_1.png',
            'assets/img/logs/top/toplog_2.png',
            'assets/img/logs/top/toplog_3.png',
            'assets/img/logs/top/toplog_4.png'
            ],
        bottomLogs = [
            'assets/img/logs/bottom/bottomlog_1.png',
            'assets/img/logs/bottom/bottomlog_2.png',
            'assets/img/logs/bottom/bottomlog_3.png',
            'assets/img/logs/bottom/bottomlog_4.png'
            ],
        Obsticles = {
            first: {
                x: -80,
                width: 80,
                height: Math.floor(Math.random() * (400 - 100 + 1)) + 100,
                y: 0
            },
            second: {
                x: width,
                width: 80,
                height: Math.floor(Math.random() * (400 - 100 + 1)) + 100,
                y: 0
            },
            first_top: {
                x: 0,
                y: 0,
                height: 0,
                width: 80
            },
            second_top: {
                x: 0,
                y: 0,
                height: 0,
                width: 80
            }
        },
        que = 0,
        pointGained = function () {
            points++;
            createjs.Sound.play("point");
            $('.pointscount').html(points);
        },
        //Keybinbds
        keys = [];

    //-------------------------------------
    //+++++++ Debug / Configuration +++++++
    //-------------------------------------
    $('#setConf').click(function () {
        gatherVals();
    });

    $('#speed').val(Chestnut.speed);
    $('#gravity').val(Chestnut.gravity);
    $('#resistance').val(Chestnut.wind_resistance);
    $('#gap').val(Chestnut.gap);

    function gatherVals() {
        // Gather inputs
        var sp = $('#speed').val(),
            gr = $('#gravity').val(),
            re = $('#resistance').val(),
            ga = $('#gap').val();
        // Check for undefined
        if (gr === NaN) {
            gr = Chestnut.gravity
        };
        if (sp === NaN) {
            sp = Chestnut.speed
        };
        if (re === NaN) {
            re = Chestnut.wind_resistance
        };
        if (ga === NaN) {
            ga = Chestnut.gap
        };

        // Set new values
        setConfig(sp, gr, re, ga);
    }

    function setConfig(sp, gr, re, ga) {
        Chestnut.speed = sp;
        Chestnut.gravity = gr;
        Chestnut.wind_resistance = re;
        Chestnut.gap = ga;

        restart();
    }


    // Collision check
    function isCollide(a, b) {
        return !(
        ((a.y + a.height) < (b.y)) || (a.y > (b.y + b.height)) || ((a.x + a.width) < b.x) || (a.x > (b.x + b.width)));
    }

    Obsticles.first.y = height - Obsticles.first.height;
    Obsticles.second.y = height - Obsticles.second.height;

    canvas.width = width;
    canvas.height = height;

    //-------------------------------------
    //+++++++Declare images below++++++++++
    //-------------------------------------

    var ChestnutSprite = new Image(),
        bottomLog = new Image(),
        bottomLog2 = new Image(),
        topLog = new Image(),
        topLog2 = new Image(),
        coin = new Image(),
        whoosh = new Image(),
		highsign = new Image();

    // Load in obsticle sources
    ChestnutSprite.src = 'assets/img/chestnut/static/squirrel.png';
    bottomLog.src = bottomLogs[Math.floor(Math.random() * bottomLogs.length)];
    topLog.src = topLogs[Math.floor(Math.random() * topLogs.length)];
    bottomLog2.src = bottomLogs[Math.floor(Math.random() * bottomLogs.length)];
    topLog2.src = topLogs[Math.floor(Math.random() * topLogs.length)];
    whoosh.src = 'assets/img/whoosh.png';
    coin.src = 'assets/img/coin/coin1.png';
    highsign.src = 'assets/img/highscore.png';
    // Preload the images
    var queue = new createjs.LoadQueue();
    queue.loadFile({
        id: "squirrel",
        src: "assets/img/chestnut/static/squirrel.png"
    });
    queue.loadFile({
        id: "squirrel2",
        src: "assets/img/chestnut/static/squirrel2.png"
    });
    queue.loadFile({
        id: "squirrel3",
        src: "assets/img/chestnut/static/squirrel3.png"
    });
    queue.loadFile({
        id: "log1",
        src: "assets/img/logs/bottom/bottomlog_1.png"
    });
    queue.loadFile({
        id: "log2",
        src: "assets/img/logs/bottom/bottomlog_2.png"
    });
    queue.loadFile({
        id: "log3",
        src: "assets/img/logs/bottom/bottomlog_3.png"
    }); 
    queue.loadFile({
        id: "log4",
        src: "assets/img/logs/bottom/bottomlog_4.png"
    });
    queue.loadFile({
        id: "log5",
        src: "assets/img/logs/top/toplog_1.png"
    });
    queue.loadFile({
        id: "log6",
        src: "assets/img/logs/top/toplog_2.png"
    });
    queue.loadFile({
        id: "log7",
        src: "assets/img/logs/top/toplog_3.png"
    });
    queue.loadFile({
        id: "log8",
        src: "assets/img/logs/top/toplog_4.png"
    });
    queue.loadFile({
        id: "coin1",
        src: "assets/img/coin/coin1.png"
    });
    queue.loadFile({
        id: "coin2",
        src: "assets/img/coin/coin2.png"
    });
    queue.loadFile({
        id: "coin3",
        src: "assets/img/coin/coin3.png"
    });
    queue.loadFile({
        id: "coin4",
        src: "assets/img/coin/coin4.png"
    });


    //-------------------------------------
    //++++++++++++Keybinds+++++++++++++++++
    //-------------------------------------
    $('body').keydown(function (e) {
        keys[e.keyCode] = true;
    });

    $('body').keyup(function (e) {
        keys[e.keyCode] = false;
    });

    //-------------------------------------
    //+++++++++Animation Loops++++++++++++++
    //-------------------------------------

	(function spriteLoop(){
		ChestnutSprite.src = Chestnut.animationSprites.standby[Chestnut.animationSprites.standby_loop];
        Chestnut.animationSprites.standby_loop++;
        if (Chestnut.animationSprites.standby_loop > 2) {
            Chestnut.animationSprites.standby_loop = 0;
        }
        
        coin.src = Coin.sprite[Coin.spriteloop];
        Coin.spriteloop++;
        if (Coin.spriteloop > 3) {
            Coin.spriteloop = 0;
        }
		setTimeout(function () {
			requestAnimationFrame(spriteLoop);
    		}, animationSpeed);
	})();
    //-------------------------------------
    //++++++++++++Game Loop++++++++++++++++
    //-------------------------------------

    var fps = 70;

    function update_frame() {
        // Generate hitbox inside by 5px
        Chestnut_hitbox.x = Chestnut.x + Chestnut_hitbox.xoffset;
        Chestnut_hitbox.y = Chestnut.y + Chestnut_hitbox.yoffset;

        if (isCollide(Chestnut, Obsticles.first) || isCollide(Chestnut, Obsticles.second) || isCollide(Chestnut_hitbox, Obsticles.first_top) || isCollide(Chestnut, Obsticles.second_top)) {
            // Log score if higher

            createjs.Sound.play("thump");
            restart();
            return;
        };		
		
        //If a key is pressed move Chestnut!
        if (keys[38] || keys[32] || tapped) {
            // Up Arrow Pressed
            Chestnut.velY = -Chestnut.speed * 2;
            Chestnut.whoosh = true;
        } else {
            Chestnut.whoosh = false;
        }

        //Move Chestnut's position based on velocity
        Chestnut.x += Chestnut.velX;
        Chestnut.y += Chestnut.velY;

        // Apply Wind Resistance
        Chestnut.velX *= Chestnut.wind_resistance;
        Chestnut.velY += Chestnut.gravity;

        // If Chestnut Hits the edge of the screen, stop him!
        if (Chestnut.x >= width - Chestnut.width) {
            Chestnut.x = width - Chestnut.width;
        } else if (Chestnut.x <= 0) {
            Chestnut.x = 0;
        }
        if (Chestnut.y >= height - Chestnut.height) {
            Chestnut.y = height;
        }
        if (Chestnut.y < 0) {
            Chestnut.y = 0;
        }
        
        //-------------------------------------
        //++++++++++++Obsticles++++++++++++++++
        //-------------------------------------
        Obsticles.first.x -= 3;
        if (Obsticles.first.x <= -Obsticles.first.width - 150) {
            topLog.src = topLogs[Math.floor(Math.random() * topLogs.length)];
            bottomLog.src = bottomLogs[Math.floor(Math.random() * bottomLogs.length)];
            Obsticles.first.x = width;
            Obsticles.first.height = Math.floor(Math.random() * (400 - 100 + 1)) + 100;
            Obsticles.first.y = height - Obsticles.first.height;
          	
            
        }
        if (que > 160) {
            Obsticles.second.x -= 3;

            if (Obsticles.second.x <= -Obsticles.second.width - 150) {
                topLog2.src = topLogs[Math.floor(Math.random() * topLogs.length)];
                bottomLog2.src = bottomLogs[Math.floor(Math.random() * bottomLogs.length)];
                Obsticles.second.x = width;
                Obsticles.second.height = Math.floor(Math.random() * (400 - 100 + 1)) + 100;
                Obsticles.second.y = height - Obsticles.second.height;
                
			    //-------------------------------------
			    //+++++++++++Coin System+++++++++++++++
			    //-------------------------------------
			    
			    Coin.spawned = false;
			    // Get random number between 1-100
			    var coinChance = Math.floor(Math.random() * 100) + 1;
				// if the number is below the spawnrate, spawn one
			    if ( coinChance < Coin.spawnrate ) {
				    Coin.x = Obsticles.second.x;
				    Coin.y = Obsticles.second.height + Coin.height;
				    Coin.spawned = true;
			    }
			
            }
        } else {
            que++;
        }


        ctx.clearRect(0, 0, width, height);

        // First obsticle
        // Draw bottom and top
        ctx.drawImage(bottomLog, Obsticles.first.x, Obsticles.first.y, Obsticles.first.width, Obsticles.first.height);

        // Calculate top box positions for hitbox
        Obsticles.first_top.x = Obsticles.first.x;
        Obsticles.first_top.y = 0;
        Obsticles.first_top.height = height - Obsticles.first.height - Chestnut.gap;

        // Draw top half
        ctx.drawImage(topLog, Obsticles.first_top.x, Obsticles.first_top.y, Obsticles.first_top.width, Obsticles.first_top.height);

        // Second obsticle
        // Draw bottom box and top
        ctx.drawImage(bottomLog2, Obsticles.second.x, Obsticles.second.y, Obsticles.second.width, Obsticles.second.height);

        // Calculate top box position for hitbox
        Obsticles.second_top.x = Obsticles.second.x;
        Obsticles.second_top.y = 0;
        Obsticles.second_top.height = height - Obsticles.second.height - Chestnut.gap;

        // Draw second box
        ctx.drawImage(topLog2, Obsticles.second_top.x, Obsticles.second_top.y, Obsticles.second_top.width, Obsticles.second_top.height);


        ctx.drawImage(ChestnutSprite, Chestnut.x, Chestnut.y);

		if ( Coin.spawned ){
        	ctx.drawImage(coin, Obsticles.second.x + ( Obsticles.second.width / 2 ) - Coin.width, Obsticles.second.y - Coin.height - (Chestnut.gap / 2));
        	Coin.x = Obsticles.second.x;
        	Coin.y = Obsticles.second.y - Coin.height - (Chestnut.gap / 2);
        	if ( isCollide(Chestnut, Coin) ){
	        	captureCoin();
        	}
		}
		
		function captureCoin(){
			Coin.spawned = false;
			Coin.collected++;
			$('.coinscount').html(Coin.collected);
            createjs.Sound.play("coin");
		}
        //-------------------------------------
        //+++++++++++++++Points++++++++++++++++
        //-------------------------------------
        if (Obsticles.first.x >= 199 && Obsticles.first.x <= 201) {
            pointGained();
			checkHSTree("first");
			
        }
        if (Obsticles.second.x >= 199 && Obsticles.second.x <= 201) {
            pointGained();
            if (hacked) Chestnut.gap = 0;
			checkHSTree("second");
			
        }
		var nextLog = "";
		function checkHSTree(log){
			if ( points === highscore -1 ) {
				nextLog =  log;
				Sign.x = width + Sign.width;
				Sign.spawned = true;
			}
		}
		// if sign draw on
		// draw sign
		// if leaves canvas sign draw off
		
		if ( Sign.spawned ) {
			Sign.x -= 3;
			ctx.drawImage(highsign, Sign.x, Sign.y, Sign.width, Sign.height);
			
		}
		
        //-------------------------------------
        //+++++++++++Whoosh Anim+++++++++++++++
        //-------------------------------------

        if (Chestnut.whoosh) {
            // Offset the whoosh image by the height of Chestnut
            ctx.drawImage(whoosh, Chestnut.x + 10, Chestnut.y + Chestnut.height - 10);
        }

        // Update game loop at set FPS
        setTimeout(function () {
            requestAnimationFrame(update_frame);
        }, 1000 / fps);
    }
    

    // Check if localstorage highscore exists, if not set to 0
    if (localStorage.getItem("voxelbit_ffhs") === null) {
        localStorage['voxelbit_ffhs'] = 0;
    }

    // If the player has hit a wall, stop the game and  
    // restart game
    function restart() {
        if ( points > highscore ) {
            localStorage['voxelbit_ffhs'] = points;
        }
        highscore = localStorage['voxelbit_ffhs'];
        $('.highscore').html(highscore);
        $('.currentscore').html(points);
        $('.score').show();
        $('.start').show();

        // Reset the Que
        que = 0;

        // Reset obsticles
        Obsticles.first.x = -80;
        Obsticles.second.x = width;

        // Reset Chestnut's location
        Chestnut.x = width / 2 - 50;
        Chestnut.y = height / 2 - 25;

        // Restart the score
        points = 0;

        hasinitiated = false;
    }

});