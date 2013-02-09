(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  jQuery(document).ready(function($) {
    var addNewAnnotations, addOrRemoveAnnotationsInPicture, annotableImageExists, createOrUpdateTextDivBelowAnnotation, createPermanentTextBelowAnnotationOnCreate, createTextDivBelowAnnotation, getAnnotationTextPosition, getAnnotationsFromState, getExistingAnnotations, getTextDivOfAnnotation, removeAnnotationFromWave, removeAnnotationTextDiv, removeAnnotationTextsOnRemove, removeMissingAnnotations, saveAnnotationsOnChange, saveAnnotationsToWave, syncAnnotationsWithWave;
    window.loadAnnotationsFromState = function() {
      var annotations;
      annotations = getAnnotationsFromState();
      if ((annotations != null) && annotableImageExists()) {
        return addOrRemoveAnnotationsInPicture(annotations);
      }
    };
    getAnnotationsFromState = function() {
      var annotations, annotationsString;
      annotationsString = wave.getState().get("annotations");
      annotations = JSON.parse(annotationsString);
      return annotations;
    };
    annotableImageExists = function() {
      return $('.annotorious-annotationlayer').length > 0;
    };
    addOrRemoveAnnotationsInPicture = function(annotationsFromWave) {
      removeMissingAnnotations(annotationsFromWave);
      return addNewAnnotations(annotationsFromWave);
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
          anno.addAnnotation(annotation);
          _results.push(createTextDivBelowAnnotation(annotation));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
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
          anno.removeAnnotation(annotation);
          _results.push(removeAnnotationTextDiv(annotation));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    saveAnnotationsOnChange = function() {
      anno.addHandler('onAnnotationCreated', syncAnnotationsWithWave);
      return anno.addHandler('onAnnotationRemoved', removeAnnotationFromWave);
    };
    syncAnnotationsWithWave = function(annotation) {
      var annotations;
      annotations = getExistingAnnotations();
      return saveAnnotationsToWave(annotations);
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
    saveAnnotationsToWave = function(annotations) {
      var annotationsString;
      annotationsString = JSON.stringify(annotations);
      return wave.getState().submitValue("annotations", annotationsString);
    };
    removeAnnotationFromWave = function(annotationToRemove) {
      var annotations, annotationsWithoutRemovedOne;
      console.log("removed annotation wave");
      annotations = getAnnotationsFromState();
      annotationsWithoutRemovedOne = annotations.filter(function(oldAnnotation) {
        return JSON.stringify(oldAnnotation) !== JSON.stringify(annotationToRemove);
      });
      return saveAnnotationsToWave(annotationsWithoutRemovedOne);
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
      console.log("removed annotation text");
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
        console.log("textDivPosition " + (JSON.stringify(textDiv.position())));
        console.log("positionOfTextDiv " + (JSON.stringify(positionOfTextDiv)));
        if (textDiv.position().top === Math.round(positionOfTextDiv.top) && textDiv.position().left === Math.round(positionOfTextDiv.left)) {
          return $(textDiv);
        }
      }
    };
    saveAnnotationsOnChange();
    createPermanentTextBelowAnnotationOnCreate();
    return removeAnnotationTextsOnRemove();
  });

}).call(this);
