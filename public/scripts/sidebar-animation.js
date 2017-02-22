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

  $('#demo').on('click', function() {
    Audio.loadDemo("./public/kick-shock.mp3");
  })
});
