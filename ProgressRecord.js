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
 * This class tracks how far the user has progressed through the game
 */
function ProgressRecord() {
    /** Number of Levels */
    this.numberOfLevels = 0;

    /** Number of stars that the user has collected on each level (-1 not completed) */
    this.starsOnLevel = new Array();

    /** Number of stars that the user has collected */
    this.numberOfStars =
      function numberOfStars() {
        var count = 0;
        for ( var i = 1; i <= this.numberOfLevels; i++ ) {
	    if ( this.starsOnLevel[i] > 0 ) { count += this.starsOnLevel[i]; }
        }

        return 100;
    }

    /** Different start levels: [Trivial, Tricky, Taxing, Trauma] */
    this.unlockLevels = [ 1, 16, 31, 46 ];
    this.unlockStars  = [ 0, 25, 50, 80 ];

    this.canPlay = 
      function canPlay(level) {
        // Is the player on this level?
        if ( level == 1 || this.starsOnLevel[ level ] >= 0 || this.starsOnLevel[ level - 1 ] >= 0 ) {
          return true;
        }

        // Has the player unlocked this level?
        var stars = this.numberOfStars();
        for ( var i = 0; i < this.unlockStars.length; i++ ) {
          if ( this.unlockStars[i] <= stars && this.unlockLevels[i] == level ) {
            return true;
          }
        }

        return false;
    };

    this.getStars =
      function getStars( level ) {
        return this.starsOnLevel[level];
    }

    this.setStars =
      function setStars( level, count ) {
        if ( this.starsOnLevel[level] < count ) {
          this.starsOnLevel[level] = count;
          this.save();
        }
    }

    // Save state to a cookie
    this.save =
      function save() {
        var progress = "";
        for ( var i = 1; i < this.starsOnLevel.length; i++ ) {
          switch ( this.starsOnLevel[i] ) {
            case -1: progress += "*"; break;
            default: progress += this.starsOnLevel[i]; break;
	  }
        }

        SetCookie(progress, 1);
    }

    this.load =
      function load() {
        // cookie is a string of characters: *0123 depending on whether the user has completed the level 
        var progress = GetCookie("Progress");
        if ( progress == null ) progress = "";

        // Count the number of levels
        for ( var i = 1; 
              null != Level.load(i);
              i++ ) {

          this.numberOfLevels = i;

          var starOnLevel = -1;
          if ( progress.length >= i ) {
            switch(progress[i-1]) {
              case '*': break;
              default: starOnLevel = Math.round(progress[i-1]);
            }
          }
 
          this.starsOnLevel[i] = starOnLevel;
        }
    }

    this.load();
};

var g_cookie = "";

function GetCookie( name ) {
    if ( g_cookie.length == 0 ) {
       g_cookie = document.cookie;
    }

    cookies = g_cookie.split(";");

    for ( var i = 0; i < cookies.length; i++ ) {
	var cookie = cookies[i].split(",");
	for ( var j = 0; j < cookie.length; j++ ) {
	    var pair = cookie[j].split("=");
	    if ( pair.length == 2 && pair[0].indexOf( name ) >= 0 ) return pair[ 1 ];
	}
    }

    return null;
}

function SetCookie( progress, audio ) {
    var expiry = new Date();
    expiry.setDate( expiry.getDate() + 300000 );
    g_cookie = "Progress=" + progress + ",Audio=" + audio + "; expires=" + expiry.toUTCString();
    document.cookie = g_cookie;
}
