$(function(){
  Audio.init();
  Visualizer.init(visualizer_properties);

  $('#my-gui-container').on('click', function(e) {
    Visualizer.sceneRender();
  });
});
