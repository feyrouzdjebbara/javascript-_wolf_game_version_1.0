export class Ui{
    constructor(game){
        this.game=game;
        this.fontSize=30;
        this.fontFamily='Creepster'
        this.liveImage=lives;
    }
    draw(context){
        context.save();
        context.shadowOffsetX=2;
        context.shadowOffsetY=2;
        context.shadowColor='white';
        context.shadowBlur=0;
        context.font="30px Creepster";
        context.textAlign='left';
        context.FillStyle=this.game.fontColor;
        //score
        context.fillText('Score: '+this.game.score+'/20 ',20,50);
        //timer
        context.font="25px Creepster";
        context.fillText('Time: '+(this.game.time* 0.001).toFixed(0)+'/60',20,80);
        //lives
        for(let i=0;i<this.game.lives;i++){
            context.drawImage(this.liveImage,20*i+20,95,25,25)
        }
        
        //gameOver
        if(this.game.gameOver){
            context.textAlign='center';
            context.font="50px Creepster";
           if(this.game.score>=this.game.winingScore){
            context.fillText('Ohh-yeah ',this.game.width*0.5,this.game.height*0.5);
            context.font="20px Creepster";
            context.fillText('What are creatures of the night afraid of? YOU!!! '
            ,this.game.width*0.5,this.game.height*0.5 +30);
            context.fillText(' Press Alt to restart! '
            ,this.game.width*0.5,this.game.height*0.5 +60);
        }else{
            context.fillText('Game over ',this.game.width*0.5,this.game.height*0.5);
            context.font="20px Creepster";
            context.fillText('Better luck next time!, Press Alt to restart! '
            ,this.game.width*0.5,this.game.height*0.5 +30);
        }

        }
        context.restore();
    }
}