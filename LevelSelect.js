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

        this.levelGroup = Math.floor( (ProgressRecord.lastLevelPlayed - 1) / this.levelsPerGroup );
        if ( this.levelGroup < 0 ) this.levelGroup = 0;
        if ( this.levelGroup > 3 ) this.levelGroup = 3;
    };

    /* Constructor for Display class */
    this.draw =
      function draw() {
        // Blank
        this.canvas.fillStyle = LevelSelect.backgroundColour;
        this.canvas.fillRect( 0, 0, this.displayWidth, this.displayHeight );

        // Top bar
        for ( var i = 0; i < 4; i++ ) {
            // Can we play this level group?
            this.canvas.fillStyle = LevelSelect.lockedColour;
            if ( this.levelGroup  == i ) {
                this.canvas.fillStyle = LevelSelect.canPlayColour;
            } else if ( this.progress.canPlay( i * this.levelsPerGroup + 1) ) {
                this.canvas.fillStyle = LevelSelect.unfinishedColour;
            }

            this.canvas.fillRect( this.offsetX + this.titleGap * i, (this.offsetY - this.titleHeight )/2, this.titleWidth, this.titleHeight );

            this.canvas.fillStyle = LevelSelect.textColour;
            this.canvas.font = LevelSelect.titleFont;

            var label = [ "Trivial", "Tricky", "Taxing", "Trauma" ][ i ];
            var textSize = this.canvas.measureText( label );
            this.canvas.fillText( label, this.offsetX + this.titleGap * i + (this.titleWidth - textSize.width) / 2, (this.offsetY)/2 + 7);
        }

        for ( var i = 0; i < this.levelsPerGroup; i++ ) {
            // Show which levels can be played 
            var level = i + 1 + this.levelGroup * this.levelsPerGroup;
            if ( level > this.progress.numberOfLevels ) break;

	    var x = (i % this.tilesAcross) * this.tileGapX + this.offsetX;
            var y = Math.floor( i / this.tilesAcross ) * this.tileGapY + this.offsetY;

            var stars       = this.progress.getStars(level);
            var canPlay     = this.progress.canPlay(level);
            var canPlayNext = this.progress.canPlay(level + 1);

            this.canvas.fillStyle = LevelSelect.lockedColour;
            if (canPlay & canPlayNext) {
                this.canvas.fillStyle = LevelSelect.canPlayColour;
            } else if (canPlay) {
                this.canvas.fillStyle = LevelSelect.unfinishedColour;
            } else {
                stars = 0;
            }

            this.canvas.fillRect( x, y, this.tileWidth, this.tileHeight );

            this.canvas.fillStyle = LevelSelect.textColour;
            this.canvas.font = LevelSelect.textFont;
            var textSize = this.canvas.measureText( "" + level );
            this.canvas.fillText("" + level, x + (this.tileWidth - textSize.width) / 2, y + this.tileHeight / 2 + 10);


            for ( var j = 0; j < stars; j++ ) {
              var image = 1;
              this.canvas.drawImage( ImageCatalogue.getStarsImage(), 
                                     Tile.width * 2 * image, 0, Tile.width * 2, Tile.height * 2,
                                     x + j * 10, y, Tile.height / 2, Tile.width);
            }
        }

        // Number of stars
        var x = this.tilesAcross * this.tileGapX + this.offsetX;
        var y = (this.offsetY - Tile.height * 2) / 2;
        this.canvas.drawImage( ImageCatalogue.getStarsImage(), 
                               Tile.width * 2, 0, Tile.width * 2, Tile.height * 2,
                               x, y, Tile.height * 2, Tile.width * 2);

        this.canvas.fillStyle = LevelSelect.starColour;
        this.canvas.font = LevelSelect.starFont;
        this.canvas.fillText("" + this.progress.numberOfStars(), x + Tile.width * 2, y + Tile.height + 15);

        // Back to title page
        this.canvas.drawImage( ImageCatalogue.getBackImage(), 
                               0, 0, Tile.width * 2, Tile.height * 2,
                               Tile.width, g_height - Tile.height * 3, Tile.height * 2, Tile.width * 2);

    };

    this.tilesAcross = 5;
    this.tileGapX    = 100;
    this.tileGapY    = 150;
    this.tileWidth   = 90;
    this.tileHeight  = 140;

    this.levelsPerGroup = 15;
    this.titleAcross  = 4;
    this.titleGap     = (this.tileGapX * ( this.tilesAcross - 1 ) + this.tileWidth + 10) / this.titleAcross;
    this.titleWidth   = this.titleGap - 10;
    this.titleHeight  = 50;

    this.offsetX     = (g_width - (this.tileGapX * this.tilesAcross))/2;
    this.offsetY     = 100;

    /* The user has clicked on the display */
    this.userMouse = 
      function userMouse( mouseDown, x, y ) {
        this.userTouch( 0, mouseDown, x, y );
    }

    /* The user has clicked on the display */
    this.userTouch = 
	function userTouch( id, state, x, y ) {

        if ( state != this.mouseButtonDown ) return;

        if ( x < this.offsetX && y > g_height - Tile.height * 3 ) {
          g_display = new TitlePage();
          return;
        }

        var x1 = Math.floor( (x - this.offsetX) / this.tileGapX );
        var y1 = Math.floor( (y - this.offsetY) / this.tileGapY );

        if ( x1 < 0 || x1 >= this.tileAcross ) return;
        if ( y1 < 0 ) {
            var i = Math.floor((x - this.offsetX) / this.titleGap);
            if ( i < 0 || i >= 4 ) return;

            // Check that the level group is accessible
            if ( this.progress.canPlay( i * this.levelsPerGroup + 1) ) {
                this.levelGroup = i;
            } else {
                alert( "You need " + this.progress.unlockStars[i] + " stars to unlock these levels." );
            }
            return;
        }

        var level = y1 * this.tilesAcross + x1 + 1 + this.levelGroup * this.levelsPerGroup;
        if ( this.progress.canPlay(level)  ) {
          g_display = new Display(level);
        } else {
          alert( "You haven't unlocked this level yet!" );
	}
    }

    /* The user has clicked on the display */
    this.touchEvent = 
      function touchEvent( type, event ) {
        for ( var i = 0; i < this.event.touches.length; i++ ) {
          alert('hi');
	  var touch = this.event.touches[i];
          this.userTouch(Display.scaleX(touch.pageX), Display.scaleY(touch.pageY));
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

LevelSelect.backgroundColour = "rgba(41,5,5,1.0)";
LevelSelect.textColour       = "rgba(0,0,0,1.0)";
LevelSelect.titleFont        = "20px Ariel";
LevelSelect.textFont         = "50px Ariel";
LevelSelect.unfinishedColour = "rgba(0,100,0,1.0)";
LevelSelect.canPlayColour    = "rgba(0,168,0,1.0)";
LevelSelect.lockedColour     = "rgba(80,80,80,1.0)";
LevelSelect.starFont         = "50px Ariel";
LevelSelect.starColour       = "rgba(255,255,0,1.0)";
