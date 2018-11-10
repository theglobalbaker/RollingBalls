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

    this.level = Level.load( ProgressRecord.lastLevelPlayed );
    this.redrawAll = true;
    this.selected = 0;

    /* Constructor for Display class */
    this.initialise =
      function initialise() {
        // Calculate sizes
        this.displayY      = 50;
        this.displayWidth  = this.level.WIDTH  * Tile.width;
        this.displayHeight = this.level.HEIGHT * Tile.height + this.displayY;

        // Blank
        this.canvas.fillStyle = Display.backgroundColour;
        this.canvas.fillRect( 0, 0, g_width, g_height );
    }

    this.drawTitlebar =
      function drawTitlebar(pos) {
        this.canvas.fillStyle = Display.titleBarColour;
        this.canvas.fillRect( 0, 0, g_width, this.displayY );

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


        this.canvas.drawImage( ImageCatalogue.getEditorImage(),
                               g_width - Tile.width * 2, 0 );
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

            for ( var y = 0; y < this.level.HEIGHT; y++ ) {
              for ( var x = 0; x < this.level.WIDTH; x++ ) {
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
    this.touchEvent = 
      function touchEvent( mouseDown, parsedEvent ) {
        this.userTouch(parsedEvent.id, mouseDown, parsedEvent.x, parsedEvent.y);
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
        this.redrawAll = true;

        // User is clicking on the board or menu

        if ( y > this.displayY ) {
          this.level.board[ Math.floor( (y - this.displayY) / Tile.height ) ][ Math.floor( x / Tile.width ) ] = this.selected;
          return;
        }

        // User has selected "play this level"
        if ( x > g_width - Tile.width ) {
          g_levelEdit = this.level.board;
          g_display = new Display(0);
          return;
        }

        // User is clicking on menu bar
        this.selected = Math.floor(x/(Tile.width/2));
        if ( this.selected > Tile.movable ) {

          // Show URL for this board
          this.outputLevel();
          this.mouseButton = false;
          this.selected = 0;
        }
    };

    this.outputLevel =
      function outputLevel() {
        // URL version
        var url = "index.html?level=";

        // Javascript version
        var level = 
            "  function Level_1() {\n"
          + "    this.name       = \"" + this.level.name + "\";\n"
          + "    this.message    = \"" + this.level.message + "\";\n"
          + "    this.board      =\n"
          + "    [\n";

        for ( var y = 0; y < this.level.HEIGHT; y++ ) {
          level += "      [";
          for ( var x = 0; x < this.level.WIDTH; x++ ) {
            if (this.level.board[y][x] < 10 ) level += " ";

            level += this.level.board[y][x] + ",";

            url = url + LevelEditor.packing[ this.level.board[y][x] ];
          }
          level += "],\n";
        }

        level += 
            "    ];\n";
          + "  };\n\n";

        url = url + "&name=%22" + this.level.name + "%22&message=%22" + this.level.message + "%22";

        document.body.style.color = "#ffffff"
        document.body.innerHTML = '<br/><font size="48"><a href="' + url + '">Share this link</a></font><br/><br/>' + level.replace(/\n/g, '<br/>');
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

LevelEditor.packing = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/**
 * Deserialize a URL
 */
LevelEditor.unpackLevel = 
  function unpackLevel( serialized ) {
    serialized = serialized.substring( "level=".length );
    for ( var y = 0; y < Level.HEIGHT; y++ ) {
      for ( var x = 0; x < Level.WIDTH; x++ ) {
        g_levelEdit[y][x] = LevelEditor.packing.indexOf( serialized[0] );
        serialized = serialized.substring(1); 
      }
    }

    if ( serialized.startsWith("&name=%22") ) {
      serialized = serialized.substring( "&name=%22".length );
      g_name = serialized.substring( 0, serialized.indexOf("%22") );
      serialized = serialized.substring( g_name.length + 3 );
    }

    if ( serialized.startsWith("&message=%22") ) {
      serialized = serialized.substring( "&message=%22".length );
      g_message = serialized.substring( 0, serialized.indexOf("%22") );
    }
  }

function Level_0() {
    this.name       = g_name;
    this.message    = g_message;
    this.board      = g_levelEdit;
}

var g_name = "Name";
var g_message = "Message";
var g_levelEdit = 
   [
     [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3 ],
     [ 3,36, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3 ],
     [ 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3 ],
     [ 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3 ],
     [ 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3 ],
     [ 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3 ],
     [ 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3 ],
     [ 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3 ],
     [ 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3 ],
     [ 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3 ],
     [ 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3 ],
     [ 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3 ],
     [ 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3 ],
     [ 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3 ],
     [ 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3 ],
     [ 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3 ],
     [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3 ],
   ];
