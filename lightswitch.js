// setup
//const player = require('play-sound')();
const player = require('node-wav-player');
const admin = require("firebase-admin");
const serviceAccount = require("./credentials/serviceAccount.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});
//firestore.settings({timestampsInSnapshots: true})
const db = admin.firestore();
db.settings({timestampsInSnapshots: true});

var Gpio = require('onoff').Gpio,
led = new Gpio(14, 'out'),
iv;

// LEDをON
// 5秒後点滅LEDをストップさせる。
function ledOn() {
  // 1秒点滅
  iv = setInterval(function(){
    led.writeSync(led.readSync() === 0 ? 1 : 0)
  }, 500);
  setTimeout(_ => {
    clearInterval(iv); // 点滅LEDをストップ
    led.writeSync(0); // LEDをOFF
  //  led.unexport(); // GPIOポートを解放
  }, 5000)
};

// LEDをOFF
// 即座に点滅LEDをストップさせる。
function ledOff() {
  clearInterval(iv); // 点滅LEDをストップ
  led.writeSync(0); // LEDをOFF
  //led.unexport(); // GPIOポートを解放
};

// サウンド再生
//function playSound(path) {
//  return new Promise((resolve, reject) => {
//    player.play({path: path}).then(() => {
//      resolve();
//    }).catch((error) => {
//      console.error(error);
//      reject(error);
//    });
//  });
//}


//wavファイル再生関数定義
const play = async (sound) => {
  await player.play({
    path: `${sound}`,
    sync: true
  }).then(() => {
    console.log(`played ${sound}`);
  }).catch((error) => {
    console.log('sound error!!');
    console.error(error);
  });
}

db.collection('test').doc('light').onSnapshot(snapshot => {
  // JSONを文字列に変換
  console.log('/test/value: ' + JSON.stringify(snapshot.data()));

  if (snapshot.data().value) {
    ledOn();
    play('./sounds/nc227217.wav');
    //player.play('./sounds/nc131801.wav', err => {
    //  if (err) throw err
    //  console.log('sound error!!');
    //});
    //playSound('./sounds/nc131801.wav');
    console.log('light on');
  } else {
    ledOff();
    console.log('light off');
  }
}, error => {
  console.log("Error getting document:", error);
});

var onTimerInfo = {enabled: false};
var offTimerInfo = {enabled: false};

function fireOnTimer() {
  ledOn;
  console.log('fireOnTimer');
  onTimerInfo.timeoutID =
    setTimeout(_ => { fireOnTimer(); },
      getDiffTimeMiliSec(onTimerInfo.time, new Date())
    );
}
function fireOffTimer() {
  ledOff;
  console.log('fireOffTimer');
  offTimerInfo.timeoutID =
    setTimeout(_ => { fireOffTimer(); },
      getDiffTimeMiliSec(offTimerInfo.time, new Date())
    );
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

db.collection('test').doc('timer').onSnapshot((snapshot) => {
  // JSONを文字列に変換
  console.log('/test/timer: ' + JSON.stringify(snapshot.data()));
  var timer = snapshot.data();
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
  console.log('timer.on.time: ' + JSON.stringify(timer.on.time));
  console.log('timer.off.time: ' + JSON.stringify(timer.off.time));
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
