const audio_analysis = require('audio-analysis/6Ggtd1UBsm8GzMdDeEZOvO.json');

var x,
    position_in_segments = 0,
    loudness,
    this_time = 0;

function loadFirstBeat () {
  loudness = audio_analysis.segments[0].loudness_start;
  position_in_segments++;
}

function beatPlayed() {
  //load next beat
  loudness = audio_analysis.segments[position_in_segments].loudness_start;
  position_in_segments++;
}

function updateObject() {
  //at time interval of this_time, this function is called
  //load x with new loudness exactly at that time.


  beatPlayed();
}

//insert this into the threejs objects

this_value = 0.489
