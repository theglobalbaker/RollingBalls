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
 * The board class is responsible for maintaining the current level
 * state.
 */
function Board(level) {
        
    /* Constructor for Board class */
    this.initialise =
      function initialise(level) {
        this.width  = level.WIDTH;
        this.height = level.HEIGHT;

        this.balls = new Array();

        this.board = new Array();
        for ( var y = 0; y < this.height; y++ ) {
          this.board[y] = new Array();
          for ( var x = 0; x < this.width; x++ ) {
            var tile = new Tile(level.board[y][x]);

            // Unpack a ball
            if ( tile.getClassId() == Tile.ball ) {
                this.balls.push( new Ball( x, y, tile.getId() & 3 ) );
		tile = new Tile(Tile.blank);
            }
            this.board[y][x] = tile;
          }
        }
    };

    this.getTile =
      function getTile(pos) {
        return this.board[pos.getY()][pos.getX()];
    };

    this.setTile =
      function setTile(pos, tile) {
        this.board[pos.getY()][pos.getX()] = tile;
    };

    this.getBalls =
      function getBalls() {
        return this.balls;
    };

    this.removeBalls =
      function removeBalls() {
        for ( var i = 0; i < this.balls.length; i++ )
        {
          if ( this.balls[i].isAlive || this.balls[i].isMoving()) continue;
          this.balls.splice(i,1); 
          break;
        }
    };
    
    this.initialise(level);
}

