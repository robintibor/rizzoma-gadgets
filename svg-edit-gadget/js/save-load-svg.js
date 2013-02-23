(function() {
  var getCurrentCanvasSVGString, getWaveSVGString, justSetCanvasString, lastCanvasSVGString, lastWaveSVGString, loadSvgFromWave, saveSVGStringToWave, saveSVGStringToWaveIfChanged, saveSVGToWaveOnChange, setCanvasSVGString, waveAndCanvasDifferent;

  console.log("loading svg from wave file!!! version2");

  lastWaveSVGString = null;

  lastCanvasSVGString = null;

  loadSvgFromWave = function() {
    var canvasSVGString, waveSVGString;
    waveSVGString = getWaveSVGString();
    canvasSVGString = getCurrentCanvasSVGString();
    if (waveAndCanvasDifferent() && lastWaveSVGString !== waveSVGString) {
      console.log("strings different for loading svg from wave");
      setCanvasSVGString(waveSVGString);
      return lastWaveSVGString = waveSVGString;
    }
  };

  getWaveSVGString = function() {
    return wave.getState().get("svgString");
  };

  getCurrentCanvasSVGString = function() {
    return svgCanvas.getSvgString();
  };

  justSetCanvasString = false;

  setCanvasSVGString = function(svgString) {
    console.log("setting canvas svg string");
    svgCanvas.setSvgString(svgString);
    return justSetCanvasString = true;
  };

  saveSVGToWaveOnChange = function() {
    console.log("adding extension rizzoma save!!");
    return svgEditor.addExtension("Rizzoma-Save", function() {
      return {
        elementChanged: saveSVGStringToWaveIfChanged
      };
    });
  };

  saveSVGStringToWaveIfChanged = function() {
    var canvasSVGString, waveSVGString;
    if (justSetCanvasString) {
      console.log("ignoring change because it came from string!:)");
      justSetCanvasString = false;
      return;
    }
    console.log("checking if svg string should be saved to wave!");
    waveSVGString = getWaveSVGString();
    canvasSVGString = svgCanvas.getSvgString();
    if (waveAndCanvasDifferent() && lastCanvasSVGString !== canvasSVGString) {
      console.log("strings different for saving to wave");
      saveSVGStringToWave(canvasSVGString);
      return lastCanvasSVGString = canvasSVGString;
    }
  };

  saveSVGStringToWave = function(svgString) {
    console.log("saving svg string to wave! :) :");
    return wave.getState().submitValue("svgString", svgString);
  };

  waveAndCanvasDifferent = function() {
    return wave.getState().get("svgString") !== svgCanvas.getSvgString();
  };

  wave.setStateCallback(loadSvgFromWave);

  saveSVGToWaveOnChange();

}).call(this);
