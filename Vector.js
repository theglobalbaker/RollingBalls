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
 * [x,y] point 
 */
function Vector(x,y) {
    this.x = x;
    this.y = y;

    this.getX = function getX() { return this.x; };
    this.getY = function getY() { return this.y; };

    this.equals = function equal(o) { return (this.x == o.x) && (this.y == o.y); }
    this.add    = function add(o)   { this.x += o.x; this.y += o.y; return this; }
    this.sub    = function sub(o)   { this.x -= o.x; this.y -= o.y; return this; }
    this.mul    = function mul(t)   { this.x *= t;   this.y *= t;   return this; }
    this.copy   = function copy()   { return new Vector(this.x, this.y); }
};
