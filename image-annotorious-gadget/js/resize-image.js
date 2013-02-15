(function() {

  jQuery(document).ready(function($) {
    var makeEditorVisibleOnBoundariesOfImage, makeImageResizable, makeImageResizableOnLoad, redrawAnnotations, removeAnnotationTextDivs, resizeAnnotoriousLayers, setToSize;
    makeImageResizableOnLoad = function() {
      return $('#imageToAnnotate').load(makeImageResizable);
    };
    makeImageResizable = function() {
      $('#imageToAnnotate').resizable({
        resize: function(event, ui) {
          return window.redrawAnnotationsForNewSize(ui.size);
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
      return setToSize(annotoriousElementsToResize, newSize);
    };
    setToSize = function(elements, size) {
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
          element.height = size.height;
        }
        _results.push(console.log(element));
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
    return makeImageResizableOnLoad();
  });

}).call(this);
