(function() {
  var imageAnnotationGadget;

  imageAnnotationGadget = window.imageAnnotationGadget || {};

  window.imageAnnotationGadget = imageAnnotationGadget;

  jQuery(document).ready(function($) {
    var checkboxIsChecked, createToggleButton, hideAnnotations, hideOrShowAnnotations, hideOrShowAnnotationsOnClick, showAnnotations;
    createToggleButton = function() {
      return $("#toggleAnnotationsCheckBox").button();
    };
    hideOrShowAnnotationsOnClick = function() {
      return $("#toggleAnnotationsCheckBox").click(hideOrShowAnnotations);
    };
    hideOrShowAnnotations = function() {
      if (checkboxIsChecked()) {
        return showAnnotations();
      } else {
        return hideAnnotations();
      }
    };
    checkboxIsChecked = function() {
      return $('#toggleAnnotationsCheckBox').is(':checked');
    };
    showAnnotations = function() {
      return $('.annotationTextDiv').show();
    };
    hideAnnotations = function() {
      return $('.annotationTextDiv').hide();
    };
    imageAnnotationGadget.showAnnotationsButton = function() {
      return $("#toggleAnnotationsLabel").css('display', 'inline-block');
    };
    createToggleButton();
    return hideOrShowAnnotationsOnClick();
  });

}).call(this);
