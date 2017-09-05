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
 * This is a tile that is moving
 */
function MovingTile(id, pos, dir, movingBall) {
    this.id = id;
    this.pos = pos;
    this.dir = dir;
    this.ball = movingBall;

    this.animationFrame = 0;

    this.getId    = function getId()    { return this.id; };
    this.getMovingBall  = function getMovingBall()  { return this.ball; };
    this.getPos   = function getPos()   { return this.pos; };
    this.setDir   = function setDir(d)  { this.dir = d; };
    this.getDir   = function getDir()   { return this.dir; };
    this.isMoving = function isMoving() { return (this.dir.x != 0) || (this.dir.y != 0); };

    this.getFrame = function getFrame() { return this.animationFrame; };
    this.move     = function move()     { this.animationFrame += 8; };
};

MovingTile.animationSpeed = 8;
