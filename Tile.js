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
function Tile(id) {
    this.id = id;
    this.isSliding = false;
    this.ball = null;

    this.getId =
        function getId() {
            return this.id;
        };

    this.getClassId =
        function getClassId() {
            return this.id & ~3;
        };

    this.setIsSliding =
      function setIsSliding( state ) {
        this.isSliding = state;
    };
    
    this.getIsSliding =
      function getIsSliding() {
        return this.isSliding;
      };

    this.setBall =
      function setBall(ball) {
        this.ball = ball;
      };

    this.getBall =
      function getBall() {
        return this.ball;
      };

    /* If this is an arrow square, match directions */
    this.canMove = 
      function canMove(dx, dy) {
        if ( this.id == Tile.movable ) {
          return true;
        }

        if ( this.id <= Tile.blank || this.id >= Tile.key ) {
          return false;
        }
 
        var id = this.id - 4;
        return   ((dx <= 0) || ((id & Tile.right) != 0))
              && ((dx >= 0) || ((id & Tile.left)  != 0))
              && ((dy >= 0) || ((id & Tile.up)    != 0))
              && ((dy <= 0) || ((id & Tile.down)  != 0));
      };
};

Tile.width = 32;
Tile.height = 32;

Tile.star = 0;
Tile.weak = 1;
Tile.lava = 2;
Tile.wall = 3;

Tile.blank = 4;
Tile.up    = 1;
Tile.down  = 2;
Tile.left  = 4;
Tile.right = 8;
Tile.arrow = 16;

Tile.key      = 20;
Tile.lock     = 24;
Tile.exit     = 28;
Tile.filter   = 32;
Tile.ball     = 36;
Tile.teleport = 40;
Tile.movable  = 44;