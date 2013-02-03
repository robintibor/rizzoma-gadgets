(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  jQuery(document).ready(function($) {
    /* annotation part
    */

    var addNewAnnotations, addOrRemoveAnnotationsInPicture, annotableImageExists, getAnnotationsFromState, removeAnnotationFromWave, removeMissingAnnotations, saveAnnotationsOnChange, saveAnnotationsToWave, saveNewAnnotationToWave;
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
      addNewAnnotations(annotationsFromWave);
      return removeMissingAnnotations(annotationsFromWave);
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
          _results.push(anno.addAnnotation(annotation));
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
          _results.push(anno.removeAnnotation(annotation));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    saveAnnotationsOnChange = function() {
      anno.addHandler('onAnnotationCreated', saveNewAnnotationToWave);
      return anno.addHandler('onAnnotationRemoved', removeAnnotationFromWave);
    };
    saveNewAnnotationToWave = function(annotation) {
      var annotations;
      console.log("add annotation!");
      annotations = getAnnotationsFromState() || [];
      if (__indexOf.call(annotations, annotation) < 0) {
        annotations.push(annotation);
      }
      return saveAnnotationsToWave(annotations);
    };
    saveAnnotationsToWave = function(annotations) {
      var annotationsString;
      annotationsString = JSON.stringify(annotations);
      return wave.getState().submitValue("annotations", annotationsString);
    };
    removeAnnotationFromWave = function(annotationToRemove) {
      var annotations, annotationsWithoutRemovedOne;
      console.log("removing annotation!");
      annotations = getAnnotationsFromState();
      annotationsWithoutRemovedOne = annotations.filter(function(oldAnnotation) {
        return JSON.stringify(oldAnnotation) !== JSON.stringify(annotationToRemove);
      });
      return saveAnnotationsToWave(annotationsWithoutRemovedOne);
    };
    return saveAnnotationsOnChange();
  });

}).call(this);
