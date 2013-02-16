(function() {

  jQuery(document).ready(function($) {
    var imageSizeHasChanged, makeEditorVisibleOnBoundariesOfImage, makeImageResizable, makeImageResizableOnLoad, redrawAnnotations, removeAnnotationTextDivs, resizeAnnotoriousLayers, saveNewImageSizeToWave, setElementsToSize, setImageSize;
    window.loadImageSizeFromWave = function() {
      var imageSize, imageSizeString;
      imageSizeString = wave.getState().get("imageSize");
      if ((imageSizeString != null)) {
        imageSize = JSON.parse(imageSizeString);
        if (window.imageLoaded()) {
          return window.setImageSizeAndRedrawAnnotations(imageSize);
        } else {
          return setImageSize(imageSize);
        }
      }
    };
    window.setImageSizeAndRedrawAnnotations = function(newImageSize) {
      if (imageSizeHasChanged(newImageSize)) {
        setImageSize(newImageSize);
        return window.redrawAnnotationsForNewSize(newImageSize);
      }
    };
    imageSizeHasChanged = function(newImageSize) {
      var image;
      image = $('#imageToAnnotate');
      return image.width() !== newImageSize.width || image.height() !== newImageSize.height;
    };
    setImageSize = function(imageSize) {
      var imageAndResizableWrapper;
      imageAndResizableWrapper = $('#imageToAnnotate, .ui-wrapper');
      return setElementsToSize(imageAndResizableWrapper, imageSize);
    };
    makeImageResizableOnLoad = function() {
      return $('#imageToAnnotate').load(makeImageResizable);
    };
    makeImageResizable = function() {
      $('#imageToAnnotate').resizable({
        resize: function(event, ui) {
          return window.redrawAnnotationsForNewSize(ui.size);
        },
        stop: function(event, ui) {
          return saveNewImageSizeToWave(ui.size);
        }
      });
      return makeEditorVisibleOnBoundariesOfImage();
    };
    window.redrawAnnotationsForNewSize = function(size) {
      resizeAnnotoriousLayers(size);
      return redrawAnnotations();
    };
    resizeAnnotoriousLayers = function(newSize) {
      var annotoriousElementsToResize;
      annotoriousElementsToResize = $('.annotorious-annotationlayer, \
    canvas.annotorious-opacity-fade');
      return setElementsToSize(annotoriousElementsToResize, newSize);
    };
    setElementsToSize = function(elements, size) {
      var element, _i, _len, _results;
      elements.width(size.width);
      elements.height(size.height);
      _results = [];
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        element = elements[_i];
        if (element.width != null) {
          element.width = size.width;
        }
        if (element.height != null) {
          _results.push(element.height = size.height);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    redrawAnnotations = function() {
      var annotation, oldAnnotations, _i, _len, _results;
      oldAnnotations = anno.getAnnotations();
      removeAnnotationTextDivs();
      _results = [];
      for (_i = 0, _len = oldAnnotations.length; _i < _len; _i++) {
        annotation = oldAnnotations[_i];
        if (annotation != null) {
          anno.removeAnnotation(annotation);
          _results.push(window.addAnnotationWithText(annotation));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    removeAnnotationTextDivs = function() {
      return $('.annotationTextDiv').remove();
    };
    makeEditorVisibleOnBoundariesOfImage = function() {
      return $('.ui-wrapper').css('overflow', '');
    };
    saveNewImageSizeToWave = function(newSize) {
      console.log("newsize is", newSize);
      return wave.getState().submitValue("imageSize", JSON.stringify(newSize));
    };
    return makeImageResizableOnLoad();
  });

}).call(this);
