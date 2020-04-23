describe('StressRoot', () => {
  beforeEach(async () => {
    await device.relaunchApp();
    await element(by.text('Switch Root')).tap();
  });

  //afterAll(fn,timeout)，在这个文件中所有测试运行完毕之后运行的方法；
  //fun:如果funtion返回一个promise或者一个generator，Jest等待这个promise完成再继续执行
  //timeout:指定终止之前需要等待的时间
  //FIXME 这个终止指的是什么终止？？？
  //放在describe块里面，运行在describe的最后。如果希望每个test之后执行，使用afterEach()替代
  //参考：afterAll,https://jestjs.io/docs/en/api#afterallfn-timeout
  afterAll(async () => {
    await device.relaunchApp();
  });

  it('should switch root view controller from RN to native', async () => {
    await element(by.text('Switch to a new native root')).tap();
    await expect(element(by.text('this is a new native root'))).toBeVisible();
  });

  it(':ios: should switch root view controller from RN to RN', async () => {
    await element(by.text('Switch to multiple react roots')).tap();
    await expect(element(by.text('Choose a test'))).toBeVisible();
  });
});
