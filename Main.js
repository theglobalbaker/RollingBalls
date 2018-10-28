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

/*
 * This is the currently displayed display (a subclass of CanvasDisplay). 
 */
var g_display;
var g_xOffset = 0;
var g_xZoom   = 1.0;
var g_yOffset = 0;
var g_yZoom   = 1.0;
var g_edit    = false;
/* 
 * The CanvasDisplay is subclassed by the currently displayed g_display.
 */
function CanvasDisplay() {
  this.canvas = document.getElementById( "htmlcanvas" ).getContext( "2d" );

  /* Called periodically for animation.  Return false to disable the tick counter (pause) */ 
  this.tick =
    function tick() {
      return false;
    };

  /* Called when the user clicks on the canvas */
  this.userMouse = function userMouse( buttonDown, x, y ) {};
  this.mouseButtonDown = -1;
  this.mouseButtonMove = 0;
  this.mouseButtonUp   = 1;

  /* Called when the user presses a key */
  this.keyPress  = function keyPress() {};

  /* Touch event */
  this.touchEvent = function touchEvent(type, event) {};


  this.scaleX = function(x) {
    return Math.floor( (x - g_xOffset) * g_xZoom);
  }

  this.scaleY = function(y) {
    return Math.floor( (y - g_yOffset) * g_yZoom);
  }
}


/* The main function is called by the page load event */
function main() {
  /* Load the image catalogue, and notify the start call when ready */ 
  ImageCatalogue.initialise( start );
}


/* The imageCatalogue resources have been loaded - start the game */
function start() {
  /* Attach the event listeners, and start the timer */
  document.addEventListener( "mousemove", mouseMoveEvent, true );
  document.getElementById( "htmlcanvas" ).addEventListener( "mousedown", mouseDownEvent, false );
  document.getElementById( "htmlcanvas" ).addEventListener( "mouseup",   mouseUpEvent, false );
  document.addEventListener( "keydown", keyPressEvent, true );
  document.addEventListener( "touchstart", touchStartEvent, false );
  document.addEventListener( "touchmove", touchMoveEvent, false );
  document.addEventListener( "touchend",   touchEndEvent, false );
  TickTimer.start();

  if ( !document.location.search.startsWith( "?level=" ) ) {
    /* Display the Title Page */
    g_display = new TitlePage();
  } else {
    /* Play a level packed in the URL */
    LevelEditor.unpackLevel( document.location.search.substring( 1 ) );
    g_display = new Display(0);
  }
  onResize();
}


/* Dispatch a mouse click event */
function mouseDownEvent( e ) {
  var x = e.pageX;
  var y = e.pageY;

  if ( g_display != null ) {
      g_display.userMouse( g_display.mouseButtonDown,
                           Math.floor( (x - g_xOffset) * g_xZoom),
                           Math.floor( (y - g_yOffset) * g_yZoom ) );
  }
}
/* Dispatch a mouse click event */
function mouseMoveEvent( e ) {
  var x = e.pageX;
  var y = e.pageY;
  if ( g_display != null ) {
      g_display.userMouse( g_display.mouseButtonMove,
                           Math.floor( (x - g_xOffset) * g_xZoom),
                           Math.floor( (y - g_yOffset) * g_yZoom ) );
  }
}


/* Dispatch a mouse click event */
function mouseUpEvent( e ) {
  var x = e.pageX;
  var y = e.pageY;

  if ( g_display != null ) {
      g_display.userMouse( true,
                           g_display.mouseButtonUp,
                           Math.floor( (x - g_xOffset) * g_xZoom),
                           Math.floor( (y - g_yOffset) * g_yZoom ) );
  }
}

/* Dispatch generic touch event */
function touchEventDispatch( mouseButton, e ) {
  for ( var i = 0; i < e.changedTouches.length; i++ ) {
     var touch =  e.changedTouches[i];
     var parsed = {
        id: touch.identifier,
        x:  Math.floor( (touch.pageX - g_xOffset) * g_xZoom ),
        y:  Math.floor( (touch.pageY - g_yOffset) * g_yZoom )
     };

     g_display.touchEvent( mouseButton, parsed );
  }
}

/* Dispatch touches events */
function touchStartEvent( e ) {
  if ( g_display != null && g_display.touchEvent != null ) {
    touchEventDispatch( g_display.mouseButtonDown, e );
  }

  e.preventDefault();
  return true;
}

/* Dispatch touches events */
function touchMoveEvent( e ) {
  if ( g_display != null && g_display.touchEvent != null ) {
    touchEventDispatch( g_display.mouseButtonMove, e );
  }

  e.preventDefault();
  return true;
}

/* Dispatch touches events */
function touchEndEvent( e ) {
  if ( g_display != null && g_display.touchEvent != null ) {
    touchEventDispatch( g_display.mouseButtonUp, e );
  }

  e.preventDefault();
  return true;
}

/* Dispatch a key press event */
function keyPressEvent( e ) {
  if ( g_display != null && g_display.keyPress != null ) {
    g_display.keyPress( e.keyCode );
  }
} 


/* Handle resize */
function onResize() {
  g_xOffset = document.getElementById( "htmlcanvas" ).offsetLeft;
  g_yOffset = document.getElementById( "htmlcanvas" ).offsetTop;
  g_xZoom   = document.getElementById( "htmlcanvas" ).width  / document.getElementById( "htmlcanvas" ).offsetWidth;
  g_yZoom   = document.getElementById( "htmlcanvas" ).height / document.getElementById( "htmlcanvas" ).offsetHeight;
}

/* Handle resize small is (1008,736) large (1056,800) */
function onResize() {
    var w =  window.innerWidth;
    var h =  window.innerHeight;
    var canvas = document.getElementById( "htmlcanvas" ).getContext( "2d" );

    g_xZoom   = document.getElementById( "htmlcanvas" ).width  / document.getElementById( "htmlcanvas" ).offsetWidth;
    g_yZoom   = document.getElementById( "htmlcanvas" ).height / document.getElementById( "htmlcanvas" ).offsetHeight;

    g_width = document.getElementById( "htmlcanvas" ).width;
    g_height = document.getElementById( "htmlcanvas" ).height;
    document.getElementById( "htmlcanvas" ).width  = g_width;
    document.getElementById( "htmlcanvas" ).height = g_height;
}
