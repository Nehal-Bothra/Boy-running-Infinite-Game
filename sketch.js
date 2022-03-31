var boy, boy_running, boy_collided;
var ground, groundImage;
var cloud, cloudImage;
var obstacle, obstacleImage;
var gameOver, gameOverImg;
var restart, restartImg;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var score = 0;

function preload(){
  boy_running = loadAnimation("boy.png");
  boy_collided = loadAnimation("boy_collided.png");
  groundImage = loadImage("ground.png")
  cloudImage = loadImage("cloud.png");
  obstacleImage = loadImage("tree.png");
  gameOverImg = loadImage("gameover.png");
  restartImg = loadImage("restart.png");
}

function setup(){
  createCanvas(600,600);
  //create boy
  boy = createSprite(200,200,20,40)
  boy.addAnimation("running", boy_running);
  boy.addAnimation("collided", boy_collided);
  boy.scale = 2;
  

  //create ground
  ground = createSprite(100,250,400,10);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);

  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;

}

function draw(){
  background("lightgreen");
  drawSprites();
  text("Score: "+ score, 500,50);
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    //change the trex animation
    boy.changeAnimation("running", boy_running);
    
    if(keyDown("space") && boy.y >= 159) {
      boy.velocityY = -12;
    }
  
    boy.velocityY = boy.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    boy.collide(ground);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(boy)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    boy.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    boy.changeAnimation("collided",boy_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
}
function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = boy.depth;
    boy.depth = boy.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  boy.changeAnimation("running", boy_running);
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
}
function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    obstacle.addImage(obstacleImage)
    //generate random obstacles
    obstacle.x = Math.round(random(100,500));
  
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}
