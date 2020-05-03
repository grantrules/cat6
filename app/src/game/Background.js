import * as PIXI from 'pixi.js';

export default class Background extends PIXI.TilingSprite {
    constructor(texture, mult) {
        const text = PIXI.Texture.from(texture)
        super(text, 300, text.height) //width 1 because we will call onResize from App anyway
        this.mult = mult;

    }

    onResize(width, height) {
        this.width = width
        this.height = height;
    }

    onUpdate(delta) {
    	this.tilePosition.x -= delta * this.mult;
    }
}