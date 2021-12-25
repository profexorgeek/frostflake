import Data from '../Data/Data';
import Frame from '../Drawing/Frame';
import FrostFlake from '../FrostFlake';
import Log from '../Logging/Log';
import Rectangle from '../Positionables/Rectangle';
import Sprite from '../Positionables/Sprite';
import View from './View';

// NOTE: this is still very experimental. It's not very efficient
// and only supports a small subset of Tiled features.
export default class TilemapView extends View {
    tileset;
    tilemap;
    collidables = [];
    layerSprites = [];

    tilesetJsonLoaded = false;
    tilemapJsonLoaded = false;
    tilemapSpriteLoaded = false;
    tilemapLoaded = false;
    rootPath = '';

    constructor(tilesetUrl, tilemapUrl) {
        super();
        let me = this;
        
        (async () => {
            //TODO: introduce some error handling here - JMH
            const set = await Data.loadJson(tilesetUrl);
            me.tileset = set;
            me.tilesetJsonLoaded = true;

            const map = await Data.loadJson(tilemapUrl);
            me.tilemap = map;
            me.tilemapJsonLoaded = true;
        })()

        let pathElements = tilesetUrl.split('/');
        pathElements.pop();
        this.rootPath = pathElements.join('/');
    }

    update() {
        super.update();

        // TODO: move this out of the gameloop into promises or callbacks
        if(this.tilesetJsonLoaded == true &&
            this.tilemapJsonLoaded == true &&
            this.tilemapLoaded == false) {
                this.createTiles();
        }
    }

    getTileSets() {
        // TODO: get all tile sets from map
    }

    getAllSpritePaths() {
        // TODO: preload all sprites in tilesets
    }

    getCollideableTiles() {
        // TODO: move collidable tile logic to this method
    }

    createTiles() {
        const set = this.tileset;
        const map = this.tilemap;
        const spritePath = `${this.rootPath}/${set.image}`;
        const startX = map.width * map.tilewidth / -2;
        const startY = map.height * map.tileheight / 2;
        const tilesPerLayer = map.width * map.height;

        // EARLY OUT: multiple tilesets is too complex for first pass
        if(map.tilesets.length > 1) {
            Log.error("FrostFlake cannot handle maps with more than one tileset yet!");
            this.tilemapLoaded = true;
            return;
        }

        // NOTE: tiles with a "collides = true" property go in a special collision array
        // build array of collideable tiles for faster finding in the deeper loop below.
        // TODO: this needs to be rethought into a more efficient system
        let collideableTiles = []
        for(let i = 0; i < set.tiles.length; i++) {
            for(let j = 0; j < set.tiles[i].properties.length; j++) {
                if(set.tiles[i].properties[j].name == "collides" && set.tiles[i].properties[j].value == true) {
                    collideableTiles.push(set.tiles[i].id);
                }
            }
        }
        

        for(let i = 0; i < map.layers.length; i++) {
            const layer = map.layers[i];

            if(layer.data.length != tilesPerLayer) {
                Log.error(`Bad layer size, expected ${tilesPerLayer} but got ${layer.data.length}`);
            }

            // NOTE: no support yet for other layer types!
            if(layer.type == 'tilelayer') {
                
                // container to hold layer sprites to be rendered to a single image
                let sprites = [];

                for(let j = 0; j < layer.data.length; j++) {
                    
                    const gid = layer.data[j];

                    // TODO: this is hardcoded, the "1" is actually the tileset
                    // ID but frostflake doesn't support multiple tilesets yet
                    const tileId = gid - 1;

                    const frameX = tileId % set.columns;
                    const frameY = Math.floor(tileId / set.columns);

                    // TODO: spacing, margin, offsets, rotation, and many other features are not
                    // yet supported
                    
                    let sprite = new Sprite(spritePath);
                    sprite.frame = new Frame(
                        frameX * set.tilewidth,
                        frameY * set.tileheight,
                        set.tilewidth,
                        set.tileheight);
                    sprite.layer = i;
                    sprite.collision = new Rectangle(0, 0);
                    sprite.position.x = Math.floor(j % layer.height) * set.tileheight + startX;
                    sprite.position.y = Math.floor(j / layer.width) * -set.tilewidth + startY;
                    sprite.alpha = layer.visible ? layer.opacity : 0;

                    // NOTE: look for "collides = true" on tile id
                    // and create collision. This is a convention
                    // that the TMX will have to adhere for. This
                    // could be improved to be more flexible

                    // TODO: render targets break this, needs fixed
                    if(collideableTiles.indexOf(tileId) > -1) {
                        sprite.collision = new Rectangle(set.tilewidth, set.tileheight);
                        this.collidables.push(sprite);
                    }

                    sprites.push(sprite);
                }

                // now render all of the sprites to a single layer sprite and add that sprite
                let layerTexture = FrostFlake.Game.renderer.renderToTexture(sprites, map.width * set.tilewidth, map.height * set.tileheight);
                let layerSprite = new Sprite(layerTexture);
                layerSprite.layer = i;
                this.addChild(layerSprite);
            }
        }
    
        Log.info("Tilemap loaded fired correctly!");
        this.tilemapLoaded = true;
    }
}