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
 * along with Minute Maner.  If not, see <http://www.gnu.org/licenses/>.
 *
 * This code may be installed through thirdparty Application Stores.
 */


var Music = new Object();

/* Global music controls */
Music.enabled = 1;
Music.playing = 0;
Music.current = null;
Music.volume = 0.01;

/* Switch music on or off */
Music.toggleMusic = function toggleMusic() {
  Music.enabled = 1 - Music.enabled;

  if ( Music.enabled == 1 ) {
    Music.current.volume = Music.volume;
    Music.playing = 1;
    Music.loop();
  } else {
    Music.stop();
  }
}

/* Play music in a continuous loop */
Music.play = function play( tune ) {

  /* Stop any currently playing music */
  if ( Music.playing ) {
    Music.playing = 0;
    Music.current.pause();
  }

  /* Play requested music (if music is enabled) */
  Music.current = Music.tunes[ tune ];
  Music.current.volume = Music.volume;

  if ( Music.enabled ) {
    Music.playing = 1;
    Music.loop();
  }
}

/* Stop the currently playing music (uses fade()) */
Music.stop = function stop() {
  if ( Music.playing != 0 ) {
    Music.playing = 0;
    Music.fade();
  }
}

/* Fade out the music, then pause it */
Music.fade = function fade() {
  /* If someone has restarted the music do nothing */
  if ( Music.playing != 0 ) {
    return;
  }

  /* Decrease the volume until we hit a minimum */
  if ( Music.current.volume > Music.volume/10 ) {
    Music.current.volume -= Music.volume/10 ;
    setTimeout( "Music.fade();", 50 );
  } else {
     Music.current.pause();
  }
}

/* If the music has finished, we restart it in this loop */
Music.loop = function loop() {
  /* The music should not be playing - quit immediately */
  if ( Music.playing == 0 ) {
    return;
  }

  /* Start or restart the music from the beginning */
  if ( Music.current.paused || Music.current.ended ) {
    try {
      Music.current.currentTime = 0;
      Music.current.play();
    } catch ( error ) {
      /* This happens on Firefox if there is no Sound device */
      Music.enabled = 0;
      Music.playing = 0;
    }
   }

   /* Check back in a second to make sure the music is still playing */
   setTimeout( "Music.loop();", 1000 );
  };

/* Create a Sound from a string representing a sequence of notes.
 *
 * Notes represented by charcters 'a' through to 'g' (use c# for sharps). 
 * Six octaves are available:
 *    A is an octave above a.
 *    c#^ is two octaves above c#
 *    B#v  is two octaves below B#
 */
Music.sequence = function sequence( duration, notes ) {
  var s = new Sample();

  var noteLookup = [ "a", "a#", "b", "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#",
                     "A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", " " ];

  for ( var i = 0; i < notes.length; i++ ) {
    var n = notes.charAt( i );
    var octave = 0;

    if ( notes.charAt( i + 1 ) == "#" ) {
      n += "#";
      i++;
    }

    if ( notes.charAt( i + 1 ) == "^" ) {
      octave = 1;
      i++;
    }

    if ( notes.charAt( i + 1 ) == "v" ) {
      octave = -1;
      i++;
    }

    var d = duration;
    while ( notes.charAt( i + 1 ) == "-" ) {
      d += duration;
      i++;
    }

    var note = Sounds.createNote( noteLookup.indexOf( n ) + octave * 24, d );

    if ( n == " " )  note.setVolume( 0.0 );

    s.append( note );
  }
  return s;
}


Music.tunes = new Array();


Music.cache = function cache() {
  /* Swan lake */
  Music.tunes[0] = Music.sequence( 0.2, "g#g#BCg#g#BCG#G#F#DD#BCgg#g#BCg#g#BCG#G#F#DD#BCg#C#C#EFC#C#EFD#D#F#Ga#^a#^g#g#G#G#g#g#G#G#g#g#gg#BCDD#F#GG#G#g#g#G#G#g#g#gg#BCDD#F#G#C#C#c#^c#^C#C#C#DD#D#F#Ga#^-" ).getAudio();
  //Music.tunes[0] = new Audio( "SwanLake.wav" );

  /* Hall of the Moutain King */
  //  Music.tunes[1] = Music.sequence( 0.2, "def#gAf#A-A#gA#-Af#A-def#gAf#A-A#gA#-A-gAA#CDA#D-C#AC#-Cg#C-gAA#CDA#DGFDA#DF-gAA#CDA#D-C#AC#-Cg#C-gAA#CDA#DGDA#DGg-g-G-g-G-GGGGg-G-" ).getAudio(); 
  Music.tunes[1] = new Audio( "HallOfTheMountainKing.wav" );

  /* Fairy Queen */
  //  Music.tunes[2] = Music.sequence( 0.2, "CgegCgegCgegCgegdCBAgfedecdefgABCgegCgegCAeACAeABABgded-f#-g-dedededbGvbdbGvbgecegecefdbdfdbdecdefgABCgegCgegCAf#ACAf#ABABgd-f#-g-ggAB", 0.1 ).getAudio();
  Music.tunes[2] = new Audio( "FairyQueen.wav" );

  /* Pictures at an Exhibition */
  /*
  Music.tunes[3] = Music.sequence( 0.2,   "g-f-A#-CFD-CFD-A#-C-g-f-g-f-A#-CFD-CFD-A#-C-g-f-"
                                     + "f-g-d-fgc-gAf-F-D-CA#f-f-g-d-fgd#-A#Cg#-G#-F-D#C#g#-"
                                     + "g#-A#-g#-A#CD#A#g#-C#D#FG#F#FD#F#FC#D#-g#-A#-g#-A#CD#A#C-D-C-DFGDC-"
                                     + "FGa^c^a#^a^Ga#^a^FG-a^EF-a^-D-a^-D-FCD-F-D-FCD-C-A-A#-C-A-A#D"
                                     + "C-A-C-F-D#DCA#C-D-F-Ga#^F-G-F-D#DCA#C-D-F-Ga#^F-G-F-g-f-"
                                     + "Ga#^F-G-F-g-f-A#-CFD-CFD-A#-C-g-f-g-f-A#-CFD-A#-D#-C-A#-", 0.1 ).getAudio();
  */
  Music.tunes[3] = new Audio( "PicturesAtAnExhibition.wav" );
}

//setTimeout( "Music.cache();", 1000 );
