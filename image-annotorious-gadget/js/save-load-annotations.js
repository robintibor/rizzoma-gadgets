(function() {
  var imageAnnotationGadget,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  imageAnnotationGadget = window.imageAnnotationGadget || {};

  window.imageAnnotationGadget = imageAnnotationGadget;

  jQuery(document).ready(function($) {
    var addNewAnnotations, createOrUpdateTextDivBelowAnnotation, createPermanentTextBelowAnnotationOnCreate, createTextDivBelowAnnotation, getAnnotationTextPosition, getExistingAnnotations, getTextDivOfAnnotation, removeAnnotationTextDiv, removeAnnotationTextsOnRemove, removeAnnotationWithText, removeMissingAnnotations, saveAnnotationsOnChange, saveAnnotationsToWave, saveViewerOfAnnotation, saveViewerOfAnnotationOnCreate;
    imageAnnotationGadget.annotableImageExists = function() {
      return $('.annotorious-annotationlayer').length > 0;
    };
    imageAnnotationGadget.addOrRemoveAnnotationsInPicture = function(annotationsFromWave) {
      removeMissingAnnotations(annotationsFromWave);
      return addNewAnnotations(annotationsFromWave);
    };
    removeMissingAnnotations = function(annotationsFromWave) {
      var annotation, annotationWaveStrings, existingAnnotations, _i, _len, _ref, _results;
      existingAnnotations = anno.getAnnotations();
      annotationWaveStrings = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = annotationsFromWave.length; _i < _len; _i++) {
          annotation = annotationsFromWave[_i];
          _results.push(JSON.stringify(annotation));
        }
        return _results;
      })();
      _results = [];
      for (_i = 0, _len = existingAnnotations.length; _i < _len; _i++) {
        annotation = existingAnnotations[_i];
        if ((annotation != null) && (_ref = JSON.stringify(annotation), __indexOf.call(annotationWaveStrings, _ref) < 0)) {
          _results.push(removeAnnotationWithText(annotation));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    removeAnnotationWithText = function(annotation) {
      anno.removeAnnotation(annotation);
      return removeAnnotationTextDiv(annotation);
    };
    addNewAnnotations = function(annotationsFromWave) {
      var annotation, existingAnnotationStrings, existingAnnotations, _i, _len, _ref, _results;
      existingAnnotations = anno.getAnnotations();
      existingAnnotationStrings = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = existingAnnotations.length; _i < _len; _i++) {
          annotation = existingAnnotations[_i];
          _results.push(JSON.stringify(annotation));
        }
        return _results;
      })();
      _results = [];
      for (_i = 0, _len = annotationsFromWave.length; _i < _len; _i++) {
        annotation = annotationsFromWave[_i];
        if (_ref = JSON.stringify(annotation), __indexOf.call(existingAnnotationStrings, _ref) < 0) {
          _results.push(imageAnnotationGadget.addAnnotationWithText(annotation));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    imageAnnotationGadget.addAnnotationWithText = function(annotation) {
      anno.addAnnotation(annotation);
      return createTextDivBelowAnnotation(annotation);
    };
    saveAnnotationsOnChange = function() {
      anno.addHandler('onAnnotationCreated', saveAnnotationsToWave);
      return anno.addHandler('onAnnotationRemoved', function() {
        return setTimeout(saveAnnotationsToWave, 0);
      });
    };
    saveAnnotationsToWave = function() {
      var annotations;
      annotations = getExistingAnnotations();
      return imageAnnotationGadget.wave.saveAnnotations(annotations);
    };
    getExistingAnnotations = function() {
      var annotation, cleanExistingAnnotations, existingAnnotations;
      existingAnnotations = anno.getAnnotations();
      cleanExistingAnnotations = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = existingAnnotations.length; _i < _len; _i++) {
          annotation = existingAnnotations[_i];
          if (annotation != null) {
            _results.push(annotation);
          }
        }
        return _results;
      })();
      return cleanExistingAnnotations;
    };
    saveViewerOfAnnotationOnCreate = function() {
      return anno.addHandler('onAnnotationCreated', saveViewerOfAnnotation);
    };
    saveViewerOfAnnotation = function(annotation) {
      var viewer;
      viewer = wave.getViewer();
      annotation.viewer = {
        displayName: viewer.getDisplayName(),
        thumbnailUrl: viewer.getThumbnailUrl()
      };
      return console.log("added viewer to", annotation);
    };
    createPermanentTextBelowAnnotationOnCreate = function() {
      return anno.addHandler('onAnnotationCreated', createOrUpdateTextDivBelowAnnotation);
    };
    createOrUpdateTextDivBelowAnnotation = function(annotation) {
      var annotationTextDiv;
      annotationTextDiv = getTextDivOfAnnotation(annotation);
      if ((annotationTextDiv != null)) {
        return annotationTextDiv.text(annotation.text);
      } else {
        return createTextDivBelowAnnotation(annotation);
      }
    };
    createTextDivBelowAnnotation = function(annotation) {
      var position, textDiv;
      position = getAnnotationTextPosition(annotation);
      textDiv = $("<div class='annotationTextDiv'>" + annotation.text + "</div>");
      textDiv.css('position', 'absolute');
      textDiv.css('top', position.top);
      textDiv.css('left', position.left);
      return textDiv.insertBefore('.annotorious-editor');
    };
    getAnnotationTextPosition = function(annotation) {
      var annotationLeft, annotationTop, imageHeight, imageWidth, shapeHeight;
      imageWidth = $('.annotorious-annotationlayer').width();
      imageHeight = $('.annotorious-annotationlayer').height();
      shapeHeight = annotation.shapes[0].geometry.height * imageHeight;
      annotationLeft = annotation.shapes[0].geometry.x * imageWidth;
      annotationTop = annotation.shapes[0].geometry.y * imageHeight + shapeHeight;
      return {
        top: annotationTop,
        left: annotationLeft
      };
    };
    removeAnnotationTextsOnRemove = function() {
      return anno.addHandler('onAnnotationRemoved', removeAnnotationTextDiv);
    };
    removeAnnotationTextDiv = function(annotation) {
      var textDiv;
      textDiv = getTextDivOfAnnotation(annotation);
      return textDiv.remove();
    };
    getTextDivOfAnnotation = function(annotation) {
      var positionOfTextDiv, textDiv, textDivs, _i, _len;
      textDivs = $('.annotationTextDiv');
      positionOfTextDiv = getAnnotationTextPosition(annotation);
      for (_i = 0, _len = textDivs.length; _i < _len; _i++) {
        textDiv = textDivs[_i];
        textDiv = $(textDiv);
        if (textDiv.position().top === Math.round(positionOfTextDiv.top) && textDiv.position().left === Math.round(positionOfTextDiv.left)) {
          return $(textDiv);
        }
      }
    };
    saveViewerOfAnnotationOnCreate();
    createPermanentTextBelowAnnotationOnCreate();
    removeAnnotationTextsOnRemove();
    return saveAnnotationsOnChange();
  });

}).call(this);
