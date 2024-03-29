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

var g_imageCatalogueClass;


/* This singleton class is responsible for loading all of the images used by the system */
function ImageCatalogue( onloadCallback ) {
  g_imageCatalogueClass = this;

  /* Start loading images asynchronously */
  this.loadImages = 
    function loadImages() {
      this.imagesRemaining = 8;

      this.icons             = new Image();
      this.icons.onload      = this.onLoad;
      this.icons.onerror     = this.onError;
      this.icons.src         = "tiles.png";

      this.stars             = new Image();
      this.stars.onload      = this.onLoad;
      this.stars.onerror     = this.onError;
      this.stars.src         = "stars.png";

      this.banner            = new Image();
      this.banner.onload     = this.onLoad;
      this.banner.onerror    = this.onError;
      this.banner.src        = "banner.png";

      this.titlePage         = new Image();
      this.titlePage.onload  = this.onLoad;
      this.titlePage.onerror = this.onError;
      this.titlePage.src     = "title.png";

      this.levelComplete         = new Image();
      this.levelComplete.onload  = this.onLoad;
      this.levelComplete.onerror = this.onError;
      this.levelComplete.src     = "levelComplete.png";

      this.back              = new Image();
      this.back.onload       = this.onLoad;
      this.back.onerror      = this.onError;
      this.back.src          = "back.png";

      this.options           = new Image();
      this.options.onload    = this.onLoad;
      this.options.onerror   = this.onError;
      this.options.src       = "options.png";

      this.editor         = new Image();
      this.editor.onload  = this.onLoad;
      this.editor.onerror = this.onError;
      this.editor.src     = "editor.png";
  };

  /* Called on the successful load of an image.  When all images are loaded,
   * this invokes the callback specified in the constructor.
   */
  this.onLoad =
    function onLoad() {
      if ( --g_imageCatalogueClass.imagesRemaining == 0 ) {
        g_imageCatalogueClass.onloadCallback();
      }
  };

  /* Failed to load an image */
  this.onError = 
    function onError() {
      alert( "Error loading image resource." );
    };

  this.onloadCallback = onloadCallback;
  this.loadImages();
}

/* Initialise method (sets up the globals) */
ImageCatalogue.initialise = 
  function initialise( onloadCallback ) {
    new ImageCatalogue( onloadCallback );
};

/* Retrieve in-game icons */
ImageCatalogue.getIconsImage =
  function getIconsImage() {
    return g_imageCatalogueClass.icons;
  };

/* Retrieve stars */
ImageCatalogue.getBannerImage =
  function getBannerImage() {
    return g_imageCatalogueClass.banner;
  };

/* Retrieve stars */
ImageCatalogue.getStarsImage =
  function getStarsIMage() {
    return g_imageCatalogueClass.stars;
  };

/* Retrieve title page */
ImageCatalogue.getTitlePageImage =
  function getIcons() {
    return g_imageCatalogueClass.titlePage;
  };

/* Image for for level complete page */
ImageCatalogue.getLevelCompleteImage =
  function getLevelCompleteImage() {
    return g_imageCatalogueClass.levelComplete;
  };

/* Image for back button */
ImageCatalogue.getBackImage =
  function getBackImage() {
    return g_imageCatalogueClass.back;
  };

/* Image for option button */
ImageCatalogue.getOptionsImage =
  function getOptionsImage() {
    return g_imageCatalogueClass.options;
  };

/* Image for editor button */
ImageCatalogue.getEditorImage =
  function getEditorImage() {
    return g_imageCatalogueClass.editor;
  };
