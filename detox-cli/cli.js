#!/usr/bin/env node
const cp = require('child_process');
const path = require('path');
const fs = require('fs');

//获取detox的安装目录
const detoxPath = path.join(process.cwd(), 'node_modules/detox');
//获取detox的package.json目录
const detoxPackageJsonPath = path.join(detoxPath, 'package.json');

if (fs.existsSync(detoxPackageJsonPath)) {
  // { shell: true } option seems to break quoting on windows? Otherwise this would be much simpler.
  if (process.platform === 'win32') {
    const result = cp.spawnSync(
      'cmd',
      ['/c', path.join(process.cwd(), 'node_modules/.bin/detox.cmd')].concat(process.argv.slice(2)),
      { stdio: 'inherit' });
    process.exit(result.status);
  } else {
    //非windows平台执行detox命令
    const result = cp.spawnSync(
      path.join(process.cwd(), 'node_modules/.bin/detox'),
      process.argv.slice(2),
      { stdio: 'inherit' });
    process.exit(result.status);
  }
} else {
  //如果detox的package.json文件不存在，则输出Detox没有安装
  console.log(detoxPackageJsonPath);
  console.log("detox is not installed in this directory");
  process.exit(1);
}
