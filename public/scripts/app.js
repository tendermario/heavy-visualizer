$(function(){
  Audio.init();

  $('#my-gui-container').on('click', function(e) {
    Visualizer.sceneRender();
  });

  // Visuals
  Visualizer.init(visualizer_properties);
});
