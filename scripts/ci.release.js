/* tslint:disable: no-console */
const exec = require('shell-utils').exec;
const fs = require('fs');
const {log, logSection, getVersionSafe} = require('./ci.common');

const isRelease = (process.env.RELEASE_VERSION_TYPE && process.env.RELEASE_VERSION_TYPE !== 'none');

const ONLY_ON_BRANCH = 'origin/master';

function run() {
	logSection('Script started');
	if (!validateEnv()) {
		return;
	}

	log('Configuring stuff...');
	setupGitConfig();
	setupNpmConfig();
	versionTagAndPublish();
}
//确认是否是有效的环境，CI和分支等
function validateEnv() {
	//检查Jenkins CI环境
	if (!process.env.JENKINS_CI) {
		throw new Error(`Release blocked: Not on a CI build machine!`);
	}

	if (!process.env.JENKINS_MASTER) {
		log(`Release blocked: Not on jenkins' master build job!`);
		return false;
	}

	//检查master分支
	if (process.env.GIT_BRANCH !== ONLY_ON_BRANCH) {
		log(`Release blocked: Not publishing on branch ${process.env.GIT_BRANCH}, which isn't ${ONLY_ON_BRANCH}`);
		return false;
	}

	return true;
}

//设置Git相关配置
function setupGitConfig() {
	exec.execSyncSilent(`git config --global push.default simple`);
	exec.execSyncSilent(`git config --global user.email "${process.env.GIT_EMAIL}"`);
	exec.execSyncSilent(`git config --global user.name "${process.env.GIT_USER}"`);
	const remoteUrl = new RegExp(`https?://(\\S+)`).exec(exec.execSyncRead(`git remote -v`))[1];
	exec.execSyncSilent(`git remote add deploy "https://${process.env.GIT_USER}:${process.env.GIT_TOKEN}@${remoteUrl}"`);
}

//设置Npm相关配置
function setupNpmConfig() {
	exec.execSync(`rm -f package-lock.json`);
	const content = `
email=\${NPM_EMAIL}
//registry.npmjs.org/:_authToken=\${NPM_TOKEN}
`;
	fs.writeFileSync(`.npmrc`, content);

	// Workaround. see https://github.com/lerna/lerna/issues/361
	fs.copyFileSync('.npmrc', 'detox/.npmrc');
	fs.copyFileSync('.npmrc', 'detox-cli/.npmrc');
}

//获取版本tag并且发布
function versionTagAndPublish() {
	logSection('Preparing to tag/release');

	const packageVersion = getVersionSafe();
	log(`    package version: ${packageVersion}`);

	const currentPublished = findCurrentPublishedVersion();
	log(`    current published version: ${currentPublished}`);

	if (isRelease) {
		const publishNewVersion = require('./ci.publish');
		publishNewVersion(packageVersion);
	} else {
		// Disabled for the time being
		// const tagVersion = require('./ci.tagversion');
		// tagVersion(packageVersion, currentPublished);
	}

	log(`Great success, much amaze`);
}

function findCurrentPublishedVersion() {
	return exec.execSyncRead(`npm view detox dist-tags.latest`);
}

run();
