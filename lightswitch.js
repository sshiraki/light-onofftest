
var Gpio = require('onoff').Gpio,
led = new Gpio(14, 'out'),
iv;

// LEDをON
// 5秒後点滅LEDをストップさせる。
function ledOn() {
  // 1秒点滅
  iv = setInterval(function(){
    led.writeSync(led.readSync() === 0 ? 1 : 0)
  }, 1000);
  setTimeout(_ => {
    clearInterval(iv); // 点滅LEDをストップ
    led.writeSync(0); // LEDをOFF
    //led.unexport(); // GPIOポートを解放
  }, 10000)
};

// LEDをOFF
// 即座に点滅LEDをストップさせる。
function ledOff() {
  clearInterval(iv); // 点滅LEDをストップ
  led.writeSync(0); // LEDをOFF
  //led.unexport(); // GPIOポートを解放
};

var firebase = require("firebase");
var config = { databaseURL: "https://test-913f7.firebaseio.com" };
firebase.initializeApp(config);

var execSync = require('child_process').execSync;

firebase.database().ref('/light').on('value', function(snapshot) {
  console.log('/light: ' + JSON.stringify(snapshot.val()));
  if (snapshot.val().value) {
    ledOn();
    console.log('light on');
  } else {
    ledOff();
    console.log('light off');
  }
});

var onTimerInfo = {enabled: false};
var offTimerInfo = {enabled: false};

function fireOnTimer() {
  ledOn;
  console.log('fireOnTimer');
  onTimerInfo.timeoutID =
      setTimeout(_ => { fireOnTimer(); },
                 getDiffTimeMiliSec(onTimerInfo.time, new Date()));
}
function fireOffTimer() {
  ledOff;
  console.log('fireOffTimer');
  offTimerInfo.timeoutID =
      setTimeout(_ => { fireOffTimer(); },
                 getDiffTimeMiliSec(offTimerInfo.time, new Date()));
}

function getDiffTimeMiliSec(timeString, nowDate) {
  var time = (parseInt(timeString.substring(0, 2)) * 60 +
              parseInt(timeString.substring(3, 5))) * 60;
  var nowTime = (nowDate.getHours() * 60 + nowDate.getMinutes()) * 60 +
                nowDate.getSeconds();
  if (time > nowTime)
    return (time - nowTime) * 1000;
  return (time + 24 * 60 * 60 - nowTime) * 1000;
}

firebase.database().ref('/timer').on('value', function(snapshot) {
  console.log('/timer: ' + JSON.stringify(snapshot.val()));
  var timer = snapshot.val();
  if (!timer)
    return;
  if (onTimerInfo.enabled) {
    clearTimeout(onTimerInfo.timeoutID);
    onTimerInfo.enabled = false;
  }
  if (offTimerInfo.enabled) {
    clearTimeout(offTimerInfo.timeoutID);
    offTimerInfo.enabled = false;
  }
  if (timer.on && timer.on.enabled && timer.on.time) {
    onTimerInfo.enabled = true;
    onTimerInfo.time = timer.on.time;
    onTimerInfo.timeoutID =
        setTimeout(_ => { fireOnTimer(); },
                   getDiffTimeMiliSec(onTimerInfo.time, new Date()));
  }
  if (timer.off && timer.off.enabled && timer.off.time) {
    offTimerInfo.enabled = true;
    offTimerInfo.time = timer.off.time;
    offTimerInfo.timeoutID =
        setTimeout(_ => { fireOffTimer(); },
                   getDiffTimeMiliSec(offTimerInfo.time, new Date()));
  }
});
