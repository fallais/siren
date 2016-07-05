/* --------------------------------------------------------------------------- */
/* -------------------------------- Variables -------------------------------- */
/* --------------------------------------------------------------------------- */

var ctx = new window.AudioContext();
var osc = ctx.createOscillator();
var reverb = new SimpleReverb(ctx, {
  seconds: 3,
  decay: 2,
  reverse: 1
});

/* --------------------------------------------------------------------------- */
/* ----------------------------------- Main ---------------------------------- */
/* --------------------------------------------------------------------------- */

$(document).ready(function() {
  // Init
  init();
  
  var playButton = document.getElementById("play");
  playButton.addEventListener("mousedown", play);
  playButton.addEventListener("mouseup", stop);
  
  osc.connect(reverb.input);
  reverb.connect(ctx.destination);
});

/* --------------------------------------------------------------------------- */
/* -------------------------------- Functions -------------------------------- */
/* --------------------------------------------------------------------------- */

// init()
function init() {
  $("#speed").khantrolKnob({
		minVal: 0,
		maxVal: 10,
		scale: 1,
	});
  $("#delay").khantrolKnob();
  $("#feedback").khantrolKnob();
  $("#tone").khantrolKnob();
  $("#rate").khantrolKnob();
  $("#mode").khantrolKnob();
  
  // Init play button
  var playButton = document.getElementById("play");
  playButton.addEventListener("mousedown", play);
  playButton.addEventListener("mouseup", stop);
}

// play()
function play() {
  osc.start(0);
}

// stop()
function stop() {
  osc.stop();
}