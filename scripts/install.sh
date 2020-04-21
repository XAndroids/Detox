#!/bin/bash -e
#detox源码安装脚本，安装需要的lerna，react-native-cli，detox-cli组件
npm install -g lerna@2.4.0 >/dev/null 2>&1
npm install -g react-native-cli >/dev/null 2>&1
npm install -g detox-cli >/dev/null 2>&1
gem install xcpretty >/dev/null 2>&1
