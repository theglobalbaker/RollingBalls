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
        this.canvas.fillRect( 0, 0, this.displayWidth, this.displayHeight );
        this.canvas.drawImage( ImageCatalogue.getTitlePageImage(), 0, 0, this.displayWidth, this.displayHeight );
    };

    /* The user has clicked on the display */
    this.userMouse = 
      function userMouse( mouseDown, x, y ) {
        this.userTouch( mouseDown );
    }

    /* The user has clicked on the display */
    this.touchEvent = 
      function touchEvent( type, event ) {
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
    this.displayWidth = 1000;
    this.displayHeight = 800;
    this.initialise();
}

TitlePage.backgroundColour = "rgba(0,0,255,1.0)";
