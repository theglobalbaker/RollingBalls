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


/* This class provides functionality to create and manage sounds programmatically */
function Sample()
{
  /* Sample rate */
  this.sampleRate = 44100;

  /* Channels (1 = mono, 2 = stereo) */
  this.channels = 2;

  /* Sample resolution (8 bit or 16 bit) */
  this.sampleResolution = 16;

  /* Sample (stereo channels are interleaved) */
  this.sample = new Array();

  /* Create sine wave */
  this.setSine = function setSine( samples, frequency ) {
    this.sample = new Array();
    for ( var i = 0; i < samples * this.channels; i++ ) {
	this.sample[ i ] = Math.round( 30000 * Math.sin( ( 2 * Math.PI * i * frequency ) / ( this.sampleRate * this.channels  ) ) );
    }
  }

  /* Create square wave */
  this.setSquare = function setSquare( samples, frequency ) {
    this.sample = new Array();
    for ( var i = 0; i < samples * this.channels; i++ ) {
        var phase = ( ( i * frequency ) % ( this.sampleRate * this.channels ) ) / ( this.sampleRate * this.channels ); 
        if ( phase <  0.5 ) {
          this.sample[ i ] = 30000;
        } else {
          this.sample[ i ] = -30000;
        }
    }
  }

  /* Create triangle wave */
  this.setTriangle = function setTriangle( samples, frequency ) {
    this.sample = new Array();
    for ( var i = 0; i < samples * this.channels; i++ ) {
        var phase = ( ( i * frequency ) % ( this.sampleRate * this.channels ) ) / ( this.sampleRate * this.channels ); 
        if ( phase <  0.5 ) {
          this.sample[ i ] = Math.round( 30000 * ( 1 - 4 * phase ) );
        } else {
          this.sample[ i ] = Math.round( 30000 * ( -3.0 + 4 * phase ) );
        }
    }
  }

  /* Create sawtooth wave */
  this.setSawtooth = function setSawtooth( samples, frequency ) {
    this.sample = new Array();
    for ( var i = 0; i < samples * this.channels; i++ ) {
        var phase = ( ( i * frequency ) % ( this.sampleRate * this.channels ) ) / ( this.sampleRate * this.channels ); 
        this.sample[ i ] = Math.round( 30000 * ( 1.0 - 2 * phase ) );
    }
  }

  /* Apply Sound Envelope -
   *   -  attack (number of samples to maximum volume)
   *   -  decay  (number of samples to sustain volume)
   *   -  sustain (% volume for the bulk of the sound)
   *   -  release (number of samples to 0 volume at end of sample)
   */
  this.applyEnvelope = function applyEnvelope( attack, decay, sustain, release ) {
      attack  *= this.channels;
      decay   *= this.channels;
      release *= this.channels;

      for ( var i = 0; i < attack; i++ ) {
        this.sample[ i ] = Math.round( this.sample[ i ] * i / attack  );
      }
      for ( var i = 0; i < decay; i++ ) {
        var volume = (i/decay) * ( sustain - 1.0 ) + 1.0;
        this.sample[ attack + i ] = Math.round( this.sample[ attack + i ] * volume );
      }
      for ( var i = attack + decay; i < this.sample.length -  release; i++ ) {
        this.sample[ i ] = Math.round( this.sample[ i ] * sustain );
      }
      for ( var i = this.sample.length - release; i < this.sample.length; i++ ) {
	var volume = sustain * (this.sample.length - i) / release;
        this.sample[ i ] = Math.round( this.sample[ i ] * volume );
      }
  }

  /* Set volume 0.0 - 1.0 */
  this.setVolume = function setVolume( volume ) {
    for ( var i = 0; i < this.sample.length; i++ ) {
      this.sample[ i ] = Math.round( volume * this.sample[ i ]  );
    }
  }

  /* Append a sample */
  this.append = function append( sample ) {
    var i = this.sample.length;
    for ( var j = 0; j < sample.sample.length; j++ ) {
      this.sample[ i + j ] = sample.sample[ j ];
    }
  }

  /* Return an Audio class with this sample loaded */ 
  this.getAudio = function getAudio() {
    this.createWavFile();
    return new Audio( "data:audio/wav;base64," + this.toBase64( this.wavFile ) );
  } 

  /* Create a WAV file from this sample */
  this.createWavFile = function createWavFile() {
    var bytesPerSample = this.sampleResolution / 8;

    this.wavFile = new Array();

    this.writeWavFileChar4( "RIFF" );
    this.writeWavFileInt4( 44 + this.sample.length * bytesPerSample - 8 );

    this.writeWavFileChar4( "WAVE" );
    this.writeWavFileChar4( "fmt " );
    this.writeWavFileInt4( 16 );             /* fmt block size */
    this.writeWavFileInt2( 1 );              /* Tag */
    this.writeWavFileInt2( this.channels );
    this.writeWavFileInt4( this.sampleRate );
    this.writeWavFileInt4( this.sampleRate * bytesPerSample * this.channels ); /* Bytes per second */
    this.writeWavFileInt2( this.channels * bytesPerSample );              /* Block size */
    this.writeWavFileInt2( this.sampleResolution );                     /* bits per sample */

    this.writeWavFileChar4( "data" );
    this.writeWavFileInt4( this.sample.length * bytesPerSample );


    for ( i = 0; i < this.sample.length; i++ ) {
      this.writeWavFileInt2( this.sample[ i ] );
    }
  }

  /* Write 4 characters to the WavFile */
  this.writeWavFileChar4 = function writeWavFileChar4( string ) {
    var i = this.wavFile.length;
    this.wavFile[ i++ ] = string.charCodeAt( 0 );
    this.wavFile[ i++ ] = string.charCodeAt( 1 );
    this.wavFile[ i++ ] = string.charCodeAt( 2 );
    this.wavFile[ i++ ] = string.charCodeAt( 3 );
  }

  /* Write a two byte integer to the WavFile */
  this.writeWavFileInt2 = function writeWavFileInt2( integer ) {
    var i = this.wavFile.length;
    this.wavFile[ i++ ] = ( integer >> 0  )  & 0xff;
    this.wavFile[ i++ ] = ( integer >> 8  )  & 0xff;
  }

  /* Write a four byte integer to the WavFile */
  this.writeWavFileInt4 = function writeWavFileInt4( integer ) {
    var i = this.wavFile.length;
    this.wavFile[ i++ ] = ( integer >> 0  )  & 0xff;
    this.wavFile[ i++ ] = ( integer >> 8  )  & 0xff;
    this.wavFile[ i++ ] = ( integer >> 16 )  & 0xff;
    this.wavFile[ i++ ] = ( integer >> 24 )  & 0xff;
  }

  /* Convert bytes to Base64 */
  this.toBase64 = function toBase64( bytes ) {
    var ret = "";
    var base64Lookup = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for ( var i = 0; i < bytes.length; i += 3 ) {
      var b1 = bytes[i];
      var b2 = (i + 1 < bytes.length) ? bytes[i + 1] : 0;
      var b3 = (i + 2 < bytes.length) ? bytes[i + 2] : 0;

      var c1 = (b1 >> 2) & 63;
      var c2 = ((b1 & 3) << 4)  | ((b2 >> 4) & 15);
      var c3 = ((b2 & 15) << 2) | ((b3 >> 6) & 3);
      var c4 = b3 & 63; 

      ret += base64Lookup[c1];
      ret += base64Lookup[c2];
      ret += ( i + 1 < bytes.length ) ? base64Lookup[c3] :  "=";
      ret += ( i + 2 < bytes.length ) ? base64Lookup[c4] :  "=";
    } 
    return ret;
  }
}

Sample.MIDDLEC = 262;
