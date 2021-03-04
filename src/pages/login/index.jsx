import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { observer, inject } from 'mobx-react';

import './index.scss';

@inject('store')
@observer
class Index extends Component {
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  _login = () => {
    const { authStore } = this.props.store;
    Taro.login({
      success: (res) => {
        if (res.code) {
          //发起网络请求
          authStore.login({ code: res.code });
          //授权
          this.getSetting();
        } else {
          console.log('登录失败！' + res.errMsg);
        }
      },
    });
  };

  getSetting() {
    const { authStore } = this.props.store;
    Taro.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userInfo']) {
          Taro.authorize({
            scope: 'scope.userInfo',
            success: () => {
              Taro.showToast({ title: '登录成功' });
              authStore.getUserInfo();
              Taro.redirectTo({
                url: '../index/index',
              });
            },
            fail: (resp) => {
              console.log('授权失败！', resp);
              Taro.openSetting();
            },
          });
        }
      },
      fail(res) {
        console.log(`getSetting 调用失败`, res);
      },
    });
  }

  render() {
    return (
      <View className='login'>
        <View className='logo-wrap'>
          <Image
            className='logo'
            src='https://p2-static.oss-cn-beijing.aliyuncs.com/MiniApp/pmccc/images/login_movie_logo.png'
          />
        </View>
        <View className='title'>登录需要以下权限</View>
        <View className='info'>获取你的公开信息(昵称、头像等)</View>
        <View className='login-btn' onClick={this._login.bind(this)}>
          授权登录
        </View>
        <View className='protocol'>
          登录代表您已同意<Text className='item'>《用户协议》《用户政策》</Text>
        </View>
      </View>
    );
  }
}

export default Index;
