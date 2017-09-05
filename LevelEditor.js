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
function LevelEditor() {
    CanvasDisplay.prototype.constructor.apply( this );

    this.level = Level.load(1);
    this.redrawAll = true;
    this.selected = 0;

    /* Constructor for Display class */
    this.initialise =
      function initialise() {
        // Calculate sizes
        this.displayY      = 70;
        this.displayWidth  = Board.width  * Tile.width;
        this.displayHeight = Board.height * Tile.height + this.displayY;

        // Blank
        this.canvas.fillStyle = Display.backgroundColour;
        this.canvas.fillRect( 0, 0, this.displayWidth, this.displayHeight );
    }

    this.drawTitlebar =
      function drawTitlebar(pos) {
        this.canvas.fillStyle = Display.titleBarColour;
        this.canvas.fillRect( 0, 0, 1000, this.displayY );

        for ( var i = 0; i <= Tile.movable; i++ ) {
          this.canvas.drawImage( ImageCatalogue.getIconsImage(),
                                 64 * (i & 3 ), 64 * ( i >> 2 ),
                                 64, 64,
                                 i * Tile.width/2, (this.displayY - Tile.height/2)/2, Tile.width/2, Tile.height/2 );
        }
        for ( var i = 0; i < 4; i++ ) {
          this.canvas.drawImage( ImageCatalogue.getIconsImage(),
                                 4 * 64, 2 * 64 * i,
                                 64, 64,
                                 (i + Tile.ball)* Tile.width/2, (this.displayY - Tile.height/2)/2, Tile.width/2, Tile.height/2 );
        }

        this.canvas.drawImage( ImageCatalogue.getIconsImage(),
                               64 * (5 & 3 ), 64 * ( 5 >> 2 ),
                               64, 64,
                               this.selected * Tile.width/2, (this.displayY + Tile.height/2)/2, Tile.width/2, Tile.height/2 );
      };
    
    this.drawTileAt =
      function drawTileAt(pos) {
	var tileId = this.level.board[pos.getY()][pos.getX()];

        if (tileId > Tile.movable) {
          tileId = Tile.blank;
        }

        this.canvas.drawImage( ImageCatalogue.getIconsImage(),
                               64 * ( tileId & 3 ), 64 * ( tileId >> 2 ),
                               64, 64,
                               pos.getX() * Tile.width, this.displayY + pos.getY() * Tile.height, Tile.width, Tile.height );

      };

    /* Redraw the current board */
    this.draw = 
        function draw() {
          // Draw background
          if ( this.redrawAll ) {
            this.drawTitlebar();

            for ( var y = 0; y < Board.height; y++ ) {
              for ( var x = 0; x < Board.width; x++ ) {
                this.drawTileAt(new Vector(x, y)); 
              }
            }

            this.redrawAll = false;
          }
      };


    /* The user has clicked on the display */
    this.userMouse = 
      function userMouse( mouseDown, x, y ) {
        this.userTouch( 0, mouseDown, x, y );
    }

    /* The user has clicked on the display */
    this.userTouch = 
      function userTouch( id, mouseDown, x, y ) {
        if ( mouseDown == this.mouseButtonDown) {
	    this.mouseButton = true;
        }
        if ( mouseDown == this.mouseButtonUp) {
	    this.mouseButton = false;
        }
        if ( !this.mouseButton ) return;

        y = y - this.displayY;
        var square = new Vector(Math.floor(x/Tile.width), Math.floor(y/Tile.height));

        if ( y < 0 ) {
	    this.selected = Math.floor(x/(Tile.width/2));
        } else {
          this.level.board[square.getY()][square.getX()] = this.selected;
        }

        if ( this.selected > Tile.movable ) {
          this.outputLevel();
          this.mouseButton = false;
        }

        this.redrawAll = true;
    };

    this.outputLevel =
      function outputLevel() {
        var level = 
            "  function Level_1() {\n"
          + "    this.accessCode = \"\";\n"
          + "    this.name       = \"\";\n"
          + "    this.message    = \"\";\n"
          + "    this.board      =\n"
          + "    [\n";

        for ( var y = 0; y < Board.height; y++ ) {
          level += "      [";
          for ( var x = 0; x < Board.width; x++ ) {
            if (this.level.board[y][x] < 10 ) level += " ";
            level += this.level.board[y][x] + ",";
          }
          level += "],\n";
        }

        level += 
            "    ];\n";
          + "  };\n\n";
      
        alert(level);
    };


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
    this.initialise();
}
