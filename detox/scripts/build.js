const fs = require('fs-extra');
const {sh} = require('./utils');

//如果是ios平台，打包iOS包
if (process.platform === 'darwin') {
	const {packageIosSources} = require('./pack_ios');
  packageIosSources();
}

//如果是android平台，打aar包
if (process.argv[2] === "android" || process.argv[3] === "android") {
	console.log("\nBuilding Detox aars");
	const aars = [
		"detox-debug.aar",
		"detox-release.aar"
	];

	//移除旧版本的aar
	aars.forEach(aar => {
		fs.removeSync(aar);
	});

	//打包新版本aar
	sh("./gradlew assembleDebug assembleRelease", {
		cwd: "android",
		stdio: "inherit",
		shell: true
	});

  //将新版本aar移动
	aars.forEach(aar => {
		fs.copySync(`android/detox/build/outputs/aar/${aar}`, aar);
	});
}
