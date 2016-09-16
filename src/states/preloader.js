class Preloader extends Phaser.State {

  constructor() {
    super();
    this.asset = null;
    this.ready = false;
  }

  preload() {
    //setup loading bar
    this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');
    this.load.setPreloadSprite(this.asset);

    //Setup loading and its events
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.loadResources();
  }

  loadResources() {
    this.game.load.image('crosshairs', 'assets/crosshair_red_small.png');
    this.game.load.image("bullet", "assets/bullet.png");
    this.game.load.image("target", "assets/target.png");
    this.game.load.image('floor',"assets/platform.png");
    this.game.load.spritesheet('snowflakes', 'assets/snowflakes.png', 17, 17);
    this.game.load.spritesheet('snowflakes_large', 'assets/snowflakes_large.png', 64, 64);
    this. game.load.image('sky', 'assets/sky3.png');
  }

  onLoadComplete() {
    this.game.state.start('coldcountry');
  }
}

export default Preloader;
