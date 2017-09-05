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
    //    levelNumber = 46;
    this.levelNumber = levelNumber;
    this.board = new Board( Level.load(levelNumber) );
    this.collectedStars = 0;
    this.bestCollectedStars = new ProgressRecord().getStars( this.levelNumber );


    this.movingBalls = new Array();
    this.movingTiles = new Array();

    /* Constructor for Display class */
    this.initialise =
      function initialise() {

        this.dragging = false;
        this.dragFrom = new Vector(-1, -1);

        this.tileMoving = null;
        this.redrawAll  = true;

        // Calculate sizes
        this.displayY      = 70;
        this.displayWidth  = this.board.width  * Tile.width;
        this.displayHeight = this.board.height * Tile.height + this.displayY;

        // Blank
        this.canvas.fillStyle = Display.backgroundColour;
        this.canvas.fillRect( 0, 0, this.displayWidth, this.displayHeight );
    }

   this.move = 
     function move() {
          // Slide tiles
          if ( this.tileMoving != null ) {

            // Animation cycle complete
            if ( this.tileMoving.getFrame() == Tile.width ) {
               this.tileMoving.animationFrame = 0;
               this.tileMoving.getPos().add(this.tileMoving.getDir());
            }


            // Should the tile move?
            if ( (this.tileMoving.getFrame() % Tile.width) ==  0 )
            {
              var next = this.board.getTile(this.tileMoving.getPos().copy().add( this.tileMoving.getDir() ));

              this.tileMoving.animationFrame = 0;
              if ( next.getId() == Tile.lava ) {
                
              } else {
                this.board.setTile(this.tileMoving.getPos(), new Tile(this.tileMoving.getId()) );

                var movingBall = this.tileMoving.getMovingBall();
                if ( movingBall != null ) {
       	          movingBall.getBall().moveTo(this.tileMoving.getPos().copy().mul(Tile.width));
                  movingBall.setStartPosition(this.tileMoving.getPos());
                  movingBall.getBall().isOnMovingTile = false;
                }

                this.tileMoving = null;
              }
            }
          }

          // Ball on sliding tile
          if ( this.tileMoving != null) {
            for ( var i = 0; i < this.board.getBalls().length; i++ )
            {
               var ball = this.board.getBalls()[i];
               if ( ball.isOnMovingTile ) {
                 ball.setPosition( this.tileMoving.getPos().copy().mul(Tile.width).add( this.tileMoving.getDir().copy().mul( this.tileMoving.getFrame() )));
               }
            }
          }

          // Move balls
          for ( var i = 0; i < this.board.getBalls().length; i++ )
          {
             var ball = this.board.getBalls()[i];
             ball.move( this.board );
          }

        };

    this.drawTitlebar =
      function drawTitlebar(pos) {
        this.canvas.drawImage( ImageCatalogue.getBannerImage(), 0, 0 );
        for ( var i = 0; i < 3; i++ ) {
          var image = 2;
          if ( this.bestCollectedStars > i ) image = 0;
          if ( this.collectedStars     > i ) image = 1;
          this.canvas.drawImage( ImageCatalogue.getStarsImage(), Tile.width * 2 * image, 0, Tile.width * 2, Tile.height * 2, Tile.width * (24 + i), Tile.height / 2, Tile.width, Tile.height );
        }
      };
    
    this.drawTileAt =
      function drawTileAt(pos) {
         var tileId = this.board.getTile(pos).getId();
         this.canvas.drawImage( ImageCatalogue.getIconsImage(),
                                64 * ( tileId & 3 ), 64 * ( tileId >> 2 ),
                                64, 64,
                                pos.getX() * Tile.width, this.displayY + pos.getY() * Tile.height, Tile.width, Tile.height );
      };
    
    this.drawBall =
      function draw(ball) {
        this.canvas.drawImage( ImageCatalogue.getIconsImage(),
                               4 * 64, 2 * 64 * ball.getColour(),
                               64, 64,
                               ball.pos.getX(), this.displayY + ball.pos.getY(), Tile.width, Tile.height );
      };

    /* Redraw the current board */
    this.draw = 
        function draw() {
          this.move();

          // Draw background
          if ( this.redrawAll ) {
            this.drawTitlebar();

            for ( var y = 0; y < this.board.height; y++ ) {
              for ( var x = 0; x < this.board.width; x++ ) {
                this.drawTileAt(new Vector(x, y)); 
              }
            }

            this.redrawAll = false;
          }

          // Draw background of sliding tile
          if ( this.tileMoving != null) {
            this.drawTileAt(this.tileMoving.getPos());
          }

          // Draw background under balls
          for ( var k = 0; k < this.board.getBalls().length; k++ )
          {
             var ball = this.board.getBalls()[k];
             var x = ball.getPos().getX();
             var y = ball.getPos().getY();

             for ( var i = -1; i <= 1; i++ ) {
               for ( var j = -1; j <= 1; j++ ) {
                 this.drawTileAt(new Vector(x + i, y + j)); 
               }
             }
          }

          // Animate sliding tiles
          if ( this.tileMoving != null) {
            this.tileMoving.move();

            var tileId = this.tileMoving.getId();

            var p = this.tileMoving.getPos().copy().mul(Tile.width).add( this.tileMoving.getDir().copy().mul( this.tileMoving.getFrame() ) );
            this.canvas.drawImage( ImageCatalogue.getIconsImage(),
                                   64 * ( tileId & 3 ), 64 * ( tileId >> 2 ),
                                   64, 64,
                                   p.getX(), p.getY() + this.displayY,
                                   Tile.width, Tile.height );
          }

          // Remove balls that have exited
          this.board.removeBalls();

          // Draw balls
          for ( var i = 0; i < this.board.getBalls().length; i++ )
          {
             var ball = this.board.getBalls()[i];
             this.drawBall(ball);
          }

          // End of level
          if ( this.board.getBalls().length == 0 )
          {
            this.endOfLevel = true;
            this.drawEndOfLevel();
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
        // End of level
        if ( this.endOfLevel ) {
          if ( mouseDown == this.mouseButtonDown) {
            g_display = new LevelSelect();
          }
          return;
        }

        // Menu
        if ( y < this.displayY ) {
          if ( x > 28 * Tile.width && mouseDown == this.mouseButtonDown ) {
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
            this.movingBalls[id] = new MovingBall(ball, square);
            return;
          }

          // Drag a tile
          var tileId = this.board.getTile(square).getId();
          if ( tileId > 3 ) {
            this.movingTiles[id] = square; 
          }

          return;
        }

        // Is a ball is being dragged?
        if ( this.movingBalls.length > id && this.movingBalls[id] != null ) {
          var dragBall = this.movingBalls[id].getBall();

          // Drag end
          if ( mouseDown == this.mouseButtonUp || !dragBall.isAlive) {

            // On teleport tile
            if ( this.board.getTile(dragBall.getPos()).getClassId() ==  Tile.teleport ) {
              var newPosition = this.findTeleportTile(dragBall.getPos()); 
              dragBall.moveTo(newPosition.mul(Tile.width));
            }

            this.movingBalls[id] = null;
            return;
          }

          this.userMovingBall(id, x, y, square );
          return;
        }

        // Is the user starting to move a tile?
        if ( this.tileMoving == null && this.movingTiles.length > id && this.movingTiles[id] != null ) {

          var dx = square.getX() - this.movingTiles[id].getX();
          var dy = square.getY() - this.movingTiles[id].getY();

          // drag direction
          if ( dx >  1 ) dx =  1;
          if ( dx < -1 ) dx = -1;
          if ( dy >  1 ) dy =  1;
          if ( dy < -1 ) dy = -1;

          if ( dx != 0 && dy != 0 ) {
          } else if ( dx != 0 || dy != 0 ) {
            var tile = this.board.getTile(this.movingTiles[id]);
            if ( tile.canMove(dx, dy) ) {
              this.tileMoving = new MovingTile( tile.getId(), this.movingTiles[id], new Vector(dx, dy), null );
              this.board.setTile(this.movingTiles[id], new Tile(Tile.lava) );
              this.movingTiles[id] = null;
            }
          }
        }
    }

    /* The user has clicked on the display */
    this.userMovingBall = 
      function userMovingBall( id, x, y, square ) {
        var dragBall        = this.movingBalls[id].getBall();
        var currentPosition = this.movingBalls[id].getStartPosition();

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

	if (dx == 0 && dy == 0) {
          canLeaveTile = false;
        } else if ( (dx * dy == 0) ) {
          canLeaveTile = this.handleBallMove(this.movingBalls[id], currentPosition, new Vector(dx, dy));
        } else {
          var tdx = dx; var tdy = dy;
          if ( preferX >0 ) { dy = 0; } else { dx = 0; }
          canLeaveTile = this.handleBallMove(this.movingBalls[id], currentPosition, new Vector(dx, dy));

          if ( !canLeaveTile ) {
            if ( preferX <= 0 ) { dx = tdx; dy = 0; } else { dx = 0; dy = tdy; }
            canLeaveTile = this.handleBallMove(this.movingBalls[id], currentPosition, new Vector(dx, dy));
          }
        }

        // Dragging a ball
        if (canLeaveTile) {
          currentPosition = currentPosition.copy().add(new Vector(dx, dy));
          this.movingBalls[id].setStartPosition(currentPosition);
          this.ballOver(dragBall, currentPosition);
        }

        dragBall.moveTo(currentPosition.copy().mul(Tile.width) );
      };

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
        if ( this.tileMoving == null && tileCurrent.canMove( dir.getX(), dir.getY() ) ) {
          if ( tileNext.getId() == Tile.lava ) {
            this.tileMoving = new MovingTile( tileCurrent.getId(), movingBall.getStartPosition(), dir, movingBall );
            this.board.setTile(movingBall.getStartPosition(), new Tile(Tile.lava) );
            movingBall.getBall().isOnMovingTile = true;
            this.redrawAll = true;
            return false;
          } else {
            movingBall.getBall().isOnMovingTile = false;
            this.tileMoving = null;
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
           break;
        }
        default: break;
      }

      // Check next tile by class
      switch ( tileCurrent.getClassId() ) {
        case Tile.key: {
           this.board.setTile(currentPosition, new Tile(Tile.blank));
           ball.addKey(tileCurrent.getId() & 3);
           break;
        }
        case Tile.exit: {
          if (ball.getColour() == (tileCurrent.getId() & 3)) {
            ball.remove();
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
     * The user has completed the level
     */
    this.drawEndOfLevel =
      function drawEndOfLevel() {
        // Blank
        this.canvas.fillStyle = Display.backgroundColour;
        this.canvas.fillRect( 100, 100, this.displayWidth - 100 * 2, this.displayHeight - 100 * 2 );

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
    this.initialise();
}

Display.backgroundColour = "rgba(0,0,0,1.0)";
Display.titleBarColour = "rgba(128,128,128,1.0)";