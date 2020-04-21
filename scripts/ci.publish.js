/* tslint:disable: no-console */
const exec = require('shell-utils').exec;

const {log, logSection, getVersionSafe} = require('./ci.common');

function publishNewVersion(packageVersion) {
  validatePrerequisites();
  projectSetup();
  prePublishToNpm();
  publishToNpm();

  const newVersion = getVersionSafe();
  if (newVersion === packageVersion) {
    log(`Stopping: Lerna\'s completed without upgrading the version - nothing to publish (version is ${newVersion})`);
    return false;
  }

  updateGit(newVersion);
  return true;
}

//验证lerna相关先决条件
function validatePrerequisites() {
  //lerna是否初始化
  const lernaBin = exec.which('lerna');
  if (!lernaBin) {
    throw new Error(`Cannot publish: lerna not installed!`);
  }

  //lerna版本是否大于2.x.x
  const lernaVersion = exec.execSyncRead('lerna --version');
  if (!lernaVersion.startsWith('2.')) {
    throw new Error(`Cannot publish: lerna version isn't 2.x.x (actual version is ${lernaVersion})`);
  }
}

//项目设置，bootstrap，切换master分支
function projectSetup() {
  logSection('Project setup');
  exec.execSync(`lerna bootstrap`);
  exec.execSync(`git checkout master`);
}

function prePublishToNpm() {
  logSection('Prepublish');

  log('Gathering up iOS artifacts...');
  //打包ios组件
  process.chdir('detox');
  const {packageIosSources} = require('../detox/scripts/pack_ios');
  packageIosSources();
  process.chdir('..');
}

function publishToNpm() {
  logSection('Lerna publish');

  const versionType = process.env.RELEASE_VERSION_TYPE;
  const dryRun = process.env.RELEASE_DRY_RUN === "true";
  if (dryRun) {
    log('DRY RUN: Running lerna without publishing');
  }

  //通过lerna发布到npm中
  exec.execSync(`lerna publish --cd-version "${versionType}" --yes --skip-git ${dryRun ? '--skip-npm' : ''}`);
  exec.execSync('git status');
}

function updateGit(newVersion) {
  logSection('Packing changes up onto a git commit');
  exec.execSync(`git add -u`);
  exec.execSync(`git commit -m "Publish ${newVersion} [ci skip]"`);
  exec.execSync(`git tag ${newVersion}`);
  exec.execSync(`git log -1 --date=short --pretty=format:'%h %ad %s %d %cr %an'`);

  const dryRun = process.env.RELEASE_DRY_RUN === "true";
  if (dryRun) {
    log('DRY RUN: not pushing to git');
  } else {
    exec.execSync(`git push deploy master`);
    exec.execSync(`git push --tags deploy master`);
  }
}

module.exports = publishNewVersion;
