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
  
  // Delay
  var delay = new tuna.Delay({
    feedback: 0.55,    //0 to 1+
    delayTime: 150,    //how many milliseconds should the wet signal be delayed?
    wetLevel: 0.3,    //0 to 1+
    dryLevel: 1,       //0 to 1+
    cutoff: 2000,      //cutoff frequency of the built in lowpass-filter. 20 to 22050
    bypass: 0
  });
  
  // Equalizer
  var lowFilter = new tuna.Filter({
    frequency: 120, //20 to 22050
    Q: 1, //0.001 to 100
    gain: 0, //-40 to 40
    filterType: "bandpass", //lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass
    bypass: 0
  });
  var mediumFilter = new tuna.Filter({
    frequency: 3000, //20 to 22050
    Q: 1, //0.001 to 100
    gain: 0, //-40 to 40
    filterType: "bandpass", //lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass
    bypass: 0
  });
  var highFilter = new tuna.Filter({
    frequency: 8000, //20 to 22050
    Q: 1, //0.001 to 100
    gain: 0, //-40 to 40
    filterType: "bandpass", //lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass
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
      width: 70,
      height: 70,
      min: 0.1,
      max: 12,
      step: 0.1,
      bgColor: '#AA0000',
      fgColor: '#F00',
      displayInput: false
    }
  };
  
  // Siren (Tone)
  $scope.siren_tone = {
    value: 600,
    options: {
      width: 70,
      height: 70,
      min: 40,
      max: 1400,
      step: 10,
      bgColor: '#0000AA',
      fgColor: '#00F',
      displayInput: false
    }
  };
  
  // Delay (Time)
  $scope.delay_time = {
    value: 120,
    options: {
      width: 70,
      height: 70,
      min: 1,
      max: 170,
      step: 10,
      bgColor: '#A67E18',
      fgColor: '#FFB700',
      displayInput: false
    }
  };
  
  // Delay (Feedback)
  $scope.delay_feedback = {
    value: 0.4,
    options: {
      width: 70,
      height: 70,
      min: 0.1,
      max: 1,
      step: 0.1,
      bgColor: '#00AA00',
      fgColor: '#0F0',
      displayInput: false
    }
  };
  
  // Delay (Mix)
  $scope.delay_mix = {
    value: 0.2,
    options: {
      width: 70,
      height: 70,
      min: 0.1,
      max: 1,
      step: 0.1,
      bgColor: '#FC91EF',
      fgColor: '#F21AD9',
      displayInput: false
    }
  };
  
  // Equalizer (High)
  $scope.eq_high = {
    value: 0.2,
    options: {
      width: 70,
      height: 70,
      min: 0.1,
      max: 1,
      step: 0.1,
      bgColor: '#FC91EF',
      fgColor: '#F21AD9',
      displayInput: false
    }
  };
  
  // Equalizer (Medium)
  $scope.eq_medium = {
    value: 0.2,
    options: {
      width: 70,
      height: 70,
      min: 0.1,
      max: 1,
      step: 0.1,
      bgColor: '#FC91EF',
      fgColor: '#F21AD9',
      displayInput: false
    }
  };
  
  // Equalizer (Low)
  $scope.eq_low = {
    value: 0.2,
    options: {
      width: 70,
      height: 70,
      min: 0.1,
      max: 1,
      step: 0.1,
      bgColor: '#FC91EF',
      fgColor: '#F21AD9',
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
    osc.frequency.value = $("#siren_tone").val();
    lfo.frequency.value = $scope.siren_speed.value;
    delay.feedback = $scope.delay_feedback.value;
    delay.delayTime = $scope.delay_time.value;
    delay.wetLevel = $scope.delay_mix.value;

    // Connect 
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    osc.connect(oscGain);
    if($scope.delay){
      oscGain.connect(delay);
      delay.connect(ctx.destination);
    } else {
      oscGain.connect(ctx.destination);
    }
    

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
// Directive
//------------------------------------------------------------------------------

app.directive('tooltip', function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            $(element).hover(function(){
                // on mouseenter
                $(element).tooltip('show');
            }, function(){
                // on mouseleave
                $(element).tooltip('hide');
            });
        }
    };
});

//------------------------------------------------------------------------------
// Run
//------------------------------------------------------------------------------

app.run(['$rootScope', function ($rootScope) {  
  //
}]);