# EIM モバイルアプリ ツールキット

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Build Status](https://travis-ci.org/rits-ebihara/meimy.svg?branch=master)](https://travis-ci.org/rits-ebihara/meimy)
[![Coverage Status](https://coveralls.io/repos/github/rits-ebihara/meimy/badge.svg)](https://coveralls.io/github/rits-ebihara/meimy)
[![FOSSA Status](https://bit.ly/2QPIhLJ)](https://app.fossa.com/projects/git%2Bgithub.com%2Frits-ebihara%2Fmeimy?ref=badge_shield)

## これはなに？

リコーITソリューションズ が提供する PaaS サービス 'EIM' のモバイルアプリケーションを、効率よく開発するためのツールキットです。

## 特徴

* [react-native](https://github.com/facebook/react-native) を利用した、Android/iOS ハイブリッド開発ができます。
* EIM 認証機能をコーディングレスで利用できます。UIも用意されています。
* 文書の一覧、ユーザー選択ダイアログなど、EIMアプリでよく使われる部品が同梱されています。

## 前提

下記ライブラリに依存するため、使用するプロジェクトでそれぞれ `yarn add` しておく必要があります。

* [react-navigation](https://github.com/react-navigation/react-navigation)
* [native-base](https://github.com/GeekyAnts/NativeBase)
* [react-native-cookies](https://github.com/joeferraro/react-native-cookies)
* [react-native-fs](https://github.com/itinance/react-native-fs)
* [react-native-gesture-handler](https://github.com/kmagiera/react-native-gesture-handler)
* [react-native-keychain](https://github.com/oblador/react-native-keychain)
* [react-native-webview](https://github.com/react-native-community/react-native-webview)
* [react-navigation-redux-helpers](https://github.com/react-navigation/redux-helpers)

また、下記コマンドで Android/iOS に依存関係リンクしてください。

```
yarn react-native link
```

## 使い方

くわしくは、[meimy-starter](https://github.com/rits-ebihara/meimy-starter) を御覧ください。

## 更新履歴

* ver 1.0.11
    * URLから起動する関連の動作の不具合を修正した。

* ver 1.0.10
    * iOS 版での下記不具合を修正した。
        * EIM認証でトークンが取得できずに、EIMのWeb画面が開いてしまう。
        * DocListView コンポーネントが表示できず、アプリが落ちてしまう。

* ver 1.0.9
    * Floating Button に disable を指定できるようにした。

* ver 1.0.8
    * ユーザーバッジをタップしたときに表示されるカードに、メールと MS Teams へのリンクアイコンを追加した。

* ver 1.0.7
    * ```webview``` を警告に従い ```react-native``` にあるものではなく、 ```react-native-webview``` を利用するように変更した。
    	* 現行のプロジェクトで、 package.json の dependencies に "react-native-webview" がない場合は、 ```yarn add react-native-webview``` を実行してください。
    * ライセンスの変更。CC はソフトウェア・ライセンスに合わないため。

* ver 1.0.6
    * 追加機能
        * スリープから復帰したときの接続チェック機能を追加した。
        * 検索画面などに利用するため、文書一覧を非表示にするプロパティを追加した。
    * バグフィックス
        * getGroupDocById の戻りの型が間違っていた

* ver 1.0.5
    * バグフィックス
      * アカウント一覧画面のヘッダの色が、Configが反映されない件を修正した

* ver 1.0.4
    * ライセンスを変更。商用利用不可とするため。
    * showAddButton を廃止。 editable を追加して編集可・不可の機能とした

