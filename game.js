var game;


var gameOptions = {
	gameWidth: 375, 
	gameHeight: 667
	
}



var endPoint,hand;

var paths = [
     [ {x:50, y:700},{x:250, y:200},{x:150, y:500},{x:100,y:200} ]
]

window.onload = function() {	
	game = new Phaser.Game(gameOptions.gameWidth, gameOptions.gameHeight);
     game.state.add("TheGame", TheGame);
     game.state.start("TheGame");
}

var TheGame = function(){};

TheGame.prototype = {
     
     
     preload: function(){
          // game.load.spritesheet("tiles", "titlePath", tilesSize, tilesSize);
          game.load.image("point", "assets/sprites/player.png"); 
          game.load.image("hand", "assets/sprites/hand1.png"); 
          game.load.image("uphand", "assets/sprites/hand1_up.png"); 
          game.load.image("downhand", "assets/sprites/hand1_down.png"); 
     },
     
     
  	create: function(){
          game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		      game.scale.pageAlignHorizontally = true;
		      game.scale.pageAlignVertically = true; 
          game.stage.backgroundColor = "#4488AA";
          game.physics.startSystem(Phaser.Physics.ARCADE);
          this.createPoint();
          this.makeHand();
          game.input.onDown.add(this.handBeCut, this); 
         
  	}, 

     createPoint:function(){
          this.endPoint = game.add.sprite(game.world.centerX, 50, 'point');
          this.endPoint.anchor.set(0.5);
          paths[0].push({x:this.endPoint.x,y:this.endPoint.y })
          
     },

     makeHand:function(){
          this.pathIndex = 0;
          this.hand = game.add.sprite(game.world.centerX, 800, 'hand');
          this.hand.anchor.set(0.5,0);
          game.physics.arcade.enable(this.hand);
          this.handMove();
          

          
     },

     handMove:function(){
          toPoint = new Phaser.Pointer(game);
          toPoint.x = paths[0][this.pathIndex].x
          toPoint.y = paths[0][this.pathIndex].y
          
          game.physics.arcade.moveToPointer( this.hand, 400, toPoint );   
     },

     handBeCut: function(){
          hand = this.hand;
          upPartOption = {
              x : hand.x,
              y : hand.y,
              anchorX : 0.5,
              anchorY : 0.5
          }
          upPart = game.add.sprite(upPartOption.x, upPartOption.y, 'uphand');
          upPart.anchor.set(upPartOption.anchorX,upPartOption.anchorY);
          

          downPartOption = {
              x : hand.x  ,
              y : hand.y + upPart.height / 2 ,
              anchorX : 0.5,
              anchorY : 0
          }
          downPart = game.add.sprite(downPartOption.x, downPartOption.y, 'downhand');
          downPart.anchor.set(downPartOption.anchorX,downPartOption.anchorY);

          this.handDrop(upPart,downPart);

          this.hand.kill();
     },

     handDrop:function(hand,arm){
        that = this
        handtween = game.add.tween(hand).to({ scaleX:0.5, scaleY:0.5, angle: 180 , alpha: 0, x:"+100" , y : "-100"  }, 1000 , Phaser.Easing.Back.Out , true );
        handtween.onComplete.add(function(){
           downhandtween =  game.add.tween(arm).to({ alpha: 0 }, 500 , Phaser.Easing.Back.Out , true );
           downhandtween.onComplete.add(function(){
                that.makeHand()
           },this)
        },this)
     },

     update:function(){
         
          if(Phaser.Point.distance(this.hand, paths[0][this.pathIndex]) <= 10)
          {    
                if(this.pathIndex < paths[0].length - 1 )
                {
                   this.pathIndex++ 

                    this.handMove();
                }
                else{
                   this.hand.body.velocity.setTo(0, 0)
                }
               
                
          }




          
          
     }
     
     
}