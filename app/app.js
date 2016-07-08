'use strict';

var app = angular.module('sirenApp', ['ui.knob', 'ui.toggle']);

//------------------------------------------------------------------------------
// Contollers
//------------------------------------------------------------------------------

// MainController
app.controller('MainController', ['$scope', function($scope) { 
  // Sound variables
  var ctx = new window.AudioContext();
  var osc, lfo, oscGain, lfoGain;
  var sirenPlaying = false;
  var tuna = new Tuna(ctx);
  
  // Effects
  var delay = new tuna.Delay({
    feedback: 0.55,    //0 to 1+
    delayTime: 150,    //how many milliseconds should the wet signal be delayed?
    wetLevel: 0.3,    //0 to 1+
    dryLevel: 1,       //0 to 1+
    cutoff: 2000,      //cutoff frequency of the built in lowpass-filter. 20 to 22050
    bypass: 0
  });
  var lowFilter = new tuna.Filter({
    frequency: 440, //20 to 22050
    Q: 1, //0.001 to 100
    gain: 0, //-40 to 40
    filterType: "lowpass", //lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass
    bypass: 0
  });
  
  // Scope variables
  $scope.sirenPlaying = false;
  $scope.delay = false;
  $scope.equalizer = false;
  
  // Siren (Speed)
  $scope.siren_speed = {
    value: 8,
    options: {
      width: 100,
      height: 100,
      min: 0.1,
      max: 12,
      step: 0.1,
      bgColor: '#F00',
      fgColor: '#AA0000',
      displayInput: false
    }
  };
  
  // Siren (Tone)
  $scope.siren_tone = {
    value: 600,
    options: {
      width: 100,
      height: 100,
      min: 40,
      max: 1400,
      step: 10,
      bgColor: '#00F',
      fgColor: '#0000AA',
      displayInput: false
    }
  };
  
  // Play()
  $scope.play = function (e) {
    if ($scope.sirenPlaying) {
      return;
    }
    $scope.sirenPlaying = true;

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
  };
  
  // Stop()
  $scope.stop = function (e) {
    if (!$scope.sirenPlaying) {
      return;
    }
    $scope.sirenPlaying = false;
       
    oscGain.disconnect(oscGain);
    lfoGain.disconnect(lfoGain);
    lfo.disconnect(osc.frequency);
    
    osc.stop();
    lfo.stop();
  }
  
  // EnableDelay()
  $scope.enableDelay = function (e) {
    $scope.delay = !$scope.delay;
  };
  
  // EnableEqualizer()
  $scope.enableEqualizer = function (e) {
    $scope.equalizer = !$scope.equalizer;
  };
  
}]);

//------------------------------------------------------------------------------
// Run
//------------------------------------------------------------------------------

app.run(['$rootScope', function ($rootScope) {  
  //
}]);