import React, { Component } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import Taro from '@tarojs/taro';
import { AtAvatar } from 'taro-ui';
import './index.scss';

@inject('store')
@observer
class Index extends Component {
  componentWillMount() {
    const { authStore } = this.props.store;
    authStore.getUserInfo();
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  _login = () => {
    const { authStore } = this.props.store;
    Taro.login({
      success: function (res) {
        console.log('login=====>', res);
        if (res.code) {
          authStore.getSetting();
          //   //发起网络请求
          //   Taro.request({
          //     url: 'https://test.com/onLogin',
          //     data: {
          //       code: res.code,
          //     },
          //   });
        } else {
          console.log('登录失败！' + res.errMsg);
        }
      },
    });
  };

  _invite = () => {
    console.log('邀请好友');
  };

  _ruleHandle = () => {
    Taro.navigateTo({
      url: '../game_rule/index',
    });
  };

  _signinHandle = () => {
    Taro.navigateTo({
      url: '../signin/index',
    });
  };
  _personalHandle = () => {
    Taro.navigateTo({
      url: '../personal_center/index',
    });
  };

  _leaderboardHandle = () => {
    Taro.navigateTo({
      url: '../leaderboard/index',
    });
  };
  _gameHandle = () => {
    Taro.navigateTo({
      url: '../game/index',
    });
  };

  render() {
    const {
      authStore: { userinfo },
    } = this.props.store;
    return (
      <View className='index'>
        <View className='at-row'>
          <View className='avatar'>
            <AtAvatar
              circle
              image={
                userinfo.avatarUrl
                  ? userinfo.avatarUrl
                  : 'https://p2-static.oss-cn-beijing.aliyuncs.com/MiniApp/pmccc/images/user_default.png'
              }
            ></AtAvatar>
          </View>
          <View className='at-col'>
            <View className='nickName'>
              {userinfo.nickName ? userinfo.nickName : '游客'}
            </View>
            {userinfo.nickName ? (
              <View className='coin at-row'>
                <View>
                  积分:<Text>120</Text>
                </View>
                <View className='guess-right'>
                  猜对:<Text>120</Text>
                </View>
                <View className='watch'>
                  查看:<Text>120</Text>
                </View>
              </View>
            ) : (
              <View className='coin'>积分：登录后显示</View>
            )}
          </View>
        </View>
        <View className='game-rule' onClick={this._ruleHandle.bind(this)}>
          游戏规则
        </View>
        <View className='quiz-box' onClick={this._gameHandle.bind(this)}>
          <Image
            className='quiz'
            src='https://p2-static.oss-cn-beijing.aliyuncs.com/MiniApp/pmccc/images/quiz.png'
          />
        </View>
        <View
          className='pass-through-box'
          onClick={this._gameHandle.bind(this)}
        >
          <Image
            className='pass-through'
            src='https://p2-static.oss-cn-beijing.aliyuncs.com/MiniApp/pmccc/images/pass-through.png'
          />
        </View>
        <View className='sign-in-box' onClick={this._signinHandle.bind(this)}>
          <Image
            className='sign-in'
            src='https://p2-static.oss-cn-beijing.aliyuncs.com/MiniApp/pmccc/images/sign-in.png'
          />
        </View>
        <View className='at-row at-row__justify--between'>
          <View
            className='leaderboard-box'
            onClick={this._leaderboardHandle.bind(this)}
          >
            <Image
              className='leaderboard'
              src='https://p2-static.oss-cn-beijing.aliyuncs.com/MiniApp/pmccc/images/leaderboard.png'
            />
          </View>
          <View
            className='personal-center-box'
            onClick={this._personalHandle.bind(this)}
          >
            <Image
              className='personal-center'
              src='https://p2-static.oss-cn-beijing.aliyuncs.com/MiniApp/pmccc/images/personal-center.png'
            />
          </View>
        </View>
        {userinfo.nickName ? (
          <View className='invite-btn' onClick={this._invite.bind(this)}>
            <Text className='text'>邀请好友一起猜</Text>
          </View>
        ) : (
          <View className='login-btn' onClick={this._login.bind(this)}>
            <Text className='text'>您还没登录（点击登录）</Text>
          </View>
        )}
      </View>
    );
  }
}

export default Index;
