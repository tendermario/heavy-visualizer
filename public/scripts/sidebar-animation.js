$(function() {
  $('#upload-music').slideToggle("slow");

  $('#multimedia').on('click', function() {
    if (Audio.isPlaying) {
      Audio.pause();
      $('#multimedia').text("▶");
    } else {
      Audio.visualize(Audio.audioContext, Audio.buffer, Audio.startedAt);
      $('#multimedia').text("⏸");
    }
  });

  $('.close-button').on('click', function() {
    $('#upload-music').slideToggle(350);
    $('#content-primary').toggleClass('shrink-div');
  });
});
