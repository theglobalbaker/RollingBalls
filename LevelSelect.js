/* This file is part of Rolling Balls.
 * Copyright (C) 2015 David Lloyd
 *
 * Rolling Balls is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Rolling Balls is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Rolling Balls.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * The display class is responsible for redisplaying
 * the menu, timer and board for the current level.
 */
function LevelSelect() {
    CanvasDisplay.prototype.constructor.apply( this );

    /* Constructor for Display class */
    this.initialise =
      function initialise() {
        this.progress = new ProgressRecord();
    };

    /* Constructor for Display class */
    this.draw =
      function draw() {
        // Blank
        this.canvas.fillStyle = LevelSelect.backgroundColour;
        this.canvas.fillRect( 0, 0, this.displayWidth, this.displayHeight );

        for ( var i = 0; i < this.progress.numberOfLevels; i++ ) {
	    var x = i % this.tilesAcross;
            var y = Math.floor( i / this.tilesAcross );

            var stars       = this.progress.getStars(i);
            var canPlay     = this.progress.canPlay(i + 1);
            var canPlayNext = this.progress.canPlay(i + 2);

            this.canvas.fillStyle = LevelSelect.lockedColour;
            if (canPlay & canPlayNext) {
                this.canvas.fillStyle = LevelSelect.canPlayColour;
            } else if (canPlay) {
                this.canvas.fillStyle = LevelSelect.unfinishedColour;
            } else {
                stars = 0;
            }

            this.canvas.fillRect( x * this.tileGapX + this.offsetX, y * this.tileGapY + this.offsetY,
                                  this.tileWidth, this.tileHeight );

            this.canvas.fillStyle = LevelSelect.textColour;
            this.canvas.fillText("" + i, x * this.tileGapX + this.offsetX, y * this.tileGapY + this.offsetY);


            for ( var j = 0; j < stars; j++ ) {
              var image = 1;
              this.canvas.drawImage( ImageCatalogue.getStarsImage(), 
                                     Tile.width * 2 * image, 0, Tile.width, Tile.height,
                                     x * this.tileGapX + this.offsetX + j * 10, y * this.tileGapY + this.offsetY, Tile.height / 2, Tile.width);
            }
        }
    };

    this.offsetX     = 100;
    this.offsetY     = 100;
    this.tilesAcross = 5;
    this.tileGapX    = 100;
    this.tileGapY    = 200;
    this.tileWidth   = 90;
    this.tileHeight  = 190;

    /* The user has clicked on the display */
    this.userMouse = 
      function userMouse( mouseDown, x, y ) {
        this.userTouch( 0, mouseDown, x, y );
    }

    /* The user has clicked on the display */
    this.userTouch = 
	function userTouch( id, state, x, y ) {
        var x1 = Math.floor( (x - this.offsetX) / this.tileGapX );
        var y1 = Math.floor( (y - this.offsetY) / this.tileGapY );

        if ( x1 < 0 || x1 >= this.tileAcross ) return;
        if ( y1 < 0 ) return;

        var level = y1 * this.tilesAcross + x1 + 1;
        if ( this.progress.canPlay(level) && state == this.mouseButtonDown ) {
          g_display = new Display(level);
        }
    }

    /*
     * This method is called multiple times a second to handle animation.
     * Returns false when paused to stop the tick count increasing.
     */
    this.tick =
      function tick() {

        /* Pause
        if ( this.selected != Display.Pause ) {
          this.draw();
          return true;
        } */

        this.draw();
        return false;      
      };

    /* Call class initialiser */
    this.displayWidth = 1000;
    this.displayHeight = 800;
    this.initialise();
}

LevelSelect.backgroundColour = "rgba(0,0,255,1.0)";
LevelSelect.textColour       = "rgba(0,0,0,1.0)";
LevelSelect.unfinishedColour = "rgba(0,128,128,1.0)";
LevelSelect.canPlayColour    = "rgba(0,255,255,1.0)";
LevelSelect.lockedColour     = "rgba(255,0,0,1.0)";
