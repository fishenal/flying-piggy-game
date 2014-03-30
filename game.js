/*
 * author:yu_dong_han ## hotmail.com
 * date:2014-2-12
 * 
 * */

//http://www.goodboydigital.com/pixijs/docs
//TODO:
//3 bitmaptext http://www.goodboydigital.com/pixijs/docs/classes/BitmapText.html

//collision detection ------ nearly give up

//6 游戏性调整

var assetsToLoader = [ "texture.json"];

loader = new PIXI.AssetLoader(assetsToLoader);

loader.onComplete = Main;

loader.load();

function Main(){
	//load audio
	var wingsound = loadAudio("audio/swing.wav"); 
	var hitsound = loadAudio("audio/hit.wav");
	var passsound = loadAudio("audio/pass.wav");
	
	var filesToLoad = 3;
	var filesLoaded = 0;
	var audioLoadOK = false;
	
	function loadAudio(uri){
	    var audio = new Audio();
	    audio.addEventListener('canplaythrough', isAppLoaded, false); 
	    audio.src = uri;
	    return audio;
	}
	
	function isAppLoaded(){
		if(audioLoadOK){
			return;
		}
	    filesLoaded++;
	    if (filesLoaded >= filesToLoad){
	    	audioLoadOK = true;
	    	/*---运行动画-->*/
	    	animate();
	    }
	}
	
	//////////////////////////////////
	var WIDTH = 500;//总宽
	var HEIGHT = 600;//总高
	var GROUNDHEIGHT = 100;//地面高度
	var SKYHEIGHT = HEIGHT - GROUNDHEIGHT;//天空部分高度
	
	var PILEWIDTH = 80;//管子宽度
	var PILEGAP = WIDTH - PILEWIDTH - 100;//两个管子之间的距离
	
	var BIRDLEFT = 100;//初始鸟距离左侧
	var BIRDINTSPEED = 8;
	var BIRDDOWNRATE = 0.4;
	
	var GROUNDSPEED = 6;
	/*---------------------------*/
	var PILES = [];
	
	var PILEPAIRGAP = 180;//上下管子之间的距离
	var MINPILESHOW = 50;//管子漏出高度
	/*---------------------------*/
	
	var Stopanimate = false;//是否停止动画
	var Begin = false;//是否开始
	var Die = false;//是否死
	var Score = 0;//分数
	var HiScore = Score;
	var Pileindex = 0;//记录管子出现个数
	/*---------------------------*/
	
	//////////////////////////////////
	var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);
	document.body.appendChild(renderer.view);
	//////////////////////////////////
	
	var stage = new PIXI.Stage(0x66FF99);
		stage.buttonMode = true;
		stage.mousedown = stage.touchstart = function(){
			if(!Begin){
				Begin = true;
				hand.visible = false;
				score.setText(0);
				addNewPile();/*---加第一个管子-->*/
			}
			bird.speedY = BIRDINTSPEED;
			wingsound.play();
		};
	
	//////////////////////////////////

	var bg = PIXI.Sprite.fromFrame("bg.png");;
		bg.position.x = 0;
		bg.position.y = 0;
	
	//////////////////////////////////
	
	var fg_texture = PIXI.Texture.fromFrame("run_bg.png");
	var fg = new PIXI.TilingSprite(fg_texture,WIDTH,GROUNDHEIGHT)
		fg.position.x = 0;
		fg.position.y = SKYHEIGHT;
	
	//////////////////////////////////
	var pileGroup = new PIXI.DisplayObjectContainer();
	
	//////////////////////////////////
	
	var bird_texture_array = [
		PIXI.Texture.fromFrame("bird.png"),
		PIXI.Texture.fromFrame("bird2.png")
	]
	var bird = new PIXI.MovieClip(bird_texture_array);
		bird.animationSpeed = 0.1;
		bird.play();
		bird.anchor.x = 0.5;
		bird.anchor.y = 0.5;
		bird.width  = 60;
		bird.height = 48;
		bird.speedY = BIRDINTSPEED;
		bird.rate = BIRDDOWNRATE;
		bird.position.x = BIRDLEFT;
		bird.position.y = 200;
	
	
	
	//////////////////////////////////
	
	var score = new PIXI.Text(Score,{fill:'white'});
		score.position.x = 250;
		score.position.y = 20;
		
	//////////////////////////////////
	
	var hand = new PIXI.Sprite.fromFrame("hand.png");
		hand.width = 38;
		hand.height = 66;
		hand.position.x = 75;
		hand.position.y = 240;
		hand.visible = true;
	
	//////////////////////////////////
	
	var dialog_score = new PIXI.Text(Score);
		dialog_score.position.x = -25;
		dialog_score.position.y = -70;
	
	//////////////////////////////////
	
	var dialog_hi_score = new PIXI.Text(HiScore);
		
		dialog_hi_score.position.x=-25;
		dialog_hi_score.position.y=-30;
	
	//////////////////////////////////
	
	var restart_texture = PIXI.Texture.fromFrame("again2.png");
	var restart_btn = new PIXI.Sprite(restart_texture);
		restart_btn.position.x = -50;
		restart_btn.position.y= 35;
		restart_btn.width = 99;
		restart_btn.height = 28;
		restart_btn.interactive = true;
		restart_btn.buttonMode = true;
		
		restart_btn.click = restart_btn.tap = function(){
			Begin = false;
			Die = false;
			hand.visible = true;
			Stopanimate = false;
			bird.rotation = 0;
			dialog.visible = false;
			Pileindex = 0;//记录管子出现个数
			Score = 0;//分数
			pileGroup.children = []
			PILES = [];
			
			bird.position.x = BIRDLEFT;
			bird.position.y = 200;
			
			animate();
			//requestAnimFrame( animate );
		}
		
	//////////////////////////////////
		
	var dialog = new PIXI.Sprite.fromFrame("popup.png")
		dialog.visible = false;
		dialog.width = 300;
		dialog.height = 200;
		dialog.anchor.x = 0.5;
		dialog.anchor.y = 0.5;
		dialog.position.x = WIDTH/2;
		dialog.position.y = HEIGHT/2;
			
		dialog.addChild(dialog_score);
		dialog.addChild(dialog_hi_score);
		dialog.addChild(restart_btn);
		
	//////////////////////////////////
	
	function showdialog(){
		var _hiscore_cookie = getCookie("ppbird_hiscore");
		
		if(_hiscore_cookie > HiScore){
			HiScore = _hiscore_cookie;
		}
		
		if(Score > HiScore){
			HiScore = Score;
			setCookie("ppbird_hiscore",HiScore,7);
		}
		
		dialog_score.setText(Score)
		dialog_hi_score.setText(HiScore)
		dialog.visible = true;
	}
	
	//////////////////////////////////
	stage.addChild(bg);
	stage.addChild(hand);
	stage.addChild(pileGroup);
	stage.addChild(score);
	stage.addChild(bird);
	stage.addChild(fg);
	stage.addChild(dialog);
	//////////////////////////////////
	
	function hit(){
		hitsound.play()
		Die = true
	}
	
	function pass(){
		passsound.play()
		Score++
		score.setText(Score)
	}
	
	function addNewPile(){
		
		var pile = new PIXI.Sprite.fromFrame("pile.png");
		var pile2 = new PIXI.Sprite.fromFrame("pile2.png");
		
		var pilepair = {};
		
		/*---------------------------*/
		
		pile.width = pile2.width = PILEWIDTH;
		pile.height = pile2.height = 500;
		pile.anchor.x = pile2.anchor.x = 0.5;
		pile.anchor.y = pile2.anchor.y = 0.5;
		pile.rotation = Math.PI;
		
		/*------------取得管子的上下限---------------*/
		pile.position.max = SKYHEIGHT - MINPILESHOW - PILEPAIRGAP - pile.height/2;
		pile.position.min = -(pile.height/2 -MINPILESHOW);
		
		pile.position.y = Math.floor(Math.random()*(pile.position.max-pile.position.min+1)+pile.position.min)
		
		pile2.position.y = pile.height + pile.position.y + PILEPAIRGAP;
		/*---------------------------*/
		pile.position.x = pile2.position.x = 600;
		
		pilepair.upper = pile.position.y + pile.height/2;
		pilepair.lower = pilepair.upper + PILEPAIRGAP;
		pilepair.pile = pile;
		pilepair.pile2 = pile2;
		
		pileGroup.addChild(pile);
		pileGroup.addChild(pile2);
		
		/*---------------------------*/
		Pileindex++;
		if(Pileindex > 3){
			PILES.shift();
		}
		
		PILES.push(pilepair);
		/*---------------------------*/
	}
	
	function animate() {
		if(Stopanimate){
			return;
		}
		
	    requestAnimFrame( animate );
	    
	    fg.tilePosition.x -= GROUNDSPEED;
	    
	    /*---------------------------*/
		if(Begin){
				bird.position.y -= bird.speedY;
				
				bird.speedY -= bird.rate;
				if(bird.speedY > -3){
					if(bird.rotation < -Math.PI/8){
						bird.rotation = -Math.PI/8
					}else{
						bird.rotation -= Math.PI/180;
					}
				}else{
					if(bird.rotation > Math.PI/2){
						bird.rotation = Math.PI/2
					}else{
						bird.rotation += Math.PI/120;
					}
					
				}
		}
		
		if(Die){
			bird.position.y += 10;
			bird.rotation += Math.PI/4;
			
			if(bird.rotation > Math.PI/2 && bird.position.y > SKYHEIGHT - bird.height/2){
				showdialog()
				Stopanimate = true;
			}
		}else{
		   if((bird.position.y + bird.height/2) > SKYHEIGHT){
		   		hit()
		   }
		   
		   for (var i = 0; i < PILES.length; i++){	
				PILES[i].pile.position.x -= 4;
				PILES[i].pile2.position.x -= 4;
				
				if(i == PILES.length - 1 && PILES[i].pile.position.x <= PILEGAP){
					addNewPile()
				}
				
				if(PILES[i].pile.position.x == BIRDLEFT){
					pass()
				}
				
				if(PILES[i].pile.position.x + PILEWIDTH/2 >=BIRDLEFT - bird.width/2 && PILES[i].pile.position.x - PILEWIDTH/2 <=BIRDLEFT + bird.width/2){
					if((bird.position.y-bird.height/2) < PILES[i].upper || (bird.position.y + bird.height/2) > PILES[i].lower){
						hit()
					}
				}
			}
		}
		
	    renderer.render(stage);
	}
	
}//Main()



/*Helper*/
function setCookie(c_name,value,exdays){
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + 
	((exdays==null) ? "" : ("; expires="+exdate.toUTCString()));
	document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name){
	var i,x,y,ARRcookies=document.cookie.split(";");
	for(i=0;i<ARRcookies.length;i++){
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if(x==c_name){
			return unescape(y);
		}
	}
}