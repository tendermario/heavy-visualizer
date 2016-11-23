$(function(){
  // AudioContext.init();

  // SPOTIFY, DEFUNCT
  Spotify.loadFirstBeat();
  Spotify.playBeat();

  $('#my-gui-container').on('click', function(e) {
    Visualizer.sceneRender();
  });

  // Music Preparation
  // _prepareAPI();
  // _addEventListener();

  // Visuals
  Visualizer.init(visualizer_properties);
  Visualizer.animate();

});
