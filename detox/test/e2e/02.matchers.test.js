describe('Matchers', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await element(by.text('Matchers')).tap();
  });

  it('should match elements by (accessibility) label', async () => {
    await element(by.label('Label')).tap();
    await expect(element(by.text('Label Working!!!'))).toBeVisible();
  });

  it('should match elements by (accessibility) id', async () => {
    await element(by.id('UniqueId345')).tap();
    await expect(element(by.text('ID Working!!!'))).toBeVisible();
  });

  it('should match elements by index', async () => {
    const index = device.getPlatform() === 'ios' ? 2 : 0;
    await element(by.text('Index')).atIndex(index).tap();
    await expect(element(by.text('First button pressed!!!'))).toBeVisible();
  });

  it('should be able to swipe elements matched by index', async () => {
    const index = device.getPlatform() === 'ios' ? 2 : 0;
    await element(by.text('Index')).atIndex(index).swipe('down', 'fast', 0.7); //No need to do here anything, just let it not crash.
  });

  it('should match elements by type (native class)', async () => {
    //根据平台类型native，获取不同的元素
    const byType = device.getPlatform() === 'ios' ? by.type('RCTImageView') : by.type('android.widget.ImageView');

    await expect(element(byType)).toBeVisible();
    await element(byType).tap();
    await expect(element(byType)).toBeNotVisible();
  });

  // https://facebook.github.io/react-native/docs/accessibility.html#accessibilitytraits-ios
  // Accessibility Inspector in the simulator can help investigate traits
  //skip不运行该测试，参考：https://jestjs.io/docs/en/api#describeskipname-fn
  it.skip(':ios: should match elements by accessibility trait', async () => {
    await element(by.traits(['button', 'text'])).tap();
    await expect(element(by.text('Traits Working!!!'))).toBeVisible();
  });

  it('should match elements with ancenstor (parent)', async () => {
    //match id和父id
    await expect(element(by.id('Grandson883').withAncestor(by.id('Son883')))).toExist();
    await expect(element(by.id('Son883').withAncestor(by.id('Grandson883')))).toNotExist();
    await expect(element(by.id('Grandson883').withAncestor(by.id('Father883')))).toExist();
    await expect(element(by.id('Father883').withAncestor(by.id('Grandson883')))).toNotExist();
    await expect(element(by.id('Grandson883').withAncestor(by.id('Grandfather883')))).toExist();
    await expect(element(by.id('Grandfather883').withAncestor(by.id('Grandson883')))).toNotExist();
  });

  it('should match elements with descendant (child)', async () => {
    //match id和子id
    await expect(element(by.id('Son883').withDescendant(by.id('Grandson883')))).toExist();
    await expect(element(by.id('Grandson883').withDescendant(by.id('Son883')))).toNotExist();
    await expect(element(by.id('Father883').withDescendant(by.id('Grandson883')))).toExist();
    await expect(element(by.id('Grandson883').withDescendant(by.id('Father883')))).toNotExist();
    await expect(element(by.id('Grandfather883').withDescendant(by.id('Grandson883')))).toExist();
    await expect(element(by.id('Grandson883').withDescendant(by.id('Grandfather883')))).toNotExist();
  });

  it('should match elements by using two matchers together with and', async () => {
    //多个match
    await expect(element(by.id('UniqueId345').and(by.text('ID')))).toExist();
    await expect(element(by.id('UniqueId345').and(by.text('RandomJunk')))).toNotExist();
    await expect(element(by.id('UniqueId345').and(by.label('RandomJunk')))).toNotExist();
    if (device.getPlatform() === 'ios') {
      await expect(element(by.id('UniqueId345').and(by.traits(['button'])))).toNotExist();
    }
  });

  //it.skip():当你在维护一个很大的试验，有些时候你可能查找一个case由于某种原因中断的测试。如果你想跳过运行这个case，
  //但是你不希望删除这些代码，使用skip()指定一些跳过的测试
  //参考:test.skip，参考：https://jestjs.io/docs/en/api#testname-fn-timeout
  // waiting to upgrade EarlGrey version in order to test this (not supported in our current one)
  it.skip('should choose from multiple elements matching the same matcher using index', async () => {
    //从匹配的view集合中使用atIndex()选择匹配的view
    await expect(element(by.text('Product')).atIndex(2)).toHaveId('ProductId002');
  });
});
