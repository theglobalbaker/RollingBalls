/* This file is part of Project Balls.
 * Copyright (C) 2011 David Lloyd
 *
 * Project Balls is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Project Balls is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Project Balls.  If not, see <http://www.gnu.org/licenses/>.
 */

/* Timer class */
var TickTimer = new Object;

/* Start the TickTimer  */
TickTimer.start = function start() {
  TickTimer.reset();
  TickTimer.tick();
};

/* Retrieve the number of ticks that have elapsed */
TickTimer.getTicks = function getTicks() {
  return TickTimer.ticks;
};

/* Reset timers to zero */
TickTimer.reset = function reset() {
  TickTimer.ticks = 0;
};

/* Change the timer */
TickTimer.bumpTicks = function bumpTicks( step ) {
  TickTimer.ticks += step;
};

/* Update timer */
TickTimer.tick = function tick() {

  /* g_display.tick() returns true if we should be counting */
  if ( g_display != null &&  g_display.tick() ) {
    TickTimer.ticks++;
  }
  setTimeout( "TickTimer.tick();", 20 );
};
