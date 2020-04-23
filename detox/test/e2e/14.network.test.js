const MockServer = require('../mock-server/mock-server');

describe('Network Synchronization', () => {
  //构造初始化mockServer
  let mockServer = new MockServer();

  //FIXME afterAll的funtion不是async，是不等待执行完毕，继续后续运行？？
  beforeAll(() => {
    //case运行之前，启动初始化mock服务
    mockServer.init();
  });

  afterAll(() => {
    //case运行后，关闭mock服务
    mockServer.close();
  });

  beforeEach(async () => {
    //运行每个case之前，reloadRN，并点击Network进入Network页面
    await device.reloadReactNative();
    await element(by.text('Network')).tap();
  });

  it('Sync with short network requests - 100ms', async () => {
    //使用Detox默认的异步检测，发起网络异步请求后，等待网络异步执行完毕后，在做后续检测
    await element(by.id('ShortNetworkRequest')).tap();
    await expect(element(by.text('Short Network Request Working!!!'))).toBeVisible();
  });

  it('Sync with long network requests - 3000ms', async () => {
    //同上
    await element(by.id('LongNetworkRequest')).tap();
    await expect(element(by.text('Long Network Request Working!!!'))).toBeVisible();
  });

  it('disableSynchronization() should disable sync', async () => {
    //主动关闭Detox同步执行，使用waitFor是手动执行异步等待
    await device.disableSynchronization();
    //手动等待页面渲染后，在点击LongNetworkRequest按钮发送网络请求
    await waitFor(element(by.id('LongNetworkRequest'))).toBeVisible().withTimeout(4000);
    await element(by.id('LongNetworkRequest')).tap();
    //发送请求后，按钮消息
    await expect(element(by.text('Long Network Request Working!!!'))).toBeNotVisible();

    //手动等待网络请求返回，并渲染后在执行验证
    await waitFor(element(by.text('Long Network Request Working!!!'))).toBeVisible().withTimeout(4000);
    await expect(element(by.text('Long Network Request Working!!!'))).toBeVisible();

    //执行完case之后，恢复Detox默认同步
    await device.enableSynchronization();
  });


  it('setURLBlacklist() should disable synchronization for given endpoint', async () => {
    //在执行这些URL的请求的时候，等待请求返回后在同步执行后续命令
    const url = device.getPlatform() === 'ios' ? '.*localhost.*' : '.*10.0.2.2.*';
    await device.setURLBlacklist([url]);

    await element(by.id('LongNetworkRequest')).tap();
    await expect(element(by.text('Long Network Request Working!!!'))).toBeNotVisible();
    await waitFor(element(by.text('Long Network Request Working!!!'))).toBeVisible().withTimeout(4000);
    await expect(element(by.text('Long Network Request Working!!!'))).toBeVisible();

    //恢复backList
    await device.setURLBlacklist([]);
  });
});
