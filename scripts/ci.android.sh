#!/bin/bash -e
#android ci脚本，完成版本修改、依赖安装、lerna package的构建和自动化测试，android native自动化测试，并输出报告

#接受未经批准的SDK许可
yes | $ANDROID_HOME/tools/bin/sdkmanager --licenses

#读入ci.sh脚本，并执行依次执行
source $(dirname "$0")/ci.sh

#进入到detox/android目录，把Detox目录和detox/android目录亚茹一个虚拟堆栈
pushd detox/android
#执行detox/android项目的gradle test任务
run_f "./gradlew test"
#回退到虚拟堆栈最近的目录Detox
popd

#进入到detox/test目录
pushd detox/test

#解决办法，执行react android issue问题被修复 - react-native:0.55
#复制自定义的release.gradle到react-native/ReactAndroid/目录中
mv node_modules/react-native/ReactAndroid/release.gradle node_modules/react-native/ReactAndroid/release.gradle.bak
cp extras/release.gradle node_modules/react-native/ReactAndroid/

#构建detox/test项目android项目的构建
run_f "npm run build:android"
#执行detox/test项目的detox自动化测试
run_f "npm run e2e:android-ci"

cp coverage/lcov.info coverage/e2e.lcov
# run_f "npm run verify-artifacts:android"
popd
