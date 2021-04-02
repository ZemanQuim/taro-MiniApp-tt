import React, { Component } from 'react';
import { View, Text, Image } from '@tarojs/components';
import { observer, inject } from 'mobx-react';
import Taro from '@tarojs/taro';
import './index.scss';

@inject('store')
@observer
class Index extends Component {
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {
    const { authStore } = this.props.store;
    authStore.getUserInfo();
  }

  componentDidHide() {}

  //分享
  onShareAppMessage(res) {
    if (res.from === 'button') {
      return {
        channel: 'video', // 必写 video
        templateId: '12kbbinj6h1oib3cad', // 分享的模版 id
        title: '快来猜猜看', // 分享的标题
        desc: '猜片名有奖励', // 分享的内容介绍
        path: `/pages/index/index`, // 分享的路径
        extra: {
          videoTopics: ['片名猜猜猜', '电影猜猜猜'], // 只有抖音才会有的属性
        },
      };
    } else {
      // 右上角分享
      return {
        templateId: '12kbbinj6h1oib3cad', //分享的模版 id
        title: '快来猜猜看', //分享的标题
        desc: '猜片名有奖励', // 分享的内容
        path: `/pages/index/index`, // 分享的路径
      };
    }
  }

  // 登录
  _login = () => {
    const { authStore } = this.props.store;
    Taro.login({
      success: function (res) {
        if (res.code) {
          Taro.getSetting({
            success: async (result) => {
              if (result.authSetting['scope.userInfo'] === true) {
                // 用户已授权
                console.log('用户已授权', res.code);
                await authStore.login({ code: res.code });
                const { isLogin } = authStore;
                isLogin && authStore.getUserInfo();
              } else {
                // 用户未授权
                console.log('用户未授权');
                Taro.reLaunch({
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
  // 签到
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
        content: '您未登录\n请您点击头像登录哦~',
        confirmColor: '#DC0909',
      });
    }
  };
  // 个人中心
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
        content: '您未登录\n请您点击头像登录哦~',
        confirmColor: '#DC0909',
      });
    }
  };
  // 排行榜
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
        content: '您未登录\n请您点击头像登录哦~',
        confirmColor: '#DC0909',
      });
    }
  };
  // 竞猜
  _gameHandle = () => {
    const {
      authStore: { isLogin },
    } = this.props.store;
    if (isLogin) {
      // Taro.reLaunch({
      //   url: '../game_land/index',
      // });
      Taro.navigateTo({
        url: '../game/index',
      });
    } else {
      Taro.showModal({
        title: '提示',
        content: '您未登录\n请您点击头像登录哦~',
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
        {/* 头部 */}
        <View className='at-row'>
          {userinfo.avatarUrl && isLogin ? (
            <View className='avatar'>
              <Image className='avatar' src={userinfo.avatarUrl} />
            </View>
          ) : (
            <View className='avatar' onClick={this._login.bind(this)}>
              <Image
                className='avatar'
                src='https://p2-static.oss-cn-beijing.aliyuncs.com/MiniApp/pmccc/images/user_default.png'
              />
            </View>
          )}

          <View className='at-col'>
            <View className='nickName'>
              {userinfo.nickName && isLogin
                ? userinfo.nickName
                : '未登录(点击头像登录)'}
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

          <View className='signin' onClick={this._signinHandle.bind(this)}>
            签到领积分
          </View>
        </View>
        {/* 个人中心 */}
        <View
          className='personal_center'
          onClick={this._personalHandle.bind(this)}
        >
          <Image
            className='personal'
            src='https://p2-static.oss-cn-beijing.aliyuncs.com/MiniApp/pmccc/images/personal-center.png'
          />
        </View>
        {/* 猜电影 */}
        <View className='quiz-box' onClick={this._gameHandle.bind(this)}>
          <Image
            className='quiz'
            src='https://p2-static.oss-cn-beijing.aliyuncs.com/MiniApp/pmccc/images/quiz_box.png'
          />
        </View>
        {/* 排行榜 */}
        <View
          className='leaderboard-box'
          onClick={this._leaderboardHandle.bind(this)}
        >
          <Image
            className='leaderboard'
            src='https://p2-static.oss-cn-beijing.aliyuncs.com/MiniApp/pmccc/images/leaderboard.png'
          />
        </View>
        {/* 底部 */}
        <View className='game-rule'>
          <View className='title'>
            <Text className='text'>游戏规则</Text>
          </View>
          <View className='content'>
            <View className='rule rule1'>
              1.竞猜玩法：猜对电影奖励10积分，猜错电影扣30积分，查看片名扣100积分，查看电影名和猜对电影记录都会在个人中心里查看；
            </View>
            <View className='rule rule2'>
              2.积分用途：积分用于猜电影片名和查看电影名称，初始积分100分，每日签到奖励100积分，连续签到越多奖励越多；
            </View>
            <View className='rule rule3'>
              3.签到规则：签到即奖励100积分，连续签到中断签到，从头开始计。
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
