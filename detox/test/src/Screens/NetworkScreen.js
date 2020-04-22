import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Platform
} from 'react-native';

// TODO Use 10.0.3.2 for Genymotion
const HOST = Platform.OS === 'ios' ? 'localhost': '10.0.2.2';
/**
 * 网络页面
 */
export default class NetworkScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      greeting: undefined,
    };
  }

  render() {
    //如果有返回网络问题，则显示问候语
    if (this.state.greeting) return this.renderAfterButton();

    //否则返回发起请求按钮
    return (
      <View style={{flex: 1, paddingTop: 20, justifyContent: 'center', alignItems: 'center'}}>

        <TouchableOpacity onPress={this.onNetworkButtonPress.bind(this, 'Short Network Request Working', 100)}>
          <Text testID='ShortNetworkRequest' style={{color: 'blue', marginBottom: 20}}>Short Network Request</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onNetworkButtonPress.bind(this, 'Long Network Request Working', 3000)}>
          <Text testID='LongNetworkRequest' style={{color: 'blue', marginBottom: 20}}>Long Network Request</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderAfterButton() {
    return (
      <View style={{flex: 1, paddingTop: 20, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 25}}>
          {this.state.greeting}!!!
        </Text>
      </View>
    );
  }

  /**
   * 发送网络请求
   * @param greeting  请求参数
   * @param delayMs 请求延迟时间
   * @returns {Promise<void>}
   */
  async onNetworkButtonPress(greeting, delayMs) {
    try {
      //发起网络请求
      let response = await fetch(`http://${HOST}:9001/delay/${delayMs}`);
      let responseJson = await response.json();
      console.log(responseJson.message);

      //网络请求成功后，提示问候语
      this.setState({
        greeting: greeting
      });
    } catch(error) {
      console.error(error);
    }
  }
}
