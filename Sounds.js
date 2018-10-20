/* This file is part of Rolling Balls.
 * Copyright (C) 2018 David Lloyd
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
 *
 * This code may be installed through thirdparty Application Stores.
 */


/**
 * This class provides support for sound effects
 */
var Sounds = new Object();

Sounds.setMute = function setMute( mute ) {
  Sounds.mute = mute;
}

Sounds.playFall = function playFall() {
  if ( !Sounds.mute ) new Audio( "Fall.wav" ).play();
};

Sounds.playClick = function playClick() {
  if ( !Sounds.mute ) new Audio( "Click.wav" ).play();
};

Sounds.playPing  = function playPing() {
  if ( !Sounds.mute ) new Audio( "Ping.wav" ).play();
};

Sounds.playBuzz  = function playBuzz() {
  if ( !Sounds.mute ) new Audio( "Buzz.wav" ).play();
};

