# EIM モバイルアプリ ツールキット

[![Coverage Status](https://coveralls.io/repos/github/rits-ebihara/meimy/badge.svg)](https://coveralls.io/github/rits-ebihara/meimy)[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Frits-ebihara%2Fmeimy.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Frits-ebihara%2Fmeimy?ref=badge_shield)


## これはなに？

リコーITソリューションズ が提供する PaaS サービス 'EIM' のモバイルアプリケーションを、効率よく作成するためのツールキットです。

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


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Frits-ebihara%2Fmeimy.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Frits-ebihara%2Fmeimy?ref=badge_large)