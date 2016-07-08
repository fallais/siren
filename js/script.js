/* --------------------------------------------------------------------------- */
/* -------------------------------- Variables -------------------------------- */
/* --------------------------------------------------------------------------- */

var ctx = new window.AudioContext();
var osc, lfo, oscGain, lfoGain;
var sirenPlaying = false;
var tuna = new Tuna(ctx);
var delay = new tuna.Delay({
  feedback: 0.55,    //0 to 1+
  delayTime: 150,    //how many milliseconds should the wet signal be delayed?
  wetLevel: 0.3,    //0 to 1+
  dryLevel: 1,       //0 to 1+
  cutoff: 2000,      //cutoff frequency of the built in lowpass-filter. 20 to 22050
  bypass: 0
});
  
/* --------------------------------------------------------------------------- */
/* ----------------------------------- Main ---------------------------------- */
/* --------------------------------------------------------------------------- */

$(document).ready(function() {
  // Init
  init();
  

  
  // Button listener
  $("#play").mouseup(function() {
    stop();
  }).mousedown(function() {
    play();
  });
  
  $("#mute").click(function() {
    stop();
  });
  
  // Spacebar listener
  $(window).keydown(function (e) {
    if (e.keyCode === 32) {
      play();
    }
  });
  $(window).keyup(function (e) {
    if (e.keyCode === 32) {
      stop();
    }
  });
});

/* --------------------------------------------------------------------------- */
/* -------------------------------- Functions -------------------------------- */
/* --------------------------------------------------------------------------- */

// init()
function init() {
  // Init the Siren knobs
  $("#siren_mode").khantrolKnob({
		minVal: 1,
		maxVal: 4,
		scale: 1,
    speed: 0.1
	});
  $("#siren_tone").khantrolKnob({
		minVal: 40,
		maxVal: 1400,
		scale: 10,
	});
  $("#siren_speed").khantrolKnob({
		minVal: 0.1,
		maxVal: 12,
		scale: 0.1,
	});
  
  // Init the Delay knobs
  $("#delay_time").khantrolKnob();
  $("#delay_mix").khantrolKnob();
  $("#delay_feedback").khantrolKnob();

  // Init the EQ knobs
  $("#high").khantrolKnob();
  $("#medium").khantrolKnob();
  $("#low").khantrolKnob();
  
  $('#siren_led').removeClass('text-success').addClass('text-danger');
}

// play()
function play() {
  if (sirenPlaying) {
    return;
  }
  sirenPlaying = true;
  
  $('#siren_led').removeClass('text-danger').addClass('text-success');

  // Create the oscillator
  osc = ctx.createOscillator();
  oscGain = ctx.createGain();
  oscGain.gain.value=0.2;
  
  // Create the LFO
  lfo = ctx.createOscillator();
  lfoGain = ctx.createGain();
  lfoGain.gain.value = 200;
 
  // Get the values
  osc.frequency.value = $("#siren_tone").val()
  lfo.frequency.value = $("#siren_speed").val()

  // Connect 
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);
  osc.connect(oscGain);
  oscGain.connect(delay);
  delay.connect(ctx.destination);

  osc.start(0);
  lfo.start(0);
}

// stop()
function stop() {
  if (!sirenPlaying) {
    return;
  }
  sirenPlaying = false;
  
  $('#siren_led').removeClass('text-success').addClass('text-danger');
  
  oscGain.disconnect(oscGain);
  lfoGain.disconnect(lfoGain);
  lfo.disconnect(osc.frequency);
  
  osc.stop();
  lfo.stop();
}
