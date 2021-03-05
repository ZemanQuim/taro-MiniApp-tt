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
    const { isLogin } = authStore;
    isLogin && authStore.getUserInfo();
  }

  componentDidMount() {
    // const { authStore } = this.props.store;
    // Taro.checkSession({
    //   success: function () {
    //     //session_key 未过期，并且在本生命周期一直有效
    //     console.log('session_key 未过期');
    //   },
    //   fail: function () {
    //     console.log('session_key 已经失效');
    //     Taro.showToast({ title: '登录失效,请重新登录', icon: 'none' });
    //     // session_key 已经失效，需要重新执行登录流程
    //   },
    // });
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  _login = () => {
    const { authStore } = this.props.store;
    const { isLogin } = authStore;
    Taro.login({
      success: function (res) {
        if (res.code) {
          Taro.getSetting({
            success: async (result) => {
              if (result.authSetting['scope.userInfo'] === true) {
                // 用户已授权
                console.log('用户已授权');
                await authStore.login({ code: res.code });
                isLogin && authStore.getUserInfo();
              } else {
                // 用户未授权
                console.log('用户未授权');
                Taro.redirectTo({
                  url: '../login/index',
                });
              }
            },
          });
        } else {
          console.log('登录失败！' + res.errMsg);
        }
      },
    });
  };

  // _invite = () => {
  //   console.log('邀请好友');
  // };

  _ruleHandle = () => {
    Taro.navigateTo({
      url: '../game_rule/index',
    });
  };

  _signinHandle = () => {
    const {
      authStore: { isLogin },
    } = this.props.store;
    if (isLogin) {
      Taro.navigateTo({
        url: '../signin/index',
      });
    } else {
      Taro.showModal({
        title: '提示',
        content: '您未授权登录\n请您确定重新获取授权哦~',
        confirmColor: '#DC0909',
      });
    }
  };
  _personalHandle = () => {
    const {
      authStore: { isLogin },
    } = this.props.store;
    if (isLogin) {
      Taro.navigateTo({
        url: '../personal_center/index',
      });
    } else {
      Taro.showModal({
        title: '提示',
        content: '您未授权登录\n请您确定重新获取授权哦~',
        confirmColor: '#DC0909',
      });
    }
  };

  _leaderboardHandle = () => {
    const {
      authStore: { isLogin },
    } = this.props.store;
    if (isLogin) {
      Taro.navigateTo({
        url: '../leaderboard/index',
      });
    } else {
      Taro.showModal({
        title: '提示',
        content: '您未授权登录\n请您确定重新获取授权哦~',
        confirmColor: '#DC0909',
      });
    }
  };
  _gameHandle = () => {
    const {
      authStore: { isLogin },
    } = this.props.store;
    if (isLogin) {
      Taro.navigateTo({
        url: '../game/index',
      });
    } else {
      Taro.showModal({
        title: '提示',
        content: '您未授权登录\n请您确定重新获取授权哦~',
        confirmColor: '#DC0909',
      });
    }
  };

  render() {
    const {
      authStore: { isLogin, userinfo, point, right_num, see_num },
    } = this.props.store;
    return (
      <View className='index'>
        <View className='at-row'>
          <View className='avatar'>
            <AtAvatar
              circle
              image={
                userinfo.avatarUrl && isLogin
                  ? userinfo.avatarUrl
                  : 'https://p2-static.oss-cn-beijing.aliyuncs.com/MiniApp/pmccc/images/user_default.png'
              }
            ></AtAvatar>
          </View>
          <View className='at-col'>
            <View className='nickName'>
              {userinfo.nickName && isLogin ? userinfo.nickName : '游客'}
            </View>
            {userinfo.nickName && isLogin ? (
              <View className='coin at-row'>
                <View>
                  积分:<Text>{point}</Text>
                </View>
                <View className='guess-right'>
                  猜对:<Text>{right_num}</Text>
                </View>
                <View className='watch'>
                  查看:<Text>{see_num}</Text>
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
        {/* 
          // 闯关模式
        <View
          className='pass-through-box'
          onClick={this._gameHandle.bind(this)}
        >
          <Image
            className='pass-through'
            src='https://p2-static.oss-cn-beijing.aliyuncs.com/MiniApp/pmccc/images/pass-through.png'
          />
        </View> */}
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
        {!isLogin ? (
          <View className='login-btn' onClick={this._login.bind(this)}>
            <Text className='text'>您还没登录（点击登录）</Text>
          </View>
        ) : // <View className='invite-btn' onClick={this._invite.bind(this)}>
        //   <Text className='text'>邀请好友一起猜</Text>
        // </View>
        null}
      </View>
    );
  }
}

export default Index;
