$(function() {
  $('#upload-music').slideToggle("slow");

  $('.multimedia').on('click', function() {
    if (Audio.isPlaying) {
      Audio.pause();
      $('.multimedia').text("▶");
    } else {
      Audio.visualize(Audio.audioContext, Audio.buffer, Audio.startedAt);
      $('.multimedia').html('&#9614;&#9614;');
    }
  });

  $('.close-button').on('click', function() {
    // $('#upload-music').slideToggle(350);
    $('#shrinkDiv').slideToggle(400);
    $('#multimediaNav').toggleClass('show');
  });
  $('#enable-mic').on('click', function () {
    navigator.mediaDevices.getUserMedia({audio:true})
      .then(function(stream) {
        Audio.source = window.URL.createObjectURL(stream);
        console.log('Audio.source', Audio.source);
        Audio.visualize(Audio.audioContext, Audio.source);
      });
  });

});
