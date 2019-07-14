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
function TitlePage() {
    CanvasDisplay.prototype.constructor.apply( this );

    /* Constructor for Display class */
    this.initialise =
      function initialise() {
    };

    /* Constructor for Display class */
    this.draw =
      function draw() {
        // Blank
        this.canvas.fillStyle = TitlePage.backgroundColour;
        this.canvas.fillRect( 0, 0, g_width, g_height );
        this.canvas.drawImage( ImageCatalogue.getTitlePageImage(), 0, 0, g_width, g_height );

        // Options
        this.canvas.drawImage( ImageCatalogue.getOptionsImage(), 
                               0, 0, Tile.width * 2, Tile.height * 2,
                               Tile.width, g_height - Tile.height * 3, Tile.height * 2, Tile.width * 2);

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
      function userTouch( id, state, x, y ) {

        if ( state != this.mouseButtonDown ) return;

        // Enable or disable sounds
        Sounds.toggleSounds( new ProgressRecord().getAudioEnabled() );

        if ( x < Tile.width * 3 && y > g_height - Tile.height * 3 ) {
          g_display = new OptionsPage();
          return;
        }

        g_display = new LevelSelect();
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
    this.initialise();
}

TitlePage.backgroundColour = "rgba(0,0,255,1.0)";


/**
 * The display class is responsible for redisplaying
 * the menu, timer and board for the current level.
 */
function OptionsPage() {
    CanvasDisplay.prototype.constructor.apply( this );

    /* Constructor for Display class */
    this.initialise =
      function initialise() {
      this.audioOptionText = [ "Sound Effects on", "Sound Effects off" ];

      this.progressRecord = new ProgressRecord();
      this.audioOption = this.progressRecord.getAudioEnabled() ? 0 : 1;
    };

    /* Constructor for Display class */
    this.draw =
      function draw() {
        // Blank
        this.canvas.fillStyle = TitlePage.backgroundColour;
        this.canvas.fillRect( 0, 0, g_width, g_height );
        this.canvas.drawImage( ImageCatalogue.getTitlePageImage(), 0, 0, g_width, g_height );

        // Make the image a little darker
	this.canvas.fillStyle = "rgba( 0, 0, 0, 0.7 )";
	this.canvas.fillRect( 0, 0, g_width, g_height );

	// Menu box
        var h = g_height / 8 + 20;
        var gap = 80;
        this.drawBox( "Options", h - 20);
        this.drawBox( this.audioOptionText[ this.audioOption ], h + gap );
        this.drawBox( "Source Code", h + gap * 2);
        if ( !IsTablet() ) this.drawBox( "Level Editor", h + gap * 3);
        this.drawBox( "Reset Game", h + gap * 4);

        // Back
        this.canvas.drawImage( ImageCatalogue.getBackImage(), 
                               0, 0, Tile.width * 2, Tile.height * 2,
                               Tile.width, g_height - Tile.height * 3, Tile.height * 2, Tile.width * 2);
    }

    this.drawBox =
      function( string, y ) {
        var w = g_width;
        var h = g_height;

        this.canvas.fillStyle = "rgba( 255, 255, 255, 0.7 )";
        this.canvas.fillRect( g_width / 8, y, g_width / 8 * 6, g_height / 8 );
    
        this.canvas.fillStyle = "rgba( 0, 0, 0, 1.0 )";
        this.canvas.font = '35px sans-serif';
        var textWidth = this.canvas.measureText( string ).width;
        this.canvas.fillText( string, (g_width - textWidth) / 2, y + 50 );
    }

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
      function userTouch( id, state, x, y ) {

        if ( state != this.mouseButtonDown ) return;

        if ( x < Tile.width * 3 && y > g_height - Tile.height * 1 ) {
          return;
        }

        if ( x < Tile.width * 3 && y > g_height - Tile.height * 3 ) {
          g_display = new TitlePage();
          return;
        }

        var h = Math.floor((y - g_height / 8) / 80);
        if ( h == 1 ) {
          // Audio settings
          this.audioOption = ( this.audioOption + 1 ) % this.audioOptionText.length;
          Sounds.toggleSounds( this.audioOption == 0 );
          this.progressRecord.setAudioEnabled( this.audioOption == 0 );
        }

        if ( !IsTablet() && h == 3 ) {
          // Level editor
          g_display = new LevelEditor();
        }

        if ( h == 4 ) {
          // Reset game
          if ( confirm( "Select ok to delete your game progress." ) ) {
            this.progressRecord.reset();
            g_display = new OptionsPage();
          }
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
    this.initialise();
}

