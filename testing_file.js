const audio_analysis = require('./audio-analysis/6Ggtd1UBsm8GzMdDeEZOvO');

var x,
    position_in_segments = 1,
    loudness,
    duration = 0;

function loadFirstBeat () {
  loudness = audio_analysis.segments[0].loudness_start;
}

function playBeat() {
  if (position_in_segments >= audio_analysis.segments.length - 1) {
    return;
  }
  // change value
  x = loudness;
  // load next beat
  loudness = audio_analysis.segments[position_in_segments].loudness_start;
  duration = audio_analysis.segments[position_in_segments].duration;
  duration *= 1000;
  position_in_segments++;
  console.log(duration);
  setTimeout(playBeat, duration);
}

// universe begins, loads loudness for first instance.
loadFirstBeat();
playBeat();
// music started
