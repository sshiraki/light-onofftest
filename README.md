# light-onofftest (Client)

This application is test of light on - off client app for node.js　of raspberry pi.

## 概要

raspberry pi をクライアント、firebaseをWebサーバーとして動作する。
firestoreで状態管理することを前提とした、通知を音と点滅ライトで通知する装置。
 - Web画面のオン、オフボタン、タイマー設定ボタンで、firestoreに状態を設定する。
 - クライアントはfirestoreの設定を監視し、オンであれば5秒間ライトを点滅させると同時に音を鳴らす。
 - オフであれば直ちに光を消す。
 - オンタイマーを設定し、チェックボックスにチェックがあればその時刻に点灯する。
 - オフタイマーを設定し、チェックボックスにチェックがあればその時刻に消灯する。

## Getting Started
### Client

 - Install node.js
 - npm install --save firebase
 - npm install firebase-admin
 - npm install onoff
 - npm install node-wav-player
 - git clone https://github.com/sshiraki/light-onofftest.git
 - <firebase config> -> ./credentials/serviceAccount.json
 - node lightswitch.js

### Server

 - Install node.js
 - npm install -g firebase-tools
 - create firestore database
   collection
     test
       light
         value <<boolean>>
         timestamp <<timestamp>>
       timer
         on
           enabled <<boolean>>
           time <<string>>
         off
           enabled <<boolean>>
           time <<string>>
         timestamp <<timestamp>>
 - git clone https://github.com/sshiraki/light-onofftest_fb.git
 - edit index.html -> var config = <firebase config>
 - firebase deploy

## Update 
 
 - realtime db -> firestore
 - add sound
 
## サウンド
ニコニコモンズ
 - ドアチャイム
   https://commons.nicovideo.jp/material/nc227217
