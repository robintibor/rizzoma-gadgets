(function() {

  jQuery(document).ready(function($) {
    var addAnnotationsToPicture, saveAnnotationsOnChange, saveAnnotationsToWave;
    window.loadAnnotationsFromState = function() {
      var annotations, annotationsString;
      annotationsString = wave.getState().get("annotations");
      annotations = JSON.parse(annotationsString);
      return addAnnotationsToPicture(annotations);
    };
    addAnnotationsToPicture = function(annotations) {
      var annotation, _i, _len;
      console.log("adding annotations", annotations);
      for (_i = 0, _len = annotations.length; _i < _len; _i++) {
        annotation = annotations[_i];
        anno.addAnnotation(annotation);
      }
      return console.log("now annotations", anno.getAnnotations());
    };
    saveAnnotationsOnChange = function() {
      return anno.addHandler('onAnnotationCreated', saveAnnotationsToWave);
    };
    saveAnnotationsToWave = function() {
      var annotation, annotations, annotationsString, annotationsWithoutNull;
      annotations = anno.getAnnotations();
      annotationsWithoutNull = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = annotations.length; _i < _len; _i++) {
          annotation = annotations[_i];
          if (annotation != null) {
            _results.push(annotation);
          }
        }
        return _results;
      })();
      console.log("saving annotations", annotationsWithoutNull);
      annotationsString = JSON.stringify(annotationsWithoutNull);
      return wave.getState().submitValue("annotations", annotationsString);
    };
    return saveAnnotationsOnChange();
  });

}).call(this);
