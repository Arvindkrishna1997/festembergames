import Player from "../../prefabs/player";
import Obstacle from "../../prefabs/obstacle";
import EnemyNav from "../../prefabs/enemyNav";
import EnemyBasic from "../../prefabs/enemyBasic";
import MovableObstacle from "../../prefabs/movableobstacle";
import obsNav from "../../prefabs/obsnav";
import Sword from "../../prefabs/sword";
import Stalagmite from "../../prefabs/stalagmite";
import Vanishobstacle from "../../prefabs/vanishobstacle";
import Snow from "../../prefabs/snow";
import GroupEnemy from "../../prefabs/groupEnemy";

import groupenemies from "./groupEnemy";
import vanishobs from "./vanishobstacle";
import stalagmites from "./stalagmite";
import obstacles from "./obstacles";
import enemyNavs from "./enemyNavs";
import enemies from "./enemies";
import movableobstacles from "./movingobs";
import movableNavs from "./obstaclenav";
//Documentation for Phaser's (2.5.0) states:: phaser.io/docs/2.5.0/Phaser.State.html
class Coldcountry extends Phaser.State {

  //initialization code in the constructor
  constructor(game, parent) {
    super(game,parent);
  }

  //Load operations (uses Loader), method called first
  preload() {

  }

  //Setup code, method called after preload
  create() {
    this.game.world.setBounds(0, 0, 11500, 1080);
    this.world.width = 11500;
    this.world.height = 1080;
    this.game.physics.arcade.gravity.y = 1400;

    this.bitmap = this.game.add.bitmapData(this.world.width, this.world.height);
    this.game.add.image(0, 0, this.bitmap);

    this.player = new Player(this.game, 100, 900);
    this.game.add.existing(this.player);
    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_TOPDOWN);

    const sword = new Sword(this.game, Math.abs(this.player.width / 2), this.player.height / 2);
    sword.y -= sword.height / 2;
    sword.kill();
    this.player.sword = sword;
    this.player.addChild(sword);
        const snnow=new Snow(this.game,10,20,"ar");
      this.game.add.existing(snnow);
    this.obstacles = [];
    for (const obstacle of obstacles) {
      const newObstacle = new Obstacle(this.game, obstacle.x, obstacle.y, obstacle.width, obstacle.height, "floor");
      this.game.add.existing(newObstacle);
      this.obstacles.push(newObstacle);
    }

    this.movableobstacles = [];
    for(const movobs of movableobstacles){
      const newmovobs = new MovableObstacle(this.game,movobs.x,movobs.y,movobs.width,movobs.height,"crosshairs");
      this.game.add.existing(newmovobs);
      this.movableobstacles.push(newmovobs);
    }

    //this.movableobstacles[0].position.x=100;
    this.movableobstacles[0].position.x=6200;

    this.movableobsNav = [];
    for(const movobsnav of movableNavs){
      const newmovobsnav = new obsNav(this.game,movobsnav.x,movobsnav.y,movobsnav.width,movobsnav.height);
      this.game.add.existing(newmovobsnav);
      this.movableobsNav.push(newmovobsnav);
    }


    this.stalagmites= [];
   for(const stalagmite of stalagmites)
    {
      const newstalagmite = new Stalagmite(this.game,stalagmite.x,stalagmite.y,"crosshairs");
      this.game.add.existing(newstalagmite);
      this.stalagmites.push(newstalagmite);

    }

    this.vanishobs =[];
      for(const vanishobstacle of vanishobs)
      {
          const newvanishobs = new Vanishobstacle(this.game,vanishobstacle.x,vanishobstacle.y,vanishobstacle.width,vanishobstacle.height,"floor");
          this.game.add.existing(newvanishobs);
          this.vanishobs.push(newvanishobs);
      }


    this.groupEnemies = [];
     for(const enemy of groupenemies)
     {
         const newEnemy1 =new GroupEnemy(this.game,enemy.x,enemy.y,enemy.vel);
         newEnemy1.cacheObstacles(this.obstacles);
         newEnemy1.cachePlayer(this.player);
         this.game.add.existing(newEnemy1);
         this.groupEnemies.push(newEnemy1);

         const newEnemy2 =new GroupEnemy(this.game,enemy.x+100,enemy.y,enemy.vel);
         newEnemy2.cacheObstacles(this.obstacles);
         newEnemy2.cachePlayer(this.player);
         this.game.add.existing(newEnemy2);
         this.groupEnemies.push(newEnemy2);

          const newEnemy3 =new GroupEnemy(this.game,enemy.x+200,enemy.y,enemy.vel);
         newEnemy3.cacheObstacles(this.obstacles);
         newEnemy3.cachePlayer(this.player);
         this.game.add.existing(newEnemy3);
         this.groupEnemies.push(newEnemy3);

     }


