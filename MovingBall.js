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
 * This is a ball that is being used by the user
 */
function MovingBall(ball, startPosition) {
    this.ball = ball;
    this.startPosition = startPosition.copy();

    this.getBall = function getBall() { return this.ball; };
    this.getStartPosition = function getStartPosition() { return this.startPosition; };
    this.setStartPosition = function setStartPosition(pos) { this.startPosition = pos; };
};

