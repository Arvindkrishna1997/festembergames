import Raycaster from "../utils/raycaster";

//Documentation for Phaser's (2.5.0) states:: phaser.io/docs/2.5.0/Phaser.State.html
class GroupEnemy extends Phaser.Sprite {

  //initialization code in the constructor
  constructor(game, x, y,initVelocity, frame) {
    super(game, x, y, 'crosshairs', frame);

    this.game.physics.arcade.enableBody(this);
    this.body.velocity.set(initVelocity.x, initVelocity.y);

    this.initVelocity = initVelocity;
    this.raycaster = new Raycaster();
    this.losToPlayer = null;
    this.maxTimeToFire = 800; //In milliseconds
    this.timeToFire = Infinity;
    this.maxTimeToSee = 400; //In milliseconds
    this.timeToSee = Infinity;
    this.isShooting = false;
    this.oldVelocity = this.body.velocity.clone();

    this.weapon = game.add.weapon(2, "bullet");
    this.weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
    this.weapon.bulletSpeed = 1000;
    this.weapon.bulletGravity.set(0);
    this.weapon.trackSprite(this, this.width / 2, this.height / 2);
  }

  //Load operations (uses Loader), method called first
  preload() {

  }

  //Setup code, method called after preload
  create() {

  }

  //Code ran on each frame of game
  update() {

    if (this.isShooting === true) {
      if (this.timeToSee <= 0) {
        this.timeToSee = Infinity;
        this.timeToFire = this.maxTimeToFire - this.maxTimeToSee;
        this.isShooting = false;
      }
      else {
        this.timeToSee -= this.game.time.physicsElapsedMS;
        return;
      }
    }
    this.sightCheck();
    if (this.timeToFire <= 0) {
      this.fireBullet();
    }
  }

  //Check if player is in enemy's LOS
  sightCheck() {
    if (this.inCamera) {
      const visibleObstacles = [];
      for (const obstacle of this.obstacles) {
        if (obstacle.inCamera) {
          visibleObstacles.push(obstacle);
        }
      }

      const enemyPos = new Phaser.Point(
          this.body.position.x + this.width / 2,
          this.body.position.y + this.height / 2
      );
      const playerPos = this.player.getCenter();

      if (!this.raycaster.castRay(enemyPos, playerPos, visibleObstacles)) {
        if (this.losToPlayer !== null && this.timeToFire !== Infinity) {
          this.timeToFire -= this.game.time.physicsElapsedMS;
        }
        else {
          this.timeToFire = this.maxTimeToFire;
          this.oldVelocity.copyFrom(this.body.velocity);
          this.body.velocity.set(0);
        }
        this.losToPlayer = new Phaser.Line(enemyPos.x, enemyPos.y, playerPos.x, playerPos.y);
      }
      else {
        if (this.losToPlayer !== null) {
          this.body.velocity.copyFrom(this.oldVelocity);
        }
        this.losToPlayer = null;
        this.timeToFire = Infinity;
      }
    }
  }

  fireBullet() {
    const playerPos = this.player.getCenter();
    this.weapon.fireAtXY(playerPos.x, playerPos.y);
    for (const bullet of this.weapon.bullets.children) {
      bullet.body.allowGravity = false;
    }
    this.isShooting = true;
    this.timeToSee = this.maxTimeToSee;
  }

  //Caching obstacles
  cacheObstacles(obstacles) {
    this.obstacles = obstacles;
  }

  //Caching player
  cachePlayer(player) {
    this.player = player;
  }

  reverseDirection(enemyNav) {
    if (enemyNav.body.position.x > this.body.position.x) {
      this.body.velocity.set(-this.initVelocity.x, this.initVelocity.y);
    }
    else {
      this.body.velocity.set(this.initVelocity.x, this.initVelocity.y);
    }
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

export default GroupEnemy;
