$(() => {
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
  $('#enable-mic-button').on('click', () => {
    makeMic()
    $('#disable-mic-button').attr('hidden', false)
    $('#enable-mic-button').attr('hidden', true)
  });
  $('#disable-mic-button').on('click', () => {
    disableMic()
    $('#enable-mic-button').attr('hidden', false)
    $('#disable-mic-button').attr('hidden', true)
  });
})
