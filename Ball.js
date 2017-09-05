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

var BallColour = new Object();
BallColour.red    = 0;
BallColour.green  = 1;
BallColour.blue   = 2;
BallColour.yellow = 3;

/**
 * The display class is responsible for redisplaying
 * the menu, timer and board for the current level.
 */
function Ball(x, y, colour) {
  this.maxSpeed = 8;
    
  this.colour = colour;
  this.pos = new Vector(x, y).mul(Tile.width);
  this.targetPos = this.pos.copy();
  this.isOnMovingTile = false;
  this.isAlive = true;
  this.keys = [0, 0, 0, 0];

  this.getPos = function getPos() { return new Vector(Math.floor(this.pos.getX()/32), Math.floor(this.pos.getY()/32)); };
  this.getTargetPos = function getTargetPos() { return new Vector(Math.floor(this.targetPos.getX()/32), Math.floor(this.targetPos.getY()/32)); };
  this.getColour = function getColour() { return this.colour; }

  this.setPosition =
    function setPosition( pos ) {
      this.pos       = pos.copy();
      this.targetPos = pos.copy();
  };

  this.moveTo =
    function moveTo( pos ) {
      this.targetPos = pos.copy();
  };

  this.move = 
    function move( board ) {
      var dx = this.targetPos.getX() - this.pos.getX();
      var dy = this.targetPos.getY() - this.pos.getY();

      if ( dx >  this.maxSpeed ) dx =  this.maxSpeed; 
      if ( dy >  this.maxSpeed ) dy =  this.maxSpeed; 
      if ( dx < -this.maxSpeed ) dx = -this.maxSpeed; 
      if ( dy < -this.maxSpeed ) dy = -this.maxSpeed; 

      this.pos.add( new Vector(dx, dy) );
  };

  this.isMoving =
    function isMoving() {
      var dx = this.targetPos.getX() - this.pos.getX();
      var dy = this.targetPos.getY() - this.pos.getY();
      return dx != 0 || dy != 0;
  };

  this.addKey = 
    function addKey( colour ) {
      this.keys[colour]++;
  };
 
  this.getKeyCount = 
    function getKeyCount( colour ) {
      return this.keys[colour];
  };
 
  this.useKey = 
    function removeKey( colour ) {
      if ( this.keys[colour] > 0 ) {
        this.keys[colour]--;
          return true;
      }
      return false;
  };

  this.remove =
    function remove() {
      this.isAlive = false;
  };
};

