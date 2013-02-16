(function() {
  var onWaveStateChange;

  onWaveStateChange = function() {
    window.loadImageSizeFromWave();
    return window.loadImageFromWave(window.loadAnnotationsFromWave);
  };

  wave.setStateCallback(onWaveStateChange);

}).call(this);
