import { Player } from "./player.js";
import {InputHandler} from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy , GroundEnemy ,ClimbingEnemy } from "./enemies.js";
import { Ui } from "./ui.js";
document.addEventListener('DOMContentLoaded',function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width =1000;
    canvas.height =500; 

    class Game{
        constructor(width,height){
            this.width=width;
            this.height=height;
            this.speed=0;
            this.maxSpeed=15;
            this.groundMargin=60;
            this.player= new Player(this);
            this.input= new InputHandler(this);
            this.background=new Background(this);
            this.ui=new Ui(this);
            this.particles =[];
            this.enemies=[];
            this.collisions=[];
            this.floatingMessages=[];
            this.enemyTimer=0;
            this.enemyInterval=2000;
           // this.debug=false;
            this.score=0;
            this.fontColor='black';
            this.maxParticles=50;
            this.time=0;
            this.maxTime=60000;
            this.winingScore=30;
            this.player.currentState=this.player.states[0];
           this.player.currentState.enter();
           this.gameOver=false;
           this.lives=5;
           
        }
        update(deltaTime){
            this.time +=deltaTime;
            if(this.time>this.maxTime) {
                this.gameOver=true;}
            this.background.update();
            this.player.update(this.input.keys,deltaTime);
            //enemies
            if(this.enemyTimer>this.enemyInterval){
            this.addEnemy();
            this.enemyTimer=0;
            }else{
                 this.enemyTimer+=deltaTime;
            }
            this.enemies.forEach(enemy =>{
                enemy.update(deltaTime);
            })
            //floatMessage
            this.floatingMessages.forEach(floatingMessage =>{
                floatingMessage.update(deltaTime);
            })
            //particles
            this.particles.forEach((particle,index)=>{
                particle.update();
            });
            if(this.particles.length>this.maxParticles){
                this.particles.length=this.maxParticles;
            }
            //collision sprites
            this.collisions.forEach((collision,index) =>{
                 collision.update(deltaTime);
                
            })
            this.collisions=this.collisions.filter(collision => !collision.markedForDeletion)
            this.particles=this.particles.filter(particle => !particle.markedForDeletion)
            this.enemies=this.enemies.filter(enemy => !enemy.markedForDeletion)
            this.floatingMessages=this.floatingMessages.filter(message => !message.markedForDeletion)
        }
        draw(context){
         this.background.draw(context);
         this.player.draw(context);
         this.enemies.forEach(enemy =>{
            enemy.draw(context);
        });
        this.particles.forEach(particle =>{
            particle.draw(context);
        });
        this.collisions.forEach(collision =>{
            collision.draw(context);
        });
        this.floatingMessages.forEach(floatingMessage =>{
            floatingMessage.draw(context);
            
        })
        this.ui.draw(context);
        
        }
        addEnemy(){
          this.enemies.push(new FlyingEnemy(this));
          if(this.speed>0 && Math.random()<0.6) this.enemies.push(new GroundEnemy(this));
          else if (this.speed>0 && Math.random()<0.9)this.enemies.push(new ClimbingEnemy(this));
        }

         restartGame(){
            console.log('restart');
            this.player.restart();
            this.particles =[];
            this.enemies=[];
            this.collisions=[];
            this.floatingMessages=[];
            this.lives=5;
            this.score=0;
            this.time=0;
            this.maxTime=60000;
            this.speed=0;
            this.maxSpeed=15;
            this.gameOver=false;
            this.player.currentState=this.player.states[0];
            animate(0);

            }
        
    }
    const game=new Game(canvas.width,canvas.height);
    let lastTime =0;
    function animate(timeStamp){
        const deltaTime= timeStamp-lastTime;
        lastTime =timeStamp;
        ctx.clearRect(0,0,canvas.width,canvas.height);
        game.draw(ctx);
        game.update(deltaTime);
        if((!game.gameOver) || (game.time<game.maxTime+50))requestAnimationFrame(animate);
 
    }
    animate(0);
});
