import { Sitting, Runing,Jumping,Falling,ROLLING ,DIVING, Hit} from "./playerStates.js";
import { CollisionAnimation } from "./collisionAnimation.js";
import { floattingMessage } from "./flottingMessages.js";
export class Player{
    constructor(game){
        this.game=game;
        this.height=91.3;
        this.width=100;
        this.x=0;
        this.vy=0;
        this.frameX=0;
        this.frameY=0;
        this.y=this.game.height-this.height-this.game.groundMargin;
       this.image=document.getElementById('player');
       this.speed=5;
       this.maxSpeed=15;
       this.weight=1;
       this.states=[new Sitting(this.game),new Runing(this.game),new Jumping(this.game),
        new Falling(this.game),new ROLLING(this.game),new DIVING(this.game),new Hit(this.game)];
       this.maxFrame;
       this.fps=20;
       this.frameInterval=1000/this.fps;
       this.frameTimer=0;
       this.sound=new Audio;
       this.sound.src="assets/fire.wav";
    }
    update(input,deltaTime){
        this.checkCollision();
        this.currentState.handleInput(input);
        //horizontal movment
        this.x+=this.speed;
      if(input.includes("ArrowRight")&& this.currentState!==this.states[6])this.speed=this.maxSpeed;
      else if (input.includes("ArrowLeft")&& this.currentState!==this.states[6])this.speed=- this.maxSpeed;
      else this.speed=0;
      //horizontal boundaries
      if (this.x<0)this.x=0;
      if (this.x>this.game.width-this.width)this.x=this.game.width-this.width;
    //vertical movment
     this.y+= this.vy;
    if(!this.onGround()) this.vy+=this.weight;
    else this.vy=0;
    //vertical boundaries
    if(this.y>this.game.height-this.height-this.game.groundMargin)this.y=this.game.height-this.height-this.game.groundMargin;
    //sprite animation
        if (this.frameTimer>this.frameInterval){
            this.frameTimer=0;
            if(this.frameX <this.maxFrame)this.frameX++;
           else this.frameX=0;
        }else{
            this.frameTimer+=deltaTime;
        }
    
    }
       draw(context){
        if(this.game.debug)context.strokeRect(this.x,this.y,this.width,this.height)
       context.drawImage(this.image,this.frameX*this.width,this.frameY*this.height,this.width,this.height,this.x,this.y,this.width,this.height)
    }
    onGround(){
        return this.y>=this.game.height-this.height-this.game.groundMargin;
    }
    setState(state,speed){
        this.currentState=this.states[state];
        this.game.speed=speed;
        this.currentState.enter();
    }
    checkCollision(){
     this.game.enemies.forEach(enemy => {
        if(enemy.x<this.x+this.width && 
        enemy.x+enemy.width>this.x &&
        enemy.y<this.y+this.height&&
        enemy.y+enemy.height>this.y)
        {
       //collision
       enemy.markedForDeletion=true;
       this.game.collisions.push(new CollisionAnimation(this.game,enemy.x+enemy.width*0.5,enemy.y+enemy.height*0.5));
       if(this.currentState===this.states[4] || this.currentState===this.states[5]){
        this.sound.play();
        this.sound.play();
        this.game.score++;
        this.game.floatingMessages.push(new floattingMessage('+1',enemy.x,enemy.y,150,50));
       }else{
        
         this.game.lives--;
         if(this.game.lives<=0){
            this.game.gameOver=true;
         this.setState(6,0);}
       }
    
        }
     });
    }

    restart(){
        this.x=0;
        this.vy=0;
        this.frameY=5;
        this.frameX=0;
        this.y=this.game.height-this.height-this.game.groundMargin;
       this.speed=5;
       this.states[0];
      this.maxFrame=4;
       this.maxSpeed=5;
       this.weight=1;
      this.fps=20;
      this.frameInterval=1000/this.fps;
      this.frameTimer=0;
    }
}