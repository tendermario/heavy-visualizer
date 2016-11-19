# heavy-visualizer

As a user:
  I want to view a visualizer with a song - so I can look good, feel good.
  I want to create my own visualizer using the libraries available - to have a custom experience.
  I want to play songs from Spotify - for ease of use.
  I want to save my visualizers - so I can use it again.

Stretch:
As a user:
  I want to share my visualizers - so my friends can see them.
  I want to be able to browse the list of visualizers.
  I want to be able to log in and view my favourited and created visualizers.
  I want to use different themes to have more customization for visualizers.
  I want a list of good visualizers on the home page.


researching other audio sources where we can take in the audio node and extract the audio information using fft and Web Audio API


//// SYNC DILEMMA - PLAY/PAUSE

play button pressed
check current time (1:01)
check beat that is after +1s that time (1:02) -> 1:02.30
when next 1s elaspes, wait the difference of 0.30s and then play on that beat.

audio and video are now synced.