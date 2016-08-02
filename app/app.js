'use strict';

var app = angular.module('sirenApp', ['ui.knob', 'ui.toggle']);

//------------------------------------------------------------------------------
// Contollers
//------------------------------------------------------------------------------

// MainController
app.controller('MainController', ['$scope', function($scope) { 
  // AudioContext
  var contextClass = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext || window.msAudioContext);
  if (contextClass) {
    var ctx = new contextClass();
  } else {
    alert("AudioContext is not available");
  }
  
  // Sound variables
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
    value: 700,
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
    value: 0.5,
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
  
  // Volume
  $scope.siren_volume = {
    value: 0.2,
    options: {
      width: 38,
      height: 38,
      min: 0.1,
      max: 1,
      step: 0.1,
      bgColor: '#AA0000',
      fgColor: '#F00',
      displayInput: false
    }
  };
  
  // Play()
  $scope.play = function (e) {
    if ($scope.sirenPlaying) {
      return;
    }
    
    // Set the siren as playing
    $scope.sirenPlaying = true;

    // Create the oscillator
    osc = ctx.createOscillator();
    osc.type = 'square';
    oscGain = ctx.createGain();
    
    // Create the LFO
    lfo = ctx.createOscillator();
    lfo.type = $scope.mode;
    lfoGain = ctx.createGain();
    lfoGain.gain.value = 200;
   
    // Get the values
    oscGain.gain.value = $scope.siren_volume.value;
    osc.frequency.value = $scope.siren_tone.value;
    lfo.frequency.value = $scope.siren_speed.value;
    delay.feedback = $scope.delay_feedback.value;
    delay.delayTime = $scope.delay_time.value;
    delay.wetLevel = $scope.delay_mix.value;
    
    // Watch for updates
    $scope.$watch("siren_speed.value", function(newValue, oldValue) {
      lfo.frequency.value = newValue;
    });
    $scope.$watch("siren_tone.value", function(newValue, oldValue) {
      osc.frequency.value = newValue;
    });

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

    // Start the LFO and the main oscilator
    osc.start(0);
    lfo.start(0);
  };
  
  // Stop()
  $scope.stop = function (e) {
    if (!$scope.sirenPlaying) {
      return;
    }
    
    // Set the siren as not playing
    $scope.sirenPlaying = false;
       
    // Disconnect all sources
    oscGain.disconnect();
    lfoGain.disconnect();
    lfo.disconnect();
    
    // Stop all oscilators
    osc.stop();
    lfo.stop();
  };
  
  // StopKey
  $scope.stopKey = function (e){
    if (e.keyCode === 32) {
      $scope.stop();
    }
  };
  
  // PlayKey
  $scope.playKey = function (e){
    if (e.keyCode === 32) {
      $scope.play();
    }
  };
  
  // EnableDelay()
  $scope.enableDelay = function (e) {
    $scope.delay = !$scope.delay;
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
        $(element).tooltip('show');
      }, function(){
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