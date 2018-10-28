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

/* Some functions can't be run by the main thread - ask for an OS callback */
function RunPrivileged(call) {
    document.location = "run-priv://" + call;
};

/* Return true if this is on IOS */
function IsTablet() {
  return true;
};
