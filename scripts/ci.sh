#!/bin/bash -e

#读入logger.sh脚本，引入run_f函数执行命令
source $(dirname "$0")/logger.sh

#?修改detox的发布版本？
if [ ! -z ${REACT_NATIVE_VERSION} ]; then
  node scripts/change_react_native_version.js "detox/test" ${REACT_NATIVE_VERSION}
fi

#执行lerna bootstrap，安装链接依赖
run_f "lerna bootstrap"

#运行每个package的npm build脚本进行构建，排除detox-demo*项目
run_f "lerna run --ignore detox-demo* build"
#运行每个package的npm test脚本进行自动化测试
run_f "lerna run --ignore detox-demo* test"