    this.movableobstacles[0].vel = 200;

      this.enemyNavs = [];
      for (const enemyNav of enemyNavs) {
          const newEnemyNav = new EnemyNav(this.game, enemyNav.x, enemyNav.y, enemyNav.width, enemyNav.height);
          this.game.add.existing(newEnemyNav);
          this.enemyNavs.push(newEnemyNav);
      }

      this.enemies = [];
      for (const enemy of enemies) {
          const newEnemy = new EnemyBasic(this.game, enemy.x, enemy.y, enemy.vel);
          newEnemy.cacheObstacles(this.obstacles);
          newEnemy.cachePlayer(this.player);
          this.game.add.existing(newEnemy);
          this.enemies.push(newEnemy);
      }

      this.bullets = [];
  }


  //Code ran on each frame of game
  update() {


        this.player.friction=-50;
    //this.handleBulletCollisions();
      this.game.physics.arcade.overlap(this.enemies, this.player, this.player.handleOverlap, null, this.player);
    this.game.physics.arcade.collide(this.player, this.obstacles, this.player.grounded, null, this.player);
    this.game.physics.arcade.collide(this.enemies, this.obstacles);
    this.game.physics.arcade.collide(this.player, this.movableobstacles);
      this.game.physics.arcade.collide(this.enemies, this.enemyNavs, (enemy, enemyNav) => {
          enemy.reverseDirection(enemyNav);
  });

      const remainingEnemies = [];
      for (const enemy of this.enemies) {
          if (this.game.physics.arcade.overlap(this.player.sword, enemy, (sword, enemy) => {
                  enemy.eliminate();
      }) === false) {
              remainingEnemies.push(enemy);
          }
      }

      const linesToPlayer = [];
      for (const enemy of this.enemies) {
          if (enemy.losToPlayer !== null && enemy.isShooting === false) {
              linesToPlayer.push(enemy.losToPlayer);
          }
      }
      this.drawLines(linesToPlayer);
      this.enemies = remainingEnemies;







   for(const stalags of this.stalagmites) {
     if (Math.abs(this.player.x - stalags.x) <100&&stalags&&Math.abs(this.player.y-stalags.y)<400) {
         stalags.fallOnPlayer();

     }
   }
    for(const stalag of this.stalagmites)
    {
      this.game.physics.arcade.overlap(this.player,stalag,(player,stalag)=>{
            if(stalag){
                stalag.killstalag();

            }
          });
      this.game.physics.arcade.overlap(this.obstacles,stalag,(obstacles,stalag)=>{
        if(stalag){
            stalag.killstalag();

        }
      });

 }

    for(const vanishobs of this.vanishobs)
    {
        this.game.physics.arcade.collide(vanishobs,this.player,(vanishobs,player)=>{
            setTimeout(function(){vanishobs.vanish();},500);

        setTimeout(function(){vanishobs.appear();},5000);

        });

    }


    this.game.physics.arcade.collide(this.movableobstacles, this.movableobsNav, (obstacle, obsnav) => {
      obstacle.reverseDirection(obsnav);


  });

      this.movableobstacles[0].body.position.x += this.game.time.physicsElapsed * this.movableobstacles[0].vel;


  }
    //Handles bullet collisions with obstacles and player
    handleBulletCollisions() {
        for (const enemy of this.enemies) {
            this.game.physics.arcade.collide(enemy.weapon.bullets, this.player, (player, bullet) => {
                bullet.kill();
            this.game.state.start("gameover");
        }, null, this);
            this.game.physics.arcade.collide(enemy.weapon.bullets, this.obstacles, (obstacle, bullet) => {
                bullet.kill();
        });
        }
    }

    //Draws LOS's to player
    drawLines(linesToPlayer) {

        this.bitmap.context.clearRect(0, 0, this.world.width, this.world.height);
        for (const line of linesToPlayer) {
            this.bitmap.context.strokeStyle = "red";
            console.log("came here");
            this.bitmap.context.beginPath();
            console.log("line.end.x: "+line.end.x+"line.end.y:  "+line.end.y);
            this.bitmap.context.moveTo(line.start.x, line.start.y);
            this.bitmap.context.lineTo(line.end.x, line.end.y);
            this.bitmap.context.stroke();
        }
        this.bitmap.dirty = true;
    }




  //Called when game is paused
  paused() {

  }

  //You're able to do any final post-processing style effects here.
  render() {

  }

  //Called when switching to a new state
  shutdown() {

  }


}
function killstala(stalagmite)
{
  stalagmite.killstalag();
}
export default Coldcountry;
