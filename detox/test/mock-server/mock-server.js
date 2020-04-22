const express = require('express');
const bodyParser = require('body-parser');

/**
 * 网络Mock Server，负责Mock NetScreen的网络请求
 * express入门，参考：https://developer.mozilla.org/zh-CN/docs/Learn/Server-side/Express_Nodejs/Introduction
 */
class Mockserver {
  /**
   * 创建express应用
   */
  constructor() {
    this.app = express();
    this.server = null;
  }

  /**
   * 初始化，打开服务
   */
  init() {
    //Web基本配置
    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(bodyParser.json());
    const port = process.env.PORT || 9001;

    //定义并设置路由
    const router = express.Router();
    router.get('/', (req, res) => {
      res.json({message: 'hello world!'});
    });
    router.route('/delay/:delay')
          .get((req, res) => {
            console.log('Mock server', `GET delayed response, will reply in ${req.params.delay}ms`);
            setTimeout(() => {
              console.log('Mock server', `GET delayed response, responding now`);
              res.json({message: `Response was delayed by ${req.params.delay}ms`});
            }, req.params.delay);
          });
    this.app.use('/', router);

    //设置端口监听
    this.server = this.app.listen(port);
    console.log('Mock server', `Listening on port ${port}`);
  }

  /**
   * 关闭服务
   */
  close() {
    this.server.close();
  }
}

module.exports = Mockserver;
