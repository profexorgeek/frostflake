// NOTE: this is still very experimental. It's not very efficient
// and only supports a small subset of Tiled features.

class TilemapView extends View {
    tileset;
    tilemap;
    collidables = [];

    tilesetJsonLoaded = false;
    tilemapJsonLoaded = false;
    tilemapLoaded = false;
    rootPath = '';

    constructor(tilesetUrl, tilemapUrl) {
        super();
        let me = this;
        Data.loadJson(tilesetUrl, function (set) {
            me.tileset = set;
            me.tilesetJsonLoaded = true;
        });

        Data.loadJson(tilemapUrl, function (map) {
            me.tilemap = map;
            me.tilemapJsonLoaded = true;
        });

        let pathElements = tilesetUrl.split('/');
        pathElements.pop();
        this.rootPath = pathElements.join('/');
    }

    update() {
        super.update();

        if(this.tilesetJsonLoaded == true &&
            this.tilemapJsonLoaded == true &&
            this.tilemapLoaded == false) {
                this.createTiles();
        }

        if(this.tilemapLoaded) {
            for(let i = this.collidables.length - 1; i > -1; i--) {
                let tile = this.collidables[i];
                this.testBall.collision.collideWith(tile.collision, RepositionType.Bounce, 0, 1);
            }

            FrostFlake.Game.camera.x = this.testBall.x;
            FrostFlake.Game.camera.y = this.testBall.y;
        }
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
            FrostFlake.Log.error("FrostFlake cannot handle maps with more than one tileset yet!");
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
                FrostFlake.Log.error(`Bad layer size, expected ${tilesPerLayer} but got ${layer.data.length}`);
            }

            // NOTE: no support yet for other layer types!
            if(layer.type == 'tilelayer') {
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
                    sprite.collision = new Rectangle(0, 0);
                    sprite.position.x = Math.floor(j % layer.height) * set.tileheight + startX;
                    sprite.position.y = Math.floor(j / layer.width) * -set.tilewidth + startY;
                    sprite.alpha = layer.visible ? layer.opacity : 0;

                    // NOTE: look for "collides = true" on tile id
                    // and create collision. This is a convention
                    // that the TMX will have to adhere for. This
                    // could be improved to be more flexible
                    if(collideableTiles.indexOf(tileId) > -1) {
                        sprite.collision = new Rectangle(set.tilewidth, set.tileheight);
                        this.collidables.push(sprite);
                    }

                    this.addChild(sprite);
                }
            }
        }
    
        FrostFlake.Log.info("Tilemap loaded fired correctly!");
        this.tilemapLoaded = true;
    }
}