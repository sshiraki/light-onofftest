# light-onofftest

This application is test of light on - off client app for node.js　of raspberry pi.

## 概要

raspberry pi をクライアント、firebaseをWebサーバーとして動作する。
firestoreで状態管理することを前提とした、通知を音と点滅ライトで通知する装置。
・Web画面のオン、オフボタン、タイマー設定ボタンで、firestoreに状態を設定する。
・クライアントはfirestoreの設定を監視し、オンであれば5秒間ライトを点滅させると同時に音を鳴らす。
・オフであれば直ちに光を消す。
・オンタイマーを設定し、チェックボックスにチェックがあればその時刻に点灯する。
・オフタイマーを設定し、チェックボックスにチェックがあればその時刻に消灯する。

## Getting Started

- node install onoff
- node install node-wav-player
- node lightswitch.js

## Update 
 
 - install node.js
 - install firebae
 - git clone(firebase web app)
 
 - firebase deploy
 
