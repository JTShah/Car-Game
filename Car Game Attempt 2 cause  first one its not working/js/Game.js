class Game {
  constructor() {

    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leaderBoardTitle = createElement("h3");
    this.leader1 = createElement("h4");
    this.leader2 = createElement("h4");
    this.playerMoving = false;
    this.blast = false;

    this.leftKeyActive= false;

  }


  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.addImage("blast", blastImage)
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.addImage("blast", blastImage)
    car2.scale = 0.07;
    cars = [car1, car2];





    fuel_grp = new Group();
    coin_grp = new Group();
    obstacle_grp = new Group();

    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];

    this.addSprites(fuel_grp, 4, fuel_img, 0.02);
    this.addSprites(coin_grp, 25, coin_img, 0.09);
    this.addSprites(obstacle_grp, obstaclesPositions.length, obstacle1, 0.04, obstaclesPositions )

  }

  addSprites(spriteGroup, noOfSprites, spriteImage, scale, positions = []) {
    for(var i = 0; i<noOfSprites; i++) {
      var x, y;
      if(positions.length>0) {
        x = positions[i].x;
        y = positions[i].y;
        spriteImage = positions[i].image;

      }

      else{
        x = random(width/2 + 150, width/2 - 150);
        y = random(-height * 4.5, height - 400);
      }

     
      var sprite = createSprite(x,y);
      sprite.addImage("sprite", spriteImage);
      sprite.scale = scale;
      spriteGroup.add(sprite);

    }

  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    this.resetTitle.html("Play again, or else...");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width/2+280,50);

    this.resetButton.class("resetButton");
    this.resetButton.position(width/2+350,100);

    this.leaderBoardTitle.html("Our Best Players...");
    this.leaderBoardTitle.class("leaderBoard");
    this.leaderBoardTitle.position(width/3-60,50);

    this.leader1.class("leadersText");
    this.leader1.position(width/3-50,80);

    this.leader2.class("leadersText");
    this.leader2.position(width/3-50,130);


    
  }



  play() {
    this.handleElements();
    this.handleResetButton();
    Player.getPlayersInfo();
    player.getCarsAtEnd();
    


    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);
      this.showLeaderBoard();
      this.showFuelBar();
      this.showLife();

      //index of the array
      var index = 0;
      for (var plr in allPlayers) {
        //add 1 to the index for every loop
        index = index + 1;

        //use data form the database to display the cars in x and y direction
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        var currentLife = allPlayers[plr].life;
        if(currentLife <= 0) {
          cars[index-1].changeImage("blast");
          cars[index-1].scale = 0.3;
        }

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if(index === player.index) {
          fill("blue");
          stroke(10);
          ellipse(x,y , 60,60); 
          //camera badlo... towards the player
          camera.position.x = cars[index-1].position.x;
          camera.position.y = cars[index-1].position.y;
          this.handleCoins(index);
          this.handleFuel(index);
          this.handleObstacleCollision(index);
          this.handleCarCollision(index);

          if(player.life <= 0) {
            this.blast = true;
            this.playerMoving = false;
          }



        }
      }

