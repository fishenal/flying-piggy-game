	/*
	 * author:yu_dong_han ## hotmail.com
	 * date:2014-2-12
	 * 
	 * */
	
	//http://www.goodboydigital.com/pixijs/docs
	//TODO:
	//3 bitmaptext http://www.goodboydigital.com/pixijs/docs/classes/BitmapText.html
	
	//collision detection ------ nearly give up
	//loading preload
	
	//7 代码文件优化
	
	//6 游戏性调整
	var wingsound = loadAudio("audio/swing.wav"); 
	var hitsound = loadAudio("audio/hit.wav");
	var passsound = loadAudio("audio/pass.wav");
	
	var filesToLoad = 3;
	var filesLoaded = 0;
	var audioLoadOK = false;
	
	function loadAudio(uri){
	    var audio = new Audio();
	    audio.addEventListener('canplaythrough', isAppLoaded, false); // It works!!
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
	    	//start();
	    }
	}
	
	// create an array of assets to load
	var assetsToLoader = [ "texture.json"];

	// create a new loader
	loader = new PIXI.AssetLoader(assetsToLoader);
	
	
	// use callback
	loader.onComplete = main

	//begin load
	loader.load();
	
	
	//var assetsToLoader = ["number.xml"];

    // create a new loader
    //var loader = new PIXI.AssetLoader(assetsToLoader);

    // use callback
    //loader.onComplete = onAssetsLoaded;
    
    //loader.load();
	
	function main(){
		//////////////////////////////////
		var WIDTH = 500;//总宽
		var HEIGHT = 600;//总高
		var GROUNDHEIGHT = 100;//地面高度
		var SKYHEIGHT = HEIGHT - GROUNDHEIGHT;//天空部分高度
		
		var PILEWIDTH = 80;//管子宽度
		var PILEGAP = WIDTH - PILEWIDTH - 80;//两个管子之间的距离
		
		var BIRDLEFT = 100;//初始鸟距离左侧
		var BIRDINTSPEED = 6;
		var BIRDDOWNRATE = 0.2;
		
		//var PILESPEED = 3;
		var GROUNDSPEED = 8;
		/*---------------------------*/
		//var FlyUp = false;//是否向上
		var piles = [];
		var pileIndex = 0;//记录管子出现个数
		//var PILEPAIRGAP = 180;//上下管子之间的距离
		var PILEPAIRGAP = 180;//上下管子之间的距离
		var MINPILESHOW = 50;//管子漏出高度
		/*---------------------------*/
		
		var Stopanimate = false;//是否停止动画
		
		var Begin = Die = false;
		var Score = 0;//分数
		var HiScore = Score;
		
		/*---------------------------*/
		
		//////////////////////////////////
		var stage = new PIXI.Stage(0x66FF99);
	
		var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);
		
		document.body.appendChild(renderer.view);
		
		stage.mousedown = stage.touchstart = function(){
			//if(Stopanimate){
			//	restart();
			//}
			if(!Begin){
				Begin = true;
				_click.visible = false;
				_score.setText(0);
				/*---加第一个管子-->*/addNewPile();
			}
			//FlyUp = true;
			bird.speedY = BIRDINTSPEED;
			wingsound.play();
		};
		stage.buttonMode = true;
		//////////////////////////////////
		
		//bg
		//var bgtexture = PIXI.Texture.fromFrame("bg.png");
		var bg = PIXI.Sprite.fromFrame("bg.png");;
		//background position
		bg.position.x = 0;
		bg.position.y = 0;
		
		stage.addChild(bg);
		
		var run_bg = PIXI.Texture.fromFrame("run_bg.png");
		var fg = new PIXI.TilingSprite(run_bg,WIDTH,GROUNDHEIGHT)
		
		fg.position.x = 0;
		fg.position.y = SKYHEIGHT;
		
		
		//////////////////////////////////
		var pileGroup = new PIXI.DisplayObjectContainer();
		/*----->*/stage.addChild(pileGroup);
		
		
		//////////////////////////////////
		var bird = new PIXI.DisplayObjectContainer();
		
		
		
		var bird_array = [
			PIXI.Texture.fromFrame("bird.png"),
			PIXI.Texture.fromFrame("bird2.png")
		]
		console.log(bird_array)
		var bird = new PIXI.MovieClip(bird_array);
		bird.animationSpeed = 0.1;
		console.log(bird)
		bird.play();
		
		
		/*----->*/stage.addChild(bird);
		//var bird = new PIXI.Sprite.fromFrame("bird.png");
		//birder
		bird.anchor.x = 0.5;
		bird.anchor.y = 0.5;
		
		bird.width  = 60;
		bird.height = 48;
		//bird.fallspeedY = 1;
		
		//bird.fall_rate = 0.8;
		bird.speedY = BIRDINTSPEED;
		
		bird.rate = BIRDDOWNRATE;
		
		//////////////////////////////////
		
		
		
		//var _score = new PIXI.BitmapText("123", "35px LCDSolid");
		var _score = new PIXI.Text(Score,{fill:'white'});
		_score.position.x = 250;
		_score.position.y = 20;
		stage.addChild(_score);
		//////////////////////////////////
		var _click = new PIXI.Sprite.fromFrame("hand.png");
		_click.width = 38;
		_click.height = 66;
		_click.position.x = 75;
		_click.position.y = 240;
		
		_click.visible = true;
		stage.addChild(_click);
		//////////////////////////////////
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
			//var pilepair = new PIXI.DisplayObjectContainer();
			
			/*---在最前面的最后加载前景-->*///stage.addChild(fg);
			/*---在最前面的最后加载前景-->*///stage.addChild(_score);
			
			//pilepair.addChild(pile)
			//pilepair.addChild(pile2)
			
			
			pilepair.upper = pile.position.y + pile.height/2;
			pilepair.lower = pilepair.upper + PILEPAIRGAP;
			pilepair.pile = pile;
			pilepair.pile2 = pile2;
			
			pileGroup.addChild(pile);
			pileGroup.addChild(pile2);
			
			/*---------------------------*/
			pileIndex++;
			if(pileIndex > 4){
				piles.shift();
			}
			
			piles.push(pilepair);
			/*---------------------------*/
		}
		
		function start(){
			//begin = false;
			//piles = []
			//FlyUp = false;
			//stage.removeChild(pileGroup);
			//popup.visible = false;
			// INT BIRD POSITION
			bird.position.x = BIRDLEFT;
			bird.position.y = 200;
			
			/*---在最前面的最后加载前景-->*/   stage.addChild(fg);
			/*---运行动画-->*/               requestAnimFrame( animate );
			
		}
		
		start()
		
		//////////////////////////////////
		function animate() {
			if(Stopanimate){
				return;
			}
		    requestAnimFrame( animate );
		    fg.tilePosition.x -= GROUNDSPEED;
		    //bird.rotation += 0.1;
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
					showpop()
					Stopanimate = true;
				}
			}else{
			   if((bird.position.y + bird.height/2) > SKYHEIGHT){
			   		die();
			   }
			   
			   for (var i = 0; i < piles.length; i++){	
					piles[i].pile.position.x -= 2.5;
					piles[i].pile2.position.x -= 2.5;
					
					if(i == piles.length - 1 && piles[i].pile.position.x == PILEGAP){
						addNewPile();
					}
					
					if(piles[i].pile.position.x == BIRDLEFT){
						passsound.play();
						Score++
						_score.setText(Score)
						
					}
					
					if(piles[i].pile.position.x + PILEWIDTH/2 >=BIRDLEFT - bird.width/2 && piles[i].pile.position.x - PILEWIDTH/2 <=BIRDLEFT + bird.width/2){
						if((bird.position.y-bird.height/2) < piles[i].upper || (bird.position.y + bird.height/2) > piles[i].lower){
							die();
						}
					}
				}
			}
			
		    /*---------------------------*/
		  
		   
		   
		    /*---------------------------*/
		    renderer.render(stage);
		}
		
		
		//////////////////////////////////
		//function stopanimate(){
		//	Stopanimate = true;
		//}
		
		var popup = new PIXI.Sprite.fromFrame("popup.png")
			popup.visible = false;
			popup.width = 300;
			popup.height = 200;
			
			popup.anchor.x = 0.5;
			popup.anchor.y = 0.5;
			popup.position.x = WIDTH/2;
			popup.position.y = HEIGHT/2;
			stage.addChild(popup);
		var _diescore = new PIXI.Text(Score);
		var _diehiscore = new PIXI.Text(HiScore);
			_diescore.position.x = -25;
			_diescore.position.y = -70;
			
			_diehiscore.position.x=-25;
			_diehiscore.position.y=-30;
		
		
		
		var _retexture1 = PIXI.Texture.fromFrame("again1.png");
		var _retexture2 = PIXI.Texture.fromFrame("again2.png");
		var _re = new PIXI.Sprite(_retexture2);
			_re.position.x = -50;
			_re.position.y= 35;
			_re.width = 99;
			_re.height = 28;
			
			_re.interactive = true;
			_re.buttonMode = true;
			
			_re.click = _re.tap = function(){
				//restart!
				
				Begin = false;
				Die = false;
				_click.visible = true;
				Stopanimate = false;
				bird.rotation = 0;
				popup.visible = false;
				pileIndex = 0;//记录管子出现个数
				Score = 0;//分数
				pileGroup.children = []
				console.log(pileGroup.children.length)
				/*----->*///stage.removeChild(pileGroup);
				piles = [];
				start();
			}
		popup.addChild(_diescore);
		popup.addChild(_diehiscore);
		popup.addChild(_re);
		
		function die(){
			hitsound.play();
			Die = true;
			//Stopanimate = true;
		}
		function showpop(){
			//_score.setText(0);
			var _hiscore_cookie = getCookie("ppbird_hiscore");
			
			if(_hiscore_cookie > HiScore){
				HiScore = _hiscore_cookie;
			}
			
			if(Score > HiScore){
				HiScore = Score;
				setCookie("ppbird_hiscore",HiScore,1);
			}
			
			_diescore.setText(Score)
			_diehiscore.setText(HiScore)
			popup.visible = true;
		}
		
		function setCookie(c_name,value,exdays){
	      var exdate=new Date();
	      exdate.setDate(exdate.getDate() + exdays);
	      var c_value=escape(value) + 
	        ((exdays==null) ? "" : ("; expires="+exdate.toUTCString()));
	      document.cookie=c_name + "=" + c_value;
	    }
	
	    function getCookie(c_name){
	     var i,x,y,ARRcookies=document.cookie.split(";");
	     for (i=0;i<ARRcookies.length;i++){
	      x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
	      y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
	      x=x.replace(/^\s+|\s+$/g,"");
	      if (x==c_name)
	      {
	       return unescape(y);
	      }
	     }
	    }
		
		
		
		
		
		
	}//main end
	
	
