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
 * This is a tile that is moving:
 *
 *   id         - Type of tile
 *   pos        - Current position
 *   dir        - Direction of motion
 *   finalPos   - Where the tile will stop moving
 *   movingBall - Ball on the moving tile (or null)
 */
function MovingTile(id, pos, dir, finalPos, movingBall) {
    this.id   = id;
    this.pos  = pos;
    this.dir  = dir;
    this.finalPos = finalPos
    this.ball = movingBall;

    this.animationFrame = 0;

    /**
     * Id of the tile that is moving
     */
    this.getId = function getId() {
      return this.id;
    };

    /**
     * Return ball riding on the tile (or null)
     */
    this.getMovingBall = function getMovingBall()  {
      return this.ball;
    };

    /**
     * Return the current position of this tile
     */
    this.getPos   = function getPos()   { return this.pos; };

    /**
     * Return the direction of travel of this tile
     */
    this.getDir   = function getDir()   { return this.dir; };

    /**
     * Return the position where this tile will stop moving
     */
    this.getFinalPos   = function getFinalPos()   { return this.finalPos; };

    /**
     * Tile position
     */
    this.getFrame = function getFrame() { return this.animationFrame; };
    this.move     = function move()     { this.animationFrame += MovingTile.animationSpeed; };
};

MovingTile.animationSpeed = 8;
