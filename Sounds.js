/* This file is part of Minute Manner.
 * Copyright (C) 2011 David Lloyd
 *
 * Minute Manner is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Minute Manner is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Minute Manner.  If not, see <http://www.gnu.org/licenses/>.
 *
 * This code may be installed through thirdparty Application Stores.
 */


/**
 * This class provides support for sound effects
 */
var Sounds = new Object();

Sounds.sfxVolume = 0.02;

Sounds.isMute = function isMute() {
  return Sounds.sfxVolume == 0.0;
}

/* Switch sound effects on/off */
Sounds.toggleSounds = function toggleSounds() {
  Sounds.sfxVolume = 0.02 - Sounds.sfxVolume;
}

/* Note 0 is A */
Sounds.createNote  = function createNote( note, duration ) {
  var s = new Sample();
  var frequency = 220 * Math.pow( 2.0, note / 12.0 );

  s.setSawtooth( s.sampleRate * duration, frequency );
  s.applyEnvelope( s.sampleRate * 0.1, s.sampleRate * 0.1, 0.75, s.sampleRate * 0.1 );
  return s;
};

Sounds.playClick = function playClick() { RunPrivileged("Sounds.playClick_int()"); };
Sounds.playClick_int = function playClick_int() {
  var sfx = new Audio( "Click.wav" );
  sfx.volume = Sounds.sfxVolume;
  sfx.play();
};


Sounds.playPing  = function playPing() { RunPrivileged("Sounds.playPing_int()"); };
Sounds.playPing_int  = function playPing_int() {
  var sfx = new Audio( "Ping.wav" );
  sfx.volume = Sounds.sfxVolume;
  sfx.play();
}

Sounds.playFall  = function playPing() { RunPrivileged("Sounds.playFall_int()"); };
Sounds.playFall_int  = function playFall_int() {
  var sfx = new Audio( "Fall.wav" );
  sfx.volume = Sounds.sfxVolume;
  sfx.play();
};

Sounds.playBuzz  = function playBuzz() { RunPrivileged("Sounds.playBuzz_int()"); };
Sounds.playBuzz_int  = function playBuzz_int() {
  var sfx = new Audio( "Buzz.wav" );
  sfx.volume = Sounds.sfxVolume * 8;
  sfx.play();
};


Sounds.noteCache = new Array();

Sounds.playJump  = function playJump( jump ) {
  if ( jump % 5 == 0 ) {
    if ( jump > 0 ) jump = - jump; 

    var aud = Sounds.noteCache[ jump ];
    if ( aud == null ) {
      aud = Sounds.createNote( jump / 5 + 25, 0.1 ).getAudio();
      Sounds.noteCache[ jump ]= aud;
    }
   
    if ( Sounds.sfxVolume > 0.0 ) {
	try {
          aud.volume = Sounds.sfxVolume;
          aud.play();
	} catch ( error ) {
          Sounds.sfxVolume = 0.0;
	}
    }
  }
};

Sounds.cache = function cache() {
  Sounds.sfxVolume = 0.0;
  for ( var i = -100; i < 50; i++ ) { Sounds.playJump( i ); }
  Sounds.toggleSounds();
};
setTimeout( "Sounds.cache();", 1000 );
