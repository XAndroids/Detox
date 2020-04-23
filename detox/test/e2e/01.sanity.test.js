//describe()为Jest全局方法
//创建一个将几个相关测试结合在一块的代码块。
//你可以在文件顶级编写test块，在describe内不是必须的。但是将测试分组管理是非常方便的
//你也可以嵌套describe()块，如果你有测试层级结构
//参考：describe(name, fn)，https://jestjs.io/docs/en/api#describename-fn
describe('Sanity', () => {
  //点击Sanity按钮进入到页面
  beforeEach(async () => {
    await device.reloadReactNative();
    await element(by.text('Sanity')).tap();
  });

  //检查Welcome、Say Hello所有元素都在页面上
  it('should have welcome screen', async () => {
    await expect(element(by.text('Welcome'))).toBeVisible();
    await expect(element(by.text('Say Hello'))).toBeVisible();
    await expect(element(by.text('Say World'))).toBeVisible();
  });

  //点击Say Hello，展示Hello
  it('should show hello screen after tap', async () => {
    await element(by.text('Say Hello')).tap();
    await expect(element(by.text('Hello!!!'))).toBeVisible();
  });

  //点击Say World，展示World
  it('should show world screen after tap', async () => {
    await element(by.text('Say World')).tap();
    await expect(element(by.text('World!!!'))).toBeVisible();
  });
});
