class Boot extends Phaser.State {

  constructor() {
    super();
  }
  
  preload() {
    this.load.image('preloader', 'assets/preloader.gif');
  }

  create() {
    this.game.input.maxPointers = 1;

    //setup device scaling
    if (this.game.device.desktop) {
      this.game.scale.pageAlignHorizontally = true;
    } else {
      this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.game.scale.minWidth =  480;
      this.game.scale.minHeight = 260;
      this.game.scale.maxWidth = 640;
      this.game.scale.maxHeight = 480;
      this.game.scale.forceOrientation(true);
      this.game.scale.pageAlignHorizontally = true;
      this.game.scale.setScreenSize(true);
    }

    this.initGlobalVariables();

    this.game.state.start('preloader');
  }

  initGlobalVariables(){
    this.game.global = {
      score: 0,
      slowdown: 13,
      isSlowdown: true
    };
    this.game.global.controls = Object.assign(this.game.input.keyboard.createCursorKeys(), {
      attack: this.game.input.keyboard.addKey(Phaser.Keyboard.X)
    });
  }

}

export default Boot;
