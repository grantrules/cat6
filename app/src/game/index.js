import * as PIXI from 'pixi.js';

import Background from './Background'

class App extends PIXI.Application {
    constructor(opts) {
        super(opts)
        document.body.appendChild(this.view) // Create Canvas tag in the body

        this.init()

        window.addEventListener('resize', this.onResize.bind(this))
    }

    init() {
        // Load the logo
        this.loader.add('background', '/assets/background/skyline-a.png')
        this.loader.add('background2', '/assets/background/buildings-bg.png')
        this.loader.add('background3', '/assets/background/near-buildings-bg.png')
        this.loader.load(this.draw.bind(this))
    }

    draw() {
      this.clouds = new Background('background', 0.05);
      this.clouds.position.y=-30;
      this.background2 = new Background('background2', 0.1);
      this.background2.position.y = 80;
      this.background3 = new Background('background3', 0.2);
      this.stage.addChild(this.clouds)
      this.stage.addChild(this.background2)
      this.stage.addChild(this.background3)

        this.onResize()
        
        // Create an update loop
        this.ticker.add(this.onUpdate.bind(this))
    }

    onUpdate(delta) {
      this.clouds.onUpdate(delta)
      this.background2.onUpdate(delta)
      this.background3.onUpdate(delta)
    }

    onResize() {
      const ratio = window.innerWidth / window.innerHeight;
      const width = this.renderer.height * ratio;
      const height = this.renderer.height;
      this.renderer.resize(width, this.renderer.height);
      this.clouds.onResize(width, height)
      this.background2.onResize(width, height)
      this.background3.onResize(width, height)

/*      
        this.renderer.resize(window.innerWidth, window.innerHeight)
        const width = this.renderer.width, height = this.renderer.height
        this.clouds.onResize(width, height)
  */    
    }
}


//import * as PIXI from 'pixi.js';

function start() {
  let type = "WebGL"
  if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas"
  }

  PIXI.utils.sayHello(type)

  //Create a Pixi Application
  // let app = new PIXI.Application({
  let app = new App({
    width: 400,         // default: 800
    height: 200,        // default: 600
    antialias: true,    // default: false
    transparent: false, // default: false
    resolution: 1       // default: 1
  });
  /*
  app.renderer.view.style.position = "absolute";
  app.renderer.view.style.display = "block";
  app.renderer.autoResize = true;

  app.renderer.resize(window.innerWidth, window.innerHeight);
*/
  //Add the canvas that Pixi automatically created for you to the HTML document

/*

  app.loader.add('bunny', '/assets/background/skyline-a.png').add('bg2', '/assets/background/buildings-bg.png').add('bg3', '/assets/background/near-buildings-bg.png').load((loader, resources) => {
    // This creates a texture from a 'bunny.png' image
    const bunny = new PIXI.TilingSprite(resources.bunny.texture, resources.bunny.texture.width, resources.bunny.texture.height);
    const bg2 = new PIXI.Sprite(resources.bg2.texture);
    const bg3 = new PIXI.Sprite(resources.bg3.texture);

    // Setup the position of the bunny
    bunny.x = 0;//app.renderer.width / 2;
    bunny.y = 127;//app.renderer.height / 2;
    bunny.tilePosition.x = 0; bunny.tilePosition.y = 0;

    
    bg2.x = app.renderer.width / 2;
    bg2.y = app.renderer.height / 2;

    
    bg3.x = app.renderer.width / 2;
    bg3.y = app.renderer.height / 2;
    // Rotate around the center
    
    // Add the bunny to the scene we are building
    app.stage.addChild(bunny);
    app.stage.addChild(bg2);
    app.stage.addChild(bg3);

    // Listen for frame updates
    app.ticker.add(() => {
         // each frame we spin the bunny around a bit
        bunny.tilePosition.x -= 0.2;
        bg2.x -= 0.5
        bg3.x -=1
    });
    */
    const hmm = document.body.appendChild(app.view);
    console.log(hmm);

//});
}

export default { start };
