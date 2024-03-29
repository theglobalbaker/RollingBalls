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
function Display( levelNumber ) {
    CanvasDisplay.prototype.constructor.apply( this );

    /**
     * Initialize the Display class and Game Engine.
     *
     * Parameters:
     *     levelNumber - level being played 
     */
    this.initialise =
      function initialise( levelNumber ) {
        
        // Load the level and initialize the board
        this.level = Level.load(levelNumber);
        this.board = new Board( level );

        // Level and statistics
        this.levelNumber = levelNumber;
        this.collectedStars = 0;
        this.bestCollectedStars = new ProgressRecord().getStars( this.levelNumber );

        // Record the current Level
        ProgressRecord.lastLevelPlayed = this.levelNumber;

        // Dictionary [touch_id -> MovingBall]
        this.dragBalls = new Array();

        // Dictionary [touch_id -> tile about to be dragged]
        this.dragTiles = new Array();

        // List of currently MovingTiles
        this.tilesMoving = new Array();

        // Display layout
        this.displayY      = 50;
        this.displayWidth  = this.board.width  * Tile.width;
        this.displayHeight = this.board.height * Tile.height + this.displayY;

        // Clear the screen
        this.canvas.fillStyle = Display.backgroundColour;
        this.canvas.fillRect( 0, 0, this.displayWidth, this.displayHeight );

        // Signal that a complete redisplay is necessary
        this.redrawAll  = true;

        // Show Prelevel message
        this.showPrelevelMessage = true;
        this.endOfLevelDelay = 50;
    }


    /**
     * Draw the title bar and collected stars
     */
    this.drawTitlebar =
      function drawTitlebar() {
        this.canvas.drawImage( ImageCatalogue.getBannerImage(), 0, 0 );
        for ( var i = 0; i < 3; i++ ) {
          var image = 2;
          if ( this.bestCollectedStars > i ) image = 0;
          if ( this.collectedStars     > i ) image = 1;
          this.canvas.drawImage( ImageCatalogue.getStarsImage(), 
                                 Tile.width * 2 * image, 0, 
                                 Tile.width * 2, Tile.height * 2, 
                                 g_width + this.displayY * (i - 4), 0, 
                                 this.displayY, this.displayY );
        }
      };

    /**
     * Draw the tile at an (x,y) position
     *
     * Parameters:
     *     position - vector containing x,y position of the Tile
     */
    this.drawTileAt =
      function drawTileAt(position) {
        if (   position.getX() < 0 || position.getX() >= this.board.width
            || position.getY() < 0 || position.getY() >= this.board.height ) {
          return;
	}

         var tileId = this.board.getTile( position ).getId();
         this.canvas.drawImage( ImageCatalogue.getIconsImage(),
                                2 * Tile.width * ( tileId & 3 ), 2 * Tile.height * ( tileId >> 2 ),
                                2 * Tile.width, 2 * Tile.height,
                                position.getX() * Tile.width, this.displayY + position.getY() * Tile.height,
                                Tile.width, Tile.height );
      };

    /**
     * Draw a ball
     *
     * Parameters:
     *    ball - ball to draw
     */    
    this.drawBall =
      function draw(ball) {
        var xImage = (ball.pos.getX() >> 2) & 0x7;
        var yImage = (ball.pos.getY() >> 2) & 0x7;
        this.canvas.drawImage( ImageCatalogue.getIconsImage(),
                               Tile.width * 2 * ( 4 + xImage + yImage ), Tile.height * 2 * ( 2 * ball.getColour() + (yImage != 0 ? 1 : 0) ),
                               2 * Tile.width, 2 * Tile.height,
                               ball.pos.getX(), this.displayY + ball.pos.getY(),
                               Tile.width, Tile.height );
      };

    /**
     * Called by the tick timer to update the screen.
     */
    this.draw = 
      function draw() {
        // Run the game engine
        this.move();

        // Redraw background (if necessary)
        if ( this.redrawAll ) {
          this.drawTitlebar();

          for ( var y = 0; y < this.board.height; y++ ) {
            for ( var x = 0; x < this.board.width; x++ ) {
              this.drawTileAt(new Vector(x, y)); 
            }
          }

          this.redrawAll = false;
        }

        // Redraw background underneath sliding tiles
        for ( var i = 0; i < this.tilesMoving.length; i++ ) {
          this.drawTileAt( this.tilesMoving[i].getPos() );
        }

        // Redraw background under balls
        for ( var k = 0; k < this.board.getBalls().length; k++ )
        {
           var ball = this.board.getBalls()[k];
           var x = ball.getPos().getX();
           var y = ball.getPos().getY();

           for ( var i = -1; i <= 1; i++ ) {
             for ( var j = -1; j <= 1; j++ ) {
               this.drawTileAt( new Vector( x + i, y + j ) ); 
             }
           }
        }

        // Draw the moving tiles
        for ( var i = 0; i < this.tilesMoving.length; i++ ) {
          movingTile = this.tilesMoving[ i ];
          movingTile.move();

          var tileId = movingTile.getId();
          var position = movingTile.getPos().copy().mul(Tile.width).add( movingTile.getDir().copy().mul( movingTile.getFrame() ) );
          this.canvas.drawImage( ImageCatalogue.getIconsImage(),
                                 Tile.width * 2 * ( tileId & 3 ), Tile.height * 2 * ( tileId >> 2 ),
                                 Tile.width * 2, Tile.height * 2,
                                 position.getX(), position.getY() + this.displayY,
                                 Tile.width, Tile.height );
        }

        // Remove balls that have exited
        this.board.removeBalls();

        // Draw balls
        for ( var i = 0; i < this.board.getBalls().length; i++ ) {
           var ball = this.board.getBalls()[i];
           this.drawBall(ball);
        }

        // Prelevel message
        if ( this.showPrelevelMessage ) {
          this.drawPrelevelMessage();
        }

        // End of level
        if ( this.board.getBalls().length == 0 ) {
          if ( this.endOfLevelDelay-- <= 0 ) {
            this.endOfLevel = true;
            this.drawEndOfLevel();
          }
        }

      };

    /**
     * Called by tick timer to run game logic
     */
    this.move = 
      function move() {
        // Update tiles that are currently moving
        for ( var i =  this.tilesMoving.length - 1; i >= 0; i-- ) {
           movingTile = this.tilesMoving[i];

           // Has the tile got to the next square?
           if ( movingTile.getFrame() == Tile.width ) {
             movingTile.animationFrame = 0;
             movingTile.getPos().add(movingTile.getDir());

             // Tile has reached its final destination and will stop moving
             if ( movingTile.getFinalPos().equals( movingTile.getPos() ) ) {
               this.board.setTile(movingTile.getPos(), new Tile(movingTile.getId()) );

               // If a ball is on the tile, it is back under user control now
               var movingBall = movingTile.getMovingBall();
               if ( movingBall != null ) {
                 movingBall.getBall().moveTo(movingTile.getPos().copy().mul(Tile.width));
                 movingBall.setStartPosition(movingTile.getPos());
                 movingBall.getBall().isOnMovingTile = false;
               }

               // Remove from list
               this.tilesMoving.splice( i, 1 )
            }
          }
        }

        // Handle balls on on sliding tiles
        for ( var i = 0; i < this.tilesMoving.length; i++ ) {
          movingTile = this.tilesMoving[i];
          movingBall = movingTile.getMovingBall();

          if ( movingBall != null ) {
            movingBall.getBall().setPosition( movingTile.getPos().copy().mul(Tile.width).add( movingTile.getDir().copy().mul( movingTile.getFrame() )));
          }
        }

        // Move balls that are under the user's control
        for ( var i = 0; i < this.board.getBalls().length; i++ ) {
          var ball = this.board.getBalls()[i];
          ball.move( this.board );
        }
      };


    /* The user has clicked on the display */
    this.userMouse = 
      function userMouse( mouseDown, x, y ) {
        this.userTouch( 10, mouseDown, x, y );
    }

    /* The user has clicked on the display */
    this.touchEvent = 
      function touchEvent( mouseDown, parsedEvent ) {
        this.userTouch(parsedEvent.id, mouseDown, parsedEvent.x, parsedEvent.y);
    }

    /**
     * The user has clicked on the display.
     *
     * Parameter:
     *    id        - touch_id for multi-touch (0 for mouse pointer)
     *    mouseDown - Signals touch up/down event
     *    x, y      - Position touched/clicked
     */
    this.userTouch = 
      function userTouch( id, mouseDown, x, y ) {
        // End of level
        if ( this.endOfLevel ) {
          if ( mouseDown == this.mouseButtonDown) {
            if ( x > 100 && x < g_width / 2 && y > g_height - 200 && y < g_height - 100 ) {
              g_display = new LevelSelect();
            }
            if ( x > g_width / 2 && x < g_width - 100 && y > g_height - 200 && y < g_height - 100 ) {
              if ( Level.load( this.levelNumber + 1 ) == null ) {
	        // This is the last level - return to the level select page
                g_display = new LevelSelect();
                return;
              } else {
                g_display = new Display( this.levelNumber + 1 );
              }
            }
          }
          return;
        }

        // Prelevel message
        if ( this.showPrelevelMessage ) {
          if ( mouseDown == this.mouseButtonDown) {
	      this.showPrelevelMessage = false;
              this.redrawAll = true;
          }
        }

        // Menu
        if ( y < this.displayY ) {
          if ( x > g_width - this.displayY && mouseDown == this.mouseButtonDown ) {
            g_display = new LevelSelect();
          }
          return;
        }

        y = y - this.displayY;
        var square = new Vector(Math.floor(x/Tile.width), Math.floor(y/Tile.height));

        // Drag start
        if ( mouseDown == this.mouseButtonDown ) {
          // Is the user dragging a ball?
          var ball = this.getBallOnSquare(square, null);
          if ( ball != null && !ball.isOnMovingTile && ball.isAlive) {
            this.dragBalls[id] = new MovingBall(ball, square);
            return;
          }

          // Drag a tile
          var tileId = this.board.getTile(square).getId();
          if ( tileId > 3 ) {
            this.dragTiles[id] = square; 
          }

          return;
        }

        // Is a ball is being dragged?
        if ( this.dragBalls.length > id && this.dragBalls[id] != null ) {
          var dragBall = this.dragBalls[id].getBall();

          // Drag end
          if ( mouseDown == this.mouseButtonUp || !dragBall.isAlive) {

            // On teleport tile
            if ( this.board.getTile(dragBall.getPos()).getClassId() ==  Tile.teleport ) {
              var newPosition = this.findTeleportTile(dragBall.getPos()); 
              dragBall.moveTo(newPosition.mul(Tile.width));
            }

            this.dragBalls[id] = null;
            return;
          }

          this.userMovingBall(id, x, y, square );
          return;
        }

        // Is the user starting to move a tile?
        if ( this.dragTiles.length > id && this.dragTiles[id] != null ) {

          var dx = square.getX() - this.dragTiles[id].getX();
          var dy = square.getY() - this.dragTiles[id].getY();

          // drag direction
          if ( dx >  1 ) dx =  1;
          if ( dx < -1 ) dx = -1;
          if ( dy >  1 ) dy =  1;
          if ( dy < -1 ) dy = -1;

          if ( dx != 0 && dy != 0 ) {
          } else if ( dx != 0 || dy != 0 ) {
            var tile = this.board.getTile(this.dragTiles[id]);
            if ( tile.canMove(dx, dy) ) {
              this.startMovingTile( tile.getId(), this.dragTiles[id], new Vector(dx, dy), null );
              this.dragTiles[id] = null;
            }
          }
        }
    }

    /* The user has clicked on the display */
    this.userMovingBall = 
      function userMovingBall( id, x, y, square ) {
        var dragBall        = this.dragBalls[id].getBall();
        var currentPosition = this.dragBalls[id].getStartPosition();

        // Work out direction we should be moving in
        var dx = square.getX() - currentPosition.getX();
        var dy = square.getY() - currentPosition.getY();

        var preferX = dx * dx - dy * dy;

        // drag direction
        if ( dx >  1 ) dx =  1;
        if ( dx < -1 ) dx = -1;
        if ( dy >  1 ) dy =  1;
        if ( dy < -1 ) dy = -1;

        // Check if we can move vertically/horizontally
        var canLeaveTile = false;

        if ( dragBall.onMovingTile() || (dx == 0 && dy == 0) ) {
          canLeaveTile = false;
        } else if ( (dx * dy == 0) ) {
          canLeaveTile = this.handleBallMove(this.dragBalls[id], currentPosition, new Vector(dx, dy));
        } else {
          var tdx = dx; var tdy = dy;
          if ( preferX >0 ) { dy = 0; } else { dx = 0; }
          canLeaveTile = this.handleBallMove(this.dragBalls[id], currentPosition, new Vector(dx, dy));

          if ( !canLeaveTile ) {
            if ( preferX <= 0 ) { dx = tdx; dy = 0; } else { dx = 0; dy = tdy; }
            canLeaveTile = this.handleBallMove(this.dragBalls[id], currentPosition, new Vector(dx, dy));
          }
        }

        // Dragging a ball
        if (canLeaveTile) {
          currentPosition = currentPosition.copy().add(new Vector(dx, dy));
          this.dragBalls[id].setStartPosition(currentPosition);
          this.ballOver(dragBall, currentPosition);
        }

        dragBall.moveTo(currentPosition.copy().mul(Tile.width) );
      };

    /**
     * Create a MovingTile class.  Calculate where the tile will move to.
     *
     * Parameters:
     *   id   - id of Tile moving
     *   pos  - position of Tile
     *   dir  - Direction of travel
     *   ball - ball on tile (or null)
     *
     * Returns:
     *   true - tile is moving (false tile can't move)
     */
    this.startMovingTile =
      function startMovingTile( id, pos, dir, ball ) {
        // Where will this tile stop moving?
        var finalPos = pos;
        while ( this.board.getTile( finalPos.copy().add(dir) ).getId() == Tile.lava ) {
          nextPos = finalPos.copy().add(dir);

          // Check other moving tiles
          tileInWay = false;
          for ( var i = 0; i < this.tilesMoving.length; i++ ) {
              if ( this.tilesMoving[i].getFinalPos().equals( nextPos ) ) {
       	        tileInWay = true;
              }
          }
          if ( tileInWay ) break;
       
          // We can move here
          finalPos = nextPos;
        }

        if ( finalPos.equals(pos) ) {
          return false;
        }

        this.tilesMoving.push( new MovingTile( id, pos, dir, finalPos, ball) );

        this.board.setTile(pos, new Tile(Tile.lava) );
        if ( ball != null ) {
          ball.getBall().isOnMovingTile = true;
        }
        return true;
    }

    this.handleBallMove = 
      function handleBallMove( movingBall, currentPosition, dir) {
        var ball        = movingBall.getBall();
        var tileCurrent = this.board.getTile(currentPosition);
        var tileNext    = this.board.getTile(currentPosition.copy().add(dir));

        var canLeaveTile = false;

        // Check that the space to move to doesn't have a ball on it
        if ( null != this.getBallOnSquare(currentPosition.copy().add(dir), movingBall.getBall()) )
        {
          return false;
        }

        // Currently on an arrow tile
        if ( !ball.onMovingTile() && tileCurrent.canMove( dir.getX(), dir.getY() ) ) {
          if ( tileNext.getId() == Tile.lava ) {
            this.startMovingTile( tileCurrent.getId(), movingBall.getStartPosition(), dir, movingBall );
            this.redrawAll = true;
            return false;
          }
        }

        // Check next tile
        switch ( tileNext.getId() ) {
          case Tile.lava:    { canLeaveTile = false; break; }
          case Tile.wall:    { canLeaveTile = false; break; }
          case Tile.movable: { canLeaveTile = false; break; }
          default:           { canLeaveTile = true;  break; }
        }

        // Check next tile by class
        switch ( tileNext.getClassId() ) {
          case Tile.lock: {
            canLeaveTile = ball.useKey(tileNext.getId() & 3);
            if ( canLeaveTile ) {
       	      this.board.setTile(currentPosition.copy().add(dir), new Tile(Tile.blank));
              Sounds.playClick();
            }
            break;
          }
          case Tile.exit:
          case Tile.filter: {
            canLeaveTile = (ball.getColour() == (tileNext.getId() & 3));
            break;
          }
          default: break;
        }

        if ( canLeaveTile && tileCurrent.getId() == Tile.weak ) {
          this.board.setTile(currentPosition, new Tile(Tile.lava));
        }
        return canLeaveTile;
    };

    this.ballOver = 
      function ballOver( ball, currentPosition ) {
      var tileCurrent = this.board.getTile(currentPosition);

      // Check next tile
      switch ( tileCurrent.getId() ) {
        case Tile.star: {
           this.board.setTile(currentPosition, new Tile(Tile.blank));
           this.collectedStars++;
           this.redrawAll = true;

           Sounds.playPing();
           break;
        }
        default: break;
      }

      // Check next tile by class
      switch ( tileCurrent.getClassId() ) {
        case Tile.key: {
           this.board.setTile(currentPosition, new Tile(Tile.blank));
           ball.addKey(tileCurrent.getId() & 3);

           Sounds.playClick();
           break;
        }
        case Tile.exit: {
          if (ball.getColour() == (tileCurrent.getId() & 3)) {
            ball.remove();

            Sounds.playFall();
          }
          break;
        }
        default: break;
      }
    };

    // Get a ball on a square (ignoring the one passed in)
    this.getBallOnSquare = 
      function getBallOnSquare(square, ballToIgnore) {
        for ( var i = 0; i < this.board.getBalls().length; i++ )
        {
          var ball = this.board.getBalls()[i];
          if ( ball != ballToIgnore && ball.getPos().equals(square) && ball.isAlive ) {
            return ball;
          }
        }
        return null;
      };

    /* Teleport tiles come in pairs - given one position, find the other position */ 
    this.findTeleportTile =
      function findTeleportTile(tilePosition) {
        var tile1 = this.board.getTile(tilePosition);

        for ( var y = 0; y < this.board.height; y++ ) {
          for ( var x = 0; x < this.board.width; x++ ) {
            var position = new Vector(x, y); 
            var tile2 = this.board.getTile(position);
            if (!position.equals(tilePosition) && tile2.getId() == tile1.getId() ) {
       	      return position;
            }
          }
        }
    }

    /*
     * Show the message before the level starts
     */
    this.drawPrelevelMessage = 
      function drawPrelevelMessage() {

        // Make the image a little darker
        this.canvas.fillStyle = "rgba( 0, 0, 0, 0.7 )";
        this.canvas.fillRect( 0, 0, g_width, g_height );

        this.canvas.fillStyle = "rgba( 255, 255, 255, 1.0 )";
        this.canvas.font = '35px sans-serif';
        var textWidth = this.canvas.measureText( this.level.name ).width;
        this.canvas.fillText( this.level.name, (g_width - textWidth) / 2, g_height / 2 - 50 );

        this.canvas.font = '30px sans-serif';
        textWidth = this.canvas.measureText( this.level.message ).width;
        this.canvas.fillText( this.level.message, (g_width - textWidth) / 2, g_height / 2 + 50 );

        this.redrawAll = true;
    }


    /*
     * The user has completed the level
     */
    this.drawEndOfLevel =
      function drawEndOfLevel() {
        // Blank
        this.canvas.fillStyle = Display.backgroundColour;
        this.canvas.drawImage( ImageCatalogue.getLevelCompleteImage(), 100, 100 );

        for ( var i = 0; i < 3; i++ ) {
          var image = 2;
          if ( this.bestCollectedStars > i ) image = 0;
          if ( this.collectedStars     > i ) image = 1;
          this.canvas.drawImage( ImageCatalogue.getStarsImage(), 
                                 Tile.width * 2 * image, 0, 
                                 Tile.width * 2, Tile.height * 2, 
                                 100 + (g_width - 100 * 2 - Tile.width * 6) / 2 + Tile.width * 2 * i, (g_height - Tile.height * 2)/2, 
                                 this.displayY, this.displayY );
        }

	new ProgressRecord().setStars( this.levelNumber, this.collectedStars );
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
    this.initialise( levelNumber );
}

Display.backgroundColour = "rgba(0,0,0,1.0)";
Display.titleBarColour = "rgba(128,128,128,1.0)";
Display.textColour = "rgba(255,255,255,1.0)";
Display.textFont         = "50px Ariel";

