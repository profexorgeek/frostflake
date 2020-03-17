var frostFlake = (function (ff) {
    ff.TileLoader = Class.extend({
        init: function (url, successCallback) {

            this.url = url;
            this.layers = [];
            this.sprites = [];
            this.mapData = null;
            this.mapSize = {
                width:0,
                height:0
            }
            this.tilesetImage
            this.totalSprites = 0
            this.spritesLoaded = 0;
            this.successCallback = successCallback;

            // load the json
            var loader = this;
            ff.loadJson(this.url, function (tileData) {
                    if(tileData.version !== 1) {
                        console.log('Version ' + tileData.version + ' tilemaps are not supported!');
                    }
                    else if(tileData.tilesets.length > 1) {
                        console.log('This tile map uses multiple tilesets. Only one is supported by this loader.');
                    }
                    else {
                        loader.mapData = tileData;
                        loader.mapSize = {
                            width: tileData.width * tileData.tilewidth,
                            height: tileData.height * tileData.tileheight
                        }
                        loader.processLayers(tileData.layers);
                    }
                },
                function () {
                    console.log('Failed to load tilemap.');
                });

        },

        processLayers: function (layers) {
            // todo: support more than just tile layers
            for (var i = 0; i < layers.length; i++) {
                var currentLayer = layers[i];
                if (currentLayer.type === 'tilelayer') {
                    this.createLayer(i, layers[i]);
                }
                else {
                    console.log('Skipping layer "' + currentLayer.name + '" -- unsupported type (' + currentLayer.type + ')');
                }
            }
        },

        createLayer: function (layerNumber, layer) {
            var map = this;
            var layerSprites = [];
            var tileWidth = this.mapData.tilewidth;
            var tileHeight = this.mapData.tileheight;
            var mapTilesWide = layer.width;
            var tileset = this.mapData.tilesets[0];
            var tilesetTilesWide = tileset.imagewidth / tileWidth;
            var spriteUrl = tileset.image;
            var halfMapWidth = (this.mapData.width * this.mapData.tilewidth) * 0.5;
            var halfMapHeight = (this.mapData.height * this.mapData.tileheight) * 0.5;
            var spritesLoaded = 0;

            var offsetX = halfMapWidth - (tileWidth / 2);
            var offsetY = halfMapHeight - (tileHeight / 2);

            for (var i = 0; i < layer.data.length; i++) {
                var tileData = layer.data[i];
                // zero means no tile
                if (tileData !== 0) {
                    // since zero means no tile, we have to subtract one to get a zero-based index
                    var tileId = tileData - 1;
                    var srcX = (tileId % tilesetTilesWide) * tileWidth;
                    var srcY = Math.floor(tileId / tilesetTilesWide) * tileHeight;
                    var destX = (i % mapTilesWide) * tileWidth - offsetX;
                    var destY = (Math.floor(i / mapTilesWide) * -tileHeight) + offsetY;
                    var tileSprite = new ff.Sprite(spriteUrl, layerNumber, function() {
                        map.spritesLoaded += 1;
                        if(map.spritesLoaded == map.sprites.length) {
                            map.successCallback();
                        }
                    });
                    tileSprite.setTextureCoordinates(srcX, srcX + tileWidth, srcY, srcY + tileWidth);
                    tileSprite.setPosition(destX, destY);
                    layerSprites.push(tileSprite);
                    this.sprites.push(tileSprite);
                }
            }
            this.layers.push(layerSprites);


        }
    });
    return ff;
}(frostFlake || {}));