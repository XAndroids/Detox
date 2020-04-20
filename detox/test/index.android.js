import example from './src/app';
// import MessageQueue from 'react-native/Libraries/BatchedBridge/MessageQueue'
// MessageQueue.spy(true);

import {
  AppRegistry,
} from 'react-native';

/**
 * Test App组件
 */
class exampleAndroid extends example {

}

AppRegistry.registerComponent('example', () => exampleAndroid);
