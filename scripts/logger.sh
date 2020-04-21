#!/bin/bash -e
#定义了执行shell命令，并且输出相关开始结束日志的方法run_f()

#shell命令执行颜色相关配置
lightCyan='\033[1;36m'
green='\033[0;32m'
nocolor='\033[0m'

#定义run_f函数，执行shell命令
run_f () {
  #获取第1个参数
  cmd="${1}"
  name=${cmd//[ ]/_}

  #开始执行日志
  echo "travis_fold:start:$name"
  echo -e "${lightCyan} $cmd ${nocolor}"
  #开始计时
  SECONDS=0

  #执行命令
  ($cmd)

  #结束计时
  duration=$SECONDS
  #结束日志
  echo "travis_fold:end:$name"
  echo -e "${green}\t --> $(($duration / 60)) minutes and $(($duration % 60)) seconds ${nocolor}\n"
}