// line de finite ( es en espanol):
const finishLine = height*6-100;
if(player.positionY > finishLine) {
  gameState = 2;
  player.rank += 1;
  Player.updateCarsAtEnd(player.rank);
  player.update();
  this.showRank();
}
  
    if(this.playerMoving) {
      player.positionY +=5;
      player.update();


    }

      this.handlePlayerControls();

      drawSprites();
    }
  }

  handlePlayerControls() {
    if(!this.blast) {
      // handling keyboard events
      if (keyIsDown(UP_ARROW)) {
        this.playerMoving = true;
        player.positionY += 10;
        player.update();
  }
    
    


    if(keyIsDown(LEFT_ARROW) && player.positionX > width/3-50) {
      this.leftKeyActive = true;
      player.positionX -= 5;
      player.update();

       }


    if(keyIsDown(RIGHT_ARROW) && player.positionX < width/2+250 ) {
      this.leftKeyActive = false;
      player.positionX += 5;
      player.update();
    }

    if(keyIsDown(DOWN_ARROW)) {
      player.positionY -= 10;
      player.update();
    }
  }

}
  
  showRank(){
    swal({
      title: `Awesome!${"\n"}Rank${"\n"}${player.rank}`,
      text: "You reached the finish line successfully",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }

  //progress bars...
  showLife() {
    push();
    image(lifeImage, width/2-130, height-player.positionY-400, 20,20);
    fill("white");
    rect(width/2-100, height-player.positionY-400, 185 ,20);
    fill("red");
    rect(width/2-100, height-player.positionY-400, player.life ,20);
    noStroke();
    pop();
  }



  showFuelBar() {
    push();
    image(fuel_img, width/2-130, height-player.positionY-350, 20,20);
    fill("white");
    rect(width/2-100, height-player.positionY-350, 185 ,20);
    fill("#B38614");
    rect(width/2-100, height-player.positionY-350, player.fuel ,20);
    noStroke();
    pop();
  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount:0,
        gameState:0,
        players:{},
        carsAtEnd:0

      });
      window.location.reload();

    });
  }

  handleFuel(index) {
    cars[index-1].overlap(fuel_grp,function (collector, collected){
      player.fuel = 185;
      collected.remove();
    });
    
    //fuel be adjusting
    if(this.playerMoving && player.fuel > 0) {
      player.fuel -= 0.2;
    }
    if(player.fuel <=0) {
      gameState = 2;
      this.gameOver();
      
    }

  }

  handleCarCollision(index)  {
    if(index === 1) {
      if(cars[index-1].collide(cars[1])) {
       if(this.leftKeyActive) {
        player.positionX += 100;
       }
       else{
        player.positionX -= 100;
       }
       if(player.life > 0) {
        player.life -= 185/5;
       }
       player.update();
      }


    }

    if(index === 2) {
      if(cars[index-1].collide(cars[0])) {
       if(this.leftKeyActive) {
        player.positionX += 100;
       }
       else{
        player.positionX -= 100;
       }
       if(player.life > 0) {
        player.life -= 185/5;
       }
       player.update();
      }


    }


  }

  handleObstacleCollision(index)  {
    if(cars[index-1].collide(obstacle_grp)) {
      console.log("car be colliding");
      if(this.leftKeyActive) {
        player.positionX +=100;

      }
      else {
        player.positionX -=100;
      }

    

      if(player.life > 0 ) {
       // this.blast = true;
        player.life -= 185/5;
      }
      player.update();

    }

  }



  handleCoins(index) {
    cars[index - 1].overlap(coin_grp, function(collector, collected) {
      player.score += 21;
      player.update();
      //collected is the sprite in the group collectibles that triggered
      //the event
      collected.remove();
    });
  }


  gameOver(){
    swal({
      title: `Game Over`,
      text: "Oops you lost my game, that's the end for you I guess...",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Thanks for tryin though..."
    });
  }


  






  showLeaderBoard() {
   var leader1, leader2;
   var players = Object.values(allPlayers);

   if((players[0].rank === 0 && players[1].rank === 0) || players[0].rank === 1) {
      leader1 = 
        players[0].rank +
        "&emsp;"+
        players[0].name+
        "&emsp;" +
        players[0].score;

      leader2 = 
        players[1].rank +
        "&emsp;"+
        players[1].name+
        "&emsp;" +
        players[1].score;

      
   }
   if(players[0].rank === 1) {
    leader2 = 
    players[0].rank +
    "&emsp;"+
    players[0].name+
    "&emps;" +
    players[0].score;

  leader1 = 
    players[1].rank +
    "&emsp;"+
    players[1].name+
    "&emps;" +
    players[1].score;
   }

   this.leader1.html(leader1);
   this.leader2.html(leader2);


  }

  end() {
    console.log("gameOver") ;
  }
}





